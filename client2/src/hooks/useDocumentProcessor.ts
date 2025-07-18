import { useState, useCallback } from 'react';
import type { ProcessingData, CompanyType, UploadedFile, ExtractedData, Discrepancy, RuleViolation } from '@/types/processing';
import { documentService } from '@/services/documentService';
import { rulesEngine } from '@/services/rulesEngine';
import { useToast } from '@/hooks/use-toast';

export const useDocumentProcessor = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [processingData, setProcessingData] = useState<ProcessingData>({
    category: "creation",
    companyType: null,
    uploadedFiles: [],
    extractedData: [],
    combinedData: {},
    discrepancies: [],
    ruleViolations: [],
    templateData: {}
  });
  const { toast } = useToast();

  const updateProcessingData = useCallback((data: Partial<ProcessingData>) => {
    setProcessingData(prev => ({ ...prev, ...data }));
  }, []);

  const goToNextStep = useCallback(() => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const selectCompanyType = useCallback((companyType: CompanyType) => {
    updateProcessingData({ companyType });
    goToNextStep();
  }, [updateProcessingData, goToNextStep]);

  const uploadFiles = useCallback(async (files: UploadedFile[]) => {
    setIsLoading(true);
    try {
      const extractedData = await documentService.extractDataFromFiles(files);
      updateProcessingData({ 
        uploadedFiles: files, 
        extractedData 
      });
      
      toast({
        title: "Files uploaded successfully",
        description: `${files.length} files processed and data extracted.`
      });
      
      goToNextStep();
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error processing your files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [updateProcessingData, goToNextStep, toast]);

  const processDiscrepancies = useCallback(() => {
    const discrepancies = documentService.findDiscrepancies(processingData.extractedData);
    updateProcessingData({ discrepancies });
    goToNextStep();
  }, [processingData.extractedData, updateProcessingData, goToNextStep]);

  const resolveDiscrepancies = useCallback((resolvedDiscrepancies: Discrepancy[]) => {
    const combinedData = documentService.combineDataWithResolutions(
      processingData.extractedData,
      resolvedDiscrepancies
    );
    updateProcessingData({ 
      discrepancies: resolvedDiscrepancies, 
      combinedData 
    });
    goToNextStep();
  }, [processingData.extractedData, updateProcessingData, goToNextStep]);

  const applyRules = useCallback(() => {
    const rules = rulesEngine.getRulesForCompanyType(processingData.companyType!);
    const violations = rulesEngine.validateData(processingData.combinedData, rules);
    updateProcessingData({ ruleViolations: violations });
    goToNextStep();
  }, [processingData.companyType, processingData.combinedData, updateProcessingData, goToNextStep]);

  const resolveRuleViolations = useCallback((correctedData: Record<string, any>) => {
    updateProcessingData({ 
      combinedData: correctedData,
      ruleViolations: []
    });
    goToNextStep();
  }, [updateProcessingData, goToNextStep]);

  const updateTemplateData = useCallback((templateData: Record<string, any>) => {
    updateProcessingData({ templateData });
    goToNextStep();
  }, [updateProcessingData, goToNextStep]);

  const generatePDF = useCallback(async () => {
    setIsLoading(true);
    try {
      const pdfUrl = await documentService.generatePDF(processingData.templateData, processingData.companyType!);
      
      toast({
        title: "PDF Generated Successfully",
        description: "Your document is ready for download."
      });
      
      return pdfUrl;
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [processingData.templateData, processingData.companyType, toast]);

  const resetProcessor = useCallback(() => {
    setCurrentStep(1);
    setProcessingData({
      category: "creation",
      companyType: null,
      uploadedFiles: [],
      extractedData: [],
      combinedData: {},
      discrepancies: [],
      ruleViolations: [],
      templateData: {}
    });
  }, []);

  return {
    currentStep,
    processingData,
    isLoading,
    selectCompanyType,
    uploadFiles,
    processDiscrepancies,
    resolveDiscrepancies,
    applyRules,
    resolveRuleViolations,
    updateTemplateData,
    generatePDF,
    goToPreviousStep,
    resetProcessor
  };
};
