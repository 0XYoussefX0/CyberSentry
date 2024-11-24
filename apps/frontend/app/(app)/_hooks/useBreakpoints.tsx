"use client";

import type { BreakPointInput } from "@pentest-app/types/client";

import { useResponsiveBreakPointsStore } from "@/lib/store";

import { useEffect } from "react";

function useBreakpoints(breakpoints: BreakPointInput[]) {
  const store = useResponsiveBreakPointsStore();

  useEffect(() => {
    store.registerBreakpoints(breakpoints);
    return () => store.unregisterBreakpoints(breakpoints);
  }, [breakpoints]);

  return breakpoints.reduce<Record<string, boolean>>((acc, { label }) => {
    acc[label] = store.getBreakpointValue(label) ?? false;
    return acc;
  }, {});
}

export default useBreakpoints;
