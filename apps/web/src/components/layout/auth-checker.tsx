"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { PROTECTED_ROUTES } from "@/utils/const";
import { Loading } from "./loading";

export const AuthChecker = ({ children }: { children: React.ReactNode }) => {
  const session = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isLoading = session.isPending;
  const isLoggedIn = !!session.data?.user;

  // biome-ignore lint/correctness/useExhaustiveDependencies: dependencies are fine
  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn && isProtectedRoute) {
        router.replace("/auth/login");
      } else if (isLoggedIn && isAuthRoute) {
        router.replace("/experiment");
      }
    }
  }, [isLoading, isLoggedIn, isAuthRoute, isProtectedRoute]);

  if (isLoading) {
    return <Loading />;
  }

  if ((!isLoggedIn && isProtectedRoute) || (isLoggedIn && isAuthRoute)) {
    return <Loading />;
  }

  return <>{children}</>;
};
