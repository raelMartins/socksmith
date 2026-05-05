"use client";

import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import {
  LANDING_BACKGROUND_FILENAMES,
  landingBackgroundSrc,
} from "@/lib/landing-gallery-images";

const MotionBox = motion(Box);

/** Tile count scales with viewport; images cycle from `LANDING_BACKGROUND_FILENAMES`. */
function useTileUrls(): string[] {
  return useMemo(() => {
    const sources = LANDING_BACKGROUND_FILENAMES.map((f) => landingBackgroundSrc(f));
    const target = 36;
    const out: string[] = [];
    for (let i = 0; i < target; i++) {
      out.push(sources[i % sources.length]!);
    }
    return out;
  }, []);
}

export function LandingAnimatedGridBackground() {
  const tileUrls = useTileUrls();

  return (
    <Box
      position="absolute"
      inset={0}
      overflow="hidden"
      zIndex={0}
      pointerEvents="none"
      aria-hidden
    >
      <MotionBox
        position="absolute"
        inset="-12%"
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(148px, 1fr))"
        gap={{ base: "6px", md: "10px" }}
        opacity={0.42}
        filter={{ base: "saturate(1.05)", md: "saturate(1.12) contrast(1.02)" }}
        animate={{ x: [0, -28, 0], y: [0, -22, 0] }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        _dark={{ opacity: 0.38 }}
      >
        {tileUrls.map((url, i) => (
          <MotionBox
            key={`${url}-${i}`}
            borderRadius="lg"
            overflow="hidden"
            aspectRatio="1"
            bgSize="cover"
            bgPos="center"
            style={{ backgroundImage: `url(${url})` }}
            initial={{ opacity: 0.35, scale: 0.97 }}
            animate={{
              opacity: [0.32, 0.55, 0.34],
              scale: [0.98, 1.03, 0.99],
            }}
            transition={{
              duration: 9 + (i % 6) * 1.4,
              repeat: Infinity,
              delay: i * 0.12,
              ease: "easeInOut",
            }}
          />
        ))}
      </MotionBox>
    </Box>
  );
}
