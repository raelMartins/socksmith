"use client";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Container,
  Grid,
  Heading,
  HStack,
  Input,
  Progress,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  Link,
  useToast,
  Wrap,
  WrapItem,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SOCK_INTEREST_OPTIONS,
  WAITLIST_STATUSES,
  formatWaitlistStatus,
  STATUS_STYLE,
  type WaitlistStatus,
} from "@/lib/waitlist-options";
import type { WaitlistRow } from "@/types/waitlist";
import { BRAND } from "@/lib/brand";
import { ThemeToggle } from "@/components/ThemeToggle";

type SortKey =
  | "created_at"
  | "full_name"
  | "email"
  | "phone"
  | "status"
  | "sock_interests";

function MetricStat({
  label,
  value,
  variant,
  accent,
}: {
  label: string;
  value: string | number;
  variant: "inverse" | "surface" | "gradient";
  accent?: string;
}) {
  const surfaceBg = useColorModeValue(
    "rgba(255,255,255,0.92)",
    "rgba(22, 24, 30, 0.94)",
  );

  if (variant === "inverse") {
    return (
      <Box
        borderRadius="2xl"
        position="relative"
        overflow="hidden"
        bg={BRAND.black}
        color={BRAND.white}
        p={{ base: 5, md: 6 }}
        boxShadow="0 20px 50px rgba(17,17,17,0.1)"
        _dark={{ boxShadow: "0 24px 60px rgba(0,0,0,0.45)" }}
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="3px"
          bg={`linear-gradient(90deg, ${BRAND.red}, ${BRAND.pink}, ${BRAND.teal})`}
        />
        <Text
          fontSize="10px"
          fontWeight="800"
          textTransform="uppercase"
          letterSpacing="0.16em"
          opacity={0.55}
          mb={2}
        >
          {label}
        </Text>
        <Text
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="900"
          letterSpacing="-0.04em"
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {value}
        </Text>
      </Box>
    );
  }

  if (variant === "gradient") {
    return (
      <Box
        borderRadius="2xl"
        p={{ base: 5, md: 6 }}
        bg={`linear-gradient(135deg, ${BRAND.red} 0%, ${BRAND.pinkDark} 48%, ${BRAND.blue} 160%)`}
        color={BRAND.white}
        position="relative"
        overflow="hidden"
        boxShadow="0 20px 48px rgba(232,23,15,0.2)"
      >
        <Box
          position="absolute"
          top="-45%"
          right="-25%"
          w="220px"
          h="220px"
          borderRadius="full"
          bg="whiteAlpha.400"
          filter="blur(48px)"
          opacity={0.35}
          pointerEvents="none"
        />
        <Text
          position="relative"
          fontSize="10px"
          fontWeight="800"
          textTransform="uppercase"
          letterSpacing="0.16em"
          opacity={0.92}
          mb={2}
        >
          {label}
        </Text>
        <Text
          position="relative"
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="900"
          letterSpacing="-0.04em"
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {value}
        </Text>
      </Box>
    );
  }

  return (
    <Box
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="glass.border"
      bg={surfaceBg}
      backdropFilter="blur(16px)"
      p={{ base: 5, md: 5 }}
      position="relative"
      overflow="hidden"
      boxShadow="0 10px 36px rgba(17,17,17,0.05)"
      _dark={{ boxShadow: "0 12px 40px rgba(0,0,0,0.32)" }}
    >
      <Box
        position="absolute"
        left={0}
        top={4}
        bottom={4}
        w="4px"
        borderRadius="full"
        bg={accent ?? BRAND.red}
      />
      <Box pl={5}>
        <Text
          fontSize="10px"
          fontWeight="800"
          textTransform="uppercase"
          letterSpacing="0.14em"
          color="app.muted"
          mb={2}
        >
          {label}
        </Text>
        <Text
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="900"
          letterSpacing="-0.04em"
          color="app.fg"
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {value}
        </Text>
      </Box>
    </Box>
  );
}

function normalizeStatus(s: string | undefined | null): WaitlistStatus {
  const x = (s ?? "waiting").toLowerCase();
  return (WAITLIST_STATUSES as readonly string[]).includes(x)
    ? (x as WaitlistStatus)
    : "waiting";
}

/** Desktop waitlist row + header column template */
const WAITLIST_DESKTOP_COLS =
  "36px minmax(100px,1fr) minmax(88px,0.85fr) minmax(140px,1.15fr) minmax(96px,0.75fr) minmax(128px,1fr) minmax(120px,0.95fr)";

