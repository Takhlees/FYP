// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import Webcam from "react-webcam";
// import { jsPDF } from "jspdf";
// import { useDropzone } from "react-dropzone";
// import {
//   ZoomIn,
//   ZoomOut,
//   Camera,
//   Focus,
//   X,
//   Check,
//   Zap,
//   ZapOff,
//   FileText,
//   Copy,
//   ChevronRight,
//   ArrowLeft,
//   Loader2,
//   RotateCcw,
//   UploadCloud,
//   RefreshCw,
//   AlertCircle,
// } from "lucide-react";

// // Notification Component
// const Notification = ({ type, message, onDismiss }) => {
//   return (
//     <div
//       className={`fixed top-4 left-4 right-4 z-50 flex items-center p-3 rounded-md shadow-lg mx-auto max-w-sm ${
//         type === "success"
//           ? "bg-green-100 text-green-800"
//           : type === "error"
//           ? "bg-red-100 text-red-800"
//           : "bg-blue-100 text-blue-800"
//       }`}
//     >
//       <div className="flex-shrink-0 mr-2">
//         {type === "success" ? (
//           <Check className="w-4 h-4" />
//         ) : type === "error" ? (
//           <X className="w-4 h-4" />
//         ) : (
//           <Loader2 className="w-4 h-4 animate-spin" />
//         )}
//       </div>
//       <div className="text-sm flex-1">{message}</div>
//       {onDismiss && (
//         <button
//           onClick={onDismiss}
//           className="ml-2 text-gray-500 hover:text-gray-700"
//         >
//           <X className="w-4 h-4" />
//         </button>
//       )}
//     </div>
//   );
// };

// // Enhanced document processing to create PDF-quality document optimized for OCR
// const autoEnhanceDocument = async (imageData) => {
//   return new Promise((resolve) => {
//     if (!imageData) {
//       console.error("No image data provided to autoEnhanceDocument");
//       resolve(imageData);
//       return;
//     }

//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.onload = async () => {
//       try {
//         // Validate image dimensions
//         if (img.width === 0 || img.height === 0) {
//           console.error("Invalid image dimensions");
//           resolve(imageData);
//           return;
//         }

//         // Step 1: Create high-resolution A4-sized canvas for better OCR
//         const A4_RATIO = 297 / 210; // Height / Width
//         const TARGET_WIDTH = 2480; // A4 width at 300 DPI for better OCR
//         const TARGET_HEIGHT = Math.round(TARGET_WIDTH * A4_RATIO); // A4 height at 300 DPI

//         const a4Canvas = document.createElement("canvas");
//         a4Canvas.width = TARGET_WIDTH;
//         a4Canvas.height = TARGET_HEIGHT;
//         const a4Ctx = a4Canvas.getContext("2d");

//         // Fill with pure white background
//         a4Ctx.fillStyle = "#FFFFFF";
//         a4Ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

//         // Step 2: Detect document boundaries
//         const documentBounds = await detectDocumentBounds(img);

//         // Step 3: Transform and fit document to A4 canvas with high quality
//         await transformToA4Document(
//           img,
//           a4Ctx,
//           documentBounds,
//           TARGET_WIDTH,
//           TARGET_HEIGHT
//         );

//         // Step 4: Create PDF-quality enhancement optimized for OCR
//         const enhancedCanvas = await createPDFQualityDocument(a4Canvas);

//         // Convert to high-quality data URL
//         const enhancedDataUrl = enhancedCanvas.toDataURL("image/png", 1.0);
//         resolve(enhancedDataUrl);
//       } catch (error) {
//         console.error("Auto enhancement error:", error);
//         resolve(imageData);
//       }
//     };
//     img.onerror = (error) => {
//       console.error("Image loading error:", error);
//       resolve(imageData);
//     };
//     img.src = imageData;
//   });
// };

// // Create PDF-quality document with optimal OCR preprocessing
// const createPDFQualityDocument = async (canvas) => {
//   if (!canvas) {
//     console.error("No canvas provided to createPDFQualityDocument");
//     return canvas;
//   }

//   const ctx = canvas.getContext("2d");
//   if (!ctx) {
//     console.error("Could not get 2D context from canvas");
//     return canvas;
//   }

//   let imageData;
//   try {
//     imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//   } catch (error) {
//     console.error("Error getting image data from canvas:", error);
//     return canvas;
//   }

//   if (!imageData || !imageData.data) {
//     console.error("Failed to get valid image data");
//     return canvas;
//   }

//   const enhancedCanvas = document.createElement("canvas");
//   enhancedCanvas.width = canvas.width;
//   enhancedCanvas.height = canvas.height;
//   const enhancedCtx = enhancedCanvas.getContext("2d");

//   const preprocessedData = await advancedOCRPreprocessing(imageData);

//   // Step 2: Apply optimal binarization using Otsu's method
//   const binarizedData = await applyOtsuBinarization(preprocessedData);

//   // Step 3: Advanced morphological operations for text clarity
//   const cleanedData = await advancedMorphologicalCleaning(
//     binarizedData,
//     canvas.width,
//     canvas.height
//   );

//   // Step 4: Text sharpening and edge enhancement
//   const sharpenedData = await enhanceTextEdges(
//     cleanedData,
//     canvas.width,
//     canvas.height
//   );

//   const finalImageData = enhancedCtx.createImageData(
//     canvas.width,
//     canvas.height
//   );
//   finalImageData.data.set(sharpenedData);
//   enhancedCtx.putImageData(finalImageData, 0, 0);

//   // Add subtle PDF-like styling
//   addPDFStyling(enhancedCtx, canvas.width, canvas.height);

//   return enhancedCanvas;
// };

// // Advanced OCR preprocessing with multiple filters
// const advancedOCRPreprocessing = async (imageData) => {
//   if (!imageData || !imageData.data) {
//     console.error("Invalid imageData provided to advancedOCRPreprocessing");
//     return imageData;
//   }

//   const { width, height, data } = imageData;
//   if (!data || data.length === 0) {
//     console.error("ImageData has no data array");
//     return imageData;
//   }

//   const result = new Uint8ClampedArray(imageData.data.length);

//   // Convert to grayscale with enhanced contrast
//   for (let i = 0; i < imageData.data.length; i += 4) {
//     const r = imageData.data[i];
//     const g = imageData.data[i + 1];
//     const b = imageData.data[i + 2];

//     // Use weighted grayscale conversion optimized for text
//     const gray = 0.299 * r + 0.587 * g + 0.114 * b;

//     // Apply gamma correction for better contrast
//     const gamma = 0.8;
//     const corrected = 255 * Math.pow(gray / 255, gamma);

//     // Enhance contrast using histogram stretching
//     const enhanced = Math.min(255, Math.max(0, (corrected - 128) * 1.5 + 128));

//     result[i] = enhanced;
//     result[i + 1] = enhanced;
//     result[i + 2] = enhanced;
//     result[i + 3] = imageData.data[i + 3];
//   }

//   // Apply Gaussian blur to reduce noise before binarization
//   return applyAdvancedGaussianBlur(result, width, height);
// };

// // Advanced Gaussian blur with edge preservation
// const applyAdvancedGaussianBlur = (data, width, height) => {
//   const result = new Uint8ClampedArray(data.length);
//   const kernel = [
//     1, 4, 7, 4, 1, 4, 16, 26, 16, 4, 7, 26, 41, 26, 7, 4, 16, 26, 16, 4, 1, 4,
//     7, 4, 1,
//   ];
//   const kernelSum = 273;
//   const kernelSize = 5;
//   const half = Math.floor(kernelSize / 2);

//   for (let y = half; y < height - half; y++) {
//     for (let x = half; x < width - half; x++) {
//       let sum = 0;
//       let kernelIndex = 0;

//       for (let ky = -half; ky <= half; ky++) {
//         for (let kx = -half; kx <= half; kx++) {
//           const idx = ((y + ky) * width + (x + kx)) * 4;
//           sum += data[idx] * kernel[kernelIndex];
//           kernelIndex++;
//         }
//       }

//       const idx = (y * width + x) * 4;
//       const blurred = Math.round(sum / kernelSum);
//       result[idx] = result[idx + 1] = result[idx + 2] = blurred;
//       result[idx + 3] = data[idx + 3];
//     }
//   }

//   return result;
// };

// // Otsu's binarization for optimal threshold selection
// const applyOtsuBinarization = async (imageData) => {
//   if (!imageData || !imageData.data) {
//     console.error("Invalid imageData provided to applyOtsuBinarization");
//     return imageData;
//   }

//   const { width, height, data } = imageData;
//   if (!data || data.length === 0) {
//     console.error("ImageData has no data array");
//     return imageData;
//   }

//   const result = new Uint8ClampedArray(imageData.data.length);

//   // Calculate histogram
//   const histogram = new Array(256).fill(0);
//   for (let i = 0; i < imageData.data.length; i += 4) {
//     histogram[imageData.data[i]]++;
//   }

//   // Calculate total number of pixels
//   const total = width * height;

//   // Calculate Otsu's threshold
//   let sum = 0;
//   for (let i = 0; i < 256; i++) {
//     sum += i * histogram[i];
//   }

//   let sumB = 0;
//   let wB = 0;
//   let wF = 0;
//   let varMax = 0;
//   let threshold = 0;

//   for (let i = 0; i < 256; i++) {
//     wB += histogram[i];
//     if (wB === 0) continue;

//     wF = total - wB;
//     if (wF === 0) break;

//     sumB += i * histogram[i];
//     const mB = sumB / wB;
//     const mF = (sum - sumB) / wF;

//     const varBetween = wB * wF * (mB - mF) * (mB - mF);

//     if (varBetween > varMax) {
//       varMax = varBetween;
//       threshold = i;
//     }
//   }

//   // Apply adaptive threshold with local adjustments
//   for (let y = 0; y < height; y++) {
//     for (let x = 0; x < width; x++) {
//       const idx = (y * width + x) * 4;
//       const gray = imageData.data[idx];

//       // Calculate local threshold adjustment
//       const localThreshold = calculateLocalThreshold(
//         imageData.data,
//         x,
//         y,
//         width,
//         height,
//         threshold
//       );

//       // Apply threshold with slight bias towards white for cleaner text
//       const binarized = gray > localThreshold ? 255 : 0;

//       result[idx] = binarized;
//       result[idx + 1] = binarized;
//       result[idx + 2] = binarized;
//       result[idx + 3] = imageData.data[idx + 3];
//     }
//   }

//   return result;
// };

// // Calculate local threshold for adaptive binarization
// const calculateLocalThreshold = (
//   data,
//   x,
//   y,
//   width,
//   height,
//   globalThreshold
// ) => {
//   const windowSize = 15;
//   const half = Math.floor(windowSize / 2);
//   let sum = 0;
//   let count = 0;

//   for (let dy = -half; dy <= half; dy++) {
//     for (let dx = -half; dx <= half; dx++) {
//       const nx = x + dx;
//       const ny = y + dy;

//       if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
//         const idx = (ny * width + nx) * 4;
//         sum += data[idx];
//         count++;
//       }
//     }
//   }

//   const localMean = sum / count;
//   const localThreshold = localMean * 0.85; // Slightly below local mean

//   // Blend global and local thresholds
//   return Math.round(globalThreshold * 0.7 + localThreshold * 0.3);
// };

// // Advanced morphological operations for text cleaning
// const advancedMorphologicalCleaning = async (data, width, height) => {
//   // Step 1: Remove small noise with opening operation
//   let cleaned = morphologicalOpening(data, width, height);

//   // Step 2: Fill small gaps in text with closing operation
//   cleaned = morphologicalClosing(cleaned, width, height);

//   // Step 3: Remove isolated pixels
//   cleaned = removeIsolatedPixels(cleaned, width, height);

//   // Step 4: Strengthen text strokes
//   cleaned = strengthenTextStrokes(cleaned, width, height);

//   return cleaned;
// };

// // Morphological opening (erosion followed by dilation)
// const morphologicalOpening = (data, width, height) => {
//   const eroded = morphologicalErosion(data, width, height, 1);
//   return morphologicalDilation(eroded, width, height, 1);
// };

// // Morphological closing (dilation followed by erosion)
// const morphologicalClosing = (data, width, height) => {
//   const dilated = morphologicalDilation(data, width, height, 1);
//   return morphologicalErosion(dilated, width, height, 1);
// };

// // Morphological erosion
// const morphologicalErosion = (data, width, height, iterations) => {
//   const result = new Uint8ClampedArray(data);

//   for (let iter = 0; iter < iterations; iter++) {
//     const temp = new Uint8ClampedArray(result);

//     for (let y = 1; y < height - 1; y++) {
//       for (let x = 1; x < width - 1; x++) {
//         const idx = (y * width + x) * 4;

//         // Check 3x3 neighborhood
//         let minValue = 255;
//         for (let dy = -1; dy <= 1; dy++) {
//           for (let dx = -1; dx <= 1; dx++) {
//             const nIdx = ((y + dy) * width + (x + dx)) * 4;
//             minValue = Math.min(minValue, temp[nIdx]);
//           }
//         }

//         result[idx] = result[idx + 1] = result[idx + 2] = minValue;
//         result[idx + 3] = temp[idx + 3];
//       }
//     }
//   }

//   return result;
// };

// // Morphological dilation
// const morphologicalDilation = (data, width, height, iterations) => {
//   const result = new Uint8ClampedArray(data);

//   for (let iter = 0; iter < iterations; iter++) {
//     const temp = new Uint8ClampedArray(result);

//     for (let y = 1; y < height - 1; y++) {
//       for (let x = 1; x < width - 1; x++) {
//         const idx = (y * width + x) * 4;

//         // Check 3x3 neighborhood
//         let maxValue = 0;
//         for (let dy = -1; dy <= 1; dy++) {
//           for (let dx = -1; dx <= 1; dx++) {
//             const nIdx = ((y + dy) * width + (x + dx)) * 4;
//             maxValue = Math.max(maxValue, temp[nIdx]);
//           }
//         }

//         result[idx] = result[idx + 1] = result[idx + 2] = maxValue;
//         result[idx + 3] = temp[idx + 3];
//       }
//     }
//   }

//   return result;
// };

// // Remove isolated pixels (noise)
// const removeIsolatedPixels = (data, width, height) => {
//   const result = new Uint8ClampedArray(data);

//   for (let y = 1; y < height - 1; y++) {
//     for (let x = 1; x < width - 1; x++) {
//       const idx = (y * width + x) * 4;

//       if (data[idx] === 0) {
//         // Black pixel
//         // Count black neighbors
//         let blackNeighbors = 0;
//         for (let dy = -1; dy <= 1; dy++) {
//           for (let dx = -1; dx <= 1; dx++) {
//             if (dx === 0 && dy === 0) continue;
//             const nIdx = ((y + dy) * width + (x + dx)) * 4;
//             if (data[nIdx] === 0) blackNeighbors++;
//           }
//         }

//         // If isolated (less than 2 black neighbors), make it white
//         if (blackNeighbors < 2) {
//           result[idx] = result[idx + 1] = result[idx + 2] = 255;
//         }
//       }
//     }
//   }

//   return result;
// };

// // Strengthen text strokes for better OCR
// const strengthenTextStrokes = (data, width, height) => {
//   const result = new Uint8ClampedArray(data);

//   for (let y = 1; y < height - 1; y++) {
//     for (let x = 1; x < width - 1; x++) {
//       const idx = (y * width + x) * 4;

//       if (data[idx] === 255) {
//         // White pixel
//         // Count black neighbors
//         let blackNeighbors = 0;
//         for (let dy = -1; dy <= 1; dy++) {
//           for (let dx = -1; dx <= 1; dx++) {
//             if (dx === 0 && dy === 0) continue;
//             const nIdx = ((y + dy) * width + (x + dx)) * 4;
//             if (data[nIdx] === 0) blackNeighbors++;
//           }
//         }

//         // If surrounded by black pixels (likely inside text), make it black
//         if (blackNeighbors >= 6) {
//           result[idx] = result[idx + 1] = result[idx + 2] = 0;
//         }
//       }
//     }
//   }

//   return result;
// };

// // Enhance text edges for crisp appearance
// const enhanceTextEdges = async (data, width, height) => {
//   const result = new Uint8ClampedArray(data);

//   // Apply unsharp masking for text sharpening
//   const blurred = applyGaussianBlurForSharpening(data, width, height);

//   for (let i = 0; i < data.length; i += 4) {
//     const original = data[i];
//     const blurredValue = blurred[i];

//     // Unsharp mask formula: original + amount * (original - blurred)
//     const amount = 1.5;
//     const sharpened = Math.min(
//       255,
//       Math.max(0, original + amount * (original - blurredValue))
//     );

//     // Ensure pure black or white for text
//     const enhanced = sharpened > 127 ? 255 : 0;

//     result[i] = enhanced;
//     result[i + 1] = enhanced;
//     result[i + 2] = enhanced;
//     result[i + 3] = data[i + 3];
//   }

//   return result;
// };

// // Gaussian blur for sharpening (smaller kernel)
// const applyGaussianBlurForSharpening = (data, width, height) => {
//   const result = new Uint8ClampedArray(data.length);
//   const kernel = [1, 2, 1, 2, 4, 2, 1, 2, 1];
//   const kernelSum = 16;

//   for (let y = 1; y < height - 1; y++) {
//     for (let x = 1; x < width - 1; x++) {
//       let sum = 0;
//       let kernelIndex = 0;

//       for (let ky = -1; ky <= 1; ky++) {
//         for (let kx = -1; kx <= 1; kx++) {
//           const idx = ((y + ky) * width + (x + kx)) * 4;
//           sum += data[idx] * kernel[kernelIndex];
//           kernelIndex++;
//         }
//       }

//       const idx = (y * width + x) * 4;
//       const blurred = Math.round(sum / kernelSum);
//       result[idx] = result[idx + 1] = result[idx + 2] = blurred;
//       result[idx + 3] = data[idx + 3];
//     }
//   }

//   return result;
// };

// // Add PDF-like styling
// const addPDFStyling = (ctx, width, height) => {
//   // Add very subtle drop shadow for depth
//   const shadowOffset = 3;
//   const shadowBlur = 6;

//   ctx.save();
//   ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
//   ctx.shadowBlur = shadowBlur;
//   ctx.shadowOffsetX = shadowOffset;
//   ctx.shadowOffsetY = shadowOffset;

//   // Draw a subtle border
//   ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
//   ctx.lineWidth = 1;
//   ctx.strokeRect(0, 0, width, height);

//   ctx.restore();
// };

// // Detect document boundaries using advanced edge detection
// const detectDocumentBounds = async (img) => {
//   const tempCanvas = document.createElement("canvas");
//   tempCanvas.width = img.width;
//   tempCanvas.height = img.height;
//   const tempCtx = tempCanvas.getContext("2d");
//   tempCtx.drawImage(img, 0, 0);

//   const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
//   const { width, height, data } = imageData;

//   // Convert to grayscale
//   const grayData = new Uint8Array(width * height);
//   for (let i = 0; i < data.length; i += 4) {
//     const gray = Math.round(
//       0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
//     );
//     grayData[i / 4] = gray;
//   }

//   // Apply Gaussian blur
//   const blurred = applyGaussianBlur(grayData, width, height);

//   // Find edges using Canny edge detection
//   const edges = cannyEdgeDetection(blurred, width, height);

//   // Find document contour
//   const documentCorners = findDocumentCorners(edges, width, height);

//   if (documentCorners && documentCorners.length === 4) {
//     return sortCornersClockwise(documentCorners);
//   }

//   // Fallback: use image bounds with slight perspective
//   const margin = Math.min(width, height) * 0.05;
//   return [
//     { x: margin, y: margin },
//     { x: width - margin, y: margin },
//     { x: width - margin, y: height - margin },
//     { x: margin, y: height - margin },
//   ];
// };

// // Apply Gaussian blur for noise reduction
// const applyGaussianBlur = (data, width, height) => {
//   const kernel = [1, 2, 1, 2, 4, 2, 1, 2, 1];
//   const kernelSum = 16;
//   const result = new Uint8Array(width * height);

//   for (let y = 1; y < height - 1; y++) {
//     for (let x = 1; x < width - 1; x++) {
//       let sum = 0;
//       let kernelIndex = 0;

//       for (let ky = -1; ky <= 1; ky++) {
//         for (let kx = -1; kx <= 1; kx++) {
//           const pixelIndex = (y + ky) * width + (x + kx);
//           sum += data[pixelIndex] * kernel[kernelIndex];
//           kernelIndex++;
//         }
//       }

//       result[y * width + x] = Math.round(sum / kernelSum);
//     }
//   }

//   return result;
// };

// // Canny edge detection
// const cannyEdgeDetection = (data, width, height) => {
//   const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
//   const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

//   const gradientX = new Float32Array(width * height);
//   const gradientY = new Float32Array(width * height);
//   const magnitude = new Float32Array(width * height);

//   // Calculate gradients
//   for (let y = 1; y < height - 1; y++) {
//     for (let x = 1; x < width - 1; x++) {
//       let gx = 0,
//         gy = 0;

//       for (let ky = -1; ky <= 1; ky++) {
//         for (let kx = -1; kx <= 1; kx++) {
//           const idx = (y + ky) * width + (x + kx);
//           const kernelIdx = (ky + 1) * 3 + (kx + 1);
//           gx += data[idx] * sobelX[kernelIdx];
//           gy += data[idx] * sobelY[kernelIdx];
//         }
//       }

//       const idx = y * width + x;
//       gradientX[idx] = gx;
//       gradientY[idx] = gy;
//       magnitude[idx] = Math.sqrt(gx * gx + gy * gy);
//     }
//   }

//   // Apply thresholding
//   const edges = new Uint8Array(width * height);
//   const highThreshold = 80;
//   const lowThreshold = 40;

//   for (let y = 1; y < height - 1; y++) {
//     for (let x = 1; x < width - 1; x++) {
//       const idx = y * width + x;
//       const mag = magnitude[idx];

//       if (mag > highThreshold) {
//         edges[idx] = 255;
//       } else if (mag > lowThreshold) {
//         // Check if connected to strong edge
//         let hasStrongNeighbor = false;
//         for (let dy = -1; dy <= 1; dy++) {
//           for (let dx = -1; dx <= 1; dx++) {
//             const nIdx = (y + dy) * width + (x + dx);
//             if (magnitude[nIdx] > highThreshold) {
//               hasStrongNeighbor = true;
//               break;
//             }
//           }
//           if (hasStrongNeighbor) break;
//         }
//         if (hasStrongNeighbor) edges[idx] = 255;
//       }
//     }
//   }

//   return edges;
// };

// // Find document corners using Hough transform and contour analysis
// const findDocumentCorners = (edges, width, height) => {
//   // Find lines using simplified Hough transform
//   const lines = findLines(edges, width, height);

//   if (lines.length >= 4) {
//     // Find intersections of lines to get corners
//     const corners = findLineIntersections(lines, width, height);

//     if (corners.length >= 4) {
//       // Filter and select the best 4 corners that form a quadrilateral
//       return selectBestQuadrilateral(corners, width, height);
//     }
//   }

//   // Fallback: find corners using contour analysis
//   return findCornersFromContours(edges, width, height);
// };

// // Simplified Hough transform to find lines
// const findLines = (edges, width, height) => {
//   const lines = [];
//   const rhoMax = Math.sqrt(width * width + height * height);
//   const rhoStep = 2;
//   const thetaStep = Math.PI / 180; // 1 degree
//   const threshold = Math.min(width, height) * 0.3;

//   const accumulator = new Map();

//   // Hough transform
//   for (let y = 0; y < height; y++) {
//     for (let x = 0; x < width; x++) {
//       if (edges[y * width + x] === 255) {
//         for (let theta = 0; theta < Math.PI; theta += thetaStep) {
//           const rho = x * Math.cos(theta) + y * Math.sin(theta);
//           const rhoIndex = Math.round(rho / rhoStep);
//           const thetaIndex = Math.round(theta / thetaStep);
//           const key = `${rhoIndex},${thetaIndex}`;

//           accumulator.set(key, (accumulator.get(key) || 0) + 1);
//         }
//       }
//     }
//   }

//   // Find peaks in accumulator
//   for (const [key, votes] of accumulator) {
//     if (votes > threshold) {
//       const [rhoIndex, thetaIndex] = key.split(",").map(Number);
//       const rho = rhoIndex * rhoStep;
//       const theta = thetaIndex * thetaStep;
//       lines.push({ rho, theta, votes });
//     }
//   }

//   // Sort by votes and return top lines
//   return lines.sort((a, b) => b.votes - a.votes).slice(0, 10);
// };

// // Find intersections between lines
// const findLineIntersections = (lines, width, height) => {
//   const intersections = [];

//   for (let i = 0; i < lines.length; i++) {
//     for (let j = i + 1; j < lines.length; j++) {
//       const line1 = lines[i];
//       const line2 = lines[j];

//       // Calculate intersection point
//       const cos1 = Math.cos(line1.theta);
//       const sin1 = Math.sin(line1.theta);
//       const cos2 = Math.cos(line2.theta);
//       const sin2 = Math.sin(line2.theta);

//       const det = cos1 * sin2 - sin1 * cos2;
//       if (Math.abs(det) > 0.1) {
//         // Lines are not parallel
//         const x = (sin2 * line1.rho - sin1 * line2.rho) / det;
//         const y = (cos1 * line2.rho - cos2 * line1.rho) / det;

//         // Check if intersection is within image bounds
//         if (x >= 0 && x < width && y >= 0 && y < height) {
//           intersections.push({ x, y });
//         }
//       }
//     }
//   }

//   return intersections;
// };

// // Select the best 4 corners that form a quadrilateral
// const selectBestQuadrilateral = (corners, width, height) => {
//   if (corners.length < 4) return corners;

//   // Find the 4 corners that are most likely to be document corners
//   // by finding corners that are roughly at the corners of the image
//   const imageCenter = { x: width / 2, y: height / 2 };

//   // Divide into quadrants and find the corner closest to each quadrant
//   const quadrants = [
//     { x: width * 0.25, y: height * 0.25 }, // Top-left
//     { x: width * 0.75, y: height * 0.25 }, // Top-right
//     { x: width * 0.75, y: height * 0.75 }, // Bottom-right
//     { x: width * 0.25, y: height * 0.75 }, // Bottom-left
//   ];

//   const selectedCorners = [];

//   for (const quadrant of quadrants) {
//     let closestCorner = null;
//     let minDistance = Number.POSITIVE_INFINITY;

//     for (const corner of corners) {
//       const distance = Math.sqrt(
//         Math.pow(corner.x - quadrant.x, 2) + Math.pow(corner.y - quadrant.y, 2)
//       );
//       if (distance < minDistance) {
//         minDistance = distance;
//         closestCorner = corner;
//       }
//     }

//     if (closestCorner) {
//       selectedCorners.push(closestCorner);
//     }
//   }

//   return selectedCorners.length === 4 ? selectedCorners : corners.slice(0, 4);
// };

// // Fallback method to find corners from contours
// const findCornersFromContours = (edges, width, height) => {
//   // Find the largest contour
//   const contours = findContours(edges, width, height);

//   if (contours.length > 0) {
//     const largestContour = contours.reduce((max, contour) =>
//       contour.length > max.length ? contour : max
//     );

//     // Approximate contour to polygon
//     const epsilon = 0.02 * calculatePerimeter(largestContour);
//     const approx = approximatePolygon(largestContour, epsilon);

//     if (approx.length >= 4) {
//       return approx.slice(0, 4);
//     }
//   }

//   // Final fallback: use image corners with slight inset
//   const margin = Math.min(width, height) * 0.05;
//   return [
//     { x: margin, y: margin },
//     { x: width - margin, y: margin },
//     { x: width - margin, y: height - margin },
//     { x: margin, y: height - margin },
//   ];
// };

// // Find contours in edge image
// const findContours = (edges, width, height) => {
//   const contours = [];
//   const visited = new Uint8Array(width * height);

//   for (let y = 0; y < height; y++) {
//     for (let x = 0; x < width; x++) {
//       const idx = y * width + x;
//       if (edges[idx] === 255 && !visited[idx]) {
//         const contour = traceContour(edges, visited, x, y, width, height);
//         if (contour.length > 100) {
//           // Minimum contour size
//           contours.push(contour);
//         }
//       }
//     }
//   }

//   return contours.sort((a, b) => b.length - a.length); // Sort by size
// };

// // Trace contour starting from a point
// const traceContour = (edges, visited, startX, startY, width, height) => {
//   const contour = [];
//   const stack = [{ x: startX, y: startY }];

//   while (stack.length > 0) {
//     const { x, y } = stack.pop();
//     const idx = y * width + x;

//     if (
//       x < 0 ||
//       x >= width ||
//       y < 0 ||
//       y >= height ||
//       visited[idx] ||
//       edges[idx] !== 255
//     ) {
//       continue;
//     }

//     visited[idx] = 1;
//     contour.push({ x, y });

//     // Add 8-connected neighbors
//     for (let dy = -1; dy <= 1; dy++) {
//       for (let dx = -1; dx <= 1; dx++) {
//         if (dx === 0 && dy === 0) continue;
//         stack.push({ x: x + dx, y: y + dy });
//       }
//     }
//   }

//   return contour;
// };

// // Calculate perimeter of contour
// const calculatePerimeter = (contour) => {
//   let perimeter = 0;
//   for (let i = 0; i < contour.length; i++) {
//     const current = contour[i];
//     const next = contour[(i + 1) % contour.length];
//     const dx = next.x - current.x;
//     const dy = next.y - current.y;
//     perimeter += Math.sqrt(dx * dx + dy * dy);
//   }
//   return perimeter;
// };

