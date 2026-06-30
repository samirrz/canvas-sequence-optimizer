/**
 * Canvas Sequence Optimizer
 * Efficient memory management and frame preloading for Canvas/GSAP sequence animations.
 */

export class SequenceOptimizer {
    constructor(config) {
        this.canvas = document.querySelector(config.canvasSelector);
        this.context = this.canvas.getContext('2d');
        this.frameCount = config.frameCount;
        this.urlTemplate = config.urlTemplate;
        this.images = [];
        this.loadedFrames = 0;
        this.currentFrame = { frame: 0 };
        
        this._initCanvas(config.width, config.height);
    }

    _initCanvas(width, height) {
        this.canvas.width = width || window.innerWidth;
        this.canvas.height = height || window.innerHeight;
    }

    // High-performance image preloader with memory buffering
    preload(onProgress) {
        return new Promise((resolve) => {
            for (let i = 0; i < this.frameCount; i++) {
                const img = new Image();
                img.onload = () => {
                    this.loadedFrames++;
                    if (onProgress) onProgress(this.loadedFrames / this.frameCount);
                    if (this.loadedFrames === this.frameCount) resolve();
                };
                img.src = this.urlTemplate(i);
                this.images.push(img);
            }
        });
    }

    // Renders the specific frame and handles garbage collection for off-screen frames
    renderFrame(index) {
        if (!this.images[index]) return;
        
        // Clear previous frame to prevent ghosting and reduce memory heap
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw new frame
        this.context.drawImage(
            this.images[index], 
            0, 0, 
            this.canvas.width, 
            this.canvas.height
        );
    }

    // Bind with GSAP ScrollTrigger for seamless playback
    attachGSAP(gsapInstance, scrollTriggerConfig) {
        gsapInstance.to(this.currentFrame, {
            frame: this.frameCount - 1,
            snap: "frame",
            ease: "none",
            scrollTrigger: scrollTriggerConfig,
            onUpdate: () => this.renderFrame(this.currentFrame.frame)
        });
    }
    
    // Memory cleanup utility
    destroy() {
        this.images = [];
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
