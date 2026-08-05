"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaqSection } from "./FaqSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { LookbookMarquee } from "./LookbookMarquee";
import { SiteFooter } from "./SiteFooter";
import { TestimonialsSection } from "./TestimonialsSection";
import { ThemeToggle } from "./ThemeToggle";
import { WaitlistForm } from "./WaitlistForm";

const MotionBox = motion.create(Box);

type HeroCard = {
  src: string;
  alt: string;
  caption: string;
  float: { y: number[]; duration: number; delay: number };
  w: { base: string; md: string };
  h: { base: string; md: string };
  rotate: string;
  zIndex: number;
  position: {
    top?: string | { base: string; md: string };
    left?: string | { base: string; md: string };
    right?: string | { base: string; md: string };
    bottom?: string | { base: string; md: string };
  };
};

const HERO_CARDS: HeroCard[] = [
  {
    src: "/images/Plain Pink.jpg",
    alt: "Soft pink socks",
    caption: "Soft never looked so bold.",
    float: { y: [0, -14, 0], duration: 4.2, delay: 0 },
    // 312 × 397, tilted left
    w: { base: "200px", md: "312px" },
    h: { base: "254px", md: "397px" },
              rotate: "-7deg",
    zIndex: 2,
    position: {
      top: { base: "10%", md: "6%" },
      left: { base: "2%", md: "0%" },
    },
  },
  {
    src: "/images/Cover Face.jpg",
    alt: "Graphic sock campaign",
    caption: "Just socks, they said.",
    float: { y: [0, -10, 0], duration: 5.1, delay: 0.4 },
    // 316 × 409, tilted right
    w: { base: "200px", md: "316px" },
    h: { base: "260px", md: "409px" },
    rotate: "7deg",
    zIndex: 1,
    position: {
      top: { base: "-4%", md: "-6%" },
      right: { base: "0%", md: "2%" },
    },
  },
  {
    src: "/images/Plain Blue.jpg",
    alt: "Blue socks essentials",
    caption: "Sock essentials for every occasion.",
    float: { y: [0, -12, 0], duration: 3.8, delay: 0.85 },
    // 190 × 190, tilted right
    w: { base: "140px", md: "190px" },
    h: { base: "140px", md: "190px" },
    rotate: "7deg",
    zIndex: 3,
    position: {
      bottom: { base: "4%", md: "6%" },
      right: { base: "8%", md: "10%" },
    },
  },
];

function scrollToWaitlist() {
  document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
}

function HeroFloatCard({
  src,
  alt,
  caption,
  float,
  w,
  h,
  rotate,
  zIndex,
  position,
}: HeroCard) {
  const cardShadow = useColorModeValue(
    "0 22px 50px rgba(28, 25, 23, 0.16)",
    "0 22px 50px rgba(0, 0, 0, 0.45)",
  );

  return (
    <Box
      position="absolute"
      {...position}
      w={w}
      h={h}
      zIndex={zIndex}
      transform={`rotate(${rotate})`}
      transformOrigin="center center"
    >
      <MotionBox
        w="full"
        h="full"
        borderRadius={{ base: "2xl", md: "28px" }}
        overflow="hidden"
        boxShadow={cardShadow}
        animate={{ y: float.y }}
        transition={{
          duration: float.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: float.delay,
        }}
      >
        <Box position="relative" w="full" h="full">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 200px, 316px"
            style={{ objectFit: "cover" }}
            priority
          />
          <Box
            position="absolute"
            inset={0}
            bgGradient="linear(to-t, blackAlpha.700 0%, transparent 55%)"
            pointerEvents="none"
          />
          <Text
            position="absolute"
            bottom={{ base: 3, md: 4 }}
            left={{ base: 3, md: 4 }}
            right={{ base: 3, md: 4 }}
            color="white"
            fontWeight="700"
            fontSize={{ base: "xs", sm: "sm", md: "md" }}
            lineHeight="short"
            letterSpacing="-0.02em"
          >
            {caption}
          </Text>
        </Box>
      </MotionBox>
    </Box>
  );
}

