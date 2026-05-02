"use client";

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
  useToast,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { WAITLIST_TABLE } from "@/lib/constants";
import {
  HEAR_ABOUT_OPTIONS,
  SOCK_INTEREST_OPTIONS,
  type HearAboutOption,
  type SockInterestOption,
} from "@/lib/waitlist-options";

const MotionBox = motion(Box);

export function WaitlistForm() {
  const toast = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [hearAbout, setHearAbout] = useState<HearAboutOption | "">("");
  const [interests, setInterests] = useState<SockInterestOption[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseBrowser();

  function toggleInterest(opt: SockInterestOption) {
    setInterests((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt],
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      toast({
        title: "Supabase is not configured",
        description:
          "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.",
        status: "error",
        duration: 8000,
        isClosable: true,
      });
      return;
    }

    if (!hearAbout) {
      toast({
        title: "Almost there",
        description: "Please tell us where you heard about Socksmith.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    if (interests.length === 0) {
      toast({
        title: "Pick your styles",
        description: "Choose at least one type of sock you are curious about.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from(WAITLIST_TABLE).insert({
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      instagram_handle: instagram.trim() || null,
      hear_about_us: hearAbout,
      sock_interests: interests,
      note: note.trim() || null,
      status: "waiting",
    });

    setLoading(false);

    if (error) {
      const duplicate = error.code === "23505";
      toast({
        title: duplicate ? "You are already on the list" : "Could not join waitlist",
        description: duplicate
          ? "This email is already registered."
          : error.message,
        status: duplicate ? "info" : "error",
        duration: 6000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "You are in.",
      description: "We will reach out when the first drop is ready.",
      status: "success",
      duration: 6000,
      isClosable: true,
    });
    setFullName("");
    setEmail("");
    setPhone("");
    setInstagram("");
    setHearAbout("");
    setInterests([]);
    setNote("");
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      borderRadius="3xl"
      borderWidth="1px"
      borderColor="glass.border"
      bg="glass.bg"
      backdropFilter="blur(18px)"
      p={{ base: 6, md: 8 }}
      boxShadow="0 18px 60px rgba(15, 23, 42, 0.08)"
      _dark={{ boxShadow: "0 22px 70px rgba(0,0,0,0.35)" }}
    >
      <Stack spacing={6}>
        <Box>
          <Heading size="lg" letterSpacing="-0.02em">
            Join the waitlist
          </Heading>
          <Text mt={2} color="app.muted" fontSize="md" lineHeight="tall">
            Tell us how you found us, which silhouettes you want, and how to reach you — no
            spam, just drop news.
          </Text>
        </Box>

        {!supabase ? (
          <Alert status="warning" borderRadius="xl" variant="subtle">
            <AlertIcon />
            Set Supabase environment variables to enable signups. See{" "}
            <Text as="span" fontWeight="600">
              .env.example
            </Text>{" "}
            and run migrations in{" "}
            <Text as="span" fontWeight="600">
              supabase/migrations
            </Text>
            .
          </Alert>
        ) : null}

        <Box as="form" onSubmit={onSubmit}>
          <Stack spacing={5}>
            <FormControl isRequired>
              <FormLabel fontWeight="600">Full name</FormLabel>
              <Input
                value={fullName}
                onChange={(ev) => setFullName(ev.target.value)}
                placeholder="Alex Rivera"
                size="lg"
                autoComplete="name"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontWeight="600">Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder="you@domain.com"
                size="lg"
                autoComplete="email"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontWeight="600">Phone</FormLabel>
              <Input
                type="tel"
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
                placeholder="+1 …"
                size="lg"
                autoComplete="tel"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="600">Instagram (optional)</FormLabel>
              <Input
                value={instagram}
                onChange={(ev) => setInstagram(ev.target.value)}
                placeholder="@yourhandle"
                size="lg"
                autoComplete="off"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontWeight="600">Where did you hear about us?</FormLabel>
              <Text fontSize="sm" color="app.muted" mb={2}>
                Tap one — outline shows what is selected.
              </Text>
              <Wrap spacing={2} role="radiogroup" aria-label="Where did you hear about us">
                {HEAR_ABOUT_OPTIONS.map((opt) => {
                  const selected = hearAbout === opt;
                  return (
                    <WrapItem key={opt}>
                      <Button
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        size="sm"
                        height="auto"
                        py={2}
                        px={3}
                        borderRadius="full"
                        variant="outline"
                        fontWeight="600"
                        borderWidth="2px"
                        borderColor={selected ? "brand.500" : "blackAlpha.200"}
                        _dark={{
                          borderColor: selected ? "brand.400" : "whiteAlpha.300",
                        }}
                        bg={selected ? "whiteAlpha.400" : "transparent"}
                        _hover={{ bg: "blackAlpha.50", _dark: { bg: "whiteAlpha.50" } }}
                        onClick={() => setHearAbout(opt)}
                      >
                        {opt}
                      </Button>
                    </WrapItem>
                  );
                })}
              </Wrap>
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontWeight="600">What socks are you into?</FormLabel>
              <Text fontSize="sm" color="app.muted" mb={2}>
                Pick any that apply — selected pills fill in with color.
              </Text>
              <Wrap spacing={2}>
                {SOCK_INTEREST_OPTIONS.map((opt) => {
                  const selected = interests.includes(opt);
                  return (
                    <WrapItem key={opt}>
                      <Button
                        type="button"
                        size="sm"
                        height="auto"
                        py={2}
                        px={3}
                        borderRadius="full"
                        fontWeight="600"
                        onClick={() => toggleInterest(opt)}
                        colorScheme="brand"
                        variant={selected ? "solid" : "outline"}
                      >
                        {opt}
                      </Button>
                    </WrapItem>
                  );
                })}
              </Wrap>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="600">Note (optional)</FormLabel>
              <Textarea
                value={note}
                onChange={(ev) => setNote(ev.target.value)}
                placeholder="Sizing, shipping region, collab ideas, anything we should know…"
                borderRadius="xl"
                rows={4}
              />
            </FormControl>

            <Button
              type="submit"
              size="lg"
              colorScheme="brand"
              isLoading={loading}
              loadingText="Sending"
              mt={2}
            >
              Request access
            </Button>
          </Stack>
        </Box>
      </Stack>
    </MotionBox>
  );
}
