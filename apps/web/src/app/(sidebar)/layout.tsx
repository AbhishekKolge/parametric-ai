import { SidebarLayout } from "@/components/layout";
import { AuthChecker } from "@/components/layout/auth-checker";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthChecker>
      <SidebarLayout>{children}</SidebarLayout>
    </AuthChecker>
  );
}
