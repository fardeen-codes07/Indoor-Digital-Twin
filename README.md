# ROOMSCAPE – Indoor Digital Twin

An interactive 3D reconstruction platform that transforms real-world indoor spaces into explorable digital environments.

##  Live Demo
[ROOMSCAPE Web Viewer](https://indoor-digital-twin.vercel.app)

## Features
- 3D indoor point-cloud visualization.
- Interactive rotation, zoom and pan.
- First-person Free Roam navigation.
- Keyboard and mouse controls.
- Fullscreen 3D viewing.

##  Tech Stack
- **Reconstruction:** COLMAP
- **3D Processing:** Blender
- **Frontend:** React, Vite
- **3D Rendering:** Three.js
- **Model Format:** PLY
- **Deployment:** Vercel

##  Workflow
1. Capture indoor photographs using a smartphone.
2. Generate a 3D point-cloud reconstruction.
3. Inspect and process the model in Blender.
4. Export the model in PLY format.
5. Integrate it into the React application using Three.js.
6. Deploy the interactive viewer using Vercel.

##  Reconstruction Output
**Model:** `web-viewer/public/models/bedroom.ply`

Approximately 732,435 points, as reported by the web viewer.

##  Run Locally

```bash
git clone https://github.com/fardeen-codes07/Indoor-Digital-Twin.git
cd Indoor-Digital-Twin/web-viewer
npm install
npm run dev
```

Open `http://localhost:5173`.

##  Demo
[Watch Project Demonstration](https://drive.google.com/file/d/15q1K6a1mB7_mzGhzObgm7IiCZ9JzcecZ/view?usp=sharing)

##  Limitations
The current point-cloud reconstruction contains some incomplete surfaces and reconstruction noise. Free Roam does not currently include collision detection.

##  Potential Applications
Indoor visualization, virtual property exploration and architectural documentation.
