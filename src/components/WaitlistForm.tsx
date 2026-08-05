"use client";

import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useCallback, useMemo, useState, type FormEvent } from "react";
import {
  BOX_QUANTITY_OPTIONS,
  FAVOURITE_COLOUR_OPTIONS,
  SOCK_INTEREST_OPTIONS,
  type BoxQuantityOption,
  type FavouriteColourOption,
  type SockInterestOption,
} from "@/lib/waitlist-options";

export type WaitlistFormValues = {
  fullName: string;
  email: string;
  styles: SockInterestOption[];
  colours: FavouriteColourOption[];
  boxQuantity: BoxQuantityOption | "";
  notes: string;
};

type FieldErrors = Partial<
  Record<"fullName" | "email" | "styles" | "colours" | "boxQuantity", string>
>;

const INITIAL_VALUES: WaitlistFormValues = {
  fullName: "",
  email: "",
  styles: [],
  colours: [],
  boxQuantity: "",
  notes: "",
};

function validate(values: WaitlistFormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (values.fullName.trim().length < 2) {
    errors.fullName = "Please tell us your name";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email";
  }
  if (values.styles.length === 0) {
    errors.styles = "Pick at least one style";
  }
  if (values.colours.length === 0) {
    errors.colours = "Pick at least one colour";
  }
  if (!values.boxQuantity) {
    errors.boxQuantity = "Choose a box quantity";
  }
  return errors;
}

