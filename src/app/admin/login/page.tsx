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
  Stack,
  Text,
} from "@chakra-ui/react";
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
    <Container maxW="md" py={{ base: 16, md: 24 }}>
      <Stack spacing={8}>
        <Box>
          <Button as={Link} href="/" variant="link" colorScheme="brand" px={0} mb={4}>
            ← Back to site
          </Button>
          <Heading size="xl" letterSpacing="-0.03em">
            Admin sign-in
          </Heading>
          <Text mt={3} color="app.muted">
            Enter the password configured in <Text as="span" fontWeight="700">ADMIN_PASSWORD</Text>.
          </Text>
        </Box>

        {configError ? (
          <Alert status="error" borderRadius="xl">
            <AlertIcon />
            Set <Text as="span" fontWeight="700">ADMIN_JWT_SECRET</Text> (32+ random characters),{" "}
            <Text as="span" fontWeight="700">ADMIN_PASSWORD</Text>, and Supabase service keys.
          </Alert>
        ) : null}

        {error ? (
          <Alert status="error" borderRadius="xl">
            <AlertIcon />
            {error}
          </Alert>
        ) : null}

        <Box
          as="form"
          onSubmit={onSubmit}
          borderRadius="2xl"
          borderWidth="1px"
          borderColor="glass.border"
          bg="glass.bg"
          backdropFilter="blur(16px)"
          p={{ base: 6, md: 8 }}
        >
          <Stack spacing={5}>
            <FormControl isRequired>
              <FormLabel fontWeight="600">Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                size="lg"
                autoComplete="current-password"
              />
            </FormControl>
            <Button type="submit" colorScheme="brand" size="lg" isLoading={loading}>
              Continue
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
