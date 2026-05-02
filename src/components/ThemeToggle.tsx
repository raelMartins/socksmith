"use client";

import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  const label = useColorModeValue("Dark mode", "Light mode");

  return (
    <IconButton
      aria-label={label}
      title={label}
      onClick={toggleColorMode}
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      variant="ghost"
      borderRadius="full"
      size="md"
      borderWidth="1px"
      borderColor="glass.border"
      bg="glass.bg"
      backdropFilter="blur(12px)"
      _hover={{ bg: "whiteAlpha.600", _dark: { bg: "whiteAlpha.100" } }}
    />
  );
}
