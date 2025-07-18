import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDocumentProcessor } from "@/hooks/useDocumentProcessor";
import CategorySelectionView from "./views/CategorySelectionView";
import FileUploadView from "./views/FileUploadView";
import DataDisplayView from "./views/DataDisplayView";
import DiscrepancyResolutionView from "./views/DiscrepancyResolutionView";
import RuleApplicationView from "./views/RuleApplicationView";
import TemplateModificationView from "./views/TemplateModificationView";
import PDFGenerationView from "./views/PDFGenerationView";

const DocumentProcessor = () => {
  const {
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
  } = useDocumentProcessor();

  const steps = [
    "Category Selection",
    "File Upload",
    "Data Display",
    "Discrepancy Resolution",
    "Rule Application",
    "Template Modification",
    "PDF Generation"
  ];

  const progress = (currentStep / steps.length) * 100;

  const renderCurrentStep = () => {
    const commonProps = {
      onNext: () => {},
      onPrevious: goToPreviousStep,
      isLoading
    };

    switch (currentStep) {
      case 1:
        return (
          <CategorySelectionView 
            selectedCompanyType={processingData.companyType}
            onSelectCompanyType={selectCompanyType}
            {...commonProps}
          />
        );
      case 2:
        return (
          <FileUploadView 
            uploadedFiles={processingData.uploadedFiles}
            onUploadFiles={uploadFiles}
            {...commonProps}
          />
        );
      case 3:
        return (
          <DataDisplayView 
            extractedData={processingData.extractedData}
            processDiscrepancies={processDiscrepancies}
            {...commonProps}
          />
        );
      case 4:
        return (
          <DiscrepancyResolutionView 
            discrepancies={processingData.discrepancies}
            onResolveDiscrepancies={resolveDiscrepancies}
            {...commonProps}
          />
        );
      case 5:
        return (
          <RuleApplicationView 
            combinedData={processingData.combinedData}
            ruleViolations={processingData.ruleViolations}
            companyType={processingData.companyType!}
            onApplyRules={applyRules}
            onResolveViolations={resolveRuleViolations}
            {...commonProps}
          />
        );
      case 6:
        return (
          <TemplateModificationView 
            templateData={processingData.combinedData}
            companyType={processingData.companyType!}
            onUpdateTemplate={updateTemplateData}
            {...commonProps}
          />
        );
      case 7:
        return (
          <PDFGenerationView 
            templateData={processingData.templateData}
            companyType={processingData.companyType!}
            onGeneratePDF={generatePDF}
            onReset={resetProcessor}
            {...commonProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Document Processing Workflow</CardTitle>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between text-sm text-blue-100">
                <span className="font-medium">Step {currentStep} of {steps.length}: {steps[currentStep - 1]}</span>
                <span className="font-semibold">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="w-full h-2 bg-blue-700" />
            </div>
          </CardHeader>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            {renderCurrentStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentProcessor;

