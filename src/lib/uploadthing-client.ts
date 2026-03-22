import { generateReactHelpers } from "@uploadthing/react";
import type { AppFileRouter } from "@/lib/uploadthing";

/** ใช้บน client — uploadFiles / useUploadThing */
export const { uploadFiles, useUploadThing } = generateReactHelpers<AppFileRouter>();
