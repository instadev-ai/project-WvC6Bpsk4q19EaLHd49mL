import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
}

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favoriteRecipes") || "[]");
    setIsFavorite(favorites.some((fav: Recipe) => fav.id === recipe.id));
  }, [recipe.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the Link from activating
    const favorites = JSON.parse(localStorage.getItem("favoriteRecipes") || "[]");
    
    if (isFavorite) {
      const newFavorites = favorites.filter((fav: Recipe) => fav.id !== recipe.id);
      localStorage.setItem("favoriteRecipes", JSON.stringify(newFavorites));
      setIsFavorite(false);
      toast({
        description: "Recipe removed from favorites",
      });
    } else {
      localStorage.setItem(
        "favoriteRecipes",
        JSON.stringify([...favorites, recipe])
      );
      setIsFavorite(true);
      toast({
        description: "Recipe added to favorites",
      });
    }
  };

  return (
    <Link to={`/recipe/${recipe.id}`}>
      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <Button
            variant="outline"
            size="icon"
            className={`absolute top-2 right-2 bg-white/80 backdrop-blur-sm ${
              isFavorite ? "text-red-500" : ""
            }`}
            onClick={toggleFavorite}
          >
            <Heart className={isFavorite ? "fill-current" : ""} />
          </Button>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{recipe.title}</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {recipe.vegetarian && <Badge variant="outline">Vegetarian</Badge>}
            {recipe.vegan && <Badge variant="outline">Vegan</Badge>}
            {recipe.glutenFree && <Badge variant="outline">Gluten Free</Badge>}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
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