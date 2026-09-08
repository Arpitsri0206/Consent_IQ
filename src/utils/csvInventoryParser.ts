import { DataCategory, DataInventoryItem } from '../types';

export interface ParsedCsvRow {
  rowNumber: number;
  dataCategory: DataCategory;
  application: string;
  purpose: string;
  retention: string;
  thirdParty: string;
  legalBasis: 'Consent' | 'Legitimate Use' | 'Legal Obligation';
  encryptionStatus: 'AES-256 GCM' | 'TLS 1.3 in transit' | 'Tokenized';
  isValid: boolean;
  errors: string[];
}

export interface CsvParseResult {
  totalRows: number;
  validRows: ParsedCsvRow[];
  invalidRows: ParsedCsvRow[];
  allRows: ParsedCsvRow[];
  detectedCategories: Set<DataCategory>;
  uniquePurposes: Set<string>;
}

const VALID_CATEGORIES: Record<string, DataCategory> = {
  identity: 'Identity',
  contact: 'Contact',
  financial: 'Financial',
  location: 'Location',
  device: 'Device',
  behavioural: 'Behavioural',
  behavioral: 'Behavioural',
  employment: 'Employment',
  education: 'Education',
  health: 'Health',
};

const VALID_LEGAL_BASES: Record<string, 'Consent' | 'Legitimate Use' | 'Legal Obligation'> = {
  consent: 'Consent',
  'legitimate use': 'Legitimate Use',
  legitimate: 'Legitimate Use',
  'legitimate uses': 'Legitimate Use',
  'legal obligation': 'Legal Obligation',
  obligation: 'Legal Obligation',
  statutory: 'Legal Obligation',
};

const VALID_ENCRYPTIONS: Record<string, 'AES-256 GCM' | 'TLS 1.3 in transit' | 'Tokenized'> = {
  'aes-256': 'AES-256 GCM',
  'aes-256 gcm': 'AES-256 GCM',
  aes256: 'AES-256 GCM',
  aes: 'AES-256 GCM',
  'tls 1.3': 'TLS 1.3 in transit',
  'tls 1.3 in transit': 'TLS 1.3 in transit',
  tls: 'TLS 1.3 in transit',
  tokenized: 'Tokenized',
  token: 'Tokenized',
  sha256: 'AES-256 GCM',
};

// Robust CSV Line Splitter supporting quoted strings with commas
function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentValue += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  values.push(currentValue.trim());
  return values;
}

