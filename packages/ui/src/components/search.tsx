"use client";

import { SearchIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/use-debounce";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";

type SearchProps = React.ComponentProps<typeof InputGroupInput> & {
  search?: string;
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
  inputGroupProps: React.ComponentProps<typeof InputGroup>;
};

export const Search = ({
  search = "",
  setSearch,
  inputGroupProps,
  ...props
}: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState(search);
  const debouncedSearchTerm = useDebounce(searchTerm as string);
  const isControlled = typeof setSearch === "function";

  // biome-ignore lint/correctness/useExhaustiveDependencies: dependency on purpose
  useEffect(() => {
    if (search !== searchTerm) {
      setSearchTerm(search);
    }
  }, [search]);

  useEffect(() => {
    if (isControlled) {
      setSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, isControlled, setSearch]);

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearchHandler = () => {
    setSearchTerm("");
    if (isControlled) {
      setSearch("");
    }
  };

  return (
    <InputGroup {...inputGroupProps}>
      <InputGroupInput
        placeholder="Search..."
        {...props}
        onChange={searchHandler}
        value={searchTerm}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      {searchTerm && (
        <InputGroupAddon
          align="inline-end"
          className="cursor-pointer"
          onClick={clearSearchHandler}
        >
          <X />
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};
