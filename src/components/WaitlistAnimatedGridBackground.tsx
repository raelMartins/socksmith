"use client";

import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import {
  LANDING_BACKGROUND_FILENAMES,
  landingBackgroundSrc,
} from "@/lib/landing-gallery-images";

const MotionBox = motion(Box);

/** Fixed full-screen tile drift for the waitlist overlay (uses `background_images` only). */
export function WaitlistAnimatedGridBackground() {
  const tileUrls = useMemo(() => {
    const sources = LANDING_BACKGROUND_FILENAMES.map((f) => landingBackgroundSrc(f));
    const out: string[] = [];
    for (let i = 0; i < 32; i++) {
      out.push(sources[i % sources.length]!);
    }
    return out;
  }, []);

  return (
    <Box position="absolute" inset={0} overflow="hidden" zIndex={0} pointerEvents="none" aria-hidden>
      <MotionBox
        position="absolute"
        inset="-10%"
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(130px, 1fr))"
        gap="8px"
        opacity={0.28}
        filter="saturate(1.05) brightness(0.85)"
        animate={{ x: [0, -24, 0], y: [0, -18, 0] }}
        transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
      >
        {tileUrls.map((url, i) => (
          <MotionBox
            key={`${url}-${i}`}
            borderRadius="md"
            overflow="hidden"
            aspectRatio="1"
            bgSize="cover"
            bgPos="center"
            style={{ backgroundImage: `url(${url})` }}
            animate={{
              opacity: [0.25, 0.42, 0.28],
              scale: [0.97, 1.02, 0.99],
            }}
            transition={{
              duration: 8 + (i % 5),
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </MotionBox>
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear(to-br, rgba(8,8,14,0.88), rgba(8,8,14,0.55), rgba(20,10,24,0.75))"
      />
    </Box>
  );
}
