import { motion } from "framer-motion";
import { Upload, Sparkles, Box } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Images",
    description:
      "Upload one or multiple images from different angles to capture full object details.",
  },
  {
    icon: Sparkles,
    title: "AI Generates 3D Model",
    description:
      "Our AI processes depth, texture, and geometry to create a high-quality 3D mesh.",
  },
  {
    icon: Box,
    title: "Edit & Export",
    description:
      "Preview, customize materials, and export your 3D model in any supported format.",
  },
];

const HowItWorks = () => {
  return (
   <section className="pt-15 pb-28 px-6">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_60%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            How It{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Convert 2D images into professional 3D models in just 3 simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-12 relative">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -18, scale: 1.05 }}
              
                className="relative group backdrop-blur-xl bg-white/5 border border-white/10 
                           rounded-2xl p-8 text-center transition-all duration-300 
                           hover:border-purple-400/40 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                {/* Step Number */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 
                                w-12 h-12 rounded-full flex items-center justify-center 
                                bg-gradient-to-br from-cyan-500 via-purple-500 to-blue-500 
                                text-white font-bold text-lg shadow-lg shadow-purple-500/30">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="mt-8 mb-6 flex justify-center">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center 
                                  bg-gradient-to-br from-cyan-500 via-purple-500 to-blue-500 
                                  shadow-lg shadow-purple-500/30">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3 text-white">
                  {step.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>

                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r 
                                from-cyan-500/10 via-purple-500/10 to-blue-500/10 
                                opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
