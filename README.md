# 🖼️ Picture Editor (React + TypeScript + MobX)

A simple web-based picture editing app built with React, TypeScript, and MobX. Users can draw shapes, use a pen tool, fill backgrounds, upload and manipulate images — all on a canvas with layer management and undo support!

---

## 🚀 Features

### 🎨 Drawing Tools

- **Shape Tool** – Add customizable circles, rectangles, and triangles anywhere on the canvas
- **Fill Tool** – Fill the entire canvas background with a selected color
- **Pen Tool** – Freeform drawing with adjustable pen size and color

### 🖼️ Image Handling

- **Upload Image** – Upload and place an image onto the canvas
- **Drag to Move** – Click and drag to reposition image layers
- **Resize** – Use the resize handle to scale images
- **Auto-Centering** – Images are centered on upload

### 🧱 Layer System

- Every action creates a new layer (shape, fill, image, pen stroke)
- Toggle visibility of layers
- Delete individual layers
- Select a layer to move or edit it

### 🕹️ Undo

- Revert to previous canvas states using the **Undo** button or `Ctrl + Z`

### 💾 Export

- Save your artwork as a **PNG image** with one click

---

## 🧰 Tech Stack

- **React**
- **TypeScript**
- **MobX** for state management
- **Tailwind CSS** + optional raw CSS
- HTML5 `<canvas>` for drawing

---

### 🎮 Controls

| **Action**              | **How to Use**                      |
| ----------------------- | ----------------------------------- |
| Select a tool           | Click the toolbar buttons           |
| Draw shape / fill       | Click anywhere on the canvas        |
| Use pen tool            | Click and drag to draw              |
| Upload image            | Use the image tool → choose file    |
| Move image              | Click and drag the image            |
| Resize image            | Drag the handle at the bottom-right |
| Toggle layer visibility | Click 👁️ icon in the Layers panel   |
| Delete a layer          | Click 🗑️ on a layer                 |
| Undo                    | Click "Undo" or press `Ctrl+Z`      |
| Save as image           | Click "Save Image" button           |

### 🧪 Setup

```bash
npm install
npm run start
```
