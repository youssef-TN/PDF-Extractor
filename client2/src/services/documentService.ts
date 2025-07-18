import type { UploadedFile, ExtractedData, Discrepancy, CompanyType } from '@/types/processing';

class DocumentService {
  async extractDataFromFiles(files: UploadedFile[]): Promise<ExtractedData[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock extracted data - in real app, this would come from backend
    return files.map(file => ({
      fileId: file.id,
      fileName: file.name,
      data: this.generateMockExtractedData(file)
    }));
  }

  private generateMockExtractedData(file: UploadedFile): Record<string, any> {
    const baseName = file.name.charAt(0).toUpperCase();
    return {
      raison_sociale: `Company ${baseName}`,
      adresse: "123 Main Street, City",
      date_signature_statuts: "2023-10-01",
      capital_social_euros: Math.floor(Math.random() * 50000) + 1000,
      forme_juridique: "SARL", // This would be dynamic based on company type
      objet_social: "Commercial activities and services"
    };
  }

  findDiscrepancies(extractedData: ExtractedData[]): Discrepancy[] {
    const discrepancies: Discrepancy[] = [];
    const allKeys = new Set<string>();
    
    // Collect all keys from all documents
    extractedData.forEach(item => {
      Object.keys(item.data).forEach(key => allKeys.add(key));
    });

    // Check each key for discrepancies
    allKeys.forEach(key => {
      const values = extractedData.map(item => ({
        fileId: item.fileId,
        fileName: item.fileName,
        value: item.data[key]
      })).filter(item => item.value !== undefined);

      // Check if there are different values for the same key
      const uniqueValues = new Set(values.map(v => String(v.value)));
      if (uniqueValues.size > 1) {
        discrepancies.push({
          key,
          values,
          resolvedValue: values[0].value // Default to first value
        });
      }
    });

    return discrepancies;
  }

  combineDataWithResolutions(extractedData: ExtractedData[], discrepancies: Discrepancy[]): Record<string, any> {
    const combinedData: Record<string, any> = {};
    
    // Add resolved discrepancies
    discrepancies.forEach(d => {
      combinedData[d.key] = d.resolvedValue;
    });

    // Add non-discrepant values
    const allKeys = new Set<string>();
    extractedData.forEach(item => {
      Object.keys(item.data).forEach(key => allKeys.add(key));
    });

    allKeys.forEach(key => {
      if (!discrepancies.some(d => d.key === key)) {
        // No discrepancy, use value from first document
        combinedData[key] = extractedData[0].data[key];
      }
    });

    return combinedData;
  }

  async generatePDF(templateData: Record<string, any>, companyType: CompanyType): Promise<string> {
    // Simulate PDF generation API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In a real app, this would be the actual PDF blob/URL from backend
    const mockPdfBlob = new Blob(["Mock PDF content"], { type: "application/pdf" });
    return URL.createObjectURL(mockPdfBlob);
  }
}

export const documentService = new DocumentService();

