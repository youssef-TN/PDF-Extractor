import type { CompanyType, Rule, RuleViolation } from '@/types/processing';

class RulesEngine {
  private rules: Record<CompanyType, Rule[]> = {
    EURL: [
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
        prompt: "The social capital must be at least 1000 euros for EURL.",
        validator: (value: number) => Number(value) >= 1000
      },
      {
        key: "raison_sociale",
        prompt: "The company name must be at least 2 characters long.",
        validator: (value: string) => String(value).length >= 2
      }
    ],
    SARL: [
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
        prompt: "The social capital must be at least 1000 euros for SARL.",
        validator: (value: number) => Number(value) >= 1000
      },
      {
        key: "raison_sociale",
        prompt: "The company name must be at least 2 characters long.",
        validator: (value: string) => String(value).length >= 2
      }
    ],
    SAS: [
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
        prompt: "The social capital must be at least 1 euro for SAS.",
        validator: (value: number) => Number(value) >= 1
      },
      {
        key: "raison_sociale",
        prompt: "The company name must be at least 2 characters long.",
        validator: (value: string) => String(value).length >= 2
      }
    ],
    SASU: [
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
        prompt: "The social capital must be at least 1 euro for SASU.",
        validator: (value: number) => Number(value) >= 1
      },
      {
        key: "raison_sociale",
        prompt: "The company name must be at least 2 characters long.",
        validator: (value: string) => String(value).length >= 2
      }
    ],
    SCI: [
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
        prompt: "The social capital must be specified for SCI.",
        validator: (value: number) => Number(value) > 0
      },
      {
        key: "raison_sociale",
        prompt: "The company name must be at least 2 characters long.",
        validator: (value: string) => String(value).length >= 2
      }
    ]
  };

  getRulesForCompanyType(companyType: CompanyType): Rule[] {
    return this.rules[companyType] || [];
  }

  validateData(data: Record<string, any>, rules: Rule[]): RuleViolation[] {
    const violations: RuleViolation[] = [];
    
    rules.forEach(rule => {
      const value = data[rule.key];
      if (value !== undefined && !rule.validator(value)) {
        violations.push({
          key: rule.key,
          value,
          prompt: rule.prompt,
          resolved: false
        });
      }
    });

    return violations;
  }

  addRule(companyType: CompanyType, rule: Rule): void {
    if (!this.rules[companyType]) {
      this.rules[companyType] = [];
    }
    this.rules[companyType].push(rule);
  }

  updateRule(companyType: CompanyType, ruleKey: string, updatedRule: Rule): void {
    const rules = this.rules[companyType];
    if (rules) {
      const index = rules.findIndex(r => r.key === ruleKey);
      if (index !== -1) {
        rules[index] = updatedRule;
      }
    }
  }

  removeRule(companyType: CompanyType, ruleKey: string): void {
    const rules = this.rules[companyType];
    if (rules) {
      this.rules[companyType] = rules.filter(r => r.key !== ruleKey);
    }
  }
}

export const rulesEngine = new RulesEngine();

