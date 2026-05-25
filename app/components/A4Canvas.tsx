"use client";

import React from "react";
import { GridConfig, ImageSlot } from "../types";
import ImageCell from "./ImageCell";

interface A4CanvasProps {
  grid: GridConfig;
  gap: number;
  slots: ImageSlot[];
  onUpdateSlot: (id: string, updates: Partial<ImageSlot>) => void;
  onReplaceSlot: (id: string) => void;
  onRemoveSlot: (id: string) => void;
}

export default function A4Canvas({
  gap,
  slots,
  onUpdateSlot,
  onReplaceSlot,
  onRemoveSlot,
}: A4CanvasProps) {
  return (
    <main className="flex-1 flex items-center justify-center p-6 overflow-y-auto bg-[#f3f4f6]">
      {/* 
        A4 container represents the physical page. 
        It has standard A4 aspect ratio.
        No header, no footer, no company text, only the image grid.
      */}
      <div
        className="print-canvas a4-container bg-white w-full max-w-[595px] overflow-hidden"
        style={{
          boxShadow: "0 10px 30px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.02)",
          border: "1px solid #e5e7eb",
          padding: `${gap}px`,
        }}
      >
        <div
          className="w-full h-full grid"
          style={{
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: `${gap}px`,
          }}
        >
          {slots.map((slot) => (
            <ImageCell
              key={slot.id}
              slot={slot}
              onUpdate={onUpdateSlot}
              onReplace={onReplaceSlot}
              onRemove={onRemoveSlot}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
