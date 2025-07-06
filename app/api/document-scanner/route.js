import { NextResponse } from 'next/server';
import sharp from 'sharp';
import Tesseract from 'tesseract.js';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configuration
const UPLOAD_DIR = path.join(process.cwd(), 'temp');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// Document Processing Class
class DocumentScanner {
  
  // High-performance image enhancement using Sharp
  static async enhanceDocument(imageInput, options = {}) {
    try {
      console.log('Starting document enhancement...');
      
      const {
        targetWidth = 1654,   // 200 DPI A4 width
        targetHeight = 2339,  // 200 DPI A4 height
        quality = 'high'
      } = options;
      
      let pipeline;
      
      // Handle both file paths and buffers
      if (Buffer.isBuffer(imageInput)) {
        pipeline = sharp(imageInput);
      } else if (typeof imageInput === 'string') {
        const metadata = await sharp(imageInput).metadata();
        console.log(`Original: ${metadata.width}x${metadata.height}, ${metadata.format}`);
        pipeline = sharp(imageInput);
      } else {
        throw new Error('Invalid input type');
      }
      
      // Image enhancement pipeline
      pipeline = pipeline
        .resize(targetWidth, targetHeight, {
          fit: 'inside',
          background: { r: 255, g: 255, b: 255, alpha: 1 },
          kernel: sharp.kernel.lanczos3
        })
        .grayscale()
        .normalize();
      
      // Quality-based processing
      if (quality === 'high') {
        pipeline = pipeline
          .linear(1.3, -15)  // High contrast
          .sharpen({ sigma: 0.8, m1: 1.0, m2: 2.5 })
          .median(1);
      } else if (quality === 'medium') {
        pipeline = pipeline
          .linear(1.2, -10)
          .sharpen({ sigma: 0.5 });
      } else {
        pipeline = pipeline
          .linear(1.1, -5);
      }
      
      // Final processing
      const enhancedBuffer = await pipeline
        .threshold(120)  // Convert to black/white
        .png({ 
          compressionLevel: 6,
          palette: true,
          quality: 100
        })
        .toBuffer();
      
      console.log(`Enhanced: ${(enhancedBuffer.length / 1024).toFixed(1)} KB`);
      
      return {
        buffer: enhancedBuffer,
        size: enhancedBuffer.length,
        dimensions: { width: targetWidth, height: targetHeight },
        format: 'png'
      };
      
    } catch (error) {
      console.error('Enhancement failed:', error);
      throw new Error(`Enhancement failed: ${error.message}`);
    }
  }
  
