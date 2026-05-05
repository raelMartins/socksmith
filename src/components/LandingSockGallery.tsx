"use client";

import { Box, Container, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  SOCK_GALLERY_FILENAMES,
  labelFromFilename,
  sockGallerySrc,
} from "@/lib/landing-gallery-images";

const MotionBox = motion(Box);

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.045, delayChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 380, damping: 28 },
  },
};

function bentoSpan(index: number): { col: number; row: number } {
  if (index % 11 === 0) return { col: 6, row: 2 };
  if (index % 7 === 3) return { col: 5, row: 2 };
  if (index % 5 === 2) return { col: 4, row: 2 };
  return { col: 3, row: 1 };
}

type GalleryCardProps = {
  src: string;
  label: string;
  col: number;
  row: number;
  index: number;
};

function GalleryCard({ src, label, col, row, index }: GalleryCardProps) {
  const borderGlow = useColorModeValue(
    "rgba(17, 17, 17, 0.06)",
    "rgba(255, 255, 255, 0.08)",
  );

  return (
    <MotionBox
      variants={itemVariants}
      style={{
        gridColumn: `span ${col}`,
        gridRow: `span ${row}`,
      }}
      whileHover={{ zIndex: 3 }}
    >
      <MotionBox
        position="relative"
        h="full"
        minH={{ base: row >= 2 ? "220px" : "140px", md: row >= 2 ? "260px" : "160px" }}
        borderRadius="2xl"
        overflow="hidden"
        borderWidth="1px"
        borderColor="glass.border"
        boxShadow="0 16px 40px rgba(15, 23, 42, 0.08)"
        _dark={{ boxShadow: "0 20px 50px rgba(0, 0, 0, 0.45)" }}
        whileHover={{ scale: 1.03, rotateZ: index % 2 === 0 ? 0.4 : -0.35 }}
        transition={{ type: "spring", stiffness: 420, damping: 26 }}
      >
        <Box position="absolute" inset={0} bg="blackAlpha.100" _dark={{ bg: "whiteAlpha.50" }} />
        <Image
          src={src}
          alt={label}
          fill
          sizes="(max-width: 768px) 45vw, 25vw"
          style={{ objectFit: "cover" }}
          priority={index < 4}
        />
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-br, transparent 40%, rgba(255,255,255,0.06) 85%)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-t, rgba(0,0,0,0.65), transparent 55%)"
          pointerEvents="none"
        />
        <Text
          position="absolute"
          left={4}
          right={4}
          bottom={3}
          color="white"
          fontWeight="700"
          fontSize={{ base: "xs", md: "sm" }}
          letterSpacing="-0.02em"
          textShadow="0 2px 14px rgba(0,0,0,0.55)"
          noOfLines={2}
          lineHeight="short"
        >
          {label}
        </Text>
        <Box
          position="absolute"
          inset={0}
          borderRadius="2xl"
          boxShadow={`inset 0 0 0 1px ${borderGlow}`}
          pointerEvents="none"
        />
      </MotionBox>
    </MotionBox>
  );
}

export function LandingSockGallery() {
  const subtitleColor = useColorModeValue("ink.600", "whiteAlpha.700");
  const items = SOCK_GALLERY_FILENAMES.map((filename, index) => {
    const { col, row } = bentoSpan(index);
    return {
      key: filename,
      src: sockGallerySrc(filename),
      label: labelFromFilename(filename),
      col,
      row,
      index,
    };
  });

  return (
    <Box w="full" py={{ base: 4, md: 8 }}>
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        <Box mb={{ base: 8, md: 10 }} textAlign="center" maxW="3xl" mx="auto">
          <Heading
            as="h2"
            fontSize={{ base: "2xl", md: "3xl" }}
            letterSpacing="-0.03em"
            fontWeight="800"
          >
            Shapes you will see in the first drop
          </Heading>
          <Text mt={3} color={subtitleColor} fontSize={{ base: "md", md: "lg" }} lineHeight="tall">
            Plain studio colors, geometric panels, smile motifs, and a few editorial frames—each
            pair is photographed here so you know what the collection feels like before it ships.
          </Text>
        </Box>

        <MotionBox
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="minmax(0, auto)"
          gridAutoFlow="dense"
          gap={{ base: 2.5, md: 3.5 }}
        >
          {items.map((it) => (
            <GalleryCard
              key={it.key}
              src={it.src}
              label={it.label}
              col={it.col}
              row={it.row}
              index={it.index}
            />
          ))}
        </MotionBox>
      </Container>
    </Box>
  );
}
