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
import {
  DROP_FOCUS_OPTIONS,
  HEAR_ABOUT_OPTIONS,
  SHOE_SIZE_OPTIONS,
  SOCK_INTEREST_OPTIONS,
  type DropFocusOption,
  type HearAboutOption,
  type ShoeSizeOption,
  type SockInterestOption,
} from "@/lib/waitlist-options";
import { PhysicsBubbleField } from "./PhysicsBubbleField";

const MotionBox = motion(Box);

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 56 : -56, opacity: 0, filter: "blur(6px)" }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0, filter: "blur(4px)" }),
};

const STEP_KEYS = [
  "welcome",
  "name",
  "email",
  "phone",
  "instagram",
  "hear",
  "interests",
  "shoe",
  "drop",
  "note",
  "submit",
] as const;

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
  const [instagram, setInstagram] = useState("");
  const [hearAbout, setHearAbout] = useState<HearAboutOption | "">("");
  const [interests, setInterests] = useState<SockInterestOption[]>([]);
  const [shoeSize, setShoeSize] = useState<ShoeSizeOption | "">("");
  const [dropFocus, setDropFocus] = useState<DropFocusOption | "">("");
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
    setInstagram("");
    setHearAbout("");
    setInterests([]);
    setShoeSize("");
    setDropFocus("");
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
      case "instagram":
        return true;
      case "hear":
        return Boolean(hearAbout);
      case "interests":
        return interests.length > 0;
      case "shoe":
        return Boolean(shoeSize);
      case "drop":
        return Boolean(dropFocus);
      case "note":
        return true;
      case "submit":
        return true;
      default:
        return false;
    }
  }, [
    stepKey,
    fullName,
    emailOk,
    phone,
    hearAbout,
    interests.length,
    shoeSize,
    dropFocus,
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

    setLoading(true);
    const { error } = await supabase.from(WAITLIST_TABLE).insert({
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      instagram_handle: instagram.trim() || null,
      hear_about_us: hearAbout,
      sock_interests: interests,
      shoe_size: shoeSize || null,
      drop_focus: dropFocus || null,
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
    instagram,
    hearAbout,
    interests,
    shoeSize,
    dropFocus,
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
      case "instagram":
        return (
          <VStack spacing={6} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="700" color="whiteAlpha.600" letterSpacing="0.12em">
                STEP {stepIndex} / {maxStep}
              </Text>
              <Heading size="lg" mt={3} letterSpacing="-0.03em" color="white">
                Instagram handle{" "}
                <Text as="span" fontSize="md" color="whiteAlpha.500" fontWeight="500">
                  (optional)
                </Text>
              </Heading>
              <Text color="whiteAlpha.700" mt={2} fontSize="sm">
                If you share it, we might tag you in a story — never without checking first.
              </Text>
            </Box>
            <FormControl>
              <FormLabel color="whiteAlpha.800" fontWeight="600">
                @handle
              </FormLabel>
              <Input
                size="lg"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && next()}
                placeholder="@yourhandle"
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
      case "hear":
        return (
          <VStack spacing={5} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="700" color="whiteAlpha.600" letterSpacing="0.12em">
                STEP {stepIndex} / {maxStep}
              </Text>
              <Heading size="lg" mt={3} letterSpacing="-0.03em" color="white">
                Where did you hear about Socksmith?
              </Heading>
              <Text color="whiteAlpha.700" mt={2} fontSize="sm">
                Tell us where you first ran into Socksmith — it helps us show up in the right
                corners of the internet (and real life).
              </Text>
            </Box>
            <PhysicsBubbleField
              labels={HEAR_ABOUT_OPTIONS}
              mode="single"
              selectedSingle={hearAbout || undefined}
              onToggle={(id) => setHearAbout(id as HearAboutOption)}
              height={360}
            />
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
                Which sock styles are you curious about?
              </Heading>
              <Text color="whiteAlpha.700" mt={2} fontSize="sm">
                Nudge whatever feels closest — pick as many as you like. Bubbles bump, drift, and
                shove each other when you grab one.
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
      case "shoe":
        return (
          <VStack spacing={5} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="700" color="whiteAlpha.600" letterSpacing="0.12em">
                STEP {stepIndex} / {maxStep}
              </Text>
              <Heading size="lg" mt={3} letterSpacing="-0.03em" color="white">
                What size range do you usually wear?
              </Heading>
              <Text color="whiteAlpha.700" mt={2} fontSize="sm">
                Rough ranges are perfect — it tells us who the first grading should fit best.
              </Text>
            </Box>
            <PhysicsBubbleField
              labels={SHOE_SIZE_OPTIONS}
              mode="single"
              selectedSingle={shoeSize || undefined}
              onToggle={(id) => setShoeSize(id as ShoeSizeOption)}
              height={320}
            />
          </VStack>
        );
      case "drop":
        return (
          <VStack spacing={5} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="700" color="whiteAlpha.600" letterSpacing="0.12em">
                STEP {stepIndex} / {maxStep}
              </Text>
              <Heading size="lg" mt={3} letterSpacing="-0.03em" color="white">
                For the first drop, what matters most to you?
              </Heading>
              <Text color="whiteAlpha.700" mt={2} fontSize="sm">
                One answer is enough — we balance the first drop story and the product mix from this.
              </Text>
            </Box>
            <PhysicsBubbleField
              labels={DROP_FOCUS_OPTIONS}
              mode="single"
              selectedSingle={dropFocus || undefined}
              onToggle={(id) => setDropFocus(id as DropFocusOption)}
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
                bg="whiteAlpha.150"
                borderColor="whiteAlpha.300"
                color="white"
                _placeholder={{ color: "whiteAlpha.500" }}
                _hover={{ borderColor: "whiteAlpha.500" }}
                _focus={{ borderColor: "brand.300", boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)" }}
                borderRadius="xl"
              />
            </FormControl>
          </VStack>
        );
      case "submit":
        return (
          <VStack spacing={6} align="stretch">
            <Heading size="lg" letterSpacing="-0.03em" color="white">
              You&apos;re all set
            </Heading>
            <Text color="whiteAlpha.750" fontSize="sm" lineHeight="tall">
              <Text as="span" fontWeight="700" color="whiteAlpha.900">
                {fullName.trim()}
              </Text>{" "}
              · {email.trim()} · {phone.trim()}
              {instagram.trim() ? ` · ${instagram.trim()}` : ""}
            </Text>
            <Box
              borderRadius="xl"
              bg="whiteAlpha.100"
              borderWidth="1px"
              borderColor="whiteAlpha.200"
              p={4}
              fontSize="sm"
              color="whiteAlpha.850"
              lineHeight="tall"
            >
              <Text fontWeight="700" color="white" mb={2}>
                Your picks
              </Text>
              <Text>Heard via: {hearAbout}</Text>
              <Text mt={1}>Styles: {interests.join(", ")}</Text>
              <Text mt={1}>Size: {shoeSize}</Text>
              <Text mt={1}>First drop: {dropFocus}</Text>
              {note.trim() ? <Text mt={2}>Note: {note.trim()}</Text> : null}
            </Box>
            <Button
              size="lg"
              colorScheme="brand"
              isLoading={loading}
              loadingText="Joining…"
              onClick={onSubmit}
            >
              Join the waitlist
            </Button>
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
      <Box
        position="absolute"
        inset={0}
        pointerEvents="none"
        bgGradient="radial(circle at 20% 20%, rgba(232,23,15,0.18), transparent 45%)"
      />
      <Box
        position="absolute"
        inset={0}
        pointerEvents="none"
        bgGradient="radial(circle at 80% 70%, rgba(26,86,219,0.16), transparent 50%)"
      />

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
        <Box w="full" maxW="lg" position="relative">
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

          {stepKey !== "welcome" && stepKey !== "submit" ? (
            <HStack justify="space-between" mt={8} spacing={4}>
              <Button variant="ghost" color="whiteAlpha.800" onClick={back}>
                Back
              </Button>
              <Button colorScheme="brand" onClick={next} px={8} rightIcon={<ChevronRightIcon />}>
                OK
              </Button>
            </HStack>
          ) : null}

          {stepKey === "submit" ? (
            <HStack justify="flex-start" mt={8}>
              <Button variant="ghost" color="whiteAlpha.800" onClick={back}>
                Back
              </Button>
            </HStack>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
