import { SidebarProvider } from "@parametric-ai/ui/components/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Header } from "./header";

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <AppSidebar />
    <main className="grid h-svh w-full grid-rows-[auto_1fr]">
      <Header />
      <section className="p-6">{children}</section>
    </main>
  </SidebarProvider>
);
