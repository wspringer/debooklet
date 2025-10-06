import { describe, it, expect } from 'vitest';
import { calculateOriginalPosition } from './booklet';

describe('calculateOriginalPosition', () => {
  describe('16-page booklet (8 sheets)', () => {
    const totalPages = 16;

    it('should place odd pages on the right side', () => {
      const page1 = calculateOriginalPosition(1, totalPages);
      expect(page1.isRightSide).toBe(true);

      const page3 = calculateOriginalPosition(3, totalPages);
      expect(page3.isRightSide).toBe(true);

      const page15 = calculateOriginalPosition(15, totalPages);
      expect(page15.isRightSide).toBe(true);
    });

    it('should place even pages on the left side', () => {
      const page2 = calculateOriginalPosition(2, totalPages);
      expect(page2.isRightSide).toBe(false);

      const page4 = calculateOriginalPosition(4, totalPages);
      expect(page4.isRightSide).toBe(false);

      const page16 = calculateOriginalPosition(16, totalPages);
      expect(page16.isRightSide).toBe(false);
    });

    it('should correctly map all pages to sheets', () => {
      const expected = [
        { sheet: 0, left: 16, right: 1 },
        { sheet: 1, left: 2, right: 15 },
        { sheet: 2, left: 14, right: 3 },
        { sheet: 3, left: 4, right: 13 },
        { sheet: 4, left: 12, right: 5 },
        { sheet: 5, left: 6, right: 11 },
        { sheet: 6, left: 10, right: 7 },
        { sheet: 7, left: 8, right: 9 },
      ];

      // Build the actual mapping
      const sheets: { left: number | null; right: number | null }[] = [];
      for (let i = 0; i < 8; i++) {
        sheets.push({ left: null, right: null });
      }

      for (let page = 1; page <= totalPages; page++) {
        const { sheetIndex, isRightSide } = calculateOriginalPosition(page, totalPages);
        if (isRightSide) {
          sheets[sheetIndex].right = page;
        } else {
          sheets[sheetIndex].left = page;
        }
      }

      // Verify each sheet
      for (let i = 0; i < expected.length; i++) {
        expect(sheets[i].left).toBe(expected[i].left);
        expect(sheets[i].right).toBe(expected[i].right);
      }
    });
  });

  describe('8-page booklet (4 sheets)', () => {
    const totalPages = 8;

    it('should correctly map pages for 8-page booklet', () => {
      const expected = [
        { sheet: 0, left: 8, right: 1 },
        { sheet: 1, left: 2, right: 7 },
        { sheet: 2, left: 6, right: 3 },
        { sheet: 3, left: 4, right: 5 },
      ];

      const sheets: { left: number | null; right: number | null }[] = [];
      for (let i = 0; i < 4; i++) {
        sheets.push({ left: null, right: null });
      }

      for (let page = 1; page <= totalPages; page++) {
        const { sheetIndex, isRightSide } = calculateOriginalPosition(page, totalPages);
        if (isRightSide) {
          sheets[sheetIndex].right = page;
        } else {
          sheets[sheetIndex].left = page;
        }
      }

      for (let i = 0; i < expected.length; i++) {
        expect(sheets[i].left).toBe(expected[i].left);
        expect(sheets[i].right).toBe(expected[i].right);
      }
    });
  });

  describe('4-page booklet (2 sheets)', () => {
    const totalPages = 4;

    it('should correctly map pages for 4-page booklet', () => {
      const expected = [
        { sheet: 0, left: 4, right: 1 },
        { sheet: 1, left: 2, right: 3 },
      ];

      const sheets: { left: number | null; right: number | null }[] = [];
      for (let i = 0; i < 2; i++) {
        sheets.push({ left: null, right: null });
      }

      for (let page = 1; page <= totalPages; page++) {
        const { sheetIndex, isRightSide } = calculateOriginalPosition(page, totalPages);
        if (isRightSide) {
          sheets[sheetIndex].right = page;
        } else {
          sheets[sheetIndex].left = page;
        }
      }

      for (let i = 0; i < expected.length; i++) {
        expect(sheets[i].left).toBe(expected[i].left);
        expect(sheets[i].right).toBe(expected[i].right);
      }
    });
  });

  describe('32-page booklet (16 sheets)', () => {
    const totalPages = 32;

    it('should correctly map first and last sheets', () => {
      // First sheet
      const page1 = calculateOriginalPosition(1, totalPages);
      expect(page1).toEqual({ sheetIndex: 0, isRightSide: true });

      const page32 = calculateOriginalPosition(32, totalPages);
      expect(page32).toEqual({ sheetIndex: 0, isRightSide: false });

      // Last sheet
      const page16 = calculateOriginalPosition(16, totalPages);
      expect(page16).toEqual({ sheetIndex: 15, isRightSide: false });

      const page17 = calculateOriginalPosition(17, totalPages);
      expect(page17).toEqual({ sheetIndex: 15, isRightSide: true });
    });

    it('should ensure all sheets have exactly 2 pages', () => {
      const sheets: { left: number | null; right: number | null }[] = [];
      for (let i = 0; i < 16; i++) {
        sheets.push({ left: null, right: null });
      }

      for (let page = 1; page <= totalPages; page++) {
        const { sheetIndex, isRightSide } = calculateOriginalPosition(page, totalPages);
        if (isRightSide) {
          sheets[sheetIndex].right = page;
        } else {
          sheets[sheetIndex].left = page;
        }
      }

      // Every sheet should have both left and right pages
      for (let i = 0; i < 16; i++) {
        expect(sheets[i].left).not.toBeNull();
        expect(sheets[i].right).not.toBeNull();
      }
    });
  });

  describe('edge cases', () => {
    it('should handle first page', () => {
      const result = calculateOriginalPosition(1, 16);
      expect(result).toEqual({ sheetIndex: 0, isRightSide: true });
    });

    it('should handle last page', () => {
      const result = calculateOriginalPosition(16, 16);
      expect(result).toEqual({ sheetIndex: 0, isRightSide: false });
    });

    it('should ensure no duplicate pages across sheets', () => {
      const totalPages = 16;
      const usedPages = new Set<number>();

      for (let page = 1; page <= totalPages; page++) {
        expect(usedPages.has(page)).toBe(false);
        usedPages.add(page);
      }

      expect(usedPages.size).toBe(totalPages);
    });
  });
});
