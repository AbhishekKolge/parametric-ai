"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@parametric-ai/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@parametric-ai/ui/components/dropdown-menu";
import { Skeleton } from "@parametric-ai/ui/components/skeleton";
import { LogOut } from "lucide-react";
import { useDisclosure } from "@/hooks/use-disclosure";
import { authClient } from "@/lib/auth-client";
import { getInitials } from "@/utils/helper";
import { LogoutAlert } from "../alert/logout-alert";

export const AccountAction = () => {
  const logoutAlertDisclosure = useDisclosure({});
  const { data, isPending } = authClient.useSession();

  if (!data?.session) {
    return null;
  }

  if (isPending) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage
              alt={`@${data.user.name}'s profile picture`}
              className="object-cover"
              src={data.user.image || ""}
            />
            <AvatarFallback className="bg-primary text-background text-sm uppercase">
              {getInitials(data.user.name)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="grid gap-1">
            <span>{data.user.name}</span>
            <span className="text-muted-foreground text-xs">
              {data.user.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logoutAlertDisclosure.open}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LogoutAlert {...logoutAlertDisclosure} />
    </>
  );
};
