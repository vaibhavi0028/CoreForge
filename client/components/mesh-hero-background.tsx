"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Cpu,
  Zap,
  BarChart3,
  Layers,
  Brain,
  AudioLines,
  FlaskConical,
  Binary,
  CircuitBoard,
  Database,
  HardDrive,
  MemoryStick,
  Network,
  Server,
  Shield,
  Terminal,
  Wifi,
  Gauge,
} from "lucide-react";
const ICON_POOL = [
  Cpu,
  Zap,
  BarChart3,
  Layers,
  Brain,
  AudioLines,
  FlaskConical,
  Binary,
  CircuitBoard,
  Database,
  HardDrive,
  MemoryStick,
  Network,
  Server,
  Shield,
  Terminal,
  Wifi,
  Gauge,
];

const COLS = 18;
const ROWS = 8;
const TILE_SIZE = 80;
const GAP = 2;

interface TileData {
  id: number;
  row: number;
  col: number;
  Icon: React.ComponentType<{ className?: string; size?: number }>;
  hue: number;
}

function generateTiles(): TileData[] {
  const tiles: TileData[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const idx = row * COLS + col;
      tiles.push({
        id: idx,
        row,
        col,
        Icon: ICON_POOL[idx % ICON_POOL.length],
        hue: (idx * 37) % 360,
      });
    }
  }
  return tiles;
}

