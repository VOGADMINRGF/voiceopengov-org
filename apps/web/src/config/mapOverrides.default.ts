export type MapCountryFill = {
  mode: "gradient" | "solid";
  from?: string;
  to?: string;
  color?: string;
  intensity?: number;
};

export type MapPoint = {
  city?: string;
  country?: string;
  lat: number;
  lng: number;
  count?: number;
};

export type MapOverrides = {
  countryFills: Record<string, MapCountryFill>;
  start: { city: string };
  manualPoints: MapPoint[];
};

export const mapOverridesDefault: MapOverrides = {
  countryFills: {
    DE: { mode: "gradient", from: "#06b6d4", to: "#2563eb", intensity: 1 },
  },
  start: { city: "Berlin" },
  manualPoints: [],
};
