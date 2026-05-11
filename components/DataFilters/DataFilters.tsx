"use client";

import { useCallback, useEffect, useRef, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  placeholder: string;
  options: FilterOption[];
  allLabel?: string;
}

export interface DataFiltersProps {
  searchKey?: string;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  showSearch?: boolean;
}

const EMPTY_FILTERS: FilterConfig[] = [];

export function DataFilters({
  searchKey = "search",
  searchPlaceholder = "Search...",
  filters = EMPTY_FILTERS,
  showSearch = true,
}: DataFiltersProps) {
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync uncontrolled input when URL resets externally (e.g. clear button)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = searchParams.get(searchKey) ?? "";
    }
  }, [searchParams, searchKey]);

  const buildQuery = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      return params.toString();
    },
    [searchParams],
  );

  const handleSearch = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(() => {
        push(`${pathname}?${buildQuery({ [searchKey]: value })}`);
      });
    }, 350);
  };

  const handleFilter = (key: string, value: string) => {
    startTransition(() => {
      push(
        `${pathname}?${buildQuery({ [key]: value === "_all" ? "" : value })}`,
      );
    });
  };

  const clearAll = () => {
    if (inputRef.current) inputRef.current.value = "";
    if (debounceRef.current) clearTimeout(debounceRef.current);
    startTransition(() => push(pathname));
  };

  const hasActiveFilters =
    (showSearch && !!searchParams.get(searchKey)) ||
    filters.some((f) => !!searchParams.get(f.key));

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {showSearch && (
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            defaultValue={searchParams.get(searchKey) ?? ""}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-8"
          />
        </div>
      )}

      {filters.map((filter) => (
        <Select
          key={filter.key}
          value={searchParams.get(filter.key) ?? "_all"}
          onValueChange={(v) => handleFilter(filter.key, v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={filter.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">
              {filter.allLabel ?? `All ${filter.placeholder}`}
            </SelectItem>
            {filter.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