export function parseInventoryCsv(csvContent: string): CsvParseResult {
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return {
      totalRows: 0,
      validRows: [],
      invalidRows: [],
      allRows: [],
      detectedCategories: new Set(),
      uniquePurposes: new Set(),
    };
  }

  // Parse header
  const headerCols = parseCsvLine(lines[0]).map((h) =>
    h.toLowerCase().replace(/[\s_-]+/g, '')
  );

  // Map column indexes
  const colMap = {
    dataCategory: headerCols.findIndex((h) =>
      ['datacategory', 'category', 'type', 'data'].includes(h)
    ),
    application: headerCols.findIndex((h) =>
      ['application', 'app', 'system', 'scope', 'service'].includes(h)
    ),
    purpose: headerCols.findIndex((h) =>
      ['purpose', 'processingpurpose', 'primarypurpose', 'objective', 'use'].includes(h)
    ),
    retention: headerCols.findIndex((h) =>
      ['retention', 'retentionperiod', 'duration', 'retentiondays'].includes(h)
    ),
    thirdParty: headerCols.findIndex((h) =>
      ['thirdparty', 'processor', 'vendor', 'recipient', 'sharedwith'].includes(h)
    ),
    legalBasis: headerCols.findIndex((h) =>
      ['legalbasis', 'basis', 'lawfulness', 'grounds'].includes(h)
    ),
    encryptionStatus: headerCols.findIndex((h) =>
      ['encryptionstatus', 'encryption', 'security', 'safeguard', 'cipher'].includes(h)
    ),
  };

  // If header has default standard order without recognized names, fallback to standard column indices
  if (colMap.dataCategory === -1) colMap.dataCategory = 0;
  if (colMap.application === -1) colMap.application = 1;
  if (colMap.purpose === -1) colMap.purpose = 2;
  if (colMap.retention === -1) colMap.retention = 3;
  if (colMap.thirdParty === -1) colMap.thirdParty = 4;
  if (colMap.legalBasis === -1) colMap.legalBasis = 5;
  if (colMap.encryptionStatus === -1) colMap.encryptionStatus = 6;

  const validRows: ParsedCsvRow[] = [];
  const invalidRows: ParsedCsvRow[] = [];
  const allRows: ParsedCsvRow[] = [];
  const detectedCategories = new Set<DataCategory>();
  const uniquePurposes = new Set<string>();

  // Process data lines (start at index 1)
  for (let i = 1; i < lines.length; i++) {
    const rawCols = parseCsvLine(lines[i]);
    if (rawCols.length === 0 || (rawCols.length === 1 && rawCols[0] === '')) continue;

    const errors: string[] = [];

    // 1. Data Category
    const rawCategory = (rawCols[colMap.dataCategory] || '').trim();
    const normalizedCategoryKey = rawCategory.toLowerCase();
    const matchedCategory = VALID_CATEGORIES[normalizedCategoryKey];

    let category: DataCategory = 'Identity';
    if (!rawCategory) {
      errors.push('Missing Data Category');
    } else if (!matchedCategory) {
      errors.push(
        `Invalid category "${rawCategory}". Allowed: Identity, Contact, Financial, Location, Device, Behavioural, Employment, Education, Health`
      );
    } else {
      category = matchedCategory;
    }

    // 2. Application
    const application = (rawCols[colMap.application] || '').trim();
    if (!application) {
      errors.push('Missing Application / System name');
    }

    // 3. Purpose
    const purpose = (rawCols[colMap.purpose] || '').trim();
    if (!purpose) {
      errors.push('Missing Processing Purpose');
    }

    // 4. Retention
    const retention = (rawCols[colMap.retention] || '5 Years').trim();

    // 5. Third Party
    const thirdParty = (rawCols[colMap.thirdParty] || 'Internal / None').trim();

    // 6. Legal Basis
    const rawBasis = (rawCols[colMap.legalBasis] || 'Consent').trim();
    const matchedBasis = VALID_LEGAL_BASES[rawBasis.toLowerCase()] || 'Consent';

    // 7. Encryption Status
    const rawEncryption = (rawCols[colMap.encryptionStatus] || 'AES-256 GCM').trim();
    const matchedEncryption =
      VALID_ENCRYPTIONS[rawEncryption.toLowerCase()] || 'AES-256 GCM';

    const isValid = errors.length === 0;

    const parsedRow: ParsedCsvRow = {
      rowNumber: i + 1,
      dataCategory: category,
      application: application || 'Enterprise App',
      purpose: purpose || 'General Processing',
      retention,
      thirdParty,
      legalBasis: matchedBasis,
      encryptionStatus: matchedEncryption,
      isValid,
      errors,
    };

    allRows.push(parsedRow);
    if (isValid) {
      validRows.push(parsedRow);
      detectedCategories.add(category);
      if (purpose) uniquePurposes.add(purpose);
    } else {
      invalidRows.push(parsedRow);
    }
  }

  return {
    totalRows: allRows.length,
    validRows,
    invalidRows,
    allRows,
    detectedCategories,
    uniquePurposes,
  };
}

export const SAMPLE_CSV_CONTENT = `data_category,application,purpose,retention,third_party,legal_basis,encryption_status
Identity,Digital Onboarding Portal,Aadhaar Offline e-KYC Identity Verification,7 Years,UIDAI Authenticated AUA,Consent,AES-256 GCM
Contact,Omnichannel Communications Hub,WhatsApp Banking Alerts & Transaction Notices,5 Years,Infobip WhatsApp BSP,Consent,TLS 1.3 in transit
Financial,Wealth Management Engine,Mutual Fund Portfolio Performance Calculation,8 Years,Internal / None,Consent,Tokenized
Location,Fraud Risk Prevention Gateway,Geo-fencing for High-Value POS Withdrawals,90 Days,Internal Risk Engine,Legitimate Use,AES-256 GCM
Device,Mobile Banking App (iOS & Android),Biometric Passkey Authentication & Device Binding,Duration of Active Account,Internal / None,Consent,Tokenized
Employment,Corporate Payroll Portal,Direct Benefit Tax Deductions (TDS Form 16),8 Years,Income Tax Department NSDL,Legal Obligation,AES-256 GCM
Behavioural,Smart Credit Underwriting,Credit Card Limit Upgrade Recommendation,3 Years,Experian Bureau Partner,Consent,AES-256 GCM`;

export function downloadSampleInventoryCsv(): void {
  const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'consent_iq_ropa_inventory_template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
