#!/usr/bin/env node

import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { calculateOriginalPosition, extractHalfPage } from './booklet.js';

/**
 * Main function to debooklet a PDF.
 */
async function debooklet(inputPath: string, outputPath: string): Promise<void> {
  console.log(`Reading booklet PDF from: ${inputPath}`);

  // Load the booklet PDF
  const pdfBytes = fs.readFileSync(inputPath);
  const pdf = await PDFDocument.load(pdfBytes);

  const totalSheets = pdf.getPageCount();
  const totalPages = totalSheets * 2;

  console.log(`Booklet has ${totalSheets} sheets (${totalPages} logical pages)`);

  // Create a new PDF for the debooklet output
  const newPdf = await PDFDocument.create();

  // Extract pages in logical order
  for (let logicalPage = 1; logicalPage <= totalPages; logicalPage++) {
    const { sheetIndex, isRightSide } = calculateOriginalPosition(logicalPage, totalPages);

    console.log(
      `Extracting page ${logicalPage}: sheet ${sheetIndex}, ${isRightSide ? 'right' : 'left'} side`
    );

    await extractHalfPage(pdf, newPdf, sheetIndex, isRightSide);
  }

  // Save the result
  console.log(`Saving debooklet PDF to: ${outputPath}`);
  const newPdfBytes = await newPdf.save();
  fs.writeFileSync(outputPath, newPdfBytes);

  console.log('✓ Done!');
}

// CLI interface
const argv = yargs(hideBin(process.argv))
  .scriptName('debooklet')
  .usage('Usage: $0 <input.pdf> <output.pdf>')
  .command('$0 <input> <output>', 'Convert booklet PDF back to normal page order', (yargs) => {
    return yargs
      .positional('input', {
        describe: 'Input booklet PDF file',
        type: 'string',
        demandOption: true
      })
      .positional('output', {
        describe: 'Output PDF file',
        type: 'string',
        demandOption: true
      });
  })
  .example('$0 booklet.pdf normal.pdf', 'Convert booklet.pdf to normal page order')
  .example('$0 input.pdf output.pdf', 'Convert input.pdf and save as output.pdf')
  .demandCommand(1, 'You must provide both input and output PDF file paths')
  .strict()
  .help()
  .alias('help', 'h')
  .version('1.0.0')
  .alias('version', 'v')
  .parseSync();

// Run the debooklet function
if (argv.input && argv.output) {
  debooklet(argv.input as string, argv.output as string).catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}