// // Approximate polygon using Douglas-Peucker algorithm
// const approximatePolygon = (contour, epsilon) => {
//   if (contour.length < 3) return contour;

//   const start = contour[0];
//   const end = contour[contour.length - 1];
//   let maxDistance = 0;
//   let maxIndex = 0;

//   for (let i = 1; i < contour.length - 1; i++) {
//     const distance = pointToLineDistance(contour[i], start, end);
//     if (distance > maxDistance) {
//       maxDistance = distance;
//       maxIndex = i;
//     }
//   }

//   if (maxDistance > epsilon) {
//     const left = approximatePolygon(contour.slice(0, maxIndex + 1), epsilon);
//     const right = approximatePolygon(contour.slice(maxIndex), epsilon);
//     return [...left.slice(0, -1), ...right];
//   } else {
//     return [start, end];
//   }
// };

// // Calculate distance from point to line
// const pointToLineDistance = (point, lineStart, lineEnd) => {
//   const A = lineEnd.y - lineStart.y;
//   const B = lineStart.x - lineEnd.x;
//   const C = lineEnd.x * lineStart.y - lineStart.x * lineEnd.y;
//   return Math.abs(A * point.x + B * point.y + C) / Math.sqrt(A * A + B * B);
// };

// // Sort corners in clockwise order starting from top-left
// const sortCornersClockwise = (corners) => {
//   if (corners.length !== 4) return corners;

//   // Find center point
//   const centerX = corners.reduce((sum, p) => sum + p.x, 0) / 4;
//   const centerY = corners.reduce((sum, p) => sum + p.y, 0) / 4;

//   // Sort by angle from center
//   const sorted = corners
//     .map((corner) => ({
//       ...corner,
//       angle: Math.atan2(corner.y - centerY, corner.x - centerX),
//     }))
//     .sort((a, b) => a.angle - b.angle);

//   // Find top-left corner (minimum x + y)
//   const topLeft = sorted.reduce((min, p) =>
//     p.x + p.y < min.x + min.y ? p : min
//   );
//   const startIndex = sorted.indexOf(topLeft);

//   // Return in clockwise order: top-left, top-right, bottom-right, bottom-left
//   return [
//     sorted[startIndex],
//     sorted[(startIndex + 1) % 4],
//     sorted[(startIndex + 2) % 4],
//     sorted[(startIndex + 3) % 4],
//   ];
// };

// // Transform document to fit A4 canvas with proper perspective correction
// const transformToA4Document = async (
//   sourceImg,
//   a4Ctx,
//   corners,
//   targetWidth,
//   targetHeight
// ) => {
//   // Create transformation matrix for perspective correction
//   const srcCorners = corners;
//   const dstCorners = [
//     { x: 0, y: 0 },
//     { x: targetWidth, y: 0 },
//     { x: targetWidth, y: targetHeight },
//     { x: 0, y: targetHeight },
//   ];

//   // Apply perspective transformation using homography
//   try {
//     const matrix = calculateHomography(srcCorners, dstCorners);
//     applyHomographyTransform(
//       sourceImg,
//       a4Ctx,
//       matrix,
//       targetWidth,
//       targetHeight
//     );
//   } catch (error) {
//     console.error(
//       "Perspective transformation failed, using simple scaling:",
//       error
//     );
//     // Fallback: simple scaling and centering
//     const scale =
//       Math.min(targetWidth / sourceImg.width, targetHeight / sourceImg.height) *
//       0.95;
//     const offsetX = (targetWidth - sourceImg.width * scale) / 2;
//     const offsetY = (targetHeight - sourceImg.height * scale) / 2;
//     a4Ctx.drawImage(
//       sourceImg,
//       offsetX,
//       offsetY,
//       sourceImg.width * scale,
//       sourceImg.height * scale
//     );
//   }
// };

// // Calculate homography matrix for perspective transformation
// const calculateHomography = (src, dst) => {
//   // Simplified homography calculation
//   // For a more robust implementation, you would use DLT (Direct Linear Transform)

//   const scaleX = (dst[1].x - dst[0].x) / (src[1].x - src[0].x);
//   const scaleY = (dst[3].y - dst[0].y) / (src[3].y - src[0].y);
//   const translateX = dst[0].x - src[0].x * scaleX;
//   const translateY = dst[0].y - src[0].y * scaleY;

//   return {
//     a: scaleX,
//     b: 0,
//     c: translateX,
//     d: 0,
//     e: scaleY,
//     f: translateY,
//     g: 0,
//     h: 0,
//     i: 1,
//   };
// };

// // Apply homography transformation
// const applyHomographyTransform = (sourceImg, ctx, matrix, width, height) => {
//   // For simplicity, use canvas transform
//   ctx.save();
//   ctx.setTransform(matrix.a, matrix.d, matrix.b, matrix.e, matrix.c, matrix.f);
//   ctx.drawImage(sourceImg, 0, 0);
//   ctx.restore();
// };

// const ScanUpload = ({ fileData, action, onClose }) => {
//   // State for step-by-step workflow
//   const [currentStep, setCurrentStep] = useState(0);

//   const isUploadMode = action === "Upload";
//   const isScanMode = action === "Scan";

//   // State declarations
//   const [type, setType] = useState(fileData?.type || "");
//   const [file, setFile] = useState(fileData?.file || null);
//   const [fileName, setFileName] = useState(fileData?.file?.name || "");
//   const [departments, setDepartments] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState(
//     fileData?.department || ""
//   );
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(
//     fileData?.category || ""
//   );
//   const [subject, setSubject] = useState(fileData?.subject || "");
//   const [date, setDate] = useState(
//     fileData?.date || new Date().toISOString().split("T")[0]
//   );
//   const [diaryNo, setDiaryNo] = useState(fileData?.diaryNo || "");
//   const [from, setFrom] = useState(fileData?.from || "");
//   const [disposal, setDisposal] = useState(fileData?.disposal || "");
//   const [status, setStatus] = useState(fileData?.status || "");

//   // Camera and image processing states
//   const [processedImage, setProcessedImage] = useState(null); // For upload mode
//   const [enhancedImage, setEnhancedImage] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [cameraFacingMode, setCameraFacingMode] = useState("environment");
//   const [isFocusing, setIsFocusing] = useState(false);
//   const [hasCameraPermission, setHasCameraPermission] = useState(null);
//   const [isTorchAvailable, setIsTorchAvailable] = useState(false);
//   const [isTorchOn, setIsTorchOn] = useState(false);
//   const [isAutoFocusEnabled, setIsAutoFocusEnabled] = useState(true);
//   const [cameraTrack, setCameraTrack] = useState(null);
//   const [extractedText, setExtractedText] = useState("");
//   const [isExtracting, setIsExtracting] = useState(false);
//   const [extractionFailed, setExtractionFailed] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [notification, setNotification] = useState(null);
//   const [isCameraActive, setIsCameraActive] = useState(false);

//   // Refs
//   const webcamRef = useRef(null);
//   const videoRef = useRef(null);

//   // Helper function to show notifications
//   const showNotification = useCallback((type, message, duration = 3000) => {
//     setNotification({ type, message });
//     if (duration) {
//       setTimeout(() => {
//         setNotification(null);
//       }, duration);
//     }
//   }, []);

//   // Fetch departments when type changes
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       if (!type) return;

//       try {
//         const response = await fetch(`/api/department?type=${type}`, {
//           method: "GET",
//         });
//         if (!response.ok)
//           throw new Error(`HTTP error! status: ${response.status}`);
//         const data = await response.json();
//         setDepartments(data);
//       } catch (error) {
//         console.error("Failed to fetch departments", error);
//         showNotification("error", "Failed to load departments");
//       }
//     };

//     if (type) fetchDepartments();
//   }, [type, showNotification]);

//   // Update categories when department changes
//   useEffect(() => {
//     if (selectedDepartment) {
//       const department = departments.find(
//         (dept) => dept._id === selectedDepartment
//       );
//       setCategories(department?.categories || []);
//     }
//   }, [selectedDepartment, departments]);

//   // Clean up camera on unmount
//   useEffect(() => {
//     return () => {
//       if (cameraTrack) {
//         cameraTrack.stop();
//       }
//     };
//   }, [cameraTrack]);

//   // Turn off torch/flash
//   const turnOffTorch = useCallback(async () => {
//     if (cameraTrack && isTorchAvailable && isTorchOn) {
//       try {
//         await cameraTrack.applyConstraints({
//           advanced: [{ torch: false }],
//         });
//         setIsTorchOn(false);
//       } catch (error) {
//         console.error("Error turning off torch:", error);
//       }
//     }
//   }, [cameraTrack, isTorchAvailable, isTorchOn]);

//   // Request camera permission and start camera
//   const startCamera = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: cameraFacingMode,
//           width: { ideal: 1920, min: 1280 },
//           height: { ideal: 1080, min: 720 },
//         },
//       });

//       setHasCameraPermission(true);
//       setIsCameraActive(true);
//       setCurrentStep(0);

//       // Initialize camera features after a short delay
//       setTimeout(() => {
//         initializeCamera();
//       }, 500);
//     } catch (error) {
//       console.error("Camera access error:", error);
//       setHasCameraPermission(false);
//       showNotification(
//         "error",
//         "Camera access denied. Please allow camera access and try again."
//       );
//     }
//   }, [cameraFacingMode]);

//   // Initialize camera features
//   const initializeCamera = useCallback(async () => {
//     try {
//       if (webcamRef.current && webcamRef.current.video) {
//         const stream = webcamRef.current.video.srcObject;

//         if (stream) {
//           const videoTrack = stream.getVideoTracks()[0];
//           setCameraTrack(videoTrack);

//           const capabilities = videoTrack.getCapabilities
//             ? videoTrack.getCapabilities()
//             : {};
//           setIsTorchAvailable(capabilities.torch || false);

//           // Apply auto-focus if available
//           if (
//             capabilities.focusMode &&
//             capabilities.focusMode.includes("continuous")
//           ) {
//             try {
//               await videoTrack.applyConstraints({
//                 advanced: [{ focusMode: "continuous" }],
//               });
//             } catch (error) {
//               console.log("Auto-focus not supported");
//             }
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error initializing camera:", error);
//     }
//   }, []);

//   //download specific
//   // Enhanced document processing for upload mode
//   const enhanceDocumentForReadability = async (imageData) => {
//     return new Promise((resolve) => {
//       const img = new Image();
//       img.crossOrigin = "anonymous";
//       img.onload = async () => {
//         try {
//           const canvas = document.createElement("canvas");
//           canvas.width = img.width;
//           canvas.height = img.height;
//           const ctx = canvas.getContext("2d");

//           // Draw original image
//           ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

//           // Get image data for processing
//           let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

//           // Apply gentle enhancement
//           imgData = clearBackgroundAndEnhanceText(imgData);

//           ctx.putImageData(imgData, 0, 0);
//           resolve(canvas.toDataURL("image/jpeg", 0.9));
//         } catch (error) {
//           console.error("Image processing error:", error);
//           resolve(imageData);
//         }
//       };
//       img.src = imageData;
//     });
//   };

//   const clearBackgroundAndEnhanceText = (imageData) => {
//     const data = new Uint8ClampedArray(imageData.data);
//     const width = imageData.width;
//     const height = imageData.height;
//     const result = new Uint8ClampedArray(data.length);

//     // First pass: identify background color (most common color)
//     const colorCounts = {};
//     for (let i = 0; i < data.length; i += 4) {
//       const r = data[i];
//       const g = data[i + 1];
//       const b = data[i + 2];
//       const key = `${r},${g},${b}`;
//       colorCounts[key] = (colorCounts[key] || 0) + 1;
//     }

//     // Find most common color (background)
//     const backgroundKey = Object.keys(colorCounts).reduce((a, b) =>
//       colorCounts[a] > colorCounts[b] ? a : b
//     );
//     const [bgR, bgG, bgB] = backgroundKey.split(",").map(Number);

//     // Second pass: enhance contrast between text and background
//     for (let i = 0; i < data.length; i += 4) {
//       const r = data[i];
//       const g = data[i + 1];
//       const b = data[i + 2];

//       // Calculate distance from background color
//       const dist = Math.sqrt(
//         Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
//       );

//       // If pixel is significantly different from background (likely text)
//       if (dist > 50) {
//         // Slightly darken text pixels for better contrast
//         result[i] = Math.max(0, r * 0.9);
//         result[i + 1] = Math.max(0, g * 0.9);
//         result[i + 2] = Math.max(0, b * 0.9);
//       } else {
//         // Lighten background pixels
//         result[i] = Math.min(255, bgR * 1.1);
//         result[i + 1] = Math.min(255, bgG * 1.1);
//         result[i + 2] = Math.min(255, bgB * 1.1);
//       }
//       result[i + 3] = data[i + 3]; // Preserve alpha
//     }

//     return new ImageData(result, width, height);
//   };

//   // Updated text extraction function for upload mode
//   const extractTextFromDocument = async (file) => {
//     setIsExtracting(true);
//     setExtractionFailed(false);

//     try {
//       showNotification("info", "Extracting text from document...", 0);

//       let extractedText = "";

//       if (file.type === "application/pdf") {
//         // Handle PDF files
//         await loadLibraries();

//         const arrayBuffer = await file.arrayBuffer();
//         const typedArray = new Uint8Array(arrayBuffer);

//         showNotification("info", "Loading PDF...", 0);
//         const pdf = await window.pdfjsLib.getDocument({ data: typedArray })
//           .promise;

//         let fullText = "";
//         const totalPages = pdf.numPages;

//         for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
//           showNotification(
//             "info",
//             `Processing page ${pageNum} of ${totalPages}...`,
//             0
//           );

//           const page = await pdf.getPage(pageNum);

//           // First try to extract text directly
//           const textContent = await page.getTextContent();
//           let pageText = textContent.items
//             .map((item) => item.str)
//             .join(" ")
//             .trim();

//           // If no text found or very little text, use OCR
//           if (!pageText || pageText.length < 50) {
//             showNotification("info", `OCR processing page ${pageNum}...`, 0);

//             // Render page as canvas for OCR
//             const viewport = page.getViewport({ scale: 2.0 });
//             const canvas = document.createElement("canvas");
//             const context = canvas.getContext("2d");
//             canvas.height = viewport.height;
//             canvas.width = viewport.width;

//             await page.render({
//               canvasContext: context,
//               viewport: viewport,
//             }).promise;

//             // Convert canvas to image and run OCR
//             const imageData = canvas.toDataURL("image/png");

//             try {
//               const {
//                 data: { text },
//               } = await window.Tesseract.recognize(imageData, "eng", {
//                 logger: (m) => {
//                   if (m.status === "recognizing text") {
//                     const ocrProgress = Math.round(m.progress * 100);
//                     showNotification(
//                       "info",
//                       `OCR processing page ${pageNum}: ${ocrProgress}%`,
//                       0
//                     );
//                   }
//                 },
//               });
//               pageText = text.trim();
//             } catch (ocrError) {
//               console.warn(`OCR failed for page ${pageNum}:`, ocrError);
//               pageText = pageText || `[OCR failed for page ${pageNum}]`;
//             }
//           }

//           if (pageText) {
//             fullText += `--- Page ${pageNum} ---\n${pageText}\n\n`;
//           }
//         }

//         extractedText = fullText;
//       } else if (file.type.startsWith("image/")) {
//         // Handle image files with OCR
//         await loadLibraries();

//         showNotification("info", "Processing image with OCR...", 0);

//         const imageUrl = URL.createObjectURL(file);

//         try {
//           const {
//             data: { text },
//           } = await window.Tesseract.recognize(imageUrl, "eng", {
//             logger: (m) => {
//               if (m.status === "recognizing text") {
//                 const ocrProgress = Math.round(m.progress * 100);
//                 showNotification("info", `OCR processing: ${ocrProgress}%`, 0);
//               }
//             },
//           });
//           extractedText = text.trim();
//         } finally {
//           URL.revokeObjectURL(imageUrl);
//         }
//       } else {
//         throw new Error(
//           "Unsupported file type. Please use PDF or image files."
//         );
//       }

//       setExtractedText(extractedText || "");
//       setExtractionFailed(false);

//       if (extractedText && !subject) {
//         const extractedSubject = extractSubject(extractedText);
//         if (extractedSubject) {
//           setSubject(extractedSubject);
//         }
//       }

//       showNotification("success", "Text extracted successfully");
//       return extractedText;
//     } catch (error) {
//       console.error("Text extraction failed:", error);
//       setExtractionFailed(true);
//       showNotification("error", `Text extraction failed: ${error.message}`);
//       return "";
//     } finally {
//       setIsExtracting(false);
//     }
//   };

//   // Handle file change for upload mode
//   const handleFileChange = useCallback(async (file) => {
//     if (!file) return;

//     setIsProcessing(true);
//     setFile(file);
//     setFileName(file.name);

//     try {
//       // For images, enhance for display
//       if (file.type.startsWith("image/")) {
//         const reader = new FileReader();
//         reader.onload = async (e) => {
//           const enhanced = await enhanceDocumentForReadability(e.target.result);
//           setProcessedImage(enhanced);
//         };
//         reader.readAsDataURL(file);
//       } else if (file.type === "application/pdf") {
//         setProcessedImage("/placeholder.svg");
//       }

//       // Extract text from uploaded file
//       await extractTextFromDocument(file);
//     } catch (error) {
//       console.error("File processing error:", error);
//       showNotification("error", `File processing failed: ${error.message}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   }, []);

//   // Dropzone config (for upload mode)
//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop: (acceptedFiles) => {
//       const file = acceptedFiles[0];
//       if (file) handleFileChange(file);
//     },
//     accept: {
//       "application/pdf": [".pdf"],
//       "image/*": [".png", ".jpg", ".jpeg"],
//     },
//     maxSize: 10485760, // 10MB limit
//     multiple: false,
//     onDropRejected: (fileRejections) => {
//       if (fileRejections.length > 0) {
//         const { errors } = fileRejections[0];
//         if (errors[0]?.code === "file-too-large") {
//           showNotification("error", "File is too large. Maximum size is 10MB.");
//         } else {
//           showNotification(
//             "error",
//             "Invalid file. Please upload a PDF or image file."
//           );
//         }
//       }
//     },
//   });

//   // Toggle torch
//   const toggleTorch = useCallback(async () => {
//     if (!cameraTrack || !isTorchAvailable) return;

//     try {
//       await cameraTrack.applyConstraints({
//         advanced: [{ torch: !isTorchOn }],
//       });
//       setIsTorchOn(!isTorchOn);
//     } catch (error) {
//       console.error("Error toggling torch:", error);
//       showNotification("error", "Unable to control flash");
//     }
//   }, [cameraTrack, isTorchAvailable, isTorchOn, showNotification]);

//   // Toggle auto focus
//   const toggleAutoFocus = useCallback(async () => {
//     if (!cameraTrack) return;

//     try {
//       const newAutoFocusState = !isAutoFocusEnabled;
//       await cameraTrack.applyConstraints({
//         advanced: [{ focusMode: newAutoFocusState ? "continuous" : "manual" }],
//       });
//       setIsAutoFocusEnabled(newAutoFocusState);
//     } catch (error) {
//       console.error("Error toggling auto-focus:", error);
//     }
//   }, [cameraTrack, isAutoFocusEnabled]);

//   // Capture and process image
//   // const captureAndProcess = useCallback(async () => {
//   //   if (!webcamRef.current) return;

//   //   setIsProcessing(true);
//   //   showNotification("info", "Creating A4 document...", 0);

//   //   try {
//   //     // Capture with highest quality
//   //     const imageSrc = webcamRef.current.getScreenshot({
//   //       width: 1920,
//   //       height: 1080,
//   //       screenshotFormat: "image/jpeg",
//   //       screenshotQuality: 1.0,
//   //     });

//   //     if (!imageSrc) throw new Error("Failed to capture image");

//   //     // Validate the captured image
//   //     if (typeof imageSrc !== "string" || !imageSrc.startsWith("data:image/")) {
//   //       throw new Error("Invalid image data captured");
//   //     }

//   //     // Turn off flash immediately after capture
//   //     await turnOffTorch();

//   //     // Stop camera
//   //     if (cameraTrack) {
//   //       cameraTrack.stop();
//   //       setCameraTrack(null);
//   //     }
//   //     setIsCameraActive(false);

//   //     // Enhance the image to create proper A4 document
//   //     const enhanced = await autoEnhanceDocument(imageSrc);

//   //     if (!enhanced) {
//   //       throw new Error("Failed to enhance document");
//   //     }

//   //     setEnhancedImage(enhanced);

//   //     // Convert to file
//   //     const response = await fetch(enhanced);
//   //     if (!response.ok) {
//   //       throw new Error("Failed to convert enhanced image to blob");
//   //     }

//   //     const blob = await response.blob();
//   //     const imageFile = new File([blob], `a4_scan_${Date.now()}.png`, {
//   //       type: "image/png",
//   //     });
//   //     setFile(imageFile);
//   //     setFileName(`a4_scan_${Date.now()}.png`);

//   //     // Move to next step
//   //     setCurrentStep(1);
//   //     showNotification("success", "A4 document created successfully!");
//   //   } catch (error) {
//   //     console.error("Capture error:", error);
//   //     showNotification("error", `Capture failed: ${error.message}`);
//   //   } finally {
//   //     setIsProcessing(false);
//   //   }
//   // }, [cameraTrack, showNotification, turnOffTorch]);

//   const captureAndProcess = useCallback(async () => {
//     if (!webcamRef.current) return;

//     setIsProcessing(true);
//     showNotification("info", "Creating A4 document...", 0);

//     try {
//       // Capture with highest quality
//       const imageSrc = webcamRef.current.getScreenshot({
//         width: 1920,
//         height: 1080,
//         screenshotFormat: "image/jpeg",
//         screenshotQuality: 1.0,
//       });

//       if (!imageSrc) throw new Error("Failed to capture image");

//       // Validate the captured image
//       if (typeof imageSrc !== "string" || !imageSrc.startsWith("data:image/")) {
//         throw new Error("Invalid image data captured");
//       }

//       // Turn off flash immediately after capture
//       await turnOffTorch();

//       // Stop camera
//       if (cameraTrack) {
//         cameraTrack.stop();
//         setCameraTrack(null);
//       }
//       setIsCameraActive(false);

//       // Enhance the image to create proper A4 document
//       const enhanced = await autoEnhanceDocument(imageSrc);

//       if (!enhanced) {
//         throw new Error("Failed to enhance document");
//       }

//       setEnhancedImage(enhanced);

//       // Convert to file
//       const response = await fetch(enhanced);
//       if (!response.ok) {
//         throw new Error("Failed to convert enhanced image to blob");
//       }

//       const blob = await response.blob();
//       const imageFile = new File([blob], `a4_scan_${Date.now()}.png`, {
//         type: "image/png",
//       });
//       setFile(imageFile);
//       setFileName(`a4_scan_${Date.now()}.png`);

//       showNotification("success", "A4 document created successfully!");

//       // Automatically start text extraction and go directly to form
//       await extractTextAndGoToForm(enhanced);

//     } catch (error) {
//       console.error("Capture error:", error);
//       showNotification("error", `Capture failed: ${error.message}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [cameraTrack, showNotification, turnOffTorch]);

//   // Extract text from enhanced image with optimal OCR settings
//   const extractText = useCallback(async () => {
//     if (!enhancedImage) return;

//     setIsExtracting(true);
//     setExtractionFailed(false);

//     try {
//       showNotification(
//         "info",
//         "Extracting text from PDF-quality document...",
//         0
//       );

//       await loadLibraries();

//       const {
//         data: { text },
//       } = await window.Tesseract.recognize(enhancedImage, "eng", {
//         logger: (m) => {
//           if (m.status === "recognizing text") {
//             const ocrProgress = Math.round(m.progress * 100);
//             showNotification("info", `OCR processing: ${ocrProgress}%`, 0);
//           }
//         },
//         tessedit_pageseg_mode: window.Tesseract.PSM.SINGLE_BLOCK,
//         tessedit_ocr_engine_mode: window.Tesseract.OEM.LSTM_ONLY,
//         tessedit_char_whitelist:
//           "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?@#$%^&*()_+-=[]{}|;':\"<>?/~` \n\r\t",
//         preserve_interword_spaces: "1",
//         tessedit_do_invert: "0",
//         tessedit_create_hocr: "0",
//         tessedit_create_tsv: "0",
//         user_defined_dpi: "300",
//       });

//       setExtractedText(text.trim() || "");

//       if (text.trim()) {
//         const extractedSubject = extractSubject(text.trim());
//         if (extractedSubject && !subject) {
//           setSubject(extractedSubject);
//         }
//       }

//       setCurrentStep(2);
//       showNotification("success", "Text extracted with high accuracy!");
//     } catch (error) {
//       console.error("Text extraction failed:", error);
//       setExtractionFailed(true);
//       showNotification("error", `Text extraction failed: ${error.message}`);
//     } finally {
//       setIsExtracting(false);
//     }
//   }, [
//     enhancedImage,
//     subject,
//     showNotification,
//     setExtractedText,
//     setSubject,
//     setCurrentStep,
//   ]);

//   const extractTextAndGoToForm = useCallback(async (enhancedImageSrc) => {
//     if (!enhancedImageSrc) return;

//     setIsExtracting(true);
//     setExtractionFailed(false);

//     try {
//       showNotification("info", "Extracting text and preparing form...", 0);

//       await loadLibraries();

//       const {
//         data: { text },
//       } = await window.Tesseract.recognize(enhancedImageSrc, "eng", {
//         logger: (m) => {
//           if (m.status === "recognizing text") {
//             const ocrProgress = Math.round(m.progress * 100);
//             showNotification("info", `Processing: ${ocrProgress}%`, 0);
//           }
//         },
//         tessedit_pageseg_mode: window.Tesseract.PSM.SINGLE_BLOCK,
//         tessedit_ocr_engine_mode: window.Tesseract.OEM.LSTM_ONLY,
//         tessedit_char_whitelist:
//           "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?@#$%^&*()_+-=[]{}|;':\"<>?/~` \n\r\t",
//         preserve_interword_spaces: "1",
//         tessedit_do_invert: "0",
//         tessedit_create_hocr: "0",
//         tessedit_create_tsv: "0",
//         user_defined_dpi: "300",
//       });

//       setExtractedText(text.trim() || "");

//       // Auto-fill subject if text was extracted and subject is empty
//       if (text.trim()) {
//         const extractedSubject = extractSubject(text.trim());
//         if (extractedSubject && !subject) {
//           setSubject(extractedSubject);
//         }
//       }

//       // Go directly to form completion step (step 3)
//       setCurrentStep(3);
//       showNotification("success", "Text extracted! Complete the form below.");

//     } catch (error) {
//       console.error("Text extraction failed:", error);
//       setExtractionFailed(true);
//       // On failure, go to step 1 to show enhanced image and manual options
//       setCurrentStep(1);
//       showNotification("error", "Text extraction failed. Please complete the form manually.");
//     } finally {
//       setIsExtracting(false);
//     }
//   }, [subject, showNotification, setExtractedText, setSubject, setCurrentStep]);

//   // Enhanced subject extraction
//   const extractSubject = (text) => {
//     if (!text) return "Document";

//     const lines = text.split("\n").filter((line) => line.trim().length > 0);

//     const subjectPatterns = [
//       /\b(?:subject|re|regarding|sub|topic|matter)[:;]\s*(.*)/i,
//       /\b(?:sub|subj)[-:]?\s*(.*)/i,
//       /\b(?:regarding|ref|reference)[:;]\s*(.*)/i,
//     ];

//     for (const line of lines) {
//       for (const pattern of subjectPatterns) {
//         const match = line.match(pattern);
//         if (match && match[1] && match[1].trim().length > 0) {
//           return match[1].trim();
//         }
//       }
//     }

//     for (const line of lines) {
//       const trimmedLine = line.trim();
//       if (trimmedLine.length === 0) continue;
//       if (/^\d{1,2}[/\-.]\d{1,2}[/\-.]\d{2,4}/.test(trimmedLine)) continue;
//       if (
//         /^[A-Za-z0-9\s,]+,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}/.test(trimmedLine)
//       )
//         continue;
//       if (
//         /^(to|from|date|ref|reference|through|copy to|cc|bcc|attachment[s]?|enclosure[s]?):/i.test(
//           trimmedLine
//         )
//       )
//         continue;

//       if (trimmedLine.length > 10) {
//         return trimmedLine.substring(0, 100);
//       }
//     }

//     return lines.length > 0 ? lines[0].trim().substring(0, 100) : "Document";
//   };

//   // Load libraries
//   const loadLibraries = async () => {
//     if (typeof window !== "undefined") {
//       if (!window.pdfjsLib) {
//         const pdfScript = document.createElement("script");
//         pdfScript.src =
//           "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
//         document.head.appendChild(pdfScript);

//         await new Promise((resolve) => {
//           pdfScript.onload = () => {
//             window.pdfjsLib.GlobalWorkerOptions.workerSrc =
//               "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
//             resolve(true);
//           };
//         });
//       }

//       if (!window.Tesseract) {
//         const tesseractScript = document.createElement("script");
//         tesseractScript.src =
//           "https://unpkg.com/tesseract.js@4.1.1/dist/tesseract.min.js";
//         document.head.appendChild(tesseractScript);

//         await new Promise((resolve) => {
//           tesseractScript.onload = resolve;
//         });
//       }
//     }
//   };

//   // Copy text to clipboard
//   const copyToClipboard = useCallback(() => {
//     if (!extractedText) return;

//     navigator.clipboard
//       .writeText(extractedText)
//       .then(() => showNotification("success", "Text copied!"))
//       .catch(() => showNotification("error", "Failed to copy text"));
//   }, [extractedText, showNotification]);

//   // Toggle camera facing mode
//   const toggleCameraFacing = useCallback(() => {
//     setCameraFacingMode((prev) =>
//       prev === "environment" ? "user" : "environment"
//     );
//   }, []);

//   // Zoom controls
//   const increaseZoom = useCallback(
//     () => setZoomLevel((prev) => Math.min(prev + 0.2, 3)),
//     []
//   );
//   const decreaseZoom = useCallback(
//     () => setZoomLevel((prev) => Math.max(prev - 0.2, 1)),
//     []
//   );

//   // Form submission
//   const handleSubmit = useCallback(
//     async (e) => {
//       e.preventDefault();
//       setIsLoading(true);

//       // Update validation to check for either file OR enhancedImage
//       if (
//         (!file && !enhancedImage) ||
//         !selectedDepartment ||
//         !subject ||
//         !diaryNo ||
//         !from ||
//         !disposal ||
//         !status
//       ) {
//         showNotification("error", "Please fill all required fields");
//         setIsLoading(false);
//         return;
//       }

//       const formData = new FormData();

//       try {
//         // Handle different file sources based on mode
//         if (enhancedImage) {
//           // Scan mode: use enhancedImage (A4 processed scan)
//           const pdfBlob = await convertImageToPdf(enhancedImage);
//           const finalFileName = fileName || subject || "a4_scanned_document";
//           formData.append("file", pdfBlob, `${finalFileName}.pdf`);
//           formData.append("fileName", finalFileName);
//         } else if (file) {
//           // Upload mode: handle different file types
//           if (file.type === "application/pdf") {
//             // PDF files go directly
//             formData.append("file", file);
//             formData.append(
//               "fileName",
//               fileName || subject || "uploaded_document"
//             );
//           } else if (file.type.startsWith("image/")) {
//             // Images get converted to PDF
//             const imageUrl = processedImage || URL.createObjectURL(file);
//             const pdfBlob = await convertImageToPdf(imageUrl);
//             const finalFileName = fileName || subject || "uploaded_image";
//             formData.append("file", pdfBlob, `${finalFileName}.pdf`);
//             formData.append("fileName", finalFileName);
//           } else {
//             throw new Error("Unsupported file type");
//           }
//         } else {
//           throw new Error("No file or scan data available");
//         }

//         formData.append("type", type);
//         formData.append("department", selectedDepartment);
//         formData.append("category", selectedCategory);
//         formData.append("subject", subject);
//         formData.append("date", date);
//         formData.append("diaryNo", diaryNo);
//         formData.append("from", from);
//         formData.append("disposal", disposal);
//         formData.append("status", status);
//         formData.append("extractedText", extractedText);

//         const method = fileData ? "PUT" : "POST";
//         const url = fileData
//           ? `/api/scanupload/${fileData._id}`
//           : "/api/scanupload";

//         showNotification("info", "Saving document...", 0);

//         const response = await fetch(url, { method, body: formData });

//         setNotification(null);

//         if (!response.ok) {
//           let errorMessage = "HTTP error";
//           try {
//             const errorData = await response.json();
//             errorMessage =
//               errorData.error || `HTTP error! status: ${response.status}`;
//           } catch (parseError) {
//             errorMessage = `HTTP error! status: ${response.status}`;
//           }
//           throw new Error(errorMessage);
//         }

//         let data;
//         try {
//           data = await response.json();
//         } catch (parseError) {
//           throw new Error("Invalid response from server");
//         }

//         showNotification("success", "Document saved successfully!");

//         setTimeout(() => {
//           onClose();
//         }, 1500);
//       } catch (error) {
//         console.error("Upload error:", error);
//         showNotification("error", `Upload failed: ${error.message}`);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [
//       file,
//       enhancedImage,
//       processedImage, // Add this for upload mode
//       selectedDepartment,
//       subject,
//       diaryNo,
//       from,
//       disposal,
//       status,
//       fileName,
//       type,
//       selectedCategory,
//       date,
//       extractedText,
//       fileData,
//       showNotification,
//       onClose,
//     ]
//   );

//   // UPLOAD MODE RENDER
//   if (isUploadMode) {
//     return (
//       <div className="bg-zinc-800 p-10">
//         {notification && (
//           <Notification
//             type={notification.type}
//             message={notification.message}
//             onDismiss={() => setNotification(null)}
//           />
//         )}

//         <div className="bg-white p-6 rounded-lg max-w-4xl mx-auto">
//           <h2 className="text-3xl text-center font-semibold mb-6">
//             {action} Form
//           </h2>

//           <div className="mb-4">
//             <h3 className="text-lg font-semibold mb-3">Document Upload</h3>

//             <div className="flex flex-col gap-2 w-full">
//               <div
//                 {...getRootProps()}
//                 className={`flex flex-col items-center justify-center w-full p-4 border-2 border-dashed bg-gray-100 rounded-lg cursor-pointer transition-all ${
//                   isDragActive
//                     ? "border-blue-500 bg-gray-200"
//                     : "border-gray-400"
//                 }`}
//                 style={{ minHeight: "160px" }}
//               >
//                 <input {...getInputProps()} />
//                 <UploadCloud size={36} className="text-gray-500 mb-2" />
//                 {isDragActive ? (
//                   <p className="text-lg font-semibold text-blue-600">
//                     Drop your file here...
//                   </p>
//                 ) : (
//                   <p className="text-gray-700 text-center">
//                     Drag & Drop your PDF or Image here or{" "}
//                     <span className="text-blue-500 font-medium">
//                       click to browse
//                     </span>
//                   </p>
//                 )}
//               </div>

//               {file && (
//                 <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       {file.type === "application/pdf" ? (
//                         <FileText className="w-5 h-5 mr-3 text-red-500" />
//                       ) : (
//                         <img
//                           src={URL.createObjectURL(file)}
//                           alt="Thumbnail"
//                           className="w-8 h-8 mr-3 object-cover rounded"
//                         />
//                       )}
//                       <div>
//                         <p className="font-medium text-sm">{fileName}</p>
//                         <p className="text-xs text-gray-500">
//                           {(file.size / 1024).toFixed(1)} KB
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setFile(null);
//                         setFileName("");
//                         setProcessedImage(null);
//                         setExtractedText("");
//                       }}
//                       className="text-gray-500 hover:text-red-500"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {processedImage && !file && (
//                 <div className="mt-3">
//                   <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
//                     <img
//                       src={processedImage || "/placeholder.svg"}
//                       alt="Processed document"
//                       className="w-full h-auto max-h-56 object-contain mx-auto"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setProcessedImage(null);
//                         setExtractedText("");
//                       }}
//                       className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
//                     >
//                       <X className="w-4 h-4 text-gray-600" />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Form fields section */}
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Type *</label>
//               <select
//                 value={type}
//                 onChange={(e) => setType(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//                 required
//               >
//                 <option value="">Select Type</option>
//                 <option value="uni">University</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Department *
//               </label>
//               <select
//                 value={selectedDepartment}
//                 onChange={(e) => setSelectedDepartment(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//                 required
//               >
//                 <option value="">Select Department</option>
//                 {departments.map((dept) => (
//                   <option key={dept._id} value={dept._id}>
//                     {dept.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Category</label>
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((cat, index) => (
//                   <option key={index} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Subject *
//               </label>
//               <input
//                 type="text"
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//                 required
//               />
//               {isExtracting && (
//                 <div className="text-sm text-blue-500 flex items-center mt-1">
//                   <Loader2 className="w-4 h-4 mr-1 animate-spin" />
//                   {extractionFailed
//                     ? "Retrying text extraction..."
//                     : "Extracting text from document..."}
//                 </div>
//               )}
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Date *</label>
//                 <input
//                   type="date"
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-lg"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Diary No *
//                 </label>
//                 <input
//                   type="text"
//                   value={diaryNo}
//                   onChange={(e) => setDiaryNo(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-lg"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">From *</label>
//               <input
//                 type="text"
//                 value={from}
//                 onChange={(e) => setFrom(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Disposal *
//               </label>
//               <input
//                 type="text"
//                 value={disposal}
//                 onChange={(e) => setDisposal(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Status *</label>
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//                 required
//               >
//                 <option value="">Select Status</option>
//                 <option value="open">Open</option>
//                 <option value="closed">Closed</option>
//               </select>
//             </div>

//             {extractionFailed && (
//               <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
//                 <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
//                 <div className="text-sm text-yellow-700 flex-grow">
//                   <p className="font-medium">Text Extraction Failed</p>
//                   <p>There was a problem extracting text from this document.</p>
//                   <button
//                     type="button"
//                     onClick={() => file && extractTextFromDocument(file)}
//                     disabled={isExtracting}
//                     className="mt-1 px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md flex items-center text-xs font-medium"
//                   >
//                     {isExtracting ? (
//                       <>
//                         <Loader2 className="w-3 h-3 mr-1 animate-spin" />
//                         Retrying...
//                       </>
//                     ) : (
//                       <>
//                         <RotateCcw className="w-3 h-3 mr-1" />
//                         Retry Text Extraction
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Submit buttons */}
//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               disabled={isLoading || (!file && !enhancedImage) || isExtracting}
//               className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Check className="w-5 h-5" />
//                   Save Document
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Render step content
//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 0: // Camera capture
//         return (
//           <div className="fixed inset-0 z-50 bg-black">
//             <div className="relative w-full h-full">
//               {isCameraActive && (
//                 <Webcam
//                   className="w-full h-full object-cover"
//                   audio={false}
//                   screenshotFormat="image/jpeg"
//                   screenshotQuality={1.0}
//                   ref={(ref) => {
//                     webcamRef.current = ref;
//                     videoRef.current = ref && ref.video;
//                   }}
//                   width="100%"
//                   height="100%"
//                   playsInline
//                   videoConstraints={{
//                     facingMode: cameraFacingMode,
//                     width: { ideal: 1920, min: 1280 },
//                     height: { ideal: 1080, min: 720 },
//                     advanced: [{ zoom: zoomLevel }],
//                   }}
//                   onUserMedia={initializeCamera}
//                 />
//               )}

//               {isFocusing && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                   <Focus className="w-16 h-16 text-white animate-pulse" />
//                 </div>
//               )}

//               {/* A4 Document frame guide */}
//               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                 <div
//                   className="relative border-2 border-dashed border-white opacity-80 rounded-lg"
//                   style={{
//                     width: "70%",
//                     height: "70%",
//                     aspectRatio: "210/297",
//                   }}
//                 >
//                   <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
//                   <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
//                   <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
//                   <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>

//                   {/* A4 label */}
//                   <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium">
//                     A4 Document
//                   </div>
//                 </div>
//               </div>

//               {/* Top controls */}
//               <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
//                 <button
//                   className="p-3 bg-black bg-opacity-50 rounded-full text-white"
//                   onClick={onClose}
//                   type="button"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>

//                 <div className="flex gap-2">
//                   {isTorchAvailable && (
//                     <button
//                       className={`p-3 rounded-full ${
//                         isTorchOn
//                           ? "bg-yellow-400 text-black"
//                           : "bg-black bg-opacity-50 text-white"
//                       }`}
//                       onClick={toggleTorch}
//                       type="button"
//                     >
//                       {isTorchOn ? (
//                         <Zap className="w-6 h-6" />
//                       ) : (
//                         <ZapOff className="w-6 h-6" />
//                       )}
//                     </button>
//                   )}
//                   <button
//                     className="p-3 bg-black bg-opacity-50 rounded-full text-white"
//                     onClick={toggleCameraFacing}
//                     type="button"
//                   >
//                     <RotateCcw className="w-6 h-6" />
//                   </button>
//                 </div>
//               </div>

//               {/* Bottom controls */}
//               <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8">
//                 <button
//                   className="p-4 bg-black bg-opacity-50 rounded-full text-white"
//                   onClick={decreaseZoom}
//                   type="button"
//                 >
//                   <ZoomOut className="w-6 h-6" />
//                 </button>

//                 <button
//                   className="w-20 h-20 bg-white border-4 border-blue-500 rounded-full shadow-lg hover:bg-gray-100 transition duration-200 flex items-center justify-center"
//                   onClick={captureAndProcess}
//                   type="button"
//                   disabled={isProcessing}
//                 >
//                   {isProcessing ? (
//                     <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
//                   ) : (
//                     <Camera className="w-10 h-10 text-blue-600" />
//                   )}
//                 </button>

//                 <button
//                   className="p-4 bg-black bg-opacity-50 rounded-full text-white"
//                   onClick={increaseZoom}
//                   type="button"
//                 >
//                   <ZoomIn className="w-6 h-6" />
//                 </button>
//               </div>

//               {/* Instructions */}
//               <div className="absolute bottom-32 left-0 right-0 text-center">
//                 <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg mx-4">
//                   <p className="text-sm">Position document within A4 frame</p>
//                   <p className="text-xs opacity-80">
//                     Ensure document fills the frame completely
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case 1: // Enhanced document view
//       return (
//         <div className="space-y-6 p-4">
//           <div className="text-center">
//             <h3 className="text-xl font-semibold mb-2">Enhanced Document</h3>
//             <p className="text-orange-600 text-sm">
//               Automatic text extraction failed. Please complete the form manually.
//             </p>
//           </div>

//           <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
//             {enhancedImage ? (
//               <div className="flex justify-center p-4">
//                 <img
//                   src={enhancedImage || "/placeholder.svg"}
//                   alt="A4 Enhanced document"
//                   className="max-w-full h-auto max-h-[70vh] object-contain border shadow-sm"
//                   style={{ aspectRatio: "210/297" }}
//                 />
//               </div>
//             ) : (
//               <div className="h-64 flex items-center justify-center text-gray-400">
//                 No enhanced image available
//               </div>
//             )}
//           </div>

//           {/* Manual options when extraction fails */}
//           <div className="space-y-3">
//             <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
//               <p className="text-orange-800 text-sm font-medium">Text extraction failed</p>
//               <p className="text-orange-700 text-sm">You can retry extraction or proceed to fill the form manually.</p>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 type="button"
//                 onClick={startCamera}
//                 className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
//               >
//                 <Camera className="w-5 h-5" />
//                 Retake Photo
//               </button>

//               <button
//                 type="button"
//                 onClick={() => extractTextAndGoToForm(enhancedImage)}
//                 disabled={!enhancedImage || isExtracting}
//                 className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//               >
//                 {isExtracting ? (
//                   <>
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                     Retrying...
//                   </>
//                 ) : (
//                   <>
//                     <RefreshCw className="w-5 h-5" />
//                     Retry Extraction
//                   </>
//                 )}
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setCurrentStep(3)}
//                 className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
//               >
//                 <ChevronRight className="w-5 h-5" />
//                 Skip to Form
//               </button>
//             </div>
//           </div>
//         </div>
//       );

//       case 2: // Text extraction view
//         return (
//           <div className="space-y-6 p-4">
//             <div className="text-center">
//               <h3 className="text-xl font-semibold mb-2">Extracted Text</h3>
//               <p className="text-gray-600 text-sm">
//                 Review and edit the extracted text if needed
//               </p>
//             </div>

//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <label className="font-medium">Extracted Text</label>
//                 {extractedText && (
//                   <button
//                     type="button"
//                     onClick={copyToClipboard}
//                     className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
//                   >
//                     <Copy className="w-4 h-4" />
//                     Copy
//                   </button>
//                 )}
//               </div>

//               <div className="border rounded-lg bg-gray-50 h-64 p-3 overflow-auto">
//                 {extractedText ? (
//                   <pre className="text-sm whitespace-pre-wrap">
//                     {extractedText}
//                   </pre>
//                 ) : (
//                   <div className="flex items-center justify-center h-full text-gray-400">
//                     No text extracted
//                   </div>
//                 )}
//               </div>

//               {extractedText && (
//                 <div className="text-sm text-gray-500">
//                   Characters: {extractedText.length} | Words:{" "}
//                   {
//                     extractedText.split(/\s+/).filter((word) => word.length > 0)
//                       .length
//                   }
//                 </div>
//               )}
//             </div>

//             <div className="flex gap-3">
//               <button
//                 type="button"
//                 onClick={() => setCurrentStep(1)}
//                 className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
//               >
//                 <ArrowLeft className="w-5 h-5" />
//                 Back
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setCurrentStep(3)}
//                 className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
//               >
//                 Continue
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         );

