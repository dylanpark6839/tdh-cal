import { LayerProps } from "@/types/layer";
import { ctrLayer } from "@/data/airspace/ctr";
import { Feature } from "geojson";

export const ctr: LayerProps = {
  id: "ctr",
  type: "fill",
  source: {
    type: "geojson",
    data: ctrLayer,
  },
  paint: {
    "fill-color": "#FF9800",
    "fill-opacity": 0.2,
  },
  layout: {
    visibility: "visible",
  },
};

export const ctrLine: LayerProps = {
  id: "ctr-line",
  type: "line",
  source: {
    type: "geojson",
    data: ctrLayer,
  },
  paint: {
    "line-color": "#FF9800",
    "line-width": 2,
  },
  layout: {
    visibility: "visible",
  },
};

export const ctrSymbol: LayerProps = {
  id: "ctr-symbol",
  type: "symbol",
  source: {
    type: "geojson",
    data: ctrLayer,
  },
  layout: {
    "text-field": ["get", "name"],
    "text-size": 12,
    "text-offset": [0, 0],
    "text-anchor": "center",
    "text-allow-overlap": false,
    visibility: "visible",
  },
  paint: {
    "text-color": "#FF9800",
    "text-halo-color": "#FFFFFF",
    "text-halo-width": 2,
  },
};

// CTR 레이어 그룹
export const ctrLayers = [ctr, ctrLine, ctrSymbol];

// CTR 클릭 이벤트를 위한 팝업 내용 생성 함수
export const getCTRPopupContent = (feature: Feature) => {
  const properties = feature.properties;
  if (!properties) return "";

  return `
    <div>
      <h3>${properties.name}</h3>
      <p>${properties.description}</p>
      <p>Upper: ${properties.dist_vert_upper_val} ${properties.dist_vert_upper_uom} ${properties.dist_vert_upper_code}</p>
      <p>Lower: ${properties.dist_vert_lower_val} ${properties.dist_vert_lower_uom} ${properties.dist_vert_lower_code}</p>
    </div>
  `;
}; 