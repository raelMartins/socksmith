"use client";

import { Box, Text } from "@chakra-ui/react";
import Image from "next/image";
import {
  SOCK_GALLERY_FILENAMES,
  labelFromFilename,
  sockGallerySrc,
} from "@/lib/landing-gallery-images";

const CARD_W = 88;
const GAP_PX = 12;

function stripItem(filename: string, i: number) {
  return (
    <Box
      key={`${filename}-${i}`}
      flex="0 0 auto"
      w={`${CARD_W}px`}
      transition="transform 0.2s ease-out"
      _hover={{ transform: "translateY(-4px) scale(1.03)" }}
    >
      <Box
        position="relative"
        h={`${CARD_W}px`}
        borderRadius="xl"
        overflow="hidden"
        borderWidth="1px"
        borderColor="whiteAlpha.250"
      >
        <Image
          src={sockGallerySrc(filename)}
          alt={labelFromFilename(filename)}
          fill
          sizes={`${CARD_W}px`}
          style={{ objectFit: "cover" }}
        />
      </Box>
      <Text
        mt={1.5}
        fontSize="10px"
        color="whiteAlpha.700"
        fontWeight="600"
        noOfLines={2}
        lineHeight="short"
        textAlign="center"
      >
        {labelFromFilename(filename)}
      </Text>
    </Box>
  );
}

/** Compact infinite marquee for the waitlist welcome step — all gallery images, no scrollbar. */
export function WaitlistSockGallery() {
  const items = SOCK_GALLERY_FILENAMES;
  const doubled = [...items, ...items];
  const durationSec = Math.max(36, items.length * 2.2);

  return (
    <Box
      w="full"
      overflow="hidden"
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      py={3}
      px={2}
    >
      <Text
        fontSize="xs"
        fontWeight="700"
        letterSpacing="0.14em"
        color="whiteAlpha.500"
        textAlign="center"
        mb={2}
      >
        FIRST DROP MOOD
      </Text>
      <Box w="full" overflow="hidden" sx={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
        <Box
          display="flex"
          flexDirection="row"
          gap={`${GAP_PX}px`}
          w="max-content"
          py={0.5}
          sx={{
            "@keyframes waitlistMarquee": {
              "0%": { transform: "translateX(0)" },
              "100%": { transform: "translateX(-50%)" },
            },
            animation: `waitlistMarquee ${durationSec}s linear infinite`,
            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",
              transform: "translateX(0)",
            },
          }}
        >
          {doubled.map((filename, i) => stripItem(filename, i))}
        </Box>
      </Box>
    </Box>
  );
}
