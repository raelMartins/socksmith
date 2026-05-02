"use client";

import { Box, Center, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

/** Hero visual — soft gradient field + motion (swap in WebGL when @react-three/* is available). */
export function SockHeroCanvas() {
  return (
    <Box
      position="relative"
      h={{ base: "320px", md: "420px", lg: "420px" }}
      minH={{ base: "280px", md: "420px" }}
      w="100%"
      borderRadius="3xl"
      overflow="hidden"
      borderWidth="1px"
      borderColor="glass.border"
      cursor="grab"
      _active={{ cursor: "grabbing" }}
      sx={{
        bg: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        boxShadow: "0 24px 80px rgba(15, 23, 42, 0.12)",
        _dark: {
          bg: "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.2) 100%)",
          boxShadow: "0 28px 90px rgba(0,0,0,0.45)",
        },
      }}
    >
      <MotionBox
        position="absolute"
        inset="-20%"
        bgGradient="radial(circle at 30% 40%, rgba(232,23,15,0.35), transparent 55%)"
        animate={{ x: [0, 12, 0], y: [0, -8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <MotionBox
        position="absolute"
        inset="-15%"
        bgGradient="radial(circle at 70% 60%, rgba(26,86,219,0.28), transparent 50%)"
        animate={{ x: [0, -10, 0], y: [0, 10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <Center position="absolute" inset={0}>
        <MotionBox
          w="min(72%, 280px)"
          h="min(50%, 200px)"
          borderRadius="full"
          borderWidth="2px"
          borderColor="whiteAlpha.400"
          bg="whiteAlpha.100"
          backdropFilter="blur(8px)"
          animate={{ rotate: [0, 2, -2, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </Center>
      <Box
        pointerEvents="none"
        position="absolute"
        bottom={3}
        left={4}
        right={4}
        zIndex={1}
      >
        <Text
          fontSize="10px"
          fontWeight="700"
          letterSpacing="0.14em"
          textTransform="uppercase"
          color="app.muted"
          opacity={0.85}
        >
          Drag / play space
        </Text>
      </Box>
    </Box>
  );
}
