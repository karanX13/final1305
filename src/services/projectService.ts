import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getModelFromPrompt } from "@/lib/modelMapper";

type CreateProjectParams = {
  userId: string;
  name: string;
  prompt?: string;
  modelUrl: string; // ✅ ADD THIS
};

export const createProject = async ({
  userId,
  name,
  prompt = "",
}: CreateProjectParams) => {
  try {
    // 🔥 THIS IS THE MAIN FIX
    const modelUrl = getModelFromPrompt(prompt);

    const docRef = await addDoc(collection(db, "projects"), {
      userId,
      name,
      prompt,
      modelUrl,          // ✅ correct model stored
      status: "completed",
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};