import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Heart } from "lucide-react";

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  diets?: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, isFavorite, onToggleFavorite }: RecipeCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggleFavorite(recipe);
  };

  return (
    <Link to={`/recipe/${recipe.id}`} className="block group">
      <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-lg">
        <div className="relative aspect-video">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <Button
            variant="outline"
            size="icon"
            className={`absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors ${
              isFavorite ? "text-red-500 hover:text-red-600" : "text-gray-600 hover:text-gray-700"
            }`}
            onClick={handleFavoriteClick}
          >
            <Heart className={`h-5 w-5 transition-all ${isFavorite ? "fill-current scale-110" : "scale-100"}`} />
          </Button>
          {recipe.diets && recipe.diets.length > 0 && (
            <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
              {recipe.diets.slice(0, 2).map((diet) => (
                <Badge
                  key={diet}
                  variant="secondary"
                  className="bg-black/50 text-white backdrop-blur-sm text-xs"
                >
                  {diet}
                </Badge>
              ))}
              {recipe.diets.length > 2 && (
                <Badge
                  variant="secondary"
                  className="bg-black/50 text-white backdrop-blur-sm text-xs"
                >
                  +{recipe.diets.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0 flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.readyInMinutes}m</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} servings</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}