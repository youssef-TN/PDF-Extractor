import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle } from "lucide-react";
import type { ProcessingData, Discrepancy } from "@/types/processing";

interface DiscrepancyResolutionProps {
  data: ProcessingData;
  onComplete: (data: Partial<ProcessingData>) => void;
  onPrevious: () => void;
}

const DiscrepancyResolution = ({ data, onComplete, onPrevious }: DiscrepancyResolutionProps) => {
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([]);
  const [customValues, setCustomValues] = useState<Record<string, string>>({});

  useEffect(() => {
    // Find discrepancies by comparing extracted data
    const foundDiscrepancies: Discrepancy[] = [];
    const allKeys = new Set<string>();
    
    // Collect all keys from all documents
    data.extractedData.forEach(item => {
      Object.keys(item.data).forEach(key => allKeys.add(key));
    });

    // Check each key for discrepancies
    allKeys.forEach(key => {
      const values = data.extractedData.map(item => ({
        fileId: item.fileId,
        fileName: item.fileName,
        value: item.data[key]
      })).filter(item => item.value !== undefined);

      // Check if there are different values for the same key
      const uniqueValues = new Set(values.map(v => String(v.value)));
      if (uniqueValues.size > 1) {
        foundDiscrepancies.push({
          key,
          values,
          resolvedValue: values[0].value // Default to first value
        });
      }
    });

    setDiscrepancies(foundDiscrepancies);
  }, [data.extractedData]);

  const handleValueSelection = (discrepancyKey: string, value: any) => {
    setDiscrepancies(prev => 
      prev.map(d => 
        d.key === discrepancyKey 
          ? { ...d, resolvedValue: value }
          : d
      )
    );
  };

  const handleCustomValue = (discrepancyKey: string, value: string) => {
    setCustomValues(prev => ({ ...prev, [discrepancyKey]: value }));
    setDiscrepancies(prev => 
      prev.map(d => 
        d.key === discrepancyKey 
          ? { ...d, resolvedValue: value }
          : d
      )
    );
  };

  const handleContinue = () => {
    // Create combined data with resolved values
    const combinedData: Record<string, any> = {};
    
    // Add resolved discrepancies
    discrepancies.forEach(d => {
      combinedData[d.key] = d.resolvedValue;
    });

    // Add non-discrepant values
    const allKeys = new Set<string>();
    data.extractedData.forEach(item => {
      Object.keys(item.data).forEach(key => allKeys.add(key));
    });

    allKeys.forEach(key => {
      if (!discrepancies.some(d => d.key === key)) {
        // No discrepancy, use value from first document
        combinedData[key] = data.extractedData[0].data[key];
      }
    });

    onComplete({ discrepancies, combinedData });
  };

  if (discrepancies.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Discrepancy Check</h2>
          <p className="text-gray-600">Checking for inconsistencies between documents</p>
        </div>

        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            No discrepancies found! All documents contain consistent data.
          </AlertDescription>
        </Alert>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Previous
          </Button>
          <Button onClick={handleContinue} size="lg">
            Continue to Rules
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Resolve Discrepancies</h2>
        <p className="text-gray-600">Choose the correct values for conflicting data</p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Found {discrepancies.length} discrepancies between your documents. 
          Please select the correct value for each field.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {discrepancies.map(discrepancy => (
          <Card key={discrepancy.key}>
            <CardHeader>
              <CardTitle className="text-lg capitalize">
                {discrepancy.key.replace(/_/g, ' ')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <RadioGroup
                  value={String(discrepancy.resolvedValue)}
                  onValueChange={(value) => handleValueSelection(discrepancy.key, value)}
                >
                  {discrepancy.values.map(item => (
                    <div key={item.fileId} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(item.value)} id={`${discrepancy.key}-${item.fileId}`} />
                      <Label htmlFor={`${discrepancy.key}-${item.fileId}`} className="flex-1">
                        <span className="font-medium">{item.fileName}:</span> {String(item.value)}
                      </Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id={`${discrepancy.key}-custom`} />
                    <Label htmlFor={`${discrepancy.key}-custom`}>Custom value:</Label>
                    <Input
                      value={customValues[discrepancy.key] || ""}
                      onChange={(e) => handleCustomValue(discrepancy.key, e.target.value)}
                      placeholder="Enter custom value"
                      className="flex-1"
                    />
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={handleContinue} size="lg">
          Continue to Rules
        </Button>
      </div>
    </div>
  );
};

export default DiscrepancyResolution;

