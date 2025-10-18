import { AuthChecker } from "@/components/layout/auth-checker";
import { AuthLayout } from "@/modules/auth/components/layout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthChecker>
      <AuthLayout>{children}</AuthLayout>
    </AuthChecker>
  );
}
