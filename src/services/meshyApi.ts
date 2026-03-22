const API_KEY = "YOUR_MESHY_API_KEY";

const BASE_URL = "https://api.meshy.ai/v2";

/* ---------- START TEXT → 3D GENERATION ---------- */

export const generate3DFromText = async (prompt: string) => {
  const response = await fetch(`${BASE_URL}/text-to-3d`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      art_style: "realistic",
      should_remesh: true,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to start Meshy generation");
  }

  const data = await response.json();

  // Meshy returns a task id
  return data.result.id;
};

/* ---------- CHECK TASK STATUS ---------- */

export const getTaskStatus = async (taskId: string) => {
  const response = await fetch(`${BASE_URL}/text-to-3d/${taskId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch task status");
  }

  const data = await response.json();

  return data.result;
};

/* ---------- WAIT UNTIL MODEL IS READY ---------- */

export const waitForModel = async (taskId: string) => {
  let status = "PENDING";

  while (status !== "SUCCEEDED" && status !== "FAILED") {
    const task = await getTaskStatus(taskId);

    status = task.status;

    console.log("Meshy status:", status);

    if (status === "SUCCEEDED") {
      return task.model_urls.glb;
    }

    if (status === "FAILED") {
      throw new Error("3D generation failed");
    }

    // wait 5 seconds before checking again
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
};                    