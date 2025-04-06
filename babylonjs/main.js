import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

// Performance monitoring
let fpsHistory = [];
const MAX_FPS_HISTORY = 60; // Store last 60 frames (1 second at 60fps)
let firstRenderTime = null;
let loadStartTime = performance.now();

// Get the canvas element
const canvas = document.getElementById("renderCanvas");

// Initialize the Babylon.js engine
const engine = new BABYLON.Engine(canvas, true);

// Create the scene
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

// Create and position the camera
const camera = new BABYLON.ArcRotateCamera(
  "camera",
  -Math.PI / 2,
  Math.PI / 2.5,
  5,
  BABYLON.Vector3.Zero(),
  scene
);
camera.attachControl(canvas, true);

// Create lights
const ambientLight = new BABYLON.HemisphericLight(
  "ambientLight",
  new BABYLON.Vector3(0, 1, 0),
  scene
);
ambientLight.intensity = 0.5;

const directionalLight = new BABYLON.DirectionalLight(
  "directionalLight",
  new BABYLON.Vector3(1, -1, -1),
  scene
);
directionalLight.intensity = 0.5;

// Performance monitoring
const fpsCounter = document.getElementById("fps-counter");

// Load the model
console.log("Loading model from:", "/model.glb");

BABYLON.SceneLoader.ImportMesh(
  "",
  "/",
  "model.glb",
  scene,
  (meshes) => {
    // Get the root mesh
    const rootMesh = meshes[0];

    // Create a bounding box for the entire model
    const boundingInfo = rootMesh.getHierarchyBoundingVectors();
    const min = boundingInfo.min;
    const max = boundingInfo.max;
    const size = max.subtract(min);
    const center = min.add(size.scale(0.5));

    // Calculate scale to fit the model
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.0 / maxDim;

    // Apply transformations to all meshes
    meshes.forEach((mesh) => {
      if (mesh instanceof BABYLON.Mesh) {
        mesh.scaling.scaleInPlace(scale);
        mesh.position.subtractInPlace(center.scale(scale));
      }
    });

    const loadTime = performance.now() - loadStartTime;
    console.log(`Model loaded in ${loadTime.toFixed(2)}ms`);
  },
  (progress) => {
    console.log(
      "Loading progress:",
      ((progress.loaded / progress.total) * 100).toFixed(2) + "%"
    );
  },
  (scene, message, exception) => {
    console.error("Error loading model:", message);
    console.error("Exception:", exception);
  }
);

// Handle window resize
window.addEventListener("resize", () => {
  engine.resize();
});

// Run the render loop
engine.runRenderLoop(() => {
  scene.render();

  // Update FPS counter
  const currentFps = engine.getFps();
  fpsHistory.push(currentFps);
  if (fpsHistory.length > MAX_FPS_HISTORY) {
    fpsHistory.shift();
  }

  // Calculate average FPS
  const avgFps = Math.round(
    fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length
  );
  fpsCounter.textContent = `FPS: ${currentFps.toFixed(0)} (Avg: ${avgFps})`;

  // Record first render time
  if (!firstRenderTime) {
    firstRenderTime = performance.now();
    console.log(
      `First render in ${(firstRenderTime - loadStartTime).toFixed(2)}ms`
    );
  }
});
