import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/layout/Navbar";
import { Loader2 } from "lucide-react";

import "@google/model-viewer";

interface ProjectData {
  name: string;
  modelUrl?: string;
  status: "processing" | "completed" | "failed";
}

const Viewer = () => {
  const { id } = useParams();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        const snapshot = await getDoc(doc(db, "projects", id));

        if (snapshot.exists()) {
          const data = snapshot.data() as ProjectData;
          console.log("MODEL URL:", data.modelUrl); // ✅ correct place
          setProject(data);
        }
      } catch (error) {
        console.error("Error loading project:", error);
      }

      setLoading(false);
    };

    fetchProject();
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 px-4 pb-12">
        <div className="container mx-auto">

          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
          )}

          {!loading && project && (
            <>
              <h1 className="text-3xl font-bold mb-6">
                {project.name}
              </h1>

              {project.status === "processing" && (
                <div className="text-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Model is still processing...
                  </p>
                </div>
              )}

            
           {/* 
<p className="mb-2 text-sm text-gray-400">
  Model URL: {project.modelUrl}
</p>
*/}
              


              {project.status === "completed" && project.modelUrl && (
                <div className="rounded-xl overflow-hidden shadow-xl">
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
                    }}
                  />
                </div>
              )}

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