//       case 3: // Form completion
//         return (
//           <div className="space-y-6 p-4">
//             <div className="text-center">
//               <h3 className="text-xl font-semibold mb-2">
//                 Complete Document Details
//               </h3>
//               <p className="text-gray-600 text-sm">
//                 Fill in the required information
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Type *
//                   </label>
//                   <select
//                     value={type}
//                     onChange={(e) => setType(e.target.value)}
//                     className="w-full p-3 border border-gray-300 rounded-lg"
//                     required
//                   >
//                     <option value="">Select Type</option>
//                     <option value="uni">University</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Department *
//                   </label>
//                   <select
//                     value={selectedDepartment}
//                     onChange={(e) => setSelectedDepartment(e.target.value)}
//                     className="w-full p-3 border border-gray-300 rounded-lg"
//                     required
//                   >
//                     <option value="">Select Department</option>
//                     {departments.map((dept) => (
//                       <option key={dept._id} value={dept._id}>
//                         {dept.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Category
//                   </label>
//                   <select
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                     className="w-full p-3 border border-gray-300 rounded-lg"
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map((cat, index) => (
//                       <option key={index} value={cat}>
//                         {cat}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Subject *
//                   </label>
//                   <input
//                     type="text"
//                     value={subject}
//                     onChange={(e) => setSubject(e.target.value)}
//                     className="w-full p-3 border border-gray-300 rounded-lg"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Date *
//                     </label>
//                     <input
//                       type="date"
//                       value={date}
//                       onChange={(e) => setDate(e.target.value)}
//                       className="w-full p-3 border border-gray-300 rounded-lg"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Diary No *
//                     </label>
//                     <input
//                       type="text"
//                       value={diaryNo}
//                       onChange={(e) => setDiaryNo(e.target.value)}
//                       className="w-full p-3 border border-gray-300 rounded-lg"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     From *
//                   </label>
//                   <input
//                     type="text"
//                     value={from}
//                     onChange={(e) => setFrom(e.target.value)}
//                     className="w-full p-3 border border-gray-300 rounded-lg"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Disposal *
//                   </label>
//                   <input
//                     type="text"
//                     value={disposal}
//                     onChange={(e) => setDisposal(e.target.value)}
//                     className="w-full p-3 border border-gray-300 rounded-lg"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Status *
//                   </label>
//                   <select
//                     value={status}
//                     onChange={(e) => setStatus(e.target.value)}
//                     className="w-full p-3 border border-gray-300 rounded-lg"
//                     required
//                   >
//                     <option value="">Select Status</option>
//                     <option value="open">Open</option>
//                     <option value="closed">Closed</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setCurrentStep(2)}
//                   className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
//                 >
//                   <ArrowLeft className="w-5 h-5" />
//                   Back
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Check className="w-5 h-5" />
//                       Save Document
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   // Initial render - start camera button
//   if (!isCameraActive && currentStep === 0) {
//     return (
//       <div className="bg-zinc-800 min-h-screen p-4">
//         {notification && (
//           <Notification
//             type={notification.type}
//             message={notification.message}
//             onDismiss={() => setNotification(null)}
//           />
//         )}

//         <div className="bg-white rounded-lg max-w-md mx-auto p-6">
//           <div className="text-center mb-6">
//             <h2 className="text-2xl font-semibold mb-2">Scan A4 Document</h2>
//             <p className="text-gray-600">
//               Create a professional A4-sized scanned document
//             </p>
//           </div>

//           <div className="space-y-4">
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <h3 className="font-medium text-blue-900 mb-2">
//                 A4 Scanning Tips:
//               </h3>
//               <ul className="text-sm text-blue-800 space-y-1">
//                 <li>• Position document to fill the A4 frame</li>
//                 <li>• Ensure good lighting and focus</li>
//                 <li>• Keep document flat and straight</li>
//                 <li>• Document will be auto-enhanced to A4 size</li>
//               </ul>
//             </div>

//             <button
//               onClick={startCamera}
//               className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-3 text-lg font-medium"
//             >
//               <Camera className="w-6 h-6" />
//               Start A4 Scanner
//             </button>

//             <button
//               onClick={onClose}
//               className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Main component render
//   return (
//     <div className="bg-zinc-800 min-h-screen">
//       {notification && (
//         <Notification
//           type={notification.type}
//           message={notification.message}
//           onDismiss={() => setNotification(null)}
//         />
//       )}

//       {currentStep === 0 ? (
//         renderStepContent()
//       ) : (
//         <div className="min-h-screen">
//           <div className="bg-white">
//             <div className="flex items-center justify-between p-4 border-b">
//               <button
//                 onClick={onClose}
//                 className="p-2 hover:bg-gray-100 rounded-full"
//                 type="button"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//               <h2 className="text-lg font-semibold">A4 Document Scanner</h2>
//               <div className="w-9" /> {/* Spacer */}
//             </div>

//             {renderStepContent()}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Function to convert image to PDF
// const convertImageToPdf = async (imageSrc) => {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.onload = () => {
//       const doc = new jsPDF({
//         orientation: "portrait",
//         unit: "px",
//         format: "a4",
//       });

//       const pageWidth = doc.internal.pageSize.getWidth();
//       const pageHeight = doc.internal.pageSize.getHeight();

//       const widthRatio = pageWidth / img.width;
//       const heightRatio = pageHeight / img.height;
//       const ratio = Math.min(widthRatio, heightRatio);

//       const w = img.width * ratio;
//       const h = img.height * ratio;

//       const x = (pageWidth - w) / 2;
//       const y = (pageHeight - h) / 2;

//       doc.addImage(img, "PNG", x, y, w, h);

//       const pdfBlob = doc.output("blob");
//       resolve(pdfBlob);
//     };
//     img.onerror = (error) => {
//       reject(error);
//     };
//     img.src = imageSrc;
//   });
// };

// export default ScanUpload;

// "use client"

// import { useState, useEffect, useRef, useCallback } from "react"
// import Webcam from "react-webcam"
// import { jsPDF } from "jspdf"
// import { useDropzone } from "react-dropzone"
// import {
//   ZoomIn,
//   ZoomOut,
//   Camera,
//   Focus,
//   X,
//   Check,
//   Zap,
//   ZapOff,
//   FileText,
//   Copy,
//   ChevronRight,
//   ArrowLeft,
//   Loader2,
//   RotateCcw,
//   UploadCloud,
//   RefreshCw,
//   AlertCircle,
//   Eye,
// } from "lucide-react"

// // Notification Component
// const Notification = ({ type, message, onDismiss }) => {
//   return (
//     <div
//       className={`fixed top-4 left-4 right-4 z-50 flex items-center p-3 rounded-md shadow-lg mx-auto max-w-sm ${
//         type === "success"
//           ? "bg-green-100 text-green-800"
//           : type === "error"
//             ? "bg-red-100 text-red-800"
//             : "bg-blue-100 text-blue-800"
//       }`}
//     >
//       <div className="flex-shrink-0 mr-2">
//         {type === "success" ? (
//           <Check className="w-4 h-4" />
//         ) : type === "error" ? (
//           <X className="w-4 h-4" />
//         ) : (
//           <Loader2 className="w-4 h-4 animate-spin" />
//         )}
//       </div>
//       <div className="text-sm flex-1">{message}</div>
//       {onDismiss && (
//         <button onClick={onDismiss} className="ml-2 text-gray-500 hover:text-gray-700">
//           <X className="w-4 h-4" />
//         </button>
//       )}
//     </div>
//   )
// }

// // Document Preview Modal Component
// const DocumentPreviewModal = ({ isOpen, onClose, document, extractedText, fileName }) => {
//   // const [zoomLevel, setZoomLevel] = useState(1)
//   const [viewMode, setViewMode] = useState("image")

//   // const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3))
//   // const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))

//   // Prevent background scrolling when modal is open
//   // Remove this entire useEffect block:

//   if (!isOpen) return null

//   // Determine if we have a valid document to show
//   const hasValidDocument =
//     document && document !== "/placeholder.svg" && !document.includes("placeholder.svg") && document.trim() !== ""

//   console.log("DocumentPreviewModal - document:", document)
//   console.log("DocumentPreviewModal - hasValidDocument:", hasValidDocument)

//   return (
//     <div
//       className="fixed inset-0 z-[60] bg-black bg-opacity-75 flex items-center justify-center p-4 overflow-auto"
//       onClick={(e) => {
//         // Close modal when clicking on backdrop
//         if (e.target === e.currentTarget) {
//           onClose()
//         }
//       }}
//     >
//       <div
//         className="bg-white rounded-xl shadow-2xl w-full max-w-6xl my-8 flex flex-col max-h-[calc(100vh-4rem)]"
//         onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
//           <div className="flex items-center gap-3">
//             <FileText className="w-6 h-6 text-blue-600" />
//             <div>
//               <h2 className="text-xl font-semibold text-gray-900">Document Preview</h2>
//               <p className="text-sm text-gray-600">{fileName || "Enhanced Document"}</p>
//             </div>
//           </div>

//           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//             <X className="w-6 h-6 text-gray-500" />
//           </button>
//         </div>

//         {/* Controls */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setViewMode("image")}
//               className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                 viewMode === "image" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
//               }`}
//             >
//               Document Image
//             </button>
//           </div>
//         </div>

//         {/* Content Area - This is where scrolling should happen */}
//         <div className="flex-1 min-h-0">
//           {" "}
//           {/* min-h-0 is important for flex child to shrink */}
//           {viewMode === "image" ? (
//             <div className="h-full overflow-auto bg-gray-100 flex items-center justify-center p-4">
//               {hasValidDocument ? (
//                 <div
//                   className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-200"
//                   style={{
//                     maxWidth: "100%",
//                     maxHeight: "100%",
//                   }}
//                 >
//                   <img
//                     src={document || "/placeholder.svg"}
//                     alt="Document preview"
//                     className="max-w-full h-auto block"
//                     style={{ aspectRatio: "210/297" }}
//                     onLoad={() => console.log("Image loaded successfully:", document?.substring(0, 50))}
//                     onError={(e) => {
//                       console.error("Image failed to load:", document?.substring(0, 50))
//                       console.error("Error details:", e)
//                     }}
//                   />
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center justify-center text-gray-400 space-y-4">
//                   <FileText className="w-16 h-16" />
//                   <p className="text-lg">No document preview available</p>
//                   <p className="text-sm">The document may be processing or in an unsupported format</p>
//                   {document && (
//                     <div className="text-xs text-gray-500 font-mono break-all max-w-md bg-gray-50 p-2 rounded">
//                       <p className="font-semibold mb-1">Debug Info:</p>
//                       <p>URL: {document.substring(0, 100)}...</p>
//                       <p>Type: {typeof document}</p>
//                       <p>Length: {document.length}</p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="h-full overflow-auto p-6">
//               <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-4xl mx-auto">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900">Extracted Text Content</h3>
//                   <div className="text-sm text-gray-500">{extractedText?.length || 0} characters</div>
//                 </div>
//                 <div className="prose max-w-none">
//                   <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-mono bg-gray-50 p-4 rounded-lg border">
//                     {extractedText || "No text content available"}
//                   </pre>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
//           <div className="flex items-center justify-between text-sm text-gray-600">
//             <div>Document processed and enhanced</div>
//             <div className="flex items-center gap-4">
//               <span>Quality: High</span>
//               <span>Format: Optimized</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Enhanced document processing to create PDF-quality document optimized for OCR
// const autoEnhanceDocument = async (imageData) => {
//   return new Promise((resolve) => {
//     if (!imageData) {
//       console.error("No image data provided to autoEnhanceDocument")
//       resolve(imageData)
//       return
//     }

//     const img = new Image()
//     img.crossOrigin = "anonymous"
//     img.onload = async () => {
//       try {
//         // Validate image dimensions
//         if (img.width === 0 || img.height === 0) {
//           console.error("Invalid image dimensions")
//           resolve(imageData)
//           return
//         }

//         // Step 1: Create high-resolution A4-sized canvas for better OCR
//         const A4_RATIO = 297 / 210 // Height / Width
//         const TARGET_WIDTH = 2480 // A4 width at 300 DPI for better OCR
//         const TARGET_HEIGHT = Math.round(TARGET_WIDTH * A4_RATIO) // A4 height at 300 DPI

//         const a4Canvas = document.createElement("canvas")
//         a4Canvas.width = TARGET_WIDTH
//         a4Canvas.height = TARGET_HEIGHT
//         const a4Ctx = a4Canvas.getContext("2d")

//         // Fill with pure white background
//         a4Ctx.fillStyle = "#FFFFFF"
//         a4Ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT)

//         // Step 2: Detect document boundaries
//         const documentBounds = await detectDocumentBounds(img)

//         // Step 3: Transform and fit document to A4 canvas with high quality
//         await transformToA4Document(img, a4Ctx, documentBounds, TARGET_WIDTH, TARGET_HEIGHT)

//         // Step 4: Create PDF-quality enhancement optimized for OCR
//         const enhancedCanvas = await createPDFQualityDocument(a4Canvas)

//         // Convert to high-quality data URL
//         const enhancedDataUrl = enhancedCanvas.toDataURL("image/png", 1.0)
//         resolve(enhancedDataUrl)
//       } catch (error) {
//         console.error("Auto enhancement error:", error)
//         resolve(imageData)
//       }
//     }
//     img.onerror = (error) => {
//       console.error("Image loading error:", error)
//       resolve(imageData)
//     }
//     img.src = imageData
//   })
// }

// // Create PDF-quality document with optimal OCR preprocessing
// const createPDFQualityDocument = async (canvas) => {
//   if (!canvas) {
//     console.error("No canvas provided to createPDFQualityDocument")
//     return canvas
//   }

//   const ctx = canvas.getContext("2d")
//   if (!ctx) {
//     console.error("Could not get 2D context from canvas")
//     return canvas
//   }

//   let imageData
//   try {
//     imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
//   } catch (error) {
//     console.error("Error getting image data from canvas:", error)
//     return canvas
//   }

//   if (!imageData || !imageData.data) {
//     console.error("Failed to get valid image data")
//     return canvas
//   }

//   const enhancedCanvas = document.createElement("canvas")
//   enhancedCanvas.width = canvas.width
//   enhancedCanvas.height = canvas.height
//   const enhancedCtx = enhancedCanvas.getContext("2d")

//   const preprocessedData = await advancedOCRPreprocessing(imageData)

//   // Step 2: Apply optimal binarization using Otsu's method
//   const binarizedData = await applyOtsuBinarization(preprocessedData)

//   // Step 3: Advanced morphological operations for text clarity
//   const cleanedData = await advancedMorphologicalCleaning(binarizedData, canvas.width, canvas.height)

//   // Step 4: Text sharpening and edge enhancement
//   const sharpenedData = await enhanceTextEdges(cleanedData, canvas.width, canvas.height)

//   const finalImageData = enhancedCtx.createImageData(canvas.width, canvas.height)
//   finalImageData.data.set(sharpenedData)
//   enhancedCtx.putImageData(finalImageData, 0, 0)

//   // Add subtle PDF-like styling
//   addPDFStyling(enhancedCtx, canvas.width, canvas.height)

//   return enhancedCanvas
// }

// // Advanced OCR preprocessing with multiple filters
// const advancedOCRPreprocessing = async (imageData) => {
//   if (!imageData || !imageData.data) {
//     console.error("Invalid imageData provided to advancedOCRPreprocessing")
//     return imageData
//   }

//   const { width, height, data } = imageData
//   if (!data || data.length === 0) {
//     console.error("ImageData has no data array")
//     return imageData
//   }

//   const result = new Uint8ClampedArray(imageData.data.length)

//   // Convert to grayscale with enhanced contrast
//   for (let i = 0; i < imageData.data.length; i += 4) {
//     const r = imageData.data[i]
//     const g = imageData.data[i + 1]
//     const b = imageData.data[i + 2]

//     // Use weighted grayscale conversion optimized for text
//     const gray = 0.299 * r + 0.587 * g + 0.114 * b

//     // Apply gamma correction for better contrast
//     const gamma = 0.8
//     const corrected = 255 * Math.pow(gray / 255, gamma)

//     // Enhance contrast using histogram stretching
//     const enhanced = Math.min(255, Math.max(0, (corrected - 128) * 1.5 + 128))

//     result[i] = enhanced
//     result[i + 1] = enhanced
//     result[i + 2] = enhanced
//     result[i + 3] = imageData.data[i + 3]
//   }

//   // Apply Gaussian blur to reduce noise before binarization
//   return applyAdvancedGaussianBlur(result, width, height)
// }

// // Advanced Gaussian blur with edge preservation
// const applyAdvancedGaussianBlur = (data, width, height) => {
//   const result = new Uint8ClampedArray(data.length)
//   const kernel = [1, 4, 7, 4, 1, 4, 16, 26, 16, 4, 7, 26, 41, 26, 7, 4, 16, 26, 16, 4, 1, 4, 7, 4, 1]
//   const kernelSum = 273
//   const kernelSize = 5
//   const half = Math.floor(kernelSize / 2)

//   for (let y = half; y < height - half; y++) {
//     for (let x = half; x < width - half; x++) {
//       let sum = 0
//       let kernelIndex = 0

//       for (let ky = -half; ky <= half; ky++) {
//         for (let kx = -half; kx <= half; kx++) {
//           const idx = ((y + ky) * width + (x + kx)) * 4
//           sum += data[idx] * kernel[kernelIndex]
//           kernelIndex++
//         }
//       }

//       const idx = (y * width + x) * 4
//       const blurred = Math.round(sum / kernelSum)
//       result[idx] = result[idx + 1] = result[idx + 2] = blurred
//       result[idx + 3] = data[idx + 3]
//     }
//   }

//   return result
// }

// // Otsu's binarization for optimal threshold selection
// const applyOtsuBinarization = async (imageData) => {
//   if (!imageData || !imageData.data) {
//     console.error("Invalid imageData provided to applyOtsuBinarization")
//     return imageData
//   }

//   const { width, height, data } = imageData
//   if (!data || data.length === 0) {
//     console.error("ImageData has no data array")
//     return imageData
//   }

//   const result = new Uint8ClampedArray(imageData.data.length)

//   // Calculate histogram
//   const histogram = new Array(256).fill(0)
//   for (let i = 0; i < imageData.data.length; i += 4) {
//     histogram[imageData.data[i]]++
//   }

//   // Calculate total number of pixels
//   const total = width * height

//   // Calculate Otsu's threshold
//   let sum = 0
//   for (let i = 0; i < 256; i++) {
//     sum += i * histogram[i]
//   }

//   let sumB = 0
//   let wB = 0
//   let wF = 0
//   let varMax = 0
//   let threshold = 0

//   for (let i = 0; i < 256; i++) {
//     wB += histogram[i]
//     if (wB === 0) continue

//     wF = total - wB
//     if (wF === 0) break

//     sumB += i * histogram[i]
//     const mB = sumB / wB
//     const mF = (sum - sumB) / wF

//     const varBetween = wB * wF * (mB - mF) * (mB - mF)

//     if (varBetween > varMax) {
//       varMax = varBetween
//       threshold = i
//     }
//   }

//   // Apply adaptive threshold with local adjustments
//   for (let y = 0; y < height; y++) {
//     for (let x = 0; x < width; x++) {
//       const idx = (y * width + x) * 4
//       const gray = imageData.data[idx]

//       // Calculate local threshold adjustment
//       const localThreshold = calculateLocalThreshold(imageData.data, x, y, width, height, threshold)

//       // Apply threshold with slight bias towards white for cleaner text
//       const binarized = gray > localThreshold ? 255 : 0

//       result[idx] = binarized
//       result[idx + 1] = binarized
//       result[idx + 2] = binarized
//       result[idx + 3] = imageData.data[idx + 3]
//     }
//   }

//   return result
// }

// // Calculate local threshold for adaptive binarization
// const calculateLocalThreshold = (data, x, y, width, height, globalThreshold) => {
//   const windowSize = 15
//   const half = Math.floor(windowSize / 2)
//   let sum = 0
//   let count = 0

//   for (let dy = -half; dy <= half; dy++) {
//     for (let dx = -half; dx <= half; dx++) {
//       const nx = x + dx
//       const ny = y + dy

//       if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
//         const idx = (ny * width + nx) * 4
//         sum += data[idx]
//         count++
//       }
//     }
//   }

//   const localMean = sum / count
//   const localThreshold = localMean * 0.85 // Slightly below local mean

//   // Blend global and local thresholds
//   return Math.round(globalThreshold * 0.7 + localThreshold * 0.3)
// }

// // Advanced morphological operations for text cleaning
// const advancedMorphologicalCleaning = async (data, width, height) => {
//   // Step 1: Remove small noise with opening operation
//   let cleaned = morphologicalOpening(data, width, height)

//   // Step 2: Fill small gaps in text with closing operation
//   cleaned = morphologicalClosing(cleaned, width, height)

//   // Step 3: Remove isolated pixels
//   cleaned = removeIsolatedPixels(cleaned, width, height)

//   // Step 4: Strengthen text strokes
//   cleaned = strengthenTextStrokes(cleaned, width, height)

//   return cleaned
// }

// // Morphological opening (erosion followed by dilation)
// const morphologicalOpening = (data, width, height) => {
//   const eroded = morphologicalErosion(data, width, height, 1)
//   return morphologicalDilation(eroded, width, height, 1)
// }

// // Morphological closing (dilation followed by erosion)
// const morphologicalClosing = (data, width, height) => {
//   const dilated = morphologicalDilation(data, width, height, 1)
//   return morphologicalErosion(dilated, width, height, 1)
// }

// // Morphological erosion
// const morphologicalErosion = (data, width, height, iterations) => {
//   const result = new Uint8ClampedArray(data)

//   for (let iter = 0; iter < iterations; iter++) {
//     const temp = new Uint8ClampedArray(result)

//     for (let y = 1; y < height - 1; y++) {
//       for (let x = 1; x < width - 1; x++) {
//         const idx = (y * width + x) * 4

//         // Check 3x3 neighborhood
//         let minValue = 255
//         for (let dy = -1; dy <= 1; dy++) {
//           for (let dx = -1; dx <= 1; dx++) {
//             const nIdx = ((y + dy) * width + (x + dx)) * 4
//             minValue = Math.min(minValue, temp[nIdx])
//           }
//         }

//         result[idx] = result[idx + 1] = result[idx + 2] = minValue
//         result[idx + 3] = temp[idx + 3]
//       }
//     }
//   }

//   return result
// }

// // Morphological dilation
// const morphologicalDilation = (data, width, height, iterations) => {
//   const result = new Uint8ClampedArray(data)

//   for (let iter = 0; iter < iterations; iter++) {
//     const temp = new Uint8ClampedArray(result)

//     for (let y = 1; y < height - 1; y++) {
//       for (let x = 1; x < width - 1; x++) {
//         const idx = (y * width + x) * 4

//         // Check 3x3 neighborhood
//         let maxValue = 0
//         for (let dy = -1; dy <= 1; dy++) {
//           for (let dx = -1; dx <= 1; dx++) {
//             const nIdx = ((y + dy) * width + (x + dx)) * 4
//             maxValue = Math.max(maxValue, temp[nIdx])
//           }
//         }

//         result[idx] = result[idx + 1] = result[idx + 2] = maxValue
//         result[idx + 3] = temp[idx + 3]
//       }
//     }
//   }

//   return result
// }

// // Remove isolated pixels (noise)
// const removeIsolatedPixels = (data, width, height) => {
//   const result = new Uint8ClampedArray(data)

//   for (let y = 1; y < height - 1; y++) {
//     for (let x = 1; x < width - 1; x++) {
//       const idx = (y * width + x) * 4

//       if (data[idx] === 0) {
//         // Black pixel
//         // Count black neighbors
//         let blackNeighbors = 0
//         for (let dy = -1; dy <= 1; dy++) {
//           for (let dx = -1; dx <= 1; dx++) {
//             if (dx === 0 && dy === 0) continue
//             const nIdx = ((y + dy) * width + (x + dx)) * 4
//             if (data[nIdx] === 0) blackNeighbors++
//           }
//         }

//         // If isolated (less than 2 black neighbors), make it white
//         if (blackNeighbors < 2) {
//           result[idx] = result[idx + 1] = result[idx + 2] = 255
//         }
//       }
//     }
//   }

//   return result
// }

// // Strengthen text strokes for better OCR
// const strengthenTextStrokes = (data, width, height) => {
//   const result = new Uint8ClampedArray(data)

//   for (let y = 1; y < height - 1; y++) {
//     for (let x = 1; x < width - 1; x++) {
//       const idx = (y * width + x) * 4

//       if (data[idx] === 255) {
//         // White pixel
//         // Count black neighbors
//         let blackNeighbors = 0
//         for (let dy = -1; dy <= 1; dy++) {
//           for (let dx = -1; dx <= 1; dx++) {
//             if (dx === 0 && dy === 0) continue
//             const nIdx = ((y + dy) * width + (x + dx)) * 4
//             if (data[nIdx] === 0) blackNeighbors++
//           }
//         }

//         // If surrounded by black pixels (likely inside text), make it black
//         if (blackNeighbors >= 6) {
//           result[idx] = result[idx + 1] = result[idx + 2] = 0
//         }
//       }
//     }
//   }

//   return result
// }

// // Enhance text edges for crisp appearance
// const enhanceTextEdges = async (data, width, height) => {
//   const result = new Uint8ClampedArray(data)

//   // Apply unsharp masking for text sharpening
//   const blurred = applyGaussianBlurForSharpening(data, width, height)

//   for (let i = 0; i < data.length; i += 4) {
//     const original = data[i]
//     const blurredValue = blurred[i]

//     // Unsharp mask formula: original + amount * (original - blurred)
//     const amount = 1.5
//     const sharpened = Math.min(255, Math.max(0, original + amount * (original - blurredValue)))

//     // Ensure pure black or white for text
//     const enhanced = sharpened > 127 ? 255 : 0

//     result[i] = enhanced
//     result[i + 1] = enhanced
//     result[i + 2] = enhanced
//     result[i + 3] = data[i + 3]
//   }

//   return result
// }

// // Gaussian blur for sharpening (smaller kernel)
// const applyGaussianBlurForSharpening = (data, width, height) => {
//   const result = new Uint8ClampedArray(data.length)
//   const kernel = [1, 2, 1, 2, 4, 2, 1, 2, 1]
//   const kernelSum = 16

//   for (let y = 1; y < height - 1; y++) {
//     for (let x = 1; x < width - 1; x++) {
//       let sum = 0
//       let kernelIndex = 0

//       for (let ky = -1; ky <= 1; ky++) {
//         for (let kx = -1; kx <= 1; kx++) {
//           const idx = ((y + ky) * width + (x + kx)) * 4
//           sum += data[idx] * kernel[kernelIndex]
//           kernelIndex++
//         }
//       }

//       const idx = (y * width + x) * 4
//       const blurred = Math.round(sum / kernelSum)
//       result[idx] = result[idx + 1] = result[idx + 2] = blurred
//       result[idx + 3] = data[idx + 3]
//     }
//   }

//   return result
// }

// // Add PDF-like styling
// const addPDFStyling = (ctx, width, height) => {
//   // Add very subtle drop shadow for depth
//   const shadowOffset = 3
//   const shadowBlur = 6

//   ctx.save()
//   ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
//   ctx.shadowBlur = shadowBlur
//   ctx.shadowOffsetX = shadowOffset
//   ctx.shadowOffsetY = shadowOffset

//   // Draw a subtle border
//   ctx.strokeStyle = "rgba(0, 0, 0, 0.05)"
//   ctx.lineWidth = 1
//   ctx.strokeRect(0, 0, width, height)

//   ctx.restore()
// }

// // Detect document boundaries using advanced edge detection
// const detectDocumentBounds = async (img) => {
//   const tempCanvas = document.createElement("canvas")
//   tempCanvas.width = img.width
//   tempCanvas.height = img.height
//   const tempCtx = tempCanvas.getContext("2d")
//   tempCtx.drawImage(img, 0, 0)

//   const imageData = tempCtx.getImageData(0, 0, img.width, img.height)
//   const { width, height, data } = imageData

//   // Convert to grayscale
//   const grayData = new Uint8Array(width * height)
//   for (let i = 0; i < data.length; i += 4) {
//     const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
//     grayData[i / 4] = gray
//   }

//   // Apply Gaussian blur
//   const blurred = applyGaussianBlur(grayData, width, height)

//   // Find edges using Canny edge detection
//   const edges = cannyEdgeDetection(blurred, width, height)

//   // Find document contour
//   const documentCorners = findDocumentCorners(edges, width, height)

//   if (documentCorners && documentCorners.length === 4) {
//     return sortCornersClockwise(documentCorners)
//   }

//   // Fallback: use image bounds with slight perspective
//   const margin = Math.min(width, height) * 0.05
//   return [
//     { x: margin, y: margin },
//     { x: width - margin, y: margin },
//     { x: width - margin, y: height - margin },
//     { x: margin, y: height - margin },
//   ]
// }

// // Apply Gaussian blur for noise reduction
// const applyGaussianBlur = (data, width, height) => {
//   const kernel = [1, 2, 1, 2, 4, 2, 1, 2, 1]
//   const kernelSum = 16
//   const result = new Uint8Array(width * height)

//   for (let y = 1; y < height - 1; y++) {
//     for (let x = 1; x < width - 1; x++) {
//       let sum = 0
//       let kernelIndex = 0

//       for (let ky = -1; ky <= 1; ky++) {
//         for (let kx = -1; kx <= 1; kx++) {
//           const pixelIndex = (y + ky) * width + (x + kx)
//           sum += data[pixelIndex] * kernel[kernelIndex]
//           kernelIndex++
//         }
//       }

//       result[y * width + x] = Math.round(sum / kernelSum)
//     }
//   }

//   return result
// }

// // Canny edge detection
// const cannyEdgeDetection = (data, width, height) => {
//   const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
//   const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1]

//   const gradientX = new Float32Array(width * height)
//   const gradientY = new Float32Array(width * height)
//   const magnitude = new Float32Array(width * height)

//   // Calculate gradients
//   for (let y = 1; y < height - 1; y++) {
//     for (let x = 1; x < width - 1; x++) {
//       let gx = 0,
//         gy = 0

//       for (let ky = -1; ky <= 1; ky++) {
//         for (let kx = -1; kx <= 1; kx++) {
//           const idx = (y + ky) * width + (x + kx)
//           const kernelIdx = (ky + 1) * 3 + (kx + 1)
//           gx += data[idx] * sobelX[kernelIdx]
//           gy += data[idx] * sobelY[kernelIdx]
//         }
//       }

//       const idx = y * width + x
//       gradientX[idx] = gx
//       gradientY[idx] = gy
//       magnitude[idx] = Math.sqrt(gx * gx + gy * gy)
//     }
//   }

//   // Apply thresholding
//   const edges = new Uint8Array(width * height)
//   const highThreshold = 80
//   const lowThreshold = 40

//   for (let y = 1; y < height - 1; y++) {
//     for (let x = 1; x < width - 1; x++) {
//       const idx = y * width + x
//       const mag = magnitude[idx]

//       if (mag > highThreshold) {
//         edges[idx] = 255
//       } else if (mag > lowThreshold) {
//         // Check if connected to strong edge
//         let hasStrongNeighbor = false
//         for (let dy = -1; dy <= 1; dy++) {
//           for (let dx = -1; dx <= 1; dx++) {
//             const nIdx = (y + dy) * width + (x + dx)
//             if (magnitude[nIdx] > highThreshold) {
//               hasStrongNeighbor = true
//               break
//             }
//           }
//           if (hasStrongNeighbor) break
//         }
//         if (hasStrongNeighbor) edges[idx] = 255
//       }
//     }
//   }

//   return edges
// }

// // Find document corners using Hough transform and contour analysis
// const findDocumentCorners = (edges, width, height) => {
//   // Find lines using simplified Hough transform
//   const lines = findLines(edges, width, height)

//   if (lines.length >= 4) {
//     // Find intersections of lines to get corners
//     const corners = findLineIntersections(lines, width, height)

//     if (corners.length >= 4) {
//       // Filter and select the best 4 corners that form a quadrilateral
//       return selectBestQuadrilateral(corners, width, height)
//     }
//   }

//   // Fallback: find corners using contour analysis
//   return findCornersFromContours(edges, width, height)
// }

// // Simplified Hough transform to find lines
// const findLines = (edges, width, height) => {
//   const lines = []
//   const rhoMax = Math.sqrt(width * width + height * height)
//   const rhoStep = 2
//   const thetaStep = Math.PI / 180 // 1 degree
//   const threshold = Math.min(width, height) * 0.3

//   const accumulator = new Map()

//   // Hough transform
//   for (let y = 0; y < height; y++) {
//     for (let x = 0; x < width; x++) {
//       if (edges[y * width + x] === 255) {
//         for (let theta = 0; theta < Math.PI; theta += thetaStep) {
//           const rho = x * Math.cos(theta) + y * Math.sin(theta)
//           const rhoIndex = Math.round(rho / rhoStep)
//           const thetaIndex = Math.round(theta / thetaStep)
//           const key = `${rhoIndex},${thetaIndex}`

//           accumulator.set(key, (accumulator.get(key) || 0) + 1)
//         }
//       }
//     }
//   }

//   // Find peaks in accumulator
//   for (const [key, votes] of accumulator) {
//     if (votes > threshold) {
//       const [rhoIndex, thetaIndex] = key.split(",").map(Number)
//       const rho = rhoIndex * rhoStep
//       const theta = thetaIndex * thetaStep
//       lines.push({ rho, theta, votes })
//     }
//   }

//   // Sort by votes and return top lines
//   return lines.sort((a, b) => b.votes - a.votes).slice(0, 10)
// }

// // Find intersections between lines
// const findLineIntersections = (lines, width, height) => {
//   const intersections = []

//   for (let i = 0; i < lines.length; i++) {
//     for (let j = i + 1; j < lines.length; j++) {
//       const line1 = lines[i]
//       const line2 = lines[j]

//       // Calculate intersection point
//       const cos1 = Math.cos(line1.theta)
//       const sin1 = Math.sin(line1.theta)
//       const cos2 = Math.cos(line2.theta)
//       const sin2 = Math.sin(line2.theta)

//       const det = cos1 * sin2 - sin1 * cos2
//       if (Math.abs(det) > 0.1) {
//         // Lines are not parallel
//         const x = (sin2 * line1.rho - sin1 * line2.rho) / det
//         const y = (cos1 * line2.rho - cos2 * line1.rho) / det

//         // Check if intersection is within image bounds
//         if (x >= 0 && x < width && y >= 0 && y < height) {
//           intersections.push({ x, y })
//         }
//       }
//     }
//   }

//   return intersections
// }

// // Select the best 4 corners that form a quadrilateral
// const selectBestQuadrilateral = (corners, width, height) => {
//   if (corners.length < 4) return corners

//   // Find the 4 corners that are most likely to be document corners
//   // by finding corners that are roughly at the corners of the image
//   const imageCenter = { x: width / 2, y: height / 2 }

//   // Divide into quadrants and find the corner closest to each quadrant
//   const quadrants = [
//     { x: width * 0.25, y: height * 0.25 }, // Top-left
//     { x: width * 0.75, y: height * 0.25 }, // Top-right
//     { x: width * 0.75, y: height * 0.75 }, // Bottom-right
//     { x: width * 0.25, y: height * 0.75 }, // Bottom-left
//   ]

//   const selectedCorners = []

//   for (const quadrant of quadrants) {
//     let closestCorner = null
//     let minDistance = Number.POSITIVE_INFINITY

//     for (const corner of corners) {
//       const distance = Math.sqrt(Math.pow(corner.x - quadrant.x, 2) + Math.pow(corner.y - quadrant.y, 2))
//       if (distance < minDistance) {
//         minDistance = distance
//         closestCorner = corner
//       }
//     }

//     if (closestCorner) {
//       selectedCorners.push(closestCorner)
//     }
//   }

//   return selectedCorners.length === 4 ? selectedCorners : corners.slice(0, 4)
// }

// // Fallback method to find corners from contours
// const findCornersFromContours = (edges, width, height) => {
//   // Find the largest contour
//   const contours = findContours(edges, width, height)

//   if (contours.length > 0) {
//     const largestContour = contours.reduce((max, contour) => (contour.length > max.length ? contour : max))

//     // Approximate contour to polygon
//     const epsilon = 0.02 * calculatePerimeter(largestContour)
//     const approx = approximatePolygon(largestContour, epsilon)

//     if (approx.length >= 4) {
//       return approx.slice(0, 4)
//     }
//   }

//   // Final fallback: use image corners with slight inset
//   const margin = Math.min(width, height) * 0.05
//   return [
//     { x: margin, y: margin },
//     { x: width - margin, y: margin },
//     { x: width - margin, y: height - margin },
//     { x: margin, y: height - margin },
//   ]
// }

// // Find contours in edge image
// const findContours = (edges, width, height) => {
//   const contours = []
//   const visited = new Uint8Array(width * height)

//   for (let y = 0; y < height; y++) {
//     for (let x = 0; x < width; x++) {
//       const idx = y * width + x
//       if (edges[idx] === 255 && !visited[idx]) {
//         const contour = traceContour(edges, visited, x, y, width, height)
//         if (contour.length > 100) {
//           // Minimum contour size
//           contours.push(contour)
//         }
//       }
//     }
//   }

//   return contours.sort((a, b) => b.length - a.length) // Sort by size
// }

// // Trace contour starting from a point
// const traceContour = (edges, visited, startX, startY, width, height) => {
//   const contour = []
//   const stack = [{ x: startX, y: startY }]

//   while (stack.length > 0) {
//     const { x, y } = stack.pop()
//     const idx = y * width + x

//     if (x < 0 || x >= width || y < 0 || y >= height || visited[idx] || edges[idx] !== 255) {
//       continue
//     }

//     visited[idx] = 1
//     contour.push({ x, y })

//     // Add 8-connected neighbors
//     for (let dy = -1; dy <= 1; dy++) {
//       for (let dx = -1; dx <= 1; dx++) {
//         if (dx === 0 && dy === 0) continue
//         stack.push({ x: x + dx, y: y + dy })
//       }
//     }
//   }

//   return contour
// }

// // Calculate perimeter of contour
// const calculatePerimeter = (contour) => {
//   let perimeter = 0
//   for (let i = 0; i < contour.length; i++) {
//     const current = contour[i]
//     const next = contour[(i + 1) % contour.length]
//     const dx = next.x - current.x
//     const dy = next.y - current.y
//     perimeter += Math.sqrt(dx * dx + dy * dy)
//   }
//   return perimeter
// }

// // Approximate polygon using Douglas-Peucker algorithm
// const approximatePolygon = (contour, epsilon) => {
//   if (contour.length < 3) return contour

//   const start = contour[0]
//   const end = contour[contour.length - 1]
//   let maxDistance = 0
//   let maxIndex = 0

//   for (let i = 1; i < contour.length - 1; i++) {
//     const distance = pointToLineDistance(contour[i], start, end)
//     if (distance > maxDistance) {
//       maxDistance = distance
//       maxIndex = i
//     }
//   }

//   if (maxDistance > epsilon) {
//     const left = approximatePolygon(contour.slice(0, maxIndex + 1), epsilon)
//     const right = approximatePolygon(contour.slice(maxIndex), epsilon)
//     return [...left.slice(0, -1), ...right]
//   } else {
//     return [start, end]
//   }
// }

// // Calculate distance from point to line
// const pointToLineDistance = (point, lineStart, lineEnd) => {
//   const A = lineEnd.y - lineStart.y
//   const B = lineStart.x - lineEnd.x
//   const C = lineEnd.x * lineStart.y - lineStart.x * lineEnd.y
//   return Math.abs(A * point.x + B * point.y + C) / Math.sqrt(A * A + B * B)
// }

// // Sort corners in clockwise order starting from top-left
// const sortCornersClockwise = (corners) => {
//   if (corners.length !== 4) return corners

//   // Find center point
//   const centerX = corners.reduce((sum, p) => sum + p.x, 0) / 4
//   const centerY = corners.reduce((sum, p) => sum + p.y, 0) / 4

//   // Sort by angle from center
//   const sorted = corners
//     .map((corner) => ({
//       ...corner,
//       angle: Math.atan2(corner.y - centerY, corner.x - centerX),
//     }))
//     .sort((a, b) => a.angle - b.angle)

//   // Find top-left corner (minimum x + y)
//   const topLeft = sorted.reduce((min, p) => (p.x + p.y < min.x + min.y ? p : min))
//   const startIndex = sorted.indexOf(topLeft)

//   // Return in clockwise order: top-left, top-right, bottom-right, bottom-left
//   return [sorted[startIndex], sorted[(startIndex + 1) % 4], sorted[(startIndex + 2) % 4], sorted[(startIndex + 3) % 4]]
// }

// // Transform document to fit A4 canvas with proper perspective correction
// const transformToA4Document = async (sourceImg, a4Ctx, corners, targetWidth, targetHeight) => {
//   // Create transformation matrix for perspective correction
//   const srcCorners = corners
//   const dstCorners = [
//     { x: 0, y: 0 },
//     { x: targetWidth, y: 0 },
//     { x: targetWidth, y: targetHeight },
//     { x: 0, y: targetHeight },
//   ]

//   // Apply perspective transformation using homography
//   try {
//     const matrix = calculateHomography(srcCorners, dstCorners)
//     applyHomographyTransform(sourceImg, a4Ctx, matrix, targetWidth, targetHeight)
//   } catch (error) {
//     console.error("Perspective transformation failed, using simple scaling:", error)
//     // Fallback: simple scaling and centering
//     const scale = Math.min(targetWidth / sourceImg.width, targetHeight / sourceImg.height) * 0.95
//     const offsetX = (targetWidth - sourceImg.width * scale) / 2
//     const offsetY = (targetHeight - sourceImg.height * scale) / 2
//     a4Ctx.drawImage(sourceImg, offsetX, offsetY, sourceImg.width * scale, sourceImg.height * scale)
//   }
// }

// // Calculate homography matrix for perspective transformation
// const calculateHomography = (src, dst) => {
//   // Simplified homography calculation
//   // For a more robust implementation, you would use DLT (Direct Linear Transform)

//   const scaleX = (dst[1].x - dst[0].x) / (src[1].x - src[0].x)
//   const scaleY = (dst[3].y - dst[0].y) / (src[3].y - src[0].y)
//   const translateX = dst[0].x - src[0].x * scaleX
//   const translateY = dst[0].y - src[0].y * scaleY

//   return {
//     a: scaleX,
//     b: 0,
//     c: translateX,
//     d: 0,
//     e: scaleY,
//     f: translateY,
//     g: 0,
//     h: 0,
//     i: 1,
//   }
// }

// // Apply homography transformation
// const applyHomographyTransform = (sourceImg, ctx, matrix, width, height) => {
//   // For simplicity, use canvas transform
//   ctx.save()
//   ctx.setTransform(matrix.a, matrix.d, matrix.b, matrix.e, matrix.c, matrix.f)
//   ctx.drawImage(sourceImg, 0, 0)
//   ctx.restore()
// }

// const ScanUpload = ({ fileData, action, onClose }) => {
//   // State for step-by-step workflow
//   const [currentStep, setCurrentStep] = useState(0)

//   const isUploadMode = action === "Upload"
//   const isScanMode = action === "Scan"

//   // State declarations
//   const [type, setType] = useState(fileData?.type || "")
//   const [file, setFile] = useState(fileData?.file || null)
//   const [fileName, setFileName] = useState(fileData?.file?.name || "")
//   const [departments, setDepartments] = useState([])
//   const [selectedDepartment, setSelectedDepartment] = useState(fileData?.department || "")
//   const [categories, setCategories] = useState([])
//   const [selectedCategory, setSelectedCategory] = useState(fileData?.category || "")
//   const [subject, setSubject] = useState(fileData?.subject || "")
//   const [date, setDate] = useState(fileData?.date || new Date().toISOString().split("T")[0])
//   const [diaryNo, setDiaryNo] = useState(fileData?.diaryNo || "")
//   const [from, setFrom] = useState(fileData?.from || "")
//   const [disposal, setDisposal] = useState(fileData?.disposal || "")
//   const [status, setStatus] = useState(fileData?.status || "")

//   // Camera and image processing states
//   const [processedImage, setProcessedImage] = useState(null) // For upload mode
//   const [enhancedImage, setEnhancedImage] = useState(null)
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [zoomLevel, setZoomLevel] = useState(1)
//   const [cameraFacingMode, setCameraFacingMode] = useState("environment")
//   const [isFocusing, setIsFocusing] = useState(false)
//   const [hasCameraPermission, setHasCameraPermission] = useState(null)
//   const [isTorchAvailable, setIsTorchAvailable] = useState(false)
//   const [isTorchOn, setIsTorchOn] = useState(false)
//   const [isAutoFocusEnabled, setIsAutoFocusEnabled] = useState(true)
//   const [cameraTrack, setCameraTrack] = useState(null)
//   const [extractedText, setExtractedText] = useState("")
//   const [isExtracting, setIsExtracting] = useState(false)
//   const [extractionFailed, setExtractionFailed] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [notification, setNotification] = useState(null)
//   const [isCameraActive, setIsCameraActive] = useState(false)

//   // Preview modal state
//   const [isPreviewOpen, setIsPreviewOpen] = useState(false)

//   // Refs
//   const webcamRef = useRef(null)
//   const videoRef = useRef(null)

//   // Helper function to show notifications
//   const showNotification = useCallback((type, message, duration = 3000) => {
//     setNotification({ type, message })
//     if (duration) {
//       setTimeout(() => {
//         setNotification(null)
//       }, duration)
//     }
//   }, [])

//   // Fetch departments when type changes
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       if (!type) return

//       try {
//         const response = await fetch(`/api/department?type=${type}`, {
//           method: "GET",
//         })
//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
//         const data = await response.json()
//         setDepartments(data)
//       } catch (error) {
//         console.error("Failed to fetch departments", error)
//         showNotification("error", "Failed to load departments")
//       }
//     }

//     if (type) fetchDepartments()
//   }, [type, showNotification])

//   // Update categories when department changes
//   useEffect(() => {
//     if (selectedDepartment) {
//       const department = departments.find((dept) => dept._id === selectedDepartment)
//       setCategories(department?.categories || [])
//     }
//   }, [selectedDepartment, departments])

//   // Clean up camera on unmount
//   useEffect(() => {
//     return () => {
//       if (cameraTrack) {
//         cameraTrack.stop()
//       }
//     }
//   }, [cameraTrack])

//   // Turn off torch/flash
//   const turnOffTorch = useCallback(async () => {
//     if (cameraTrack && isTorchAvailable && isTorchOn) {
//       try {
//         await cameraTrack.applyConstraints({
//           advanced: [{ torch: false }],
//         })
//         setIsTorchOn(false)
//       } catch (error) {
//         console.error("Error turning off torch:", error)
//       }
//     }
//   }, [cameraTrack, isTorchAvailable, isTorchOn])

//   // Request camera permission and start camera
//   const startCamera = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: cameraFacingMode,
//           width: { ideal: 1920, min: 1280 },
//           height: { ideal: 1080, min: 720 },
//         },
//       })

//       setHasCameraPermission(true)
//       setIsCameraActive(true)
//       setCurrentStep(0)

//       // Initialize camera features after a short delay
//       setTimeout(() => {
//         initializeCamera()
//       }, 500)
//     } catch (error) {
//       console.error("Camera access error:", error)
//       setHasCameraPermission(false)
//       showNotification("error", "Camera access denied. Please allow camera access and try again.")
//     }
//   }, [cameraFacingMode])

//   // Initialize camera features
//   const initializeCamera = useCallback(async () => {
//     try {
//       if (webcamRef.current && webcamRef.current.video) {
//         const stream = webcamRef.current.video.srcObject

//         if (stream) {
//           const videoTrack = stream.getVideoTracks()[0]
//           setCameraTrack(videoTrack)

//           const capabilities = videoTrack.getCapabilities ? videoTrack.getCapabilities() : {}
//           setIsTorchAvailable(capabilities.torch || false)

//           // Apply auto-focus if available
//           if (capabilities.focusMode && capabilities.focusMode.includes("continuous")) {
//             try {
//               await videoTrack.applyConstraints({
//                 advanced: [{ focusMode: "continuous" }],
//               })
//             } catch (error) {
//               console.log("Auto-focus not supported")
//             }
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error initializing camera:", error)
//     }
//   }, [])

//   // Enhanced document processing for upload mode
//   const enhanceDocumentForReadability = async (imageData) => {
//     return new Promise((resolve) => {
//       const img = new Image()
//       img.crossOrigin = "anonymous"
//       img.onload = async () => {
//         try {
//           const canvas = document.createElement("canvas")
//           canvas.width = img.width
//           canvas.height = img.height
//           const ctx = canvas.getContext("2d")

//           // Draw original image
//           ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

//           // Get image data for processing
//           let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

//           // Apply gentle enhancement
//           imgData = clearBackgroundAndEnhanceText(imgData)

//           ctx.putImageData(imgData, 0, 0)
//           resolve(canvas.toDataURL("image/jpeg", 0.9))
//         } catch (error) {
//           console.error("Image processing error:", error)
//           resolve(imageData)
//         }
//       }
//       img.src = imageData
//     })
//   }

//   const clearBackgroundAndEnhanceText = (imageData) => {
//     const data = new Uint8ClampedArray(imageData.data)
//     const width = imageData.width
//     const height = imageData.height
//     const result = new Uint8ClampedArray(data.length)

//     // First pass: identify background color (most common color)
//     const colorCounts = {}
//     for (let i = 0; i < data.length; i += 4) {
//       const r = data[i]
//       const g = data[i + 1]
//       const b = data[i + 2]
//       const key = `${r},${g},${b}`
//       colorCounts[key] = (colorCounts[key] || 0) + 1
//     }

//     // Find most common color (background)
//     const backgroundKey = Object.keys(colorCounts).reduce((a, b) => (colorCounts[a] > colorCounts[b] ? a : b))
//     const [bgR, bgG, bgB] = backgroundKey.split(",").map(Number)

//     // Second pass: enhance contrast between text and background
//     for (let i = 0; i < data.length; i += 4) {
//       const r = data[i]
//       const g = data[i + 1]
//       const b = data[i + 2]

//       // Calculate distance from background color
//       const dist = Math.sqrt(Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2))

//       // If pixel is significantly different from background (likely text)
//       if (dist > 50) {
//         // Slightly darken text pixels for better contrast
//         result[i] = Math.max(0, r * 0.9)
//         result[i + 1] = Math.max(0, g * 0.9)
//         result[i + 2] = Math.max(0, b * 0.9)
//       } else {
//         // Lighten background pixels
//         result[i] = Math.min(255, bgR * 1.1)
//         result[i + 1] = Math.min(255, bgG * 1.1)
//         result[i + 2] = Math.min(255, bgB * 1.1)
//       }
//       result[i + 3] = data[i + 3] // Preserve alpha
//     }

//     return new ImageData(result, width, height)
//   }

//   // Updated text extraction function for upload mode
//   const extractTextFromDocument = async (file) => {
//     setIsExtracting(true)
//     setExtractionFailed(false)

//     try {
//       showNotification("info", "Extracting text from document...", 0)

//       let extractedText = ""

//       if (file.type === "application/pdf") {
//         // Handle PDF files
//         await loadLibraries()

//         const arrayBuffer = await file.arrayBuffer()
//         const typedArray = new Uint8Array(arrayBuffer)

//         showNotification("info", "Loading PDF...", 0)
//         const pdf = await window.pdfjsLib.getDocument({ data: typedArray }).promise

//         let fullText = ""
//         const totalPages = pdf.numPages

//         for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
//           showNotification("info", `Processing page ${pageNum} of ${totalPages}...`, 0)

//           const page = await pdf.getPage(pageNum)

//           // First try to extract text directly
//           const textContent = await page.getTextContent()
//           let pageText = textContent.items
//             .map((item) => item.str)
//             .join(" ")
//             .trim()

//           // If no text found or very little text, use OCR
//           if (!pageText || pageText.length < 50) {
//             showNotification("info", `OCR processing page ${pageNum}...`, 0)

//             // Render page as canvas for OCR
//             const viewport = page.getViewport({ scale: 2.0 })
//             const canvas = document.createElement("canvas")
//             const context = canvas.getContext("2d")
//             canvas.height = viewport.height
//             canvas.width = viewport.width

//             await page.render({
//               canvasContext: context,
//               viewport: viewport,
//             }).promise

//             // Convert canvas to image and run OCR
//             const imageData = canvas.toDataURL("image/png")

//             try {
//               const {
//                 data: { text },
//               } = await window.Tesseract.recognize(imageData, "eng", {
//                 logger: (m) => {
//                   if (m.status === "recognizing text") {
//                     const ocrProgress = Math.round(m.progress * 100)
//                     showNotification("info", `OCR processing page ${pageNum}: ${ocrProgress}%`, 0)
//                   }
//                 },
//               })
//               pageText = text.trim()
//             } catch (ocrError) {
//               console.warn(`OCR failed for page ${pageNum}:`, ocrError)
//               pageText = pageText || `[OCR failed for page ${pageNum}]`
//             }
//           }

//           if (pageText) {
//             fullText += `--- Page ${pageNum} ---\n${pageText}\n\n`
//           }
//         }

//         extractedText = fullText
//       } else if (file.type.startsWith("image/")) {
//         // Handle image files with OCR
//         await loadLibraries()

//         showNotification("info", "Processing image with OCR...", 0)

//         const imageUrl = URL.createObjectURL(file)

//         try {
//           const {
//             data: { text },
//           } = await window.Tesseract.recognize(imageUrl, "eng", {
//             logger: (m) => {
//               if (m.status === "recognizing text") {
//                 const ocrProgress = Math.round(m.progress * 100)
//                 showNotification("info", `OCR processing: ${ocrProgress}%`, 0)
//               }
//             },
//           })
//           extractedText = text.trim()
//         } finally {
//           URL.revokeObjectURL(imageUrl)
//         }
//       } else {
//         throw new Error("Unsupported file type. Please use PDF or image files.")
//       }

//       setExtractedText(extractedText || "")
//       setExtractionFailed(false)

//       if (extractedText && !subject) {
//         const extractedSubject = extractSubject(extractedText)
//         if (extractedSubject) {
//           setSubject(extractedSubject)
//         }
//       }

//       showNotification("success", "Text extracted successfully")
//       return extractedText
//     } catch (error) {
//       console.error("Text extraction failed:", error)
//       setExtractionFailed(true)
//       showNotification("error", `Text extraction failed: ${error.message}`)
//       return ""
//     } finally {
//       setIsExtracting(false)
//     }
//   }

//   // Handle file change for upload mode
//   const handleFileChange = useCallback(async (file) => {
//     if (!file) return

//     setIsProcessing(true)
//     setFile(file)
//     setFileName(file.name)

//     try {
//       // For images, create object URL and enhance for display
//       if (file.type.startsWith("image/")) {
//         // Create object URL for immediate preview
//         const objectUrl = URL.createObjectURL(file)
//         setProcessedImage(objectUrl)

//         // Also create enhanced version for better readability
//         const reader = new FileReader()
//         reader.onload = async (e) => {
//           try {
//             const enhanced = await enhanceDocumentForReadability(e.target.result)
//             // Keep both: object URL for immediate preview, enhanced for better quality
//             setProcessedImage(enhanced || objectUrl)
//           } catch (error) {
//             console.error("Enhancement failed, using original:", error)
//             // Fallback to object URL if enhancement fails
//             setProcessedImage(objectUrl)
//           }
//         }
//         reader.readAsDataURL(file)
//       } else if (file.type === "application/pdf") {
//         // For PDFs, we'll need to render first page as preview
//         await renderPDFPreview(file)
//       }

//       // Extract text from uploaded file
//       await extractTextFromDocument(file)
//     } catch (error) {
//       console.error("File processing error:", error)
//       showNotification("error", `File processing failed: ${error.message}`)
//     } finally {
//       setIsProcessing(false)
//     }
//   }, [])

//   // Render PDF first page as preview
//   const renderPDFPreview = async (file) => {
//     try {
//       await loadLibraries()

//       const arrayBuffer = await file.arrayBuffer()
//       const typedArray = new Uint8Array(arrayBuffer)

//       const pdf = await window.pdfjsLib.getDocument({ data: typedArray }).promise
//       const page = await pdf.getPage(1) // Get first page

//       const viewport = page.getViewport({ scale: 1.5 })
//       const canvas = document.createElement("canvas")
//       const context = canvas.getContext("2d")
//       canvas.height = viewport.height
//       canvas.width = viewport.width

//       await page.render({
//         canvasContext: context,
//         viewport: viewport,
//       }).promise

//       const previewDataUrl = canvas.toDataURL("image/png")
//       setProcessedImage(previewDataUrl)
//     } catch (error) {
//       console.error("PDF preview generation failed:", error)
//       setProcessedImage("/placeholder.svg?height=800&width=600")
//     }
//   }

//   // Dropzone config (for upload mode)
//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop: (acceptedFiles) => {
//       const file = acceptedFiles[0]
//       if (file) handleFileChange(file)
//     },
//     accept: {
//       "application/pdf": [".pdf"],
//       "image/*": [".png", ".jpg", ".jpeg"],
//     },
//     maxSize: 10485760, // 10MB limit
//     multiple: false,
//     onDropRejected: (fileRejections) => {
//       if (fileRejections.length > 0) {
//         const { errors } = fileRejections[0]
//         if (errors[0]?.code === "file-too-large") {
//           showNotification("error", "File is too large. Maximum size is 10MB.")
//         } else {
//           showNotification("error", "Invalid file. Please upload a PDF or image file.")
//         }
//       }
//     },
//   })

//   // Toggle torch
//   const toggleTorch = useCallback(async () => {
//     if (!cameraTrack || !isTorchAvailable) return

//     try {
//       await cameraTrack.applyConstraints({
//         advanced: [{ torch: !isTorchOn }],
//       })
//       setIsTorchOn(!isTorchOn)
//     } catch (error) {
//       console.error("Error toggling torch:", error)
//       showNotification("error", "Unable to control flash")
//     }
//   }, [cameraTrack, isTorchAvailable, isTorchOn, showNotification])

//   // Toggle auto focus
//   const toggleAutoFocus = useCallback(async () => {
//     if (!cameraTrack) return

//     try {
//       const newAutoFocusState = !isAutoFocusEnabled
//       await cameraTrack.applyConstraints({
//         advanced: [{ focusMode: newAutoFocusState ? "continuous" : "manual" }],
//       })
//       setIsAutoFocusEnabled(newAutoFocusState)
//     } catch (error) {
//       console.error("Error toggling auto-focus:", error)
//     }
//   }, [cameraTrack, isAutoFocusEnabled])

//   const captureAndProcess = useCallback(async () => {
//     if (!webcamRef.current) return;

//     setIsProcessing(true);
//     showNotification("info", "Creating Enhanced document...", 0);

//     try {
//       // Capture with highest quality
//       const imageSrc = webcamRef.current.getScreenshot({
//         width: 1920,
//         height: 1080,
//         screenshotFormat: "image/jpeg",
//         screenshotQuality: 1.0,
//       });

//       if (!imageSrc) throw new Error("Failed to capture image");

//       // Validate the captured image
//       if (typeof imageSrc !== "string" || !imageSrc.startsWith("data:image/")) {
//         throw new Error("Invalid image data captured");
//       }

//       // Turn off flash immediately after capture
//       await turnOffTorch();

//       // Stop camera
//       if (cameraTrack) {
//         cameraTrack.stop();
//         setCameraTrack(null);
//       }
//       setIsCameraActive(false);

//       // Enhance the image to create proper A4 document
//       const enhanced = await autoEnhanceDocument(imageSrc);

//       if (!enhanced) {
//         throw new Error("Failed to enhance document");
//       }

//       setEnhancedImage(enhanced);

//       // Convert to file
//       const response = await fetch(enhanced);
//       if (!response.ok) {
//         throw new Error("Failed to convert enhanced image to blob");
//       }

//       const blob = await response.blob();
//       const imageFile = new File([blob], `a4_scan_${Date.now()}.png`, {
//         type: "image/png",
//       });
//       setFile(imageFile);
//       setFileName(`a4_scan_${Date.now()}.png`);

//       showNotification("success", "Scanned document created successfully!");

//       // Automatically start text extraction and go directly to form
//       await extractTextAndGoToForm(enhanced);

//     } catch (error) {
//       console.error("Capture error:", error);
//       showNotification("error", `Capture failed: ${error.message}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [cameraTrack, showNotification, turnOffTorch]);

//   // Extract text from enhanced image with optimal OCR settings
//   const extractText = useCallback(async () => {
//     if (!enhancedImage) return

//     setIsExtracting(true)
//     setExtractionFailed(false)

//     try {
//       showNotification("info", "Extracting text from PDF-quality document...", 0)

//       await loadLibraries()

//       const {
//         data: { text },
//       } = await window.Tesseract.recognize(enhancedImage, "eng", {
//         logger: (m) => {
//           if (m.status === "recognizing text") {
//             const ocrProgress = Math.round(m.progress * 100)
//             showNotification("info", `OCR processing: ${ocrProgress}%`, 0)
//           }
//         },
//         tessedit_pageseg_mode: window.Tesseract.PSM.SINGLE_BLOCK,
//         tessedit_ocr_engine_mode: window.Tesseract.OEM.LSTM_ONLY,
//         tessedit_char_whitelist:
//           "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?@#$%^&*()_+-=[]{}|;':\"<>?/~` \n\r\t",
//         preserve_interword_spaces: "1",
//         tessedit_do_invert: "0",
//         tessedit_create_hocr: "0",
//         tessedit_create_tsv: "0",
//         user_defined_dpi: "300",
//       })

//       setExtractedText(text.trim() || "")

//       if (text.trim()) {
//         const extractedSubject = extractSubject(text.trim())
//         if (extractedSubject && !subject) {
//           setSubject(extractedSubject)
//         }
//       }

//       setCurrentStep(2)
//       showNotification("success", "Text extracted with high accuracy!")
//     } catch (error) {
//       console.error("Text extraction failed:", error)
//       setExtractionFailed(true)
//       showNotification("error", `Text extraction failed: ${error.message}`)
//     } finally {
//       setIsExtracting(false)
//     }
//   }, [enhancedImage, subject, showNotification, setExtractedText, setSubject, setCurrentStep])

//   const extractTextAndGoToForm = useCallback(async (enhancedImageSrc) => {
//     if (!enhancedImageSrc) return;

//     setIsExtracting(true);
//     setExtractionFailed(false);

//     try {
//       showNotification("info", "Extracting text and preparing form...", 0);

//       await loadLibraries();

//       const {
//         data: { text },
//       } = await window.Tesseract.recognize(enhancedImageSrc, "eng", {
//         logger: (m) => {
//           if (m.status === "recognizing text") {
//             const ocrProgress = Math.round(m.progress * 100);
//             showNotification("info", `Processing: ${ocrProgress}%`, 0);
//           }
//         },
//         tessedit_pageseg_mode: window.Tesseract.PSM.SINGLE_BLOCK,
//         tessedit_ocr_engine_mode: window.Tesseract.OEM.LSTM_ONLY,
//         tessedit_char_whitelist:
//           "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?@#$%^&*()_+-=[]{}|;':\"<>?/~` \n\r\t",
//         preserve_interword_spaces: "1",
//         tessedit_do_invert: "0",
//         tessedit_create_hocr: "0",
//         tessedit_create_tsv: "0",
//         user_defined_dpi: "300",
//       });

//       setExtractedText(text.trim() || "");

//       // Auto-fill subject if text was extracted and subject is empty
//       if (text.trim()) {
//         const extractedSubject = extractSubject(text.trim());
//         if (extractedSubject && !subject) {
//           setSubject(extractedSubject);
//         }
//       }

//       // Go directly to form completion step (step 3)
//       setCurrentStep(3);
//       showNotification("success", "Text extracted! Complete the form below.");

//     } catch (error) {
//       console.error("Text extraction failed:", error);
//       setExtractionFailed(true);
//       // On failure, go to step 1 to show enhanced image and manual options
//       setCurrentStep(1);
//       showNotification("error", "Text extraction failed. Please complete the form manually.");
//     } finally {
//       setIsExtracting(false);
//     }
//   }, [subject, showNotification, setExtractedText, setSubject, setCurrentStep]);

//   // Enhanced subject extraction
//   const extractSubject = (text) => {
//     if (!text) return "Document"

//     const lines = text.split("\n").filter((line) => line.trim().length > 0)

//     const subjectPatterns = [
//       /\b(?:subject|re|regarding|sub|topic|matter)[:;]\s*(.*)/i,
//       /\b(?:sub|subj)[-:]?\s*(.*)/i,
//       /\b(?:regarding|ref|reference)[:;]\s*(.*)/i,
//     ]

//     for (const line of lines) {
//       for (const pattern of subjectPatterns) {
//         const match = line.match(pattern)
//         if (match && match[1] && match[1].trim().length > 0) {
//           return match[1].trim()
//         }
//       }
//     }

//     for (const line of lines) {
//       const trimmedLine = line.trim()
//       if (trimmedLine.length === 0) continue
//       if (/^\d{1,2}[/\-.]\d{1,2}[/\-.]\d{2,4}/.test(trimmedLine)) continue
//       if (/^[A-Za-z0-9\s,]+,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}/.test(trimmedLine)) continue
//       if (/^(to|from|date|ref|reference|through|copy to|cc|bcc|attachment[s]?|enclosure[s]?):/i.test(trimmedLine))
//         continue

//       if (trimmedLine.length > 10) {
//         return trimmedLine.substring(0, 100)
//       }
//     }

//     return lines.length > 0 ? lines[0].trim().substring(0, 100) : "Document"
//   }

//   // Load libraries
//   const loadLibraries = async () => {
//     if (typeof window !== "undefined") {
//       if (!window.pdfjsLib) {
//         const pdfScript = document.createElement("script")
//         pdfScript.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
//         document.head.appendChild(pdfScript)

//         await new Promise((resolve) => {
//           pdfScript.onload = () => {
//             window.pdfjsLib.GlobalWorkerOptions.workerSrc =
//               "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
//             resolve(true)
//           }
//         })
//       }

//       if (!window.Tesseract) {
//         const tesseractScript = document.createElement("script")
//         tesseractScript.src = "https://unpkg.com/tesseract.js@4.1.1/dist/tesseract.min.js"
//         document.head.appendChild(tesseractScript)

//         await new Promise((resolve) => {
//           tesseractScript.onload = resolve
//         })
//       }
//     }
//   }

//   // Copy text to clipboard
//   const copyToClipboard = useCallback(() => {
//     if (!extractedText) return

//     navigator.clipboard
//       .writeText(extractedText)
//       .then(() => showNotification("success", "Text copied!"))
//       .catch(() => showNotification("error", "Failed to copy text"))
//   }, [extractedText, showNotification])

//   // Toggle camera facing mode
//   const toggleCameraFacing = useCallback(() => {
//     setCameraFacingMode((prev) => (prev === "environment" ? "user" : "environment"))
//   }, [])

//   // Zoom controls
//   const increaseZoom = useCallback(() => setZoomLevel((prev) => Math.min(prev + 0.2, 3)), [])
//   const decreaseZoom = useCallback(() => setZoomLevel((prev) => Math.max(prev - 0.2, 1)), [])

//   // Form submission
//   const handleSubmit = useCallback(
//     async (e) => {
//       e.preventDefault()
//       setIsLoading(true)

//       // Update validation to check for either file OR enhancedImage
//       if ((!file && !enhancedImage) || !selectedDepartment || !subject || !diaryNo || !from || !disposal || !status) {
//         showNotification("error", "Please fill all required fields")
//         setIsLoading(false)
//         return
//       }

//       const formData = new FormData()

//       try {
//         // Handle different file sources based on mode
//         if (enhancedImage) {
//           // Scan mode: use enhancedImage (A4 processed scan)
//           const pdfBlob = await convertImageToPdf(enhancedImage)
//           const finalFileName = fileName || subject || "a4_scanned_document"
//           formData.append("file", pdfBlob, `${finalFileName}.pdf`)
//           formData.append("fileName", finalFileName)
//         } else if (file) {
//           // Upload mode: handle different file types
//           if (file.type === "application/pdf") {
//             // PDF files go directly
//             formData.append("file", file)
//             formData.append("fileName", fileName || subject || "uploaded_document")
//           } else if (file.type.startsWith("image/")) {
//             // Images get converted to PDF
//             const imageUrl = processedImage || URL.createObjectURL(file)
//             const pdfBlob = await convertImageToPdf(imageUrl)
//             const finalFileName = fileName || subject || "uploaded_image"
//             formData.append("file", pdfBlob, `${finalFileName}.pdf`)
//             formData.append("fileName", finalFileName)
//           } else {
//             throw new Error("Unsupported file type")
//           }
//         } else {
//           throw new Error("No file or scan data available")
//         }

//         formData.append("type", type)
//         formData.append("department", selectedDepartment)
//         formData.append("category", selectedCategory)
//         formData.append("subject", subject)
//         formData.append("date", date)
//         formData.append("diaryNo", diaryNo)
//         formData.append("from", from)
//         formData.append("disposal", disposal)
//         formData.append("status", status)
//         formData.append("extractedText", extractedText)

//         const method = fileData ? "PUT" : "POST"
//         const url = fileData ? `/api/scanupload/${fileData._id}` : "/api/scanupload"

//         showNotification("info", "Saving document...", 0)

//         const response = await fetch(url, { method, body: formData })

//         setNotification(null)

//         if (!response.ok) {
//           let errorMessage = "HTTP error"
//           try {
//             const errorData = await response.json()
//             errorMessage = errorData.error || `HTTP error! status: ${response.status}`
//           } catch (parseError) {
//             errorMessage = `HTTP error! status: ${response.status}`
//           }
//           throw new Error(errorMessage)
//         }

//         let data
//         try {
//           data = await response.json()
//         } catch (parseError) {
//           throw new Error("Invalid response from server")
//         }

//         showNotification("success", "Document saved successfully!")

//         setTimeout(() => {
//           onClose()
//         }, 1500)
//       } catch (error) {
//         console.error("Upload error:", error)
//         showNotification("error", `Upload failed: ${error.message}`)
//       } finally {
//         setIsLoading(false)
//       }
//     },
//     [
//       file,
//       enhancedImage,
//       processedImage,
//       selectedDepartment,
//       subject,
//       diaryNo,
//       from,
//       disposal,
//       status,
//       fileName,
//       type,
//       selectedCategory,
//       date,
//       extractedText,
//       fileData,
//       showNotification,
//       onClose,
//     ],
//   )

//   // UPLOAD MODE RENDER
//   if (isUploadMode) {
//     return (
//       <div className="bg-zinc-800 p-10">
//         {notification && (
//           <Notification
//             type={notification.type}
//             message={notification.message}
//             onDismiss={() => setNotification(null)}
//           />
//         )}

//         {/* Document Preview Modal */}
//         <DocumentPreviewModal
//           isOpen={isPreviewOpen}
//           onClose={() => setIsPreviewOpen(false)}
//           document={processedImage}
//           extractedText={extractedText}
//           fileName={fileName}
//         />

//         <div className="bg-white p-6 rounded-lg max-w-4xl mx-auto">
//           <h2 className="text-3xl text-center font-semibold mb-6">{action} Form</h2>

//           <div className="mb-4">
//             <h3 className="text-lg font-semibold mb-3">Document Upload</h3>

//             <div className="flex flex-col gap-2 w-full">
//               <div
//                 {...getRootProps()}
//                 className={`flex flex-col items-center justify-center w-full p-4 border-2 border-dashed bg-gray-100 rounded-lg cursor-pointer transition-all ${
//                   isDragActive ? "border-blue-500 bg-gray-200" : "border-gray-400"
//                 }`}
//                 style={{ minHeight: "160px" }}
//               >
//                 <input {...getInputProps()} />
//                 <UploadCloud size={36} className="text-gray-500 mb-2" />
//                 {isDragActive ? (
//                   <p className="text-lg font-semibold text-blue-600">Drop your file here...</p>
//                 ) : (
//                   <p className="text-gray-700 text-center">
//                     Drag & Drop your PDF or Image here or{" "}
//                     <span className="text-blue-500 font-medium">click to browse</span>
//                   </p>
//                 )}
//               </div>

//               {file && (
//                 <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       {file.type === "application/pdf" ? (
//                         <FileText className="w-5 h-5 mr-3 text-red-500" />
//                       ) : (
//                         <img
//                           src={URL.createObjectURL(file) || "/placeholder.svg"}
//                           alt="Thumbnail"
//                           className="w-8 h-8 mr-3 object-cover rounded"
//                         />
//                       )}
//                       <div>
//                         <p className="font-medium text-sm">{fileName}</p>
//                         <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {/* Preview Button for Upload Mode */}
//                       <button
//                         type="button"
//                         onClick={() => setIsPreviewOpen(true)}
//                         className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
//                       >
//                         <Eye className="w-4 h-4" />
//                         <span>Preview</span>
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setFile(null)
//                           setFileName("")
//                           setProcessedImage(null)
//                           setExtractedText("")
//                         }}
//                         className="text-gray-500 hover:text-red-500"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {processedImage && !file && (
//                 <div className="mt-3">
//                   <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
//                     <img
//                       src={processedImage || "/placeholder.svg"}
//                       alt="Processed document"
//                       className="w-full h-auto max-h-56 object-contain mx-auto"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setProcessedImage(null)
//                         setExtractedText("")
//                       }}
//                       className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
//                     >
//                       <X className="w-4 h-4 text-gray-600" />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Form fields section */}
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Type *</label>
//               <select
//                 value={type}
//                 onChange={(e) => setType(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//                 required
//               >
//                 <option value="">Select Type</option>
//                 <option value="uni">University</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Department *</label>
//               <select
//                 value={selectedDepartment}
//                 onChange={(e) => setSelectedDepartment(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//                 required
//               >
//                 <option value="">Select Department</option>
//                 {departments.map((dept) => (
//                   <option key={dept._id} value={dept._id}>
//                     {dept.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Category</label>
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((cat, index) => (
//                   <option key={index} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Subject *</label>
//               <input
//                 type="text"
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//                 required
//               />
//               {isExtracting && (
//                 <div className="text-sm text-blue-500 flex items-center mt-1">
//                   <Loader2 className="w-4 h-4 mr-1 animate-spin" />
//                   {extractionFailed ? "Retrying text extraction..." : "Extracting text from document..."}
//                 </div>
//               )}
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Date *</label>
//                 <input
//                   type="date"
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-lg"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Diary No *</label>
//                 <input
//                   type="text"
//                   value={diaryNo}
//                   onChange={(e) => setDiaryNo(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-lg"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">From *</label>
//               <input
//                 type="text"
//                 value={from}
//                 onChange={(e) => setFrom(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Disposal *</label>
//               <input
//                 type="text"
//                 value={disposal}
//                 onChange={(e) => setDisposal(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Status *</label>
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//                 required
//               >
//                 <option value="">Select Status</option>
//                 <option value="open">Open</option>
//                 <option value="closed">Closed</option>
//               </select>
//             </div>

//             {extractionFailed && (
//               <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
//                 <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
//                 <div className="text-sm text-yellow-700 flex-grow">
//                   <p className="font-medium">Text Extraction Failed</p>
//                   <p>There was a problem extracting text from this document.</p>
//                   <button
//                     type="button"
//                     onClick={() => file && extractTextFromDocument(file)}
//                     disabled={isExtracting}
//                     className="mt-1 px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md flex items-center text-xs font-medium"
//                   >
//                     {isExtracting ? (
//                       <>
//                         <Loader2 className="w-3 h-3 mr-1 animate-spin" />
//                         Retrying...
//                       </>
//                     ) : (
//                       <>
//                         <RotateCcw className="w-3 h-3 mr-1" />
//                         Retry Text Extraction
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Submit buttons */}
//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               onClick={handleSubmit}
//               disabled={isLoading || (!file && !enhancedImage) || isExtracting}
//               className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Check className="w-5 h-5" />
//                   Save Document
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Render step content
//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 0: // Camera capture
//         return (
//           <div className="fixed inset-0 z-50 bg-black">
//             <div className="relative w-full h-full">
//               {isCameraActive && (
//                 <Webcam
//                   className="w-full h-full object-cover"
//                   audio={false}
//                   screenshotFormat="image/jpeg"
//                   screenshotQuality={1.0}
//                   ref={(ref) => {
//                     webcamRef.current = ref
//                     videoRef.current = ref && ref.video
//                   }}
//                   width="100%"
//                   height="100%"
//                   playsInline
//                   videoConstraints={{
//                     facingMode: cameraFacingMode,
//                     width: { ideal: 1920, min: 1280 },
//                     height: { ideal: 1080, min: 720 },
//                     advanced: [{ zoom: zoomLevel }],
//                   }}
//                   onUserMedia={initializeCamera}
//                 />
//               )}

//               {isFocusing && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                   <Focus className="w-16 h-16 text-white animate-pulse" />
//                 </div>
//               )}

//               {/* A4 Document frame guide */}
//               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                 <div
//                   className="relative border-2 border-dashed border-white opacity-80 rounded-lg"
//                   style={{
//                     width: "70%",
//                     height: "70%",
//                     aspectRatio: "210/297",
//                   }}
//                 >
//                   <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
//                   <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
//                   <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
//                   <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>

//                   {/* A4 label */}
//                   <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium">
//                     Scan Document
//                   </div>
//                 </div>
//               </div>

//               {/* Top controls */}
//               <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
//                 <button className="p-3 bg-black bg-opacity-50 rounded-full text-white" onClick={onClose} type="button">
//                   <X className="w-6 h-6" />
//                 </button>

//                 <div className="flex gap-2">
//                   {isTorchAvailable && (
//                     <button
//                       className={`p-3 rounded-full ${
//                         isTorchOn ? "bg-yellow-400 text-black" : "bg-black bg-opacity-50 text-white"
//                       }`}
//                       onClick={toggleTorch}
//                       type="button"
//                     >
//                       {isTorchOn ? <Zap className="w-6 h-6" /> : <ZapOff className="w-6 h-6" />}
//                     </button>
//                   )}
//                   <button
//                     className="p-3 bg-black bg-opacity-50 rounded-full text-white"
//                     onClick={toggleCameraFacing}
//                     type="button"
//                   >
//                     <RotateCcw className="w-6 h-6" />
//                   </button>
//                 </div>
//               </div>

//               {/* Bottom controls */}
//               <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8">
//                 <button
//                   className="p-4 bg-black bg-opacity-50 rounded-full text-white"
//                   onClick={decreaseZoom}
//                   type="button"
//                 >
//                   <ZoomOut className="w-6 h-6" />
//                 </button>

//                 <button
//                   className="w-20 h-20 bg-white border-4 border-blue-500 rounded-full shadow-lg hover:bg-gray-100 transition duration-200 flex items-center justify-center"
//                   onClick={captureAndProcess}
//                   type="button"
//                   disabled={isProcessing}
//                 >
//                   {isProcessing ? (
//                     <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
//                   ) : (
//                     <Camera className="w-10 h-10 text-blue-600" />
//                   )}
//                 </button>

//                 <button
//                   className="p-4 bg-black bg-opacity-50 rounded-full text-white"
//                   onClick={increaseZoom}
//                   type="button"
//                 >
//                   <ZoomIn className="w-6 h-6" />
//                 </button>
//               </div>

//               {/* Instructions */}
//               <div className="absolute bottom-32 left-0 right-0 text-center">
//                 <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg mx-4">
//                   <p className="text-sm">Position document within frame</p>
//                   <p className="text-xs opacity-80">Ensure document fills the frame completely</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )

//       case 1: // Enhanced document view
//         return (
//           <div className="space-y-6 p-4">
//             <div className="text-center">
//               <h3 className="text-xl font-semibold mb-2">Enhanced Document</h3>
//               <p className="text-orange-600 text-sm">
//                 Automatic text extraction failed. Please complete the form manually.
//               </p>
//             </div>

//             <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
//               {enhancedImage ? (
//                 <div className="flex justify-center p-4">
//                   <img
//                     src={enhancedImage || "/placeholder.svg"}
//                     alt="A4 Enhanced document"
//                     className="max-w-full h-auto max-h-[70vh] object-contain border shadow-sm"
//                     style={{ aspectRatio: "210/297" }}
//                   />
//                 </div>
//               ) : (
//                 <div className="h-64 flex items-center justify-center text-gray-400">No enhanced image available</div>
//               )}
//             </div>

//             {/* Manual options when extraction fails */}
//             <div className="space-y-3">
//               <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
//                 <p className="text-orange-800 text-sm font-medium">Text extraction failed</p>
//                 <p className="text-orange-700 text-sm">
//                   You can retry extraction or proceed to fill the form manually.
//                 </p>
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   type="button"
//                   onClick={startCamera}
//                   className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
//                 >
//                   <Camera className="w-5 h-5" />
//                   Retake Photo
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => extractTextAndGoToForm(enhancedImage)}
//                   disabled={!enhancedImage || isExtracting}
//                   className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   {isExtracting ? (
//                     <>
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                       Retrying...
//                     </>
//                   ) : (
//                     <>
//                       <RefreshCw className="w-5 h-5" />
//                       Retry Extraction
//                     </>
//                   )}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => setCurrentStep(3)}
//                   className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
//                 >
//                   <ChevronRight className="w-5 h-5" />
//                   Skip to Form
//                 </button>
//               </div>
//             </div>
//           </div>
//         )

//       case 2: // Text extraction view
//         return (
//           <div className="space-y-6 p-4">
//             <div className="text-center">
//               <h3 className="text-xl font-semibold mb-2">Extracted Text</h3>
//               <p className="text-gray-600 text-sm">Review and edit the extracted text if needed</p>
//             </div>

//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <label className="font-medium">Extracted Text</label>
//                 {extractedText && (
//                   <button
//                     type="button"
//                     onClick={copyToClipboard}
//                     className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
//                   >
//                     <Copy className="w-4 h-4" />
//                     Copy
//                   </button>
//                 )}
//               </div>

//               <div className="border rounded-lg bg-gray-50 h-64 p-3 overflow-auto">
//                 {extractedText ? (
//                   <pre className="text-sm whitespace-pre-wrap">{extractedText}</pre>
//                 ) : (
//                   <div className="flex items-center justify-center h-full text-gray-400">No text extracted</div>
//                 )}
//               </div>

//               {extractedText && (
//                 <div className="text-sm text-gray-500">
//                   Characters: {extractedText.length} | Words:{" "}
//                   {extractedText.split(/\s+/).filter((word) => word.length > 0).length}
//                 </div>
//               )}
//             </div>

//             <div className="flex gap-3">
//               <button
//                 type="button"
//                 onClick={() => setCurrentStep(1)}
//                 className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
//               >
//                 <ArrowLeft className="w-5 h-5" />
//                 Back
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setCurrentStep(3)}
//                 className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
//               >
//                 Continue
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         )

