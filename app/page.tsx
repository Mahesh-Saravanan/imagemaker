"use client";

import React, { useState, useCallback, useRef } from "react";
import { GridConfig, ImageSlot } from "./types";
import ControlPanel from "./components/ControlPanel";
import A4Canvas from "./components/A4Canvas";

function createSlot(): ImageSlot {
  return {
    id: crypto.randomUUID(),
    file: null,
    url: null,
    yOffset: 0,
    visibleHeight: 1370,
    naturalWidth: 0,
    naturalHeight: 0,
    cropTop: 0,
    cropBottom: 100,
  };
}

export default function Home() {
  const [grid] = useState<GridConfig>({ cols: 2, rows: 2 });
  const [gap, setGap] = useState(6);
  const [defaultYOffset, setDefaultYOffset] = useState(0);
  const [defaultVisibleHeight, setDefaultVisibleHeight] = useState(1370);
  
  // Strict 2x2 layout has exactly 4 slots
  const [slots, setSlots] = useState<ImageSlot[]>(() => [
    createSlot(),
    createSlot(),
    createSlot(),
    createSlot(),
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceTargetRef = useRef<string | null>(null);

  const handleUpdateSlot = useCallback((id: string, updates: Partial<ImageSlot>) => {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }, []);

  const handleReplaceSlot = useCallback((id: string) => {
    replaceTargetRef.current = id;
    fileInputRef.current?.click();
  }, []);

  const handleReplaceFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      const targetId = replaceTargetRef.current;
      if (!file || !targetId) return;

      const url = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => {
        setSlots((prev) =>
          prev.map((s) =>
            s.id === targetId
              ? {
                  ...s,
                  file,
                  url,
                  yOffset: 0,
                  cropTop: 0,
                  cropBottom: 100,
                  naturalWidth: img.naturalWidth,
                  naturalHeight: img.naturalHeight,
                }
              : s
          )
        );
      };
      img.src = url;
      e.target.value = "";
      replaceTargetRef.current = null;
    },
    []
  );

  const handleRemoveSlot = useCallback((id: string) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              file: null,
              url: null,
              naturalWidth: 0,
              naturalHeight: 0,
              yOffset: 0,
              cropTop: 0,
              cropBottom: 100,
            }
          : s
      )
    );
  }, []);

  const handleClearAll = useCallback(() => {
    setSlots((prev) =>
      prev.map((s) => ({
        ...s,
        file: null,
        url: null,
        naturalWidth: 0,
        naturalHeight: 0,
        yOffset: 0,
        cropTop: 0,
        cropBottom: 100,
      }))
    );
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="flex min-h-screen overflow-y-auto bg-[var(--surface)] font-sans relative pt-4">
      <ControlPanel
        grid={grid}
        gap={gap}
        setGap={setGap}
        defaultYOffset={defaultYOffset}
        setDefaultYOffset={setDefaultYOffset}
        defaultVisibleHeight={defaultVisibleHeight}
        setDefaultVisibleHeight={setDefaultVisibleHeight}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-auto pt-4">
        {/* Top Right Action Buttons (Hidden in print) */}
        <div className="no-print absolute top-6 right-8 z-50 flex items-center gap-5">
          <button
            onClick={handleClearAll}
            className="text-sm font-semibold text-gray-500 hover:text-[var(--red-accent)] px-2 py-2 transition-colors"
          >
            Clear All Images
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-[var(--red-primary)] hover:bg-[var(--red-hover)] text-white font-bold text-sm rounded-lg px-6 py-2.5 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Preview
          </button>
        </div>

        <A4Canvas
          grid={grid}
          gap={gap}
          slots={slots}
          onUpdateSlot={handleUpdateSlot}
          onReplaceSlot={handleReplaceSlot}
          onRemoveSlot={handleRemoveSlot}
        />
      </div>

      {/* Hidden file input for replace/action controls */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleReplaceFile}
      />
    </div>
  );
}
