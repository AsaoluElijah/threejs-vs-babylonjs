# Three.js vs Babylon.js Performance Comparison

This project compares the performance of Three.js and Babylon.js by rendering the same .glb model in both engines and measuring:
- FPS over time
- Initial load time
- General responsiveness

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development servers:
```bash
# For Three.js
npm run start:three

# For Babylon.js
npm run build:babylon
```

## Features

- Both implementations use the same lighting setup
- FPS counter displayed in the top-right corner
- Load time measurement in the console
- Responsive design that adapts to window size
- Basic camera controls (orbit/pan/zoom)

## Performance Metrics

The following metrics are measured:
- FPS: Displayed in real-time in the top-right corner
- Load Time: Logged to the console when the model is loaded
- Responsiveness: Both implementations handle window resizing and maintain performance 