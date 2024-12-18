import express from 'express';
import qr from 'qr-image';
import fs from 'fs';
import path from 'path';

// Resolve the __dirname equivalent in ES modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json()); // Middleware to parse JSON data

// Endpoint to generate QR code and save URL
app.post('/generate', (req, res) => {
    const url = req.body.url;

    if (!url) {
        return res.status(400).send({ message: 'URL is required' });
    }

    // Generate the QR code as a PNG
    const qrImagePath = path.join(__dirname, 'qr_img.png');
    const qr_svg = qr.image(url, { type: 'png' });

    // Save the QR code image
    qr_svg.pipe(fs.createWriteStream(qrImagePath));

    // Save the URL to a text file
    const urlFilePath = path.join(__dirname, 'url.txt');
    fs.writeFile(urlFilePath, url, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error saving URL' });
        }

        // Respond with success and file paths
        res.send({
            message: 'QR code and URL saved successfully!',
            qrPath: 'qr_img.png',
            urlPath: 'url.txt',
        });
    });
});

// Serve static files (for accessing the generated QR code image)
app.use(express.static(__dirname));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
