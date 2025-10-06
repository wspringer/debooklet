# debooklet

A TypeScript CLI tool that reverses pdfbooklet - converting booklet-formatted PDFs back to normal sequential page order.

## Overview

When you create a booklet for printing, pages are rearranged in a specific order so that when the sheets are folded and stacked, the pages appear in the correct sequence. This tool reverses that process, extracting the original pages from a booklet PDF.

### What is a Booklet?

A booklet PDF is designed for duplex printing where:
- Each A3 (or larger) sheet contains two A4 (or smaller) pages side-by-side
- Pages are arranged for folding in half
- When folded and stacked, pages read sequentially

**Example booklet layout** for 16 pages (8 sheets):
```
Sheet 0: [LEFT: 16] [RIGHT: 1]   ← Outermost sheet
Sheet 1: [LEFT: 2]  [RIGHT: 15]
Sheet 2: [LEFT: 14] [RIGHT: 3]
Sheet 3: [LEFT: 4]  [RIGHT: 13]
Sheet 4: [LEFT: 12] [RIGHT: 5]
Sheet 5: [LEFT: 6]  [RIGHT: 11]
Sheet 6: [LEFT: 10] [RIGHT: 7]
Sheet 7: [LEFT: 8]  [RIGHT: 9]   ← Innermost sheet
```

When folded and nested, these sheets create a booklet with pages 1-16 in order.

## Installation

### Option 1: Standalone Executable (Recommended - No dependencies!)

Download the pre-built executable for your platform from [GitHub Releases](https://github.com/YOUR_USERNAME/debooklet/releases):

**Linux (x64)**:
```bash
wget https://github.com/YOUR_USERNAME/debooklet/releases/latest/download/debooklet-linux-x64
chmod +x debooklet-linux-x64
sudo mv debooklet-linux-x64 /usr/local/bin/debooklet
```

**macOS (Intel)**:
```bash
wget https://github.com/YOUR_USERNAME/debooklet/releases/latest/download/debooklet-macos-x64
chmod +x debooklet-macos-x64
sudo mv debooklet-macos-x64 /usr/local/bin/debooklet
```

**macOS (Apple Silicon)**:
```bash
wget https://github.com/YOUR_USERNAME/debooklet/releases/latest/download/debooklet-macos-arm64
chmod +x debooklet-macos-arm64
sudo mv debooklet-macos-arm64 /usr/local/bin/debooklet
```

**Windows**:
1. Download `debooklet-win-x64.exe` from the [releases page](https://github.com/YOUR_USERNAME/debooklet/releases)
2. Rename to `debooklet.exe` (optional)
3. Add to your PATH or run directly

### Option 2: npm/npx (Requires Node.js)

**No installation - use npx**:
```bash
npx debooklet input.pdf output.pdf
```

**Global installation via npm**:
```bash
npm install -g debooklet
debooklet input.pdf output.pdf
```

### Option 3: From Source (Development)

```bash
git clone https://github.com/YOUR_USERNAME/debooklet.git
cd debooklet
npm install
npm run build
npm link  # Makes 'debooklet' available globally
```

## Usage

```bash
# Basic usage
debooklet <input.pdf> <output.pdf>

# Show help
debooklet --help

# Show version
debooklet --version
```

### Examples

```bash
# Convert a booklet back to normal page order
debooklet my-booklet.pdf output.pdf

# The tool shows progress as it extracts pages:
# Reading booklet PDF from: my-booklet.pdf
# Booklet has 8 sheets (16 logical pages)
# Extracting page 1: sheet 0, right side
# Extracting page 2: sheet 1, left side
# Extracting page 3: sheet 2, right side
# ...
# Saving debooklet PDF to: output.pdf
# ✓ Done!
```

## How It Works

1. **Loads the booklet PDF** - Reads the input file containing A3 (or larger) sheets
2. **Detects page count** - Automatically determines total sheets and logical pages
3. **Applies reverse booklet algorithm** - Calculates which sheet and which side each page came from
4. **Splits pages** - Crops each A3 sheet to extract left and right A4 pages
5. **Reorders sequentially** - Assembles pages in normal reading order (1, 2, 3, 4...)
6. **Saves output** - Writes the debooklet PDF with pages in sequential order

The tool uses the standard booklet pattern where:
- **Odd pages** (1, 3, 5, 7, ...) appear on the **RIGHT** side of sheets
- **Even pages** (2, 4, 6, 8, ...) appear on the **LEFT** side of sheets
- Pages are distributed across sheets in a specific interleaved pattern for proper folding

## Use Cases

- **Digital distribution**: Convert printed booklet PDFs to normal reading order for screen viewing
- **Editing**: Extract pages from booklet layouts for individual editing
- **Archiving**: Store documents in sequential order rather than booklet format
- **Republishing**: Convert booklet-formatted documents back to standard format

## Technical Details

- Built with **TypeScript** for type safety
- Uses **pdf-lib** for PDF manipulation
- Uses **yargs** for CLI argument parsing
- Automatically handles crop boxes to split A3 sheets
- Preserves PDF quality and formatting
- Works with any booklet size (automatically detected)

## Requirements

- **Standalone executables**: None! Just download and run
- **npm/npx method**: Node.js 14 or higher
- **From source**: Node.js 14+ and npm

## Building Executables Locally

If you want to build the standalone executables yourself:

```bash
# Install dependencies
npm install

# Build for all platforms
npm run build:exe:all

# Or build for specific platforms
npm run build:exe:linux   # Linux x64
npm run build:exe:mac     # macOS (Intel & Apple Silicon)
npm run build:exe:win     # Windows x64

# Executables will be in the ./build directory
```

## Publishing to npm

To publish this package to npm (requires npm account):

```bash
# Update version in package.json
npm version patch  # or minor, or major

# Build the project
npm run build

# Publish to npm
npm publish
```

## Creating a Release

1. Update the version: `npm version <patch|minor|major>`
2. Push the tag: `git push && git push --tags`
3. GitHub Actions will automatically:
   - Run tests
   - Build executables for Linux, macOS, and Windows
   - Create a GitHub Release with all binaries

## License

MIT
