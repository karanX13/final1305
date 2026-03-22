import { useState } from "react";
import { db } from "@/lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { updateDoc, doc } from "firebase/firestore";
import { generate3DModel } from "@/api/meshyApi";

/* -------------------- TYPES -------------------- */

type ConversionInput = string | File;

interface ConversionSettings {
  projectId: string;
  projectName: string;
  outputFormat: string;
  quality: string;
  meshSmoothing: boolean;
  textureEnhancement: boolean;
  holeRepair: boolean;
  sourceType?: string;
  sourcePrompt?: string;
}

interface ConversionResult {
  status: "SUCCEEDED" | "FAILED" | "PROCESSING";
  progress: number;
  modelUrl?: string;
  projectId?: string;
}

/* -------------------- HOOK -------------------- */

export function useImageTo3D() {
  const { user } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);

  const startConversion = async (
    input: ConversionInput,
    settings: ConversionSettings
  ) => {
    const { projectId } = settings;

    try {
      if (!user) throw new Error("User not authenticated");

      setIsProcessing(true);
      setError(null);
      setProgress(10);

      /* -------------------- HANDLE INPUT -------------------- */

      let imageUrl: string;

      if (typeof input === "string") {
        imageUrl = input;
      } else {
        imageUrl = URL.createObjectURL(input);
      }

      /* -------------------- UPDATE PROJECT WITH IMAGE -------------------- */

      await updateDoc(doc(db, "projects", projectId), {
        status: "processing",
        imageUrl,
        settings,
      });

      setProgress(40);

      /* -------------------- CALL AI API -------------------- */

      const aiResult = await generate3DModel(imageUrl);

      if (aiResult.status === "completed") {
        const modelUrl = aiResult.modelUrl;

        await updateDoc(doc(db, "projects", projectId), {
          status: "completed",
          modelUrl,
        });

        setProgress(100);

        setResult({
          status: "SUCCEEDED",
          progress: 100,
          modelUrl,
          projectId,
        });
      }

      setIsProcessing(false);
    } catch (err) {
      console.error(err);

      if (settings.projectId) {
        await updateDoc(doc(db, "projects", settings.projectId), {
          status: "failed",
        });
      }

      setError("Conversion failed");

      setResult({
        status: "FAILED",
        progress: 0,
      });

      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    progress,
    error,
    result,
    startConversion,
  };
}