function toggleInList<T extends string>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function WaitlistForm() {
  const toast = useToast();
  const [values, setValues] = useState<WaitlistFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const cardBg = useColorModeValue("white", "rgba(28, 25, 23, 0.92)");
  const cardShadow = useColorModeValue(
    "0 24px 60px rgba(28, 25, 23, 0.08)",
    "0 24px 60px rgba(0, 0, 0, 0.45)",
  );
  const labelColor = useColorModeValue("ink.800", "socksmith.cream");
  const helperColor = useColorModeValue("ink.500", "whiteAlpha.600");
  const inputBg = useColorModeValue("white", "whiteAlpha.50");
  const inputBorder = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
  const inputHoverBorder = useColorModeValue("blackAlpha.300", "whiteAlpha.300");
  const inputFocusBorder = useColorModeValue("#F97316", "#FB923C");
  const pillBg = useColorModeValue("blackAlpha.50", "whiteAlpha.100");
  const pillHoverBg = useColorModeValue("blackAlpha.100", "whiteAlpha.200");
  const pillActiveBg = useColorModeValue("rgba(249, 115, 22, 0.12)", "rgba(251, 146, 60, 0.2)");
  const pillActiveBorder = useColorModeValue("#F97316", "#FB923C");
  const swatchDotBorder = useColorModeValue("blackAlpha.150", "whiteAlpha.300");
  const menuBg = useColorModeValue("white", "gray.800");
  const ctaBg = useColorModeValue("#FC463C", "#FC463C");
  const ctaHover = "#E53A31";
  const successBg = useColorModeValue("rgba(15, 76, 117, 0.08)", "rgba(45, 212, 191, 0.12)");
  const successBorder = useColorModeValue("rgba(15, 76, 117, 0.2)", "rgba(45, 212, 191, 0.3)");

  const inputStyles = useMemo(
    () => ({
      bg: inputBg,
      borderWidth: "1px",
      borderColor: inputBorder,
      borderRadius: "full",
      h: "48px",
      px: 5,
      fontSize: "md",
      color: labelColor,
      _placeholder: { color: helperColor },
      _hover: { borderColor: inputHoverBorder },
      _focus: {
        borderColor: inputFocusBorder,
        boxShadow: `0 0 0 1px ${inputFocusBorder}`,
        bg: inputBg,
      },
      _dark: { bg: inputBg },
    }),
    [
      helperColor,
      inputBg,
      inputBorder,
      inputFocusBorder,
      inputHoverBorder,
      labelColor,
    ],
  );

  const syncErrors = useCallback(
    (next: WaitlistFormValues, show: boolean) => {
      if (!show) {
        setErrors({});
        return;
      }
      setErrors(validate(next));
    },
    [],
  );

  const update = useCallback(
    <K extends keyof WaitlistFormValues>(key: K, value: WaitlistFormValues[K]) => {
      setValues((prev) => {
        const next = { ...prev, [key]: value };
        syncErrors(next, submittedOnce);
        return next;
      });
    },
    [submittedOnce, syncErrors],
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmittedOnce(true);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          styles: values.styles,
          colours: values.colours,
          boxQuantity: values.boxQuantity,
          notes: values.notes.trim(),
        }),
      });

      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        fieldErrors?: FieldErrors;
      };

      if (!res.ok) {
        if (body.fieldErrors) {
          setErrors(body.fieldErrors);
        }
        toast({
          title: "Couldn’t join just yet",
          description:
            body.error ?? "Something went wrong. Please try again.",
          status: "error",
          variant: "socksmith",
        });
        return;
      }

      setSuccess(true);
      setValues(INITIAL_VALUES);
      setErrors({});
      setSubmittedOnce(false);
      toast({
        title: "You’re on the list",
        description: "We’ll email you when sock boxes drop.",
        status: "success",
        variant: "socksmith",
      });
    } catch {
      toast({
        title: "Network error",
        description: "Check your connection and try again.",
        status: "error",
        variant: "socksmith",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      noValidate
      position="relative"
      borderRadius="32px"
      bg={cardBg}
      boxShadow={cardShadow}
      overflow="hidden"
      borderWidth="1px"
      borderColor="glass.border"
    >
      <Box
        h="3px"
        w="full"
        bgGradient="linear(to-r, #EC4899, #A855F7, #3B82F6)"
        aria-hidden
      />

      <Box px={{ base: 5, sm: 8, md: 10 }} py={{ base: 8, md: 10 }}>
        <VStack spacing={1} textAlign="center" mb={{ base: 8, md: 10 }}>
          <Text
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.14em"
            textTransform="uppercase"
            color="#E85D4C"
          >
            Waitlist
          </Text>
          <Heading
            as="h2"
            fontWeight="700"
            fontSize={{ base: "2xl", md: "3xl" }}
            letterSpacing="-0.03em"
            color={labelColor}
          >
            Build Your Sock Box Interest
          </Heading>
          <Text color={helperColor} fontSize={{ base: "sm", md: "md" }}>
            Takes 30 seconds. No payment required.
          </Text>
        </VStack>

        {success ? (
          <Box
            mb={{ base: 6, md: 8 }}
            px={5}
            py={4}
            borderRadius="2xl"
            bg={successBg}
            borderWidth="1px"
            borderColor={successBorder}
            textAlign="center"
          >
            <Text fontWeight="700" color={labelColor}>
              You’re on the waitlist
            </Text>
            <Text mt={1} fontSize="sm" color={helperColor}>
              We’ll email you when the first sock boxes drop. No spam — just the
              launch.
            </Text>
            <Button
              mt={4}
              size="sm"
              borderRadius="full"
              variant="outline"
              borderColor={pillActiveBorder}
              color={labelColor}
              onClick={() => setSuccess(false)}
            >
              Submit another response
            </Button>
          </Box>
        ) : null}

        <VStack
          spacing={{ base: 6, md: 7 }}
          align="stretch"
          opacity={success ? 0.55 : 1}
          pointerEvents={success ? "none" : "auto"}
          aria-hidden={success}
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, md: 4 }}>
            <FormControl isInvalid={Boolean(errors.fullName)}>
              <FormLabel
                fontSize="sm"
                fontWeight="600"
                color={labelColor}
                mb={2}
              >
                Full name
              </FormLabel>
              <Input
                {...inputStyles}
                name="fullName"
                autoComplete="name"
                placeholder="Alex Morgan"
                value={values.fullName}
                onChange={(e) => update("fullName", e.target.value)}
              />
              <FormErrorMessage>{errors.fullName}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={Boolean(errors.email)}>
              <FormLabel
                fontSize="sm"
                fontWeight="600"
                color={labelColor}
                mb={2}
              >
                Email
              </FormLabel>
              <Input
                {...inputStyles}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@email.com"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <FormControl isInvalid={Boolean(errors.styles)}>
            <FormLabel
              fontSize="sm"
              fontWeight="600"
              color={labelColor}
              mb={1}
            >
              Sock style interest
            </FormLabel>
            <FormHelperText mt={0} mb={3} color={helperColor} fontSize="sm">
              Pick all that apply.
            </FormHelperText>
            <Wrap spacing={2.5}>
              {SOCK_INTEREST_OPTIONS.map((style) => {
                const active = values.styles.includes(style);
                return (
                  <WrapItem key={style}>
                    <Button
                      type="button"
                      size="md"
                      borderRadius="full"
                      fontWeight="600"
                      px={5}
                      bg={active ? pillActiveBg : pillBg}
                      color={labelColor}
                      borderWidth="1.5px"
                      borderColor={active ? pillActiveBorder : "transparent"}
                      _hover={{
                        bg: active ? pillActiveBg : pillHoverBg,
                      }}
                      onClick={() =>
                        update("styles", toggleInList(values.styles, style))
                      }
                      aria-pressed={active}
                    >
                      {style}
                    </Button>
                  </WrapItem>
                );
              })}
            </Wrap>
            <FormErrorMessage>{errors.styles}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={Boolean(errors.colours)}>
            <FormLabel
              fontSize="sm"
              fontWeight="600"
              color={labelColor}
              mb={1}
            >
              Favourite colours
            </FormLabel>
            <FormHelperText mt={0} mb={3} color={helperColor} fontSize="sm">
              Tap any colours you&apos;d love in your box.
            </FormHelperText>
            <Wrap spacing={2.5}>
              {FAVOURITE_COLOUR_OPTIONS.map((colour) => {
                const active = values.colours.includes(colour.label);
                return (
                  <WrapItem key={colour.label}>
                    <Button
                      type="button"
                      borderRadius="full"
                      fontWeight="600"
                      fontSize="sm"
                      h="42px"
                      px={4}
                      w="auto"
                      maxW="max-content"
                      bg={active ? pillActiveBg : pillBg}
                      color={labelColor}
                      borderWidth="1.5px"
                      borderColor={active ? pillActiveBorder : "transparent"}
                      _hover={{
                        bg: active ? pillActiveBg : pillHoverBg,
                      }}
                      onClick={() =>
                        update(
                          "colours",
                          toggleInList(values.colours, colour.label),
                        )
                      }
                      aria-pressed={active}
                      leftIcon={
                        <Box
                          as="span"
                          boxSize="14px"
                          borderRadius="full"
                          bg={colour.hex}
                          borderWidth="1px"
                          borderColor={swatchDotBorder}
                          flexShrink={0}
                        />
                      }
                      sx={{
                        "& .chakra-button__icon": { mr: 2 },
                      }}
                    >
                      {colour.label}
                    </Button>
                  </WrapItem>
                );
              })}
            </Wrap>
            <FormErrorMessage>{errors.colours}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={Boolean(errors.boxQuantity)}>
            <FormLabel
              fontSize="sm"
              fontWeight="600"
              color={labelColor}
              mb={2}
            >
              Number of boxes
            </FormLabel>
            <Menu matchWidth gutter={6}>
              <MenuButton
                as={Button}
                type="button"
                w="full"
                h="48px"
                px={5}
                borderRadius="full"
                fontWeight="500"
                textAlign="left"
                justifyContent="space-between"
                rightIcon={<ChevronDownIcon boxSize={5} color={helperColor} />}
                bg={inputBg}
                color={values.boxQuantity ? labelColor : helperColor}
                borderWidth="1px"
                borderColor={
                  errors.boxQuantity ? "red.400" : inputBorder
                }
                _hover={{
                  bg: inputBg,
                  borderColor: inputHoverBorder,
                }}
                _active={{ bg: inputBg }}
                _expanded={{
                  borderColor: inputFocusBorder,
                  boxShadow: `0 0 0 1px ${inputFocusBorder}`,
                }}
              >
                {values.boxQuantity || "Choose quantity"}
              </MenuButton>
              <MenuList
                bg={menuBg}
                borderColor="glass.border"
                borderRadius="2xl"
                py={2}
                boxShadow="0 16px 40px rgba(28, 25, 23, 0.12)"
                overflow="hidden"
              >
                {BOX_QUANTITY_OPTIONS.map((option) => (
                  <MenuItem
                    key={option}
                    fontWeight="500"
                    py={3}
                    px={5}
                    bg="transparent"
                    _hover={{ bg: pillBg }}
                    _focus={{ bg: pillBg }}
                    onClick={() => update("boxQuantity", option)}
                  >
                    {option}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <FormErrorMessage>{errors.boxQuantity}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel
              fontSize="sm"
              fontWeight="600"
              color={labelColor}
              mb={2}
            >
              Optional notes
            </FormLabel>
            <Textarea
              name="notes"
              placeholder="Tell us what kind of socks you'd love to see"
              value={values.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={4}
              resize="vertical"
              bg={inputBg}
              borderWidth="1px"
              borderColor={inputBorder}
              borderRadius="2xl"
              px={5}
              py={4}
              fontSize="md"
              color={labelColor}
              _placeholder={{ color: helperColor }}
              _hover={{ borderColor: inputHoverBorder }}
              _focus={{
                borderColor: inputFocusBorder,
                boxShadow: `0 0 0 1px ${inputFocusBorder}`,
                bg: inputBg,
              }}
            />
          </FormControl>

          <Box pt={1}>
            <Button
              type="submit"
              w="full"
              h="52px"
              borderRadius="full"
              bg={ctaBg}
              color="white"
              fontWeight="700"
              fontSize="md"
              boxShadow="0 12px 28px rgba(252, 70, 60, 0.32)"
              isLoading={loading}
              loadingText="Joining…"
              isDisabled={loading || success}
              _hover={{ bg: ctaHover, transform: "translateY(-1px)" }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s ease"
            >
              Join the Waitlist ✈️
            </Button>
            <Text
              mt={3}
              textAlign="center"
              fontSize="xs"
              color={helperColor}
              lineHeight="tall"
            >
              By joining, you agree to occasional emails. Unsubscribe any time.
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