//       case 3: // Form completion
//         return (
//           <div className="space-y-6 p-4">
//             {/* Document Preview Modal for Scan Mode */}
//             <DocumentPreviewModal
//               isOpen={isPreviewOpen}
//               onClose={() => setIsPreviewOpen(false)}
//               document={enhancedImage}
//               extractedText={extractedText}
//               fileName={fileName}
//             />

//             <div className="text-center">
//               <h3 className="text-xl font-semibold mb-2">Complete Document Details</h3>
//               <p className="text-gray-600 text-sm">Fill in the required information</p>
//             </div>

//             {/* Preview Button for Scan Mode */}
//             {enhancedImage && (
//               <div className="flex justify-center mb-4">
//                 <button
//                   type="button"
//                   onClick={() => setIsPreviewOpen(true)}
//                   className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
//                 >
//                   <Eye className="w-5 h-5" />
//                   <span>Enhanced Document Preview</span>
//                 </button>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Type *</label>
//                   <select
//                     value={type}
//                     onChange={(e) => setType(e.target.value)}
//                     className="w-full p-3 border border-gray-300 rounded-lg"
//                     required
//                   >
//                     <option value="">Select Type</option>
//                     <option value="uni">University</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Department *</label>
//                   <select
//                     value={selectedDepartment}
//                     onChange={(e) => setSelectedDepartment(e.target.value)}
//                     className="w-full p-3 border border-gray-300 rounded-lg"
//                     required
//                   >
//                     <option value="">Select Department</option>
//                     {departments.map((dept) => (
//                       <option key={dept._id} value={dept._id}>
//                         {dept.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Category</label>
//                   <select
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                     className="w-full p-3 border border-gray-300 rounded-lg"
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map((cat, index) => (
//                       <option key={index} value={cat}>
//                         {cat}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Subject *</label>
//                   <input
//                     type="text"
//                     value={subject}
//                     onChange={(e) => setSubject(e.target.value)}
//                     className="w-full p-3 border border-gray-300 rounded-lg"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Date *</label>
//                     <input
//                       type="date"
//                       value={date}
//                       onChange={(e) => setDate(e.target.value)}
//                       className="w-full p-3 border border-gray-300 rounded-lg"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-1">Diary No *</label>
//                     <input
//                       type="text"
//                       value={diaryNo}
//                       onChange={(e) => setDiaryNo(e.target.value)}
//                       className="w-full p-3 border border-gray-300 rounded-lg"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">From *</label>
//                   <input
//                     type="text"
//                     value={from}
//                     onChange={(e) => setFrom(e.target.value)}
//                     className="w-full p-3 border border-gray-300 rounded-lg"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Disposal *</label>
//                   <input
//                     type="text"
//                     value={disposal}
//                     onChange={(e) => setDisposal(e.target.value)}
//                     className="w-full p-3 border border-gray-300 rounded-lg"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Status *</label>
//                   <select
//                     value={status}
//                     onChange={(e) => setStatus(e.target.value)}
//                     className="w-full p-3 border border-gray-300 rounded-lg"
//                     required
//                   >
//                     <option value="">Select Status</option>
//                     <option value="open">Open</option>
//                     <option value="closed">Closed</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setCurrentStep(2)}
//                   className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
//                 >
//                   <ArrowLeft className="w-5 h-5" />
//                   Back
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Check className="w-5 h-5" />
//                       Save Document
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         )

//       default:
//         return null
//     }
//   }

//   // Initial render - start camera button
//   if (!isCameraActive && currentStep === 0) {
//     return (
//       <div className="bg-zinc-800 min-h-screen p-4">
//         {notification && (
//           <Notification
//             type={notification.type}
//             message={notification.message}
//             onDismiss={() => setNotification(null)}
//           />
//         )}

//         <div className="bg-white rounded-lg max-w-md mx-auto p-6">
//           <div className="text-center mb-6">
//             <h2 className="text-2xl font-semibold mb-2">Scan Document</h2>
//             <p className="text-gray-600">Create a professional scanned document</p>
//           </div>

//           <div className="space-y-4">
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <h3 className="font-medium text-blue-900 mb-2">Scanning Tips:</h3>
//               <ul className="text-sm text-blue-800 space-y-1">
//                 <li>• Position document to fill the frame</li>
//                 <li>• Ensure good lighting and focus</li>
//                 <li>• Keep document flat and straight</li>
//                 <li>• Document will be auto-enhanced</li>
//               </ul>
//             </div>

//             <button
//               onClick={startCamera}
//               className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-3 text-lg font-medium"
//             >
//               <Camera className="w-6 h-6" />
//               Start Scanner
//             </button>

//             <button
//               onClick={onClose}
//               className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Main component render
//   return (
//     <div className="bg-zinc-800 min-h-screen">
//       {notification && (
//         <Notification type={notification.type} message={notification.message} onDismiss={() => setNotification(null)} />
//       )}

//       {currentStep === 0 ? (
//         renderStepContent()
//       ) : (
//         <div className="min-h-screen">
//           <div className="bg-white">
//             <div className="flex items-center justify-between p-4 border-b">
//               <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full" type="button">
//                 <X className="w-5 h-5" />
//               </button>
//               <h2 className="text-lg font-semibold">Document Scanner</h2>
//               <div className="w-9" /> {/* Spacer */}
//             </div>

//             {renderStepContent()}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// // Function to convert image to PDF
// const convertImageToPdf = async (imageSrc) => {
//   return new Promise((resolve, reject) => {
//     const img = new Image()
//     img.crossOrigin = "anonymous"
//     img.onload = () => {
//       const doc = new jsPDF({
//         orientation: "portrait",
//         unit: "px",
//         format: "a4",
//       })

//       const pageWidth = doc.internal.pageSize.getWidth()
//       const pageHeight = doc.internal.pageSize.getHeight()

//       const widthRatio = pageWidth / img.width
//       const heightRatio = pageHeight / img.height
//       const ratio = Math.min(widthRatio, heightRatio)

//       const w = img.width * ratio
//       const h = img.height * ratio

//       const x = (pageWidth - w) / 2
//       const y = (pageHeight - h) / 2

//       doc.addImage(img, "PNG", x, y, w, h)

//       const pdfBlob = doc.output("blob")
//       resolve(pdfBlob)
//     }
//     img.onerror = (error) => {
//       reject(error)
//     }
//     img.src = imageSrc
//   })
// }

// export default ScanUpload

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { jsPDF } from "jspdf";
import { useDropzone } from "react-dropzone";
import {
  ZoomIn,
  ZoomOut,
  Camera,
  Focus,
  X,
  Check,
  Zap,
  ZapOff,
  FileText,
  Copy,
  ChevronRight,
  ArrowLeft,
  Loader2,
  RotateCcw,
  UploadCloud,
  RefreshCw,
  AlertCircle,
  Eye,
} from "lucide-react";

// Notification Component
const Notification = ({ type, message, onDismiss }) => {
  return (
    <div
      className={`fixed top-4 left-4 right-4 z-50 flex items-center p-3 rounded-md shadow-lg mx-auto max-w-sm ${
        type === "success"
          ? "bg-green-100 text-green-800"
          : type === "error"
          ? "bg-red-100 text-red-800"
          : "bg-blue-100 text-blue-800"
      }`}
    >
      <div className="flex-shrink-0 mr-2">
        {type === "success" ? (
          <Check className="w-4 h-4" />
        ) : type === "error" ? (
          <X className="w-4 h-4" />
        ) : (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
      </div>
      <div className="text-sm flex-1">{message}</div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// Document Preview Modal Component
const DocumentPreviewModal = ({
  isOpen,
  onClose,
  document,
  extractedText,
  fileName,
}) => {
  // const [zoomLevel, setZoomLevel] = useState(1)
  const [viewMode, setViewMode] = useState("image");

  // const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3))
  // const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))

  // Prevent background scrolling when modal is open
  // Remove this entire useEffect block:

  if (!isOpen) return null;

  // Determine if we have a valid document to show
  const hasValidDocument =
    document &&
    document !== "/placeholder.svg" &&
    !document.includes("placeholder.svg") &&
    document.trim() !== "";

  console.log("DocumentPreviewModal - document:", document);
  console.log("DocumentPreviewModal - hasValidDocument:", hasValidDocument);

  return (
    <div
      className="fixed inset-0 z-[60] bg-black bg-opacity-75 flex items-center justify-center p-4 overflow-auto"
      onClick={(e) => {
        // Close modal when clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl my-8 flex flex-col max-h-[calc(100vh-4rem)]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Document Preview
              </h2>
              <p className="text-sm text-gray-600">
                {fileName || "Enhanced Document"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("image")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "image"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Document Image
            </button>
          </div>
        </div>

        {/* Content Area - This is where scrolling should happen */}
        <div className="flex-1 min-h-0">
          {" "}
          {/* min-h-0 is important for flex child to shrink */}
          {viewMode === "image" ? (
            <div className="h-full overflow-auto bg-gray-100 flex items-center justify-center p-4">
              {hasValidDocument ? (
                <div
                  className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-200"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                >
                  <img
                    src={document || "/placeholder.svg"}
                    alt="Document preview"
                    className="max-w-full h-auto block"
                    style={{ aspectRatio: "210/297" }}
                    onLoad={() =>
                      console.log(
                        "Image loaded successfully:",
                        document?.substring(0, 50)
                      )
                    }
                    onError={(e) => {
                      console.error(
                        "Image failed to load:",
                        document?.substring(0, 50)
                      );
                      console.error("Error details:", e);
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <FileText className="w-16 h-16" />
                  <p className="text-lg">No document preview available</p>
                  <p className="text-sm">
                    The document may be processing or in an unsupported format
                  </p>
                  {document && (
                    <div className="text-xs text-gray-500 font-mono break-all max-w-md bg-gray-50 p-2 rounded">
                      <p className="font-semibold mb-1">Debug Info:</p>
                      <p>URL: {document.substring(0, 100)}...</p>
                      <p>Type: {typeof document}</p>
                      <p>Length: {document.length}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full overflow-auto p-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Extracted Text Content
                  </h3>
                  <div className="text-sm text-gray-500">
                    {extractedText?.length || 0} characters
                  </div>
                </div>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-mono bg-gray-50 p-4 rounded-lg border">
                    {extractedText || "No text content available"}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>Document processed and enhanced</div>
            <div className="flex items-center gap-4">
              <span>Quality: High</span>
              <span>Format: Optimized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced document processing to create PDF-quality document optimized for OCR
const autoEnhanceDocument = async (imageData) => {
  return new Promise((resolve) => {
    if (!imageData) {
      console.error("No image data provided to autoEnhanceDocument");
      resolve(imageData);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      try {
        // Validate image dimensions
        if (img.width === 0 || img.height === 0) {
          console.error("Invalid image dimensions");
          resolve(imageData);
          return;
        }

        // Step 1: Create high-resolution A4-sized canvas for better OCR
        const A4_RATIO = 297 / 210; // Height / Width
        const TARGET_WIDTH = 2480; // A4 width at 300 DPI for better OCR
        const TARGET_HEIGHT = Math.round(TARGET_WIDTH * A4_RATIO); // A4 height at 300 DPI

        const a4Canvas = document.createElement("canvas");
        a4Canvas.width = TARGET_WIDTH;
        a4Canvas.height = TARGET_HEIGHT;
        const a4Ctx = a4Canvas.getContext("2d");

        // Fill with pure white background
        a4Ctx.fillStyle = "#FFFFFF";
        a4Ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

        // Step 2: Detect document boundaries
        const documentBounds = await detectDocumentBounds(img);

        // Step 3: Transform and fit document to A4 canvas with high quality
        await transformToA4Document(
          img,
          a4Ctx,
          documentBounds,
          TARGET_WIDTH,
          TARGET_HEIGHT
        );

        // Step 4: Create PDF-quality enhancement optimized for OCR
        const enhancedCanvas = await createPDFQualityDocument(a4Canvas);

        // Convert to high-quality data URL
        const enhancedDataUrl = enhancedCanvas.toDataURL("image/png", 1.0);
        resolve(enhancedDataUrl);
      } catch (error) {
        console.error("Auto enhancement error:", error);
        resolve(imageData);
      }
    };
    img.onerror = (error) => {
      console.error("Image loading error:", error);
      resolve(imageData);
    };
    img.src = imageData;
  });
};

// Create PDF-quality document with optimal OCR preprocessing
const createPDFQualityDocument = async (canvas) => {
  if (!canvas) {
    console.error("No canvas provided to createPDFQualityDocument");
    return canvas;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Could not get 2D context from canvas");
    return canvas;
  }

  let imageData;
  try {
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  } catch (error) {
    console.error("Error getting image data from canvas:", error);
    return canvas;
  }

  if (!imageData || !imageData.data) {
    console.error("Failed to get valid image data");
    return canvas;
  }

  const enhancedCanvas = document.createElement("canvas");
  enhancedCanvas.width = canvas.width;
  enhancedCanvas.height = canvas.height;
  const enhancedCtx = enhancedCanvas.getContext("2d");

  const preprocessedData = await advancedOCRPreprocessing(imageData);

  // Step 2: Apply optimal binarization using Otsu's method
  const binarizedData = await applyOtsuBinarization(preprocessedData);

  // Step 3: Advanced morphological operations for text clarity
  const cleanedData = await advancedMorphologicalCleaning(
    binarizedData,
    canvas.width,
    canvas.height
  );

  // Step 4: Text sharpening and edge enhancement
  const sharpenedData = await enhanceTextEdges(
    cleanedData,
    canvas.width,
    canvas.height
  );

  const finalImageData = enhancedCtx.createImageData(
    canvas.width,
    canvas.height
  );
  finalImageData.data.set(sharpenedData);
  enhancedCtx.putImageData(finalImageData, 0, 0);

  // Add subtle PDF-like styling
  addPDFStyling(enhancedCtx, canvas.width, canvas.height);

  return enhancedCanvas;
};

// Advanced OCR preprocessing with multiple filters
const advancedOCRPreprocessing = async (imageData) => {
  if (!imageData || !imageData.data) {
    console.error("Invalid imageData provided to advancedOCRPreprocessing");
    return imageData;
  }

  const { width, height, data } = imageData;
  if (!data || data.length === 0) {
    console.error("ImageData has no data array");
    return imageData;
  }

  const result = new Uint8ClampedArray(imageData.data.length);

  // Convert to grayscale with enhanced contrast
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];

    // Use weighted grayscale conversion optimized for text
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    // Apply gamma correction for better contrast
    const gamma = 0.8;
    const corrected = 255 * Math.pow(gray / 255, gamma);

    // Enhance contrast using histogram stretching
    const enhanced = Math.min(255, Math.max(0, (corrected - 128) * 1.5 + 128));

    result[i] = enhanced;
    result[i + 1] = enhanced;
    result[i + 2] = enhanced;
    result[i + 3] = imageData.data[i + 3];
  }

  // Apply Gaussian blur to reduce noise before binarization
  return applyAdvancedGaussianBlur(result, width, height);
};

// Advanced Gaussian blur with edge preservation
const applyAdvancedGaussianBlur = (data, width, height) => {
  const result = new Uint8ClampedArray(data.length);
  const kernel = [
    1, 4, 7, 4, 1, 4, 16, 26, 16, 4, 7, 26, 41, 26, 7, 4, 16, 26, 16, 4, 1, 4,
    7, 4, 1,
  ];
  const kernelSum = 273;
  const kernelSize = 5;
  const half = Math.floor(kernelSize / 2);

  for (let y = half; y < height - half; y++) {
    for (let x = half; x < width - half; x++) {
      let sum = 0;
      let kernelIndex = 0;

      for (let ky = -half; ky <= half; ky++) {
        for (let kx = -half; kx <= half; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          sum += data[idx] * kernel[kernelIndex];
          kernelIndex++;
        }
      }

      const idx = (y * width + x) * 4;
      const blurred = Math.round(sum / kernelSum);
      result[idx] = result[idx + 1] = result[idx + 2] = blurred;
      result[idx + 3] = data[idx + 3];
    }
  }

  return result;
};

// Otsu's binarization for optimal threshold selection
const applyOtsuBinarization = async (imageData) => {
  if (!imageData || !imageData.data) {
    console.error("Invalid imageData provided to applyOtsuBinarization");
    return imageData;
  }

  const { width, height, data } = imageData;
  if (!data || data.length === 0) {
    console.error("ImageData has no data array");
    return imageData;
  }

  const result = new Uint8ClampedArray(imageData.data.length);

  // Calculate histogram
  const histogram = new Array(256).fill(0);
  for (let i = 0; i < imageData.data.length; i += 4) {
    histogram[imageData.data[i]]++;
  }

  // Calculate total number of pixels
  const total = width * height;

  // Calculate Otsu's threshold
  let sum = 0;
  for (let i = 0; i < 256; i++) {
    sum += i * histogram[i];
  }

  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let varMax = 0;
  let threshold = 0;

  for (let i = 0; i < 256; i++) {
    wB += histogram[i];
    if (wB === 0) continue;

    wF = total - wB;
    if (wF === 0) break;

    sumB += i * histogram[i];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;

    const varBetween = wB * wF * (mB - mF) * (mB - mF);

    if (varBetween > varMax) {
      varMax = varBetween;
      threshold = i;
    }
  }

  // Apply adaptive threshold with local adjustments
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = imageData.data[idx];

      const localThreshold = calculateLocalThreshold(
        imageData.data,
        x,
        y,
        width,
        height,
        threshold
      );

      // Apply threshold with slight bias towards white for cleaner text
      const binarized = gray > localThreshold ? 255 : 0;

      result[idx] = binarized;
      result[idx + 1] = binarized;
      result[idx + 2] = binarized;
      result[idx + 3] = imageData.data[idx + 3];
    }
  }

  return result;
};

// Calculate local threshold for adaptive binarization
const calculateLocalThreshold = (
  data,
  x,
  y,
  width,
  height,
  globalThreshold
) => {
  const windowSize = 15;
  const half = Math.floor(windowSize / 2);
  let sum = 0;
  let count = 0;

  for (let dy = -half; dy <= half; dy++) {
    for (let dx = -half; dx <= half; dx++) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const idx = (ny * width + nx) * 4;
        sum += data[idx];
        count++;
      }
    }
  }

  const localMean = sum / count;
  const localThreshold = localMean * 0.85; // Slightly below local mean

  // Blend global and local thresholds
  return Math.round(globalThreshold * 0.7 + localThreshold * 0.3);
};

// Advanced morphological operations for text cleaning
const advancedMorphologicalCleaning = async (data, width, height) => {
  // Step 1: Remove small noise with opening operation
  let cleaned = morphologicalOpening(data, width, height);

  // Step 2: Fill small gaps in text with closing operation
  cleaned = morphologicalClosing(cleaned, width, height);

  // Step 3: Remove isolated pixels
  cleaned = removeIsolatedPixels(cleaned, width, height);

  // Step 4: Strengthen text strokes
  cleaned = strengthenTextStrokes(cleaned, width, height);

  return cleaned;
};

// Morphological opening (erosion followed by dilation)
const morphologicalOpening = (data, width, height) => {
  const eroded = morphologicalErosion(data, width, height, 1);
  return morphologicalDilation(eroded, width, height, 1);
};

// Morphological closing (dilation followed by erosion)
const morphologicalClosing = (data, width, height) => {
  const dilated = morphologicalDilation(data, width, height, 1);
  return morphologicalErosion(dilated, width, height, 1);
};

// Morphological erosion
const morphologicalErosion = (data, width, height, iterations) => {
  const result = new Uint8ClampedArray(data);

  for (let iter = 0; iter < iterations; iter++) {
    const temp = new Uint8ClampedArray(result);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;

        // Check 3x3 neighborhood
        let minValue = 255;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nIdx = ((y + dy) * width + (x + dx)) * 4;
            minValue = Math.min(minValue, temp[nIdx]);
          }
        }

        result[idx] = result[idx + 1] = result[idx + 2] = minValue;
        result[idx + 3] = temp[idx + 3];
      }
    }
  }

  return result;
};

// Morphological dilation
const morphologicalDilation = (data, width, height, iterations) => {
  const result = new Uint8ClampedArray(data);

  for (let iter = 0; iter < iterations; iter++) {
    const temp = new Uint8ClampedArray(result);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;

        // Check 3x3 neighborhood
        let maxValue = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nIdx = ((y + dy) * width + (x + dx)) * 4;
            maxValue = Math.max(maxValue, temp[nIdx]);
          }
        }

        result[idx] = result[idx + 1] = result[idx + 2] = maxValue;
        result[idx + 3] = temp[idx + 3];
      }
    }
  }

  return result;
};

// Remove isolated pixels (noise)
const removeIsolatedPixels = (data, width, height) => {
  const result = new Uint8ClampedArray(data);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      if (data[idx] === 0) {
        // Black pixel
        // Count black neighbors
        let blackNeighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nIdx = ((y + dy) * width + (x + dx)) * 4;
            if (data[nIdx] === 0) blackNeighbors++;
          }
        }

        // If isolated (less than 2 black neighbors), make it white
        if (blackNeighbors < 2) {
          result[idx] = result[idx + 1] = result[idx + 2] = 255;
        }
      }
    }
  }

  return result;
};

