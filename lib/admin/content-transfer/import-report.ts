import type { ImportFileResult, ImportReport, ImportReportSummary } from './content-transfer-types';

const EMPTY_SUMMARY: ImportReportSummary = {
  scanned: 0,
  valid: 0,
  invalid: 0,
  created: 0,
  updated: 0,
  skipped: 0,
  wouldCreate: 0,
  wouldUpdate: 0,
  wouldSkip: 0,
  warnings: 0,
  failed: 0,
};

export function buildImportSummary(files: ImportFileResult[]): ImportReportSummary {
  const summary = { ...EMPTY_SUMMARY, scanned: files.length };

  for (const file of files) {
    summary.warnings += file.warnings.length;

    if (file.action === 'invalid') {
      summary.invalid++;
      continue;
    }

    if (file.action === 'failed') {
      summary.failed++;
      continue;
    }

    summary.valid++;

    if (file.action === 'created') summary.created++;
    if (file.action === 'updated') summary.updated++;
    if (file.action === 'skipped') summary.skipped++;
    if (file.action === 'would_create') summary.wouldCreate++;
    if (file.action === 'would_update') summary.wouldUpdate++;
    if (file.action === 'would_skip') summary.wouldSkip++;
  }

  return summary;
}

export function buildImportReport(
  contentType: ImportReport['contentType'],
  mode: ImportReport['mode'],
  files: ImportFileResult[],
): ImportReport {
  return {
    contentType,
    mode,
    summary: buildImportSummary(files),
    files,
  };
}
