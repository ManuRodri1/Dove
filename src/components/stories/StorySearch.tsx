"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = { label: string; placeholder: string; clear: string };

export default function StorySearch({ label, placeholder, clear }: Props) {
  const params = useSearchParams();
  const path = usePathname();
  const router = useRouter();
  const urlQuery = params.get("q") ?? "";
  const [value, setValue] = useState(urlQuery);

  useEffect(() => {
    setValue(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    const nextQuery = value.trim();
    if (nextQuery === urlQuery) return;

    const id = window.setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (nextQuery) next.set("q", nextQuery);
      else next.delete("q");
      next.delete("page");
      const search = next.toString();
      router.replace(search ? `${path}?${search}` : path, { scroll: false });
    }, 350);

    return () => window.clearTimeout(id);
  }, [value, urlQuery, path, router, params]);

  return (
    <div className="story-search">
      <label htmlFor="story-search">{label}</label>
      <div>
        <input
          id="story-search"
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(event) => setValue(event.target.value)}
        />
        {value && (
          <button type="button" onClick={() => setValue("")}>
            {clear}
          </button>
        )}
      </div>
    </div>
  );
}
