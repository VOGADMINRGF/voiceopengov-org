import { useEffect, useRef, useState } from "react";
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from "d3-zoom";
import { select } from "d3-selection";

type UseSvgZoomOptions = {
  minZoom?: number;
  maxZoom?: number;
};

export function useSvgZoom({ minZoom = 1, maxZoom = 6 }: UseSvgZoomOptions = {}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [transform, setTransform] = useState<ZoomTransform>(zoomIdentity);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([minZoom, maxZoom])
      .on("zoom", (event) => {
        setTransform(event.transform);
      });

    zoomRef.current = zoomBehavior;
    const selection = select(svg);
    selection.call(zoomBehavior as any);

    return () => {
      selection.on(".zoom", null);
    };
  }, [minZoom, maxZoom]);

  const reset = () => {
    const svg = svgRef.current;
    const zoomBehavior = zoomRef.current;
    if (!svg || !zoomBehavior) return;
    select(svg)
      .transition()
      .duration(250)
      .call(zoomBehavior.transform as any, zoomIdentity);
  };

  return { svgRef, transform, reset };
}
