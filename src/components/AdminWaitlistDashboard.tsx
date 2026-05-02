"use client";

import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Input,
  Progress,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Link,
  Tr,
  useToast,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  HEAR_ABOUT_OPTIONS,
  SOCK_INTEREST_OPTIONS,
  WAITLIST_STATUSES,
  formatWaitlistStatus,
  STATUS_STYLE,
  type WaitlistStatus,
} from "@/lib/waitlist-options";
import type { WaitlistRow } from "@/types/waitlist";

type SortKey =
  | "created_at"
  | "full_name"
  | "email"
  | "phone"
  | "hear_about_us"
  | "status"
  | "sock_interests";

function normalizeStatus(s: string | undefined | null): WaitlistStatus {
  const x = (s ?? "waiting").toLowerCase();
  return (WAITLIST_STATUSES as readonly string[]).includes(x)
    ? (x as WaitlistStatus)
    : "waiting";
}

export function AdminWaitlistDashboard() {
  const router = useRouter();
  const toast = useToast();
  const [rows, setRows] = useState<WaitlistRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | WaitlistStatus>("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

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

  const stats = useMemo(() => {
    const list = rows ?? [];
    const total = list.length;
    const count = (s: WaitlistStatus) =>
      list.filter((r) => normalizeStatus(r.status) === s).length;
    const converted = count("converted");
    const convRate = total ? Math.round((converted / total) * 100) : 0;
    return {
      total,
      waiting: count("waiting"),
      contacted: count("contacted"),
      converted,
      closed: count("closed"),
      convRate,
    };
  }, [rows]);

  const filteredSorted = useMemo(() => {
    const list = rows ?? [];
    const q = search.trim().toLowerCase();
    const out = list
      .filter((r) => filter === "all" || normalizeStatus(r.status) === filter)
      .filter((r) => {
        if (!q) return true;
        const interests = (r.sock_interests ?? []).join(" ").toLowerCase();
        return (
          r.full_name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          (r.phone ?? "").toLowerCase().includes(q) ||
          (r.hear_about_us ?? "").toLowerCase().includes(q) ||
          interests.includes(q) ||
          (r.note ?? "").toLowerCase().includes(q)
        );
      });

    const cmp = (a: WaitlistRow, b: WaitlistRow) => {
      let va: string;
      let vb: string;
      if (sortKey === "created_at") {
        va = String(new Date(a.created_at).getTime());
        vb = String(new Date(b.created_at).getTime());
      } else if (sortKey === "sock_interests") {
        va = (a.sock_interests ?? []).join(", ");
        vb = (b.sock_interests ?? []).join(", ");
      } else {
        va = String(a[sortKey as keyof WaitlistRow] ?? "");
        vb = String(b[sortKey as keyof WaitlistRow] ?? "");
      }
      const n = va.localeCompare(vb, undefined, { numeric: true });
      return sortDir === "asc" ? n : -n;
    };
    out.sort(cmp);
    return out;
  }, [rows, filter, search, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "created_at" ? "desc" : "asc");
    }
  };

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  async function updateStatus(id: string, status: WaitlistStatus) {
    const res = await fetch(`/api/admin/waitlist/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
      credentials: "include",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast({
        title: "Could not update status",
        description: typeof body.error === "string" ? body.error : "Request failed.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setRows((prev) =>
      (prev ?? []).map((r) => (r.id === id ? { ...r, status } : r)),
    );
    toast({ title: "Status updated", status: "success", duration: 2000 });
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    router.replace("/admin/login");
    router.refresh();
  }

  const sourceBreakdown = useMemo(() => {
    const list = rows ?? [];
    return HEAR_ABOUT_OPTIONS.map((label) => ({
      label,
      count: list.filter((e) => e.hear_about_us === label).length,
    })).filter((s) => s.count > 0);
  }, [rows]);

  const interestBreakdown = useMemo(() => {
    const list = rows ?? [];
    return SOCK_INTEREST_OPTIONS.map((label) => ({
      label,
      count: list.filter((e) => (e.sock_interests ?? []).includes(label)).length,
    })).filter((s) => s.count > 0);
  }, [rows]);

  const statCards = [
    { label: "Total", val: stats.total, accent: "brand.500", bg: "ink.900", fg: "white" },
    { label: "Waiting", val: stats.waiting, accent: "yellow.400", bg: "glass.bg", fg: "app.fg" },
    { label: "Contacted", val: stats.contacted, accent: "blue.400", bg: "glass.bg", fg: "app.fg" },
    { label: "Converted", val: stats.converted, accent: "green.400", bg: "glass.bg", fg: "app.fg" },
    { label: "Closed", val: stats.closed, accent: "gray.400", bg: "glass.bg", fg: "app.fg" },
    { label: "Conv. rate", val: `${stats.convRate}%`, accent: "pink.400", bg: "brand.500", fg: "white" },
  ];

  return (
    <Box minH="100vh" py={{ base: 8, md: 12 }}>
      <Container maxW="container.xl">
        <Stack spacing={8}>
          <HStack
            justify="space-between"
            align={{ base: "stretch", md: "center" }}
            flexDir={{ base: "column", md: "row" }}
            gap={4}
          >
            <Box>
              <Badge colorScheme="purple" borderRadius="full" px={3} py={1} mb={2}>
                Internal
              </Badge>
              <Heading size="lg" letterSpacing="-0.03em">
                Waitlist CRM
              </Heading>
              <Text color="app.muted" mt={2} fontSize="sm">
                Filter, sort, and update pipeline status. Export for spreadsheets.
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
              >
                Download CSV
              </Button>
              <Button onClick={() => void logout()} variant="ghost" borderRadius="xl">
                Sign out
              </Button>
            </HStack>
          </HStack>

          <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={3}>
            {statCards.map((s) => (
              <Box
                key={s.label}
                borderRadius="xl"
                borderWidth="1px"
                borderColor="glass.border"
                bg={s.bg}
                color={s.fg}
                px={4}
                py={4}
                boxShadow="sm"
                borderTopWidth="4px"
                borderTopColor={s.accent}
              >
                <Text fontSize="2xl" fontWeight="800" lineHeight="1.1">
                  {s.val}
                </Text>
                <Text
                  fontSize="xs"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  opacity={0.75}
                  mt={1}
                >
                  {s.label}
                </Text>
              </Box>
            ))}
          </SimpleGrid>

          {loading ? (
            <HStack justify="center" py={20}>
              <Spinner color="brand.500" size="lg" />
            </HStack>
          ) : error ? (
            <Box p={8} borderRadius="xl" borderWidth="1px" borderColor="glass.border">
              <Text color="red.400" fontWeight="600">
                {error}
              </Text>
              <Button mt={4} onClick={() => void load()}>
                Retry
              </Button>
            </Box>
          ) : (
            <Tabs variant="enclosed" colorScheme="brand">
              <TabList borderBottomWidth="0" flexWrap="wrap" gap={2}>
                <Tab borderRadius="lg" fontWeight="700">
                  Waitlist
                </Tab>
                <Tab borderRadius="lg" fontWeight="700">
                  Insights
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0} pt={6}>
                  <Stack spacing={4}>
                    <Wrap spacing={2} align="center">
                      <Input
                        flex="1"
                        minW={{ base: "100%", md: "220px" }}
                        maxW="md"
                        placeholder="Search name, email, phone, interests…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        borderRadius="xl"
                        bg="glass.bg"
                        borderColor="glass.border"
                      />
                      <Wrap spacing={2}>
                        {(["all", ...WAITLIST_STATUSES] as const).map((s) => {
                          const active = filter === s;
                          const label =
                            s === "all" ? "All" : formatWaitlistStatus(s);
                          return (
                            <WrapItem key={s}>
                              <Button
                                size="sm"
                                borderRadius="lg"
                                variant={active ? "solid" : "outline"}
                                colorScheme={active ? "brand" : "gray"}
                                onClick={() => setFilter(s)}
                              >
                                {label}
                              </Button>
                            </WrapItem>
                          );
                        })}
                      </Wrap>
                    </Wrap>

                    <Box
                      borderRadius="2xl"
                      borderWidth="1px"
                      borderColor="glass.border"
                      bg="glass.bg"
                      backdropFilter="blur(12px)"
                      overflow="hidden"
                    >
                      <TableContainer overflowX="auto">
                        <Table size="sm" variant="simple">
                          <Thead bg="blackAlpha.50" _dark={{ bg: "whiteAlpha.50" }}>
                            <Tr>
                              <Th w="40px">#</Th>
                              <Th cursor="pointer" onClick={() => toggleSort("full_name")}>
                                Name{sortIndicator("full_name")}
                              </Th>
                              <Th display={{ base: "none", md: "table-cell" }}>Phone</Th>
                              <Th cursor="pointer" onClick={() => toggleSort("email")}>
                                Email{sortIndicator("email")}
                              </Th>
                              <Th
                                display={{ base: "none", lg: "table-cell" }}
                                cursor="pointer"
                                onClick={() => toggleSort("hear_about_us")}
                              >
                                Heard via{sortIndicator("hear_about_us")}
                              </Th>
                              <Th display={{ base: "none", xl: "table-cell" }}>Interests</Th>
                              <Th cursor="pointer" onClick={() => toggleSort("status")}>
                                Status{sortIndicator("status")}
                              </Th>
                              <Th
                                display={{ base: "none", md: "table-cell" }}
                                cursor="pointer"
                                onClick={() => toggleSort("created_at")}
                              >
                                Joined{sortIndicator("created_at")}
                              </Th>
                              <Th display={{ base: "none", lg: "table-cell" }}>Note</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {filteredSorted.length === 0 ? (
                              <Tr>
                                <Td colSpan={9} textAlign="center" py={12} color="app.muted">
                                  No entries match your filters.
                                </Td>
                              </Tr>
                            ) : (
                              filteredSorted.map((r, i) => {
                                const st = normalizeStatus(r.status);
                                const stStyle = STATUS_STYLE[st];
                                return (
                                  <Tr key={r.id}>
                                    <Td color="app.muted" fontWeight="700">
                                      {i + 1}
                                    </Td>
                                    <Td fontWeight="700">{r.full_name}</Td>
                                    <Td display={{ base: "none", md: "table-cell" }}>
                                      {r.phone ?? "—"}
                                    </Td>
                                    <Td>
                                      <Link
                                        href={`mailto:${r.email}`}
                                        color="brand.500"
                                        fontWeight="600"
                                      >
                                        {r.email}
                                      </Link>
                                    </Td>
                                    <Td display={{ base: "none", lg: "table-cell" }}>
                                      {r.hear_about_us ? (
                                        <Badge borderRadius="md" colorScheme="orange" variant="subtle">
                                          {r.hear_about_us}
                                        </Badge>
                                      ) : (
                                        <Text color="app.muted">—</Text>
                                      )}
                                    </Td>
                                    <Td
                                      display={{ base: "none", xl: "table-cell" }}
                                      maxW="200px"
                                      whiteSpace="normal"
                                      fontSize="xs"
                                    >
                                      {(r.sock_interests ?? []).length
                                        ? (r.sock_interests ?? []).join(", ")
                                        : "—"}
                                    </Td>
                                    <Td>
                                      <Select
                                        size="sm"
                                        borderRadius="md"
                                        fontWeight="700"
                                        value={st}
                                        bg={stStyle.bg}
                                        color={stStyle.color}
                                        borderColor="transparent"
                                        maxW="160px"
                                        onChange={(e) =>
                                          void updateStatus(
                                            r.id,
                                            e.target.value as WaitlistStatus,
                                          )
                                        }
                                      >
                                        {WAITLIST_STATUSES.map((s) => (
                                          <option key={s} value={s}>
                                            {formatWaitlistStatus(s)}
                                          </option>
                                        ))}
                                      </Select>
                                    </Td>
                                    <Td
                                      display={{ base: "none", md: "table-cell" }}
                                      whiteSpace="nowrap"
                                      fontSize="xs"
                                    >
                                      {new Date(r.created_at).toLocaleString()}
                                    </Td>
                                    <Td
                                      display={{ base: "none", lg: "table-cell" }}
                                      maxW="140px"
                                      isTruncated
                                      title={r.note ?? ""}
                                    >
                                      {r.note?.trim() ? r.note : "—"}
                                    </Td>
                                  </Tr>
                                );
                              })
                            )}
                          </Tbody>
                        </Table>
                      </TableContainer>
                      <HStack
                        justify="space-between"
                        px={4}
                        py={3}
                        borderTopWidth="1px"
                        borderColor="blackAlpha.100"
                        _dark={{ borderColor: "whiteAlpha.100" }}
                        fontSize="xs"
                        color="app.muted"
                      >
                        <Text fontWeight="600">
                          Showing {filteredSorted.length} of {(rows ?? []).length}
                        </Text>
                        <Text>Socksmith · internal</Text>
                      </HStack>
                    </Box>
                  </Stack>
                </TabPanel>
                <TabPanel px={0} pt={6}>
                  <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                    <InsightCard title="Status breakdown">
                      {WAITLIST_STATUSES.map((s) => {
                        const count = (rows ?? []).filter(
                          (e) => normalizeStatus(e.status) === s,
                        ).length;
                        const pct = stats.total ? (count / stats.total) * 100 : 0;
                        const dot = STATUS_STYLE[s].dot;
                        return (
                          <Box key={s} mb={3}>
                            <HStack justify="space-between" mb={1} fontSize="sm" fontWeight="600">
                              <HStack spacing={2}>
                                <Box w="10px" h="10px" borderRadius="full" bg={dot} />
                                <Text>{formatWaitlistStatus(s)}</Text>
                              </HStack>
                              <Text color="app.muted">
                                {count} ({Math.round(pct)}%)
                              </Text>
                            </HStack>
                            <Progress
                              value={pct}
                              size="sm"
                              borderRadius="full"
                              colorScheme="gray"
                              sx={{ "& > div": { backgroundColor: dot } }}
                            />
                          </Box>
                        );
                      })}
                    </InsightCard>
                    <InsightCard title="Where they heard about us">
                      {sourceBreakdown.length === 0 ? (
                        <Text color="app.muted" fontSize="sm">
                          No data yet.
                        </Text>
                      ) : (
                        sourceBreakdown.map((s) => {
                          const pct = stats.total ? (s.count / stats.total) * 100 : 0;
                          return (
                            <Box key={s.label} mb={3}>
                              <HStack justify="space-between" mb={1} fontSize="sm" fontWeight="600">
                                <Text>{s.label}</Text>
                                <Text color="app.muted">{s.count}</Text>
                              </HStack>
                              <Progress
                                value={pct}
                                size="sm"
                                borderRadius="full"
                                colorScheme="orange"
                              />
                            </Box>
                          );
                        })
                      )}
                    </InsightCard>
                    <InsightCard title="Sock interests">
                      {interestBreakdown.length === 0 ? (
                        <Text color="app.muted" fontSize="sm">
                          No data yet.
                        </Text>
                      ) : (
                        interestBreakdown.map((s) => {
                          const pct = stats.total ? (s.count / stats.total) * 100 : 0;
                          return (
                            <Box key={s.label} mb={3}>
                              <HStack justify="space-between" mb={1} fontSize="sm" fontWeight="600">
                                <Text>{s.label}</Text>
                                <Text color="app.muted">{s.count}</Text>
                              </HStack>
                              <Progress
                                value={pct}
                                size="sm"
                                borderRadius="full"
                                colorScheme="purple"
                              />
                            </Box>
                          );
                        })
                      )}
                    </InsightCard>
                    <Box
                      gridColumn={{ xl: "1 / -1" }}
                      borderRadius="2xl"
                      borderWidth="1px"
                      borderColor="glass.border"
                      bg="ink.900"
                      color="white"
                      p={6}
                    >
                      <Text fontWeight="800" mb={2}>
                        Conversion snapshot
                      </Text>
                      <Text fontSize="4xl" fontWeight="900" color="brand.300">
                        {stats.convRate}%
                      </Text>
                      <Text fontSize="sm" opacity={0.75} mt={1} mb={4}>
                        converted vs total signups
                      </Text>
                      <Stack spacing={2} fontSize="sm" borderTopWidth="1px" borderColor="whiteAlpha.200" pt={4}>
                        <HStack justify="space-between">
                          <Text opacity={0.85}>In pipeline (waiting + contacted)</Text>
                          <Text fontWeight="700">{stats.waiting + stats.contacted}</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text opacity={0.85}>Converted</Text>
                          <Text fontWeight="700">{stats.converted}</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text opacity={0.85}>Closed</Text>
                          <Text fontWeight="700">{stats.closed}</Text>
                        </HStack>
                      </Stack>
                    </Box>
                  </SimpleGrid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}

          {!loading && rows && rows.length === 0 ? (
            <Text color="app.muted" textAlign="center">
              No signups yet. Share the landing page to start collecting leads.
            </Text>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
}

function InsightCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="glass.border"
      bg="glass.bg"
      backdropFilter="blur(12px)"
      p={6}
    >
      <Text fontWeight="800" fontSize="md" mb={4} letterSpacing="-0.02em">
        {title}
      </Text>
      {children}
    </Box>
  );
}
