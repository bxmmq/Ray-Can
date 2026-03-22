-- รีวิวผูกกับคำสั่งซื้อ 1:1 (แทน 1 รีวิวต่อผู้ใช้)
-- รันด้วยตนเองถ้ามีตาราง reviews เดิมในฐานข้อมูลแล้ว `npx prisma db push` ล้มเหลว

-- 1) ยกเลิก unique บน userId
ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS "reviews_userId_key";

-- 2) เพิ่มคอลัมน์ orderId
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "orderId" TEXT;

-- 3) ผูกรีวิวเดิมกับคำสั่งซื้อที่มีสิทธิ์รีวิวของ user คนละ 1 รายการ (รายการเก่าสุด)
UPDATE "reviews" AS r
SET "orderId" = sub.id
FROM (
  SELECT DISTINCT ON (o."userId") o.id, o."userId"
  FROM "orders" AS o
  WHERE o.status IN ('VERIFYING', 'ACTIVE', 'EXPIRED')
  ORDER BY o."userId", o."createdAt" ASC
) AS sub
WHERE sub."userId" = r."userId" AND r."orderId" IS NULL;

-- 4) ลบรีวิวที่ยังหา order ไม่ได้ (ข้อมูลเก่าไม่สอดคล้อง)
DELETE FROM "reviews" WHERE "orderId" IS NULL;

ALTER TABLE "reviews" ALTER COLUMN "orderId" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "reviews_orderId_key" ON "reviews"("orderId");

ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS "reviews_orderId_fkey";
ALTER TABLE "reviews"
  ADD CONSTRAINT "reviews_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "reviews_userId_idx" ON "reviews"("userId");
