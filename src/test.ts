/**
 * Test file to verify the booklet algorithm
 */

interface PagePosition {
  sheetIndex: number;
  isRightSide: boolean;
}

function calculateOriginalPosition(logicalPage: number, totalPages: number): PagePosition {
  const totalSheets = totalPages / 2;
  const isRightSide = logicalPage % 2 === 1;

  if (isRightSide) {
    const oddPageIndex = (logicalPage - 1) / 2;

    if (oddPageIndex < totalSheets / 2) {
      return { sheetIndex: oddPageIndex * 2, isRightSide: true };
    } else {
      const offset = oddPageIndex - totalSheets / 2;
      const sheetIndex = totalSheets - 1 - offset * 2;
      return { sheetIndex, isRightSide: true };
    }
  } else {
    const evenPageIndex = (logicalPage / 2) - 1;

    if (evenPageIndex < totalSheets / 2) {
      return { sheetIndex: evenPageIndex * 2 + 1, isRightSide: false };
    } else {
      const offset = evenPageIndex - totalSheets / 2;
      const sheetIndex = totalSheets - 2 - offset * 2;
      return { sheetIndex, isRightSide: false };
    }
  }
}

// Test with 16 pages (8 sheets)
const totalPages = 16;
const totalSheets = totalPages / 2;

console.log('Testing booklet algorithm for 16 pages (8 sheets):\n');

// Expected pattern:
// Sheet 0: [LEFT: 16] [RIGHT: 1]
// Sheet 1: [LEFT: 2]  [RIGHT: 15]
// Sheet 2: [LEFT: 14] [RIGHT: 3]
// Sheet 3: [LEFT: 4]  [RIGHT: 13]
// Sheet 4: [LEFT: 12] [RIGHT: 5]
// Sheet 5: [LEFT: 6]  [RIGHT: 11]
// Sheet 6: [LEFT: 10] [RIGHT: 7]
// Sheet 7: [LEFT: 8]  [RIGHT: 9]

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

// Build actual mapping
const sheets: { left: number | null; right: number | null }[] = [];
for (let i = 0; i < totalSheets; i++) {
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

// Verify and display
let allCorrect = true;
for (let i = 0; i < totalSheets; i++) {
  const actual = sheets[i];
  const exp = expected[i];
  const isCorrect = actual.left === exp.left && actual.right === exp.right;

  if (!isCorrect) {
    allCorrect = false;
  }

  const status = isCorrect ? '✓' : '✗';
  console.log(
    `${status} Sheet ${i}: [LEFT: ${actual.left?.toString().padStart(2, ' ')}] [RIGHT: ${actual.right?.toString().padStart(2, ' ')}]` +
    (isCorrect ? '' : ` (expected: [LEFT: ${exp.left}] [RIGHT: ${exp.right}])`)
  );
}

console.log(`\n${allCorrect ? '✓ All tests passed!' : '✗ Some tests failed!'}`);
process.exit(allCorrect ? 0 : 1);
