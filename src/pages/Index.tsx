import { useState, useEffect } from "react";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { SearchBar } from "@/components/SearchBar";
import { DietFilters } from "@/components/DietFilters";
import { RecipeCard, type Recipe } from "@/components/RecipeCard";
import { useToast } from "@/hooks/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Index = () => {
  const [apiKey, setApiKey] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem("spoonacular-api-key");
    if (savedKey) {
      setApiKey(savedKey);
    }

    const savedFavorites = localStorage.getItem("favorite-recipes");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const searchRecipes = async (query: string) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Spoonacular API key first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        apiKey,
        query,
        number: "12",
        addRecipeInformation: "true",
        ...(selectedDiets.length && { diet: selectedDiets.join(",") }),
      });

      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?${params}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch recipes");
      }

      setRecipes(
        data.results.map((recipe: any) => ({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          diets: recipe.diets,
          readyInMinutes: recipe.readyInMinutes,
          servings: recipe.servings,
        }))
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch recipes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDiet = (diet: string) => {
    setSelectedDiets((current) =>
      current.includes(diet)
        ? current.filter((d) => d !== diet)
        : [...current, diet]
    );
  };

  const toggleFavorite = (recipe: Recipe) => {
    setFavorites((current) => {
      const newFavorites = current.some((fav) => fav.id === recipe.id)
        ? current.filter((fav) => fav.id !== recipe.id)
        : [...current, recipe];
      
      localStorage.setItem("favorite-recipes", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Recipe Search</h1>
        
        {!apiKey && <ApiKeyInput />}

        <Tabs defaultValue="search" className="mt-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-6">
            <div className="space-y-6">
              <SearchBar onSearch={searchRecipes} isLoading={isLoading} />
              <DietFilters
                selectedDiets={selectedDiets}
                onToggleDiet={toggleDiet}
              />
              
              {isLoading ? (
                <p className="text-center text-muted-foreground">Loading...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isFavorite={favorites.some((fav) => fav.id === recipe.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            {favorites.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No favorite recipes yet. Start searching and add some!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;