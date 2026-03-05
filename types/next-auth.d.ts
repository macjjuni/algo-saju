import "next-auth";

declare module "next-auth" {
  interface Session {
    idToken?: string;
    backendToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
    backendToken?: string;
  }
}
