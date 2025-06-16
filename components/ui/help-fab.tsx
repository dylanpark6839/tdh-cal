"use client";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import React from "react";

export function HelpFAB({ guide }: { guide: React.ReactNode }) {
  return (
    <div style={{
      position: "fixed",
      bottom: 88,
      right: 24,
      zIndex: 1000,
    }}>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline" className="shadow-lg bg-white/90 hover:bg-blue-50">
            <HelpCircle />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="sr-only">사용법 안내</DialogTitle>
          {guide}
        </DialogContent>
      </Dialog>
    </div>
  );
} 