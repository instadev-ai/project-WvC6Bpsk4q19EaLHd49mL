import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyInputProps {
  onSave: (key: string) => void;
}

export function ApiKeyInput({ onSave }: ApiKeyInputProps) {
  const [inputKey, setInputKey] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    if (!inputKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem("spoonacularApiKey", inputKey);
    onSave(inputKey);
    toast({
      title: "Success",
      description: "Your API key has been saved successfully.",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/50">
      <CardHeader>
        <CardTitle>Enter Your API Key</CardTitle>
        <CardDescription className="space-y-2">
          <p>
            To use this app, you need a Spoonacular API key. Get your free key from{" "}
            <a
              href="https://spoonacular.com/food-api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary inline-flex items-center hover:underline font-medium"
            >
              Spoonacular Food API
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </p>
          <p className="text-sm">
            Your key will be stored locally and never shared with anyone.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Enter your API key"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className="bg-white"
          />
          <Button 
            onClick={handleSave} 
            className="w-full"
            disabled={!inputKey.trim()}
          >
            Save & Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}