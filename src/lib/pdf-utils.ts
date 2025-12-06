/**
 * Document text extraction utilities
 * - PDF: Uses PDF.js from CDN (extracts text content AND hyperlink URLs)
 * - DOCX/DOC: Uses mammoth library
 */

import mammoth from 'mammoth';

// Declare the pdfjs-dist types for dynamic import
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

let pdfjsLoaded = false;
let pdfjsLoadPromise: Promise<void> | null = null;

/**
 * Dynamically load PDF.js from CDN
 */
async function loadPdfJs(): Promise<void> {
  if (pdfjsLoaded) return;

  if (pdfjsLoadPromise) {
    return pdfjsLoadPromise;
  }

  pdfjsLoadPromise = new Promise((resolve, reject) => {
    // Load the main PDF.js library
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      // Set the worker source
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      pdfjsLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load PDF.js'));
    document.head.appendChild(script);
  });

  return pdfjsLoadPromise;
}

/**
 * Extract text content from a PDF file, including hyperlink URLs
 * @param file - The PDF file to extract text from
 * @returns Promise<string> - The extracted text content with URLs
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Load PDF.js if not already loaded
    await loadPdfJs();

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF document
    const loadingTask = window.pdfjsLib.getDocument({
      data: arrayBuffer,
    });
    const pdf = await loadingTask.promise;

    const textParts: string[] = [];
    const allLinks: string[] = [];

    // Extract text and links from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      // Extract visible text content
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      textParts.push(pageText);

      // Extract hyperlink annotations (URLs that may not be visible as text)
      try {
        const annotations = await page.getAnnotations();
        for (const annot of annotations) {
          // Check for link annotations with URLs
          if (annot.subtype === 'Link' && annot.url) {
            allLinks.push(annot.url);
          }
        }
      } catch (annotError) {
        // Annotations extraction failed, continue without them
        console.warn('Could not extract annotations from page', pageNum);
      }
    }

    // Join all pages with newlines
    let fullText = textParts.join('\n\n');

    // Append extracted URLs at the end so OpenAI can find them
    if (allLinks.length > 0) {
      // Remove duplicates
      const uniqueLinks = [...new Set(allLinks)];
      fullText += '\n\n--- Professional Links ---\n';
      fullText += uniqueLinks.join('\n');
    }

    return fullText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Check if a file is a valid PDF
 * @param file - The file to check
 * @returns boolean
 */
export function isPDFFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

/**
 * Check if a file is a valid Word document (DOC/DOCX)
 * @param file - The file to check
 * @returns boolean
 */
export function isWordFile(file: File): boolean {
  const fileName = file.name.toLowerCase();
  return (
    fileName.endsWith('.docx') ||
    fileName.endsWith('.doc') ||
    file.type === 'application/msword' ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );
}

/**
 * Extract text content from a DOCX/DOC file
 * @param file - The Word document file to extract text from
 * @returns Promise<string> - The extracted text content
 */
export async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    const text = result.value.trim();

    if (!text) {
      throw new Error('No text content found in document');
    }

    return text;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from Word document');
  }
}
