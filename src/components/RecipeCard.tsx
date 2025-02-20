import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export interface Recipe {
  id: number;
  title: string;
  image: string;
  diets: string[];
  readyInMinutes: number;
  servings: number;
}

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, isFavorite, onToggleFavorite }: RecipeCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.diets.map((diet) => (
            <Badge key={diet} variant="secondary">
              {diet}
            </Badge>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Ready in {recipe.readyInMinutes} minutes</p>
          <p>Serves {recipe.servings}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant={isFavorite ? "destructive" : "secondary"}
          size="sm"
          className="w-full"
          onClick={() => onToggleFavorite(recipe)}
        >
          <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </Button>
      </CardFooter>
    </Card>
  );
}