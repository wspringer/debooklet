import { PDFDocument } from 'pdf-lib';

export interface PagePosition {
  sheetIndex: number;
  isRightSide: boolean;
}

/**
 * Calculate which A3 sheet and which side a logical page came from in a booklet.
 *
 * Standard booklet pattern for 16 pages (8 A3 sheets):
 * When you print a booklet, the pages are arranged for folding. Each A3 sheet has
 * two A4 pages side-by-side. The sheets are ordered so that when folded and stacked,
 * the pages read in sequence.
 *
 * Sheet 0: [LEFT: 16] [RIGHT: 1]   (outermost sheet)
 * Sheet 1: [LEFT: 2]  [RIGHT: 15]
 * Sheet 2: [LEFT: 14] [RIGHT: 3]
 * Sheet 3: [LEFT: 4]  [RIGHT: 13]
 * Sheet 4: [LEFT: 12] [RIGHT: 5]
 * Sheet 5: [LEFT: 6]  [RIGHT: 11]
 * Sheet 6: [LEFT: 10] [RIGHT: 7]
 * Sheet 7: [LEFT: 8]  [RIGHT: 9]   (innermost sheet)
 *
 * Pattern summary:
 * - Right side (odd pages): 1, 15, 3, 13, 5, 11, 7, 9
 * - Left side (even pages): 16, 2, 14, 4, 12, 6, 10, 8
 */
export function calculateOriginalPosition(logicalPage: number, totalPages: number): PagePosition {
  const totalSheets = totalPages / 2;
  const isRightSide = logicalPage % 2 === 1;

  if (isRightSide) {
    // Odd pages (1, 3, 5, 7, ...) go on the RIGHT side
    // First half: 1, 3, 5, 7 -> sheets 0, 2, 4, 6 (even sheets, ascending)
    // Second half: 9, 11, 13, 15 -> sheets 7, 5, 3, 1 (odd sheets, descending)
    const oddPageIndex = (logicalPage - 1) / 2;

    if (oddPageIndex < totalSheets / 2) {
      // First half: on even sheets in ascending order
      return { sheetIndex: oddPageIndex * 2, isRightSide: true };
    } else {
      // Second half: on odd sheets in descending order
      const offset = oddPageIndex - totalSheets / 2;
      const sheetIndex = totalSheets - 1 - offset * 2;
      return { sheetIndex, isRightSide: true };
    }
  } else {
    // Even pages (2, 4, 6, 8, ...) go on the LEFT side
    // First half: 2, 4, 6, 8 -> sheets 1, 3, 5, 7 (odd sheets, ascending)
    // Second half: 10, 12, 14, 16 -> sheets 6, 4, 2, 0 (even sheets, descending)
    const evenPageIndex = (logicalPage / 2) - 1;

    if (evenPageIndex < totalSheets / 2) {
      // First half: on odd sheets in ascending order
      return { sheetIndex: evenPageIndex * 2 + 1, isRightSide: false };
    } else {
      // Second half: on even sheets in descending order
      const offset = evenPageIndex - totalSheets / 2;
      const sheetIndex = totalSheets - 2 - offset * 2;
      return { sheetIndex, isRightSide: false };
    }
  }
}

/**
 * Extract half of a page (left or right side) from a PDF.
 */
export async function extractHalfPage(
  pdf: PDFDocument,
  newPdf: PDFDocument,
  sheetIndex: number,
  isRightSide: boolean
): Promise<void> {
  if (sheetIndex >= pdf.getPageCount()) {
    throw new Error(`Sheet index ${sheetIndex} out of bounds (total sheets: ${pdf.getPageCount()})`);
  }

  const [sourcePage] = await newPdf.copyPages(pdf, [sheetIndex]);
  const { width, height } = sourcePage.getSize();

  // Crop to get half the page
  const halfWidth = width / 2;

  if (isRightSide) {
    // Right side: crop left half away
    sourcePage.setCropBox(halfWidth, 0, width, height);
  } else {
    // Left side: crop right half away
    sourcePage.setCropBox(0, 0, halfWidth, height);
  }

  newPdf.addPage(sourcePage);
}
