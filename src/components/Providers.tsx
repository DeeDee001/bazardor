"use client";

import React from "react";
import { Toaster } from "react-hot-toast";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        containerStyle={{ zIndex: 99999 }}
        toastOptions={{
          duration: 3500,
          className: "animate-in fade-in slide-in-from-top-2 duration-200",
          style: {
            background: "#ffffff",
            color: "#1e293b",
            fontFamily: "var(--font-bengali), sans-serif",
            fontSize: "15px",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            boxShadow:
              "0 12px 24px -4px rgba(0, 0, 0, 0.08), 0 6px 12px -2px rgba(0, 0, 0, 0.04)",
            padding: "12px 20px",
          },
          success: {
            iconTheme: {
              primary: "#16a34a",
              secondary: "#ffffff",
            },
            style: {
              borderLeft: "4px solid #16a34a",
            },
          },
          error: {
            iconTheme: {
              primary: "#dc2626",
              secondary: "#ffffff",
            },
            style: {
              borderLeft: "4px solid #dc2626",
            },
          },
        }}
      />
    </>
  );
}