// Strengthen text strokes for better OCR
const strengthenTextStrokes = (data, width, height) => {
  const result = new Uint8ClampedArray(data);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      if (data[idx] === 255) {
        // White pixel
        // Count black neighbors
        let blackNeighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nIdx = ((y + dy) * width + (x + dx)) * 4;
            if (data[nIdx] === 0) blackNeighbors++;
          }
        }

        // If surrounded by black pixels (likely inside text), make it black
        if (blackNeighbors >= 6) {
          result[idx] = result[idx + 1] = result[idx + 2] = 0;
        }
      }
    }
  }

  return result;
};

// Enhance text edges for crisp appearance
const enhanceTextEdges = async (data, width, height) => {
  const result = new Uint8ClampedArray(data);

  // Apply unsharp masking for text sharpening
  const blurred = applyGaussianBlurForSharpening(data, width, height);

  for (let i = 0; i < data.length; i += 4) {
    const original = data[i];
    const blurredValue = blurred[i];

    // Unsharp mask formula: original + amount * (original - blurred)
    const amount = 1.5;
    const sharpened = Math.min(
      255,
      Math.max(0, original + amount * (original - blurredValue))
    );

    // Ensure pure black or white for text
    const enhanced = sharpened > 127 ? 255 : 0;

    result[i] = enhanced;
    result[i + 1] = enhanced;
    result[i + 2] = enhanced;
    result[i + 3] = data[i + 3];
  }

  return result;
};

