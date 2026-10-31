
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PLYLoader } from "three/addons/loaders/PLYLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import "./App.css";

function App() {
  const mountRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [roaming, setRoaming] = useState(false);
  const [points, setPoints] = useState(0);

  const controlsRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#10131c");

    // Camera
    const camera = new THREE.PerspectiveCamera(
      65,
      container.clientWidth / container.clientHeight,
      0.001,
      10000
    );

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Blender-style orbit controls
    const orbit = new OrbitControls(camera, renderer.domElement);

    orbit.enableDamping = true;
    orbit.dampingFactor = 0.07;
    orbit.screenSpacePanning = true;
    orbit.minDistance = 0.01;
    orbit.maxDistance = 10000;

    orbit.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.PAN,
    };

    // First-person controls
    const pointerControls = new PointerLockControls(
      camera,
      renderer.domElement
    );

    controlsRef.current = pointerControls;

    const keys = new Set();

    let pointCloud = null;
    let animationId;
    let previousTime = performance.now();
    let moveSpeed = 1;

    // Keyboard controls
    const movementKeys = [
      "KeyW",
      "KeyA",
      "KeyS",
      "KeyD",
      "KeyQ",
      "KeyE",
    ];

    const onKeyDown = (event) => {
      if (!pointerControls.isLocked) return;

      if (movementKeys.includes(event.code)) {
        event.preventDefault();
        keys.add(event.code);
      }
    };

    const onKeyUp = (event) => {
      keys.delete(event.code);
    };

    // Enter / exit roaming mode
    const onLock = () => {
      orbit.enabled = false;
      setRoaming(true);
    };

    const onUnlock = () => {
      orbit.enabled = true;
      setRoaming(false);
      keys.clear();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    pointerControls.addEventListener("lock", onLock);
    pointerControls.addEventListener("unlock", onUnlock);

    // Load actual COLMAP point cloud
    const loader = new PLYLoader();

    loader.load(
      "/models/bedroom.ply",

      (geometry) => {
        if (!geometry.attributes.position) {
          setError("The PLY file does not contain point positions.");
          setLoading(false);
          return;
        }

        geometry.computeBoundingBox();

        const center = new THREE.Vector3();
        geometry.boundingBox.getCenter(center);

        // Center the actual reconstruction
        geometry.translate(-center.x, -center.y, -center.z);

        geometry.computeBoundingSphere();

        const radius = geometry.boundingSphere.radius || 5;
        const hasColors = geometry.hasAttribute("color");

        // Scale movement according to model size
        moveSpeed = Math.max(radius * 0.3, 0.1);

        const material = new THREE.PointsMaterial({
          size: Math.max(radius * 0.003, 0.003),
          vertexColors: hasColors,
          color: hasColors ? 0xffffff : 0x8bbcff,
          sizeAttenuation: true,
        });

        pointCloud = new THREE.Points(geometry, material);

pointCloud.rotation.set(90, 0, 0);

scene.add(pointCloud);

        // Automatically frame the complete model
        const fovRadians = THREE.MathUtils.degToRad(camera.fov);
        const distance = (radius / Math.sin(fovRadians / 2)) * 1.15;

        camera.position.set(
          distance * 0.75,
          distance * 0.5,
          distance * 0.9
        );

        camera.lookAt(0, 0, 0);

        orbit.target.set(0, 0, 0);
        orbit.update();

        setPoints(geometry.attributes.position.count);
        setProgress(100);
        setLoading(false);
      },

      (event) => {
        if (event.total > 0) {
          setProgress(
            Math.round((event.loaded / event.total) * 100)
          );
        }
      },

      (err) => {
        console.error("PLY loading failed:", err);
        setError(
          "Could not load bedroom.ply. Check the public/models folder."
        );
        setLoading(false);
      }
    );

    // Window resize
    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener("resize", resize);

    // Animation loop
    const animate = (time) => {
      animationId = requestAnimationFrame(animate);

      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      if (pointerControls.isLocked) {
        const speed = moveSpeed * delta;

        // Normalize diagonal movement
        let forward = 0;
        let sideways = 0;

        if (keys.has("KeyW")) forward += 1;
        if (keys.has("KeyS")) forward -= 1;
        if (keys.has("KeyD")) sideways += 1;
        if (keys.has("KeyA")) sideways -= 1;

        const magnitude = Math.hypot(forward, sideways) || 1;

        if (forward !== 0) {
          pointerControls.moveForward(
            (forward / magnitude) * speed
          );
        }

        if (sideways !== 0) {
          pointerControls.moveRight(
            (sideways / magnitude) * speed
          );
        }

        if (keys.has("KeyQ")) {
          camera.position.y -= speed;
        }

        if (keys.has("KeyE")) {
          camera.position.y += speed;
        }
      } else {
        orbit.update();
      }

      renderer.render(scene, camera);
    };

    animate(performance.now());

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);

      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);

      pointerControls.removeEventListener("lock", onLock);
      pointerControls.removeEventListener("unlock", onUnlock);

      pointerControls.dispose();
      orbit.dispose();

      if (pointCloud) {
        pointCloud.geometry.dispose();
        pointCloud.material.dispose();
      }

      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      controlsRef.current = null;
    };
  }, []);

  // Enter first-person mode
  const enterRoaming = () => {
    if (!loading && !error) {
      controlsRef.current?.lock();
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mountRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">⌂</div>

          <div>
            <h1>
              ROOM<span>SCAPE</span>
            </h1>
            <p>INDOOR DIGITAL TWIN</p>
          </div>
        </div>

        <div className="top-status">
          <span className="status-dot"></span>
          RECONSTRUCTION VIEWER
        </div>
      </header>

      <section className="workspace">
        <aside className="sidebar">
          <p className="section-label">PROJECT</p>

          <h2>Bedroom</h2>

          <p className="muted">
            Photogrammetry reconstruction
          </p>

          <div className="divider"></div>

          <p className="section-label">MODEL INFORMATION</p>

          <div className="info-card">
            <span>MODEL TYPE</span>
            <strong>3D Point Cloud</strong>
          </div>

          <div className="info-card">
            <span>3D POINTS</span>
            <strong>{points.toLocaleString()}</strong>
          </div>

          <div className="info-card">
            <span>FILE</span>
            <strong>bedroom.ply</strong>
          </div>

          <div className="divider"></div>

          <p className="section-label">VIEW CONTROLS</p>

          <div className="control-row">
            <span>Rotate</span>
            <kbd>Left Mouse</kbd>
          </div>

          <div className="control-row">
            <span>Zoom</span>
            <kbd>Scroll</kbd>
          </div>

          <div className="control-row">
            <span>Pan</span>
            <kbd>Right / Middle</kbd>
          </div>

          <div className="divider"></div>

          <p className="section-label">FREE ROAM CONTROLS</p>

          <div className="control-row">
            <span>Move</span>
            <kbd>W A S D</kbd>
          </div>

          <div className="control-row">
            <span>Vertical</span>
            <kbd>Q / E</kbd>
          </div>

          <div className="control-row">
            <span>Look around</span>
            <kbd>Mouse</kbd>
          </div>

          <button
            className={`roam-button ${roaming ? "active" : ""}`}
            onClick={enterRoaming}
            disabled={loading || !!error || roaming}
          >
            {roaming ? "ROAM MODE ACTIVE" : "ENTER FREE ROAM"}
          </button>

          {roaming && (
            <p className="roam-hint">
              WASD to move · Q/E vertically · Mouse to look ·
              ESC to exit
            </p>
          )}
        </aside>

        <section className="viewer-section">
          <div className="viewer-toolbar">
            <div>
              <span className="live-dot"></span>
              LIVE 3D VIEW
            </div>

            <button onClick={toggleFullscreen}>
              ⛶ Fullscreen
            </button>
          </div>

          <div className="viewer" ref={mountRef}>
            {loading && (
              <div className="loading-screen">
                <div className="loader"></div>

                <h3>Loading bedroom reconstruction</h3>

                <p>
                  Preparing your 3D point cloud... {progress}%
                </p>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {error && (
              <div className="loading-screen">
                <h3>Model loading failed</h3>
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && (
              <div className="viewer-tip">
                Drag to rotate · Scroll to zoom · Click Free Roam to explore
              </div>
            )}
          </div>

          <footer className="viewer-footer">
            <span>
              RECONSTRUCTED FROM REAL-WORLD PHOTOGRAPHS
            </span>

            <span>POWERED BY THREE.JS</span>
          </footer>
        </section>
      </section>
    </main>
  );
}

export default App;
