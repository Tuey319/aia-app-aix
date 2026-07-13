// SVGs stay in Metro's assetExts (see metro.config.js) — require('x.svg')
// returns an asset module id rendered via expo-image, not a React component.
declare module '*.svg' {
  const assetId: number;
  export default assetId;
}
