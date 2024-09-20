"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavProps {
  isCollapsed: boolean;
  links: {
    icon: LucideIcon;
    label?: string;
    onClick?: () => void;
    title: string;
    variant: "default" | "ghost";
  }[];
}

export function Nav({ isCollapsed, links }: NavProps) {
  return (
    <div
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
      data-collapsed={isCollapsed}
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => {
          const Icon = link.icon;
          return (
            <Tooltip delayDuration={0} key={index}>
              <TooltipTrigger asChild>
                <a
                  className={cn(
                    buttonVariants({ size: "sm", variant: link.variant }),
                    "h-9 w-full justify-start",
                    isCollapsed && "h-9 w-9 justify-center",
                    link.variant === "default" &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                  )}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    link.onClick?.();
                  }}
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
              <TooltipContent className="flex items-center gap-4" side="right">
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
