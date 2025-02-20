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
import { Button } from "@/components/ui/button";
import { ChefHat, Settings } from "lucide-react";

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

  const handleResetApiKey = () => {
    localStorage.removeItem("spoonacular-api-key");
    setApiKey("");
    toast({
      title: "API Key Reset",
      description: "Your API key has been removed. You can now enter a new one.",
    });
  };

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4">
        <div className="container mx-auto py-16">
          <div className="flex items-center justify-center mb-8">
            <ChefHat className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Recipe Search
            </h1>
          </div>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Discover delicious recipes, save your favorites, and cook with confidence.
            Get started by adding your Spoonacular API key below.
          </p>
          <ApiKeyInput onSave={setApiKey} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ChefHat className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-primary">Recipe Search</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={handleResetApiKey}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="search" className="space-y-8">
          <div className="flex flex-col items-center">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="search" className="space-y-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <SearchBar onSearch={searchRecipes} isLoading={isLoading} />
              <DietFilters
                selectedDiets={selectedDiets}
                onToggleDiet={toggleDiet}
              />
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Searching for recipes...</p>
              </div>
            ) : recipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={favorites.some((fav) => fav.id === recipe.id)}
                    onToggleFavorite={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Enter ingredients above to search for recipes
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No favorite recipes yet. Start searching and add some!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={true}
                    onToggleFavorite={() => {}}
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