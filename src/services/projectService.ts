import {
  addDoc,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ---------------- TYPES ---------------- */

type CreateProjectParams = {
  userId: string;
  name: string;
  prompt?: string;
  modelUrl: string;
};

/* ---------------- CREATE PROJECT ---------------- */

export const createProject = async ({
  userId,
  name,
  prompt = "",
  modelUrl,
}: CreateProjectParams) => {
  try {
    const docRef = await addDoc(collection(db, "projects"), {
      userId,
      name,
      prompt,
      modelUrl,

      // 🔥 status system
      status: "completed", // "processing" | "completed" | "failed"

      // ⭐ favorites system (NEW)
      isFavorite: false,

      // 🖼 thumbnail (future use)
      thumbnail_url: null,

      // ⏱ timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

/* ---------------- UPDATE PROJECT NAME ---------------- */

export const updateProjectName = async (
  projectId: string,
  name: string
) => {
  try {
    if (!name.trim()) throw new Error("Invalid project name");

    await updateDoc(doc(db, "projects", projectId), {
      name,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

/* ---------------- TOGGLE FAVORITE (NEW) ---------------- */

export const toggleFavorite = async (
  projectId: string,
  currentValue: boolean
) => {
  try {
    await updateDoc(doc(db, "projects", projectId), {
      isFavorite: !currentValue,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
};

/* ---------------- DELETE PROJECT ---------------- */

export const deleteProject = async (projectId: string) => {
  try {
    await deleteDoc(doc(db, "projects", projectId));
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};