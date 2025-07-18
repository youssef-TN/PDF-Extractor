import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProcessingData } from "@/types/processing";

interface DataDisplayProps {
  data: ProcessingData;
  onComplete: (data: Partial<ProcessingData>) => void;
  onPrevious: () => void;
}

const DataDisplay = ({ data, onComplete, onPrevious }: DataDisplayProps) => {
  const [activeTab, setActiveTab] = useState(data.extractedData[0]?.fileId || "");

  const handleContinue = () => {
    onComplete({});
  };

  const renderDataField = (key: string, value: any) => {
    return (
      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
        <span className="font-medium text-gray-700">{key.replace(/_/g, ' ')}</span>
        <Badge variant="secondary">{String(value)}</Badge>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Extracted Data</h2>
        <p className="text-gray-600">Review the data extracted from your documents</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
              {data.extractedData.map(item => (
                <TabsTrigger key={item.fileId} value={item.fileId}>
                  {item.fileName}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {data.extractedData.map(item => (
              <TabsContent key={item.fileId} value={item.fileId}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.fileName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(item.data).map(([key, value]) => (
                        <div key={key}>
                          {renderDataField(key, value)}
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

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Summary</h3>
        <p className="text-sm text-gray-600">
          Successfully extracted data from {data.extractedData.length} documents. 
          The next step will check for discrepancies between documents.
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={handleContinue} size="lg">
          Continue to Verification
        </Button>
      </div>
    </div>
  );
};

export default DataDisplay;

