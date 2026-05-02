import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import type { StyleFunctionProps } from "@chakra-ui/styled-system";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `var(--font-fraunces), Georgia, serif`,
    body: `var(--font-dm-sans), system-ui, sans-serif`,
  },
  colors: {
    brand: {
      50: "#fff5f0",
      100: "#ffe0d4",
      200: "#ffc2a8",
      300: "#ff9a6b",
      400: "#ff7a3d",
      500: "#e85d04",
      600: "#c2410c",
      700: "#9a3412",
      800: "#7c2d12",
      900: "#431407",
    },
    ink: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
  },
  semanticTokens: {
    colors: {
      "app.fg": { default: "ink.800", _dark: "ink.100" },
      "app.muted": { default: "ink.600", _dark: "ink.400" },
      "glass.bg": { default: "rgba(255, 255, 255, 0.78)", _dark: "rgba(18, 24, 32, 0.82)" },
      "glass.border": {
        default: "rgba(232, 93, 4, 0.22)",
        _dark: "rgba(255, 154, 107, 0.2)",
      },
    },
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: props.colorMode === "dark" ? "#0b0f14" : "#fff7f2",
        backgroundImage:
          props.colorMode === "dark"
            ? "radial-gradient(ellipse 120% 80% at 20% -10%, rgba(232,93,4,0.18), transparent 55%), radial-gradient(ellipse 90% 60% at 100% 0%, rgba(147,51,234,0.12), transparent 50%), radial-gradient(ellipse 70% 50% at 50% 100%, rgba(59,130,246,0.08), transparent 45%)"
            : "radial-gradient(ellipse 120% 80% at 15% -5%, rgba(255,154,107,0.35), transparent 50%), radial-gradient(ellipse 100% 60% at 100% 10%, rgba(236,72,153,0.12), transparent 48%), radial-gradient(ellipse 80% 45% at 50% 110%, rgba(59,130,246,0.08), transparent 42%)",
        color: props.colorMode === "dark" ? "ink.100" : "ink.800",
        minH: "100vh",
      },
    }),
  },
  components: {
    Button: {
      baseStyle: { fontWeight: "600", borderRadius: "xl" },
    },
    Input: {
      variants: {
        filled: {
          field: {
            borderRadius: "xl",
            bg: "blackAlpha.50",
            _dark: { bg: "whiteAlpha.50" },
            _hover: { bg: "blackAlpha.100", _dark: { bg: "whiteAlpha.100" } },
            _focus: {
              borderColor: "brand.400",
              bg: "whiteAlpha.900",
              _dark: { bg: "whiteAlpha.100" },
            },
          },
        },
      },
      defaultProps: { variant: "filled" },
    },
  },
});

export default theme;
