import * as THREE from "https://unpkg.com/three@0.162.0/build/three.module.js";

const canvas = document.getElementById("scene");
const scrolly = document.getElementById("scrolly");
const copyEls = [...document.querySelectorAll(".copy")];
const progressFill = document.getElementById("progressFill");
const progressLabel = document.getElementById("progressLabel");

const stageLabels = copyEls.map((el) => el.querySelector("h2")?.textContent || "Stage");

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.06;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 50);
camera.position.set(0, 1.2, 10.5);
scene.add(camera);

scene.add(new THREE.AmbientLight(0xffffff, 1.1));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.28);
keyLight.position.set(4.6, 6.2, 4.8);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xd7deeb, 0.76);
fillLight.position.set(-5.4, 2.4, -2.2);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.56);
rimLight.position.set(0.6, 1.4, -5);
scene.add(rimLight);

function makeShadowTexture() {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d");
  if (!g) return null;
  const grad = g.createRadialGradient(size / 2, size / 2, 20, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(0,0,0,0.35)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

const shadowTexture = makeShadowTexture();
const shadowPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(8.4, 5.4),
  new THREE.MeshBasicMaterial({
    map: shadowTexture || null,
    transparent: true,
    opacity: 0.24,
    depthWrite: false,
  })
);
shadowPlane.rotation.x = -Math.PI / 2;
shadowPlane.position.set(0.15, -1.42, 0.35);
scene.add(shadowPlane);

const boardRig = new THREE.Group();
scene.add(boardRig);

const boardBase = new THREE.Mesh(
  new THREE.BoxGeometry(5.6, 0.14, 3.45),
  new THREE.MeshStandardMaterial({
    color: 0x20252c,
    roughness: 0.52,
    metalness: 0.26,
  })
);
boardRig.add(boardBase);

const boardSurface = new THREE.Mesh(
  new THREE.BoxGeometry(5.35, 0.05, 3.2),
  new THREE.MeshStandardMaterial({
    color: 0x2c3239,
    roughness: 0.64,
    metalness: 0.16,
  })
);
boardSurface.position.y = 0.092;
boardRig.add(boardSurface);

const components = new THREE.Group();
components.position.y = 0.115;
boardRig.add(components);

const componentBlocks = [
  [-1.4, -0.82, 1.05, 0.12, 0.72, 0x313a45],
  [-0.05, -0.55, 0.88, 0.14, 0.88, 0x2a323d],
  [1.12, -0.5, 0.64, 0.23, 0.65, 0x646d78],
  [-1.1, 0.74, 0.86, 0.08, 0.5, 0x3b4450],
  [0.28, 0.86, 1.22, 0.06, 0.24, 0x4f5a67],
  [1.88, 0.74, 0.62, 0.18, 0.42, 0xadb6c2],
  [2.08, -0.04, 0.52, 0.16, 0.68, 0xced5de],
  [-2.08, -0.3, 0.42, 0.12, 0.95, 0xb3bdc9],
];

for (const block of componentBlocks) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(block[2], block[3], block[4]),
    new THREE.MeshStandardMaterial({
      color: block[5],
      roughness: 0.56,
      metalness: block[5] > 0x909090 ? 0.72 : 0.24,
    })
  );
  mesh.position.set(block[0], block[3] / 2, block[1]);
  components.add(mesh);
}

const pins = new THREE.Group();
const pinMat = new THREE.MeshStandardMaterial({ color: 0xc8b37b, roughness: 0.26, metalness: 0.85 });
for (let i = 0; i < 24; i += 1) {
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.48, 7), pinMat);
  pin.rotation.x = Math.PI / 2;
  pin.position.set(-2.45 + i * 0.21, 0.2, 1.64);
  pins.add(pin);
}
boardRig.add(pins);

const textureLoader = new THREE.TextureLoader();
let boardTexturePlane;
let moduleStrip;

textureLoader.load("assets/board-top-clean.png", (texture) => {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  boardTexturePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(5.3, 3.38),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.02,
      depthWrite: false,
    })
  );
  boardTexturePlane.rotation.x = -Math.PI / 2;
  boardTexturePlane.position.y = 0.121;
  boardRig.add(boardTexturePlane);
});

textureLoader.load("assets/modules-clean.png", (texture) => {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  moduleStrip = new THREE.Mesh(
    new THREE.PlaneGeometry(4.7, 1.14),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
  );
  moduleStrip.position.set(2.5, 0.64, 1.36);
  moduleStrip.rotation.set(-1.1, -0.37, 0.1);
  boardRig.add(moduleStrip);
});

