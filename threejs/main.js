import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Performance monitoring
let lastTime = performance.now();
let frames = 0;
let fps = 0;
let fpsHistory = [];
const MAX_FPS_HISTORY = 60; // Store last 60 frames (1 second at 60fps)
const fpsCounter = document.getElementById("fps-counter");
let firstRenderTime = null;

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Camera position
camera.position.z = 5;

// Load model
const loader = new GLTFLoader();
let model;
let loadStartTime = performance.now();

console.log("Loading model from:", "/model.glb");

loader.load(
  "/model.glb",
  (gltf) => {
    model = gltf.scene;
    // Center and scale the model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.0 / maxDim;
    model.scale.setScalar(scale);
    model.position.sub(center.multiplyScalar(scale));

    scene.add(model);
    const loadTime = performance.now() - loadStartTime;
    console.log(`Model loaded in ${loadTime.toFixed(2)}ms`);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.error("Error loading model:", error);
  }
);

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();

  // Update FPS counter
  frames++;
  const currentTime = performance.now();
  if (currentTime - lastTime >= 1000) {
    fps = Math.round((frames * 1000) / (currentTime - lastTime));
    fpsHistory.push(fps);
    if (fpsHistory.length > MAX_FPS_HISTORY) {
      fpsHistory.shift();
    }

    // Calculate average FPS
    const avgFps = Math.round(
      fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length
    );
    fpsCounter.textContent = `FPS: ${fps} (Avg: ${avgFps})`;
    frames = 0;
    lastTime = currentTime;
  }

  renderer.render(scene, camera);

  // Record first render time
  if (!firstRenderTime) {
    firstRenderTime = performance.now();
    console.log(
      `First render in ${(firstRenderTime - loadStartTime).toFixed(2)}ms`
    );
  }
}

animate();
