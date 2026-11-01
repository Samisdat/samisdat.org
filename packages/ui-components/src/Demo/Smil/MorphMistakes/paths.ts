export const circlePath = `
  M 150 35
  C 213.5 35 265 86.5 265 150
  C 265 213.5 213.5 265 150 265
  C 86.5 265 35 213.5 35 150
  C 35 86.5 86.5 35 150 35
  Z
`;

export const goodSquarePath = `
  M 60 60
  C 60 60 240 60 240 60
  C 240 60 240 240 240 240
  C 240 240 60 240 60 240
  C 60 240 60 60 60 60
  Z
`;

// Starts at the opposite corner: every point travels through the center.
export const middleSquarePath = `
  M 240 240
  C 240 240 60 240 60 240
  C 60 240 60 60 60 60
  C 60 60 240 60 240 60
  C 240 60 240 240 240 240
  Z
`;

export const badSquarePath = `
  M 60 60
  C 60 60 240 240 240 240
  C 240 240 240 60 240 60
  C 240 60 60 240 60 240
  C 60 240 60 60 60 60
  Z
`;