  // Real OCR using Tesseract.js with corrected configuration
  static async extractTextWithVision(imageBuffer) {
    try {
      console.log('Starting real OCR with Tesseract...');
      const startTime = Date.now();
      
      // Use the simpler recognize method with proper options for better spacing
      const { data } = await Tesseract.recognize(imageBuffer, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${(m.progress * 100).toFixed(1)}%`);
          }
        },
        // Enhanced OCR settings for better text layout and spacing
        tessedit_pageseg_mode: '1', // Automatic page segmentation with OSD
        preserve_interword_spaces: '1', // Preserve spaces between words
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?@#$%^&*()_+-=[]{}|;\':"<>?/~` \n\r\t'
      });
      
      const processingTime = (Date.now() - startTime) / 1000;
      
      console.log(`OCR completed in ${processingTime.toFixed(2)}s`);
      console.log(`Confidence: ${data.confidence.toFixed(1)}%`);
      console.log(`Extracted ${data.text.length} characters`);
      
      // More careful text cleaning that preserves intentional spacing
      let cleanedText = data.text
        // First normalize line breaks but preserve paragraph structure
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        // Remove excessive empty lines (3+ consecutive) but keep meaningful breaks
        .replace(/\n{3,}/g, '\n\n')
        // Normalize spaces within lines but preserve line structure
        .replace(/[ \t]+/g, ' ')
        // Remove trailing spaces at end of lines
        .replace(/[ \t]+\n/g, '\n')
        // Remove leading/trailing whitespace from entire text
        .trim();
      
      // If OCR returned empty or very short text, try preprocessing
      if (!cleanedText || cleanedText.length < 10) {
        console.log('OCR returned minimal text, trying with preprocessing...');
        return await this.extractTextWithPreprocessing(imageBuffer);
      }
      
      return {
        text: cleanedText,
        confidence: Math.round(data.confidence),
        processingTime: processingTime,
        wordCount: cleanedText.split(/\s+/).filter(word => word.length > 0).length,
        characterCount: cleanedText.length,
        ocrEngine: 'tesseract'
      };
      
    } catch (error) {
      console.error('OCR failed:', error);
      
      // Try with preprocessing as fallback
      try {
        console.log('Trying OCR with preprocessing...');
        return await this.extractTextWithPreprocessing(imageBuffer);
      } catch (preprocessError) {
        console.error('Preprocessing OCR also failed:', preprocessError);
        throw new Error(`OCR processing failed: ${error.message}`);
      }
    }
  }
  
  // OCR with image preprocessing for better results
  static async extractTextWithPreprocessing(imageBuffer) {
    try {
      console.log('Pre-processing image for better OCR...');
      
      // Pre-process the image for better OCR results
      const preprocessedBuffer = await sharp(imageBuffer)
        .grayscale()
        .normalize()
        .sharpen()
        .threshold(128)
        .png()
        .toBuffer();
      
      console.log('Running OCR on preprocessed image...');
      const startTime = Date.now();
      
      // Use enhanced settings for preprocessing as well
      const { data } = await Tesseract.recognize(preprocessedBuffer, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`Preprocessed OCR Progress: ${(m.progress * 100).toFixed(1)}%`);
          }
        },
        tessedit_pageseg_mode: '1',
        preserve_interword_spaces: '1',
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?@#$%^&*()_+-=[]{}|;\':"<>?/~` \n\r\t'
      });
      
      const processingTime = (Date.now() - startTime) / 1000;
      
      console.log(`Preprocessed OCR completed in ${processingTime.toFixed(2)}s`);
      console.log(`Confidence: ${data.confidence.toFixed(1)}%`);
      
      let cleanedText = data.text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]+/g, ' ')
        .replace(/[ \t]+\n/g, '\n')
        .trim();
      
      return {
        text: cleanedText,
        confidence: Math.round(data.confidence),
        processingTime: processingTime,
        wordCount: cleanedText.split(/\s+/).filter(word => word.length > 0).length,
        characterCount: cleanedText.length,
        ocrEngine: 'tesseract-preprocessed'
      };
      
    } catch (error) {
      console.error('Preprocessing OCR failed:', error);
      throw new Error(`OCR preprocessing failed: ${error.message}`);
    }
  }
  
  // PDF processing using pdf-parse (reliable)
  static async processPDF(pdfBuffer) {
    try {
      // Install: npm install pdf-parse
      const pdfParse = require('pdf-parse');
      const pdfData = await pdfParse(pdfBuffer);
      
      if (pdfData.text && pdfData.text.trim().length > 0) {
        return {
          text: pdfData.text.trim(),
          confidence: 90,
          pagesProcessed: pdfData.numpages,
          wordCount: pdfData.text.split(/\s+/).length,
          characterCount: pdfData.text.length
        };
      }
      
      return { text: '', confidence: 0, pagesProcessed: 0, wordCount: 0, characterCount: 0 };
      
    } catch (error) {
      console.error('PDF processing failed:', error);
      return { text: '', confidence: 0, pagesProcessed: 0, wordCount: 0, characterCount: 0 };
    }
  }
  
  // Extract ONLY the text after "Subject:" until the next colon (:) appears
  static extractSubjectFromText(text) {
    if (!text || text.trim().length === 0) {
      console.log('No text provided for subject extraction');
      return '';
    }
    
    // Preserve the original formatting but create a searchable version
    const originalText = text;
    
    // Create a version for pattern matching (normalize spaces but keep line breaks)
    const searchableText = text
      .replace(/[ \t]+/g, ' ')  // Normalize horizontal spaces
      .replace(/\n+/g, '\n')    // Normalize line breaks
      .trim();
    
    // Look for explicit "Subject:" patterns and capture until next field pattern
    const subjectPatterns = [
      /subject\s*:\s*([^]*?)(?=\n\s*(?:from|to|date|ref|cc|bcc|sent|received|time|reply|forward|attachment|enclosure|regarding|attn|attention)\s*:|$)/i,
      /subj\s*:\s*([^]*?)(?=\n\s*(?:from|to|date|ref|cc|bcc|sent|received|time|reply|forward|attachment|enclosure|regarding|attn|attention)\s*:|$)/i,
      /re\s*:\s*([^]*?)(?=\n\s*(?:from|to|date|ref|cc|bcc|sent|received|time|reply|forward|attachment|enclosure|regarding|attn|attention)\s*:|$)/i,
      // Fallback patterns for single line subjects
      /subject\s*:\s*([^\n\r:]+)/i,
      /subj\s*:\s*([^\n\r:]+)/i,
      /re\s*:\s*([^\n\r:]+)/i
    ];
    
    // Search through the text for subject patterns
    for (const pattern of subjectPatterns) {
      const match = searchableText.match(pattern);
      if (match && match[1] && match[1].trim().length > 0) {
        let subject = match[1].trim();
        
        // Clean up the subject while preserving meaningful spaces
        subject = subject
          .replace(/\n+/g, ' ')           // Convert line breaks to spaces
          .replace(/[ \t]+/g, ' ')        // Normalize multiple spaces to single space
          .replace(/[.,;!?]+$/, '')       // Remove trailing punctuation
          .trim();
        
        // Limit length for form field
        const finalSubject = subject.length > 150 ? subject.substring(0, 150) + '...' : subject;
        
        console.log(`Subject found: "${finalSubject}"`);
        return finalSubject;
      }
    }
    
    console.log('No subject pattern found in text');
    return ''; // Return empty string if no subject pattern found
  }

  // Legacy method - kept for backward compatibility but now uses the new specific method
  static extractSubject(text) {
    // First try the specific subject extraction
    const specificSubject = this.extractSubjectFromText(text);
    if (specificSubject) {
      return specificSubject;
    }
    
    // If no specific subject found, fall back to old behavior
    return this.findMostProminentTopLine(text.split('\n').filter(line => line.trim().length > 0));
  }

  static findMostProminentTopLine(lines) {
    if (!lines || lines.length === 0) return 'No subject found';
    
    const skipPatterns = [
      /^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/,
      /^(from|to|date|ref|no\.|number):/i,
      /^(dear|sincerely|regards|yours)/i,
      /^\w+@\w+\.\w+/,
      /^\+?\d{10,}/,
      /^(mr\.|mrs\.|dr\.|prof\.)/i
    ];
    
    let candidates = [];
    const searchLines = lines.slice(0, Math.min(10, lines.length));
    
    for (let i = 0; i < searchLines.length; i++) {
      const line = searchLines[i].trim();
      
      if (line.length < 5) continue;
      
      let shouldSkip = false;
      for (const pattern of skipPatterns) {
        if (pattern.test(line)) {
          shouldSkip = true;
          break;
        }
      }
      if (shouldSkip) continue;
      
      let score = 0;
      score += (10 - i) * 2;
      
      if (line.length >= 20 && line.length <= 100) {
        score += 10;
      } else if (line.length >= 10 && line.length <= 150) {
        score += 5;
      }
      
      if (line === line.toUpperCase() && line.length > 10) {
        score += 15;
      }
      
      const words = line.split(/\s+/);
      const titleCaseWords = words.filter(word => 
        word.length > 2 && word[0] === word[0].toUpperCase()
      );
      if (titleCaseWords.length >= words.length * 0.7) {
        score += 10;
      }
      
      if (line.endsWith('.') && line.split(/\s+/).length > 10) {
        score -= 5;
      }
      
      if (/^(the|a|an)\s+/i.test(line)) {
        score -= 3;
      }
      
      candidates.push({
        line: line,
        score: score,
        index: i
      });
    }
    
    candidates.sort((a, b) => b.score - a.score);
    
    if (candidates.length > 0 && candidates[0].score > 0) {
      let subject = candidates[0].line;
      subject = subject.replace(/[.,;:]+$/, '').trim();
      return subject.length > 150 ? subject.substring(0, 150) + '...' : subject;
    }
    
    return 'No subject found';
  }
  
  // Create optimized PDF
  static async createOptimizedPDF(imageBuffer, filename = 'scanned_document.pdf') {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4
      
      const pngImage = await pdfDoc.embedPng(imageBuffer);
      const { width: imgWidth, height: imgHeight } = pngImage.scale(1);
      
      // Scale to fit with margins
      const margin = 28.35;
      const pageWidth = 595.28 - (margin * 2);
      const pageHeight = 841.89 - (margin * 2);
      const scale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
      
      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;
      const x = (595.28 - scaledWidth) / 2;
      const y = (841.89 - scaledHeight) / 2;
      
      page.drawImage(pngImage, { x, y, width: scaledWidth, height: scaledHeight });
      
      const pdfBytes = await pdfDoc.save({ compress: true });
      
      return {
        buffer: Buffer.from(pdfBytes),
        size: pdfBytes.length,
        filename
      };
      
    } catch (error) {
      console.error('PDF creation failed:', error);
      throw new Error(`PDF creation failed: ${error.message}`);
    }
  }
}

