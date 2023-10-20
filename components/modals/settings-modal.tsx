"use client";

import { useSettings } from "@/hooks/use-settings";

import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

export default function SettingsModal() {
  const settings = useSettings();

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">Settings</h2>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Appearance</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Choose your preferred theme
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
}