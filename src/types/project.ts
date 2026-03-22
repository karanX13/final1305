/* ---------- Project Status ---------- */

export type ProjectStatus =
  | "uploading"
  | "generating"
  | "texturing"
  | "optimizing"
  | "completed"
  | "failed";

/* ---------- Project Interface ---------- */

export interface Project {
  id?: string;

  userId: string;
  name: string;

  prompt?: string;

  /* AI generation status */
  status: ProjectStatus;

  /* URLs */
  imageUrl?: string;
  modelUrl?: string;

  /* timestamps */
  createdAt: any;
}