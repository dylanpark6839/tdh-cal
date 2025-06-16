export interface AirspaceStyle {
  strokeColor: string;
  fillColor: string;
}

export const airspaceStyles: Record<string, AirspaceStyle> = {
  ADIZ: {
    strokeColor: '#FF0000',
    fillColor: '#FF0000'
  },
  FIR: {
    strokeColor: '#0000FF',
    fillColor: '#0000FF'
  },
  CTA: {
    strokeColor: '#00FF00',
    fillColor: '#00FF00'
  },
  CTR: {
    strokeColor: '#FF0000',
    fillColor: '#FF0000'
  },
  ATZ: {
    strokeColor: '#800080',
    fillColor: '#800080'
  },
  PROHIBITED: {
    strokeColor: '#FF0000',
    fillColor: '#FF0000'
  },
  RESTRICTED: {
    strokeColor: '#FFA500',
    fillColor: '#FFA500'
  },
  DANGER: {
    strokeColor: '#FF4500',
    fillColor: '#FF4500'
  },
  ALERT: {
    strokeColor: '#FFD700',
    fillColor: '#FFD700'
  },
  MOA: {
    strokeColor: '#4B0082',
    fillColor: '#4B0082'
  },
  CATA: {
    strokeColor: '#008080',
    fillColor: '#008080'
  },
  UA: {
    strokeColor: '#2F4F4F',
    fillColor: '#2F4F4F'
  },
  TMA: {
    strokeColor: '#FF1493',
    fillColor: '#FF1493'
  }
}; 