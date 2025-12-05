/**
 * PDF text extraction utility using PDF.js from CDN
 * Extracts text content from PDF files client-side
 */

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
 * Extract text content from a PDF file
 * @param file - The PDF file to extract text from
 * @returns Promise<string> - The extracted text content
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

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Combine text items into a single string
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');

      textParts.push(pageText);
    }

    // Join all pages with newlines
    const fullText = textParts.join('\n\n');

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
