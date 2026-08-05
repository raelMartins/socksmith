"use client";

import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Flex,
  HStack,
  Link,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";

const CONTACT = {
  email: "socksmith01@gmail.com",
  phone: "+234 705 248 1376",
  phoneHref: "tel:+2347052481376",
  instagram: "@socksmithhq",
  instagramHref: "https://instagram.com/socksmithhq",
} as const;

function InstagramIcon({ color }: { color: string }) {
  return (
    <Box as="span" display="inline-flex" boxSize="16px" color={color} aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    </Box>
  );
}

export function SiteFooter() {
  const footerBg = useColorModeValue(
    "rgba(255, 255, 255, 0.55)",
    "rgba(17, 17, 17, 0.55)",
  );
  const muted = useColorModeValue("ink.500", "whiteAlpha.600");
  const strong = useColorModeValue("ink.900", "socksmith.cream");
  const linkHover = useColorModeValue("ink.700", "white");
  const border = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
  const iconColor = useColorModeValue("ink.500", "whiteAlpha.600");

  return (
    <Box
      as="footer"
      borderTopWidth="1px"
      borderColor={border}
      bg={footerBg}
      backdropFilter="blur(10px)"
    >
      <Container maxW="container.content" px={{ base: 4, md: 6 }} pt={{ base: 12, md: 16 }} pb={8}>
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          spacing={{ base: 10, md: 8 }}
          mb={{ base: 12, md: 16 }}
        >
          <VStack align="flex-start" spacing={3} maxW="280px">
            <HStack spacing={2.5}>
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
                />
              </Box>
              <Text
                fontFamily="heading"
                fontWeight="700"
                fontSize="lg"
                letterSpacing="-0.03em"
                color={strong}
              >
                socksmith
              </Text>
            </HStack>
            <Text fontSize="sm" color={muted} lineHeight="tall">
              Curated sock boxes for feet with personality.
            </Text>
          </VStack>

          <VStack align="flex-start" spacing={3}>
            <Text fontSize="sm" fontWeight="700" color={strong}>
              Navigate
            </Text>
            <VStack align="flex-start" spacing={2}>
              <Link
                href="#"
                fontSize="sm"
                color={muted}
                _hover={{ color: linkHover, textDecoration: "none" }}
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Home
              </Link>
              <Link
                href="#waitlist"
                fontSize="sm"
                color={muted}
                _hover={{ color: linkHover, textDecoration: "none" }}
              >
                Join waitlist
              </Link>
            </VStack>
          </VStack>

          <VStack align="flex-start" spacing={3}>
            <Text fontSize="sm" fontWeight="700" color={strong}>
              Say hi
            </Text>
            <VStack align="flex-start" spacing={2.5}>
              <Link
                href={`mailto:${CONTACT.email}`}
                display="inline-flex"
                alignItems="center"
                gap={2.5}
                fontSize="sm"
                color={muted}
                _hover={{ color: linkHover, textDecoration: "none" }}
              >
                <EmailIcon boxSize={3.5} color={iconColor} />
                {CONTACT.email}
              </Link>
              <Link
                href={CONTACT.phoneHref}
                display="inline-flex"
                alignItems="center"
                gap={2.5}
                fontSize="sm"
                color={muted}
                _hover={{ color: linkHover, textDecoration: "none" }}
              >
                <PhoneIcon boxSize={3.5} color={iconColor} />
                {CONTACT.phone}
              </Link>
              <Link
                href={CONTACT.instagramHref}
                isExternal
                display="inline-flex"
                alignItems="center"
                gap={2.5}
                fontSize="sm"
                color={muted}
                _hover={{ color: linkHover, textDecoration: "none" }}
              >
                <InstagramIcon color={iconColor} />
                {CONTACT.instagram}
              </Link>
            </VStack>
          </VStack>
        </SimpleGrid>

        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align={{ base: "flex-start", sm: "center" }}
          gap={2}
          pt={6}
          borderTopWidth="1px"
          borderColor={border}
        >
          <Text fontSize="xs" color={muted}>
            © {new Date().getFullYear()} socksmith. All rights reserved.
          </Text>
          <Text fontSize="xs" color={muted}>
            Made with warm feet.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}
