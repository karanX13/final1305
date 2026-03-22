
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
  Smartphone
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

/* ---------------- Types ---------------- */

interface Project {
  id: string;
  name: string;
  thumbnail?: string;
  modelUrl?: string;
  createdAt: Date;
  format: string;
  status: ProjectStatus;
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

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "projects", project.id));
      setShowConfirm(false);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="glass-card-hover group"
      >

        {/* Thumbnail / 3D Preview */}

        <div
          className="aspect-square relative overflow-hidden rounded-t-xl"
          onMouseEnter={() => setShow3D(true)}
          onMouseLeave={() => setShow3D(false)}
        >
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
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <Box className="w-16 h-16 text-muted-foreground" />
            </div>
          )}

          {/* Status */}

          <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 rounded-full glass-card text-xs">
            <div
              className={`w-2 h-2 rounded-full ${statusColors[project.status]}`}
            />
            <span className="capitalize">{project.status}</span>
          </div>

          {/* Hover Actions */}

          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 gap-2">
            <Link to={`/viewer/${project.id}`}>
              <Button variant="glass" size="sm" className="gap-1">
                <Eye className="w-4 h-4" />
                View
              </Button>
            </Link>

            <Button variant="glass" size="sm" className="gap-1">
              <Smartphone className="w-4 h-4" />
              AR
            </Button>
          </div>
        </div>

        {/* Info */}

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">

            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold truncate">
                {project.name}
              </h3>

              <p className="text-sm text-muted-foreground">
                {project.createdAt.toLocaleDateString()} •{" "}
                {project.format.toUpperCase()}
              </p>
            </div>

            {/* Dropdown */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="glass-card border-border"
              >
                <DropdownMenuItem asChild>
                  <Link
                    to={`/viewer/${project.id}`}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Model
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </DropdownMenuItem>

                <DropdownMenuItem className="gap-2">
                  <Copy className="w-4 h-4" />
                  Duplicate
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setShowConfirm(true)}
                  className="gap-2 text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>

      </motion.div>

      {/* Delete Confirmation */}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-background p-6 rounded-xl shadow-xl w-80">

            <h3 className="text-lg font-semibold mb-2">
              Delete Project?
            </h3>

            <p className="text-sm text-muted-foreground mb-4">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2">

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
              >
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
