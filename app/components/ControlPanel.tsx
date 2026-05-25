"use client";

import React from "react";
import { GridConfig } from "../types";

interface ControlPanelProps {
  grid: GridConfig;
  gap: number;
  setGap: (n: number) => void;
  defaultYOffset: number;
  setDefaultYOffset: (n: number) => void;
  defaultVisibleHeight: number;
  setDefaultVisibleHeight: (n: number) => void;
  onPrint: () => void;
  onClearAll: () => void;
}

export default function ControlPanel({
  gap,
  setGap,
}: ControlPanelProps) {
  return (
    <aside className="no-print w-[300px] shrink-0 h-screen overflow-y-auto bg-white border-r border-[var(--border-color)] flex flex-col">
      {/* Header */}
      <div className="px-6 py-8 border-b border-[var(--border-color)] bg-gradient-to-br from-white to-gray-50">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded bg-[var(--red-primary)] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted)]">SKTC Utility</span>
          </div>
          <h1 className="text-base font-bold text-[var(--foreground)] tracking-tight leading-snug font-serif">
            Shri Krishnar Trading Corporation
          </h1>
          <p className="text-xs text-[var(--muted)] font-medium">A4 Image Layout Editor</p>
        </div>
      </div>

      <div className="p-6">
        {/* Configuration */}
        <section className="space-y-5">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted)]">Settings</h3>

          {/* Gap Slider */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-sm font-medium text-gray-700">Cell Spacing</label>
              <span className="text-sm font-bold text-[var(--red-primary)]">{gap}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={24}
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="w-full accent-[var(--red-accent)] h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </section>
      </div>
    </aside>
  );
}
