# c3 color naming model

`c3_data.json` is the color naming model of the c3 library (Heer & Stone, "Color Naming Models for Color Selection, Image Editing and Palette Design", CHI 2012), built from the XKCD color survey.

- Source: <https://github.com/StanfordHCI/c3>, `data/xkcd/c3_data.json`, commit `d3576c7615ab0d6b2d81252a362599a9fd900d63` (last upstream commit, 2011-12-21). Copied unchanged.
- License: BSD 3-Clause, Copyright (c) 2011 Stanford University, see `LICENSE` (upstream file, unchanged). Redistribution in source form must keep that notice, which is why the file lives next to the data.
- Format: `color` (flat L, a, b per grid cell, 8325 cells, CIELAB D65), `terms` (153 names), `T` (flat list of cell × term index and count pairs), `A` (term association matrix, unused here).
- Used by `scripts/name-model.ts` and `scripts/name-distance.ts`. Not shipped anywhere else.
