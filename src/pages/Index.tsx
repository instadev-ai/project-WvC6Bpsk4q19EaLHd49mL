import { ApiKeyInput } from "@/components/ApiKeyInput";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Recipe Search</h1>
        <ApiKeyInput />
        {/* Recipe search components will be added here */}
      </main>
    </div>
  );
};

export default Index;