"use client";

import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const MotionBox = motion.create(Box);

const FAQS = [
  {
    question: "What comes in a box?",
    answer:
      "Each box includes 3 pairs of socks, curated around the styles and colours you share on the waitlist. Think launch-ready favourites, not filler pairs.",
  },
  {
    question: "Can I change preferences later?",
    answer:
      "Absolutely. Reply to any of our emails before launch and we'll update your style, colour, or quantity preferences — no fuss.",
  },
  {
    question: "Am I purchasing now?",
    answer:
      "No. Joining the waitlist is free and locks in early access only. You'll only pay when boxes drop and you decide to checkout.",
  },
] as const;

const panelTransition = {
  duration: 0.38,
  ease: [0.22, 1, 0.36, 1] as const,
};

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const pillBg = useColorModeValue("white", "rgba(28, 25, 23, 0.88)");
  const pillShadow = useColorModeValue(
    "0 8px 24px rgba(28, 25, 23, 0.06)",
    "0 8px 24px rgba(0, 0, 0, 0.35)",
  );
  const pillShadowExpanded = useColorModeValue(
    "0 16px 40px rgba(28, 25, 23, 0.1)",
    "0 16px 40px rgba(0, 0, 0, 0.45)",
  );
  const questionColor = useColorModeValue("ink.900", "socksmith.cream");
  const answerColor = useColorModeValue("ink.600", "whiteAlpha.700");
  const chevronColor = useColorModeValue("ink.400", "whiteAlpha.500");

  return (
    <Box
      bg={pillBg}
      borderRadius="24px"
      boxShadow={isOpen ? pillShadowExpanded : pillShadow}
      overflow="hidden"
      transition="box-shadow 0.38s ease"
    >
      <Flex
        as="button"
        type="button"
        w="full"
        align="center"
        justify="space-between"
        gap={3}
        px={{ base: 5, md: 7 }}
        py={{ base: 4, md: 5 }}
        textAlign="left"
        onClick={onToggle}
        aria-expanded={isOpen}
        _hover={{ bg: "transparent" }}
        _focusVisible={{
          outline: "2px solid",
          outlineColor: "#FC463C",
          outlineOffset: "-2px",
        }}
      >
        <Text
          flex="1"
          fontWeight="600"
          fontSize={{ base: "md", md: "lg" }}
          letterSpacing="-0.02em"
          color={questionColor}
          pr={2}
        >
          {question}
        </Text>
        <ChevronDownIcon
          boxSize={5}
          color={chevronColor}
          flexShrink={0}
          transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
          transition="transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)"
        />
      </Flex>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <MotionBox
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={panelTransition}
            overflow="hidden"
          >
            <Text
              px={{ base: 5, md: 7 }}
              pb={{ base: 5, md: 6 }}
              pt={0}
              color={answerColor}
              fontSize={{ base: "sm", md: "md" }}
              lineHeight="tall"
            >
              {answer}
            </Text>
          </MotionBox>
        ) : null}
      </AnimatePresence>
    </Box>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Box as="section" id="faq" pt={{ base: 4, md: 8 }} pb={{ base: 16, md: 24 }}>
      <Container maxW="container.md" px={{ base: 4, md: 6 }}>
        <VStack spacing={2} textAlign="center" mb={{ base: 8, md: 10 }}>
          <Text
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.14em"
            textTransform="uppercase"
            color="#E85D4C"
          >
            FAQ
          </Text>
          <Heading
            as="h2"
            fontWeight="700"
            fontSize={{ base: "2.5rem", md: "3.25rem" }}
            lineHeight="1.05"
            letterSpacing="-0.04em"
          >
            Good questions.
          </Heading>
        </VStack>

        <VStack spacing={4} align="stretch">
          {FAQS.map((faq, index) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex((current) => (current === index ? null : index))
              }
            />
          ))}
        </VStack>
      </Container>
    </Box>
  );
}
