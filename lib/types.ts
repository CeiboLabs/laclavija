export type GuitarType = "electric" | "acoustic" | "classical" | "bass";
export type GuitarStatus = "available" | "reserved" | "sold";
export type ProductCategory = "guitar" | "amp" | "accessory";

export type GuitarSpecs = {
  body_wood?: string;
  neck_wood?: string;
  fretboard?: string;
  pickups?: string;
  scale_length?: string;
  finish?: string;
  weight_kg?: number;
  case?: string;
  serial?: string;
  condition?: string;
  accessories?: string[];
  // Amp-specific (opcionales, todos amp usa specs libres)
  watts?: number;
  amp_type?: string; // valvular / estado solido / hibrido
  channels?: number;
  speaker?: string;
  [key: string]: unknown;
};

export type Guitar = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number | null;
  category: ProductCategory;
  type: GuitarType | null;
  price_usd: number | null;
  price_uyu: number | null;
  discount_percent: number | null;
  status: GuitarStatus;
  featured: boolean;
  short_description: string;
  long_description: string;
  specs: GuitarSpecs;
  images: string[];
  created_at: string;
};
