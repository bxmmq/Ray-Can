import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
      /** รหัสแนะนำเพื่อน (ใช้ในลิงก์ / กรอกตอนสมัคร) */
      referralCode: string;
    };
  }

  interface User {
    role?: string;
    referralCode?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    referralCode: string;
  }
}
