'use client';

import { type NormSource, pointerSource, useParallax } from '@samisdat/tools';
import { useMemo, useRef } from 'react';

import { useDemoContext } from '../DemoContext';
import { CirclesView } from './CirclesView';

export const DemoParallaxCircles = () => {
    const ref = useRef<SVGSVGElement | null>(null);
    const setValue = useDemoContext()?.setValue;

    // The pointer drives the parallax as usual; every norm is also mirrored into the code block placeholders
    const source = useMemo<NormSource | undefined>(
        () =>
            setValue
                ? {
                      subscribe: listener => {
                          const el = ref.current;
                          if (!el) return () => {};

                          return pointerSource(el).subscribe(norm => {
                              setValue('normX', norm.x.toFixed(2));
                              setValue('normY', norm.y.toFixed(2));
                              listener(norm);
                          });
                      },
                  }
                : undefined,
        [setValue]
    );

    useParallax(ref, {}, source);

    return <CirclesView ref={ref} />;
};
