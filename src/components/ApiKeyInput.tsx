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

  useEffect(() => {
    const savedKey = localStorage.getItem("spoonacular-api-key");
    if (savedKey) {
      setInputKey(savedKey);
      onSave(savedKey);
    }
  }, [onSave]);

  const handleSave = () => {
    localStorage.setItem("spoonacular-api-key", inputKey);
    onSave(inputKey);
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved successfully.",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Spoonacular API Key</CardTitle>
        <CardDescription>
          To use this app, you need a Spoonacular API key. Get your free key from{" "}
          <a
            href="https://spoonacular.com/food-api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary inline-flex items-center hover:underline"
          >
            Spoonacular Food API
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Input
          type="password"
          placeholder="Enter your API key"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
        />
        <Button onClick={handleSave}>Save</Button>
      </CardContent>
    </Card>
  );
}