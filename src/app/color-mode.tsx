"use client";

import { ColorModeScript } from "@chakra-ui/react";
import theme from "@/theme";

export function ColorMode() {
  return <ColorModeScript initialColorMode={theme.config.initialColorMode} />;
}
