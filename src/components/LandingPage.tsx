"use client";

import {
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { SockHeroCanvas } from "./SockHeroCanvas";
import { ThemeToggle } from "./ThemeToggle";
import { WaitlistForm } from "./WaitlistForm";

const MotionBox = motion(Box);

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export function LandingPage() {
  return (
    <Box as="main">
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex={20}
        backdropFilter="blur(14px)"
        bg="rgba(255,255,255,0.55)"
        _dark={{ bg: "rgba(11,15,20,0.55)" }}
        borderBottomWidth="1px"
        borderColor="glass.border"
      >
        <Container maxW="container.xl" py={4}>
          <Flex align="center" justify="space-between" gap={4}>
            <HStack spacing={3}>
              <Box
                w={9}
                h={9}
                borderRadius="xl"
                bgGradient="linear(135deg, brand.400, purple.400)"
                boxShadow="0 10px 30px rgba(232, 93, 4, 0.35)"
              />
              <Box>
                <Text fontWeight="800" letterSpacing="-0.03em" fontSize="lg" lineHeight="none">
                  Socksmith
                </Text>
                <Text fontSize="xs" color="app.muted" fontWeight="500">
                  Atelier socks
                </Text>
              </Box>
            </HStack>
            <HStack spacing={2}>
              <ThemeToggle />
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" pt={{ base: 10, md: 16 }} pb={{ base: 16, md: 24 }}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 12, lg: 16 }} alignItems="center">
          <VStack align="stretch" spacing={{ base: 8, md: 10 }}>
            <MotionBox {...fadeUp} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
              <Badge
                alignSelf="flex-start"
                px={3}
                py={1}
                borderRadius="full"
                textTransform="none"
                letterSpacing="0.01em"
                colorScheme="purple"
                variant="subtle"
                fontWeight="600"
              >
                Launching soon — limited first run
              </Badge>
              <Heading
                as="h1"
                fontSize={{ base: "4xl", sm: "5xl", md: "6xl" }}
                lineHeight="1.05"
                letterSpacing="-0.04em"
                mt={5}
              >
                Socks built like{" "}
                <Box as="span" bgGradient="linear(120deg, brand.500, purple.500)" bgClip="text">
                  small artifacts
                </Box>
                .
              </Heading>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color="app.muted"
                mt={5}
                maxW="lg"
                lineHeight="tall"
              >
                Yarn-forward textures, obsessive fit tuning, and color stories that feel more like
                a wardrobe than a novelty aisle. Join the waitlist for the opening drop.
              </Text>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <HStack spacing={4} flexWrap="wrap">
                <Box>
                  <Text fontSize="3xl" fontWeight="800" letterSpacing="-0.03em">
                    3D
                  </Text>
                  <Text fontSize="sm" color="app.muted" fontWeight="600">
                    Knit-first silhouettes
                  </Text>
                </Box>
                <Box h="10" w="px" bg="blackAlpha.200" _dark={{ bg: "whiteAlpha.200" }} />
                <Box>
                  <Text fontSize="3xl" fontWeight="800" letterSpacing="-0.03em">
                    12+
                  </Text>
                  <Text fontSize="sm" color="app.muted" fontWeight="600">
                    Prototype rounds
                  </Text>
                </Box>
                <Box h="10" w="px" bg="blackAlpha.200" _dark={{ bg: "whiteAlpha.200" }} />
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

          <SockHeroCanvas />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={10} mt={{ base: 14, md: 20 }}>
          <Box gridColumn={{ lg: "span 5" }}>
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
            >
              <Heading size="md" letterSpacing="-0.02em">
                What you are signing up for
              </Heading>
              <Stack mt={5} spacing={4} color="app.muted" fontSize="md" lineHeight="tall">
                <Text>
                  Early access to the first collection, behind-the-scenes dye lab notes, and a
                  calm inbox — no daily blasts.
                </Text>
                <Text>
                  If you change your mind, every email includes a one-click unsubscribe. We are
                  building a studio, not a funnel factory.
                </Text>
              </Stack>
            </MotionBox>
          </Box>
          <Box gridColumn={{ lg: "span 7" }}>
            <WaitlistForm />
          </Box>
        </SimpleGrid>

        <Text mt={16} textAlign="center" fontSize="sm" color="app.muted">
          © {new Date().getFullYear()} Socksmith. Crafted with Chakra UI, Next.js, and Three.js.
        </Text>
      </Container>
    </Box>
  );
}
