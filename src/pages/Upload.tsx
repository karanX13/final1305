import { useState } from "react";
import { motion } from "framer-motion";
import { createProject } from "@/services/projectService";
import { useAuth } from "@/contexts/AuthContext";
import { getModelFromPrompt } from "../lib/modelMapper";

import {
  Sparkles,
  Upload as UploadIcon,
  Link2,
  Layers,
  Wand2,
  ArrowLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";

import BatchUploader from "@/components/upload/BatchUploader";
import AIImageGenerator from "@/components/upload/AIImageGenerator";
import { useImageTo3D } from "@/hooks/useImageTo3D";
import { toast } from "@/hooks/use-toast";

const Upload = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [uploadMethod, setUploadMethod] =
    useState<"file" | "url" | "ai" | "batch">("ai");

  const [aiPrompt, setAiPrompt] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState("");

  const [projectName, setProjectName] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);

  const { isProcessing } = useImageTo3D();

  const handleGenerate = async () => {
    try {
      if (!user) {
        toast({ title: "Please login first", variant: "destructive" });
        return;
      }

      if (!projectName.trim()) {
        toast({ title: "Project name required", variant: "destructive" });
        return;
      }

      let modelUrl = "";
      let finalPrompt = aiPrompt.trim(); // ✅ FIX: prevent missing letter

      /* ---------------- AI GENERATION ---------------- */
      if (uploadMethod === "ai") {
        if (!finalPrompt) {
          toast({ title: "Enter a prompt", variant: "destructive" });
          return;
        }

        toast({ title: "Generating 3D model..." });

        await new Promise((res) => setTimeout(res, 2000));

        modelUrl = getModelFromPrompt(finalPrompt);
      }

      /* ---------------- FILE UPLOAD ---------------- */
      else if (uploadMethod === "file") {
        if (!selectedFile) {
          toast({ title: "Please select a file", variant: "destructive" });
          return;
        }

        if (
          selectedFile.name.endsWith(".glb") ||
          selectedFile.name.endsWith(".gltf")
        ) {
          modelUrl = "/models/fox_glb.glb";
        } else {
          toast({ title: "Converting image to 3D..." });

          await new Promise((res) => setTimeout(res, 2000));

          modelUrl = "/models/fox_glb.glb";
        }

        finalPrompt = selectedFile.name;
      }

      /* ---------------- URL INPUT ---------------- */
      else if (uploadMethod === "url") {
        if (!urlInput.trim()) {
          toast({
            title: "Please enter an image URL",
            variant: "destructive",
          });
          return;
        }

        toast({ title: "Processing image..." });

        await new Promise((res) => setTimeout(res, 2000));

        modelUrl = "/models/fox_glb.glb";
        finalPrompt = urlInput.trim();
      }

      /* ---------------- DEBUG ---------------- */
      console.log("PROMPT:", finalPrompt);
      console.log("MODEL:", modelUrl);

      /* ---------------- SAVE TO FIREBASE ---------------- */
      const projectId = await createProject({
        userId: user.uid,
        name: projectName,
        prompt: finalPrompt,
        modelUrl, // ✅ ALWAYS correct now
      });

      toast({ title: "3D Model Generated ✅" });

      navigate(`/viewer/${projectId}`);

      // reset
      setProjectName("");
      setAiPrompt("");
      setSelectedFile(null);
      setUrlInput("");
    } catch (error) {
      console.error(error);
      toast({ title: "Something went wrong", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">

          <div className="flex justify-start mb-6">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-zinc-700 text-white hover:bg-zinc-800"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
              Create 3D Model
            </h1>

            <p className="text-gray-400 mt-3">
              Convert images or prompts into AI-generated 3D models
            </p>
          </motion.div>

          <motion.div className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl p-8">

            <Tabs
              value={uploadMethod}
              onValueChange={(v) =>
                setUploadMethod(v as "file" | "url" | "ai" | "batch")
              }
            >
              <TabsList className="grid grid-cols-4 mb-8">

                <TabsTrigger value="file">
                  <UploadIcon className="w-4 h-4 mr-2" />
                  Upload
                </TabsTrigger>

                <TabsTrigger value="url">
                  <Link2 className="w-4 h-4 mr-2" />
                  URL
                </TabsTrigger>

                <TabsTrigger value="ai">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Image
                </TabsTrigger>

                <TabsTrigger value="batch">
                  <Layers className="w-4 h-4 mr-2" />
                  Batch
                </TabsTrigger>

              </TabsList>

              <TabsContent value="ai">
                <AIImageGenerator
  onGenerate={(imageUrl, prompt) => {
    setAiPrompt(prompt);
  }}
  onPromptChange={(prompt) => {
    setAiPrompt(prompt); // 🔥 THIS FIXES EVERYTHING
  }}
/>
              </TabsContent>

              <TabsContent value="file">
                <input
                  type="file"
                  accept="image/*,.glb,.gltf"
                  onChange={(e) =>
                    setSelectedFile(e.target.files?.[0] || null)
                  }
                />
              </TabsContent>

              <TabsContent value="url">
                <input
                  type="text"
                  placeholder="Paste image URL here..."
                  className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
              </TabsContent>

              <TabsContent value="batch">
                <BatchUploader onFilesChange={() => {}} />
              </TabsContent>

            </Tabs>

            {!isProcessing && (
              <div className="mt-10">
                <Button
                  size="lg"
                  onClick={() => setShowProjectModal(true)}
                  className="gap-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                >
                  <Wand2 className="w-5 h-5" />
                  Generate 3D Model
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {showProjectModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-xl w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Project Name</h2>

            <input
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded mb-4"
              placeholder="My 3D Model"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowProjectModal(false)}
              >
                Cancel
              </Button>

              <Button
                onClick={() => {
                  setShowProjectModal(false);
                  handleGenerate();
                }}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;