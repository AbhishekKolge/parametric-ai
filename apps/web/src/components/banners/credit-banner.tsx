"use client";

import { cn } from "@parametric-ai/ui/lib/utils";
import { getTimeInterval } from "@parametric-ai/utils/common/helper";
import { isPast } from "date-fns";
import { authClient } from "@/lib/auth-client";

export const CreditBanner = () => {
  const { data, isPending } = authClient.useSession();

  if (!data?.session || isPending) {
    return null;
  }

  const { credits, creditResetTime } = data.user;

  const hasCredits = !!credits && (!creditResetTime || isPast(creditResetTime));

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-green-600 px-4 py-1 text-center font-medium text-xs sm:text-sm md:text-base",
        {
          "bg-destructive": !hasCredits,
        }
      )}
    >
      {hasCredits
        ? `You have ${credits} credit${credits > 1 ? "s" : ""} remaining.`
        : `You have exhausted your credits. Please wait until ${getTimeInterval(creditResetTime)} to get more credits.`}
    </div>
  );
};
