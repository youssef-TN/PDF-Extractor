import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Shield, ShieldAlert } from "lucide-react";
import { rulesEngine } from "@/services/rulesEngine";
import type { CompanyType, RuleViolation, StepProps } from "@/types/processing";

interface RuleApplicationViewProps extends StepProps {
  combinedData: Record<string, any>;
  ruleViolations: RuleViolation[];
  companyType: CompanyType;
  onApplyRules: () => void;
  onResolveViolations: (correctedData: Record<string, any>) => void;
}

const RuleApplicationView = ({ 
  combinedData,
  ruleViolations: initialViolations,
  companyType,
  onApplyRules,
  onResolveViolations,
  onPrevious 
}: RuleApplicationViewProps) => {
  const [violations, setViolations] = useState<RuleViolation[]>(initialViolations);
  const [correctedValues, setCorrectedValues] = useState<Record<string, string>>({});
  const [hasAppliedRules, setHasAppliedRules] = useState(initialViolations.length > 0);

  useEffect(() => {
    if (!hasAppliedRules) {
      onApplyRules();
      setHasAppliedRules(true);
    }
  }, [hasAppliedRules, onApplyRules]);

  useEffect(() => {
    setViolations(initialViolations);
  }, [initialViolations]);

  const handleValueCorrection = (key: string, newValue: string) => {
    setCorrectedValues(prev => ({ ...prev, [key]: newValue }));
    
    // Check if the new value satisfies the rule
    const rules = rulesEngine.getRulesForCompanyType(companyType);
    const rule = rules.find(r => r.key === key);
    if (rule) {
      const isValid = rule.validator(newValue);
      setViolations(prev => 
        prev.map(violation => 
          violation.key === key 
            ? { ...violation, resolved: isValid }
            : violation
        )
      );
    }
  };

  const handleContinue = () => {
    // Update combined data with corrected values
    const updatedCombinedData = { ...combinedData };
    Object.entries(correctedValues).forEach(([key, value]) => {
      updatedCombinedData[key] = value;
    });

    onResolveViolations(updatedCombinedData);
  };

  const allViolationsResolved = violations.every(v => v.resolved);

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

  if (!hasAppliedRules) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Applying Business Rules</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Validating your data against {companyType} business rules...
          </p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (violations.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">All Rules Passed</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your data meets all business rules for {companyType}. Ready to proceed!
          </p>
        </div>

        <Alert className="max-w-4xl mx-auto border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Validation complete!</strong> All business rules passed successfully. 
            Your data is valid and ready for document generation.
          </AlertDescription>
        </Alert>

        <div className="flex justify-between max-w-4xl mx-auto">
          <Button variant="outline" onClick={onPrevious} size="lg">
            Previous
          </Button>
          <Button onClick={handleContinue} size="lg" className="px-8">
            Continue to Template
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Fix Rule Violations</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Some values don't meet the {companyType} business rules. Please correct them below.
        </p>
      </div>

      <Alert className="max-w-6xl mx-auto border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Rule violations found:</strong> {violations.filter(v => !v.resolved).length} values 
          need to be corrected to meet {companyType} requirements.
        </AlertDescription>
      </Alert>

      <div className="space-y-6 max-w-6xl mx-auto">
        {violations.map((violation, index) => (
          <Card 
            key={violation.key} 
            className={`border-2 shadow-lg transition-all ${
              violation.resolved 
                ? "border-green-200 bg-green-50" 
                : "border-red-200"
            }`}
          >
            <CardHeader className={`${
              violation.resolved 
                ? "bg-gradient-to-r from-green-50 to-emerald-50" 
                : "bg-gradient-to-r from-red-50 to-pink-50"
            }`}>
              <CardTitle className="text-xl flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  violation.resolved 
                    ? "bg-green-100 text-green-600" 
                    : "bg-red-100 text-red-600"
                }`}>
                  {index + 1}
                </div>
                {getFieldDisplayName(violation.key)}
                <div className="ml-auto flex items-center gap-2">
                  {violation.resolved ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <Badge variant="default" className="bg-green-600">Fixed</Badge>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-5 h-5 text-red-600" />
                      <Badge variant="destructive">Needs Fix</Badge>
                    </>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border ${
                  violation.resolved 
                    ? "bg-green-50 border-green-200" 
                    : "bg-yellow-50 border-yellow-200"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className={`w-5 h-5 ${
                      violation.resolved ? "text-green-600" : "text-yellow-600"
                    }`} />
                    <span className={`font-medium ${
                      violation.resolved ? "text-green-800" : "text-yellow-800"
                    }`}>
                      Business Rule
                    </span>
                  </div>
                  <p className={`text-sm ${
                    violation.resolved ? "text-green-700" : "text-yellow-700"
                  }`}>
                    {violation.prompt}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={`rule-${violation.key}`} className="text-sm font-medium">
                      Current Value:
                    </Label>
                    <Badge variant="outline" className="font-mono text-red-600 border-red-300">
                      {String(violation.value)}
                    </Badge>
                  </div>
                  
                  <Input
                    id={`rule-${violation.key}`}
                    value={correctedValues[violation.key] || String(violation.value)}
                    onChange={(e) => handleValueCorrection(violation.key, e.target.value)}
                    placeholder="Enter corrected value"
                    className={`${
                      violation.resolved 
                        ? "border-green-300 bg-green-50" 
                        : "border-red-300"
                    }`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between max-w-6xl mx-auto">
        <Button variant="outline" onClick={onPrevious} size="lg">
          Previous
        </Button>
        <Button 
          onClick={handleContinue} 
          disabled={!allViolationsResolved}
          size="lg" 
          className="px-8"
        >
          {allViolationsResolved ? "Continue to Template" : "Fix All Violations First"}
        </Button>
      </div>
    </div>
  );
};

export default RuleApplicationView;