// Gaussian blur for sharpening (smaller kernel)
const applyGaussianBlurForSharpening = (data, width, height) => {
  const result = new Uint8ClampedArray(data.length);
  const kernel = [1, 2, 1, 2, 4, 2, 1, 2, 1];
  const kernelSum = 16;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sum = 0;
      let kernelIndex = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          sum += data[idx] * kernel[kernelIndex];
          kernelIndex++;
        }
      }

      const idx = (y * width + x) * 4;
      const blurred = Math.round(sum / kernelSum);
      result[idx] = result[idx + 1] = result[idx + 2] = blurred;
      result[idx + 3] = data[idx + 3];
    }
  }

  return result;
};

// Add PDF-like styling
const addPDFStyling = (ctx, width, height) => {
  // Add very subtle drop shadow for depth
  const shadowOffset = 3;
  const shadowBlur = 6;

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetX = shadowOffset;
  ctx.shadowOffsetY = shadowOffset;

  // Draw a subtle border
  ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, width, height);

  ctx.restore();
};

// Detect document boundaries using advanced edge detection
const detectDocumentBounds = async (img) => {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(img, 0, 0);

  const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
  const { width, height, data } = imageData;

  // Convert to grayscale
  const grayData = new Uint8Array(width * height);
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    );
    grayData[i / 4] = gray;
  }

  // Apply Gaussian blur
  const blurred = applyGaussianBlur(grayData, width, height);

  // Find edges using Canny edge detection
  const edges = cannyEdgeDetection(blurred, width, height);

  // Find document contour
  const documentCorners = findDocumentCorners(edges, width, height);

  if (documentCorners && documentCorners.length === 4) {
    return sortCornersClockwise(documentCorners);
  }

  // Fallback: use image bounds with slight perspective
  const margin = Math.min(width, height) * 0.05;
  return [
    { x: margin, y: margin },
    { x: width - margin, y: margin },
    { x: width - margin, y: height - margin },
    { x: margin, y: height - margin },
  ];
};

