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
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Dietary Preferences
      </h3>
      <ScrollArea className="w-full">
        <div className="flex flex-wrap gap-2">
          {DIET_FILTERS.map((diet) => {
            const isSelected = selectedDiets.includes(diet);
            return (
              <Button
                key={diet}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onToggleDiet(diet)}
                className={cn(
                  "transition-all duration-200",
                  isSelected && "bg-primary text-primary-foreground"
                )}
              >
                <Badge
                  variant={isSelected ? "secondary" : "outline"}
                  className="mr-2 bg-transparent"
                >
                  {isSelected ? "✓" : "+"}
                </Badge>
                {diet}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}