"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import * as React from "react";

interface AccountSwitcherProps {
  accounts: {
    handle: string;
    icon: React.ReactNode;
    label: string;
  }[];
  isCollapsed: boolean;
}

export function AccountSwitcher({
  accounts,
  isCollapsed,
}: AccountSwitcherProps) {
  const [selectedAccount, setSelectedAccount] = React.useState<string>(
    accounts[0].handle
  );

  return (
    <Select defaultValue={selectedAccount} onValueChange={setSelectedAccount}>
      <SelectTrigger
        aria-label="Select account"
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
        )}
      >
        {/* <SelectValue placeholder="Select an account">
          {accounts.find((account) => account.handle === selectedAccount)?.icon}
          <span className={cn("ml-2", isCollapsed && "hidden")}>
            {
              accounts.find((account) => account.handle === selectedAccount)
                ?.label
            }
          </span>
        </SelectValue> */}
      </SelectTrigger>
      <SelectContent>
        {/* {accounts.map((account, index) => (
          <SelectItem key={index} value={account.handle}>
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              {account.icon}
              {account.handle}
            </div>
          </SelectItem>
        ))} */}
      </SelectContent>
    </Select>
  );
}