// Apply Gaussian blur for noise reduction
const applyGaussianBlur = (data, width, height) => {
  const kernel = [1, 2, 1, 2, 4, 2, 1, 2, 1];
  const kernelSum = 16;
  const result = new Uint8Array(width * height);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sum = 0;
      let kernelIndex = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixelIndex = (y + ky) * width + (x + kx);
          sum += data[pixelIndex] * kernel[kernelIndex];
          kernelIndex++;
        }
      }

      result[y * width + x] = Math.round(sum / kernelSum);
    }
  }

  return result;
};

// Canny edge detection
const cannyEdgeDetection = (data, width, height) => {
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  const gradientX = new Float32Array(width * height);
  const gradientY = new Float32Array(width * height);
  const magnitude = new Float32Array(width * height);

  // Calculate gradients
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0,
        gy = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = (y + ky) * width + (x + kx);
          const kernelIdx = (ky + 1) * 3 + (kx + 1);
          gx += data[idx] * sobelX[kernelIdx];
          gy += data[idx] * sobelY[kernelIdx];
        }
      }

      const idx = y * width + x;
      gradientX[idx] = gx;
      gradientY[idx] = gy;
      magnitude[idx] = Math.sqrt(gx * gx + gy * gy);
    }
  }

  // Apply thresholding
  const edges = new Uint8Array(width * height);
  const highThreshold = 80;
  const lowThreshold = 40;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const mag = magnitude[idx];

      if (mag > highThreshold) {
        edges[idx] = 255;
      } else if (mag > lowThreshold) {
        // Check if connected to strong edge
        let hasStrongNeighbor = false;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nIdx = (y + dy) * width + (x + dx);
            if (magnitude[nIdx] > highThreshold) {
              hasStrongNeighbor = true;
              break;
            }
          }
          if (hasStrongNeighbor) break;
        }
        if (hasStrongNeighbor) edges[idx] = 255;
      }
    }
  }

  return edges;
};

// Find document corners using Hough transform and contour analysis
const findDocumentCorners = (edges, width, height) => {
  // Find lines using simplified Hough transform
  const lines = findLines(edges, width, height);

  if (lines.length >= 4) {
    // Find intersections of lines to get corners
    const corners = findLineIntersections(lines, width, height);

    if (corners.length >= 4) {
      // Filter and select the best 4 corners that form a quadrilateral
      return selectBestQuadrilateral(corners, width, height);
    }
  }

  // Fallback: find corners using contour analysis
  return findCornersFromContours(edges, width, height);
};

// Simplified Hough transform to find lines
const findLines = (edges, width, height) => {
  const lines = [];
  const rhoMax = Math.sqrt(width * width + height * height);
  const rhoStep = 2;
  const thetaStep = Math.PI / 180; // 1 degree
  const threshold = Math.min(width, height) * 0.3;

  const accumulator = new Map();

  // Hough transform
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (edges[y * width + x] === 255) {
        for (let theta = 0; theta < Math.PI; theta += thetaStep) {
          const rho = x * Math.cos(theta) + y * Math.sin(theta);
          const rhoIndex = Math.round(rho / rhoStep);
          const thetaIndex = Math.round(theta / thetaStep);
          const key = `${rhoIndex},${thetaIndex}`;

          accumulator.set(key, (accumulator.get(key) || 0) + 1);
        }
      }
    }
  }

  // Find peaks in accumulator
  for (const [key, votes] of accumulator) {
    if (votes > threshold) {
      const [rhoIndex, thetaIndex] = key.split(",").map(Number);
      const rho = rhoIndex * rhoStep;
      const theta = thetaIndex * thetaStep;
      lines.push({ rho, theta, votes });
    }
  }

  // Sort by votes and return top lines
  return lines.sort((a, b) => b.votes - a.votes).slice(0, 10);
};

// Find intersections between lines
const findLineIntersections = (lines, width, height) => {
  const intersections = [];

  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const line1 = lines[i];
      const line2 = lines[j];

      // Calculate intersection point
      const cos1 = Math.cos(line1.theta);
      const sin1 = Math.sin(line1.theta);
      const cos2 = Math.cos(line2.theta);
      const sin2 = Math.sin(line2.theta);

      const det = cos1 * sin2 - sin1 * cos2;
      if (Math.abs(det) > 0.1) {
        // Lines are not parallel
        const x = (sin2 * line1.rho - sin1 * line2.rho) / det;
        const y = (cos1 * line2.rho - cos2 * line1.rho) / det;

        // Check if intersection is within image bounds
        if (x >= 0 && x < width && y >= 0 && y < height) {
          intersections.push({ x, y });
        }
      }
    }
  }

  return intersections;
};

// Select the best 4 corners that form a quadrilateral
const selectBestQuadrilateral = (corners, width, height) => {
  if (corners.length < 4) return corners;

  // Find the 4 corners that are most likely to be document corners
  // by finding corners that are roughly at the corners of the image
  const imageCenter = { x: width / 2, y: height / 2 };

  // Divide into quadrants and find the corner closest to each quadrant
  const quadrants = [
    { x: width * 0.25, y: height * 0.25 }, // Top-left
    { x: width * 0.75, y: height * 0.25 }, // Top-right
    { x: width * 0.75, y: height * 0.75 }, // Bottom-right
    { x: width * 0.25, y: height * 0.75 }, // Bottom-left
  ];

  const selectedCorners = [];

  for (const quadrant of quadrants) {
    let closestCorner = null;
    let minDistance = Number.POSITIVE_INFINITY;

    for (const corner of corners) {
      const distance = Math.sqrt(
        Math.pow(corner.x - quadrant.x, 2) + Math.pow(corner.y - quadrant.y, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestCorner = corner;
      }
    }

    if (closestCorner) {
      selectedCorners.push(closestCorner);
    }
  }

  return selectedCorners.length === 4 ? selectedCorners : corners.slice(0, 4);
};

// Fallback method to find corners from contours
const findCornersFromContours = (edges, width, height) => {
  // Find the largest contour
  const contours = findContours(edges, width, height);

  if (contours.length > 0) {
    const largestContour = contours.reduce((max, contour) =>
      contour.length > max.length ? contour : max
    );

    // Approximate contour to polygon
    const epsilon = 0.02 * calculatePerimeter(largestContour);
    const approx = approximatePolygon(largestContour, epsilon);

    if (approx.length >= 4) {
      return approx.slice(0, 4);
    }
  }

  // Final fallback: use image corners with slight inset
  const margin = Math.min(width, height) * 0.05;
  return [
    { x: margin, y: margin },
    { x: width - margin, y: margin },
    { x: width - margin, y: height - margin },
    { x: margin, y: height - margin },
  ];
};

// Find contours in edge image
const findContours = (edges, width, height) => {
  const contours = [];
  const visited = new Uint8Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (edges[idx] === 255 && !visited[idx]) {
        const contour = traceContour(edges, visited, x, y, width, height);
        if (contour.length > 100) {
          // Minimum contour size
          contours.push(contour);
        }
      }
    }
  }

  return contours.sort((a, b) => b.length - a.length); // Sort by size
};

// Trace contour starting from a point
const traceContour = (edges, visited, startX, startY, width, height) => {
  const contour = [];
  const stack = [{ x: startX, y: startY }];

  while (stack.length > 0) {
    const { x, y } = stack.pop();
    const idx = y * width + x;

    if (
      x < 0 ||
      x >= width ||
      y < 0 ||
      y >= height ||
      visited[idx] ||
      edges[idx] !== 255
    ) {
      continue;
    }

    visited[idx] = 1;
    contour.push({ x, y });

    // Add 8-connected neighbors
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        stack.push({ x: x + dx, y: y + dy });
      }
    }
  }

  return contour;
};

// Calculate perimeter of contour
const calculatePerimeter = (contour) => {
  let perimeter = 0;
  for (let i = 0; i < contour.length; i++) {
    const current = contour[i];
    const next = contour[(i + 1) % contour.length];
    const dx = next.x - current.x;
    const dy = next.y - current.y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }
  return perimeter;
};

// Approximate polygon using Douglas-Peucker algorithm
const approximatePolygon = (contour, epsilon) => {
  if (contour.length < 3) return contour;

  const start = contour[0];
  const end = contour[contour.length - 1];
  let maxDistance = 0;
  let maxIndex = 0;

  for (let i = 1; i < contour.length - 1; i++) {
    const distance = pointToLineDistance(contour[i], start, end);
    if (distance > maxDistance) {
      maxDistance = distance;
      maxIndex = i;
    }
  }

  if (maxDistance > epsilon) {
    const left = approximatePolygon(contour.slice(0, maxIndex + 1), epsilon);
    const right = approximatePolygon(contour.slice(maxIndex), epsilon);
    return [...left.slice(0, -1), ...right];
  } else {
    return [start, end];
  }
};

// Calculate distance from point to line
const pointToLineDistance = (point, lineStart, lineEnd) => {
  const A = lineEnd.y - lineStart.y;
  const B = lineStart.x - lineEnd.x;
  const C = lineEnd.x * lineStart.y - lineStart.x * lineEnd.y;
  return Math.abs(A * point.x + B * point.y + C) / Math.sqrt(A * A + B * B);
};

// Sort corners in clockwise order starting from top-left
const sortCornersClockwise = (corners) => {
  if (corners.length !== 4) return corners;

  // Find center point
  const centerX = corners.reduce((sum, p) => sum + p.x, 0) / 4;
  const centerY = corners.reduce((sum, p) => sum + p.y, 0) / 4;

  // Sort by angle from center
  const sorted = corners
    .map((corner) => ({
      ...corner,
      angle: Math.atan2(corner.y - centerY, corner.x - centerX),
    }))
    .sort((a, b) => a.angle - b.angle);

  // Find top-left corner (minimum x + y)
  const topLeft = sorted.reduce((min, p) =>
    p.x + p.y < min.x + min.y ? p : min
  );
  const startIndex = sorted.indexOf(topLeft);

  // Return in clockwise order: top-left, top-right, bottom-right, bottom-left
  return [
    sorted[startIndex],
    sorted[(startIndex + 1) % 4],
    sorted[(startIndex + 2) % 4],
    sorted[(startIndex + 3) % 4],
  ];
};

// Transform document to fit A4 canvas with proper perspective correction
const transformToA4Document = async (
  sourceImg,
  a4Ctx,
  corners,
  targetWidth,
  targetHeight
) => {
  const srcCorners = corners;
  const dstCorners = [
    { x: 0, y: 0 },
    { x: targetWidth, y: 0 },
    { x: targetWidth, y: targetHeight },
    { x: 0, y: targetHeight },
  ];

  // Apply perspective transformation using homography
  try {
    const matrix = calculateHomography(srcCorners, dstCorners);
    applyHomographyTransform(
      sourceImg,
      a4Ctx,
      matrix,
      targetWidth,
      targetHeight
    );
  } catch (error) {
    console.error(
      "Perspective transformation failed, using simple scaling:",
      error
    );
    // Fallback: simple scaling and centering
    const scale =
      Math.min(targetWidth / sourceImg.width, targetHeight / sourceImg.height) *
      0.95;
    const offsetX = (targetWidth - sourceImg.width * scale) / 2;
    const offsetY = (targetHeight - sourceImg.height * scale) / 2;
    a4Ctx.drawImage(
      sourceImg,
      offsetX,
      offsetY,
      sourceImg.width * scale,
      sourceImg.height * scale
    );
  }
};

// Calculate homography matrix for perspective transformation
const calculateHomography = (src, dst) => {
  const scaleX = (dst[1].x - dst[0].x) / (src[1].x - src[0].x);
  const scaleY = (dst[3].y - dst[0].y) / (src[3].y - src[0].y);
  const translateX = dst[0].x - src[0].x * scaleX;
  const translateY = dst[0].y - src[0].y * scaleY;

  return {
    a: scaleX,
    b: 0,
    c: translateX,
    d: 0,
    e: scaleY,
    f: translateY,
    g: 0,
    h: 0,
    i: 1,
  };
};

// Apply homography transformation
const applyHomographyTransform = (sourceImg, ctx, matrix, width, height) => {
  ctx.save();
  ctx.setTransform(matrix.a, matrix.d, matrix.b, matrix.e, matrix.c, matrix.f);
  ctx.drawImage(sourceImg, 0, 0);
  ctx.restore();
};

