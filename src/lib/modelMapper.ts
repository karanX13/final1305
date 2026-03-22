export const getModelFromPrompt = (prompt: string): string => {
  const clean = prompt.toLowerCase().trim();

  console.log("MAPPER INPUT:", clean);

  if (clean.includes("dragon")) return "/models/dragon.glb";
  if (clean.includes("gun")) return "/models/gun.glb";
  if (clean.includes("tree")) return "/models/tree.glb";
 if (
  clean.includes("ironman") ||
  clean.includes("iron man") ||
  clean.includes("arc reactor") ||
  clean.includes("arc-reactor")
) {
  return "/models/arc-reactor.glb";
}
  // default
  return "/models/human.glb";
};