export function AdminWaitlistDashboard() {
  const router = useRouter();
  const toast = useToast();
  const pageBg = useColorModeValue("socksmith.cream", "gray.950");
  const headerBarBg = useColorModeValue("blackAlpha.50", "whiteAlpha.80");
  const expandPanelBg = useColorModeValue("blackAlpha.40", "whiteAlpha.70");
  const rowHoverBg = useColorModeValue("blackAlpha.35", "whiteAlpha.60");
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

  const interestBreakdown = useMemo(() => {
    const list = rows ?? [];
    return SOCK_INTEREST_OPTIONS.map((label) => ({
      label,
      count: list.filter((e) => (e.sock_interests ?? []).includes(label)).length,
    })).filter((s) => s.count > 0);
  }, [rows]);

  return (
    <Box minH="100vh" py={{ base: 8, md: 12 }} bg={pageBg} transition="background 0.2s ease">
      <Container maxW="container.xl">
        <Stack spacing={8}>
          <HStack
            justify="space-between"
            align={{ base: "stretch", md: "center" }}
            flexDir={{ base: "column", md: "row" }}
            gap={4}
          >
            <Box>
              <Badge colorScheme="brand" borderRadius="full" px={3} py={1} mb={2} variant="subtle">
                Internal
              </Badge>
              <Heading size="lg" letterSpacing="-0.03em" color="app.fg">
                Waitlist CRM
              </Heading>
              <Text color="app.muted" mt={2} fontSize="sm">
                Filter, sort, and update pipeline status. Export for spreadsheets.
              </Text>
            </Box>
            <HStack flexWrap="wrap">
              <ThemeToggle />
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

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4}>
            <MetricStat label="Total signups" value={stats.total} variant="inverse" />
            <MetricStat label="Waiting" value={stats.waiting} variant="surface" accent={BRAND.red} />
            <MetricStat label="Contacted" value={stats.contacted} variant="surface" accent={BRAND.blue} />
            <MetricStat label="Converted" value={stats.converted} variant="surface" accent={BRAND.teal} />
            <MetricStat label="Closed" value={stats.closed} variant="surface" accent={BRAND.brown} />
            <MetricStat label="Conversion rate" value={`${stats.convRate}%`} variant="gradient" />
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
            <Tabs variant="soft-rounded" colorScheme="brand">
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
                        placeholder="Search name, email, phone, interests, notes…"
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
                      <Text
                        display={{ base: "block", md: "none" }}
                        px={4}
                        py={2}
                        fontSize="xs"
                        color="app.muted"
                        borderBottomWidth="1px"
                        borderColor="glass.border"
                      >
                        Tap a row to see interests and notes.
                      </Text>
                      <Grid
                        display={{ base: "none", md: "grid" }}
                        templateColumns={WAITLIST_DESKTOP_COLS}
                        gap={3}
                        alignItems="center"
                        px={4}
                        py={3}
                        bg={headerBarBg}
                        borderBottomWidth="1px"
                        borderColor="glass.border"
                        color="app.fg"
                        fontSize="10px"
                        fontWeight="800"
                        letterSpacing="0.08em"
                        textTransform="uppercase"
                      >
                        <Text>#</Text>
                        <Button
                          variant="ghost"
                          size="xs"
                          h="auto"
                          minH={0}
                          p={0}
                          fontSize="10px"
                          fontWeight="800"
                          letterSpacing="0.08em"
                          textTransform="uppercase"
                          justifyContent="flex-start"
                          color="inherit"
                          _hover={{ bg: "transparent", color: "brand.500" }}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSort("full_name");
                          }}
                        >
                          Name{sortIndicator("full_name")}
                        </Button>
                        <Text>Phone</Text>
                        <Button
                          variant="ghost"
                          size="xs"
                          h="auto"
                          minH={0}
                          p={0}
                          fontSize="10px"
                          fontWeight="800"
                          letterSpacing="0.08em"
                          textTransform="uppercase"
                          justifyContent="flex-start"
                          color="inherit"
                          _hover={{ bg: "transparent", color: "brand.500" }}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSort("email");
                          }}
                        >
                          Email{sortIndicator("email")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          h="auto"
                          minH={0}
                          p={0}
                          fontSize="10px"
                          fontWeight="800"
                          letterSpacing="0.08em"
                          textTransform="uppercase"
                          justifyContent="flex-start"
                          color="inherit"
                          _hover={{ bg: "transparent", color: "brand.500" }}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSort("sock_interests");
                          }}
                        >
                          Interests{sortIndicator("sock_interests")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          h="auto"
                          minH={0}
                          p={0}
                          fontSize="10px"
                          fontWeight="800"
                          letterSpacing="0.08em"
                          textTransform="uppercase"
                          justifyContent="flex-start"
                          color="inherit"
                          _hover={{ bg: "transparent", color: "brand.500" }}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSort("status");
                          }}
                        >
                          Status{sortIndicator("status")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          h="auto"
                          minH={0}
                          p={0}
                          fontSize="10px"
                          fontWeight="800"
                          letterSpacing="0.08em"
                          textTransform="uppercase"
                          justifyContent="flex-start"
                          color="inherit"
                          _hover={{ bg: "transparent", color: "brand.500" }}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSort("created_at");
                          }}
                        >
                          Joined{sortIndicator("created_at")}
                        </Button>
                      </Grid>

                      {filteredSorted.length === 0 ? (
                        <Box textAlign="center" py={12} color="app.muted">
                          No entries match your filters.
                        </Box>
                      ) : (
                        <Accordion allowMultiple>
                          {filteredSorted.map((r, i) => {
                            const st = normalizeStatus(r.status);
                            const stStyle = STATUS_STYLE[st];
                            return (
                              <AccordionItem key={r.id} border="none" borderBottomWidth="1px" borderColor="glass.border">
                                <AccordionButton
                                  px={{ base: 3, md: 4 }}
                                  py={3}
                                  _hover={{ bg: rowHoverBg }}
                                  _expanded={{ bg: expandPanelBg }}
                                >
                                  <HStack align="flex-start" spacing={3} w="full" textAlign="left">
                                  <VStack
                                    align="stretch"
                                    spacing={2}
                                    flex="1"
                                    display={{ base: "flex", md: "none" }}
                                    textAlign="left"
                                  >
                                    <HStack justify="space-between" align="center">
                                      <Text color="app.muted" fontWeight="800" fontSize="xs">
                                        #{i + 1}
                                      </Text>
                                      <AccordionIcon color="app.muted" />
                                    </HStack>
                                    <Text fontWeight="700" fontSize="md">
                                      {r.full_name}
                                    </Text>
                                    <Link
                                      href={`mailto:${r.email}`}
                                      color="brand.500"
                                      fontWeight="600"
                                      fontSize="sm"
                                      wordBreak="break-all"
                                    >
                                      {r.email}
                                    </Link>
                                    <Text fontSize="sm" color="app.muted">
                                      {r.phone ?? "—"}
                                    </Text>
                                    <Text fontSize="sm" color="app.muted" noOfLines={3}>
                                      {(r.sock_interests ?? []).length
                                        ? (r.sock_interests ?? []).join(", ")
                                        : "—"}
                                    </Text>
                                    <Box onClick={(e) => e.stopPropagation()}>
                                      <Select
                                        size="sm"
                                        borderRadius="md"
                                        fontWeight="700"
                                        value={st}
                                        bg={stStyle.bg}
                                        color={stStyle.color}
                                        borderColor="transparent"
                                        w="full"
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
                                    </Box>
                                    <Text fontSize="xs" color="app.muted">
                                      {new Date(r.created_at).toLocaleString()}
                                    </Text>
                                  </VStack>

                                  <Grid
                                    flex="1"
                                    textAlign="left"
                                    display={{ base: "none", md: "grid" }}
                                    templateColumns={WAITLIST_DESKTOP_COLS}
                                    gap={3}
                                    alignItems="center"
                                    w="full"
                                  >
                                    <Text color="app.muted" fontWeight="800" fontSize="sm">
                                      {i + 1}
                                    </Text>
                                    <Text fontWeight="700" fontSize="sm" noOfLines={2}>
                                      {r.full_name}
                                    </Text>
                                    <Text fontSize="sm" color="app.muted" noOfLines={1}>
                                      {r.phone ?? "—"}
                                    </Text>
                                    <Box minW={0}>
                                      <Link
                                        href={`mailto:${r.email}`}
                                        color="brand.500"
                                        fontWeight="600"
                                        fontSize="sm"
                                        wordBreak="break-all"
                                      >
                                        {r.email}
                                      </Link>
                                    </Box>
                                    <Box minW={0}>
                                      <Text fontSize="sm" color="app.fg" noOfLines={2}>
                                        {(r.sock_interests ?? []).length
                                          ? (r.sock_interests ?? []).join(", ")
                                          : "—"}
                                      </Text>
                                    </Box>
                                    <Box onClick={(e) => e.stopPropagation()}>
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
                                    </Box>
                                    <Text fontSize="xs" color="app.muted" whiteSpace="nowrap">
                                      {new Date(r.created_at).toLocaleString()}
                                    </Text>
                                  </Grid>
                                  <AccordionIcon
                                    display={{ base: "none", md: "block" }}
                                    alignSelf="center"
                                    color="app.muted"
                                  />
                                  </HStack>
                                </AccordionButton>
                                <AccordionPanel px={{ base: 3, md: 4 }} pb={4} pt={0} bg={expandPanelBg}>
                                  <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4}>
                                    <Box>
                                      <Text
                                        fontSize="10px"
                                        fontWeight="800"
                                        letterSpacing="0.1em"
                                        textTransform="uppercase"
                                        color="app.muted"
                                      >
                                        Interests
                                      </Text>
                                      <Wrap mt={2} spacing={2}>
                                        {(r.sock_interests ?? []).length ? (
                                          (r.sock_interests ?? []).map((tag) => (
                                            <WrapItem key={tag}>
                                              <Badge
                                                borderRadius="full"
                                                px={2}
                                                py={0.5}
                                                fontSize="xs"
                                                colorScheme="brand"
                                                variant="subtle"
                                              >
                                                {tag}
                                              </Badge>
                                            </WrapItem>
                                          ))
                                        ) : (
                                          <Text fontSize="sm" color="app.muted">
                                            —
                                          </Text>
                                        )}
                                      </Wrap>
                                    </Box>
                                    <Box>
                                      <Text
                                        fontSize="10px"
                                        fontWeight="800"
                                        letterSpacing="0.1em"
                                        textTransform="uppercase"
                                        color="app.muted"
                                      >
                                        Note
                                      </Text>
                                      <Text mt={2} fontSize="sm" color="app.fg" whiteSpace="pre-wrap">
                                        {r.note?.trim() ? r.note : "—"}
                                      </Text>
                                    </Box>
                                  </SimpleGrid>
                                </AccordionPanel>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      )}

                      <HStack
                        justify="space-between"
                        px={4}
                        py={3}
                        borderTopWidth="1px"
                        borderColor="glass.border"
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
                                bg="blackAlpha.100"
                                _dark={{ bg: "whiteAlpha.100" }}
                                sx={{
                                  "& > div": {
                                    background: `linear-gradient(90deg, ${BRAND.teal}, ${BRAND.blue})`,
                                  },
                                }}
                              />
                            </Box>
                          );
                        })
                      )}
                    </InsightCard>
                    <Box
                      gridColumn={{ xl: "1 / -1" }}
                      borderRadius="3xl"
                      position="relative"
                      overflow="hidden"
                      p={{ base: 6, md: 8 }}
                      bg={`linear-gradient(125deg, ${BRAND.black} 0%, ${BRAND.teal} 45%, ${BRAND.brown} 100%)`}
                      color="white"
                      boxShadow="0 24px 60px rgba(15,76,117,0.22)"
                    >
                      <Box
                        position="absolute"
                        top="-40%"
                        right="-15%"
                        w="280px"
                        h="280px"
                        borderRadius="full"
                        bg="rgba(244, 114, 182, 0.22)"
                        filter="blur(70px)"
                        pointerEvents="none"
                      />
                      <Text fontWeight="800" mb={2} position="relative" letterSpacing="-0.02em">
                        Conversion snapshot
                      </Text>
                      <Text
                        fontSize={{ base: "4xl", md: "5xl" }}
                        fontWeight="900"
                        color="socksmith.blush"
                        position="relative"
                        letterSpacing="-0.04em"
                      >
                        {stats.convRate}%
                      </Text>
                      <Text fontSize="sm" opacity={0.85} mt={1} mb={4} position="relative">
                        converted vs total signups
                      </Text>
                      <Stack
                        spacing={2}
                        fontSize="sm"
                        borderTopWidth="1px"
                        borderColor="whiteAlpha.200"
                        pt={4}
                        position="relative"
                      >
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
  const innerBg = useColorModeValue(
    "rgba(255,255,255,0.94)",
    "rgba(18, 20, 26, 0.96)",
  );

  return (
    <Box
      borderRadius="3xl"
      p="1px"
      bg={`linear-gradient(135deg, ${BRAND.red}, ${BRAND.pink}, ${BRAND.blue})`}
      boxShadow="0 18px 50px rgba(17,17,17,0.07)"
      _dark={{ boxShadow: "0 22px 55px rgba(0,0,0,0.38)" }}
    >
      <Box
        borderRadius="3xl"
        bg={innerBg}
        backdropFilter="blur(18px)"
        p={{ base: 5, md: 6 }}
      >
        <Text
          fontWeight="800"
          fontSize="lg"
          mb={5}
          letterSpacing="-0.03em"
          color="app.fg"
        >
          {title}
        </Text>
        {children}
      </Box>
    </Box>
  );
}
