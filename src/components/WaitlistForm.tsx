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
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { WAITLIST_TABLE } from "@/lib/constants";

const MotionBox = motion(Box);

export function WaitlistForm() {
  const toast = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseBrowser();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      toast({
        title: "Supabase is not configured",
        description: "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.",
        status: "error",
        duration: 8000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from(WAITLIST_TABLE).insert({
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      instagram_handle: instagram.trim() || null,
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
    setInstagram("");
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
            One short form. No spam — just early access to drops, limited colorways, and
            studio notes from the workbench.
          </Text>
        </Box>

        {!supabase ? (
          <Alert status="warning" borderRadius="xl" variant="subtle">
            <AlertIcon />
            Set Supabase environment variables to enable signups. See{" "}
            <Text as="span" fontWeight="600">
              .env.example
            </Text>{" "}
            and{" "}
            <Text as="span" fontWeight="600">
              supabase/schema.sql
            </Text>
            .
          </Alert>
        ) : null}

        <Box as="form" onSubmit={onSubmit}>
          <Stack spacing={4}>
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
