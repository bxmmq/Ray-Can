import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const uploadthingRouter = {
  /**
   * awaitServerData: false → ไคลเอนต์ได้ URL ทันทีหลังอัปโหลดไฟล์ขึ้น storage
   * ไม่ต้องรอ callback onUploadComplete บนเซิร์ฟเวอร์ (กันเคสค้างเมื่อ dev / tunnel / firewall)
   */
  slipUploader: f(
    {
      image: { maxFileSize: "4MB", maxFileCount: 1 },
    },
    { awaitServerData: false }
  ).onUploadComplete(({ file }) => {
    return { url: file.url };
  }),
} satisfies FileRouter;

export type AppFileRouter = typeof uploadthingRouter;
