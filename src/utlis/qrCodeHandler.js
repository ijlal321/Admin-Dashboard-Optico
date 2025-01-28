const QRCode = require('qrcode');
const { createCanvas } = require('canvas');

async function generateQRCode(input) {
    try {
        // Sizes for the QR code and text
        const qrSize = 200;
        const textHeight = 30;


        const canvasWidth = qrSize;
        const canvasHeight = qrSize + textHeight;

        // Create canvas with the green background
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        // Fill the background with green
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Generate the QR code on a smaller canvas
        const qrCanvas = createCanvas(qrSize, qrSize);
        await QRCode.toCanvas(qrCanvas, input.toString(), { width: qrSize, margin: 1 });

        // Draw the QR code onto the main canvas, centered
        ctx.drawImage(qrCanvas, 0, 0);

        // Write input ID below the QR code
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black'; // Ensure text is visible
        ctx.fillText(input, canvasWidth / 2, qrSize + 20);

        return canvas.toDataURL();
    } catch (e) {
        console.error(e);
    }
}

module.exports = generateQRCode;
