import { AccountAction } from "../account/account-action";
import { Logo } from "./logo";

export const Header = () => (
  <header className="sticky start-0 top-0 z-50 flex items-center justify-between bg-background px-6 py-4">
    <Logo />
    <AccountAction />
  </header>
);
