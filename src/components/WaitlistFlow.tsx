"use client";

import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  CloseButton,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Progress,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { WAITLIST_TABLE } from "@/lib/constants";
import { SOCK_INTEREST_OPTIONS, type SockInterestOption } from "@/lib/waitlist-options";
import { PhysicsBubbleField } from "./PhysicsBubbleField";
import { WaitlistAnimatedGridBackground } from "./WaitlistAnimatedGridBackground";
import { WaitlistSockGallery } from "./WaitlistSockGallery";

const MotionBox = motion(Box);

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 56 : -56, opacity: 0, filter: "blur(6px)" }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0, filter: "blur(4px)" }),
};

const STEP_KEYS = ["welcome", "name", "email", "phone", "interests", "note"] as const;

function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

export type WaitlistFlowProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function WaitlistFlow({ isOpen, onClose }: WaitlistFlowProps) {
  const toast = useToast();
  const supabase = getSupabaseBrowser();
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interests, setInterests] = useState<SockInterestOption[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    setStepIndex(0);
    setDirection(1);
    setFullName("");
    setEmail("");
    setPhone("");
    setInterests([]);
    setNote("");
    setLoading(false);
  }, [isOpen]);

  const stepKey = STEP_KEYS[stepIndex] ?? "welcome";
  const maxStep = STEP_KEYS.length - 1;
  const progress = maxStep > 0 ? (stepIndex / maxStep) * 100 : 0;

  const go = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setStepIndex(Math.max(0, Math.min(maxStep, next)));
  }, [maxStep]);

  const toggleInterest = useCallback((opt: SockInterestOption) => {
    setInterests((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt],
    );
  }, []);

  const emailOk = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), [email]);

  const canAdvance = useCallback((): boolean => {
    switch (stepKey) {
      case "welcome":
        return true;
      case "name":
        return fullName.trim().length >= 2;
      case "email":
        return emailOk;
      case "phone":
        return phone.trim().length >= 6;
      case "interests":
        return interests.length > 0;
      case "note":
        return true;
      default:
        return false;
    }
  }, [
    stepKey,
    fullName,
    emailOk,
    phone,
    interests.length,
  ]);

  const next = useCallback(() => {
    if (!canAdvance()) {
      toast({
        title: "One more thing",
        description: "Fill this step before continuing.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    go(stepIndex + 1, 1);
  }, [canAdvance, go, stepIndex, toast]);

  const back = useCallback(() => {
    if (stepIndex <= 0) return;
    go(stepIndex - 1, -1);
  }, [go, stepIndex]);

  const onSubmit = useCallback(async () => {
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

    if (interests.length === 0) {
      toast({
        title: "Pick your styles",
        description: "Choose at least one interest before joining.",
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
    onClose();
  }, [
    supabase,
    fullName,
    email,
    phone,
    interests,
    note,
    toast,
    onClose,
  ]);

  if (!isOpen) return null;

  const stepContent = (() => {
    switch (stepKey) {
      case "welcome":
        return (
          <VStack spacing={6} align="stretch" textAlign="center" py={2}>
            <Heading size="xl" letterSpacing="-0.04em" color="white">
              Join the waitlist
            </Heading>
            <Text color="whiteAlpha.800" fontSize="lg" lineHeight="tall" fontWeight="500">
              This is a short set of questions to join the waitlist for our first drop. It takes
              about a minute—then you are on the list.
            </Text>
            <WaitlistSockGallery />
            <Button
              size="lg"
              colorScheme="brand"
              onClick={next}
              alignSelf="center"
              px={10}
              mt={2}
            >
              Let&apos;s go
            </Button>
          </VStack>
        );
      case "name":
        return (
          <VStack spacing={6} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="700" color="whiteAlpha.600" letterSpacing="0.12em">
                STEP {stepIndex} / {maxStep}
              </Text>
              <Heading size="lg" mt={3} letterSpacing="-0.03em" color="white">
                What should we call you?
              </Heading>
            </Box>
            <FormControl>
              <FormLabel color="whiteAlpha.800" fontWeight="600">
                Full name
              </FormLabel>
              <Input
                size="lg"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && next()}
                placeholder="Alex Rivera"
                autoFocus
                bg="whiteAlpha.150"
                borderColor="whiteAlpha.300"
                color="white"
                _placeholder={{ color: "whiteAlpha.500" }}
                _hover={{ borderColor: "whiteAlpha.500" }}
                _focus={{ borderColor: "brand.300", boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)" }}
              />
            </FormControl>
          </VStack>
        );
      case "email":
        return (
          <VStack spacing={6} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="700" color="whiteAlpha.600" letterSpacing="0.12em">
                STEP {stepIndex} / {maxStep}
              </Text>
              <Heading size="lg" mt={3} letterSpacing="-0.03em" color="white">
                Where can we email you?
              </Heading>
            </Box>
            <FormControl>
              <FormLabel color="whiteAlpha.800" fontWeight="600">
                Email
              </FormLabel>
              <Input
                type="email"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && next()}
                placeholder="you@domain.com"
                autoFocus
                bg="whiteAlpha.150"
                borderColor="whiteAlpha.300"
                color="white"
                _placeholder={{ color: "whiteAlpha.500" }}
                _hover={{ borderColor: "whiteAlpha.500" }}
                _focus={{ borderColor: "brand.300", boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)" }}
              />
            </FormControl>
          </VStack>
        );
      case "phone":
        return (
          <VStack spacing={6} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="700" color="whiteAlpha.600" letterSpacing="0.12em">
                STEP {stepIndex} / {maxStep}
              </Text>
              <Heading size="lg" mt={3} letterSpacing="-0.03em" color="white">
                Best number for a quick text?
              </Heading>
            </Box>
            <FormControl>
              <FormLabel color="whiteAlpha.800" fontWeight="600">
                Phone
              </FormLabel>
              <Input
                type="tel"
                size="lg"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && next()}
                placeholder="+1 …"
                autoFocus
                bg="whiteAlpha.150"
                borderColor="whiteAlpha.300"
                color="white"
                _placeholder={{ color: "whiteAlpha.500" }}
                _hover={{ borderColor: "whiteAlpha.500" }}
                _focus={{ borderColor: "brand.300", boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)" }}
              />
            </FormControl>
          </VStack>
        );
      case "interests":
        return (
          <VStack spacing={5} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="700" color="whiteAlpha.600" letterSpacing="0.12em">
                STEP {stepIndex} / {maxStep}
              </Text>
              <Heading size="lg" mt={3} letterSpacing="-0.03em" color="white">
                What are you most interested in?
              </Heading>
              <Text color="whiteAlpha.700" mt={2} fontSize="sm">
                Pick as many as you like — bubbles bump and drift when you grab one.
              </Text>
            </Box>
            <PhysicsBubbleField
              labels={SOCK_INTEREST_OPTIONS}
              mode="multi"
              selectedMulti={interests}
              onToggle={(id) => toggleInterest(id as SockInterestOption)}
              height={300}
            />
          </VStack>
        );
      case "note":
        return (
          <VStack spacing={6} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="700" color="whiteAlpha.600" letterSpacing="0.12em">
                STEP {stepIndex} / {maxStep}
              </Text>
              <Heading size="lg" mt={3} letterSpacing="-0.03em" color="white">
                Anything else we should know?
              </Heading>
              <Text color="whiteAlpha.700" mt={2} fontSize="sm">
                Sizing quirks, shipping country, collab ideas — optional.
              </Text>
            </Box>
            <FormControl>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note…"
                rows={4}
                bg="rgba(255,255,255,0.06)"
                backdropFilter="blur(12px)"
                borderWidth="1px"
                borderColor="whiteAlpha.250"
                color="white"
                _placeholder={{ color: "whiteAlpha.500" }}
                _hover={{
                  bg: "rgba(255,255,255,0.09)",
                  borderColor: "whiteAlpha.400",
                }}
                _focus={{
                  bg: "rgba(255,255,255,0.1)",
                  borderColor: "brand.400",
                  boxShadow: "0 0 0 1px rgba(232, 23, 15, 0.45)",
                }}
                borderRadius="xl"
              />
            </FormControl>
            {!supabase ? (
              <Text fontSize="xs" color="orange.200">
                Supabase env vars missing — signups disabled until configured.
              </Text>
            ) : null}
          </VStack>
        );
      default:
        return null;
    }
  })();

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={2000}
      display="flex"
      flexDirection="column"
      bg="rgba(8, 8, 12, 0.45)"
      backdropFilter="blur(22px) saturate(140%)"
      sx={{
        "@supports not (backdrop-filter: blur(1px))": {
          bg: "rgba(8, 8, 12, 0.88)",
        },
      }}
    >
      <WaitlistAnimatedGridBackground />

      <HStack justify="space-between" align="center" px={{ base: 4, md: 8 }} py={4} position="relative">
        <Text fontSize="xs" fontWeight="800" letterSpacing="0.2em" color="whiteAlpha.600">
          SOCKSMITH
        </Text>
        <CloseButton
          size="lg"
          color="whiteAlpha.800"
          _hover={{ bg: "whiteAlpha.150" }}
          onClick={onClose}
          aria-label="Close waitlist"
        />
      </HStack>

      <Box px={{ base: 4, md: 10 }} pb={2} position="relative">
        <Progress
          value={progress}
          size="xs"
          borderRadius="full"
          bg="whiteAlpha.150"
          sx={{ "& > div": { background: "linear-gradient(90deg, #E8170F, #D62D78)" } }}
        />
      </Box>

      <Box flex={1} display="flex" alignItems="center" justifyContent="center" px={4} pb={10} overflowY="auto">
        <Box w="full" maxW={stepKey === "welcome" ? { base: "full", md: "3xl" } : "lg"} position="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <MotionBox
              key={stepKey}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              borderRadius="3xl"
              borderWidth="1px"
              borderColor="whiteAlpha.200"
              bg="rgba(12, 12, 18, 0.55)"
              backdropFilter="blur(16px)"
              p={{ base: 6, md: 10 }}
              boxShadow="0 32px 100px rgba(0,0,0,0.45)"
            >
              {stepContent}
            </MotionBox>
          </AnimatePresence>

          {stepKey !== "welcome" ? (
            <HStack justify="space-between" mt={8} spacing={4} flexWrap="wrap">
              <Button variant="ghost" color="whiteAlpha.800" onClick={back}>
                Back
              </Button>
              {stepKey === "note" ? (
                <Button
                  colorScheme="brand"
                  size="lg"
                  px={8}
                  isLoading={loading}
                  loadingText="Joining…"
                  onClick={onSubmit}
                >
                  Join the waitlist
                </Button>
              ) : (
                <Button colorScheme="brand" onClick={next} px={8} rightIcon={<ChevronRightIcon />}>
                  OK
                </Button>
              )}
            </HStack>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
