"use client";

import React, { useState, useCallback, useRef } from "react";
import { ImageSlot } from "../types";

interface ImageCellProps {
  slot: ImageSlot;
  onUpdate: (id: string, updates: Partial<ImageSlot>) => void;
  onReplace: (id: string) => void;
  onRemove: (id: string) => void;
}

type DragMode = "none" | "pan" | "cropTop" | "cropBottom";

export default function ImageCell({ slot, onUpdate, onReplace, onRemove }: ImageCellProps) {
  const [hovered, setHovered] = useState(false);
  const [dragMode, setDragMode] = useState<DragMode>("none");
  const dragStartY = useRef(0);
  const dragStartVal = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, mode: DragMode) => {
      if (!slot.url) return;
      e.preventDefault();
      e.stopPropagation();
      setDragMode(mode);
      dragStartY.current = e.clientY;

      if (mode === "pan") {
        dragStartVal.current = slot.yOffset;
      } else if (mode === "cropTop") {
        dragStartVal.current = slot.cropTop;
      } else if (mode === "cropBottom") {
        dragStartVal.current = slot.cropBottom;
      }

      const handleMouseMove = (ev: MouseEvent) => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();

        if (mode === "pan") {
          const deltaY = ev.clientY - dragStartY.current;
          // Pan image: change yOffset (vertical offset in pixels)
          onUpdate(slot.id, { yOffset: dragStartVal.current - deltaY });
        } else if (mode === "cropTop") {
          const clientY = ev.clientY;
          const pct = Math.max(0, Math.min(slot.cropBottom - 2, ((clientY - rect.top) / rect.height) * 100));
          onUpdate(slot.id, { cropTop: Math.round(pct * 10) / 10 });
        } else if (mode === "cropBottom") {
          const clientY = ev.clientY;
          const pct = Math.max(slot.cropTop + 2, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
          onUpdate(slot.id, { cropBottom: Math.round(pct * 10) / 10 });
        }
      };

      const handleMouseUp = () => {
        setDragMode("none");
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [slot.id, slot.url, slot.yOffset, slot.cropTop, slot.cropBottom, onUpdate]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        onUpdate(slot.id, {
          file,
          url,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          cropTop: 0,
          cropBottom: 100,
          yOffset: 0,
        });
      };
      img.src = url;
    },
    [slot.id, onUpdate]
  );

  const handleEmptyClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  if (!slot.url) {
    return (
      <div
        onClick={handleEmptyClick}
        className="w-full h-full bg-[#fbfbfb] border border-dashed border-gray-300 print:border-none print:bg-white flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[var(--red-accent)] hover:bg-[var(--red-light)] transition-all duration-200"
      >
        <div className="no-print flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[var(--red-accent)]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-[10px] font-semibold text-gray-500">Click to Add Image</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-white select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { if (dragMode === "none") setHovered(false); }}
    >
      {/* 
        Image container with overflow-hidden is inside the cell.
        Image width: 100% ensures no horizontal cropping.
        Its vertical position is determined by yOffset translation.
      */}
      <div className="absolute inset-0 flex items-start justify-center">
        <img
          src={slot.url}
          alt=""
          draggable={false}
          className="w-full pointer-events-none select-none"
          style={{
            transform: `translateY(-${slot.yOffset}px)`,
          }}
          onMouseDown={(e) => handleMouseDown(e, "pan")}
        />
      </div>

      {/* Invisible layer to capture panning gestures over the entire image area */}
      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => handleMouseDown(e, "pan")}
      />

      {/* ==========================================
         CROP MASK OVERLAYS (Cropped-out areas stay white)
         ========================================== */}
      {/* Top Mask */}
      <div
        className="absolute top-0 left-0 right-0 bg-white z-10 pointer-events-none"
        style={{ height: `${slot.cropTop}%` }}
      />
      {/* Bottom Mask */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-white z-10 pointer-events-none"
        style={{ height: `${100 - slot.cropBottom}%` }}
      />

      {/* Visible Black Border Framing the Active Image Area */}
      <div 
        className="absolute left-0 right-0 border-2 border-black pointer-events-none z-20"
        style={{ 
          top: `${slot.cropTop}%`, 
          bottom: `${100 - slot.cropBottom}%` 
        }} 
      />

      {/* ==========================================
         INTERACTIVE CROP LINES & HANDLES (Hidden in print)
         ========================================== */}
      {/* Top Crop Line */}
      <div
        className="no-print absolute left-0 right-0 h-1.5 bg-[var(--red-accent)] hover:h-2 cursor-ns-resize z-25 group/line"
        style={{ top: `${slot.cropTop}%`, transform: "none" }}
        onMouseDown={(e) => handleMouseDown(e, "cropTop")}
      >
        <div className="absolute left-1/2 top-full -translate-x-1/2 mt-1 bg-[var(--red-accent)] text-white text-[8px] px-1.5 py-0.5 rounded shadow font-bold opacity-0 group-hover/line:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Top Crop: {slot.cropTop.toFixed(0)}%
        </div>
      </div>

      {/* Bottom Crop Line */}
      <div
        className="no-print absolute left-0 right-0 h-1.5 bg-[var(--red-accent)] hover:h-2 cursor-ns-resize z-25 group/line"
        style={{ top: `${slot.cropBottom}%`, transform: "translateY(-100%)" }}
        onMouseDown={(e) => handleMouseDown(e, "cropBottom")}
      >
        <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-1 bg-[var(--red-accent)] text-white text-[8px] px-1.5 py-0.5 rounded shadow font-bold opacity-0 group-hover/line:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Bottom Crop: {slot.cropBottom.toFixed(0)}%
        </div>
      </div>

      {/* Top action bar (Replace/Remove) visible on hover */}
      {hovered && dragMode === "none" && (
        <div className="no-print absolute top-2 right-2 z-30 flex gap-1">
          <button
            onClick={() => onReplace(slot.id)}
            className="bg-black/60 hover:bg-black text-white text-[9px] font-bold px-2 py-1 rounded shadow transition-colors"
          >
            Replace
          </button>
          <button
            onClick={() => onRemove(slot.id)}
            className="bg-[var(--red-primary)] hover:bg-[var(--red-hover)] text-white text-[9px] font-bold px-2 py-1 rounded shadow transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      {/* Status indicator on drag */}
      {dragMode !== "none" && (
        <div className="no-print absolute top-2 left-2 z-30 bg-black/65 text-white text-[9px] font-semibold px-2 py-0.5 rounded backdrop-blur-[2px]">
          {dragMode === "pan" ? "↕ Panning Image" : dragMode === "cropTop" ? "Adjusting Top Crop" : "Adjusting Bottom Crop"}
        </div>
      )}
    </div>
  );
}
