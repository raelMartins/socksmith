"use client";

import dynamic from "next/dynamic";
import { Box, Center, Spinner, Text } from "@chakra-ui/react";

const PlayfulHeroScene = dynamic(
  () => import("./PlayfulHeroScene").then((m) => m.PlayfulHeroScene),
  {
    ssr: false,
    loading: () => (
      <Center h="100%" minH="280px" flexDirection="column" gap={3}>
        <Spinner thickness="3px" speed="0.7s" color="brand.500" size="lg" />
        <Text fontSize="xs" color="app.muted" fontWeight="600" letterSpacing="0.06em">
          Loading 3D playground
        </Text>
      </Center>
    ),
  },
);

export function SockHeroCanvas() {
  return (
    <Box
      position="relative"
      h={{ base: "320px", md: "420px", lg: "100%" }}
      minH={{ base: "280px", lg: "420px" }}
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
      <Box position="absolute" inset={0} opacity={0.98}>
        <PlayfulHeroScene />
      </Box>
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
          Drag / hover — scene follows your pointer
        </Text>
      </Box>
      <Box
        pointerEvents="none"
        position="absolute"
        inset={0}
        bgGradient="linear(to-t, rgba(255,255,255,0.5), transparent 38%)"
        _dark={{
          bgGradient: "linear(to-t, rgba(11,15,20,0.55), transparent 42%)",
        }}
      />
    </Box>
  );
}
