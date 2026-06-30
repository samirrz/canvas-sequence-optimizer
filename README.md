# 🚀 Canvas Sequence Optimizer

A lightweight, zero-dependency memory manager and preloader for high-performance canvas image sequence animations. 

## 🛑 The Problem
Building Apple-style scroll-reveal websites using high-resolution image sequences (often 200+ frames) typically leads to severe memory leaks and frame drops. Browsers struggle with garbage collection when rapidly swapping images in HTML5 Canvas, especially when synced with scroll events via GSAP or standard scroll listeners.

## 💡 The Solution
`canvas-sequence-optimizer` acts as a silent infrastructure utility. It intercepts the frame loading process, buffers the memory, and strictly manages the Canvas rendering context to prevent ghosting and memory heap expansion. 

### ✨ Features
- **Smart Preloading:** Asynchronous frame loading with precise progress tracking.
- **Memory Management:** Auto-clears the canvas context (`clearRect`) efficiently before rendering new frames to prevent DOM bloating.
- **GSAP ScrollTrigger Ready:** Built-in binding utility for seamless integration with GreenSock.
- **Vite Optimized:** Tree-shakable and works out-of-the-box with modern bundlers.

### 📦 Quick Start

```javascript
import { SequenceOptimizer } from 'canvas-sequence-optimizer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const seq = new SequenceOptimizer({
    canvasSelector: '#hero-canvas',
    frameCount: 150,
    urlTemplate: (index) => `./assets/frames/frame_${index.toString().padStart(4, '0')}.webp`
});

// Preload and attach to scroll
seq.preload((progress) => console.log(`Loading: ${progress * 100}%`))
   .then(() => {
       seq.attachGSAP(gsap, {
           trigger: ".hero-section",
           start: "top top",
           end: "+=2000",
           pin: true
       });
   });
```

## 🛠️ Architecture
The utility strictly separates the downloading thread from the rendering thread, ensuring that `ScrollTrigger` updates only paint pre-computed memory buffers rather than triggering network requests or decoding raw images on the fly.