export function LandingPage() {
  const headerBg = useColorModeValue(
    "rgba(250, 247, 242, 0.72)",
    "rgba(17, 17, 17, 0.72)",
  );
  const navPillBg = useColorModeValue("socksmith.black", "socksmith.cream");
  const navPillColor = useColorModeValue("white", "socksmith.black");
  const badgeBg = useColorModeValue("#FFE2DE", "rgba(255, 226, 222, 0.2)");
  const badgeColor = useColorModeValue("#400C0C", "#FFE2DE");
  const ctaBg = useColorModeValue("#FC463C", "#FC463C");
  const ctaHover = "#E53A31";
  const pageOverlay = useColorModeValue(
    `radial-gradient(ellipse 70% 55% at 0% 0%, rgba(244,114,182,0.32), transparent 55%),
     radial-gradient(ellipse 65% 50% at 100% 0%, rgba(251,191,36,0.26), transparent 52%)`,
    `radial-gradient(ellipse 70% 55% at 0% 0%, rgba(244,114,182,0.2), transparent 55%),
     radial-gradient(ellipse 65% 50% at 100% 0%, rgba(251,191,36,0.12), transparent 52%)`,
  );

  return (
    <Box as="main" position="relative" minH="100vh" overflow="clip" color="app.fg">
      {/* Ambient page wash (complements global body gradients) */}
      <Box
        position="absolute"
        inset={0}
        zIndex={0}
        pointerEvents="none"
        aria-hidden
        backgroundImage={pageOverlay}
      />

      <Box position="relative" zIndex={1}>
        {/* Full-width glass navbar */}
        <Box
          as="header"
          position="sticky"
          top={0}
          zIndex={30}
          w="full"
          bg={headerBg}
          backdropFilter="blur(16px) saturate(140%)"
          borderBottomWidth="1px"
          borderColor="glass.border"
        >
          <Container maxW="container.xl" py={{ base: 3, md: 3.5 }} px={{ base: 4, md: 6 }}>
            <Flex align="center" justify="space-between" gap={3}>
              <HStack spacing={2.5} minW={0}>
                <Box
                  position="relative"
                  boxSize="36px"
                  borderRadius="full"
                  overflow="hidden"
                  flexShrink={0}
                  bg="white"
                >
                  <Image
                    src="/images/icons/socksmith-logo.jpeg"
                    alt=""
                    fill
                    sizes="36px"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    priority
                  />
                </Box>
                <Text
                  as="span"
                  fontFamily="heading"
                  fontWeight="700"
                  fontSize={{ base: "md", md: "lg" }}
                  letterSpacing="-0.03em"
                  lineHeight="none"
                  noOfLines={1}
                >
                  socksmith
                </Text>
              </HStack>

              <HStack spacing={2} flexShrink={0}>
                <ThemeToggle />
                <Button
                  size={{ base: "sm", md: "md" }}
                  borderRadius="full"
                  bg={navPillBg}
                  color={navPillColor}
                  px={{ base: 4, md: 5 }}
                  fontWeight="600"
                  _hover={{ opacity: 0.88 }}
                  _active={{ opacity: 0.8 }}
                  onClick={scrollToWaitlist}
                >
                  Join waitlist
                </Button>
              </HStack>
            </Flex>
          </Container>
        </Box>

        {/* Hero */}
        <Container
          maxW="container.xl"
          pt={{ base: 10, md: 16 }}
          pb={{ base: 16, md: 24 }}
          px={{ base: 4, md: 6 }}
        >
          <Flex
            direction={{ base: "column", lg: "row" }}
            align={{ base: "stretch", lg: "center" }}
            gap={{ base: 12, lg: 10, xl: 14 }}
          >
            {/* Left copy */}
            <MotionBox
              flex={{ lg: "1 1 48%" }}
              maxW={{ lg: "540px" }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <Box
                as="span"
                display="inline-flex"
                alignItems="center"
                px={3.5}
                py={1.5}
                borderRadius="full"
                bg={badgeBg}
                color={badgeColor}
                fontSize="sm"
                fontWeight="600"
                letterSpacing="-0.01em"
              >
                ✨ Sock boxes — dropping soon
              </Box>

              <Heading
                as="h1"
                mt={5}
                fontWeight="700"
                fontSize={{ base: "3.25rem", sm: "4rem", md: "4.75rem" }}
                lineHeight="0.98"
                letterSpacing="-0.045em"
              >
                Join the{" "}
                <Box
                  as="span"
                  display="inline"
                  bgGradient="linear(90deg, #EC4899, #A855F7, #3B82F6)"
                  bgClip="text"
                >
                  socksmith
                </Box>{" "}
                Waitlist
              </Heading>

              <Text
                mt={5}
                fontSize={{ base: "md", md: "lg" }}
                color="app.muted"
                lineHeight="tall"
                maxW="28rem"
              >
                Pick the styles you love. Choose your box quantity. Be first to
                know when boxes drop.
              </Text>

              <Flex
                mt={8}
                align={{ base: "flex-start", sm: "center" }}
                direction={{ base: "column", sm: "row" }}
                gap={{ base: 3, sm: 4 }}
                flexWrap="wrap"
              >
                <Button
                  size="lg"
                  borderRadius="full"
                  bg={ctaBg}
                  color="white"
                  px={8}
                  fontWeight="700"
                  boxShadow="0 12px 28px rgba(252, 70, 60, 0.35)"
                  _hover={{ bg: ctaHover, transform: "translateY(-1px)" }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.2s ease"
                  onClick={scrollToWaitlist}
                >
                  Join Waitlist →
                </Button>
                <Text fontSize="sm" color="app.muted" fontWeight="500">
                  📦 No payment. Just dibs.
                </Text>
              </Flex>
            </MotionBox>

            {/* Right floating composition */}
            <MotionBox
              flex={{ lg: "1 1 52%" }}
              position="relative"
              w="full"
              maxW={{ base: "420px", lg: "580px" }}
              mx={{ base: "auto", lg: 0 }}
              h={{ base: "420px", sm: "480px", md: "560px" }}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {HERO_CARDS.map((card) => (
                <HeroFloatCard key={card.src} {...card} />
              ))}
            </MotionBox>
          </Flex>
        </Container>

        <HowItWorksSection />

        {/* Lookbook */}
        <Box as="section" pt={{ base: 4, md: 6 }} pb={{ base: 16, md: 24 }}>
          <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
            <Text
              fontSize="xs"
              fontWeight="700"
              letterSpacing="0.14em"
              textTransform="uppercase"
              color="#E85D4C"
            >
              The Lookbook
            </Text>
            <Heading
              as="h2"
              mt={3}
              fontWeight="700"
              fontSize={{ base: "2.5rem", md: "3.25rem" }}
              lineHeight="1.05"
              letterSpacing="-0.04em"
            >
              Socks with a point of view.
            </Heading>
            <Text
              mt={3}
              fontSize={{ base: "md", md: "lg" }}
              color="app.muted"
              maxW="36rem"
              lineHeight="tall"
            >
              A peek at the campaigns, colourways and moods coming to your sock
              box.
            </Text>
          </Container>

          <Box mt={{ base: 8, md: 12 }}>
            <LookbookMarquee />
          </Box>
        </Box>

        {/* Waitlist form */}
        <Box
          as="section"
          id="waitlist"
          scrollMarginTop="96px"
          px={{ base: 4, md: 6 }}
          pb={{ base: 16, md: 20 }}
        >
          <Container maxW="container.md" px={0}>
            <WaitlistForm />
          </Container>
        </Box>

        <TestimonialsSection />
        <FaqSection />
        <SiteFooter />
      </Box>
    </Box>
  );
}
