import { SidebarTrigger } from "@parametric-ai/ui/components/sidebar";
import { AccountAction } from "../account/account-action";

export const Header = () => (
  <header className="flex items-center justify-between px-6 py-4">
    <SidebarTrigger />
    <AccountAction />
  </header>
);