const makeHighlight = (w, h, x, z) => {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({
      color: 0x0f1724,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
  );
  mesh.position.set(x, 0.125, z);
  mesh.rotation.x = -Math.PI / 2;
  boardRig.add(mesh);
  return mesh;
};

const hiStorage = makeHighlight(1.0, 0.62, -1.0, 0.18);
const hiAi = makeHighlight(0.96, 0.72, 0.02, 0.21);
const hiVideo = makeHighlight(1.24, 0.26, -0.3, 1.03);

const pointer = { x: 0, y: 0 };
window.addEventListener(
  "pointermove",
  (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  },
  { passive: true }
);

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const seg = (value, start, end) => clamp((value - start) / (end - start), 0, 1);

let targetProgress = 0;
let smoothProgress = 0;
let activeStage = -1;

function getProgress() {
  const total = scrolly.offsetHeight - window.innerHeight;
  if (total <= 0) return 0;
  return clamp((window.scrollY - scrolly.offsetTop) / total, 0, 1);
}

function setStage(progress) {
  const idx = Math.min(copyEls.length - 1, Math.floor(progress * copyEls.length));
  if (idx === activeStage) return;
  activeStage = idx;
  copyEls.forEach((el, i) => el.classList.toggle("active", i === idx));
  progressLabel.textContent = stageLabels[idx] || "Stage";
}

function updateUi(progress) {
  progressFill.style.width = `${Math.max(8, progress * 100)}%`;
  setStage(progress);
}

function onScroll() {
  targetProgress = getProgress();
  updateUi(targetProgress);
}

window.addEventListener("scroll", onScroll, { passive: true });

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  onScroll();
});

onScroll();

const at = Number(new URLSearchParams(window.location.search).get("at"));
if (Number.isFinite(at) && at >= 0 && at <= 1) {
  requestAnimationFrame(() => {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, scrollMax * at);
  });
}

const clock = new THREE.Clock();

function animate() {
  const dt = clock.getDelta();
  const time = clock.elapsedTime;
  smoothProgress = THREE.MathUtils.damp(smoothProgress, targetProgress, 6, dt);

  const intro = seg(smoothProgress, 0.0, 0.16);
  const pushIn = seg(smoothProgress, 0.16, 0.34);
  const expand = seg(smoothProgress, 0.34, 0.54);
  const descend = seg(smoothProgress, 0.54, 0.82);
  const settle = seg(smoothProgress, 0.82, 1.0);

  boardRig.position.x = -1.55 + intro * 1.05 + descend * 0.45;
  boardRig.position.y = 1.45 - intro * 1.3 - descend * 1.42 - settle * 0.16;
  boardRig.position.z = 0.1 + pushIn * 0.12;

  boardRig.rotation.x = -0.96 + intro * 0.56 - descend * 0.2 - settle * 0.12 + pointer.y * 0.028;
  boardRig.rotation.y = -1.02 + intro * 0.63 + expand * 0.14 + pointer.x * 0.042;
  boardRig.rotation.z = Math.sin(time * 0.45) * 0.012;

  const drift = Math.sin(time * 1.1) * 0.028;
  boardRig.position.y += drift * (1 - descend * 0.8);

  if (moduleStrip) {
    const moduleIn = seg(smoothProgress, 0.28, 0.44);
    const moduleOut = seg(smoothProgress, 0.74, 0.92);
    moduleStrip.material.opacity = moduleIn * (1 - moduleOut) * 0.95;
    moduleStrip.position.x = 2.5 + moduleIn * 1.7;
    moduleStrip.position.y = 0.64 + moduleIn * 0.42 - descend * 0.66;
    moduleStrip.position.z = 1.36 + moduleIn * 0.3;
    moduleStrip.rotation.y = -0.37 + moduleIn * 0.2;
  }

  hiStorage.material.opacity = seg(smoothProgress, 0.14, 0.29) * 0.12;
  hiAi.material.opacity = seg(smoothProgress, 0.3, 0.52) * 0.18;
  hiVideo.material.opacity = seg(smoothProgress, 0.5, 0.72) * 0.16;

  camera.position.z = 10.5 - pushIn * 1.3 - expand * 0.8 - settle * 1.05;
  camera.position.y = 1.2 - descend * 0.74;
  camera.position.x = pointer.x * 0.1;
  camera.lookAt(0.24 + expand * 0.24, -0.08 - descend * 0.5, 0);

  shadowPlane.material.opacity = 0.2 + descend * 0.08;
  shadowPlane.scale.set(1 + descend * 0.15, 1 + descend * 0.15, 1);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
