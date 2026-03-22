import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "นโยบายความเป็นส่วนตัว - Raycast",
  description:
    "นโยบายความเป็นส่วนตัวของ Raycast บริการ Canva Pro ราคาพิเศษ อ่านรายละเอียดเกี่ยวกับการเก็บข้อมูล การใช้ข้อมูล และสิทธิ์ความเป็นส่วนตัวของคุณ",
});

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <header className="mb-12">
        <p className="text-violet-400 text-sm font-medium mb-2">
          ประกาศและนโยบาย
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          นโยบายความเป็นส่วนตัว
        </h1>
        <p className="text-gray-400 text-sm">
          ปรับปรุงล่าสุด: 22 มีนาคม 2569
        </p>
      </header>

      <div className="space-y-10 text-gray-300 text-[15px] leading-relaxed">

        {/* Section 1 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            1. ข้อมูลที่เราจัดเก็บ
          </h2>
          <p className="mb-3">
            Raycast (&ldquo;บริการของเรา&rdquo; หรือ &ldquo;เว็บไซต์นี้&rdquo;) ให้ความสำคัญกับความเป็นส่วนตัวของคุณ
            เราจัดเก็บข้อมูลที่จำเป็นสำหรับการให้บริการเท่านั้น ได้แก่:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-white">ข้อมูลบัญชี:</strong> ชื่อ-นามสกุล อีเมล และรหัสผ่านที่เข้ารหัส (bcrypt)
              ที่คุณให้ในขั้นตอนการลงทะเบียน
            </li>
            <li>
              <strong className="text-white">ข้อมูลการชำระเงิน:</strong> บันทึกประวัติการสั่งซื้อและสถานะการชำระเงิน
              ข้อมูลบัตรหรือช่องทางการชำระเงินจัดการผ่านตัวประมวลผลชำระเงินของบุคคลที่สาม (PromptPay / QR Payment)
              เราไม่เก็บข้อมูลบัตรเครดิตของคุณโดยตรง
            </li>
            <li>
              <strong className="text-white">ข้อมูลการใช้งาน:</strong> แพลนที่คุณเลือก รหัสอ้างอิงเพื่อน (referral code)
              และข้อมูลการเข้าใช้งานที่เก็บผ่าน NextAuth.js session
            </li>
            <li>
              <strong className="text-white">ข้อมูลการติดต่อ:</strong> ช่องทาง LINE Official ที่คุณให้ไว้
              เพื่อใช้ในการแจ้งสถานะบริการ
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            2. วัตถุประสงค์ในการใช้ข้อมูล
          </h2>
          <p className="mb-3">เราใช้ข้อมูลของคุณเพื่อ:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>สร้างและจัดการบัญชีผู้ใช้ของคุณ</li>
            <li>ประมวลผลการสมัครแพลน Canva Pro และส่งข้อมูลเข้าใช้งานให้คุณ</li>
            <li>แจ้งสถานะการสั่งซื้อและการต่ออายุบริการผ่านช่องทางที่คุณเลือก</li>
            <li>คำนวณและอัปเดตส่วนลดจากระบบแนะนำเพื่อน (Referral Program)</li>
            <li>ป้องกันการฉ้อโกงและละเมิดข้อกำหนดการใช้งาน</li>
            <li>ตอบข้อซักถามและให้การสนับสนุนลูกค้า</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            3. การป้องกันและความปลอดภัยของข้อมูล
          </h2>
          <p className="mb-3">
            เราใช้มาตรการรักษาความปลอดภัยหลายระดับ:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>การเข้ารหัส HTTPS ทุกการเชื่อมต่อผ่าน TLS 1.2+</li>
            <li>รหัสผ่านถูกเข้ารหัสด้วย bcrypt (cost factor 12)</li>
            <li>ฐานข้อมูล PostgreSQL อยู่ในเครื่องเซิร์ฟเวอร์ที่ควบคุมการเข้าถึงอย่างเข้มงวด</li>
            <li>API keys และ credentials จัดเก็บใน environment variables ไม่เก็บในโค้ด</li>
            <li>ระบบ session ผ่าน NextAuth.js พร้อม CSRF protection ในตัว</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            4. การแบ่งปันข้อมูลกับบุคคลที่สาม
          </h2>
          <p className="mb-3">
            เราไม่ขาย ไม่เช่า และไม่แบ่งปันข้อมูลส่วนบุคคลของคุณกับบุคคลที่สามเพื่อวัตถุประสงค์ทางการตลาด
            ข้อมูลของคุณอาจถูกแบ่งปันในกรณีต่อไปนี้:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-white">ผู้ให้บริการบุคคลที่สาม:</strong> บริการ Canva (ในฐานะผู้ให้บริการหลัก),
              ผู้ให้บริการโฮสติ้ง (Vercel/Supabase), และผู้ให้บริการอีเมล (Resend)
              — ทั้งหมดผูกสัญญาที่กำหนดให้ปกป้องข้อมูลของคุณ
            </li>
            <li>
              <strong className="text-white">การปฏิบัติตามกฎหมาย:</strong> หากกฎหมายกำหนด เช่น คำสั่งศาล
              หรือคำร้องจากหน่วยงานราชการที่มีอำนาจตามกฎหมาย
            </li>
            <li>
              <strong className="text-white">การควบรวมกิจการ:</strong> หาก Raycast ถูกควบรวมหรือซื้อกิจการ
              เราจะแจ้งให้คุณทราบก่อนผ่านอีเมล และข้อมูลของคุณจะยังคงได้รับการคุ้มครองตามนโยบายนี้
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            5. คุกกี้ (Cookies)
          </h2>
          <p className="mb-3">
            เว็บไซต์นี้ใช้คุกกี้เพียงเพื่อการทำงานที่จำเป็น:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-white">next-auth.session-token:</strong> ใช้จัดการสถานะการเข้าสู่ระบบของคุณ
              หมดอายุเมื่อคุณออกจากระบบ
            </li>
            <li>
              <strong className="text-white">Lenis scroll:</strong> ใช้ปรับปรุงประสบการณ์การเลื่อนหน้าเว็บ
              ไม่เก็บข้อมูลส่วนบุคคล
            </li>
          </ul>
          <p className="mt-3">
            เราไม่ใช้คุกกี้ติดตามโฆษณาหรือคุกกี้ของบุคคลที่สาม
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            6. สิทธิ์ของคุณ
          </h2>
          <p className="mb-3">
            ภายใต้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 ของประเทศไทย
            คุณมีสิทธิ์ดังต่อไปนี้:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-white">สิทธิ์ในการเข้าถึง:</strong> ขอดูข้อมูลส่วนบุคคลของคุณที่เราจัดเก็บ
            </li>
            <li>
              <strong className="text-white">สิทธิ์ในการแก้ไข:</strong> ขอแก้ไขข้อมูลที่ไม่ถูกต้อง
            </li>
            <li>
              <strong className="text-white">สิทธิ์ในการลบ:</strong> ขอให้ลบบัญชีและข้อมูลของคุณ
              (เราจะดำเนินการภายใน 30 วัน)
            </li>
            <li>
              <strong className="text-white">สิทธิ์ในการระงับ:</strong> ขอให้ระงับการประมวลผลข้อมูลชั่วคราว
            </li>
            <li>
              <strong className="text-white">สิทธิ์ในการคัดค้าน:</strong> คัดค้านการประมวลผลข้อมูลของคุณ
            </li>
            <li>
              <strong className="text-white">สิทธิ์ในการโอนย้าย:</strong> ขอรับข้อมูลส่วนบุคคลในรูปแบบที่อ่านได้
            </li>
          </ul>
          <p className="mt-3">
            หากต้องการใช้สิทธิ์ใด ๆ กรุณาติดต่อเราผ่าน LINE:{" "}
            <a
              href="https://line.me/R/ti/p/@094tyojf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300"
            >
              @094tyojf
            </a>{" "}
            หรืออีเมล{" "}
            <a href="mailto:contact@raycast.app" className="text-violet-400 hover:text-violet-300">
              contact@raycast.app
            </a>
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            7. การเก็บรักษาและลบข้อมูล
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>ข้อมูลบัญชีจะถูกเก็บรักษาตลอดระยะเวลาที่คุณใช้บริการ</li>
            <li>เมื่อคุณยกเลิกบริการ เราจะลบข้อมูลบัญชีภายใน 30 วัน</li>
            <li>ข้อมูลการชำระเงิน (เฉพาะประวัติการทำรายการ) จะถูกเก็บไว้ 5 ปีตามข้อกำหนดทางบัญชี</li>
            <li>หลังจากนั้น ข้อมูลทั้งหมดจะถูกลบอย่างถาวรจากระบบและสำรองข้อมูล</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            8. ข้อมูลของผู้เยาว์
          </h2>
          <p>
            เว็บไซต์นี้ไม่ได้ออกแบบมาเพื่อผู้ที่มีอายุต่ำกว่า 18 ปี
            และเราไม่เก็บข้อมูลส่วนบุคคลจากผู้เยาว์โดยตั้งใจ
            หากพบว่ามีข้อมูลของผู้เยาว์ถูกเก็บโดยไม่ได้รับความยินยอมจากผู้ปกครอง
            เราจะดำเนินการลบข้อมูลนั้นโดยเร็ว
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            9. การเปลี่ยนแปลงนโยบายนี้
          </h2>
          <p>
            เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว
            หากมีการเปลี่ยนแปลงสำคัญ เราจะแจ้งให้คุณทราบผ่านอีเมลหรือประกาศบนเว็บไซต์
            การใช้บริการต่อไปถือว่าคุณยอมรับนโยบายที่ปรับปรุงแล้ว
          </p>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            10. ติดต่อเรา
          </h2>
          <p className="mb-3">
            หากมีคำถามหรือข้อกังวลเกี่ยวกับนโยบายความเป็นส่วนตัวนี้
            ติดต่อเราได้ที่:
          </p>
          <ul className="list-none space-y-2">
            <li>
              <strong className="text-white">LINE Official:</strong>{" "}
              <a
                href="https://line.me/R/ti/p/@094tyojf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300"
              >
                @094tyojf
              </a>
            </li>
            <li>
              <strong className="text-white">อีเมล:</strong>{" "}
              <a href="mailto:contact@raycast.app" className="text-violet-400 hover:text-violet-300">
                contact@raycast.app
              </a>
            </li>
          </ul>
          <p className="mt-4 text-gray-500 text-sm">
            เจ้าของบริการ: Raycast
            <br />
            ปรับปรุงล่าสุด: 22 มีนาคม 2569
          </p>
        </section>
      </div>
    </main>
  );
}
