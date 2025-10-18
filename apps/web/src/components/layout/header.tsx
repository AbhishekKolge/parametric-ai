import { AccountAction } from "../account/account-action";
import { Logo } from "./logo";

export const Header = () => (
  <header className="flex items-center justify-between px-6 py-4">
    <Logo />
    <AccountAction />
  </header>
);
