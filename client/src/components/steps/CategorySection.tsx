import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CompanyType, ProcessingData } from "@/types/processing";

interface CategorySelectionProps {
  data: ProcessingData;
  onComplete: (data: Partial<ProcessingData>) => void;
}

const CategorySelection = ({ data, onComplete }: CategorySelectionProps) => {
  const [selectedCompanyType, setSelectedCompanyType] = useState<CompanyType | null>(data.companyType);

  const companyTypes: { value: CompanyType; label: string; description: string }[] = [
    { value: "EURL", label: "EURL", description: "Entreprise Unipersonnelle à Responsabilité Limitée" },
    { value: "SARL", label: "SARL", description: "Société à Responsabilité Limitée" },
    { value: "SAS", label: "SAS", description: "Société par Actions Simplifiée" },
    { value: "SASU", label: "SASU", description: "Société par Actions Simplifiée Unipersonnelle" },
    { value: "SCI", label: "SCI", description: "Société Civile Immobilière" }
  ];

  const handleContinue = () => {
    if (selectedCompanyType) {
      onComplete({ companyType: selectedCompanyType });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Select Category and Company Type</h2>
        <p className="text-gray-600">Choose the type of document processing you need</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category</CardTitle>
            <CardDescription>Document processing category</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={data.category} disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="creation">Creation</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Type</CardTitle>
            <CardDescription>Select your company structure</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedCompanyType || ""} onValueChange={(value) => setSelectedCompanyType(value as CompanyType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select company type" />
              </SelectTrigger>
              <SelectContent>
                {companyTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {selectedCompanyType && (
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">{selectedCompanyType}</h3>
            <p className="text-sm text-gray-600">
              {companyTypes.find(type => type.value === selectedCompanyType)?.description}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleContinue}
          disabled={!selectedCompanyType}
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default CategorySelection;

