import { cn } from "@parametric-ai/ui/lib/utils";
import { SearchX } from "lucide-react";

type EmptyBlockProps = React.ComponentProps<"div"> & {
  message: string;
};

export const EmptyBlock = ({
  message = "No Data Available",
  className,
}: EmptyBlockProps) => (
  <div
    className={cn("flex flex-col items-center justify-center gap-8", className)}
  >
    <SearchX size={60} />
    <p className="text-lg">{message}</p>
  </div>
);
