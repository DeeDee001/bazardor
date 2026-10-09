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
        toastOptions={{
          duration: 3500,
          style: {
            background: "#ffffff",
            color: "#1e293b",
            fontFamily: "var(--font-bengali), sans-serif",
            fontSize: "15px",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            padding: "12px 18px",
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
