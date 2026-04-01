import { motion } from "framer-motion";
import {
  Upload,
  Sparkles,
  Box,
  Palette,
  Smartphone,
  Cloud,
  Download,
  RotateCcw,
} from "lucide-react";

// ✅ Powerful Features
const powerfulFeatures = [
  {
    icon: Sparkles,
    title: "AI Enhancement",
    description:
      "Automatic mesh smoothing, texture improvement, and intelligent hole repair.",
  },
  {
    icon: Box,
    title: "3D Model Viewer",
    description:
      "Interactive viewer with rotate, zoom, lighting control, and real-time preview.",
  },
  {
    icon: Download,
    title: "Export Formats",
    description:
      "Export in GLB, OBJ, FBX, STL, USDZ, MP4, or animated GIF formats.",
  },
];

// 🔥 Upcoming Features
const upcomingFeatures = [
  {
    icon: Upload,
    title: "Multi-Image Upload",
    description:
      "Upload 1, 2, 4, or 8 images from different angles for high-quality 3D output.",
  },
  {
    icon: Palette,
    title: "Material Editor",
    description:
      "Apply metal, plastic, matte, or custom materials with live visual feedback.",
  },
  {
    icon: Smartphone,
    title: "AR Ready",
    description:
      "View your models in real-world scale using AR on supported devices.",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    description:
      "Projects automatically saved and synced across all your devices.",
  },
  {
    icon: RotateCcw,
    title: "360° Video Export",
    description:
      "Generate rotating 360-degree product videos in seconds.",
  },
];

const Features = () => {
  return (
   <section className="pt-28 pb-16 px-6 relative overflow-hidden">
      {/* Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,255,255,0.08),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-24">

        {/* ================= POWERFUL FEATURES ================= */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Powerful{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Core features available right now.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-hidden">
            {powerfulFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
          <motion.div
  key={index}
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  whileHover={{ y: -16, scale: 1.03 }}
  transition={{
    delay: index * 0.1,
    type: "spring",
    stiffness: 200,
  }}
  viewport={{ once: true }}
  className="group relative backdrop-blur-xl bg-white/5 border border-white/10 
             rounded-2xl p-8 transition-all duration-300 
             hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/10"
>
                  {/* Icon */}
                  <div className="w-14 h-14 mb-6 rounded-xl flex items-center justify-center 
                                  bg-gradient-to-br from-cyan-500 via-purple-500 to-blue-500 
                                  shadow-lg shadow-purple-500/30">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r 
                                  from-cyan-500/10 via-purple-500/10 to-blue-500/10 
                                  opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ================= UPCOMING FEATURES ================= */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Upcoming{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Features we are currently working on 🚀
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 overflow-hidden">
            {upcomingFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group relative backdrop-blur-xl bg-white/5 border border-white/10 
                             rounded-2xl p-8 transition-all duration-300 
                             opacity-80 hover:opacity-100
                             hover:border-purple-400/40 hover:shadow-2xl hover:shadow-purple-500/10"
                >
                  {/* Coming Soon Badge */}
                  <span className="absolute top-3 right-3 text-xs px-3 py-1 rounded-full 
                                   bg-gradient-to-r from-purple-500 to-blue-500 
                                   text-white font-semibold shadow-lg shadow-purple-500/30">
                    Coming Soon
                  </span>

                  {/* Icon */}
                  <div className="w-14 h-14 mb-6 rounded-xl flex items-center justify-center 
                                  bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 
                                  shadow-lg shadow-purple-500/30">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r 
                                  from-purple-500/10 via-pink-500/10 to-orange-500/10 
                                  opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;