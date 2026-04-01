import { useState } from "react";
import { motion } from "framer-motion";
import { createProject } from "@/services/projectService";
import { useAuth } from "@/contexts/AuthContext";
import { getModelFromPrompt } from "../lib/modelMapper";

import {
  Sparkles,
  Wand2,
  ArrowLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";

import AIImageGenerator from "@/components/upload/AIImageGenerator";
import { toast } from "@/hooks/use-toast";

const Upload = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [aiPrompt, setAiPrompt] = useState("");
  const [projectName, setProjectName] = useState(""); // ✅ NEW

  /* 🔥 HANDLE GENERATE */
  const handleGenerate = async () => {
    try {
      if (!user) {
        toast({ title: "Login first", variant: "destructive" });
        return;
      }

      if (!aiPrompt.trim()) {
        toast({ title: "Enter prompt", variant: "destructive" });
        return;
      }

      if (!projectName.trim()) {
        toast({ title: "Enter project name", variant: "destructive" });
        return;
      }

      const modelUrl = getModelFromPrompt(aiPrompt);

      const projectId = await createProject({
        userId: user.uid,
        name: projectName, // ✅ correct
        prompt: aiPrompt,
        modelUrl,
      });

      toast({ title: "Model Generated ✅" });

      navigate(`/viewer/${projectId}`);

      setAiPrompt("");
      setProjectName(""); // reset

    } catch (err) {
      console.error(err);
      toast({ title: "Error occurred", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">

          {/* 🔙 Back Button */}
          <Button onClick={() => navigate(-1)} className="mb-6 flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* 🎯 Heading */}
          <h1 className="text-5xl font-bold text-center text-transparent bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text">
            Create 3D Model
          </h1>

          <motion.div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mt-8">

            <Tabs defaultValue="ai">

              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="ai">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Text → 3D
                </TabsTrigger>

                <TabsTrigger value="coming">
                  🚀 Coming Soon
                </TabsTrigger>
              </TabsList>

              {/* ✅ TEXT TO 3D */}
              <TabsContent value="ai">
                <AIImageGenerator
                  onGenerate={(img, prompt) => setAiPrompt(prompt)}
                  onPromptChange={(p) => setAiPrompt(p)}
                />
              </TabsContent>

              {/* 🚀 FUTURE FEATURES */}
              <TabsContent value="coming">
                <div className="text-center p-6 text-zinc-400 space-y-2">
                  <p>🚀 Image Upload → 3D (Coming Soon)</p>
                  <p>🤖 AI Image Detection Improvements</p>
                  <p>📦 Batch Processing</p>
                </div>
              </TabsContent>

            </Tabs>

            {/* 🧠 Project Name Input */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-1">Project Name</p>
              <input
                type="text"
                placeholder="Enter project name..."
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* 🔥 Centered Generate Button */}
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleGenerate}
                className="bg-gradient-to-r from-cyan-500 to-pink-500 px-8 py-4 text-lg rounded-xl hover:scale-105 transition"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                Generate 3D Model
              </Button>
            </div>

          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Upload;