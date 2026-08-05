import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import type { StyleFunctionProps } from "@chakra-ui/styled-system";
import { BRAND } from "@/lib/brand";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif`,
    body: `var(--font-manrope), Manrope, system-ui, sans-serif`,
  },
  colors: {
    /** Named palette (exact brand hex). */
    socksmith: {
      red: BRAND.red,
      redLight: BRAND.redLight,
      cream: BRAND.cream,
      brown: BRAND.brown,
      pink: BRAND.pink,
      pinkDark: BRAND.pinkDark,
      blue: BRAND.blue,
      teal: BRAND.teal,
      white: BRAND.white,
      black: BRAND.black,
      blush: BRAND.blush,
    },
    /** Chakra `colorScheme="brand"` (primary = Socksmith red). */
    brand: {
      50: "#FFF5F5",
      100: BRAND.redLight,
      200: BRAND.blush,
      300: "#F5B5C4",
      400: BRAND.pink,
      500: BRAND.red,
      600: "#C0120C",
      700: BRAND.brown,
      800: "#3D2614",
      900: BRAND.black,
    },
    ink: {
      50: "#FAFAF9",
      100: "#F5F5F4",
      200: "#E7E5E4",
      300: "#D6D3D1",
      400: "#A8A29E",
      500: "#78716C",
      600: "#57534E",
      700: "#44403C",
      800: "#292524",
      900: BRAND.black,
    },
  },
  semanticTokens: {
    colors: {
      "app.fg": { default: "ink.900", _dark: "socksmith.cream" },
      "app.muted": { default: "ink.600", _dark: "whiteAlpha.700" },
      "glass.bg": {
        default: "rgba(255, 255, 255, 0.82)",
        _dark: "rgba(17, 17, 17, 0.78)",
      },
      "glass.border": {
        default: "rgba(17, 17, 17, 0.08)",
        _dark: "rgba(255, 255, 255, 0.1)",
      },
    },
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: props.colorMode === "dark" ? BRAND.black : BRAND.cream,
        backgroundImage:
          props.colorMode === "dark"
            ? `radial-gradient(ellipse 80% 60% at 0% 0%, rgba(244,114,182,0.18), transparent 55%),
               radial-gradient(ellipse 70% 50% at 100% 0%, rgba(251,191,36,0.12), transparent 50%),
               radial-gradient(ellipse 60% 45% at 50% 100%, rgba(26,86,219,0.16), transparent 55%)`
            : `radial-gradient(ellipse 70% 55% at 0% 0%, rgba(244,114,182,0.28), transparent 55%),
               radial-gradient(ellipse 65% 50% at 100% 0%, rgba(251,191,36,0.22), transparent 52%),
               radial-gradient(ellipse 50% 40% at 50% 100%, rgba(251,191,36,0.08), transparent 60%)`,
        backgroundAttachment: "fixed",
        color: props.colorMode === "dark" ? "socksmith.cream" : "ink.900",
        minH: "100vh",
      },
      html: {
        scrollBehavior: "smooth",
      },
    }),
  },
  components: {
    Alert: {
      variants: {
        /** Glass toast / inline alert — matches Socksmith landing + waitlist overlay */
        socksmith: (props: StyleFunctionProps) => {
          const s = (props.status ?? "info") as string;
          const accent =
            s === "success"
              ? "socksmith.teal"
              : s === "error"
                ? "brand.500"
                : s === "warning"
                  ? "orange.400"
                  : s === "loading"
                    ? "socksmith.pink"
                    : "socksmith.blue";
          return {
            container: {
              borderRadius: "2xl",
              borderWidth: "1px",
              borderColor: "glass.border",
              borderLeftWidth: "4px",
              borderLeftColor: accent,
              bg: "rgba(255, 255, 255, 0.82)",
              backdropFilter: "blur(14px) saturate(140%)",
              boxShadow: "0 18px 50px rgba(15, 23, 42, 0.1)",
              color: "ink.900",
              py: 3,
              px: 4,
              _dark: {
                bg: "rgba(17, 17, 17, 0.82)",
                color: "socksmith.cream",
                borderColor: "whiteAlpha.200",
                boxShadow: "0 22px 60px rgba(0, 0, 0, 0.45)",
              },
            },
            title: {
              fontWeight: "700",
              fontFamily: "heading",
              letterSpacing: "-0.02em",
              color: "inherit",
            },
            description: {
              fontWeight: "500",
              mt: 0.5,
              color: "ink.600",
              _dark: { color: "whiteAlpha.800" },
            },
            icon: {
              color: accent,
              w: "5",
              h: "5",
            },
            spinner: {
              color: accent,
            },
          };
        },
      },
    },
    Button: {
      baseStyle: { fontWeight: "600", borderRadius: "xl" },
    },
    Heading: {
      baseStyle: {
        fontFamily: "heading",
        fontWeight: "700",
      },
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
              borderColor: "socksmith.blue",
              boxShadow: "0 0 0 1px rgba(26, 86, 219, 0.28)",
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