// Main API handler - POST METHOD
export async function POST(request) {
  let tempFilePath = null;
  
  try {
    await ensureUploadDir();
    
    const formData = await request.formData();
    const file = formData.get('file');
    const action = formData.get('action') || 'enhance_and_extract';
    const quality = formData.get('quality') || 'high';
    
    // Validation
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided', success: false },
        { status: 400 }
      );
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.', success: false },
        { status: 400 }
      );
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and PDF files are allowed.', success: false },
        { status: 400 }
      );
    }
    
    console.log(`Processing: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);
    
    const startTime = Date.now();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Save temporary file for processing
    const fileExtension = file.type === 'application/pdf' ? '.pdf' : '.jpg';
    const tempFileName = `${uuidv4()}${fileExtension}`;
    tempFilePath = path.join(UPLOAD_DIR, tempFileName);
    await fs.writeFile(tempFilePath, buffer);
    
    let result = {
      success: true,
      originalFileName: file.name,
      originalSize: file.size,
      fileType: file.type,
      action,
      quality,
      processingStartTime: startTime
    };
    
    try {
      if (file.type === 'application/pdf') {
        // Process PDF
        console.log('Processing PDF...');
        
        const pdfResult = await DocumentScanner.processPDF(buffer);
        
        // Extract subject specifically for scan form
        const extractedSubject = DocumentScanner.extractSubjectFromText(pdfResult.text);
        
        result.textExtraction = {
          text: pdfResult.text,
          confidence: pdfResult.confidence,
          pagesProcessed: pdfResult.pagesProcessed,
          subject: extractedSubject, // This will be empty string if no subject pattern found
          legacySubject: DocumentScanner.extractSubject(pdfResult.text), // Fallback for compatibility
          wordCount: pdfResult.wordCount,
          characterCount: pdfResult.characterCount
        };
        
      } else {
        // Process Image
        console.log('Processing image...');
        
        let enhancedResult = null;
        
        // Step 1: Enhance image
        if (action === 'enhance_only' || action === 'enhance_and_extract') {
          enhancedResult = await DocumentScanner.enhanceDocument(tempFilePath, { quality });
          
          result.enhancement = {
            originalSize: file.size,
            enhancedSize: enhancedResult.size,
            compressionRatio: (file.size / enhancedResult.size).toFixed(2),
            dimensions: enhancedResult.dimensions,
            format: enhancedResult.format
          };
        }
        
        // Step 2: Extract text using REAL OCR
        if (action === 'extract_only' || action === 'enhance_and_extract') {
          const bufferToProcess = enhancedResult ? enhancedResult.buffer : buffer;
          const textResult = await DocumentScanner.extractTextWithVision(bufferToProcess);
          
          // Extract subject specifically for scan form
          const extractedSubject = DocumentScanner.extractSubjectFromText(textResult.text);
          
          result.textExtraction = {
            text: textResult.text,
            confidence: textResult.confidence,
            processingTime: textResult.processingTime,
            subject: extractedSubject, // This will be empty string if no subject pattern found
            legacySubject: DocumentScanner.extractSubject(textResult.text), // Fallback for compatibility
            wordCount: textResult.wordCount,
            characterCount: textResult.characterCount,
            ocrEngine: textResult.ocrEngine
          };
        }
        
        // Step 3: Create PDF
        if (enhancedResult) {
          const pdfResult = await DocumentScanner.createOptimizedPDF(
            enhancedResult.buffer,
            `enhanced_${file.name.replace(/\.[^/.]+$/, '.pdf')}`
          );
          
          result.optimizedPdf = {
            size: pdfResult.size,
            filename: pdfResult.filename,
            base64: pdfResult.buffer.toString('base64')
          };
          
          // Enhanced image as base64
          result.enhancedImage = {
            base64: enhancedResult.buffer.toString('base64'),
            mimeType: `image/${enhancedResult.format}`,
            size: enhancedResult.size
          };
        }
      }
      
      result.totalProcessingTime = Date.now() - startTime;
      console.log(`Processing completed in ${result.totalProcessingTime}ms`);
      
      return NextResponse.json(result);
      
    } catch (processingError) {
      console.error('Processing error:', processingError);
      return NextResponse.json(
        {
          error: 'Document processing failed',
          details: processingError.message,
          success: false
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
        success: false
      },
      { status: 500 }
    );
    
  } finally {
    // Cleanup
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (cleanupError) {
        console.error('Cleanup failed:', cleanupError);
      }
    }
  }
}

// Health check - GET METHOD
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'Document Scanner API',
    version: '3.3.0',
    features: [
      'High-performance image enhancement',
      'Real OCR text extraction (Tesseract.js)',
      'PDF processing',
      'Specific subject extraction for scan forms',
      'PDF generation'
    ],
    supportedFormats: ['JPEG', 'PNG', 'PDF'],
    ocrEngine: 'tesseract.js-simple',
    mockData: false
  });
}