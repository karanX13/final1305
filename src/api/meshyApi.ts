export const generate3DModel = async (imageUrl: string) => {
  console.log("Sending image to AI:", imageUrl);

  // fake delay for now
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return {
    status: "completed",
    modelUrl: "/models/sample.glb", 
  };
};