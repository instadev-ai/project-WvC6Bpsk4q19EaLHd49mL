import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const DIET_FILTERS = [
  "Gluten Free",
  "Ketogenic",
  "Vegetarian",
  "Vegan",
  "Pescetarian",
  "Paleo",
  "Whole30",
];

interface DietFiltersProps {
  selectedDiets: string[];
  onToggleDiet: (diet: string) => void;
}

export function DietFilters({ selectedDiets, onToggleDiet }: DietFiltersProps) {
  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 p-1 max-w-2xl mx-auto">
        {DIET_FILTERS.map((diet) => {
          const isSelected = selectedDiets.includes(diet);
          return (
            <Button
              key={diet}
              variant="outline"
              size="sm"
              className={cn(
                "whitespace-nowrap",
                isSelected && "bg-primary text-primary-foreground"
              )}
              onClick={() => onToggleDiet(diet)}
            >
              <Badge
                variant={isSelected ? "secondary" : "outline"}
                className="mr-2"
              >
                {selectedDiets.includes(diet) ? "✓" : "+"}
              </Badge>
              {diet}
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
}