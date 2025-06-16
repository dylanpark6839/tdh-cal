import { AnyLayer } from "mapbox-gl";

export type LayerProps = AnyLayer & {
  id: string;
  source: {
    type: "geojson";
    data: any;
  };
  layout?: {
    visibility?: "visible" | "none";
    "text-field"?: any;
    "text-size"?: number;
    "text-offset"?: [number, number];
    "text-anchor"?: string;
    "text-allow-overlap"?: boolean;
  };
  paint?: {
    "fill-color"?: string;
    "fill-opacity"?: number;
    "line-color"?: string;
    "line-width"?: number;
    "text-color"?: string;
    "text-halo-color"?: string;
    "text-halo-width"?: number;
  };
}; 