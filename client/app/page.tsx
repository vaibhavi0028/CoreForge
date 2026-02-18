"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MODELS } from "@/lib/api";
import MeshHeroBackground from "@/components/mesh-hero-background";
import {
  Cpu,
  Zap,
  BarChart3,
  Layers,
  Brain,
  AudioLines,
  FlaskConical,
  ArrowRight,
} from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const features = [
  {
    icon: Zap,
    title: "INT8 Quantization",
    desc: "Reduce model size and boost throughput with post-training quantization",
  },
  {
    icon: Cpu,
    title: "CPU Thread Affinity",
    desc: "Pin inference threads to physical cores for deterministic performance",
  },
  {
    icon: BarChart3,
    title: "Deep Profiling",
    desc: "Core-level CPU profiling, memory analysis, and latency breakdowns",
  },
  {
    icon: Layers,
    title: "No GPU Required",
    desc: "Achieve competitive inference speeds on commodity hardware",
  },
];

const categoryIcons: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  CNN: Layers,
  Transformer: Brain,
  Audio: AudioLines,
};

export default function LandingPage() {
  const nextSectionRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── Hero with mesh background ─── */}
      <MeshHeroBackground nextSectionRef={nextSectionRef}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary mb-6 backdrop-blur-sm"
          >
            <Cpu className="h-3.5 w-3.5" /> CPU-Optimized ML Inference
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">CoreForge</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            A high-performance inference engine using ONNX Runtime, INT8
            quantization, and thread affinity tuning — achieving{" "}
            <span className="text-foreground font-semibold">
              2-5x latency reduction
            </span>{" "}
            without GPU dependency.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/benchmark">
              <Button
                size="lg"
                className="gradient-bg border-0 text-primary-foreground gap-2 text-base px-8 hover:opacity-90 transition-all hover:scale-105"
              >
                <FlaskConical className="h-5 w-5" /> Run Benchmark
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-base px-8 hover:scale-105 transition-all backdrop-blur-sm"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </MeshHeroBackground>

      {/* ─── Key Capabilities ─── */}
      <section
        ref={nextSectionRef}
        className="py-20 border-t border-border/50 bg-background"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold text-center mb-14 text-foreground"
          >
            Key Capabilities
          </motion.h2>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={item}>
                <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="pt-6">
                    <div className="gradient-bg p-3 rounded-xl w-fit mb-4">
                      <f.icon className="h-6 w-6 text-foreground" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2 text-foreground">
                      {f.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Supported Models ─── */}
      <section className="py-20 border-t border-border/50 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold text-center mb-4 text-foreground"
          >
            Supported Models
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-center mb-14 max-w-xl mx-auto"
          >
            Benchmark and optimize across CNN, Transformer, and Audio
            architectures
          </motion.p>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {MODELS.map((m) => {
              const Icon = categoryIcons[m.category];
              return (
                <motion.div key={m.name} variants={item}>
                  <Card className="hover:shadow-lg transition-all hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-border/50 group">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center p-2 rounded-md bg-secondary border border-border">
                            <Icon
                              size={20}
                              strokeWidth={2}
                              className="text-foreground"
                            />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {m.category}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                          {m.params}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-lg mb-1 text-foreground group-hover:text-primary transition-colors">
                        {m.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {m.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/50 py-8 bg-background">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>{"© 2026 CoreForge. CPU-Optimized ML Inference Engine."}</p>
        </div>
      </footer>
    </div>
  );
}
