import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <Input
        type="text"
        placeholder="Search recipes (e.g., chicken pasta, vegetarian curry)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-4 pr-24 h-12 bg-white shadow-sm transition-shadow duration-200 group-hover:shadow-md"
      />
      <Button 
        type="submit" 
        disabled={isLoading || !query.trim()}
        className="absolute right-1 top-1 bottom-1"
      >
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
}