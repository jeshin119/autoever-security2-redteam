const fs = require('fs');
const path = require('path');
const axios = require('axios'); // Import axios

const uploadsDir = path.join(__dirname, 'backend', 'uploads');

// Ensure directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Sample image URLs from Lorem Picsum
const imagesToDownload = [
  { name: 'phone1.jpg', url: 'https://picsum.photos/id/237/300/200' }, // Dog
  { name: 'phone2.jpg', url: 'https://picsum.photos/id/238/300/200' }, // City
  { name: 'table1.jpg', url: 'https://picsum.photos/id/239/300/200' }, // Desk
  { name: 'tablet1.jpg', url: 'https://picsum.photos/id/240/300/200' }, // Nature
  { name: 'tablet2.jpg', url: 'https://picsum.photos/id/241/300/200' }, // Abstract
  { name: 'shoes1.jpg', url: 'https://picsum.photos/id/242/300/200' }, // Shoes
  { name: 'vacuum1.jpg', url: 'https://picsum.photos/id/243/300/200' }, // Object
  { name: 'bag1.jpg', url: 'https://picsum.photos/id/244/300/200' }, // Bag
  { name: 'bag2.jpg', url: 'https://picsum.photos/id/245/300/200' }, // Another Bag
  { name: 'macbook1.jpg', url: 'https://picsum.photos/id/246/300/200' } // Laptop
];

async function createSampleImages() {
  console.log('Downloading and creating sample images...');

  for (const image of imagesToDownload) {
    const filePath = path.join(uploadsDir, image.name);
    try {
      const response = await axios.get(image.url, { responseType: 'arraybuffer' });
      fs.writeFileSync(filePath, response.data); // Use writeFileSync for simplicity in script
      console.log(`Created: ${image.name}`);
    } catch (error) {
      console.error(`Failed to download ${image.name} from ${image.url}:`, error.message);
    }
  }

  console.log('Sample images created successfully!');
  console.log('Note: These are actual image files downloaded from Lorem Picsum.');
}

// Run the function
createSampleImages();