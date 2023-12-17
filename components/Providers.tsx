"use client";

import { ThemeProvider } from "next-themes";
import { FC, ReactNode } from "react";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider attribute="class">
      <Toaster position="top-center" richColors />
      {children}
    </ThemeProvider>
  );
};

export default Providers;
