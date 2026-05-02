"use client";

import dynamic from "next/dynamic";
import { Box, Center, Spinner } from "@chakra-ui/react";

const SockScene = dynamic(
  () => import("./SockScene").then((m) => m.SockScene),
  {
    ssr: false,
    loading: () => (
      <Center h="100%" minH="280px">
        <Spinner thickness="3px" speed="0.7s" color="brand.500" size="lg" />
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
      sx={{
        bg: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        boxShadow: "0 24px 80px rgba(15, 23, 42, 0.12)",
        _dark: {
          bg: "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.2) 100%)",
          boxShadow: "0 28px 90px rgba(0,0,0,0.45)",
        },
      }}
    >
      <Box position="absolute" inset={0} opacity={0.95}>
        <SockScene />
      </Box>
      <Box
        pointerEvents="none"
        position="absolute"
        inset={0}
        bgGradient="linear(to-t, rgba(255,255,255,0.55), transparent 40%)"
        _dark={{
          bgGradient: "linear(to-t, rgba(11,15,20,0.65), transparent 45%)",
        }}
      />
    </Box>
  );
}
