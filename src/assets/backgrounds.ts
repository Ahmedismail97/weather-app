export const weatherBackgrounds = {
  Clear: 'linear-gradient(to bottom, #87CEEB, #4A90E2)',
  Clouds: 'linear-gradient(to bottom, #7F7FD5, #86A8E7)',
  Rain: 'linear-gradient(to bottom, #4B79A1, #283E51)',
  Snow: 'linear-gradient(to bottom, #E6DADA, #274046)',
  Thunderstorm: 'linear-gradient(to bottom, #373B44, #4286f4)',
  Drizzle: 'linear-gradient(to bottom, #89F7FE, #66A6FF)',
  Mist: 'linear-gradient(to bottom, #606c88, #3f4c6b)',
  'Moderate Rain': 'linear-gradient(to bottom, #4B79A1, #283E51)',
  'Heavy Rain': 'linear-gradient(to bottom, #373B44, #4286f4)',
  'Partly Cloudy': 'linear-gradient(to bottom, #7F7FD5, #86A8E7)',
  default: 'linear-gradient(to bottom, #2C3E50, #3498DB)'
} as const;

export const overlayGradients = {
  dark: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4))',
  light: 'linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.2))'
}; 