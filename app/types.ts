export interface ImageSlot {
  id: string;
  file: File | null;
  url: string | null;
  yOffset: number;       // vertical offset of image inside cell (pixels or percent)
  visibleHeight: number; // legacy visible height
  naturalWidth: number;
  naturalHeight: number;
  cropTop: number;       // crop line position from top of cell (0-100%)
  cropBottom: number;    // crop line position from top of cell (0-100%)
}

export interface GridConfig {
  cols: number;
  rows: number;
}
