"use client";

import type { FC, ReactNode } from "react";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <Toaster position="top-center" richColors closeButton />
      {children}
    </>
  );
};

export default Providers;
