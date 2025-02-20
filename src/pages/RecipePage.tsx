import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";

interface RecipeDetails {
  id: number;
  title: string;
  image: string;
  summary: string;
  readyInMinutes: number;
  servings: number;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  instructions: string;
  extendedIngredients: Array<{
    original: string;
    id: number;
  }>;
  nutrition: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
}

export function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const apiKey = localStorage.getItem("spoonacularApiKey");
        if (!apiKey) {
          throw new Error("API Key is required");
        }

        const response = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}&includeNutrition=true`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch recipe details");
        }

        const data = await response.json();
        setRecipe(data);

        // Check if recipe is in favorites
        const favorites = JSON.parse(localStorage.getItem("favoriteRecipes") || "[]");
        setIsFavorite(favorites.some((fav: { id: number }) => fav.id === Number(id)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast({
          variant: "destructive",
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to load recipe",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id, toast]);

  const toggleFavorite = () => {
    if (!recipe) return;

    const favorites = JSON.parse(localStorage.getItem("favoriteRecipes") || "[]");
    const isCurrentlyFavorite = favorites.some((fav: { id: number }) => fav.id === recipe.id);

    if (isCurrentlyFavorite) {
      const newFavorites = favorites.filter((fav: { id: number }) => fav.id !== recipe.id);
      localStorage.setItem("favoriteRecipes", JSON.stringify(newFavorites));
      setIsFavorite(false);
      toast({
        description: "Recipe removed from favorites",
      });
    } else {
      const newFavorite = {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
      };
      localStorage.setItem("favoriteRecipes", JSON.stringify([...favorites, newFavorite]));
      setIsFavorite(true);
      toast({
        description: "Recipe added to favorites",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Recipe</h2>
          <p className="mb-4">{error || "Recipe not found"}</p>
          <Link to="/">
            <Button>Return to Search</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <Link to="/">
          <Button variant="outline">← Back to Search</Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFavorite}
          className={isFavorite ? "text-red-500" : ""}
        >
          <Heart className={isFavorite ? "fill-current" : ""} />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.vegetarian && <Badge>Vegetarian</Badge>}
            {recipe.vegan && <Badge>Vegan</Badge>}
            {recipe.glutenFree && <Badge>Gluten Free</Badge>}
            {recipe.dairyFree && <Badge>Dairy Free</Badge>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="font-semibold">Time</p>
              <p>{recipe.readyInMinutes} mins</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="font-semibold">Servings</p>
              <p>{recipe.servings}</p>
            </div>
          </div>

          <div className="prose max-w-none mb-8" 
               dangerouslySetInnerHTML={{ __html: recipe.summary }} 
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
            <ul className="list-disc pl-6 space-y-2">
              {recipe.extendedIngredients.map((ingredient) => (
                <li key={ingredient.id}>{ingredient.original}</li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Instructions</h2>
            <div className="prose max-w-none"
                 dangerouslySetInnerHTML={{ __html: recipe.instructions }} 
            />
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Nutrition Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recipe.nutrition.nutrients
              .filter((nutrient) => 
                ["Calories", "Protein", "Carbohydrates", "Fat"].includes(nutrient.name)
              )
              .map((nutrient) => (
                <div key={nutrient.name} className="text-center p-4 bg-muted rounded-lg">
                  <p className="font-semibold">{nutrient.name}</p>
                  <p>{Math.round(nutrient.amount)}{nutrient.unit}</p>
                </div>
              ))
            }
          </div>
        </Card>
      </div>
    </div>
  );
}