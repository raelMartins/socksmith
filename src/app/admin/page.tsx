"use client";

import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Link,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { WaitlistRow } from "@/types/waitlist";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [rows, setRows] = useState<WaitlistRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/waitlist", { credentials: "include" });
    if (res.status === 401) {
      router.replace("/admin/login");
      return;
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(typeof body.error === "string" ? body.error : "Could not load waitlist.");
      setRows([]);
      setLoading(false);
      return;
    }
    const body = (await res.json()) as { rows: WaitlistRow[] };
    setRows(body.rows);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <Box minH="100vh" py={{ base: 10, md: 14 }}>
      <Container maxW="container.xl">
        <Stack spacing={8}>
          <HStack justify="space-between" align={{ base: "stretch", md: "center" }} flexDir={{ base: "column", md: "row" }} gap={4}>
            <Box>
              <Badge colorScheme="purple" borderRadius="full" px={3} py={1} mb={3}>
                Admin
              </Badge>
              <Heading size="lg" letterSpacing="-0.03em">
                Waitlist
              </Heading>
              <Text color="app.muted" mt={2}>
                Signed-up fans, newest first. Export opens in Excel or Google Sheets.
              </Text>
            </Box>
            <HStack flexWrap="wrap">
              <Button as={NextLink} href="/" variant="outline" borderRadius="xl">
                View site
              </Button>
              <Button
                as="a"
                href="/api/admin/waitlist?format=csv"
                borderRadius="xl"
                colorScheme="brand"
                variant="solid"
              >
                Download CSV
              </Button>
              <Button onClick={() => void logout()} variant="ghost" borderRadius="xl">
                Sign out
              </Button>
            </HStack>
          </HStack>

          <Box
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="glass.border"
            bg="glass.bg"
            backdropFilter="blur(16px)"
            overflow="hidden"
          >
            {loading ? (
              <HStack justify="center" py={16}>
                <Spinner color="brand.500" />
              </HStack>
            ) : error ? (
              <Box p={8}>
                <Text color="red.400" fontWeight="600">
                  {error}
                </Text>
                <Button mt={4} onClick={() => void load()}>
                  Retry
                </Button>
              </Box>
            ) : (
              <TableContainer>
                <Table size="sm" variant="simple">
                  <Thead bg="blackAlpha.50" _dark={{ bg: "whiteAlpha.50" }}>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th display={{ base: "none", md: "table-cell" }}>Instagram</Th>
                      <Th display={{ base: "none", lg: "table-cell" }}>Joined</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {(rows ?? []).map((r) => (
                      <Tr key={r.id}>
                        <Td fontWeight="600">{r.full_name}</Td>
                        <Td>
                          <Link href={`mailto:${r.email}`} color="brand.500" fontWeight="600">
                            {r.email}
                          </Link>
                        </Td>
                        <Td display={{ base: "none", md: "table-cell" }}>
                          {r.instagram_handle ? (
                            <Text>{r.instagram_handle}</Text>
                          ) : (
                            <Text color="app.muted">—</Text>
                          )}
                        </Td>
                        <Td display={{ base: "none", lg: "table-cell" }} whiteSpace="nowrap">
                          {new Date(r.created_at).toLocaleString()}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </Box>

          {!loading && rows && rows.length === 0 ? (
            <Text color="app.muted">No signups yet. Share the landing page to start collecting names.</Text>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
}
