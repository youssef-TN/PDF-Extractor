import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Download, FileText } from "lucide-react";
import type { ProcessingData } from "@/types/processing";

interface PDFGenerationProps {
  data: ProcessingData;
  onPrevious: () => void;
}

const PDFGeneration = ({ data, onPrevious }: PDFGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate PDF generation API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real app, this would be the actual PDF blob/URL from backend
      const mockPdfBlob = new Blob(["Mock PDF content"], { type: "application/pdf" });
      const url = URL.createObjectURL(mockPdfBlob);
      setDownloadUrl(url);
      setPdfGenerated(true);
      
      console.log({
        title: "PDF Generated Successfully",
        description: "Your document is ready for download."
      });
      
    } catch (error) {
      console.log({
        title: "Generation Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${data.companyType}_Statuts_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      console.log({
        title: "Download Started",
        description: "Your document is being downloaded."
      });
    }
  };

  const handleStartOver = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">PDF Generation</h2>
        <p className="text-gray-600">Generate your final document</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Processing Details</h4>
              <ul className="text-sm space-y-1">
                <li>Category: {data.category}</li>
                <li>Company Type: {data.companyType}</li>
                <li>Files Processed: {data.uploadedFiles.length}</li>
                <li>Discrepancies Resolved: {data.discrepancies.length}</li>
                <li>Rule Violations Fixed: {data.ruleViolations.length}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Document Data</h4>
              <ul className="text-sm space-y-1">
                <li>Company: {data.templateData.raison_sociale}</li>
                <li>Address: {data.templateData.adresse}</li>
                <li>Capital: {data.templateData.capital_social_euros} €</li>
                <li>Legal Form: {data.templateData.forme_juridique}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {!pdfGenerated && (
        <Card>
          <CardHeader>
            <CardTitle>Generate PDF Document</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <FileText className="w-16 h-16 mx-auto text-blue-600" />
              <p className="text-gray-600">
                Click the button below to generate your final PDF document with all the processed data.
              </p>
              <Button 
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                size="lg"
                className="px-8"
              >
                {isGenerating ? "Generating PDF..." : "Generate PDF"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {pdfGenerated && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>Your PDF document has been generated successfully!</span>
              <Button onClick={handleDownload} className="ml-4">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} disabled={isGenerating}>
          Previous
        </Button>
        <Button variant="outline" onClick={handleStartOver}>
          Start New Process
        </Button>
      </div>
    </div>
  );
};

export default PDFGeneration;

