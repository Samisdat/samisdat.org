export const space = {
  0: "0",
  0.5: "0.5rem",
  1: "1rem",
  2: "2rem",
} as const;

export type SpaceToken = (typeof space)[keyof typeof space];
