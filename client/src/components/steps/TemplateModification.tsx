import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProcessingData } from "@/types/processing";

interface TemplateModificationProps {
  data: ProcessingData;
  onComplete: (data: Partial<ProcessingData>) => void;
  onPrevious: () => void;
}

const TemplateModification = ({ data, onComplete, onPrevious }: TemplateModificationProps) => {
  const [templateData, setTemplateData] = useState<Record<string, any>>({});

  useEffect(() => {
    // Initialize template data with combined data
    setTemplateData(data.combinedData);
  }, [data.combinedData]);

  const handleFieldChange = (key: string, value: string) => {
    setTemplateData(prev => ({ ...prev, [key]: value }));
  };

  const handleContinue = () => {
    onComplete({ templateData });
  };

  const renderField = (key: string, value: any) => {
    const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    if (key === "objet_social") {
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{label}</Label>
          <Textarea
            id={key}
            value={String(value)}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            rows={3}
            className="w-full"
          />
        </div>
      );
    }

    return (
      <div key={key} className="space-y-2">
        <Label htmlFor={key}>{label}</Label>
        <Input
          id={key}
          value={String(value)}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className="w-full"
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Template Modification</h2>
        <p className="text-gray-600">Review and modify the template data before generating the final document</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Template - {data.companyType}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(templateData).map(([key, value]) => 
              renderField(key, value)
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg">Document Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-4 bg-white rounded-lg border">
            <div className="text-center">
              <h3 className="text-xl font-bold">STATUTS DE LA SOCIÉTÉ</h3>
              <p className="text-sm text-gray-600">({data.companyType})</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="font-semibold">Dénomination sociale:</span> {templateData.raison_sociale}
              </div>
              <div>
                <span className="font-semibold">Forme juridique:</span> {templateData.forme_juridique}
              </div>
              <div>
                <span className="font-semibold">Siège social:</span> {templateData.adresse}
              </div>
              <div>
                <span className="font-semibold">Capital social:</span> {templateData.capital_social_euros} €
              </div>
              <div>
                <span className="font-semibold">Objet social:</span> {templateData.objet_social}
              </div>
              <div>
                <span className="font-semibold">Date de signature:</span> {templateData.date_signature_statuts}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={handleContinue} size="lg">
          Generate PDF
        </Button>
      </div>
    </div>
  );
};

export default TemplateModification;

