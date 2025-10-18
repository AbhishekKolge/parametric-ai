import { SparklesIcon } from "lucide-react";
import Link from "next/link";

export const Logo = () => (
  <Link className="flex items-center gap-2 font-bold text-xl" href="/">
    <SparklesIcon />
    <span>Parametric AI</span>
  </Link>
);
