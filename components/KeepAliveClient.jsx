"use client";

import { useEffect } from "react";
import { startKeepAlive } from "../lib/keepAlive";

export default function KeepAliveClient() {
  useEffect(() => {
    startKeepAlive();
  }, []);

  return null;
}