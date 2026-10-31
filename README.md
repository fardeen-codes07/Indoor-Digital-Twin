# ROOMSCAPE – Indoor Digital Twin & 3D Reconstruction

An interactive indoor digital twin platform that transforms real-world spaces into explorable 3D environments using photogrammetry and web-based visualization.

<p align="center">
  <b>Explore physical spaces. Reconstruct them digitally. Experience them interactively.</b>
</p>

---

##  Live Demo

**[Launch ROOMSCAPE – Live Web Viewer](https://indoor-digital-twin.vercel.app)**

**[GitHub Repository](https://github.com/fardeen-codes07/Indoor-Digital-Twin)**

---

##  Project Overview

ROOMSCAPE is an Indoor Digital Twin proof of concept developed to convert a real-world indoor environment into an interactive three-dimensional digital representation.

For this project, a bedroom was selected as the test environment. Photographs and video were captured using a smartphone, processed through a photogrammetry-based reconstruction workflow, and converted into a 3D point cloud.

The reconstructed model was inspected and processed using Blender before being integrated into a browser-based application developed with React and Three.js.

The platform allows users to view, navigate and explore the reconstructed indoor environment directly through a web browser.

##  Key Features

- **3D Point Cloud Visualization:** Displays the reconstructed indoor environment using a PLY model.
- **Interactive Orbit Controls:** Rotate the model to explore different perspectives.
- **Zoom and Pan:** Inspect different areas of the reconstructed room.
- **First-Person Free Roam:** Navigate through the 3D environment using keyboard and mouse controls.
- **Fullscreen Viewing:** Explore the reconstruction in fullscreen mode.
- **Browser-Based Access:** View the reconstruction without installing dedicated 3D modelling software.

##  Technology Stack

| Technology | Purpose |
|---|---|
| COLMAP | Photogrammetry and 3D reconstruction |
| Blender | 3D model inspection and processing |
| PLY | Point-cloud model format |
| React | Web application interface |
| Three.js | 3D rendering and interaction |
| Vite | Development server and production build |
| GitHub | Version control and source code hosting |
| Vercel | Web application deployment |

##  Project Workflow

The project follows a pipeline that converts a physical indoor environment into an interactive digital representation.

1. **Environment Capture:** Capture photographs and video of an indoor space using a smartphone from multiple viewpoints.
2. **Image Processing:** Organize and prepare the captured photographs for reconstruction.
3. **3D Reconstruction:** Process the visual data through a photogrammetry workflow to generate a 3D point cloud.
4. **Model Processing:** Import the reconstructed model into Blender for inspection and processing.
5. **PLY Export:** Export the reconstructed bedroom as a PLY file.
6. **Web Integration:** Load the PLY model into the React application using Three.js.
7. **Interactive Visualization:** Implement orbit navigation, zoom, pan and first-person movement.
8. **Deployment:** Host the web application using Vercel and maintain the source code on GitHub.

##  Reconstruction Output

The final reconstructed bedroom is exported in PLY format and integrated into the web application.

**Model location:**
`web-viewer/public/models/bedroom.ply`

**Reported point count:** Approximately 732,435 points in the web viewer.

The reconstruction captures the overall spatial structure of the bedroom, including recognizable furniture and surrounding elements.

##  Navigation Controls

| Action | Control |
|---|---|
| Rotate model | Left Mouse Button + Drag |
| Zoom | Mouse Scroll |
| Pan | Right / Middle Mouse Button + Drag |
| Enter Free Roam | Click Enter Free Roam |
| Move forward / backward | W / S |
| Move left / right | A / D |
| Move vertically | Q / E |
| Look around | Mouse |
| Exit Free Roam | ESC |

##  Run Locally

Follow these steps to run ROOMSCAPE on your local machine.

### Pr
