"use client";

import { Box } from "@chakra-ui/react";
import { forceCenter, forceCollide, forceManyBody, forceSimulation } from "d3-force";
import { useLayoutEffect, useRef } from "react";

/** Socksmith red — matches theme `socksmith.red` */
const BRAND_RED_ALPHA = "rgba(232, 23, 15,";

export type PhysicsBubbleFieldProps = {
  labels: readonly string[];
  mode: "single" | "multi";
  selectedSingle?: string;
  selectedMulti?: readonly string[];
  onToggle: (label: string) => void;
  height?: number;
};

type SimNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number | null;
  fy?: number | null;
  r: number;
  hoverLerp: number;
  selectedLerp: number;
};

export function baseBubbleRadius(label: string): number {
  const n = label.length;
  return Math.max(34, Math.min(56, 22 + n * 1.45));
}

function clientToLocal(
  root: HTMLElement,
  clientX: number,
  clientY: number,
): { x: number; y: number } {
  const b = root.getBoundingClientRect();
  return { x: clientX - b.left, y: clientY - b.top };
}

function visualScale(d: SimNode): number {
  const hoverGrow = 0.14 * d.hoverLerp;
  const selGrow = 0.06 * d.selectedLerp;
  return 1 + hoverGrow + selGrow;
}

function effR(d: SimNode): number {
  return d.r * visualScale(d);
}

