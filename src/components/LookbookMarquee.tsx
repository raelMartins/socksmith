"use client";

import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import { CAMPAIGN_MEDIA, type CampaignMedia } from "@/lib/campaign-media";

type LookbookMarqueeProps = {
  cards?: CampaignMedia[];
  /** Seconds for one full loop of the track. Higher = slower. */
  durationSec?: number;
};

function LookbookCardItem({
  card,
  cardShadow,
}: {
  card: CampaignMedia;
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
      role="group"
      bg="blackAlpha.100"
    >
      {card.kind === "video" ? (
        <Box
          as="video"
          src={card.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          position="absolute"
          inset={0}
          w="full"
          h="full"
          sx={{ objectFit: "cover" }}
        />
      ) : (
        <Image
          src={card.src}
          alt={card.alt}
          fill
          sizes="(max-width: 768px) 280px, 320px"
          style={{ objectFit: "cover" }}
        />
      )}
      <Flex
        position="absolute"
        inset={0}
        align="center"
        justify="center"
        px={5}
        bg="rgba(0, 0, 0, 0.55)"
        opacity={0}
        transition="opacity 0.28s ease"
        _groupHover={{ opacity: 1 }}
        pointerEvents="none"
      >
        <Text
          color="white"
          fontWeight="700"
          fontSize={{ base: "md", md: "lg" }}
          lineHeight="short"
          letterSpacing="-0.025em"
          textAlign="center"
        >
          {card.caption}
        </Text>
      </Flex>
    </Box>
  );
}

export function LookbookMarquee({
  cards = CAMPAIGN_MEDIA,
  durationSec = 56,
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
          "& video": {
            display: "none",
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
            key={`${card.id}-${index}`}
            card={card}
            cardShadow={cardShadow}
          />
        ))}
      </Flex>

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
