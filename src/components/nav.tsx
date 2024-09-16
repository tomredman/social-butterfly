"use client";

import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
    onClick?: () => void;
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => {
          const Icon = link.icon;
          return (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    link.onClick?.();
                  }}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "sm" }),
                    "h-9 w-full justify-start",
                    isCollapsed && "h-9 w-9 justify-center",
                    link.variant === "default" &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {!isCollapsed && <span className="ml-2">{link.title}</span>}
                  {!isCollapsed && link.label && (
                    <span
                      className={cn(
                        "ml-auto",
                        link.variant === "default" &&
                          "text-background dark:text-white"
                      )}
                    >
                      {link.label}
                    </span>
                  )}
                </a>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </div>
  );
}
