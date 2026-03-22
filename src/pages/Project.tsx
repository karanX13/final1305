
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "@google/model-viewer";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  name: string;
  imageUrl?: string;
  modelUrl?: string;
  status: "processing" | "completed" | "failed";
  createdAt?: any;
}

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      const ref = doc(db, "projects", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProject({
          id: snap.id,
          ...(snap.data() as Omit<Project, "id">),
        });
      }

      setLoading(false);
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center py-20">
        Project not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">

          {/* Header */}

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{project.name}</h1>

            <Link to="/dashboard">
              <Button variant="outline">Back</Button>
            </Link>
          </div>

          {/* Content */}

          <div className="grid md:grid-cols-2 gap-8">

            {/* Original Image */}

            <div>
              <h3 className="font-semibold mb-2">Source Image</h3>

              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt="source"
                  className="rounded-lg w-full"
                />
              ) : (
                <div className="bg-secondary p-10 rounded-lg text-center">
                  No image available
                </div>
              )}
            </div>

            {/* 3D Viewer */}

            <div>
              <h3 className="font-semibold mb-2">3D Model</h3>

              {project.modelUrl ? (
                <model-viewer
                  src={project.modelUrl}
                  camera-controls
                  auto-rotate
                  style={{ width: "100%", height: "400px" }}
                />
              ) : (
                <div className="bg-secondary p-10 rounded-lg text-center">
                  Model not generated yet
                </div>
              )}
            </div>

          </div>

          {/* Metadata */}

          <div className="mt-8">
            <h3 className="font-semibold mb-2">Project Info</h3>

            <p>Status: {project.status}</p>
          </div>

          {/* Actions */}

          {project.modelUrl && (
            <div className="mt-6 flex gap-3">
              <a href={project.modelUrl} download>
                <Button>Download Model</Button>
              </a>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default ProjectPage;
