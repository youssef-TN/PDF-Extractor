import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building2, FileText } from "lucide-react";
import type { CompanyType, StepProps } from "@/types/processing";

interface CategorySelectionViewProps extends StepProps {
  selectedCompanyType: CompanyType | null;
  onSelectCompanyType: (companyType: CompanyType) => void;
}

const CategorySelectionView = ({ 
  selectedCompanyType, 
  onSelectCompanyType,
  isLoading 
}: CategorySelectionViewProps) => {
  const companyTypes: { value: CompanyType; label: string; description: string; minCapital: string }[] = [
    { 
      value: "EURL", 
      label: "EURL", 
      description: "Entreprise Unipersonnelle à Responsabilité Limitée",
      minCapital: "1 000 €"
    },
    { 
      value: "SARL", 
      label: "SARL", 
      description: "Société à Responsabilité Limitée",
      minCapital: "1 000 €"
    },
    { 
      value: "SAS", 
      label: "SAS", 
      description: "Société par Actions Simplifiée",
      minCapital: "1 €"
    },
    { 
      value: "SASU", 
      label: "SASU", 
      description: "Société par Actions Simplifiée Unipersonnelle",
      minCapital: "1 €"
    },
    { 
      value: "SCI", 
      label: "SCI", 
      description: "Société Civile Immobilière",
      minCapital: "Variable"
    }
  ];

  const selectedType = companyTypes.find(type => type.value === selectedCompanyType);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Building2 className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Choose Your Company Structure</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the legal structure of your company to begin the document processing workflow
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl">Document Category</CardTitle>
                <CardDescription>Type of document processing</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Creation</span>
              <Badge variant="default" className="bg-blue-600">Selected</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl">Company Type</CardTitle>
                <CardDescription>Legal structure of your company</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Select 
              value={selectedCompanyType || ""} 
              onValueChange={(value) => onSelectCompanyType(value as CompanyType)}
              disabled={isLoading}
            >
              <SelectTrigger className="h-12 text-lg">
                <SelectValue placeholder="Select company type" />
              </SelectTrigger>
              <SelectContent>
                {companyTypes.map(type => (
                  <SelectItem key={type.value} value={type.value} className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{type.label}</span>
                      <span className="text-sm text-gray-500">Min. Capital: {type.minCapital}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {selectedType && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-blue-700 border-blue-300">
                  {selectedType.label}
                </Badge>
                <h3 className="text-lg font-semibold text-blue-900">
                  {selectedType.description}
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Minimum Capital:</span>
                  <span className="ml-2 text-blue-700">{selectedType.minCapital}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Structure:</span>
                  <span className="ml-2 text-blue-700">
                    {selectedType.value.includes('U') ? 'Single Shareholder' : 'Multiple Shareholders'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center pt-4">
        <Button 
          onClick={() => selectedCompanyType && onSelectCompanyType(selectedCompanyType)}
          disabled={!selectedCompanyType || isLoading}
          size="lg"
          className="px-12 py-3 text-lg font-semibold"
        >
          {isLoading ? "Processing..." : "Continue to File Upload"}
        </Button>
      </div>
    </div>
  );
};

export default CategorySelectionView;

