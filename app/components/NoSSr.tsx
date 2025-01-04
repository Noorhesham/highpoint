"use client";
// components/NoSSR.tsx
import React, { useEffect, useState } from "react";

const NoSSR: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <>{children}</> : null;
};

export default NoSSR;
