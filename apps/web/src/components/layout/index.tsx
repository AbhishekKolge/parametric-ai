import { CreditBanner } from "../banners/credit-banner";
import { Header } from "./header";

export const ProtectedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <main className="grid h-svh w-full grid-rows-[auto_auto_1fr]">
    <Header />
    <CreditBanner />
    <section className="p-6">{children}</section>
  </main>
);
