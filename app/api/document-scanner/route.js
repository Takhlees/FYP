import { NextResponse } from 'next/server';
import sharp from 'sharp';
import Tesseract from 'tesseract.js';
import { PDFDocument } from 'pdf-lib';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

class DocumentScanner {
  
  static async enhanceDocument(imageInput, options = {}) {
    try {
      const {
        targetWidth = 1654,
        targetHeight = 2339,
        quality = 'high'
      } = options;
      
      let pipeline;
      
      if (Buffer.isBuffer(imageInput)) {
        pipeline = sharp(imageInput);
      } else if (typeof imageInput === 'string') {
        pipeline = sharp(imageInput);
      } else {
        throw new Error('Invalid input type');
      }
      
      try {
        pipeline = pipeline
          .resize(targetWidth, targetHeight, {
            fit: 'inside',
            background: { r: 255, g: 255, b: 255, alpha: 1 },
            kernel: sharp.kernel.lanczos3
          })
          .grayscale()
          .normalize();
        
        if (quality === 'high') {
          pipeline = pipeline
            .linear(1.3, -15)
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
        
        const enhancedBuffer = await pipeline
          .threshold(120)
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
      
      if (Buffer.isBuffer(imageInput)) {
        return {
          buffer: imageInput,
          size: imageInput.length,
          dimensions: { width: 800, height: 600 },
          format: 'original'
        };
      }
      
      throw new Error(`Enhancement failed: ${error.message}`);
    }
  }
  
  static async extractTextWithVision(imageBuffer) {
    try {
      const startTime = Date.now();
      
      const ocrPromise = Tesseract.recognize(imageBuffer, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            
          }
        },
        tessedit_pageseg_mode: '1',
        preserve_interword_spaces: '1',
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?@#$%^&*()_+-=[]{}|;\':"<>?/~` \n\r\t',
        tessedit_do_invert: '0',
        textord_heavy_nr: '1',
        textord_min_linesize: '2.0',
        textord_old_baselines: '0',
        textord_old_xheight: '0',
        textord_min_xheight: '8',
        textord_force_make_prop_words: 'F',
        textord_use_cjk_fp_model: 'F'
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('OCR timeout after 30 seconds')), 30000);
      });

      const { data } = await Promise.race([ocrPromise, timeoutPromise]);
      
      const processingTime = (Date.now() - startTime) / 1000;
      
      let cleanedText = data.text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]+/g, ' ')
        .replace(/[ \t]+\n/g, '\n')
        .trim();
      
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
      
      try {
        return await this.extractTextWithPreprocessing(imageBuffer);
      } catch (preprocessError) {
        console.error('Preprocessing OCR also failed:', preprocessError);
        
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
  
  static async extractTextWithPreprocessing(imageBuffer) {
    try {
      const preprocessedBuffer = await sharp(imageBuffer)
        .grayscale()
        .normalize()
        .sharpen()
        .threshold(128)
        .png()
        .toBuffer();
      
      const startTime = Date.now();
      
      const { data } = await Tesseract.recognize(preprocessedBuffer, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            
          }
        },
        tessedit_pageseg_mode: '1',
        preserve_interword_spaces: '1',
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?@#$%^&*()_+-=[]{}|;\':"<>?/~` \n\r\t',
        tessedit_do_invert: '0',
        textord_heavy_nr: '1',
        textord_min_linesize: '2.0',
        textord_old_baselines: '0',
        textord_old_xheight: '0',
        textord_min_xheight: '8',
        textord_force_make_prop_words: 'F',
        textord_use_cjk_fp_model: 'F'
      });
      
      const processingTime = (Date.now() - startTime) / 1000;
      
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
  
    static async processPDF(pdfBuffer) {
    try {
      const pdfParse = (await import('pdf-parse')).default;
      
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
        console.error('Standard PDF parsing failed:', parseError.message);
      }
      
      try {
        const pdfData = await pdfParse(pdfBuffer, {
          max: 0,
          version: 'v2.0.550'
        });
        
        if (pdfData.text && pdfData.text.trim().length > 0) {
          return {
            text: pdfData.text.trim(),
            confidence: 85, 
            pagesProcessed: pdfData.numpages,
            wordCount: pdfData.text.split(/\s+/).length,
            characterCount: pdfData.text.length,
            method: 'pdf-parse-enhanced'
          };
        }
      } catch (enhancedError) {
        console.error('Enhanced PDF parsing failed:', enhancedError.message);
      }
      
      try {
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const pageCount = pdfDoc.getPageCount();
        
        if (pageCount > 0) {
          
          try {
            const scannedResult = await DocumentScanner.processScannedPDF(pdfBuffer);
            if (scannedResult.text && scannedResult.text.trim().length > 0) {
              return scannedResult;
            }
                      } catch (scannedError) {
            console.error('Scanned PDF processing failed:', scannedError.message);
          }
          
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
        console.error('PDF structure analysis failed:', structureError.message);
      }
      
      return { text: '', confidence: 0, pagesProcessed: 0, wordCount: 0, characterCount: 0, method: 'failed' };
      
    } catch (error) {
      console.error('PDF processing failed:', error);
      return { text: '', confidence: 0, pagesProcessed: 0, wordCount: 0, characterCount: 0, method: 'error', error: error.message };
    }
  }
  
  static async processScannedPDF(pdfBuffer) {
    try {
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
        console.error('Enhanced PDF parsing failed:', parseError.message);
      }

        try {
          const pdfjsLib = await import('pdfjs-dist');
          
          const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
          pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
          
          const loadingTask = pdfjsLib.getDocument({ 
            data: DocumentScanner.convertBufferToUint8Array(pdfBuffer),
            maxImageSize: -1,
            cMapUrl: null,
            cMapPacked: true
          });
          
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('PDF loading timeout')), 30000);
          });
          
          const pdfDocument = await Promise.race([loadingTask.promise, timeoutPromise]);
          
          let allText = '';
          let totalConfidence = 0;
          let processedPages = 0;
          
          for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
            try {
              const page = await pdfDocument.getPage(pageNum);
              const viewport = page.getViewport({ scale: 2.0 });
              
              const canvas = new (await import('canvas')).Canvas(viewport.width, viewport.height);
              const context = canvas.getContext('2d');
              
              const renderContext = {
                canvasContext: context,
                viewport: viewport
              };
              
              await page.render(renderContext).promise;
              
              const imageBuffer = canvas.toBuffer('image/png');
              
              const enhancedImage = await DocumentScanner.enhanceDocument(imageBuffer, {
                quality: 'high',
                targetWidth: 1654,
                targetHeight: 2339
              });
              
              const ocrResult = await DocumentScanner.extractTextWithPreprocessing(enhancedImage.buffer);
              
              if (ocrResult.text && ocrResult.text.trim().length > 0) {
                allText += (allText ? '\n\n' : '') + ocrResult.text.trim();
                totalConfidence += ocrResult.confidence || 0;
                processedPages++;
              }
              
                          } catch (pageError) {
                console.error('Error processing PDF page:', pageError.message);
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
            console.error('pdfjs-dist conversion failed:', pdfjsError.message);
          }
        
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
          console.error('PDF structure analysis failed:', structureError.message);
        }
        
      return { text: '', confidence: 0, pagesProcessed: 0, wordCount: 0, characterCount: 0 };
      
    } catch (error) {
      console.error('Scanned PDF processing failed:', error);
      return { text: '', confidence: 0, pagesProcessed: 0, wordCount: 0, characterCount: 0, error: error.message };
    }
  }
  
  static extractSubjectFromText(text) {
    if (!text || text.trim().length === 0) {
      return '';
    }
    
    const searchableText = text
      .replace(/[ \t]+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();
    
    const subjectPatterns = [
      /subject\s*:\s*([^]*?)(?=\n\s*(?:from|to|date|ref|cc|bcc|sent|received|time|reply|forward|attachment|enclosure|regarding|attn|attention|dear|sincerely|regards|yours|phone|fax|email|mobile)\s*:|$)/i,
      /subj\s*:\s*([^]*?)(?=\n\s*(?:from|to|date|ref|cc|bcc|sent|received|time|reply|forward|attachment|enclosure|regarding|attn|attention|dear|sincerely|regards|yours|phone|fax|email|mobile)\s*:|$)/i,
      /re\s*:\s*([^]*?)(?=\n\s*(?:from|to|date|ref|cc|bcc|sent|received|time|reply|forward|attachment|enclosure|regarding|attn|attention|dear|sincerely|regards|yours|phone|fax|email|mobile)\s*:|$)/i,
      
      /subject\s*:\s*([^\n\r]+)/i,
      /subj\s*:\s*([^\n\r]+)/i,
      /re\s*:\s*([^\n\r]+)/i,
      
      /subject\s*line\s*:\s*([^\n\r]+)/i,
      /subject\s*field\s*:\s*([^\n\r]+)/i,
      
      /^(?!from|to|date|ref|cc|bcc|sent|received|time|reply|forward|attachment|enclosure|regarding|attn|attention|dear|sincerely|regards|yours|phone|fax|email|mobile)[^:\n\r]{5,50}$/im
    ];
    
    for (const pattern of subjectPatterns) {
      const match = searchableText.match(pattern);
      if (match && match[1] && match[1].trim().length > 0) {
        let subject = match[1].trim();
        
        subject = subject
          .replace(/\n+/g, ' ')
          .replace(/[ \t]+/g, ' ')
          .replace(/[.,;!?]+$/, '')
          .trim();
        
        if (subject.length < 3 || subject.length > 200) {
          continue;
        }
        
        const finalSubject = subject.length > 150 ? subject.substring(0, 150) + '...' : subject;
        
        return finalSubject;
      }
    }
    
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      if (/^(from|to|date|ref|cc|bcc|sent|received|time|reply|forward|attachment|enclosure|regarding|attn|attention|dear|sincerely|regards|yours|phone|fax|email|mobile):/i.test(line)) {
        continue;
      }
      if (line.length < 5 || /^\d+[\/\-\.]\d+[\/\-\.]\d+/.test(line)) {
        continue;
      }
      
      const finalSubject = line.length > 150 ? line.substring(0, 150) + '...' : line;
      return finalSubject;
    }
    
    return '';
  }

  static extractSubject(text) {
    const specificSubject = this.extractSubjectFromText(text);
    if (specificSubject) {
      return specificSubject;
    }
    
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
          return placeholderBuffer;
        } catch (placeholderError) {
          console.error('Placeholder creation also failed:', placeholderError.message);
          
          // Method 3: Try the simple PDF preview method
          try {
            const simplePreview = await DocumentScanner.createSimplePDFPreview(pdfBuffer);
            if (simplePreview) {
              return simplePreview;
            }
          } catch (simpleError) {
            console.error('Simple PDF preview also failed:', simpleError.message);
          }
          
          // Final Fallback: "No preview available" image
          console.error('All specific preview methods failed. Creating generic "no preview" image.');
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
      
      return imageBuffer;
      
    } catch (error) {
      console.error('PDF preview image creation failed:', error);
      
      // Try simple preview as fallback
      try {
        const simplePreview = await DocumentScanner.createSimplePDFPreview(pdfBuffer);
        if (simplePreview) {
          console.error('Created simple PDF preview after error');
          return simplePreview;
        }
      } catch (simpleError) {
        console.error('Simple PDF preview also failed after error:', simpleError.message);
      }
      
      // Final Fallback: "No preview available" image
      console.error('All preview methods failed. Creating generic "no preview" image.');
      return await DocumentScanner.createNoPreviewImage();
    }
  }
  
  // Create a simple placeholder image when canvas is not available
  static async createPlaceholderImage(width, height) {
    try {
      
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
      
      return placeholderBuffer;
      
    } catch (error) {
      console.error('Placeholder image creation failed:', error);
      return null;
    }
  }
  
  // Alternative method: Create a simple PDF preview without complex rendering
  static async createSimplePDFPreview(pdfBuffer) {
    try {
      
      // Get basic PDF info without complex rendering
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const pageCount = pdfDoc.getPageCount();
      
      if (pageCount === 0) {
        console.error('PDF has no pages');
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
      
      return previewBuffer;
      
    } catch (error) {
      console.error('Simple PDF preview creation failed:', error);
      return null;
    }
  }

  // Create a "No preview available" image as ultimate fallback
  static async createNoPreviewImage() {
    try {
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
  try {
    
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
    
    
    const startTime = Date.now();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    

    
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
            subject: extractedSubject,
            legacySubject: DocumentScanner.extractSubject(pdfResult.text),
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
            console.error('PDF preview creation failed after error, using fallback:', previewError.message);
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
          console.error('Creating fallback PDF preview...');
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
            console.error('Fallback PDF preview failed:', fallbackError.message);
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
        let enhancedResult = null;
        
        if (action === 'enhance_only' || action === 'enhance_and_extract') {
          enhancedResult = await DocumentScanner.enhanceDocument(buffer, { quality });
          
          result.enhancement = {
            originalSize: file.size,
            enhancedSize: enhancedResult.size,
            compressionRatio: (file.size / enhancedResult.size).toFixed(2),
            dimensions: enhancedResult.dimensions,
            format: enhancedResult.format
          };
        }
        
        // Step 2: Extract text using OCR
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
      
      const errorMessage = 'Document processing failed';
      
      return NextResponse.json(
        {
          error: errorMessage,
          details: processingError.message,
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
  }
}

export async function GET() {
  try {
    const testBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    
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
        'Subject extraction for scan forms',
        'PDF generation'
      ],
      supportedFormats: ['JPEG', 'PNG', 'PDF'],
      ocrEngine: 'tesseract.js',
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