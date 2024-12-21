import fs from 'fs';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import path from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create dist-extension directory if it doesn't exist
const distExtensionDir = path.join(__dirname, '../dist-extension');
if (!fs.existsSync(distExtensionDir)) {
    fs.mkdirSync(distExtensionDir);
}

// Create a write stream for our zip file
const output = fs.createWriteStream(path.join(distExtensionDir, 'calendar-extension.zip'));
const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression
});

archive.pipe(output);

// Add the dist folder contents to the zip
archive.directory('dist/', false);

// Add manifest and icons directly to the root of the zip
archive.file('public/manifest.json', { name: 'manifest.json' });
archive.file('public/icon-16.png', { name: 'icon-16.png' });
archive.file('public/icon-32.png', { name: 'icon-32.png' });
archive.file('public/icon-48.png', { name: 'icon-48.png' });
archive.file('public/icon-128.png', { name: 'icon-128.png' });

archive.finalize(); 