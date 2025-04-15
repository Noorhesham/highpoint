"use client";
import { useEffect, useTransition } from "react";
import { useLoading } from "../constant/LoadingContext";

export const useSetLoading = () => {
  const [isPending, startTransition] = useTransition();
  const { setIsLoading } = useLoading();
  useEffect(() => {
    setIsLoading(isPending);
  }, [isPending]);
  const WrapperFn = (fn: any) => {
    startTransition(() => {
      fn();
    });
  };
  return { WrapperFn };
};
