export type CompanyType = "EURL" | "SARL" | "SAS" | "SASU" | "SCI";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

export interface ExtractedData {
  fileId: string;
  fileName: string;
  data: Record<string, any>;
}

export interface Discrepancy {
  key: string;
  values: Array<{
    fileId: string;
    fileName: string;
    value: any;
  }>;
  resolvedValue?: any;
}

export interface Rule {
  key: string;
  prompt: string;
  validator: (value: any) => boolean;
}

export interface RuleViolation {
  key: string;
  value: any;
  prompt: string;
  resolved?: boolean;
}

export interface ProcessingData {
  category: string;
  companyType: CompanyType | null;
  uploadedFiles: UploadedFile[];
  extractedData: ExtractedData[];
  combinedData: Record<string, any>;
  discrepancies: Discrepancy[];
  ruleViolations: RuleViolation[];
  templateData: Record<string, any>;
}

