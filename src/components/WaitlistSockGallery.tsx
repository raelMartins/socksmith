"use client";

import { Box, HStack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  SOCK_GALLERY_FILENAMES,
  labelFromFilename,
  sockGallerySrc,
} from "@/lib/landing-gallery-images";

const MotionBox = motion(Box);

/** Compact strip for the waitlist welcome step (not the full landing gallery). */
export function WaitlistSockGallery() {
  const subset = SOCK_GALLERY_FILENAMES.slice(0, 8);

  return (
    <Box w="full" overflow="hidden" borderRadius="2xl" borderWidth="1px" borderColor="whiteAlpha.200" py={3} px={2}>
      <Text fontSize="xs" fontWeight="700" letterSpacing="0.14em" color="whiteAlpha.500" textAlign="center" mb={2}>
        FIRST DROP MOOD
      </Text>
      <HStack spacing={3} overflowX="auto" pb={1} px={1} sx={{ scrollSnapType: "x mandatory" }}>
        {subset.map((filename, i) => (
          <MotionBox
            key={filename}
            flex="0 0 auto"
            w="88px"
            scrollSnapAlign="start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i, duration: 0.35 }}
            whileHover={{ y: -4, scale: 1.03 }}
          >
            <Box position="relative" h="88px" borderRadius="xl" overflow="hidden" borderWidth="1px" borderColor="whiteAlpha.250">
              <Image
                src={sockGallerySrc(filename)}
                alt={labelFromFilename(filename)}
                fill
                sizes="88px"
                style={{ objectFit: "cover" }}
              />
            </Box>
            <Text mt={1.5} fontSize="10px" color="whiteAlpha.700" fontWeight="600" noOfLines={2} lineHeight="short" textAlign="center">
              {labelFromFilename(filename)}
            </Text>
          </MotionBox>
        ))}
      </HStack>
    </Box>
  );
}
