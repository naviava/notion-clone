"use client";

import { useTheme } from "next-themes";
import EmojiPicker, { Theme } from "emoji-picker-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface IconPickerProps {
  children: React.ReactNode;
  onChange: (icon: string) => void;
  asChild?: boolean;
}

export default function IconPicker({
  children,
  onChange,
  asChild,
}: IconPickerProps) {
  const { resolvedTheme } = useTheme();

  const themeMap = {
    dark: Theme.DARK,
    light: Theme.LIGHT,
  };

  const currentTheme = (resolvedTheme || "light") as keyof typeof themeMap;
  const theme = themeMap[currentTheme];

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent className="shadow-nonw w-full border-none p-0">
        <EmojiPicker
          height={350}
          theme={theme}
          onEmojiClick={(data) => onChange(data.emoji)}
        />
      </PopoverContent>
    </Popover>
  );
}
