import { createRouteHandler } from "uploadthing/next";
import { uploadthingRouter } from "@/lib/uploadthing";

const baseUrl =
  process.env.UPLOADTHING_CALLBACK_URL?.replace(/\/$/, "") ||
  process.env.AUTH_URL?.replace(/\/$/, "") ||
  "";
const token =
  process.env.UPLOADTHING_TOKEN ?? process.env.UPLOADTHING_SECRET ?? "";

const { GET, POST } = createRouteHandler({
  router: uploadthingRouter,
  config: {
    // ถ้า auto-detect callback ล้มเหลว (เช่น อยู่หลัง reverse proxy) ให้ชี้ชัด URL ของ /api/uploadthing
    ...(baseUrl ? { callbackUrl: `${baseUrl}/api/uploadthing` } : {}),
    ...(token ? { token } : {}),
  },
});

export { GET, POST };
