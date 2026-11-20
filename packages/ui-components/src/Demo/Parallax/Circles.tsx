'use client';

import { type NormSource, pointerSource, useParallax } from '@samisdat/tools';
import { useMemo, useRef } from 'react';

import { useDemoContext } from '../DemoContext';
import { CirclesView } from './CirclesView';

type DemoParallaxCirclesProps = {
    /** Drives the demo instead of the pointer on the svg. */
    source?: NormSource;
};

export const DemoParallaxCircles = ({ source: external }: DemoParallaxCirclesProps = {}) => {
    const ref = useRef<SVGSVGElement | null>(null);
    const setValue = useDemoContext()?.setValue;

    // The pointer (or the given source) drives the parallax; every norm is also mirrored into the code block placeholders
    const source = useMemo<NormSource | undefined>(
        () =>
            setValue
                ? {
                      subscribe: listener => {
                          const el = ref.current;
                          if (!el) return () => {};

                          return (external ?? pointerSource(el)).subscribe(norm => {
                              setValue('normX', norm.x.toFixed(2));
                              setValue('normY', norm.y.toFixed(2));
                              listener(norm);
                          });
                      },
                  }
                : external,
        [setValue, external]
    );

    useParallax(ref, {}, source);

    return <CirclesView ref={ref} />;
};
