import { Button } from "@parametric-ai/ui/components/button";
import { cn } from "@parametric-ai/ui/lib/utils";
import { Ban, RotateCcw } from "lucide-react";

type ErrorBlockProps = React.ComponentProps<"div"> & {
  message: string;
  handleRetry: () => void;
};

export const ErrorBlock = ({
  message = "Something went wrong",
  handleRetry,
  className,
}: ErrorBlockProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-4 md:gap-8",
      className
    )}
  >
    <Ban className="h-12 w-12 text-destructive md:h-14 md:w-14" />
    <div className="flex flex-col items-center gap-4">
      <p className="text-base md:text-lg">{message}</p>
      <Button onClick={handleRetry}>
        Retry
        <RotateCcw />
      </Button>
    </div>
  </div>
);