function MeshTile({
  tile,
  mouseX,
  mouseY,
  scrollProgress,
  containerRef,
}: {
  tile: TileData;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  scrollProgress: ReturnType<typeof useMotionValue<number>>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const tileRef = useRef<HTMLDivElement>(null);
  const [isNear, setIsNear] = useState(false);

  const themeColors = [
    "var(--sidebar-ring)",
    "var(--sidebar-foreground)",
    "var(--muted-foreground)",
    "var(--muted)",
  ];
  const colorBase = themeColors[tile.id % themeColors.length];

  const rotateX = useSpring(0, { stiffness: 200, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 25 });
  const flipProgress = useSpring(0, { stiffness: 150, damping: 20 });

  const cubeZ = useTransform(scrollProgress, [0.05, 0.7], [0, 1]);
  const cubeZSpring = useSpring(cubeZ, { stiffness: 80, damping: 20 });

  const [rectSize, setRectSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (tileRef.current) {
      setRectSize({
        w: tileRef.current.offsetWidth,
        h: tileRef.current.offsetHeight,
      });
    }
  }, []);

  useEffect(() => {
    const unsubX = mouseX.on("change", () => {
      if (!tileRef.current || !containerRef.current) return;
      const rect = tileRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      const tileCenterX = rect.left + rect.width / 2 - containerRect.left;
      const tileCenterY = rect.top + rect.height / 2 - containerRect.top;

      const mx = mouseX.get();
      const my = mouseY.get();

      const dx = mx - tileCenterX;
      const dy = my - tileCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const threshold = 120;

      if (dist < threshold) {
        setIsNear(true);
        const intensity = 1 - dist / threshold;
        rotateX.set((-dy / threshold) * 25 * intensity);
        rotateY.set((dx / threshold) * 25 * intensity);
        if (dist < 60) {
          flipProgress.set(180);
        } else {
          flipProgress.set(0);
        }
      } else {
        setIsNear(false);
        rotateX.set(0);
        rotateY.set(0);
        flipProgress.set(0);
      }
    });

    return () => unsubX();
  }, [mouseX, mouseY, rotateX, rotateY, flipProgress, containerRef]);

  const stagger = (tile.row * COLS + tile.col) / (ROWS * COLS);
  const tileExtrude = useTransform(cubeZSpring, (v) => {
    const delayed = Math.max(0, (v - stagger * 0.5) / (1 - stagger * 0.5));
    return delayed;
  });

  const translateZ = useTransform(tileExtrude, [0, 1], [0, 90 + tile.row * 12]);
  const scaleVal = useTransform(tileExtrude, [0, 0.5, 1], [1, 1.05, 1.15]);

  const cellSize = TILE_SIZE + GAP;

  return (
    <motion.div
      ref={tileRef}
      className="absolute preserve-3d"
      style={{
        width: `calc(${100 / COLS}% - ${GAP}px)`,
        height: `calc(${100 / ROWS}% - ${GAP}px)`,
        left: `${(tile.col * 100) / COLS}%`,
        top: `${(tile.row * 100) / ROWS}%`,
        rotateX,
        rotateY,
        translateZ,
        scale: scaleVal,
        zIndex: isNear ? 10 : 1,
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-lg border border-border/80 flex items-center justify-center backface-hidden"
        style={{
          rotateY: flipProgress,
          background: isNear
            ? `color-mix(in oklch, ${colorBase}, transparent 80%)`
            : "var(--card)",
          backdropFilter: "blur(8px)",
        }}
      />

      <motion.div
        className="absolute inset-0 rounded-lg flex items-center justify-center backface-hidden"
        style={{
          rotateY: useTransform(flipProgress, (v) => v + 180),
          background: `linear-gradient(135deg, 
            color-mix(in oklch, ${colorBase}, white 10%), 
            color-mix(in oklch, ${colorBase}, black 10%))`,
          opacity: 0.9,
          border: `1px solid color-mix(in oklch, ${colorBase}, transparent 70%)`,
        }}
      />

      <motion.div
        className="absolute"
        style={{
          width: useTransform(translateZ, (z) => `${Math.max(0, z)}px`),
          height: TILE_SIZE,
          left: TILE_SIZE,
          top: 0,
          rotateY: 90,
          transformOrigin: "left center",
          background: `color-mix(in oklch, ${colorBase}, black 10%)`,
          opacity: useTransform(tileExtrude, [0, 0.1, 1], [0, 0.6, 0.8]),
        }}
      />
      <motion.div
        className="absolute"
        style={{
          width: TILE_SIZE,
          height: useTransform(translateZ, (z) => `${Math.max(0, z)}px`),
          left: 0,
          top: TILE_SIZE,
          rotateX: -90,
          transformOrigin: "center top",
          background: `color-mix(in oklch, ${colorBase}, black 15%)`,
          opacity: useTransform(tileExtrude, [0, 0.1, 1], [0, 0.6, 0.8]),
        }}
      />
    </motion.div>
  );
}

function FloatingIcon({
  icon: Icon,
  x,
  y,
  delay,
  hue,
}: {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  x: string;
  y: string;
  delay: number;
  hue: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="absolute z-20 cursor-pointer"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, type: "spring" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{
          y: [0, -12, 0],
          rotate: isHovered ? 360 : 0,
        }}
        transition={{
          y: {
            duration: 3 + delay,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 0.8,
            repeat: isHovered ? Infinity : 0,
            ease: "linear",
          },
        }}
      >
        <div
          className="p-3 transition-all duration-300"
          style={{
            transform: isHovered ? "scale(1.4)" : "scale(1)",
          }}
        >
          <Icon
            size={24}
            className={`
                transition-all duration-300
                ${isHovered ? "text-primary" : "text-foreground/60"}
            `}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main mesh hero ─── */
export default function MeshHeroBackground({
  children,
  nextSectionRef,
}: {
  children: React.ReactNode;
  nextSectionRef: React.RefObject<HTMLDivElement | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scrollProgress = useMotionValue(0);
  const [hasScrolledPast, setHasScrolledPast] = useState(false);

  const tiles = useMemo(() => generateTiles(), []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY],
  );

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const progress = Math.max(
        0,
        Math.min(1, -rect.top / (rect.height - windowH * 0.3)),
      );
      scrollProgress.set(progress);

      if (progress > 0.92 && !hasScrolledPast && nextSectionRef?.current) {
        setHasScrolledPast(true);
        nextSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
      if (progress < 0.5) {
        setHasScrolledPast(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollProgress, hasScrolledPast, nextSectionRef]);

  const gridWidth = COLS * (TILE_SIZE + GAP);
  const gridHeight = ROWS * (TILE_SIZE + GAP);

  const floatingIcons = [
    { icon: Cpu, x: "5%", y: "10%", delay: 0.2, hue: 210 },
    { icon: Brain, x: "85%", y: "15%", delay: 0.4, hue: 280 },
    { icon: Zap, x: "10%", y: "65%", delay: 0.6, hue: 45 },
    { icon: Network, x: "90%", y: "60%", delay: 0.8, hue: 160 },
    { icon: CircuitBoard, x: "50%", y: "5%", delay: 1.0, hue: 330 },
    { icon: Database, x: "3%", y: "45%", delay: 1.2, hue: 120 },
    { icon: Shield, x: "92%", y: "45%", delay: 1.4, hue: 0 },
    { icon: Terminal, x: "30%", y: "80%", delay: 0.3, hue: 190 },
    { icon: Server, x: "70%", y: "78%", delay: 0.5, hue: 260 },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative h-[calc(100vh-64px)] overflow-hidden"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-background">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-2xl animate-float opacity-80"
            style={{
              background:
                "radial-gradient(circle, var(--muted), transparent)",
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-float opacity-30"
            style={{
              animationDelay: "2s",
              background:
                "radial-gradient(circle, var(--muted), transparent)",
            }}
          />

          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, var(--muted), transparent)",
            }}
          />
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="pointer-events-auto">
            {floatingIcons.map((fi, i) => (
              <FloatingIcon key={i} {...fi} />
            ))}
          </div>
        </div>
        <div
          ref={containerRef}
          className="absolute inset-0 flex items-center justify-center perspective-1200"
          style={{
            paddingTop: "0px", 
            paddingBottom: "0px",
          }}
          onMouseMove={handleMouseMove}
        >
          <div
            className="relative preserve-3d w-full h-full" 
            style={{ maxWidth: "100vw", maxHeight: "100vh" }}
          >
            {tiles.map((tile) => (
              <MeshTile
                key={tile.id}
                tile={tile}
                mouseX={mouseX}
                mouseY={mouseY}
                scrollProgress={scrollProgress}
                containerRef={containerRef}
              />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="pointer-events-auto">{children}</div>
        </div>
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <span className="text-xs text-muted-foreground tracking-widest uppercase">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-1"
          >
            <motion.div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
