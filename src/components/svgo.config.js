export default {
  multipass: true,
  plugins: [
    "preset-default",
    "convertShapeToPath",
    {
      name: "convertPathData",
      params: { applyTransforms: true, floatPrecision: 3 },
    },
    {
      name: "convertTransform",
      params: { removeUseless: true, collapseIntoOne: true },
    },
    { name: "cleanupNumericValues", params: { floatPrecision: 3 } },
  ],
};
