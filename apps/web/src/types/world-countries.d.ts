declare module "world-countries" {
  const countries: Array<{
    cca2: string;
    name: { common: string };
    latlng?: [number, number];
    capital?: string[];
  }>;
  export default countries;
}
