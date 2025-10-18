import { Header } from "./header";

export const ProtectedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <main className="grid h-svh w-full grid-rows-[auto_1fr]">
    <Header />
    <section className="p-6">{children}</section>
  </main>
);
