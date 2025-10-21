import { cn } from "@parametric-ai/ui/lib/utils";
import { SearchX } from "lucide-react";

type EmptyBlockProps = React.ComponentProps<"div"> & {
  message?: string;
  title: string;
};

export const EmptyBlock = ({
  message,
  title = "No Data Available",
  className,
}: EmptyBlockProps) => (
  <div
    className={cn("flex flex-col items-center justify-center gap-8", className)}
  >
    <SearchX size={60} />
    <div className="flex flex-col items-center gap-2">
      <h5 className="text-center text-lg md:text-xl">{title}</h5>
      {message && (
        <p className="text-center text-muted-foreground text-xs md:text-sm">
          {message}
        </p>
      )}
    </div>
  </div>
);
