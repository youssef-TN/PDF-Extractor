import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CheckCircle2, Database } from "lucide-react";
import type { ExtractedData, StepProps } from "@/types/processing";

interface DataDisplayViewProps extends StepProps {
  extractedData: ExtractedData[];
  onNext: () => void;
}

const DataDisplayView = ({ extractedData, onNext, onPrevious }: DataDisplayViewProps) => {
  const renderDataField = (key: string, value: any) => {
    return (
      <div className="flex justify-between items-center p-4 bg-white rounded-lg border hover:border-blue-200 transition-colors">
        <span className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</span>
        <Badge variant="secondary" className="font-mono text-sm">
          {String(value)}
        </Badge>
      </div>
    );
  };

  const getFieldDisplayName = (key: string): string => {
    const fieldNames: Record<string, string> = {
      raison_sociale: "Company Name",
      adresse: "Address", 
      date_signature_statuts: "Signature Date",
      capital_social_euros: "Social Capital (€)",
      forme_juridique: "Legal Form",
      objet_social: "Business Purpose"
    };
    return fieldNames[key] || key.replace(/_/g, ' ');
  };

  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Database className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Extracted Data Review</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Review the data extracted from your documents before proceeding to verification
        </p>
      </div>

      <Card className="max-w-6xl mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            Document Data
            <Badge variant="default" className="ml-auto bg-green-600">
              {extractedData.length} Files Processed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue={extractedData[0]?.fileId} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-auto p-2">
              {extractedData.map(item => (
                <TabsTrigger 
                  key={item.fileId} 
                  value={item.fileId}
                  className="flex items-center gap-2 p-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <FileText className="w-4 h-4" />
                  <span className="truncate">{item.fileName}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {extractedData.map(item => (
              <TabsContent key={item.fileId} value={item.fileId} className="mt-6">
                <Card className="border-2 border-gray-100">
                  <CardHeader className="bg-gray-50">
                    <CardTitle className="text-xl flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      {item.fileName}
                      <Badge variant="outline" className="ml-auto">
                        {Object.keys(item.data).length} Fields
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-4">
                      {Object.entries(item.data).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between items-start p-4 bg-gray-50 rounded-lg border">
                            <div className="space-y-1">
                              <span className="font-semibold text-gray-900">
                                {getFieldDisplayName(key)}
                              </span>
                              <p className="text-sm text-gray-500">Field: {key}</p>
                            </div>
                            <Badge variant="secondary" className="font-mono">
                              {String(value)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 max-w-6xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">Extraction Complete</h3>
              <p className="text-sm text-green-700">
                Successfully extracted data from {extractedData.length} documents. 
                The next step will check for discrepancies between documents.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between max-w-6xl mx-auto">
        <Button variant="outline" onClick={onPrevious} size="lg">
          Previous
        </Button>
        <Button onClick={handleContinue} size="lg" className="px-8">
          Continue to Verification
        </Button>
      </div>
    </div>
  );
};

export default DataDisplayView;
