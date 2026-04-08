import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    store?: { id: string; slug: string; name: string } | null;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      store?: { id: string; slug: string; name: string } | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    store?: { id: string; slug: string; name: string } | null;
  }
}
