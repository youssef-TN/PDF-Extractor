import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, FileText, RefreshCw, Loader2 } from "lucide-react";
import type { CompanyType, StepProps } from "@/types/processing";

interface PDFGenerationViewProps extends StepProps {
  templateData: Record<string, any>;
  companyType: CompanyType;
  onGeneratePDF: () => Promise<string>;
  onReset: () => void;
}

const PDFGenerationView = ({ 
  templateData, 
  companyType, 
  onGeneratePDF, 
  onReset, 
  onPrevious,
  isLoading: externalLoading 
}: PDFGenerationViewProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const url = await onGeneratePDF();
      setDownloadUrl(url);
      setPdfGenerated(true);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${companyType}_Statuts_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const isLoading = externalLoading || isGenerating;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
          pdfGenerated ? 'bg-green-100' : 'bg-blue-100'
        }`}>
          {pdfGenerated ? (
            <CheckCircle className="w-8 h-8 text-green-600" />
          ) : (
            <FileText className="w-8 h-8 text-blue-600" />
          )}
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          {pdfGenerated ? 'Document Ready!' : 'Generate Final Document'}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {pdfGenerated 
            ? 'Your document has been generated successfully and is ready for download.'
            : 'Create your final PDF document with all the processed and verified data.'
          }
        </p>
      </div>

      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50">
          <CardTitle className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-slate-600" />
            Document Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-gray-900 mb-3">Processing Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category:</span>
                  <Badge variant="outline">Creation</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Company Type:</span>
                  <Badge variant="default">{companyType}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Files Processed:</span>
                  <Badge variant="secondary">Multiple Documents</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Validated
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-gray-900 mb-3">Document Data</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Company:</span>
                  <span className="font-medium">{templateData.raison_sociale}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium truncate ml-2" title={templateData.adresse}>
                    {templateData.adresse}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capital:</span>
                  <span className="font-medium">{templateData.capital_social_euros} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Legal Form:</span>
                  <span className="font-medium">{templateData.forme_juridique}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{templateData.date_signature_statuts}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!pdfGenerated && (
        <Card className="max-w-4xl mx-auto shadow-lg border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              Ready to Generate PDF
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Generate Your Document</h3>
                <p className="text-gray-600 mb-6">
                  Click the button below to generate your final PDF document with all the processed data.
                  The document will include all verified information and follow the {companyType} template structure.
                </p>
              </div>
              <Button 
                onClick={handleGeneratePDF}
                disabled={isLoading}
                size="lg"
                className="px-12 py-3 text-lg font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 mr-2" />
                    Generate PDF Document
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {pdfGenerated && (
        <Alert className="max-w-4xl mx-auto border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-green-800">
                  Your PDF document has been generated successfully!
                </span>
                <p className="text-green-700 mt-1">
                  The document is ready for download and includes all your verified data.
                </p>
              </div>
              <Button onClick={handleDownload} className="ml-4 bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between max-w-4xl mx-auto">
        <Button variant="outline" onClick={onPrevious} disabled={isLoading} size="lg">
          Previous
        </Button>
        <Button variant="outline" onClick={onReset} className="flex items-center gap-2" size="lg">
          <RefreshCw className="w-4 h-4" />
          Start New Process
        </Button>
      </div>
    </div>
  );
};

export default PDFGenerationView;

