"use client";

import React from "react";
import dynamic from "next/dynamic";

const WtalPanorama = dynamic(
  () =>
    import("@samisdat/wtal-panorama").then((mod) => ({
      default: mod.WtalPanorama,
    })),
  { ssr: false }
);

export function PanoramaWrapper() {
  return <WtalPanorama />;
}
