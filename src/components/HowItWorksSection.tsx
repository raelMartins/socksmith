"use client";

import {
  Box,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

type Step = {
  step: string;
  title: string;
  body: string;
  iconBgLight: string;
  iconBgDark: string;
  iconColor: string;
  icon: ReactNode;
};

const STEPS: Step[] = [
  {
    step: "Step 1",
    title: "Choose your styles",
    body: "Tell us what makes your feet happy — novelty, minimal, animals, whatever.",
    iconBgLight: "#FCE7F3",
    iconBgDark: "rgba(244, 114, 182, 0.2)",
    iconColor: "#A855F7",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 21s-6.5-4.35-9.33-8.1C.7 10.2 1.2 6.9 3.9 5.4c2-.1 3.7 1 4.6 2.4.9-1.4 2.6-2.5 4.6-2.4 2.7 1.5 3.2 4.8 1.23 7.5C18.5 16.65 12 21 12 21z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    step: "Step 2",
    title: "Pick box quantity",
    body: "1 box, 4 boxes, or somewhere in between. Each box = 3 pairs.",
    iconBgLight: "#FEF3C7",
    iconBgDark: "rgba(251, 191, 36, 0.18)",
    iconColor: "#111111",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M8 7h11M8 12h11M8 17h11"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <circle cx="5" cy="7" r="1.25" fill="currentColor" />
        <circle cx="5" cy="12" r="1.25" fill="currentColor" />
        <circle cx="5" cy="17" r="1.25" fill="currentColor" />
      </svg>
    ),
  },
  {
    step: "Step 3",
    title: "Get launch access",
    body: "Be first in line when boxes drop. We'll send your invite over.",
    iconBgLight: "#DBEAFE",
    iconBgDark: "rgba(59, 130, 246, 0.2)",
    iconColor: "#1E40AF",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3 4.5 7.5v9L12 21l7.5-4.5v-9L12 3z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          d="M12 12 4.5 7.5M12 12l7.5-4.5M12 12v9"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function StepCard({ item }: { item: Step }) {
  const cardBg = useColorModeValue("white", "rgba(28, 25, 23, 0.88)");
  const cardShadow = useColorModeValue(
    "0 16px 40px rgba(28, 25, 23, 0.06)",
    "0 16px 40px rgba(0, 0, 0, 0.35)",
  );
  const cardShadowHover = useColorModeValue(
    "0 24px 60px -24px oklch(66% 0.22 28 / 0.45)",
    "0 24px 60px -24px oklch(66% 0.22 28 / 0.35)",
  );
  const titleColor = useColorModeValue("ink.900", "socksmith.cream");
  const bodyColor = useColorModeValue("ink.600", "whiteAlpha.700");
  const stepColor = useColorModeValue("ink.400", "whiteAlpha.500");
  const iconBg = useColorModeValue(item.iconBgLight, item.iconBgDark);
  const iconColor = useColorModeValue(
    item.iconColor,
    item.iconColor === "#111111" ? "#FAF7F2" : item.iconColor,
  );

  return (
    <Box
      bg={cardBg}
      borderRadius="32px"
      p={{ base: 6, md: 7 }}
      boxShadow={cardShadow}
      borderWidth="1px"
      borderColor="glass.border"
      transition="transform 0.25s ease, box-shadow 0.25s ease"
      _hover={{
        transform: "translateY(-0.25rem)",
        boxShadow: cardShadowHover,
      }}
    >
      <Flex
        align="center"
        justify="center"
        boxSize="48px"
        borderRadius="full"
        bg={iconBg}
        color={iconColor}
        mb={5}
      >
        {item.icon}
      </Flex>
      <Text fontSize="sm" color={stepColor} mb={1}>
        {item.step}
      </Text>
      <Text
        fontWeight="700"
        fontSize={{ base: "lg", md: "xl" }}
        letterSpacing="-0.025em"
        color={titleColor}
        mb={2}
      >
        {item.title}
      </Text>
      <Text fontSize="md" color={bodyColor} lineHeight="tall">
        {item.body}
      </Text>
    </Box>
  );
}

export function HowItWorksSection() {
  return (
    <Box
      as="section"
      id="how-it-works"
      pt={{ base: 6, md: 10 }}
      pb={{ base: 12, md: 16 }}
    >
      <Container maxW="container.content" px={{ base: 4, md: 6 }}>
        <VStack align="flex-start" spacing={3} mb={{ base: 8, md: 10 }}>
          <Text
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.14em"
            textTransform="uppercase"
            color="#E85D4C"
          >
            How it works
          </Text>
          <Heading
            as="h2"
            fontWeight="700"
            fontSize={{ base: "2.5rem", md: "3.25rem" }}
            lineHeight="1.05"
            letterSpacing="-0.04em"
          >
            Three steps, zero fuss.
          </Heading>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 5 }}>
          {STEPS.map((item) => (
            <StepCard key={item.step} item={item} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