const ScanUpload = ({ fileData, action, onClose }) => {
  const isUploadMode = action === "Upload";
  const isScanMode = action === "Scan";

  const isEditMode = fileData && fileData.isEditMode;


  const [currentStep, setCurrentStep] = useState(0);
  const [type, setType] = useState(fileData?.type || "");
  const [file, setFile] = useState(fileData?.file || null);
  const [fileName, setFileName] = useState(fileData?.file?.name || "");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(
    fileData?.department || ""
  );
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    fileData?.category || ""
  );
  const [subject, setSubject] = useState(fileData?.subject || "");
  const [date, setDate] = useState(
    fileData?.date || new Date().toISOString().split("T")[0]
  );
  const [diaryNo, setDiaryNo] = useState(fileData?.diaryNo || "");
  const [from, setFrom] = useState(fileData?.from || "");
  const [disposal, setDisposal] = useState(fileData?.disposal || "");
  const [status, setStatus] = useState(fileData?.status || "");

  // Camera and image processing states
  const [processedImage, setProcessedImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [cameraFacingMode, setCameraFacingMode] = useState("environment");
  const [isFocusing, setIsFocusing] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [isTorchAvailable, setIsTorchAvailable] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isAutoFocusEnabled, setIsAutoFocusEnabled] = useState(true);
  const [cameraTrack, setCameraTrack] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionFailed, setExtractionFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const webcamRef = useRef(null);
  const videoRef = useRef(null);

  const showNotification = useCallback((type, message, duration = 3000) => {
    setNotification({ type, message });
    if (duration) {
      setTimeout(() => {
        setNotification(null);
      }, duration);
    }
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!type) return;

      try {
        const response = await fetch(`/api/department?type=${type}`, {
          method: "GET",
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Failed to fetch departments", error);
        showNotification("error", "Failed to load departments");
      }
    };

    if (type) fetchDepartments();
  }, [type, showNotification]);

  useEffect(() => {
    if (selectedDepartment) {
      const department = departments.find(
        (dept) => dept._id === selectedDepartment
      );
      setCategories(department?.categories || []);
    }
  }, [selectedDepartment, departments]);

  useEffect(() => {
    return () => {
      if (cameraTrack) {
        cameraTrack.stop();
      }
    };
  }, [cameraTrack]);

  const turnOffTorch = useCallback(async () => {
    if (cameraTrack && isTorchAvailable && isTorchOn) {
      try {
        await cameraTrack.applyConstraints({
          advanced: [{ torch: false }],
        });
        setIsTorchOn(false);
      } catch (error) {
        console.error("Error turning off torch:", error);
      }
    }
  }, [cameraTrack, isTorchAvailable, isTorchOn]);

  const initializeCamera = useCallback(async () => {
    try {
      if (webcamRef.current && webcamRef.current.video) {
        const stream = webcamRef.current.video.srcObject;

        if (stream) {
          const videoTrack = stream.getVideoTracks()[0];
          setCameraTrack(videoTrack);

          const capabilities = videoTrack.getCapabilities
            ? videoTrack.getCapabilities()
            : {};
          setIsTorchAvailable(capabilities.torch || false);

          // Apply auto-focus if available
          if (
            capabilities.focusMode &&
            capabilities.focusMode.includes("continuous")
          ) {
            try {
              await videoTrack.applyConstraints({
                advanced: [{ focusMode: "continuous" }],
              });
            } catch (error) {
              console.log("Auto-focus not supported");
            }
          }
        }
      }
    } catch (error) {
      console.error("Error initializing camera:", error);
    }
  }, []);

  const startCamera = useCallback(async () => {
    setNotification(null);

    try {
      showNotification("info", "Requesting camera access...", 0);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacingMode,
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
        },
      });

      setNotification(null);
      setHasCameraPermission(true);
      setIsCameraActive(true);
      setCurrentStep(0);

      setTimeout(() => {
        initializeCamera();
      }, 500);
    } catch (error) {
      console.warn("Camera access error (handled):", error.name);
      setHasCameraPermission(false);
      setIsCameraActive(false);

      showNotification(
        "error",
        "Camera access denied. Please allow camera access and try again.",
        2000
      );
    }
  }, [cameraFacingMode, showNotification, initializeCamera]);

  const retryCamera = useCallback(() => {
    showNotification(
      "error",
      "Please enable camera permissions in your browser settings and refresh the page.",
      3000
    );
  }, [showNotification]);

  // Enhanced document processing for upload mode
  const enhanceDocumentForReadability = async (imageData) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = async () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");

          // Draw original image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Get image data for processing
          let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          // Apply gentle enhancement
          imgData = clearBackgroundAndEnhanceText(imgData);

          ctx.putImageData(imgData, 0, 0);
          resolve(canvas.toDataURL("image/jpeg", 0.9));
        } catch (error) {
          console.error("Image processing error:", error);
          resolve(imageData);
        }
      };
      img.src = imageData;
    });
  };

  const clearBackgroundAndEnhanceText = (imageData) => {
    const data = new Uint8ClampedArray(imageData.data);
    const width = imageData.width;
    const height = imageData.height;
    const result = new Uint8ClampedArray(data.length);

    // First pass: identify background color (most common color)
    const colorCounts = {};
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const key = `${r},${g},${b}`;
      colorCounts[key] = (colorCounts[key] || 0) + 1;
    }

    // Find most common color (background)
    const backgroundKey = Object.keys(colorCounts).reduce((a, b) =>
      colorCounts[a] > colorCounts[b] ? a : b
    );
    const [bgR, bgG, bgB] = backgroundKey.split(",").map(Number);

    // Second pass: enhance contrast between text and background
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Calculate distance from background color
      const dist = Math.sqrt(
        Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
      );

      // If pixel is significantly different from background (likely text)
      if (dist > 50) {
        // Slightly darken text pixels for better contrast
        result[i] = Math.max(0, r * 0.9);
        result[i + 1] = Math.max(0, g * 0.9);
        result[i + 2] = Math.max(0, b * 0.9);
      } else {
        // Lighten background pixels
        result[i] = Math.min(255, bgR * 1.1);
        result[i + 1] = Math.min(255, bgG * 1.1);
        result[i + 2] = Math.min(255, bgB * 1.1);
      }
      result[i + 3] = data[i + 3]; // Preserve alpha
    }

    return new ImageData(result, width, height);
  };

  // Updated text extraction function for upload mode
  const extractTextFromDocument = async (file) => {
    setIsExtracting(true);
    setExtractionFailed(false);

    try {
      showNotification("info", "Extracting text from document...", 0);

      let extractedText = "";

      if (file.type === "application/pdf") {
        // Handle PDF files
        await loadLibraries();

        const arrayBuffer = await file.arrayBuffer();
        const typedArray = new Uint8Array(arrayBuffer);

        showNotification("info", "Loading PDF...", 0);
        const pdf = await window.pdfjsLib.getDocument({ data: typedArray })
          .promise;

        let fullText = "";
        const totalPages = pdf.numPages;

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          showNotification(
            "info",
            `Processing page ${pageNum} of ${totalPages}...`,
            0
          );

          const page = await pdf.getPage(pageNum);

          // First try to extract text directly
          const textContent = await page.getTextContent();
          let pageText = textContent.items
            .map((item) => item.str)
            .join(" ")
            .trim();

          // If no text found or very little text, use OCR
          if (!pageText || pageText.length < 50) {
            showNotification("info", `OCR processing page ${pageNum}...`, 0);

            // Render page as canvas for OCR
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({
              canvasContext: context,
              viewport: viewport,
            }).promise;

            // Convert canvas to image and run OCR
            const imageData = canvas.toDataURL("image/png");

            try {
              const {
                data: { text },
              } = await window.Tesseract.recognize(imageData, "eng", {
                logger: (m) => {
                  if (m.status === "recognizing text") {
                    const ocrProgress = Math.round(m.progress * 100);
                    showNotification(
                      "info",
                      `OCR processing page ${pageNum}: ${ocrProgress}%`,
                      0
                    );
                  }
                },
              });
              pageText = text.trim();
            } catch (ocrError) {
              console.warn(`OCR failed for page ${pageNum}:`, ocrError);
              pageText = pageText || `[OCR failed for page ${pageNum}]`;
            }
          }

          if (pageText) {
            fullText += `--- Page ${pageNum} ---\n${pageText}\n\n`;
          }
        }

        extractedText = fullText;
      } else if (file.type.startsWith("image/")) {
        // Handle image files with OCR
        await loadLibraries();

        showNotification("info", "Processing image with OCR...", 0);

        const imageUrl = URL.createObjectURL(file);

        try {
          const {
            data: { text },
          } = await window.Tesseract.recognize(imageUrl, "eng", {
            logger: (m) => {
              if (m.status === "recognizing text") {
                const ocrProgress = Math.round(m.progress * 100);
                showNotification("info", `OCR processing: ${ocrProgress}%`, 0);
              }
            },
          });
          extractedText = text.trim();
        } finally {
          URL.revokeObjectURL(imageUrl);
        }
      } else {
        throw new Error(
          "Unsupported file type. Please use PDF or image files."
        );
      }

      setExtractedText(extractedText || "");
      setExtractionFailed(false);

      if (extractedText && !subject) {
        const extractedSubject = extractSubject(extractedText);
        if (extractedSubject) {
          setSubject(extractedSubject);
        }
      }

      showNotification("success", "Text extracted successfully");
      return extractedText;
    } catch (error) {
      console.error("Text extraction failed:", error);
      setExtractionFailed(true);
      showNotification("error", `Text extraction failed: ${error.message}`);
      return "";
    } finally {
      setIsExtracting(false);
    }
  };

  // Handle file change for upload mode
  const handleFileChange = useCallback(async (file) => {
    if (!file) return;

    setIsProcessing(true);
    setFile(file);
    setFileName(file.name);

    try {
      // For images, create object URL and enhance for display
      if (file.type.startsWith("image/")) {
        // Create object URL for immediate preview
        const objectUrl = URL.createObjectURL(file);
        setProcessedImage(objectUrl);

        // Also create enhanced version for better readability
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const enhanced = await enhanceDocumentForReadability(
              e.target.result
            );
            // Keep both: object URL for immediate preview, enhanced for better quality
            setProcessedImage(enhanced || objectUrl);
          } catch (error) {
            console.error("Enhancement failed, using original:", error);
            // Fallback to object URL if enhancement fails
            setProcessedImage(objectUrl);
          }
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        // For PDFs, we'll need to render first page as preview
        await renderPDFPreview(file);
      }

      // Extract text from uploaded file
      await extractTextFromDocument(file);
    } catch (error) {
      console.error("File processing error:", error);
      showNotification("error", `File processing failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleRetake = useCallback(() => {
    // Stop any previous camera tracks
    if (cameraTrack) {
      cameraTrack.stop();
      setCameraTrack(null);
    }
    setIsCameraActive(false);
    setHasCameraPermission(null); // Reset permission state
    setTimeout(() => {
      startCamera();
    }, 200);
  }, [cameraTrack, startCamera]);

  // Render PDF first page as preview
  const renderPDFPreview = async (file) => {
    try {
      await loadLibraries();

      const arrayBuffer = await file.arrayBuffer();
      const typedArray = new Uint8Array(arrayBuffer);

      const pdf = await window.pdfjsLib.getDocument({ data: typedArray })
        .promise;
      const page = await pdf.getPage(1); // Get first page

      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      const previewDataUrl = canvas.toDataURL("image/png");
      setProcessedImage(previewDataUrl);
    } catch (error) {
      console.error("PDF preview generation failed:", error);
      setProcessedImage("/placeholder.svg?height=800&width=600");
    }
  };

  // Dropzone config (for upload mode)
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) handleFileChange(file);
    },
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxSize: 10485760, // 10MB limit
    multiple: false,
    onDropRejected: (fileRejections) => {
      if (fileRejections.length > 0) {
        const { errors } = fileRejections[0];
        if (errors[0]?.code === "file-too-large") {
          showNotification("error", "File is too large. Maximum size is 10MB.");
        } else {
          showNotification(
            "error",
            "Invalid file. Please upload a PDF or image file."
          );
        }
      }
    },
  });

  // Toggle torch
  const toggleTorch = useCallback(async () => {
    if (!cameraTrack || !isTorchAvailable) return;

    try {
      await cameraTrack.applyConstraints({
        advanced: [{ torch: !isTorchOn }],
      });
      setIsTorchOn(!isTorchOn);
    } catch (error) {
      console.error("Error toggling torch:", error);
      showNotification("error", "Unable to control flash");
    }
  }, [cameraTrack, isTorchAvailable, isTorchOn, showNotification]);

  // Toggle auto focus
  const toggleAutoFocus = useCallback(async () => {
    if (!cameraTrack) return;

    try {
      const newAutoFocusState = !isAutoFocusEnabled;
      await cameraTrack.applyConstraints({
        advanced: [{ focusMode: newAutoFocusState ? "continuous" : "manual" }],
      });
      setIsAutoFocusEnabled(newAutoFocusState);
    } catch (error) {
      console.error("Error toggling auto-focus:", error);
    }
  }, [cameraTrack, isAutoFocusEnabled]);

  const captureAndProcess = useCallback(async () => {
    if (!webcamRef.current) return;

    setIsProcessing(true);
    showNotification("info", "Creating Enhanced document...", 0);

    try {
      // Capture with highest quality
      const imageSrc = webcamRef.current.getScreenshot({
        width: 1920,
        height: 1080,
        screenshotFormat: "image/jpeg",
        screenshotQuality: 1.0,
      });

      if (!imageSrc) throw new Error("Failed to capture image");

      // Validate the captured image
      if (typeof imageSrc !== "string" || !imageSrc.startsWith("data:image/")) {
        throw new Error("Invalid image data captured");
      }

      // Turn off flash immediately after capture
      await turnOffTorch();

      // Stop camera
      if (cameraTrack) {
        cameraTrack.stop();
        setCameraTrack(null);
      }
      setIsCameraActive(false);

      // Enhance the image to create proper A4 document
      const enhanced = await autoEnhanceDocument(imageSrc);

      if (!enhanced) {
        throw new Error("Failed to enhance document");
      }

      setEnhancedImage(enhanced);

      // Convert to file
      const response = await fetch(enhanced);
      if (!response.ok) {
        throw new Error("Failed to convert enhanced image to blob");
      }

      const blob = await response.blob();
      const sizeInMB = (blob.size / (1024 * 1024)).toFixed(2);
      console.log(`Enhanced file size: ${sizeInMB} MB`); // Log size in MB
      const imageFile = new File([blob], `a4_scan_${Date.now()}.png`, {
        type: "image/png",
      });
      setFile(imageFile);
      setFileName(`a4_scan_${Date.now()}.png`);

      showNotification("success", "Scanned document created successfully!");

      // Automatically start text extraction and go directly to form
      await extractTextAndGoToForm(enhanced);
    } catch (error) {
      console.error("Capture error:", error);
      showNotification("error", `Capture failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [cameraTrack, showNotification, turnOffTorch]);

  // Extract text from enhanced image with optimal OCR settings
  const extractText = useCallback(async () => {
    if (!enhancedImage) return;

    setIsExtracting(true);
    setExtractionFailed(false);

    try {
      showNotification(
        "info",
        "Extracting text from PDF-quality document...",
        0
      );

      await loadLibraries();

      const {
        data: { text },
      } = await window.Tesseract.recognize(enhancedImage, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            const ocrProgress = Math.round(m.progress * 100);
            showNotification("info", `OCR processing: ${ocrProgress}%`, 0);
          }
        },
        tessedit_pageseg_mode: window.Tesseract.PSM.SINGLE_BLOCK,
        tessedit_ocr_engine_mode: window.Tesseract.OEM.LSTM_ONLY,
        tessedit_char_whitelist:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?@#$%^&*()_+-=[]{}|;':\"<>?/~` \n\r\t",
        preserve_interword_spaces: "1",
        tessedit_do_invert: "0",
        tessedit_create_hocr: "0",
        tessedit_create_tsv: "0",
        user_defined_dpi: "300",
      });

      setExtractedText(text.trim() || "");

      if (text.trim()) {
        const extractedSubject = extractSubject(text.trim());
        if (extractedSubject && !subject) {
          setSubject(extractedSubject);
        }
      }

      setCurrentStep(2);
      showNotification("success", "Text extracted with high accuracy!");
    } catch (error) {
      console.error("Text extraction failed:", error);
      setExtractionFailed(true);
      showNotification("error", `Text extraction failed: ${error.message}`);
    } finally {
      setIsExtracting(false);
    }
  }, [
    enhancedImage,
    subject,
    showNotification,
    setExtractedText,
    setSubject,
    setCurrentStep,
  ]);

  const extractTextAndGoToForm = useCallback(
    async (enhancedImageSrc) => {
      if (!enhancedImageSrc) return;

      setIsExtracting(true);
      setExtractionFailed(false);

      try {
        showNotification("info", "Extracting text and preparing form...", 0);

        await loadLibraries();

        const {
          data: { text },
        } = await window.Tesseract.recognize(enhancedImageSrc, "eng", {
          logger: (m) => {
            if (m.status === "recognizing text") {
              const ocrProgress = Math.round(m.progress * 100);
              showNotification("info", `Processing: ${ocrProgress}%`, 0);
            }
          },
          tessedit_pageseg_mode: window.Tesseract.PSM.SINGLE_BLOCK,
          tessedit_ocr_engine_mode: window.Tesseract.OEM.LSTM_ONLY,
          tessedit_char_whitelist:
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?@#$%^&*()_+-=[]{}|;':\"<>?/~` \n\r\t",
          preserve_interword_spaces: "1",
          tessedit_do_invert: "0",
          tessedit_create_hocr: "0",
          tessedit_create_tsv: "0",
          user_defined_dpi: "300",
        });

        setExtractedText(text.trim() || "");

        // Auto-fill subject if text was extracted and subject is empty
        if (text.trim()) {
          const extractedSubject = extractSubject(text.trim());
          if (extractedSubject && !subject) {
            setSubject(extractedSubject);
          }
        }

        // Go directly to form completion step (step 3)
        setCurrentStep(3);
        showNotification("success", "Text extracted! Complete the form below.");
      } catch (error) {
        console.error("Text extraction failed:", error);
        setExtractionFailed(true);
        // On failure, go to step 1 to show enhanced image and manual options
        setCurrentStep(1);
        showNotification(
          "error",
          "Text extraction failed. Please complete the form manually."
        );
      } finally {
        setIsExtracting(false);
      }
    },
    [subject, showNotification, setExtractedText, setSubject, setCurrentStep]
  );

  // Enhanced subject extraction
  const extractSubject = (text) => {
    if (!text) return "Document";

    const lines = text.split("\n").filter((line) => line.trim().length > 0);

    const subjectPatterns = [
      /\b(?:subject|re|regarding|sub|topic|matter)[:;]\s*(.*)/i,
      /\b(?:sub|subj)[-:]?\s*(.*)/i,
      /\b(?:regarding|ref|reference)[:;]\s*(.*)/i,
    ];

    for (const line of lines) {
      for (const pattern of subjectPatterns) {
        const match = line.match(pattern);
        if (match && match[1] && match[1].trim().length > 0) {
          return match[1].trim();
        }
      }
    }

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.length === 0) continue;
      if (/^\d{1,2}[/\-.]\d{1,2}[/\-.]\d{2,4}/.test(trimmedLine)) continue;
      if (
        /^[A-Za-z0-9\s,]+,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}/.test(trimmedLine)
      )
        continue;
      if (
        /^(to|from|date|ref|reference|through|copy to|cc|bcc|attachment[s]?|enclosure[s]?):/i.test(
          trimmedLine
        )
      )
        continue;

      if (trimmedLine.length > 10) {
        return trimmedLine.substring(0, 100);
      }
    }

    return lines.length > 0 ? lines[0].trim().substring(0, 100) : "Document";
  };

  // Load libraries
  const loadLibraries = async () => {
    if (typeof window !== "undefined") {
      if (!window.pdfjsLib) {
        const pdfScript = document.createElement("script");
        pdfScript.src =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        document.head.appendChild(pdfScript);

        await new Promise((resolve) => {
          pdfScript.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
            resolve(true);
          };
        });
      }

      if (!window.Tesseract) {
        const tesseractScript = document.createElement("script");
        tesseractScript.src =
          "https://unpkg.com/tesseract.js@4.1.1/dist/tesseract.min.js";
        document.head.appendChild(tesseractScript);

        await new Promise((resolve) => {
          tesseractScript.onload = resolve;
        });
      }
    }
  };

  // Copy text to clipboard
  const copyToClipboard = useCallback(() => {
    if (!extractedText) return;

    navigator.clipboard
      .writeText(extractedText)
      .then(() => showNotification("success", "Text copied!"))
      .catch(() => showNotification("error", "Failed to copy text"));
  }, [extractedText, showNotification]);

  // Toggle camera facing mode
  const toggleCameraFacing = useCallback(() => {
    setCameraFacingMode((prev) =>
      prev === "environment" ? "user" : "environment"
    );
  }, []);

  // Zoom controls
  const increaseZoom = useCallback(
    () => setZoomLevel((prev) => Math.min(prev + 0.2, 3)),
    []
  );
  const decreaseZoom = useCallback(
    () => setZoomLevel((prev) => Math.max(prev - 0.2, 1)),
    []
  );

  // Form submission
   const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);

      // Update validation - for edit mode, we don't need file validation
      if (isEditMode) {
        // For edit mode, only check required metadata fields
        const missingFields = [];
        if (!selectedDepartment) missingFields.push("Department");
        if (!subject) missingFields.push("Subject");
        if (!diaryNo) missingFields.push("Diary No");
        if (!from) missingFields.push("From");
        if (!disposal) missingFields.push("Disposal");
        if (!status) missingFields.push("Status");
        
        if (missingFields.length > 0) {
          showNotification("error", `Please fill required fields: ${missingFields.join(", ")}`);
          setIsLoading(false);
          return;
        }
      } else {
        // Original validation for new documents
        if (
          (!file && !enhancedImage) ||
          !selectedDepartment ||
          !subject ||
          !diaryNo ||
          !from ||
          !disposal ||
          !status
        ) {
          showNotification("error", "Please fill all required fields");
          setIsLoading(false);
          return;
        }
      }

      const formData = new FormData();

      try {
        // Handle edit mode differently
        if (isEditMode) {
          // Debug: Log the values being sent
          console.log("Edit mode values:", {
            type,
            selectedDepartment,
            selectedCategory,
            subject,
            date,
            diaryNo,
            from,
            disposal,
            status
          });

          // For edit mode, send metadata regardless of file replacement
          // Always send metadata for edit - ensure no empty values
          formData.append("type", type || "");
          formData.append("department", selectedDepartment || "");
          formData.append("category", selectedCategory || "");
          formData.append("subject", subject || "");
          formData.append("date", date || "");
          formData.append("diaryNo", diaryNo || "");
          formData.append("from", from || "");
          formData.append("disposal", disposal || "");
          formData.append("status", status || "");
          formData.append("extractedText", extractedText || "");
          formData.append("fileName", fileName || subject || "document");
          
          // Only append file if user uploaded a new one
          if (file) {
            // User uploaded a new file during edit
            if (file.type === "application/pdf") {
              formData.append("file", file);
              formData.append("replaceFile", "true"); // Flag to indicate file replacement
            } else if (file.type.startsWith("image/")) {
              const imageUrl = processedImage || URL.createObjectURL(file);
              const pdfBlob = await convertImageToPdf(imageUrl);
              formData.append("file", pdfBlob, `${fileName || subject || "updated_image"}.pdf`);
              formData.append("replaceFile", "true"); // Flag to indicate file replacement
            }
          } else {
            // No new file - just updating metadata
            formData.append("replaceFile", "false");
          }
        } else {
          // Your existing file handling logic for new documents
          if (enhancedImage) {
            const pdfBlob = await convertImageToPdf(enhancedImage);
            const finalFileName = fileName || subject || "a4_scanned_document";
            formData.append("file", pdfBlob, `${finalFileName}.pdf`);
            formData.append("fileName", finalFileName);
          } else if (file) {
            if (file.type === "application/pdf") {
              formData.append("file", file);
              formData.append("fileName", fileName || subject || "uploaded_document");
            } else if (file.type.startsWith("image/")) {
              const imageUrl = processedImage || URL.createObjectURL(file);
              const pdfBlob = await convertImageToPdf(imageUrl);
              const finalFileName = fileName || subject || "uploaded_image";
              formData.append("file", pdfBlob, `${finalFileName}.pdf`);
              formData.append("fileName", finalFileName);
            } else {
              throw new Error("Unsupported file type");
            }
          } else {
            throw new Error("No file or scan data available");
          }

          formData.append("type", type);
          formData.append("department", selectedDepartment);
          formData.append("category", selectedCategory);
          formData.append("subject", subject);
          formData.append("date", date);
          formData.append("diaryNo", diaryNo);
          formData.append("from", from);
          formData.append("disposal", disposal);
          formData.append("status", status);
          formData.append("extractedText", extractedText);
        }

        // Use different method and URL for edit vs create
        const method = isEditMode ? "PUT" : "POST";
        const url = isEditMode ? `/api/scanupload/${fileData._id}` : "/api/scanupload";

        showNotification("info", isEditMode ? "Updating document..." : "Saving document...", 0);

        const response = await fetch(url, { method, body: formData });

        // ... rest of your existing response handling ...
        
        if (!response.ok) {
          let errorMessage = "HTTP error";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
          } catch (parseError) {
            errorMessage = `HTTP error! status: ${response.status}`;
          }
          throw new Error(errorMessage);
        }

        showNotification("success", isEditMode ? "Document updated successfully!" : "Document saved successfully!");

        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (error) {
        console.error("Submit error:", error);
        showNotification("error", `${isEditMode ? 'Update' : 'Upload'} failed: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [
      isEditMode, 
      file,
      enhancedImage,
      processedImage,
      selectedDepartment,
      subject,
      diaryNo,
      from,
      disposal,
      status,
      fileName,
      type,
      selectedCategory,
      date,
      extractedText,
      fileData,
      showNotification,
      onClose,
    ]
  );


   if (isEditMode) {
    return (
      <div className="bg-zinc-800 p-10">
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onDismiss={() => setNotification(null)}
          />
        )}

        <div className="bg-white p-6 rounded-lg max-w-4xl mx-auto">
          {/* 1. Title changed to "Edit Document" */}
          <h2 className="text-3xl text-center font-semibold mb-6">
            Edit Document
          </h2>

          {/* 2. File upload section hidden/disabled - show current document info instead */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-3">Current Document</h3>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="font-medium text-sm text-blue-900">
                    {fileData.fileName || fileData.subject}
                  </p>
                  <p className="text-xs text-blue-700">
                    Document ID: {fileData._id}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Optional: Allow file replacement */}
            <div className="mt-3">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Replace Document (Optional)
              </label>
              <div
                className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => document.getElementById('edit-file-input').click()}
              >
                <UploadCloud size={24} className="text-gray-400 mb-2" />
                <p className="text-gray-600 text-sm text-center">
                  Click to upload a new file (optional)
                </p>
                <input
                  id="edit-file-input"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    if (selectedFile) {
                      handleFileChange(selectedFile);
                    }
                  }}
                  className="hidden"
                />
              </div>
              
              {file && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-3 text-green-500" />
                      <div>
                        <p className="font-medium text-sm text-green-900">New file selected</p>
                        <p className="text-xs text-green-700">
                          {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setFileName(fileData.fileName);
                        setProcessedImage(null);
                      }}
                      className="text-green-500 hover:text-green-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Form pre-filled with fileData values - your existing form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Type</option>
                <option value="uni">University</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Department *</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select Category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject *</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Date *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Diary No *</label>
                <input
                  type="text"
                  value={diaryNo}
                  onChange={(e) => setDiaryNo(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">From *</label>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Disposal *</label>
              <input
                type="text"
                value={disposal}
                onChange={(e) => setDisposal(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Submit buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            {/* 4. Submit button text changed to "Update Document" */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Update Document
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }


  // UPLOAD MODE RENDER
  if (isUploadMode) {
    return (
      <div className="bg-zinc-800 p-10">
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onDismiss={() => setNotification(null)}
          />
        )}

        {/* Document Preview Modal */}
        <DocumentPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          document={processedImage}
          extractedText={extractedText}
          fileName={fileName}
        />

        <div className="bg-white p-6 rounded-lg max-w-4xl mx-auto">
          <h2 className="text-3xl text-center font-semibold mb-6">
            {action} Form
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-3">Document Upload</h3>

            <div className="flex flex-col gap-2 w-full">
              <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center w-full p-4 border-2 border-dashed bg-gray-100 rounded-lg cursor-pointer transition-all ${
                  isDragActive
                    ? "border-blue-500 bg-gray-200"
                    : "border-gray-400"
                }`}
                style={{ minHeight: "160px" }}
              >
                <input {...getInputProps()} />
                <UploadCloud size={36} className="text-gray-500 mb-2" />
                {isDragActive ? (
                  <p className="text-lg font-semibold text-blue-600">
                    Drop your file here...
                  </p>
                ) : (
                  <p className="text-gray-700 text-center">
                    Drag & Drop your PDF or Image here or{" "}
                    <span className="text-blue-500 font-medium">
                      click to browse
                    </span>
                  </p>
                )}
              </div>

              {file && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {file.type === "application/pdf" ? (
                        <FileText className="w-5 h-5 mr-3 text-red-500" />
                      ) : (
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt="Thumbnail"
                          className="w-8 h-8 mr-3 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium text-sm">{fileName}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Preview Button for Upload Mode */}
                      <button
                        type="button"
                        onClick={() => setIsPreviewOpen(true)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setFileName("");
                          setProcessedImage(null);
                          setExtractedText("");
                        }}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {processedImage && !file && (
                <div className="mt-3">
                  <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={processedImage || "/placeholder.svg"}
                      alt="Processed document"
                      className="w-full h-auto max-h-56 object-contain mx-auto"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setProcessedImage(null);
                        setExtractedText("");
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form fields section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Type</option>
                <option value="uni">University</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Department *
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select Category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Subject *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              {isExtracting && (
                <div className="text-sm text-blue-500 flex items-center mt-1">
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  {extractionFailed
                    ? "Retrying text extraction..."
                    : "Extracting text from document..."}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Date *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Diary No *
                </label>
                <input
                  type="text"
                  value={diaryNo}
                  onChange={(e) => setDiaryNo(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">From *</label>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Disposal *
              </label>
              <input
                type="text"
                value={disposal}
                onChange={(e) => setDisposal(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {extractionFailed && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-yellow-700 flex-grow">
                  <p className="font-medium">Text Extraction Failed</p>
                  <p>There was a problem extracting text from this document.</p>
                  <button
                    type="button"
                    onClick={() => file && extractTextFromDocument(file)}
                    disabled={isExtracting}
                    className="mt-1 px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md flex items-center text-xs font-medium"
                  >
                    {isExtracting ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Retry Text Extraction
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading || (!file && !enhancedImage) || isExtracting}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Save Document
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Camera capture
        return (
          <div className="fixed inset-0 z-50 bg-black">
            <div className="relative w-full h-full">
              {isCameraActive && hasCameraPermission !== false ? (
                <Webcam
                  className="w-full h-full object-cover"
                  audio={false}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={1.0}
                  ref={(ref) => {
                    webcamRef.current = ref;
                    videoRef.current = ref && ref.video;
                  }}
                  width="100%"
                  height="100%"
                  playsInline
                  videoConstraints={{
                    facingMode: cameraFacingMode,
                    width: { ideal: 1920, min: 1280 },
                    height: { ideal: 1080, min: 720 },
                    advanced: [{ zoom: zoomLevel }],
                  }}
                  onUserMedia={initializeCamera}
                  onUserMediaError={(error) => {
                    console.warn(
                      "Webcam component error (handled):",
                      error.name
                    );
                    setHasCameraPermission(false);
                    setIsCameraActive(false);

                    // Simple permission denied message for 2 seconds
                    showNotification(
                      "error",
                      "Camera permission denied. Please allow camera access and try again.",
                      2000
                    );
                  }}
                />
              ) : null}

              {isFocusing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <Focus className="w-16 h-16 text-white animate-pulse" />
                </div>
              )}

              {/* A4 Document frame guide */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="relative border-2 border-dashed border-white opacity-80 rounded-lg"
                  style={{
                    width: "70%",
                    height: "70%",
                    aspectRatio: "210/297",
                  }}
                >
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>

                  {/* A4 label */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium">
                    Scan Document
                  </div>
                </div>
              </div>

              {/* Top controls */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <button
                  className="p-3 bg-black bg-opacity-50 rounded-full text-white"
                  onClick={onClose}
                  type="button"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex gap-2">
                  {isTorchAvailable && (
                    <button
                      className={`p-3 rounded-full ${
                        isTorchOn
                          ? "bg-yellow-400 text-black"
                          : "bg-black bg-opacity-50 text-white"
                      }`}
                      onClick={toggleTorch}
                      type="button"
                    >
                      {isTorchOn ? (
                        <Zap className="w-6 h-6" />
                      ) : (
                        <ZapOff className="w-6 h-6" />
                      )}
                    </button>
                  )}
                  <button
                    className="p-3 bg-black bg-opacity-50 rounded-full text-white"
                    onClick={toggleCameraFacing}
                    type="button"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Bottom controls */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8">
                <button
                  className="p-4 bg-black bg-opacity-50 rounded-full text-white"
                  onClick={decreaseZoom}
                  type="button"
                >
                  <ZoomOut className="w-6 h-6" />
                </button>

                <button
                  className="w-20 h-20 bg-white border-4 border-blue-500 rounded-full shadow-lg hover:bg-gray-100 transition duration-200 flex items-center justify-center"
                  onClick={captureAndProcess}
                  type="button"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                  ) : (
                    <Camera className="w-10 h-10 text-blue-600" />
                  )}
                </button>

                <button
                  className="p-4 bg-black bg-opacity-50 rounded-full text-white"
                  onClick={increaseZoom}
                  type="button"
                >
                  <ZoomIn className="w-6 h-6" />
                </button>
              </div>

              {/* Instructions */}
              <div className="absolute bottom-32 left-0 right-0 text-center">
                <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg mx-4">
                  <p className="text-sm">Position document within frame</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Enhanced document view
        return (
          <div className="space-y-6 p-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Enhanced Document</h3>
              <p className="text-orange-600 text-sm">
                Automatic text extraction failed. Please complete the form
                manually.
              </p>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              {enhancedImage ? (
                <div className="flex justify-center p-4">
                  <img
                    src={enhancedImage || "/placeholder.svg"}
                    alt="A4 Enhanced document"
                    className="max-w-full h-auto max-h-[70vh] object-contain border shadow-sm"
                    style={{ aspectRatio: "210/297" }}
                  />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  No enhanced image available
                </div>
              )}
            </div>

            {/* Manual options when extraction fails */}
            <div className="space-y-3">
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-orange-800 text-sm font-medium">
                  Text extraction failed
                </p>
                <p className="text-orange-700 text-sm">
                  You can retry extraction or proceed to fill the form manually.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Retake Photo
                </button>

                <button
                  type="button"
                  onClick={() => extractTextAndGoToForm(enhancedImage)}
                  disabled={!enhancedImage || isExtracting}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      Retry Extraction
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <ChevronRight className="w-5 h-5" />
                  Skip to Form
                </button>
              </div>
            </div>
          </div>
        );

      case 2: // Text extraction view
        return (
          <div className="space-y-6 p-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Extracted Text</h3>
              <p className="text-gray-600 text-sm">
                Review and edit the extracted text if needed
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="font-medium">Extracted Text</label>
                {extractedText && (
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                )}
              </div>

              <div className="border rounded-lg bg-gray-50 h-64 p-3 overflow-auto">
                {extractedText ? (
                  <pre className="text-sm whitespace-pre-wrap">
                    {extractedText}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No text extracted
                  </div>
                )}
              </div>

              {extractedText && (
                <div className="text-sm text-gray-500">
                  Characters: {extractedText.length} | Words:{" "}
                  {
                    extractedText.split(/\s+/).filter((word) => word.length > 0)
                      .length
                  }
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );

      case 3: // Form completion
        return (
          <div className="space-y-6 p-4">
            {/* Document Preview Modal for Scan Mode */}
            <DocumentPreviewModal
              isOpen={isPreviewOpen}
              onClose={() => setIsPreviewOpen(false)}
              document={enhancedImage}
              extractedText={extractedText}
              fileName={fileName}
            />

            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                Complete Document Details
              </h3>
              <p className="text-gray-600 text-sm">
                Fill in the required information
              </p>
            </div>

            {/* Preview Button for Scan Mode */}
            {enhancedImage && (
              <div className="flex justify-center mb-4">
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Eye className="w-5 h-5" />
                  <span>Enhanced Document Preview</span>
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Type *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="uni">University</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Department *
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Diary No *
                    </label>
                    <input
                      type="text"
                      value={diaryNo}
                      onChange={(e) => setDiaryNo(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    From *
                  </label>
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Disposal *
                  </label>
                  <input
                    type="text"
                    value={disposal}
                    onChange={(e) => setDisposal(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Save Document
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  // Initial render - start camera button
  if (!isCameraActive && currentStep === 0) {
    return (
      <div className="bg-zinc-800 min-h-screen p-4">
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onDismiss={() => setNotification(null)}
          />
        )}

        <div className="bg-white rounded-lg max-w-md mx-auto p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">Scan Document</h2>
            <p className="text-gray-600">
              Create a professional scanned document
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Scanning Tips:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Position document to fill the frame</li>
                <li>• Ensure good lighting and focus</li>
                <li>• Keep document flat and straight</li>
                <li>• Document will be auto-enhanced</li>
              </ul>
            </div>

            {/* In the initial render section (around line 1800), update the permission denied state UI: */}
            {/* {hasCameraPermission === false && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-red-700">
                    <p className="font-medium">Camera Access Denied</p>
                    <p className="mt-1">To enable camera access:</p>
                    <div className="mt-2 text-xs space-y-1">
                      <p>• Click the camera icon in your browser's address bar</p>
                      <p>• Select "Allow" for camera permissions</p>
                      <p>• Refresh the page and try again</p>
                    </div>
                  </div>
                </div>
              </div>
            )} */}

            {/* Update the dynamic button section to show different text based on permission state: */}

            <button
              onClick={
                hasCameraPermission === false ? retryCamera : startCamera
              }
              disabled={isProcessing}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg font-medium"
            >
              <Camera className="w-6 h-6" />
              {hasCameraPermission === false
                ? "Allow Camera Access"
                : "Start Scanner"}
            </button>

            <button
              onClick={onClose}
              className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="bg-zinc-800 min-h-screen">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onDismiss={() => setNotification(null)}
        />
      )}

      {currentStep === 0 ? (
        renderStepContent()
      ) : (
        <div className="min-h-screen">
          <div className="bg-white">
            <div className="flex items-center justify-between p-4 border-b">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold">Document Scanner</h2>
              <div className="w-9" /> {/* Spacer */}
            </div>

            {renderStepContent()}
          </div>
        </div>
      )}
    </div>
  );
};

// Function to convert image to PDF
const convertImageToPdf = async (imageSrc) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const widthRatio = pageWidth / img.width;
      const heightRatio = pageHeight / img.height;
      const ratio = Math.min(widthRatio, heightRatio);

      const w = img.width * ratio;
      const h = img.height * ratio;

      const x = (pageWidth - w) / 2;
      const y = (pageHeight - h) / 2;

      doc.addImage(img, "PNG", x, y, w, h);

      const pdfBlob = doc.output("blob");
      resolve(pdfBlob);
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = imageSrc;
  });
};

export default ScanUpload;
