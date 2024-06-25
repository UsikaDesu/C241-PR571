class Webcam {
    constructor(videoElement) {
        this.videoElement = videoElement;
    }

    async setup() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                this.videoElement.srcObject = stream;
                await new Promise((resolve) => {
                    this.videoElement.onloadedmetadata = () => {
                        resolve();
                    };
                });
                this.videoElement.play();
            } catch (error) {
                console.error('Error accessing the webcam:', error);
            }
        } else {
            console.error('getUserMedia is not supported by this browser');
        }
    }

    capture() {
        const canvas = document.createElement('canvas');
        canvas.width = this.videoElement.videoWidth;
        canvas.height = this.videoElement.videoHeight;
        const context = canvas.getContext('2d');

        // Zoom factor
        const zoomFactor = 1.5;
        
        // Calculate the cropped area dimensions
        const cropWidth = canvas.width / zoomFactor;
        const cropHeight = canvas.height / zoomFactor;
        
        // Calculate the top-left corner of the cropped area
        const cropX = (canvas.width - cropWidth) / 2;
        const cropY = (canvas.height - cropHeight) / 2;

        // Draw the cropped area to the canvas
        context.drawImage(
            this.videoElement,
            cropX, cropY, cropWidth, cropHeight,
            0, 0, canvas.width, canvas.height 
        );

        // Resize image to match model input size (48x48)
        const resizedImage = tf.image.resizeBilinear(tf.browser.fromPixels(canvas), [48, 48]);
        // Normalize pixel values to range [0, 1]
        const normalizedImage = resizedImage.div(255.0);

        return normalizedImage.expandDims(0); // Add batch dimension
    }

    stop() {
        const stream = this.videoElement.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach((track) => {
            track.stop();
        });

        this.videoElement.srcObject = null;
    }
}
