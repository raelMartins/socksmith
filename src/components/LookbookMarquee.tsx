"use client";

import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import { sockGallerySrc } from "@/lib/landing-gallery-images";

export type LookbookCard = {
  src: string;
  alt: string;
  caption: string;
  brandMark?: boolean;
};

const DEFAULT_CARDS: LookbookCard[] = [
  {
    src: sockGallerySrc("Plain Blue.jpg"),
    alt: "Blue socks on court",
    caption: "Sock essentials for every occasion.",
    brandMark: true,
  },
  {
    src: sockGallerySrc("Smile.jpg"),
    alt: "Minimal white socks",
    caption: "Comfort style.",
    brandMark: true,
  },
  {
    src: sockGallerySrc("Plain on Rubble Blue.jpg"),
    alt: "Textured socks outdoors",
    caption: "Quality that stands the test of time.",
    brandMark: true,
  },
  {
    src: sockGallerySrc("Plain Pink.jpg"),
    alt: "Soft pink socks",
    caption: "Soft never looked so bold.",
  },
  {
    src: sockGallerySrc("Cover Face.jpg"),
    alt: "Graphic sock campaign",
    caption: "Just socks, they said.",
  },
  {
    src: sockGallerySrc("Plain Green.jpg"),
    alt: "Green socks lifestyle",
    caption: "Cosy is always in season.",
    brandMark: true,
  },
  {
    src: sockGallerySrc("Smile Pink.jpg"),
    alt: "Pink smile socks",
    caption: "Colour with a point of view.",
  },
  {
    src: sockGallerySrc("Plain Orange.jpg"),
    alt: "Orange socks detail",
    caption: "Everyday pairs, studio-made.",
    brandMark: true,
  },
];

type LookbookMarqueeProps = {
  cards?: LookbookCard[];
  /** Seconds for one full loop of the track. Higher = slower. */
  durationSec?: number;
};

function LookbookCardItem({
  card,
  cardShadow,
}: {
  card: LookbookCard;
  cardShadow: string;
}) {
  return (
    <Box
      position="relative"
      flexShrink={0}
      w={{ base: "240px", sm: "280px", md: "320px" }}
      h={{ base: "300px", sm: "340px", md: "400px" }}
      borderRadius="24px"
      overflow="hidden"
      boxShadow={cardShadow}
    >
      <Image
        src={card.src}
        alt={card.alt}
        fill
        sizes="(max-width: 768px) 280px, 320px"
        style={{ objectFit: "cover" }}
      />
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear(to-t, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 32%, transparent 62%)"
        pointerEvents="none"
      />
      {card.brandMark ? (
        <Text
          position="absolute"
          top={4}
          right={4}
          color="whiteAlpha.900"
          fontSize="xs"
          fontWeight="600"
          letterSpacing="-0.02em"
          opacity={0.9}
        >
          socks. smith
        </Text>
      ) : null}
      <Text
        position="absolute"
        bottom={5}
        left={5}
        right={5}
        color="white"
        fontWeight="700"
        fontSize={{ base: "md", md: "lg" }}
        lineHeight="short"
        letterSpacing="-0.025em"
      >
        {card.caption}
      </Text>
    </Box>
  );
}

export function LookbookMarquee({
  cards = DEFAULT_CARDS,
  durationSec = 48,
}: LookbookMarqueeProps) {
  const cardShadow = useColorModeValue(
    "0 18px 40px rgba(28, 25, 23, 0.12)",
    "0 18px 40px rgba(0, 0, 0, 0.4)",
  );
  const fadeFrom = useColorModeValue(
    "rgba(250, 247, 242, 1)",
    "rgba(17, 17, 17, 1)",
  );
  const fadeTo = useColorModeValue(
    "rgba(250, 247, 242, 0)",
    "rgba(17, 17, 17, 0)",
  );

  // Duplicate the set so translateX(-50%) loops with no visible jump.
  const track = [...cards, ...cards];

  return (
    <Box
      position="relative"
      w="full"
      overflow="hidden"
      role="region"
      aria-label="Lookbook gallery"
      sx={{
        "@media (prefers-reduced-motion: reduce)": {
          "& [data-lookbook-track]": {
            animation: "none !important",
            transform: "none !important",
          },
        },
      }}
    >
      <Flex
        data-lookbook-track
        w="max-content"
        gap={{ base: 4, md: 6 }}
        py={1}
        px={{ base: 4, md: 6 }}
        sx={{
          "@keyframes lookbookMarquee": {
            "0%": { transform: "translate3d(0, 0, 0)" },
            "100%": { transform: "translate3d(-50%, 0, 0)" },
          },
          animation: `lookbookMarquee ${durationSec}s linear infinite`,
          willChange: "transform",
          _hover: {
            animationPlayState: "paused",
          },
        }}
      >
        {track.map((card, index) => (
          <LookbookCardItem
            key={`${card.src}-${index}`}
            card={card}
            cardShadow={cardShadow}
          />
        ))}
      </Flex>

      {/* Soft edge fades */}
      <Box
        position="absolute"
        left={0}
        top={0}
        bottom={0}
        w={{ base: "48px", md: "96px" }}
        pointerEvents="none"
        zIndex={2}
        bgGradient={`linear(to-r, ${fadeFrom}, ${fadeTo})`}
        aria-hidden
      />
      <Box
        position="absolute"
        right={0}
        top={0}
        bottom={0}
        w={{ base: "48px", md: "96px" }}
        pointerEvents="none"
        zIndex={2}
        bgGradient={`linear(to-l, ${fadeFrom}, ${fadeTo})`}
        aria-hidden
      />
    </Box>
  );
}
