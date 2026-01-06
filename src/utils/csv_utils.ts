/**
 * CSV Utilities for Coupon Code Generation
 *
 * Provides utilities for generating unique coupon codes and exporting them as CSV files.
 */

export interface CSVGenerationOptions {
  /** Prefix for each code (e.g., "SPRING" results in "SPRING-XXXXXX") */
  prefix?: string;
  /** Number of codes to generate */
  count: number;
  /** Length of the random suffix (default: 6) */
  suffixLength?: number;
  /** Include header row in CSV */
  includeHeader?: boolean;
  /** Additional columns to include */
  additionalColumns?: { header: string; value: string }[];
}

export interface CSVExportResult {
  /** The generated CSV content as a string */
  content: string;
  /** The generated codes array */
  codes: string[];
  /** Blob for download */
  blob: Blob;
  /** Data URL for the blob */
  dataUrl: string;
}

/**
 * Generates a random alphanumeric string of specified length
 */
function generateRandomSuffix(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generates unique coupon codes with optional prefix
 */
export function generateUniqueCodes(options: CSVGenerationOptions): string[] {
  const { prefix = 'CODE', count, suffixLength = 6 } = options;
  const codes: Set<string> = new Set();

  // Use Set to ensure uniqueness
  while (codes.size < count) {
    const suffix = generateRandomSuffix(suffixLength);
    const code = prefix ? `${prefix}-${suffix}` : suffix;
    codes.add(code);
  }

  return Array.from(codes);
}

/**
 * Creates CSV content from an array of codes
 */
export function createCSVContent(
  codes: string[],
  options: Pick<CSVGenerationOptions, 'includeHeader' | 'additionalColumns'> = {}
): string {
  const { includeHeader = true, additionalColumns = [] } = options;

  const lines: string[] = [];

  // Header row
  if (includeHeader) {
    const headers = ['Code', ...additionalColumns.map((c) => c.header)];
    lines.push(headers.join(','));
  }

  // Data rows
  for (const code of codes) {
    const row = [code, ...additionalColumns.map((c) => c.value)];
    lines.push(row.join(','));
  }

  return lines.join('\n');
}

/**
 * Generates unique codes and creates a downloadable CSV
 */
export function generateCSVExport(options: CSVGenerationOptions): CSVExportResult {
  const codes = generateUniqueCodes(options);
  const content = createCSVContent(codes, {
    includeHeader: options.includeHeader ?? true,
    additionalColumns: options.additionalColumns,
  });

  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const dataUrl = URL.createObjectURL(blob);

  return {
    content,
    codes,
    blob,
    dataUrl,
  };
}

/**
 * Triggers a CSV file download in the browser
 */
export function downloadCSV(
  content: string | Blob,
  filename: string
): void {
  const blob = typeof content === 'string'
    ? new Blob([content], { type: 'text/csv;charset=utf-8;' })
    : content;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Formats a filename for CSV export (removes spaces, adds timestamp)
 */
export function formatCSVFilename(baseName: string, includeTimestamp = true): string {
  const sanitized = baseName
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();

  if (includeTimestamp) {
    const timestamp = new Date().toISOString().split('T')[0];
    return `${sanitized}-codes-${timestamp}.csv`;
  }

  return `${sanitized}-codes.csv`;
}

/**
 * Full workflow: Generate codes and trigger download
 */
export function generateAndDownloadCodes(
  couponName: string,
  options: Omit<CSVGenerationOptions, 'includeHeader'>
): string[] {
  const { codes, blob } = generateCSVExport({
    ...options,
    includeHeader: true,
  });

  const filename = formatCSVFilename(couponName);
  downloadCSV(blob, filename);

  return codes;
}

export default {
  generateUniqueCodes,
  createCSVContent,
  generateCSVExport,
  downloadCSV,
  formatCSVFilename,
  generateAndDownloadCodes,
};
