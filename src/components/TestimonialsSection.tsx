"use client";

import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import { sockGallerySrc } from "@/lib/landing-gallery-images";

type Testimonial = {
  quote: string;
  name: string;
  initials: string;
  avatarBg: string;
  cardBg: { light: string; dark: string };
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "My drawer used to be a black-sock graveyard. Socksmith is about to make getting dressed fun again.",
    name: "Zii, Esq.",
    initials: "ZE",
    avatarBg: "#F9A8D4",
    cardBg: { light: "#FCE7F3", dark: "rgba(249, 168, 212, 0.18)" },
  },
  {
    quote:
      "The fit is unreal and the prints are minimal but loud in the best way.",
    name: "Fuad.",
    initials: "FU",
    avatarBg: "#FCD34D",
    cardBg: { light: "#FEF3C7", dark: "rgba(252, 211, 77, 0.16)" },
  },
  {
    quote:
      "Got one free box for the promotional shoot, immediately I wanted three. They just feel premium. We all deserve to experience this greatness.",
    name: "Netrovert.",
    initials: "NE",
    avatarBg: "#93C5FD",
    cardBg: { light: "#DBEAFE", dark: "rgba(147, 197, 253, 0.16)" },
  },
  {
    quote: "Finally, socks that match my outfit AND my personality.",
    name: "Juwonlo.",
    initials: "JU",
    avatarBg: "#C4B5FD",
    cardBg: { light: "#EDE9FE", dark: "rgba(196, 181, 253, 0.16)" },
  },
];

const FEATURE_IMAGES = [
  {
    src: sockGallerySrc("Smile.jpg"),
    alt: "Cosy white socks lifestyle",
    caption: "Cosy is always in season.",
    captionPlacement: "end" as const,
  },
  {
    src: sockGallerySrc("Plain on Rubble.jpg"),
    alt: "Pulling on cream socks with brand mark",
    caption: null,
    captionPlacement: "start" as const,
  },
];

function TestimonialCard({ item }: { item: Testimonial }) {
  const bg = useColorModeValue(item.cardBg.light, item.cardBg.dark);
  const quoteColor = useColorModeValue("ink.800", "socksmith.cream");
  const nameColor = useColorModeValue("ink.900", "white");

  return (
    <Flex
      direction="column"
      justify="space-between"
      h="full"
      minH={{ base: "260px", md: "300px" }}
      p={{ base: 5, md: 6 }}
      borderRadius="32px"
      bg={bg}
    >
      <Text
        fontSize={{ base: "md", md: "lg" }}
        lineHeight="tall"
        letterSpacing="-0.015em"
        color={quoteColor}
      >
        &ldquo;{item.quote}&rdquo;
      </Text>
      <HStack spacing={3} mt={8}>
        <Flex
          align="center"
          justify="center"
          boxSize="40px"
          borderRadius="full"
          bg={item.avatarBg}
          color="ink.900"
          fontSize="xs"
          fontWeight="700"
          letterSpacing="-0.02em"
          flexShrink={0}
        >
          {item.initials}
        </Flex>
        <Text fontWeight="700" fontSize="sm" color={nameColor}>
          {item.name}
        </Text>
      </HStack>
    </Flex>
  );
}

export function TestimonialsSection() {
  const featureShadow = useColorModeValue(
    "0 18px 40px rgba(28, 25, 23, 0.1)",
    "0 18px 40px rgba(0, 0, 0, 0.4)",
  );

  return (
    <Box as="section" pt={{ base: 4, md: 8 }} pb={{ base: 16, md: 24 }}>
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        <VStack align="flex-start" spacing={3} mb={{ base: 8, md: 10 }}>
          <Text
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.14em"
            textTransform="uppercase"
            color="#E85D4C"
          >
            Loved by feet everywhere
          </Text>
          <Heading
            as="h2"
            fontWeight="700"
            fontSize={{ base: "2.5rem", md: "3.25rem" }}
            lineHeight="1.05"
            letterSpacing="-0.04em"
          >
            Why people love socksmith
          </Heading>
        </VStack>

        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 4, md: 5 }}
        >
          {TESTIMONIALS.map((item) => (
            <TestimonialCard key={item.name} item={item} />
          ))}
        </SimpleGrid>

        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing="16px"
          mt="64px"
          justifyItems="center"
        >
          {FEATURE_IMAGES.map((feature) => (
            <Box
              key={feature.src}
              position="relative"
              w="full"
              maxW="544px"
              aspectRatio="544 / 435"
              borderRadius="32px"
              overflow="hidden"
              boxShadow={featureShadow}
              role="group"
            >
              <Image
                src={feature.src}
                alt={feature.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
              {feature.caption ? (
                <Flex
                  position="absolute"
                  inset={0}
                  align="center"
                  justify="center"
                  px={6}
                  bg="rgba(0, 0, 0, 0.55)"
                  opacity={0}
                  transition="opacity 0.28s ease"
                  _groupHover={{ opacity: 1 }}
                  pointerEvents="none"
                >
                  <Text
                    color="white"
                    fontWeight="700"
                    fontSize={{ base: "xl", md: "2xl" }}
                    lineHeight="short"
                    letterSpacing="-0.03em"
                    textAlign="center"
                  >
                    {feature.caption}
                  </Text>
                </Flex>
              ) : null}
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
