"use client";

import { useTheme } from "next-themes";
import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Laptop, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const ThemeToggleButton: FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="switch theme" size="icon" variant="outline">
          <Sun className="w-5 h-5 dark:hidden" />
          <Moon className="w-5 h-5 hidden dark:inline-block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn({
            "bg-accent": theme === "light",
          })}
        >
          <Sun className="mr-1.5 h-5 w-5" />
          <p>Light</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn({
            "bg-accent": theme === "dark",
          })}
        >
          <Moon className="mr-1.5 h-5 w-5" />
          <p>Dark</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={cn({
            "bg-accent": theme === "system",
          })}
        >
          <Laptop className="mr-1.5 h-5 w-5" />
          <p>System</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggleButton;
