import { Loader2Icon } from "lucide-react";
import { cn } from "../lib/utils";

type LoadingSwapProps = {
  isLoading: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export function LoadingSwap({
  isLoading,
  children,
  className,
}: LoadingSwapProps) {
  return (
    <>
      <div className={cn("w-full", isLoading ? "hidden" : "block", className)}>
        {children}
      </div>
      <div className={cn("w-full", isLoading ? "block" : "hidden", className)}>
        <Loader2Icon className="mx-auto animate-spin" />
      </div>
    </>
  );
}
