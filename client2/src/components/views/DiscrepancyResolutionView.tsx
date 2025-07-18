import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, FileX } from "lucide-react";
import type { Discrepancy, StepProps } from "@/types/processing";

interface DiscrepancyResolutionViewProps extends StepProps {
  discrepancies: Discrepancy[];
  onResolveDiscrepancies: (discrepancies: Discrepancy[]) => void;
}

const DiscrepancyResolutionView = ({ 
  discrepancies: initialDiscrepancies, 
  onResolveDiscrepancies, 
  onPrevious 
}: DiscrepancyResolutionViewProps) => {
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>(initialDiscrepancies);
  const [customValues, setCustomValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setDiscrepancies(initialDiscrepancies);
  }, [initialDiscrepancies]);

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
    handleValueSelection(discrepancyKey, value);
  };

  const handleContinue = () => {
    onResolveDiscrepancies(discrepancies);
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

  if (discrepancies.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">No Discrepancies Found</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            All documents contain consistent data. You can proceed to the next step.
          </p>
        </div>

        <Alert className="max-w-4xl mx-auto border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Perfect match!</strong> All documents contain consistent data across all fields.
          </AlertDescription>
        </Alert>

        <div className="flex justify-between max-w-4xl mx-auto">
          <Button variant="outline" onClick={onPrevious} size="lg">
            Previous
          </Button>
          <Button onClick={handleContinue} size="lg" className="px-8">
            Continue to Rules Validation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Resolve Data Discrepancies</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We found conflicting values between your documents. Please select the correct value for each field.
        </p>
      </div>

      <Alert className="max-w-6xl mx-auto border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Discrepancies detected:</strong> Found {discrepancies.length} conflicting values between your documents. 
          Please review and select the correct value for each field below.
        </AlertDescription>
      </Alert>

      <div className="space-y-6 max-w-6xl mx-auto">
        {discrepancies.map((discrepancy, index) => (
          <Card key={discrepancy.key} className="border-2 border-orange-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                  {index + 1}
                </div>
                {getFieldDisplayName(discrepancy.key)}
                <Badge variant="destructive" className="ml-auto">
                  Conflict
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FileX className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Field: {discrepancy.key}</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    This field has different values across your documents. Please select the correct one.
                  </p>
                </div>
                
                <RadioGroup
                  value={String(discrepancy.resolvedValue)}
                  onValueChange={(value) => handleValueSelection(discrepancy.key, value)}
                  className="space-y-4"
                >
                  {discrepancy.values.map(item => (
                    <div key={item.fileId} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={String(item.value)} id={`${discrepancy.key}-${item.fileId}`} />
                      <Label htmlFor={`${discrepancy.key}-${item.fileId}`} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900">{item.fileName}</span>
                            <p className="text-sm text-gray-500">Source document</p>
                          </div>
                          <Badge variant="outline" className="font-mono">
                            {String(item.value)}
                          </Badge>
                        </div>
                      </Label>
                    </div>
                  ))}
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="custom" id={`${discrepancy.key}-custom`} />
                      <Label htmlFor={`${discrepancy.key}-custom`} className="font-medium">
                        Custom value:
                      </Label>
                    </div>
                    <div className="mt-3 ml-7">
                      <Input
                        value={customValues[discrepancy.key] || ""}
                        onChange={(e) => handleCustomValue(discrepancy.key, e.target.value)}
                        placeholder="Enter your own value"
                        className="max-w-md"
                      />
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between max-w-6xl mx-auto">
        <Button variant="outline" onClick={onPrevious} size="lg">
          Previous
        </Button>
        <Button onClick={handleContinue} size="lg" className="px-8">
          Continue to Rules Validation
        </Button>
      </div>
    </div>
  );
};

export default DiscrepancyResolutionView;

