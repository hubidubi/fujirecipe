
const lut: Record<string, string> = {
  "Acros": "#464646",
  "Acros G": "#464646",
  "Acros R": "#464646",
  "Acros Ye": "#464646",
  "Astia": "#9999d8",
  "Classic Chrome": "#a9b8c7",
  "Classic Negative": "#ab9a8d",
  "Eterna": "#b2a9a9",
  "Monochrome": "#727272",
  "Monochrome G": "#727272",
  "Monochrome R": "#727272",
  "Monochrome Ye": "#727272",
  "PRO Neg. Hi": "#c3b8b4",
  "PRO Neg. Std": "#c3b8b4",
  "Provia": "#c3d8c5",
  "Velvia": "#d8a3a3",
}

export const getFilmLut = (film: string) => {
  return lut[film] ?? "#000";
}
