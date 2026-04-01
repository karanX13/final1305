import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, Box, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import ProjectCard from "@/components/projects/ProjectCard";
import { useAuth } from "@/contexts/AuthContext";

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { Project } from "@/types/project";

/* ---------------- Types ---------------- */

interface FirestoreProject extends Project {
  createdAt: Timestamp;
  imageUrl?: string | null;
  thumbnail_url?: string | null;
}

/* ---------------- Component ---------------- */

const Dashboard = () => {
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<FirestoreProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------------- REALTIME FETCH (ONLY CURRENT USER) ---------------- */

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, "projects"),
      where("userId", "==", user.uid), // ✅ current user only
      orderBy("createdAt", "desc")     // ✅ latest first
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: FirestoreProject[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<FirestoreProject, "id">)
        }));

        setProjects(fetched);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching projects:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  /* ---------------- Stats ---------------- */

  const processingCount = projects.filter(
    (p) => p.status !== "completed" && p.status !== "failed"
  ).length;

  const completedCount = projects.filter(
    (p) => p.status === "completed"
  ).length;

  const thisWeekCount = projects.filter((p) => {
    const created = p.createdAt?.toDate?.();
    if (!created) return false;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return created >= weekAgo;
  }).length;

  /* ---------------- Search Filter ---------------- */

  const filteredProjects = projects.filter((p) =>
    (p.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ---------------- Transform ---------------- */

  const transformedProjects = filteredProjects.map((p) => ({
    id: p.id,
    name: p.name || "Untitled Project",
    thumbnail:
      p.imageUrl ||
      p.thumbnail_url ||
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
    createdAt: p.createdAt?.toDate(),
    format: "glb",
    status: p.status
  }));

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-4xl font-bold mb-2">
              Dashboard
            </h1>

            <p className="text-muted-foreground">
              Manage your 3D creations
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Projects" value={projects.length} />
            <StatCard label="Processing" value={processingCount} />
            <StatCard label="Completed" value={completedCount} />
            <StatCard label="This Week" value={thisWeekCount} />
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative md:w-80 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <Input
                placeholder="Search projects..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Link to="/upload">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </Link>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}

          {/* Projects */}
          {!isLoading && transformedProjects.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {transformedProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && transformedProjects.length === 0 && (
            <div className="text-center py-16">
              <Box className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />

              <h3 className="text-xl font-semibold mb-2">
                No projects found
              </h3>

              <Link to="/upload">
                <Button>Create Project</Button>
              </Link>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

/* ---------------- Stat Card ---------------- */

const StatCard = ({
  label,
  value
}: {
  label: string;
  value: number;
}) => (
  <div className="glass-card p-4">
    <div className="text-2xl font-bold">{value}</div>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

export default Dashboard;