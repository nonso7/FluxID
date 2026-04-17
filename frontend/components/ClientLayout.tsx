"use client";

import { ReactNode } from "react";
import Header from "@/app/components/Header";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}