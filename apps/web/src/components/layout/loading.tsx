import { Loader2 } from "lucide-react";

type LoadingProps = {
  message?: string;
};

export const Loading = ({
  message = "Building your experience...",
}: LoadingProps) => (
  <main className="grid h-svh w-full place-content-center">
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 className="stroke-primary motion-safe:animate-spin" size={50} />
      <span className="capitalize">{message}</span>
    </div>
  </main>
);
