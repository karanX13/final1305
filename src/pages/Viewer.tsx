import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/layout/Navbar";
import { Loader2, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import "@google/model-viewer";

interface ProjectData {
  name: string;
  modelUrl?: string;
  status: "processing" | "completed" | "failed";
}

const Viewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH PROJECT ---------------- */

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        const snapshot = await getDoc(doc(db, "projects", id));

        if (snapshot.exists()) {
          const data = snapshot.data() as ProjectData;
          setProject(data);
        }
      } catch (error) {
        console.error("Error loading project:", error);
      }

      setLoading(false);
    };

    fetchProject();
  }, [id]);

  /* ---------------- DOWNLOAD ---------------- */

  const handleDownload = () => {
    if (!project?.modelUrl) return;

    const link = document.createElement("a");
    link.href = project.modelUrl;
    link.download = `${project.name || "model"}.glb`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 px-4 pb-12">
        <div className="container mx-auto max-w-5xl">

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
          )}

          {/* Content */}
          {!loading && project && (
            <>
              {/* Top Controls */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>

                {project.status === "completed" && project.modelUrl && (
                  <Button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                )}
              </div>

              {/* Processing */}
              {project.status === "processing" && (
                <div className="text-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Model is still processing...
                  </p>
                </div>
              )}

              {/* 🔥 Model Container */}
              {project.status === "completed" && project.modelUrl && (
                <div className="border border-gray-800 rounded-2xl p-4 bg-black/40 shadow-xl">

                  {/* Model */}
                  <model-viewer
                    src={project.modelUrl}
                    auto-rotate
                    camera-controls
                    scale="15 15 15"
                    camera-orbit="0deg 75deg 3m"
                    style={{
                      width: "100%",
                      height: "500px",
                      backgroundColor: "#111",
                      borderRadius: "12px",
                    }}
                  />

                  {/* 🔥 Title BELOW */}
                  <h1 className="text-center text-2xl md:text-3xl font-bold mt-4">
                    {project.name}
                  </h1>
                </div>
              )}

              {/* Failed */}
              {project.status === "failed" && (
                <div className="text-center py-20 text-red-500">
                  Model generation failed.
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default Viewer;