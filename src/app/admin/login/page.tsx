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
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

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
    <Box minH="100vh" bg={BRAND.black} display="flex" alignItems="center" py={12} px={4}>
      <Container maxW="sm" w="full">
        <Box
          as="form"
          onSubmit={onSubmit}
          borderRadius="xl"
          borderWidth="1px"
          borderColor="whiteAlpha.100"
          bg="whiteAlpha.50"
          backdropFilter="blur(8px)"
          p={{ base: 6, md: 8 }}
        >
          <Stack spacing={6}>
            <Stack spacing={1}>
              <HStack spacing={2} align="center">
                <LockIcon color="whiteAlpha.700" boxSize={4} />
                <Heading size="md" color="white" fontWeight="700" letterSpacing="-0.02em">
                  Admin
                </Heading>
              </HStack>
              <Text fontSize="sm" color="whiteAlpha.600">
                Socksmith · password from <code style={{ opacity: 0.9 }}>ADMIN_PASSWORD</code>
              </Text>
            </Stack>

            {configError ? (
              <Alert status="error" borderRadius="md" size="sm">
                <AlertIcon />
                Set ADMIN_JWT_SECRET (32+ chars), ADMIN_PASSWORD, and Supabase keys in .env.local.
              </Alert>
            ) : null}

            {error ? (
              <Alert status="error" borderRadius="md" size="sm">
                <AlertIcon />
                {error}
              </Alert>
            ) : null}

            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="600" color="whiteAlpha.800" mb={1.5}>
                Password
              </FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                autoComplete="current-password"
                size="md"
                borderRadius="md"
                borderColor="whiteAlpha.200"
                bg="blackAlpha.400"
                color="white"
                _placeholder={{ color: "whiteAlpha.400" }}
                _hover={{ borderColor: "whiteAlpha.300" }}
                _focus={{
                  borderColor: "whiteAlpha.400",
                  boxShadow: "none",
                }}
              />
            </FormControl>

            <Button
              type="submit"
              size="md"
              borderRadius="md"
              fontWeight="700"
              bg={BRAND.red}
              color="white"
              _hover={{ bg: BRAND.pinkDark }}
              _active={{ bg: BRAND.red }}
              isLoading={loading}
              loadingText="Signing in"
            >
              Sign in
            </Button>

            <Button
              as={Link}
              href="/"
              variant="link"
              size="sm"
              color="whiteAlpha.500"
              fontWeight="500"
              _hover={{ color: "whiteAlpha.800", textDecoration: "none" }}
            >
              ← Back to site
            </Button>
          </Stack>
        </Box>
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
