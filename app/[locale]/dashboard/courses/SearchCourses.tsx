"use client";
import { Input } from "@/components/ui/input";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

const SearchCourses = () => {
  const [searchVal, setSearchVal] = useState("");
  const [internalState, setInternalState] = useState("");
  const { replace } = useRouter();
  // Memoize the debounced function so it doesn't get recreated on every render.
  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      const url = new URL(window.location.href);
      url.searchParams.set("search", value);
      // Update the URL without reloading the page.
      replace(url.toString(), { scroll: false });
    }, 500),
    []
  );

  // Trigger the debounced function whenever searchVal changes.
  useEffect(() => {
    debouncedSetSearch(searchVal);
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [searchVal, debouncedSetSearch]);

  return (
    <div>
      <Input value={searchVal} onChange={(e) => setSearchVal(e.target.value)} placeholder="Search courses..." />
    </div>
  );
};

export default SearchCourses;
