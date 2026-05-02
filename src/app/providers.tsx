"use client";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider
      theme={theme}
      toastOptions={{
        defaultOptions: {
          position: "top-right",
          duration: 5500,
          isClosable: true,
          variant: "socksmith",
          containerStyle: {
            marginTop: "1rem",
            marginRight: "1rem",
            maxW: "sm",
          },
        },
      }}
    >
      {children}
    </ChakraProvider>
  );
}
