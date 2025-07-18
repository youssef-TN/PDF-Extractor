import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle } from "lucide-react";
import type { ProcessingData, Rule, RuleViolation } from "@/types/processing";

interface RuleApplicationProps {
  data: ProcessingData;
  onComplete: (data: Partial<ProcessingData>) => void;
  onPrevious: () => void;
}

const RuleApplication = ({ data, onComplete, onPrevious }: RuleApplicationProps) => {
  const [ruleViolations, setRuleViolations] = useState<RuleViolation[]>([]);
  const [correctedValues, setCorrectedValues] = useState<Record<string, string>>({});

  // Define rules based on company type
  const rules: Rule[] = [
    {
      key: "date_signature_statuts",
      prompt: "The signature date must be within 3 months of the current date.",
      validator: (value: string) => {
        const date = new Date(value);
        const now = new Date();
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        return date >= threeMonthsAgo && date <= now;
      }
    },
    {
      key: "capital_social_euros",
      prompt: "The social capital must be at least 1000 euros.",
      validator: (value: number) => {
        return Number(value) >= 1000;
      }
    },
    {
      key: "raison_sociale",
      prompt: "The company name must be at least 2 characters long.",
      validator: (value: string) => {
        return String(value).length >= 2;
      }
    },
    {
      key: "adresse",
      prompt: "The address must be provided and not empty.",
      validator: (value: string) => {
        return String(value).trim().length > 0;
      }
    }
  ];

  useEffect(() => {
    // Check rules against combined data
    const violations: RuleViolation[] = [];
    
    rules.forEach(rule => {
      const value = data.combinedData[rule.key];
      if (value !== undefined && !rule.validator(value)) {
        violations.push({
          key: rule.key,
          value,
          prompt: rule.prompt,
          resolved: false
        });
      }
    });

    setRuleViolations(violations);
  }, [data.combinedData]);

  const handleValueCorrection = (key: string, newValue: string) => {
    setCorrectedValues(prev => ({ ...prev, [key]: newValue }));
    
    // Check if the new value satisfies the rule
    const rule = rules.find(r => r.key === key);
    if (rule) {
      const isValid = rule.validator(newValue);
      setRuleViolations(prev => 
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
    const updatedCombinedData = { ...data.combinedData };
    Object.entries(correctedValues).forEach(([key, value]) => {
      updatedCombinedData[key] = value;
    });

    onComplete({ 
      ruleViolations,
      combinedData: updatedCombinedData
    });
  };

  const allViolationsResolved = ruleViolations.every(v => v.resolved);

  if (ruleViolations.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Rule Validation</h2>
          <p className="text-gray-600">Checking data against business rules</p>
        </div>

        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            All business rules passed! Your data is valid and ready for template generation.
          </AlertDescription>
        </Alert>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Previous
          </Button>
          <Button onClick={handleContinue} size="lg">
            Continue to Template
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Rule Validation</h2>
        <p className="text-gray-600">Correct any rule violations before proceeding</p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Found {ruleViolations.filter(v => !v.resolved).length} rule violations. 
          Please correct the values below.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {ruleViolations.map(violation => (
          <Card key={violation.key} className={violation.resolved ? "border-green-200" : "border-red-200"}>
            <CardHeader>
              <CardTitle className="text-lg capitalize flex items-center gap-2">
                {violation.key.replace(/_/g, ' ')}
                {violation.resolved && <CheckCircle className="w-5 h-5 text-green-600" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">{violation.prompt}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`rule-${violation.key}`}>
                    Current Value: <span className="font-mono text-red-600">{String(violation.value)}</span>
                  </Label>
                  <Input
                    id={`rule-${violation.key}`}
                    value={correctedValues[violation.key] || String(violation.value)}
                    onChange={(e) => handleValueCorrection(violation.key, e.target.value)}
                    placeholder="Enter corrected value"
                    className={violation.resolved ? "border-green-300" : "border-red-300"}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button 
          onClick={handleContinue} 
          disabled={!allViolationsResolved}
          size="lg"
        >
          Continue to Template
        </Button>
      </div>
    </div>
  );
};

export default RuleApplication;

