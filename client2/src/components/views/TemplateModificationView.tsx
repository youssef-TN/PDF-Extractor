import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileEdit, Eye, Save } from "lucide-react";
import type { CompanyType, StepProps } from "@/types/processing";

interface TemplateModificationViewProps extends StepProps {
  templateData: Record<string, any>;
  companyType: CompanyType;
  onUpdateTemplate: (templateData: Record<string, any>) => void;
}

const TemplateModificationView = ({ 
  templateData: initialData, 
  companyType, 
  onUpdateTemplate, 
  onPrevious 
}: TemplateModificationViewProps) => {
  const [templateData, setTemplateData] = useState<Record<string, any>>(initialData);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    setTemplateData(initialData);
  }, [initialData]);

  const handleFieldChange = (key: string, value: string) => {
    setTemplateData(prev => ({ ...prev, [key]: value }));
  };

  const handleContinue = () => {
    onUpdateTemplate(templateData);
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

  const renderField = (key: string, value: any) => {
    const label = getFieldDisplayName(key);
    
    if (key === "objet_social") {
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key} className="text-sm font-medium">
            {label}
          </Label>
          <Textarea
            id={key}
            value={String(value)}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            rows={3}
            className="w-full resize-none"
            placeholder="Describe the business purpose..."
          />
        </div>
      );
    }

    return (
      <div key={key} className="space-y-2">
        <Label htmlFor={key} className="text-sm font-medium">
          {label}
        </Label>
        <Input
          id={key}
          value={String(value)}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className="w-full"
          type={key.includes('date') ? 'date' : key.includes('euros') ? 'number' : 'text'}
        />
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <FileEdit className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Finalize Document Template</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Review and modify the template data before generating your final {companyType} document
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50">
            <Button
              variant={!previewMode ? "default" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode(false)}
              className="flex items-center gap-2"
            >
              <FileEdit className="w-4 h-4" />
              Edit Mode
            </Button>
            <Button
              variant={previewMode ? "default" : "ghost"}
              size="sm"
              onClick={() => setPreviewMode(true)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview Mode
            </Button>
          </div>
        </div>

        {!previewMode ? (
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-3">
                <FileEdit className="w-6 h-6 text-purple-600" />
                Document Template - {companyType}
                <Badge variant="outline" className="ml-auto">
                  Edit Mode
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(templateData).map(([key, value]) => 
                  renderField(key, value)
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-3">
                <Eye className="w-6 h-6 text-blue-600" />
                Document Preview - {companyType}
                <Badge variant="default" className="ml-auto bg-blue-600">
                  Preview Mode
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6 bg-white border rounded-lg p-8 shadow-inner">
                <div className="text-center border-b pb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    STATUTS DE LA SOCIÉTÉ
                  </h1>
                  <p className="text-lg text-gray-600">({companyType})</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-semibold text-gray-700">Dénomination sociale:</span>
                    <span className="text-gray-900">{templateData.raison_sociale}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-semibold text-gray-700">Forme juridique:</span>
                    <span className="text-gray-900">{templateData.forme_juridique}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-semibold text-gray-700">Siège social:</span>
                    <span className="text-gray-900">{templateData.adresse}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-semibold text-gray-700">Capital social:</span>
                    <span className="text-gray-900">{templateData.capital_social_euros} €</span>
                  </div>
                  <div className="py-3 border-b border-gray-100">
                    <span className="font-semibold text-gray-700">Objet social:</span>
                    <p className="text-gray-900 mt-2">{templateData.objet_social}</p>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-semibold text-gray-700">Date de signature:</span>
                    <span className="text-gray-900">{templateData.date_signature_statuts}</span>
                  </div>
                </div>

                <div className="text-center pt-6 border-t">
                  <p className="text-sm text-gray-500">
                    Document généré automatiquement • {new Date().toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-between max-w-6xl mx-auto">
        <Button variant="outline" onClick={onPrevious} size="lg">
          Previous
        </Button>
        <Button onClick={handleContinue} size="lg" className="flex items-center gap-2 px-8">
          <Save className="w-4 h-4" />
          Generate PDF Document
        </Button>
      </div>
    </div>
  );
};

export default TemplateModificationView;

