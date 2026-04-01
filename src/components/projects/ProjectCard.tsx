import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  Box,
  MoreVertical,
  Download,
  Trash2,
  Copy,
  Eye,
  Star,
} from "lucide-react";

import "@google/model-viewer";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProjectStatus } from "@/types/project";
import { toggleFavorite } from "@/services/projectService";

/* ---------------- Types ---------------- */

interface Project {
  id: string;
  name: string;
  thumbnail?: string;
  modelUrl?: string;
  createdAt: Date;
  format: string;
  status: ProjectStatus;
  isFavorite?: boolean;
}

interface ProjectCardProps {
  project: Project;
  index?: number;
}

/* ---------------- Component ---------------- */

const ProjectCard = ({ project, index = 0 }: ProjectCardProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [show3D, setShow3D] = useState(false);

  const statusColors = {
    processing: "bg-yellow-500",
    completed: "bg-green-500",
    failed: "bg-red-500",
  };

  /* ---------------- HANDLERS ---------------- */

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "projects", project.id));
      setShowConfirm(false);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleFavorite = async () => {
    try {
      await toggleFavorite(project.id, project.isFavorite ?? false);
    } catch (error) {
      console.error("Favorite failed:", error);
    }
  };

  const handleDownload = (format: string) => {
    if (!project.modelUrl) return;

    const url = project.modelUrl.replace(".glb", `.${format}`);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name}.${format}`;
    a.click();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-300"
      >

        {/* 🔥 COVER */}
        <div
          className="aspect-square relative overflow-hidden"
          onMouseEnter={() => setShow3D(true)}
          onMouseLeave={() => setShow3D(false)}
        >

          {/* 3D Preview OR Image */}
          {show3D && project.status === "completed" && project.modelUrl ? (
            <model-viewer
              src={project.modelUrl}
              camera-controls
              auto-rotate
              style={{ width: "100%", height: "100%" }}
            />
          ) : project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <Box className="w-16 h-16 text-muted-foreground" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* ⭐ Favorite */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFavorite();
            }}
            className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/50 backdrop-blur-md hover:scale-110 transition"
          >
            <Star
              className={`w-4 h-4 ${
                project.isFavorite
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-white"
              }`}
            />
          </button>

          {/* Status */}
          <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 rounded-full bg-black/60 text-xs">
            <div
              className={`w-2 h-2 rounded-full ${statusColors[project.status]}`}
            />
            <span className="capitalize">{project.status}</span>
          </div>

          {/* 🔥 ACTION BUTTONS */}
          <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">

            <Link to={`/viewer/${project.id}`}>
              <Button size="sm" className="gap-1 bg-white/10 backdrop-blur hover:bg-white/20">
                <Eye className="w-4 h-4" />
                View
              </Button>
            </Link>

            {/* ❌ AR REMOVED */}

            {project.modelUrl && (
              <Button
                size="sm"
                onClick={() => handleDownload("glb")}
                className="gap-1 bg-white/10 backdrop-blur hover:bg-white/20"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            )}

          </div>
        </div>

        {/* 🔥 CONTENT */}
        <div className="p-4 flex items-center justify-between">

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{project.name}</h3>

            <p className="text-sm text-muted-foreground">
              {project.createdAt.toLocaleDateString()} • {project.format.toUpperCase()}
            </p>
          </div>

          {/* Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="border border-white/10 bg-black/80 backdrop-blur-xl">

              <DropdownMenuItem asChild>
                <Link to={`/viewer/${project.id}`} className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  View Model
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleDownload("glb")} className="gap-2">
                <Download className="w-4 h-4" />
                Download GLB
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleDownload("obj")} className="gap-2">
                Download OBJ
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleDownload("usdz")} className="gap-2">
                Download USDZ
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setShowConfirm(true)}
                className="gap-2 text-red-500"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-xl shadow-xl w-80">
            <h3 className="text-lg font-semibold mb-2">Delete Project?</h3>

            <p className="text-sm text-muted-foreground mb-4">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>

              <Button variant="destructive" size="sm" onClick={handleDelete}>
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectCard;