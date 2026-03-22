import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onGenerate: (imageUrl: string, prompt: string) => void;
  onPromptChange: (prompt: string) => void; // 🔥 NEW
}

const AIImageGenerator = ({ onGenerate, onPromptChange }: Props) => {
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    const finalPrompt = prompt.trim();
    if (!finalPrompt) return;

    const demoImage = "/placeholder.svg";

    onGenerate(demoImage, finalPrompt);
  };

  return (
    <div className="space-y-4">

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          AI Prompt
        </label>

        <textarea
  value={prompt}
  onChange={(e) => {
    const value = e.target.value;
    setPrompt(value);
    onPromptChange(value); // ✅ send to Upload.tsx
  }}
  placeholder="Describe the object you want to generate..."
  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white"
  rows={4}
/>
      </div>

      <Button
        onClick={handleGenerate}
        className="w-full bg-gradient-to-r from-cyan-500 to-purple-500"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Generate Image
      </Button>

      <div className="flex items-center text-sm text-gray-400 gap-2">
        <Sparkles className="w-4 h-4" />
        You can directly generate 3D model without clicking this
      </div>

    </div>
  );
};

export default AIImageGenerator;