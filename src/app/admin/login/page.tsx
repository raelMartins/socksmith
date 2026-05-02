"use client";

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const configError = params.get("error") === "config";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(typeof body.error === "string" ? body.error : "Login failed.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <Box
      minH="100vh"
      position="relative"
      overflow="hidden"
      bg="linear-gradient(165deg, #0f172a 0%, #1e1b4b 42%, #431407 100%)"
    >
      <Box
        position="absolute"
        inset={0}
        opacity={0.45}
        bg="radial-gradient(ellipse 80% 50% at 20% 0%, rgba(232,93,4,0.35), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 20%, rgba(168,85,247,0.25), transparent 50%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        top="-20%"
        right="-10%"
        w="480px"
        h="480px"
        borderRadius="full"
        bg="whiteAlpha.50"
        filter="blur(80px)"
        pointerEvents="none"
      />

      <Container maxW="md" position="relative" py={{ base: 16, md: 24 }} zIndex={1}>
        <Stack spacing={8}>
          <Stack spacing={3} textAlign="center" color="white">
            <Box
              alignSelf="center"
              w={14}
              h={14}
              borderRadius="2xl"
              bg="whiteAlpha.200"
              backdropFilter="blur(12px)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderWidth="1px"
              borderColor="whiteAlpha.300"
            >
              <LockIcon boxSize={7} color="orange.200" />
            </Box>
            <Heading size="xl" letterSpacing="-0.04em" fontWeight="800">
              Socksmith
            </Heading>
            <Text fontSize="sm" color="whiteAlpha.800" fontWeight="500" maxW="xs" mx="auto">
              Team access only. Sign in with the password from your server environment.
            </Text>
          </Stack>

          <Box
            as="form"
            onSubmit={onSubmit}
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="whiteAlpha.200"
            bg="whiteAlpha.150"
            backdropFilter="blur(20px)"
            p={{ base: 6, md: 8 }}
            boxShadow="0 24px 80px rgba(0,0,0,0.35)"
          >
            <Stack spacing={5}>
              {configError ? (
                <Alert status="error" borderRadius="xl" variant="subtle" bg="red.900" color="white">
                  <AlertIcon color="red.200" />
                  Set <strong>ADMIN_JWT_SECRET</strong> (32+ chars), <strong>ADMIN_PASSWORD</strong>, and
                  Supabase keys in <strong>.env.local</strong>.
                </Alert>
              ) : null}

              {error ? (
                <Alert status="error" borderRadius="xl" variant="subtle" bg="red.900" color="white">
                  <AlertIcon color="red.200" />
                  {error}
                </Alert>
              ) : null}

              <FormControl isRequired>
                <FormLabel fontWeight="700" color="whiteAlpha.900">
                  Password
                </FormLabel>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none" color="whiteAlpha.600">
                    <LockIcon />
                  </InputLeftElement>
                  <Input
                    type="password"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    autoComplete="current-password"
                    borderRadius="xl"
                    borderColor="whiteAlpha.300"
                    bg="blackAlpha.300"
                    color="white"
                    _placeholder={{ color: "whiteAlpha.500" }}
                    _hover={{ borderColor: "whiteAlpha.400" }}
                    _focus={{
                      borderColor: "orange.300",
                      boxShadow: "0 0 0 1px rgba(251, 146, 60, 0.45)",
                    }}
                  />
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                size="lg"
                borderRadius="xl"
                fontWeight="800"
                bg="orange.400"
                color="gray.900"
                _hover={{ bg: "orange.300" }}
                _active={{ bg: "orange.500" }}
                isLoading={loading}
                loadingText="Signing in"
              >
                Continue to dashboard
              </Button>

              <Button
                as={Link}
                href="/"
                variant="ghost"
                color="whiteAlpha.800"
                _hover={{ bg: "whiteAlpha.100", color: "white" }}
                size="sm"
              >
                ← Back to public site
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
