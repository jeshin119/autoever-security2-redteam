const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Create uploads directory if it doesn't exist
const UPLOAD_DIR = path.join(__dirname, '../uploads/'); // Match server.js static serving path
console.log('Upload directory path:', UPLOAD_DIR);
if (!fs.existsSync(UPLOAD_DIR)) {
  console.log('Creating upload directory...');
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
} else {
  console.log('Upload directory exists');
}

// File validation function
function isValidFile(file) {
  const allowedExtensions = ['jpeg', 'jpg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt'];
  
  // Check if any allowed extension exists anywhere in the filename
  const filename = file.name.toLowerCase();
  const hasAllowedExtension = allowedExtensions.some(ext => filename.includes('.' + ext));
  
  return hasAllowedExtension && file.size <= 10 * 1024 * 1024; // 10MB limit
}

// Function to generate unique filename with numbered suffix
function generateUniqueFilename(originalName, uploadDir) {
  const nameWithoutExt = path.parse(originalName).name;
  const extension = path.parse(originalName).ext;
  
  let counter = 0;
  let filename = originalName;
  
  // Check if file exists and generate numbered suffix if needed
  while (fs.existsSync(path.join(uploadDir, filename))) {
    counter++;
    filename = `${nameWithoutExt} (${counter})${extension}`;
  }
  
  return filename;
}

// Single image upload endpoint
router.post('/image', async (req, res) => {
  try {
    console.log('Upload endpoint called');
    console.log('Files info:', req.files);
    
    if (!req.files || !req.files.image) {
      console.log('No file in request');
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    const uploadedFile = req.files.image;
    
    // Validate file
    if (!isValidFile(uploadedFile)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type or size too large'
      });
    }

    // Generate unique filename to handle duplicates
    const filename = generateUniqueFilename(uploadedFile.name, UPLOAD_DIR);
    const filePath = path.join(UPLOAD_DIR, filename);
    
    // Move file using express-fileupload
    console.log('Moving file to:', filePath);
    await uploadedFile.mv(filePath);
    console.log('File moved successfully');

    const fileUrl = `/uploads/${filename}`;
    console.log('File uploaded successfully:', fileUrl);
    
    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: fileUrl,
        path: fileUrl,
        filename: filename,
        originalName: uploadedFile.name,
        size: uploadedFile.size,
        mimetype: uploadedFile.mimetype
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
});

// Multiple images upload endpoint
router.post('/images', async (req, res) => {
  try {
    if (!req.files || !req.files.images) {
      return res.status(400).json({ 
        success: false, 
        message: 'No files uploaded' 
      });
    }

    const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
    const uploadedFiles = [];
    
    for (const file of files) {
      // Validate each file
      if (!isValidFile(file)) {
        return res.status(400).json({
          success: false,
          message: `Invalid file: ${file.name}`
        });
      }
      
      // Generate unique filename to handle duplicates
      const filename = generateUniqueFilename(file.name, UPLOAD_DIR);
      const filePath = path.join(UPLOAD_DIR, filename);
      
      // Move file
      await file.mv(filePath);
      
      uploadedFiles.push({
        url: `/uploads/${filename}`,
        path: `/uploads/${filename}`,
        filename: filename,
        originalName: file.name,
        size: file.size,
        mimetype: file.mimetype
      });
    }
    
    res.json({
      success: true,
      message: 'Files uploaded successfully',
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Files upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Files upload failed',
      error: error.message
    });
  }
});

// Delete file endpoint
router.delete('/file', async (req, res) => {
  try {
    const { filename } = req.body;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required'
      });
    }

    // Extract filename from path if full path is provided
    const actualFilename = path.basename(filename);
    const filePath = path.join(UPLOAD_DIR, actualFilename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete the file
    fs.unlinkSync(filePath);
    console.log(`File deleted successfully: ${filePath}`);
    
    res.json({
      success: true,
      message: 'File deleted successfully',
      data: {
        filename: actualFilename,
        path: filePath
      }
    });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'File deletion failed',
      error: error.message
    });
  }
});

module.exports = router;