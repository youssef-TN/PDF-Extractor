import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import CategorySelection from "./steps/CategorySelection";
import FileUpload from "./steps/FileUpload";
import DataDisplay from "./steps/DataDisplay";
import DiscrepancyResolution from "./steps/DiscrepancyResolution";
import RuleApplication from "./steps/RuleApplication";
import TemplateModification from "./steps/TemplateModification";
import PDFGeneration from "./steps/PDFGeneration";
import type { ProcessingData, CompanyType } from "@/types/processing";

const DocumentProcessor = () => {
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleStepComplete = (stepData: any) => {
    setProcessingData(prev => ({ ...prev, ...stepData }));
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CategorySelection 
            data={processingData} 
            onComplete={handleStepComplete}
          />
        );
      case 2:
        return (
          <FileUpload 
            data={processingData} 
            onComplete={handleStepComplete}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <DataDisplay 
            data={processingData} 
            onComplete={handleStepComplete}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <DiscrepancyResolution 
            data={processingData} 
            onComplete={handleStepComplete}
            onPrevious={handlePrevious}
          />
        );
      case 5:
        return (
          <RuleApplication 
            data={processingData} 
            onComplete={handleStepComplete}
            onPrevious={handlePrevious}
          />
        );
      case 6:
        return (
          <TemplateModification 
            data={processingData} 
            onComplete={handleStepComplete}
            onPrevious={handlePrevious}
          />
        );
      case 7:
        return (
          <PDFGeneration 
            data={processingData} 
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Document Processing Workflow</CardTitle>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Step {currentStep} of {steps.length}: {steps[currentStep - 1]}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-6">
            {renderCurrentStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentProcessor;