export function PhysicsBubbleField({
  labels,
  mode,
  selectedSingle,
  selectedMulti,
  onToggle,
  height = 300,
}: PhysicsBubbleFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const elsRef = useRef<Map<string, { outer: HTMLDivElement; inner: HTMLDivElement }>>(new Map());
  const hoveredIdRef = useRef<string | null>(null);
  const draggedIdRef = useRef<string | null>(null);
  const dragMovedRef = useRef(false);
  const pointerDownRef = useRef<{ x: number; y: number; id: string | null } | null>(null);
  const dimsRef = useRef({ w: 400, h: height });
  const isSelectedRef = useRef<(id: string) => boolean>(() => false);
  const onToggleRef = useRef(onToggle);
  onToggleRef.current = onToggle;

  isSelectedRef.current = (id: string) => {
    if (mode === "single") return selectedSingle === id;
    return selectedMulti?.includes(id) ?? false;
  };

  const labelsKey = labels.join("\n");

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || labels.length === 0) return;
    const el = root as HTMLElement;

    const readDims = () => {
      const w = Math.max(200, el.clientWidth);
      const h = Math.max(200, height);
      dimsRef.current = { w, h };
      return { w, h };
    };

    let { w, h } = readDims();

    const nodes: SimNode[] = labels.map((label, i) => {
      const angle = (i / labels.length) * Math.PI * 2 + Math.random() * 0.35;
      const dist = 26 + Math.random() * 48;
      const r = baseBubbleRadius(label);
      return {
        id: label,
        label,
        x: w / 2 + Math.cos(angle) * dist,
        y: h / 2 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.4,
        r,
        hoverLerp: 0,
        selectedLerp: 0,
      };
    });
    nodesRef.current = nodes;

    function forceLerp() {
      const tHover = 0.22;
      const tSel = 0.26;
      for (const d of nodes) {
        const th = hoveredIdRef.current === d.id ? 1 : 0;
        d.hoverLerp += (th - d.hoverLerp) * tHover;
        const ts = isSelectedRef.current(d.id) ? 1 : 0;
        d.selectedLerp += (ts - d.selectedLerp) * tSel;
        d.hoverLerp = Math.max(0, Math.min(1, d.hoverLerp));
        d.selectedLerp = Math.max(0, Math.min(1, d.selectedLerp));
      }
    }

    const collide = forceCollide<SimNode>()
      .iterations(8)
      .radius((d) => effR(d));

    const simulation = forceSimulation<SimNode>(nodes)
      .velocityDecay(0.86)
      .force("lerp", forceLerp as never)
      .force("charge", forceManyBody<SimNode>().strength(-32))
      .force("center", forceCenter(w / 2, h / 2))
      .force("collide", collide)
      .alphaDecay(0.02)
      .alphaMin(0.032)
      .alphaTarget(0.1)
      .on("tick", () => {
        const { w: cw, h: ch } = dimsRef.current;
        const pad = 1.5;

        function clampAll() {
          for (const d of nodes) {
            const er = effR(d);
            const minX = er + pad;
            const maxX = cw - er - pad;
            const minY = er + pad;
            const maxY = ch - er - pad;
            if (d.fx != null) {
              d.fx = Math.max(minX, Math.min(maxX, d.fx));
              d.fy = Math.max(minY, Math.min(maxY, d.fy ?? 0));
              d.x = d.fx;
              d.y = d.fy ?? 0;
            } else {
              d.x = Math.max(minX, Math.min(maxX, d.x ?? 0));
              d.y = Math.max(minY, Math.min(maxY, d.y ?? 0));
            }
          }
        }

        /** Extra separation so radii never overlap, including expanded hover/selection */
        function resolveOverlaps(iterations: number) {
          for (let k = 0; k < iterations; k++) {
            for (let i = 0; i < nodes.length; i++) {
              for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i]!;
                const b = nodes[j]!;
                const ra = effR(a);
                const rb = effR(b);
                let dx = (b.x ?? 0) - (a.x ?? 0);
                let dy = (b.y ?? 0) - (a.y ?? 0);
                let dist = Math.hypot(dx, dy);
                const minDist = ra + rb + 1;
                if (dist >= minDist || dist < 1e-8) continue;
                if (dist < 1e-8) {
                  dx = 0.02;
                  dy = 0;
                  dist = 0.02;
                }
                const nx = dx / dist;
                const ny = dy / dist;
                const push = (minDist - dist) * 0.55;
                const aPin = a.fx != null;
                const bPin = b.fx != null;
                if (!aPin && !bPin) {
                  a.x! -= nx * push;
                  a.y! -= ny * push;
                  b.x! += nx * push;
                  b.y! += ny * push;
                } else if (!aPin) {
                  a.x! -= nx * push * 2;
                  a.y! -= ny * push * 2;
                } else if (!bPin) {
                  b.x! += nx * push * 2;
                  b.y! += ny * push * 2;
                }
              }
            }
            clampAll();
          }
        }

        clampAll();
        resolveOverlaps(2);

        for (const d of nodes) {
          const pair = elsRef.current.get(d.id);
          if (!pair) continue;
          const { outer, inner } = pair;
          const x = d.x ?? 0;
          const y = d.y ?? 0;
          const vs = visualScale(d);
          const side = 2 * d.r * vs;
          outer.style.width = `${side}px`;
          outer.style.height = `${side}px`;
          outer.style.transform = `translate3d(${x - d.r * vs}px, ${y - d.r * vs}px, 0)`;

          const hov = d.hoverLerp;
          const sel = d.selectedLerp;
          const ring = Math.max(hov, sel);
          if (ring > 0.04) {
            const alpha = 0.42 + 0.48 * ring;
            inner.style.boxShadow = `0 0 0 2px ${BRAND_RED_ALPHA}${alpha}), inset 0 0 0 1px rgba(255,255,255,${0.14 * (1 - ring * 0.85)})`;
          } else {
            inner.style.boxShadow = "inset 0 0 0 1px rgba(255,255,255,0.22)";
          }
          inner.style.background =
            sel > 0.2
              ? `rgba(232, 23, 15, ${0.06 + 0.1 * sel})`
              : "rgba(255,255,255,0.06)";
        }
      });

    for (const d of nodes) {
      const pair = elsRef.current.get(d.id);
      if (pair) {
        const { outer, inner } = pair;
        const vs = visualScale(d);
        const side = 2 * d.r * vs;
        outer.style.width = `${side}px`;
        outer.style.height = `${side}px`;
        outer.style.transform = `translate3d(${d.x! - d.r * vs}px, ${d.y! - d.r * vs}px, 0)`;
        inner.style.boxShadow = "inset 0 0 0 1px rgba(255,255,255,0.22)";
        inner.style.background = "rgba(255,255,255,0.06)";
      }
    }

    simulation.alpha(1).restart();

    function hitTest(px: number, py: number): SimNode | null {
      for (let i = nodes.length - 1; i >= 0; i--) {
        const d = nodes[i]!;
        const er = effR(d);
        const dx = px - (d.x ?? 0);
        const dy = py - (d.y ?? 0);
        if (dx * dx + dy * dy <= er * er) return d;
      }
      return null;
    }

    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0) return;
      const { x, y } = clientToLocal(el, e.clientX, e.clientY);
      const hit = hitTest(x, y);
      pointerDownRef.current = { x, y, id: hit?.id ?? null };
      dragMovedRef.current = false;
      if (hit) {
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
    }

    function onPointerMove(e: PointerEvent) {
      const { x, y } = clientToLocal(el, e.clientX, e.clientY);
      if (!draggedIdRef.current) {
        hoveredIdRef.current = hitTest(x, y)?.id ?? null;
      }
      const down = pointerDownRef.current;
      if (down?.id && !draggedIdRef.current) {
        const dx = x - down.x;
        const dy = y - down.y;
        if (dx * dx + dy * dy > 64) {
          dragMovedRef.current = true;
          draggedIdRef.current = down.id;
          const d = nodes.find((n) => n.id === down.id);
          if (d) {
            const { w: cw, h: ch } = dimsRef.current;
            const er = effR(d);
            const pad = 1.5;
            d.fx = Math.max(er + pad, Math.min(cw - er - pad, x));
            d.fy = Math.max(er + pad, Math.min(ch - er - pad, y));
          }
          simulation.alphaTarget(0.38);
        }
      }
      if (draggedIdRef.current) {
        const d = nodes.find((n) => n.id === draggedIdRef.current);
        if (d) {
          const { w: cw, h: ch } = dimsRef.current;
          const er = effR(d);
          const pad = 1.5;
          d.fx = Math.max(er + pad, Math.min(cw - er - pad, x));
          d.fy = Math.max(er + pad, Math.min(ch - er - pad, y));
        }
      }
    }

    function onPointerUp(e: PointerEvent) {
      const { x, y } = clientToLocal(el, e.clientX, e.clientY);
      const down = pointerDownRef.current;
      if (draggedIdRef.current) {
        const d = nodes.find((n) => n.id === draggedIdRef.current);
        if (d) {
          d.fx = null;
          d.fy = null;
        }
        draggedIdRef.current = null;
        simulation.alphaTarget(0.1);
      } else if (down?.id && !dragMovedRef.current) {
        const hit = hitTest(x, y);
        if (hit && hit.id === down.id) {
          onToggleRef.current(hit.id);
        }
      }
      pointerDownRef.current = null;
      dragMovedRef.current = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }

    function onPointerLeave() {
      if (!draggedIdRef.current) hoveredIdRef.current = null;
    }

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("pointerleave", onPointerLeave);

    const ro = new ResizeObserver(() => {
      const next = readDims();
      w = next.w;
      h = next.h;
      simulation.force("center", forceCenter(w / 2, h / 2));
      simulation.alpha(0.22).restart();
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("pointerleave", onPointerLeave);
      simulation.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- labelsKey encodes labels; avoid sim restart every render
  }, [labelsKey, height, mode]);

  return (
    <Box
      ref={rootRef}
      position="relative"
      w="100%"
      h={`${height}px`}
      overflow="hidden"
      borderRadius="2xl"
      bg="rgba(255,255,255,0.06)"
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      _dark={{ bg: "rgba(0,0,0,0.25)", borderColor: "whiteAlpha.200" }}
      sx={{ touchAction: "none", userSelect: "none" }}
    >
      {labels.map((label) => {
        const r = baseBubbleRadius(label);
        const fs = Math.max(8.5, Math.min(11.5, 120 / Math.max(8, label.length)));
        return (
          <div
            key={label}
            ref={(outer) => {
              if (!outer) {
                elsRef.current.delete(label);
                return;
              }
              const inner = outer.firstElementChild as HTMLDivElement | null;
              if (inner) elsRef.current.set(label, { outer, inner });
            }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 2 * r,
              height: 2 * r,
              willChange: "transform, width, height",
              pointerEvents: "none",
            }}
          >
            <div
              data-bubble-inner
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 8px",
                boxSizing: "border-box",
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: `${fs}px`,
                  lineHeight: 1.2,
                  color: "rgba(255,255,255,0.95)",
                  wordBreak: "break-word",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  pointerEvents: "none",
                }}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </Box>
  );
}
