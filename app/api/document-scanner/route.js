import { NextResponse } from 'next/server';
import sharp from 'sharp';
import Tesseract from 'tesseract.js';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';


// Configuration
const UPLOAD_DIR = path.join(process.cwd(), 'temp');
const MAX_FILE_SIZE = 10 * 1024 * 1024; 

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
        try {
          const metadata = await sharp(imageInput).metadata();
          pipeline = sharp(imageInput);
        } catch (metadataError) {
          console.error('Failed to get image metadata:', metadataError);
          // Try to process anyway
          pipeline = sharp(imageInput);
        }
      } else {
        throw new Error('Invalid input type');
      }
      
      // Image enhancement pipeline with error handling
      try {
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
        
        return {
          buffer: enhancedBuffer,
          size: enhancedBuffer.length,
          dimensions: { width: targetWidth, height: targetHeight },
          format: 'png'
        };
        
      } catch (processingError) {
        console.error('Image processing failed, trying simplified enhancement:', processingError);
        
        // Fallback to simplified enhancement
        const fallbackPipeline = sharp(imageInput)
          .resize(targetWidth, targetHeight, { fit: 'inside' })
          .grayscale()
          .png({ compressionLevel: 6 });
        
        const fallbackBuffer = await fallbackPipeline.toBuffer();
        
        return {
          buffer: fallbackBuffer,
          size: fallbackBuffer.length,
          dimensions: { width: targetWidth, height: targetHeight },
          format: 'png'
        };
      }
      
    } catch (error) {
      console.error('Enhancement failed:', error);
      
      // Return original image as fallback
      if (Buffer.isBuffer(imageInput)) {
        return {
          buffer: imageInput,
          size: imageInput.length,
          dimensions: { width: 800, height: 600 }, // Default dimensions
          format: 'original'
        };
      }
      
      throw new Error(`Enhancement failed: ${error.message}`);
    }
  }
  
  // Real OCR using Tesseract.js with corrected configuration
  static async extractTextWithVision(imageBuffer) {
    try {
      const startTime = Date.now();
      
      // Add timeout for OCR processing
      const ocrPromise = Tesseract.recognize(imageBuffer, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${(m.progress * 100).toFixed(1)}%`);
          }
        },
        // Enhanced OCR settings for better text layout and spacing
        tessedit_pageseg_mode: '1', // Automatic page segmentation with OSD
        preserve_interword_spaces: '1', // Preserve spaces between words
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?@#$%^&*()_+-=[]{}|;\':"<>?/~` \n\r\t',
        // Additional settings for better accuracy
        tessedit_do_invert: '0', // Don't invert colors
        textord_heavy_nr: '1', // Heavy noise removal
        textord_min_linesize: '2.0', // Minimum line size
        textord_old_baselines: '0', // Use new baseline detection
        textord_old_xheight: '0', // Use new x-height detection
        textord_min_xheight: '8', // Minimum x-height
        textord_force_make_prop_words: 'F', // Don't force proportional words
        textord_use_cjk_fp_model: 'F' // Don't use CJK model
      });

      // Add timeout (30 seconds)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('OCR timeout after 30 seconds')), 30000);
      });

      const { data } = await Promise.race([ocrPromise, timeoutPromise]);
      
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
        return await this.extractTextWithPreprocessing(imageBuffer);
      } catch (preprocessError) {
        console.error('Preprocessing OCR also failed:', preprocessError);
        
        // Return empty result instead of throwing error
        return {
          text: '',
          confidence: 0,
          processingTime: 0,
          wordCount: 0,
          characterCount: 0,
          ocrEngine: 'failed',
          error: `OCR processing failed: ${error.message}`
        };
      }
    }
  }
  
  // OCR with image preprocessing for better results
  static async extractTextWithPreprocessing(imageBuffer) {
    try {
      // Pre-process the image for better OCR results
      const preprocessedBuffer = await sharp(imageBuffer)
        .grayscale()
        .normalize()
        .sharpen()
        .threshold(128)
        .png()
        .toBuffer();
      
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
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?@#$%^&*()_+-=[]{}|;\':"<>?/~` \n\r\t',
        // Additional settings for better accuracy
        tessedit_do_invert: '0', // Don't invert colors
        textord_heavy_nr: '1', // Heavy noise removal
        textord_min_linesize: '2.0', // Minimum line size
        textord_old_baselines: '0', // Use new baseline detection
        textord_old_xheight: '0', // Use new x-height detection
        textord_min_xheight: '8', // Minimum x-height
        textord_force_make_prop_words: 'F', // Don't force proportional words
        textord_use_cjk_fp_model: 'F' // Don't use CJK model
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
      // Import pdf-parse dynamically to avoid issues in Next.js
      const pdfParse = (await import('pdf-parse')).default;
      
      // First attempt: Standard PDF parsing
      try {
        const pdfData = await pdfParse(pdfBuffer);
        
        if (pdfData.text && pdfData.text.trim().length > 0) {
          return {
            text: pdfData.text.trim(),
            confidence: 90,
            pagesProcessed: pdfData.numpages,
            wordCount: pdfData.text.split(/\s+/).length,
            characterCount: pdfData.text.length,
            method: 'pdf-parse'
          };
        }
      } catch (parseError) {
        // Standard PDF parsing failed
      }
      
      // Second attempt: Enhanced PDF parsing with different options
      
      try {
        const pdfData = await pdfParse(pdfBuffer, {
          max: 0, // No page limit
          version: 'v2.0.550'
        });
        
        if (pdfData.text && pdfData.text.trim().length > 0) {
          return {
            text: pdfData.text.trim(),
            confidence: 85, // Slightly lower confidence for enhanced parsing
            pagesProcessed: pdfData.numpages,
            wordCount: pdfData.text.split(/\s+/).length,
            characterCount: pdfData.text.length,
            method: 'pdf-parse-enhanced'
          };
        }
      } catch (enhancedError) {
        console.log('Enhanced PDF parsing failed:', enhancedError.message);
      }
      
      // Third attempt: Try to get basic PDF structure info
      try {
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const pageCount = pdfDoc.getPageCount();
        
        // If we can load the PDF but no text, it's likely scanned
        if (pageCount > 0) {
          
          // Try scanned PDF processing as fallback
          try {
            const scannedResult = await DocumentScanner.processScannedPDF(pdfBuffer);
            if (scannedResult.text && scannedResult.text.trim().length > 0) {
              return scannedResult;
            }
          } catch (scannedError) {
            // Scanned PDF processing failed
          }
          
          // Return structure info if OCR also fails
          return { 
            text: '', 
            confidence: 0, 
            pagesProcessed: pageCount, 
            wordCount: 0, 
            characterCount: 0,
            method: 'structure-only',
            note: 'PDF loaded but no text extracted - may be scanned document'
          };
        }
      } catch (structureError) {
        // PDF structure analysis failed
      }
      
      // All PDF processing methods failed
      return { text: '', confidence: 0, pagesProcessed: 0, wordCount: 0, characterCount: 0, method: 'failed' };
      
    } catch (error) {
      console.error('PDF processing failed:', error);
      return { text: '', confidence: 0, pagesProcessed: 0, wordCount: 0, characterCount: 0, method: 'error', error: error.message };
    }
  }
  
  // Fallback method for scanned PDFs - convert to image and use OCR
  static async processScannedPDF(pdfBuffer) {
    try {
      // First, try to get basic text with enhanced pdf-parse
      try {
        const pdfParse = (await import('pdf-parse')).default;
        const pdfData = await pdfParse(pdfBuffer, {
          max: 0,
          version: 'v2.0.550'
        });
        
        if (pdfData.text && pdfData.text.trim().length > 0) {
          const text = pdfData.text.trim();
          return {
            text: text,
            confidence: 75,
            pagesProcessed: pdfData.numpages || 1,
            wordCount: text.split(/\s+/).length,
            characterCount: text.length
          };
        }
      } catch (parseError) {
        // Enhanced PDF parsing failed
      }

      // If pdf-parse fails, convert PDF to images and use OCR
      
      let tempPdfPath = null;
      let tempDir = null;
      
      try {
        // Create temporary directory for processing
        tempDir = path.join(UPLOAD_DIR, `pdf_${uuidv4()}`);
        await fs.mkdir(tempDir, { recursive: true });
        
        // Save PDF to temporary file
        tempPdfPath = path.join(tempDir, 'temp.pdf');
        await fs.writeFile(tempPdfPath, pdfBuffer);
        
        // Method 1: Try pdf2pic for PDF to image conversion (if available)
        try {
          const { fromPath } = await import('pdf2pic');
          
          const options = {
            density: 300,           // High DPI for better OCR
            saveFilename: "page",
            savePath: tempDir,
            format: "png",
            width: 1654,           // A4 width at 200 DPI
            height: 2339           // A4 height at 200 DPI
          };
          
          // Ensure the temporary directory exists and is writable
          await fs.access(tempDir, fs.constants.W_OK);
          
          const convert = fromPath(tempPdfPath, options);
          const pageCount = await convert.bulk(-1); // Convert all pages
          
          // Process each page with OCR
          let allText = '';
          let totalConfidence = 0;
          let processedPages = 0;
          
          for (let i = 0; i < pageCount.length; i++) {
            const imagePath = path.join(tempDir, `page_${i + 1}.png`);
            
            try {
              // Read the generated image
              const imageBuffer = await fs.readFile(imagePath);
              
              // Enhance the image for better OCR
              const enhancedImage = await DocumentScanner.enhanceDocument(imageBuffer, {
                quality: 'high',
                targetWidth: 1654,
                targetHeight: 2339
              });
              
              // Extract text using OCR
              const ocrResult = await DocumentScanner.extractTextWithPreprocessing(enhancedImage.buffer);
              
              if (ocrResult.text && ocrResult.text.trim().length > 0) {
                allText += (allText ? '\n\n' : '') + ocrResult.text.trim();
                totalConfidence += ocrResult.confidence || 0;
                processedPages++;
              }
              
              // Clean up individual image file
              await fs.unlink(imagePath);
              
            } catch (pageError) {
              // Error processing page
            }
          }
          
          if (allText.trim().length > 0) {
            const avgConfidence = processedPages > 0 ? Math.round(totalConfidence / processedPages) : 0;
            
            return {
              text: allText.trim(),
              confidence: avgConfidence,
              pagesProcessed: processedPages,
              wordCount: allText.trim().split(/\s+/).length,
              characterCount: allText.trim().length,
              method: 'pdf2pic_ocr'
            };
          }
          
        } catch (pdf2picError) {
          // pdf2pic conversion failed (will use fallback)
        }
        
        // Method 2: Fallback to pdfjs-dist for PDF to image conversion
        try {
          const pdfjsLib = await import('pdfjs-dist');
          
          // Set worker path
          const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
          pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
          
          // Load PDF document - convert Buffer to Uint8Array for pdfjs-dist
          const loadingTask = pdfjsLib.getDocument({ 
            data: DocumentScanner.convertBufferToUint8Array(pdfBuffer),
            // Add timeout and error handling
            maxImageSize: -1,
            cMapUrl: null,
            cMapPacked: true
          });
          
          // Add timeout for PDF loading
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('PDF loading timeout')), 30000); // 30 second timeout
          });
          
          const pdfDocument = await Promise.race([loadingTask.promise, timeoutPromise]);
          
          let allText = '';
          let totalConfidence = 0;
          let processedPages = 0;
          
          // Process each page
          for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
            try {
              const page = await pdfDocument.getPage(pageNum);
              const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
              
              // Create canvas for rendering
              const canvas = new (await import('canvas')).Canvas(viewport.width, viewport.height);
              const context = canvas.getContext('2d');
              
              // Render PDF page to canvas
              const renderContext = {
                canvasContext: context,
                viewport: viewport
              };
              
              await page.render(renderContext).promise;
              
              // Convert canvas to buffer
              const imageBuffer = canvas.toBuffer('image/png');
              
              // Enhance the image for better OCR
              const enhancedImage = await DocumentScanner.enhanceDocument(imageBuffer, {
                quality: 'high',
                targetWidth: 1654,
                targetHeight: 2339
              });
              
              // Extract text using OCR
              const ocrResult = await DocumentScanner.extractTextWithPreprocessing(enhancedImage.buffer);
              
              if (ocrResult.text && ocrResult.text.trim().length > 0) {
                allText += (allText ? '\n\n' : '') + ocrResult.text.trim();
                totalConfidence += ocrResult.confidence || 0;
                processedPages++;
              }
              
            } catch (pageError) {
              // Error processing page
            }
          }
          
          if (allText.trim().length > 0) {
            const avgConfidence = processedPages > 0 ? Math.round(totalConfidence / processedPages) : 0;
            
            return {
              text: allText.trim(),
              confidence: avgConfidence,
              pagesProcessed: processedPages,
              wordCount: allText.trim().split(/\s+/).length,
              characterCount: allText.trim().length,
              method: 'pdfjs_ocr'
            };
          }
          
        } catch (pdfjsError) {
          // pdfjs-dist conversion failed
        }
        
        // If all methods fail, return PDF structure info
        try {
          const pdfDoc = await PDFDocument.load(pdfBuffer);
          const pageCount = pdfDoc.getPageCount();
          
          return { 
            text: '', 
            confidence: 0, 
            pagesProcessed: pageCount, 
            wordCount: 0, 
            characterCount: 0,
            note: 'All PDF to image conversion methods failed - manual review required'
          };
          
        } catch (structureError) {
          // PDF structure analysis failed
        }
        
      } finally {
        // Clean up temporary files
        try {
          if (tempPdfPath && await fs.access(tempPdfPath).then(() => true).catch(() => false)) {
            await fs.unlink(tempPdfPath);
          }
          if (tempDir && await fs.access(tempDir).then(() => true).catch(() => false)) {
            await fs.rm(tempDir, { recursive: true, force: true });
          }
        } catch (cleanupError) {
          // Cleanup error
        }
      }
      
      // If all methods fail, return empty result
      return { text: '', confidence: 0, pagesProcessed: 0, wordCount: 0, characterCount: 0 };
      
    } catch (error) {
      console.error('Scanned PDF processing failed:', error);
      return { text: '', confidence: 0, pagesProcessed: 0, wordCount: 0, characterCount: 0, error: error.message };
    }
  }
  
  // Extract subject from text with improved pattern matching
  static extractSubjectFromText(text) {
    if (!text || text.trim().length === 0) {
      console.log('No text provided for subject extraction');
      return '';
    }
    
    console.log(`Extracting subject from text (${text.length} characters)`);
    
    // Create a version for pattern matching (normalize spaces but keep line breaks)
    const searchableText = text
      .replace(/[ \t]+/g, ' ')  // Normalize horizontal spaces
      .replace(/\n+/g, '\n')    // Normalize line breaks
      .trim();
    
    // Enhanced subject patterns - more flexible and comprehensive
    const subjectPatterns = [
      // Primary patterns with field boundaries
      /subject\s*:\s*([^]*?)(?=\n\s*(?:from|to|date|ref|cc|bcc|sent|received|time|reply|forward|attachment|enclosure|regarding|attn|attention|dear|sincerely|regards|yours|phone|fax|email|mobile)\s*:|$)/i,
      /subj\s*:\s*([^]*?)(?=\n\s*(?:from|to|date|ref|cc|bcc|sent|received|time|reply|forward|attachment|enclosure|regarding|attn|attention|dear|sincerely|regards|yours|phone|fax|email|mobile)\s*:|$)/i,
      /re\s*:\s*([^]*?)(?=\n\s*(?:from|to|date|ref|cc|bcc|sent|received|time|reply|forward|attachment|enclosure|regarding|attn|attention|dear|sincerely|regards|yours|phone|fax|email|mobile)\s*:|$)/i,
      
      // Single line patterns (more flexible)
      /subject\s*:\s*([^\n\r]+)/i,
      /subj\s*:\s*([^\n\r]+)/i,
      /re\s*:\s*([^\n\r]+)/i,
      
      // Alternative patterns for different document formats
      /subject\s*line\s*:\s*([^\n\r]+)/i,
      /subject\s*field\s*:\s*([^\n\r]+)/i,
      
      // Look for text that might be a subject based on position and content
      /^(?!from|to|date|ref|cc|bcc|sent|received|time|reply|forward|attachment|enclosure|regarding|attn|attention|dear|sincerely|regards|yours|phone|fax|email|mobile)[^:\n\r]{5,50}$/im
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
        
        // Additional validation - subject should be reasonable length
        if (subject.length < 3 || subject.length > 200) {
          continue; // Skip if too short or too long
        }
        
        // Limit length for form field
        const finalSubject = subject.length > 150 ? subject.substring(0, 150) + '...' : subject;
        
        return finalSubject;
      }
    }
    
    // Fallback: try to find the first meaningful line that could be a subject
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      // Skip common header lines
      if (/^(from|to|date|ref|cc|bcc|sent|received|time|reply|forward|attachment|enclosure|regarding|attn|attention|dear|sincerely|regards|yours|phone|fax|email|mobile):/i.test(line)) {
        continue;
      }
      // Skip very short lines or lines that are just numbers/dates
      if (line.length < 5 || /^\d+[\/\-\.]\d+[\/\-\.]\d+/.test(line)) {
        continue;
      }
      
      // This could be a subject line
      const finalSubject = line.length > 150 ? line.substring(0, 150) + '...' : line;
      return finalSubject;
    }
    
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
  
    // Helper method to convert Buffer to Uint8Array for pdfjs-dist
  static convertBufferToUint8Array(buffer) {
    if (Buffer.isBuffer(buffer)) {
      return new Uint8Array(buffer);
    } else if (buffer instanceof Uint8Array) {
      return buffer;
    } else {
      throw new Error('Invalid buffer type for PDF processing');
    }
  }
  
  // Create PDF preview image from first page
  static async createPDFPreviewImage(pdfBuffer) {
    try {
      // Use pdfjs-dist to render first page
      const pdfjsLib = await import('pdfjs-dist');
      const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      
      // Load PDF document - convert Buffer to Uint8Array for pdfjs-dist
      const loadingTask = pdfjsLib.getDocument({ 
        data: DocumentScanner.convertBufferToUint8Array(pdfBuffer),
        // Add timeout and error handling
        maxImageSize: -1,
        cMapUrl: null,
        cMapPacked: true
      });
      
      // Add timeout for PDF loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('PDF loading timeout')), 30000); // 30 second timeout
      });
      
      const pdfDocument = await Promise.race([loadingTask.promise, timeoutPromise]);
      
      if (pdfDocument.numPages === 0) {
        return await DocumentScanner.createNoPreviewImage();
      }
      
      // Get first page
      const page = await pdfDocument.getPage(1);
      const viewport = page.getViewport({ scale: 1.0 }); // Standard scale for preview
      
      // Try to create canvas for rendering
      let canvas;
      let context;
      
      try {
        // Method 1: Try canvas package
        const Canvas = (await import('canvas')).Canvas;
        canvas = new Canvas(viewport.width, viewport.height);
        context = canvas.getContext('2d');
      } catch (canvasError) {
        // Canvas package failed, trying alternative method
        
        // Method 2: Try to create a simple placeholder image
        // This is a fallback when canvas is not available
        try {
          // Create a simple colored rectangle as placeholder
          const placeholderBuffer = await DocumentScanner.createPlaceholderImage(viewport.width, viewport.height);
          console.log('Created placeholder image for PDF preview');
          return placeholderBuffer;
        } catch (placeholderError) {
          console.log('Placeholder creation also failed:', placeholderError.message);
          
          // Method 3: Try the simple PDF preview method
          try {
            const simplePreview = await DocumentScanner.createSimplePDFPreview(pdfBuffer);
            if (simplePreview) {
              console.log('Created simple PDF preview as fallback');
              return simplePreview;
            }
          } catch (simpleError) {
            console.log('Simple PDF preview also failed:', simpleError.message);
          }
          
          // Final Fallback: "No preview available" image
          console.log('All specific preview methods failed. Creating generic "no preview" image.');
          return await DocumentScanner.createNoPreviewImage();
        }
      }
      
      // Render PDF page to canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      
      // Convert canvas to PNG buffer
      const imageBuffer = canvas.toBuffer('image/png');
      console.log(`PDF preview image created: ${imageBuffer.length} bytes`);
      
      return imageBuffer;
      
    } catch (error) {
      console.error('PDF preview image creation failed:', error);
      
      // Try simple preview as fallback
      try {
        const simplePreview = await DocumentScanner.createSimplePDFPreview(pdfBuffer);
        if (simplePreview) {
          console.log('Created simple PDF preview after error');
          return simplePreview;
        }
      } catch (simpleError) {
        console.log('Simple PDF preview also failed after error:', simpleError.message);
      }
      
      // Final Fallback: "No preview available" image
      console.log('All preview methods failed. Creating generic "no preview" image.');
      return await DocumentScanner.createNoPreviewImage();
    }
  }
  
  // Create a simple placeholder image when canvas is not available
  static async createPlaceholderImage(width, height) {
    try {
      console.log('Creating placeholder image...');
      
      // Create a simple colored rectangle using Sharp
      const svgContent = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f0f0f0"/>
          <rect x="10" y="10" width="${width-20}" height="${height-20}" fill="white" stroke="#cccccc" stroke-width="2"/>
          <text x="${width/2}" y="${height/2-20}" font-family="Arial" font-size="24" text-anchor="middle" fill="#666666">PDF Preview</text>
          <text x="${width/2}" y="${height/2+20}" font-family="Arial" font-size="16" text-anchor="middle" fill="#999999">${width}x${height}</text>
        </svg>
      `;
      
      const placeholderBuffer = await sharp(Buffer.from(svgContent))
        .png()
        .toBuffer();
      
      console.log(`Placeholder image created: ${placeholderBuffer.length} bytes`);
      return placeholderBuffer;
      
    } catch (error) {
      console.error('Placeholder image creation failed:', error);
      return null;
    }
  }
  
  // Alternative method: Create a simple PDF preview without complex rendering
  static async createSimplePDFPreview(pdfBuffer) {
    try {
      console.log('Creating simple PDF preview...');
      
      // Get basic PDF info without complex rendering
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const pageCount = pdfDoc.getPageCount();
      
      if (pageCount === 0) {
        console.log('PDF has no pages');
        return null;
      }
      
      // Get first page dimensions
      const firstPage = pdfDoc.getPage(0);
      const { width, height } = firstPage.getSize();
      
      // Create a simple preview image with PDF info
      const previewWidth = Math.min(800, width);
      const previewHeight = Math.min(1000, height);
      
      const svgContent = `
        <svg width="${previewWidth}" height="${previewHeight}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f8f9fa"/>
          <rect x="20" y="20" width="${previewWidth-40}" height="${previewHeight-40}" fill="white" stroke="#dee2e6" stroke-width="3" rx="8"/>
          
          <!-- PDF Icon -->
          <rect x="${previewWidth/2-30}" y="${previewHeight/2-60}" width="60" height="80" fill="#dc3545" rx="4"/>
          <text x="${previewWidth/2}" y="${previewHeight/2-20}" font-family="Arial" font-size="12" text-anchor="middle" fill="white">PDF</text>
          
          <!-- Page Info -->
          <text x="${previewWidth/2}" y="${previewHeight/2+20}" font-family="Arial" font-size="16" text-anchor="middle" fill="#495057">${pageCount} Page${pageCount > 1 ? 's' : ''}</text>
          <text x="${previewWidth/2}" y="${previewHeight/2+45}" font-family="Arial" font-size="14" text-anchor="middle" fill="#6c757d">${Math.round(width)} × ${Math.round(height)}</text>
          
          <!-- File Info -->
          <text x="${previewWidth/2}" y="${previewHeight-40}" font-family="Arial" font-size="12" text-anchor="middle" fill="#868e96">Click to view PDF</text>
        </svg>
      `;
      
      const previewBuffer = await sharp(Buffer.from(svgContent))
        .png()
        .toBuffer();
      
      console.log(`Simple PDF preview created: ${previewBuffer.length} bytes`);
      return previewBuffer;
      
    } catch (error) {
      console.error('Simple PDF preview creation failed:', error);
      return null;
    }
  }

  // Create a "No preview available" image as ultimate fallback
  static async createNoPreviewImage() {
    try {
      console.log('Creating "no preview available" placeholder image...');
      const svgContent = `
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f8f9fa"/>
          <text x="100" y="100" font-family="Arial" font-size="16" text-anchor="middle" fill="#6c757d">No Preview Available</text>
          <text x="100" y="120" font-family="Arial" font-size="12" text-anchor="middle" fill="#868e96">Click to download/view PDF</text>
        </svg>
      `;
      const noPreviewBuffer = await sharp(Buffer.from(svgContent))
        .png()
        .toBuffer();
      console.log(`"No preview" image created: ${noPreviewBuffer.length} bytes`);
      return noPreviewBuffer;
    } catch (error) {
      console.error('Failed to create "no preview" image:', error);
      // Return a minimal 1x1 transparent PNG as absolute fallback
      return Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
    }
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
        
        try {
          let pdfResult = await DocumentScanner.processPDF(buffer);
          
          // If no text extracted, try scanned PDF processing
          if (!pdfResult.text || pdfResult.text.trim().length === 0) {
            const scannedResult = await DocumentScanner.processScannedPDF(buffer);
            if (scannedResult.text && scannedResult.text.trim().length > 0) {
              pdfResult = scannedResult;
            }
          }
          
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
          
          // Add PDF preview data
          result.pdfPreview = {
            base64: buffer.toString('base64'),
            mimeType: 'application/pdf',
            size: buffer.length,
            filename: file.name,
            pageCount: pdfResult.pagesProcessed || 1
          };
          
          // Create preview image from first page
          try {
            const previewImage = await DocumentScanner.createPDFPreviewImage(buffer);
            result.pdfPreview.previewImage = {
              base64: previewImage.toString('base64'),
              mimeType: 'image/png',
              size: previewImage.length
            };
          } catch (previewError) {
            // PDF preview creation failed, using fallback
            // Use simple preview as fallback
            const fallbackPreview = await DocumentScanner.createSimplePDFPreview(buffer);
            if (fallbackPreview) {
              result.pdfPreview.previewImage = {
                base64: fallbackPreview.toString('base64'),
                mimeType: 'image/png',
                size: fallbackPreview.length
              };
            }
          }
          
          
        } catch (pdfError) {
          console.error('PDF processing error:', pdfError);
          result.textExtraction = {
            text: '',
            confidence: 0,
            pagesProcessed: 0,
            subject: '',
            legacySubject: '',
            wordCount: 0,
            characterCount: 0,
            error: pdfError.message
          };
          
          // Even if processing failed, try to provide PDF preview
          try {
            const previewImage = await DocumentScanner.createPDFPreviewImage(buffer);
            result.pdfPreview = {
              base64: buffer.toString('base64'),
              mimeType: 'application/pdf',
              size: buffer.length,
              filename: file.name,
              pageCount: 1,
              previewImage: {
                base64: previewImage.toString('base64'),
                mimeType: 'image/png',
                size: previewImage.length
              }
            };
          } catch (previewError) {
            console.log('PDF preview creation failed after error, using fallback:', previewError.message);
            // Use simple preview as fallback
            const simplePreview = await DocumentScanner.createSimplePDFPreview(buffer);
            if (simplePreview) {
              result.pdfPreview = {
                base64: buffer.toString('base64'),
                mimeType: 'application/pdf',
                size: buffer.length,
                filename: file.name,
                pageCount: 1,
                previewImage: {
                  base64: simplePreview.toString('base64'),
                  mimeType: 'image/png',
                  size: simplePreview.length
                }
              };
            }
          }
        }
        
        // Ensure PDF preview is always available (fallback for edge cases)
        if (!result.pdfPreview) {
          console.log('Creating fallback PDF preview...');
          try {
            const previewImage = await DocumentScanner.createPDFPreviewImage(buffer);
            result.pdfPreview = {
              base64: buffer.toString('base64'),
              mimeType: 'application/pdf',
              size: buffer.length,
              filename: file.name,
              pageCount: 1,
              previewImage: {
                base64: previewImage.toString('base64'),
                mimeType: 'image/png',
                size: previewImage.length
              }
            };
          } catch (fallbackError) {
            console.log('Fallback PDF preview failed:', fallbackError.message);
            // Create minimal PDF preview with simple fallback
            const simplePreview = await DocumentScanner.createSimplePDFPreview(buffer);
            result.pdfPreview = {
              base64: buffer.toString('base64'),
              mimeType: 'application/pdf',
              size: buffer.length,
              filename: file.name,
              pageCount: 1,
              previewImage: simplePreview ? {
                base64: simplePreview.toString('base64'),
                mimeType: 'image/png',
                size: simplePreview.length
              } : undefined
            };
          }
        }
        
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
          try {
            const bufferToProcess = enhancedResult ? enhancedResult.buffer : buffer;
            
            const textResult = await DocumentScanner.extractTextWithVision(bufferToProcess);
        
            const extractedSubject = DocumentScanner.extractSubjectFromText(textResult.text);
            
            result.textExtraction = {
              text: textResult.text,
              confidence: textResult.confidence,
              processingTime: textResult.processingTime,
              subject: extractedSubject, 
              legacySubject: DocumentScanner.extractSubject(textResult.text),
              wordCount: textResult.wordCount,
              characterCount: textResult.characterCount,
              ocrEngine: textResult.ocrEngine
            };
            
          } catch (ocrError) {
            console.error('OCR processing error:', ocrError);
            result.textExtraction = {
              text: '',
              confidence: 0,
              processingTime: 0,
              subject: '',
              legacySubject: '',
              wordCount: 0,
              characterCount: 0,
              ocrEngine: 'failed',
              error: ocrError.message
            };
          }
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
      
      return NextResponse.json(result);
      
    } catch (processingError) {
      console.error('Processing error:', processingError);
      
      // Provide more specific error messages
      let errorMessage = 'Document processing failed';
      let errorDetails = processingError.message;
      
      if (processingError.message.includes('timeout')) {
        errorMessage = 'Processing timeout - document too complex or large';
        errorDetails = 'The document took too long to process. Try with a simpler document or lower quality setting.';
      } else if (processingError.message.includes('memory')) {
        errorMessage = 'Memory limit exceeded';
        errorDetails = 'The document is too large or complex. Try with a smaller document or lower quality setting.';
      } else if (processingError.message.includes('format')) {
        errorMessage = 'Unsupported file format';
        errorDetails = 'The file format is not supported or corrupted.';
      } else if (processingError.message.includes('OCR')) {
        errorMessage = 'Text extraction failed';
        errorDetails = 'Unable to extract text from the document. The image might be too blurry or contain no readable text.';
      }
      
      return NextResponse.json(
        {
          error: errorMessage,
          details: errorDetails,
          success: false,
          processingTime: Date.now() - startTime
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
  try {
    // Test basic functionality
    const testBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    
    // Test Sharp
    let sharpWorking = false;
    try {
      const sharpTest = await sharp(testBuffer).metadata();
      sharpWorking = true;
    } catch (sharpError) {
      console.error('Sharp test failed:', sharpError.message);
    }
    
    // Test Tesseract
    let tesseractWorking = false;
    try {
      const tesseractTest = await Tesseract.recognize(testBuffer, 'eng');
      tesseractWorking = true;
    } catch (tesseractError) {
      console.error('Tesseract test failed:', tesseractError.message);
    }
    
    return NextResponse.json({
      status: 'healthy',
      service: 'Document Scanner API',
      version: '3.3.1',
      features: [
        'High-performance image enhancement',
        'Real OCR text extraction (Tesseract.js)',
        'PDF processing',
        'Specific subject extraction for scan forms',
        'PDF generation'
      ],
      supportedFormats: ['JPEG', 'PNG', 'PDF'],
      ocrEngine: 'tesseract.js-simple',
      mockData: false,
      components: {
        sharp: sharpWorking ? 'working' : 'failed',
        tesseract: tesseractWorking ? 'working' : 'failed'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}