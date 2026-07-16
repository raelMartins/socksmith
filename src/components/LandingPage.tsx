"use client";

import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { LandingSockGallery } from "./LandingSockGallery";
import { ThemeToggle } from "./ThemeToggle";
import { WaitlistFlow } from "./WaitlistFlow";

const MotionBox = motion(Box);

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export function LandingPage() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const pageBg = useColorModeValue("socksmith.cream", "transparent");
  const headerBg = useColorModeValue(
    "rgba(245, 239, 230, 0.72)",
    "rgba(17, 17, 17, 0.78)",
  );
  const logoRingBg = useColorModeValue("socksmith.cream", "socksmith.black");
  const dividerBg = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
  const darkOverlayOpacity = useColorModeValue(0, 1);

  return (
    <Box
      as="main"
      position="relative"
      minH="100vh"
      overflow="clip"
      bg={pageBg}
      color="app.fg"
    >
      <Box
        position="absolute"
        inset={0}
        zIndex={0}
        pointerEvents="none"
        aria-hidden
        opacity={darkOverlayOpacity}
        bg="socksmith.black"
        backgroundImage={`radial-gradient(ellipse 90% 70% at 15% -5%, rgba(26,86,219,0.22), transparent 52%),
          radial-gradient(ellipse 70% 55% at 100% 0%, rgba(232,23,15,0.14), transparent 48%),
          radial-gradient(ellipse 60% 50% at 50% 100%, rgba(15,76,117,0.28), transparent 55%)`}
      />

      <WaitlistFlow isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />

      <Box position="relative" zIndex={1}>
        <Box
          as="header"
          position="sticky"
          top={0}
          zIndex={20}
          backdropFilter="blur(14px)"
          bg={headerBg}
          borderBottomWidth="1px"
          borderColor="glass.border"
        >
          <Container maxW="container.xl" py={4}>
          <Flex align="center" justify="space-between" gap={4}>
            <Text
              as="span"
              fontWeight="700"
              fontSize="lg"
              letterSpacing="-0.02em"
              lineHeight="none"
            >
              Socksmith
            </Text>
            <HStack spacing={2}>
              <ThemeToggle />
            </HStack>
          </Flex>
          </Container>
        </Box>

        <Container maxW="container.md" pt={{ base: 10, md: 16 }} pb={{ base: 8, md: 10 }} px={4}>
        <VStack spacing={{ base: 10, md: 14 }} align="center" textAlign="center">
          <MotionBox
            {...fadeUp}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            w="full"
          >
            <Badge
              px={3}
              py={1}
              borderRadius="full"
              textTransform="none"
              letterSpacing="0.01em"
              colorScheme="brand"
              variant="subtle"
              fontWeight="600"
            >
              Launching soon — limited first run
            </Badge>
            <Box
              mt={4}
              mx="auto"
              position="relative"
              boxSize={{ base: "148px", sm: "168px", md: "188px" }}
              borderRadius="full"
              overflow="hidden"
              bg={logoRingBg}
            >
              <Box position="absolute" inset={3}>
                <Image
                  src="/images/icons/socksmith-logo.jpeg"
                  alt="Socksmith"
                  fill
                  priority
                  sizes="(max-width: 768px) 168px, 188px"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center center",
                    transform: "scale(1.38)",
                    transformOrigin: "center center",
                  }}
                />
              </Box>
            </Box>
            <Heading
              as="h1"
              fontSize={{ base: "4xl", sm: "5xl", md: "6xl" }}
              lineHeight="1.05"
              letterSpacing="-0.04em"
              mt={5}
            >
              Socks built like{" "}
              <Box
                as="span"
                bgGradient="linear(115deg, socksmith.red, socksmith.pinkDark)"
                bgClip="text"
              >
                small artifacts
              </Box>
              .
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="app.muted"
              mt={5}
              maxW="2xl"
              mx="auto"
              lineHeight="tall"
            >
              Socksmith is a new sock brand: everyday pairs made with care, starting with a small
              first drop. Join the waitlist and we will email you when it goes live—no spam, just
              launch news.
            </Text>

            <Button
              mt={8}
              size="lg"
              colorScheme="brand"
              px={10}
              onClick={() => setWaitlistOpen(true)}
            >
              Join the waitlist
            </Button>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            w="full"
          >
            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Box>
                <Text fontSize="3xl" fontWeight="800" letterSpacing="-0.03em">
                  Studio
                </Text>
                <Text fontSize="sm" color="app.muted" fontWeight="600">
                  Small-batch runs
                </Text>
              </Box>
              <Box h="10" w="px" bg={dividerBg} />
              <Box>
                <Text fontSize="3xl" fontWeight="800" letterSpacing="-0.03em">
                  12+
                </Text>
                <Text fontSize="sm" color="app.muted" fontWeight="600">
                  Prototype rounds
                </Text>
              </Box>
              <Box h="10" w="px" bg={dividerBg} />
              <Box>
                <Text fontSize="3xl" fontWeight="800" letterSpacing="-0.03em">
                  1st
                </Text>
                <Text fontSize="sm" color="app.muted" fontWeight="600">
                  Drop is intimate
                </Text>
              </Box>
            </HStack>
          </MotionBox>
        </VStack>
        </Container>

        <LandingSockGallery />

        <Container maxW="container.md" pb={{ base: 16, md: 24 }} px={4}>
        <VStack spacing={{ base: 10, md: 14 }} align="center" textAlign="center">
          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            borderRadius="3xl"
            borderWidth="1px"
            borderColor="glass.border"
            p={{ base: 6, md: 8 }}
            bg="glass.bg"
            backdropFilter="blur(16px)"
            w="full"
            maxW="xl"
          >
            <Heading size="md" letterSpacing="-0.02em">
              What you are signing up for
            </Heading>
            <Stack mt={5} spacing={4} color="app.muted" fontSize="md" lineHeight="tall" textAlign="left">
              <Text>
                Early access to the first collection, behind-the-scenes dye lab notes, and a calm
                inbox — no daily blasts.
              </Text>
              <Text>
                If you change your mind, every email includes a one-click unsubscribe. We are
                building a studio, not a funnel factory.
              </Text>
            </Stack>
            <Button
              mt={8}
              size="lg"
              colorScheme="brand"
              w={{ base: "full", sm: "auto" }}
              onClick={() => setWaitlistOpen(true)}
            >
              Join the waitlist
            </Button>
            <Text mt={3} fontSize="sm" color="app.muted">
              Time to Complete: about a minute
            </Text>
          </MotionBox>
        </VStack>

        <Text mt={16} textAlign="center" fontSize="sm" color="app.muted">
          © {new Date().getFullYear()} Socksmith.
        </Text>
        </Container>
      </Box>
    </Box>
  );
}
