export interface Recipe {
  filename: string;
  displayName: string;
  name: string;
  device: string;
  version: string;
  isFavorite: boolean;
  
  // Film settings
  DynamicRange: string;
  FilmSimulation: string;
  BlackImageTone: string;
  MonochromaticColor_RG: string;
  
  // Effects
  GrainEffect: string;
  GrainEffectSize: string;
  ChromeEffect: string;
  ColorChromeBlue: string;
  
  // White Balance
  WBShootCond: string;
  WhiteBalance: string;
  WBShiftR: string;
  WBShiftB: string;
  WBColorTemp: string;
  
  // Tone adjustments
  HighlightTone: string;
  ShadowTone: string;
  Color: string;
  Sharpness: string;
  NoisReduction: string;
  Clarity: string;
}

export interface Category {
  name: string;
  recipes: {
    filename: string;
    displayName: string;
  }[];
}