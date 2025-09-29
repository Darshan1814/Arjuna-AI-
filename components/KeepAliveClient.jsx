"use client";

import { useEffect } from "react";
import { startKeepAlive } from "../lib/keepAliveEnhanced";

export default function KeepAliveClient() {
  useEffect(() => {
    const cleanup = startKeepAlive();
    return cleanup; // Cleanup on unmount
  }, []);

  return null;
}