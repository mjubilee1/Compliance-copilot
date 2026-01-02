import { openai } from '../lib/openai';
import {
    ComplianceCheckInput,
    ComplianceCheckResult,
    ComplianceIssue,
    RiskLevel,
} from '../types/compliance';

// Simple, hard-coded policies for v1 – you can move this to DB later
function getPolicyText(input: ComplianceCheckInput): string {
  if (input.industry === 'real_estate') {
    return `
You are a compliance reviewer for REAL ESTATE sales communications.

Key rules to enforce:
- FAIR HOUSING: No discrimination or preference based on race, color, religion, sex, disability, familial status, national origin, or other protected classes.
- NO STEERING: Do not suggest that certain groups of people "belong" or "don't belong" in a neighborhood.
- ADVERTISING TRUTHFULNESS: Don't misrepresent property condition, pricing, or availability.
- LICENSE & AGENCY: Avoid implying you're licensed in a jurisdiction where you're not.

Jurisdiction: ${input.jurisdiction ?? 'unspecified'}
Channel: ${input.channel ?? 'unspecified'}
`;
  }

  if (input.industry === 'finance') {
    return `
You are a compliance reviewer for FINANCIAL SERVICES communications.

High-level rules:
- No guarantees of returns.
- Avoid misleading statements about risk.
- Respect privacy and do not request sensitive data in insecure channels.
- Flag anything that could violate AML / KYC requirements.

Jurisdiction: ${input.jurisdiction ?? 'unspecified'}
Channel: ${input.channel ?? 'unspecified'}
`;
  }

  return `
You are a generic compliance reviewer.
Flag discriminatory, misleading, or clearly risky statements.
`;
}

export async function checkMessageCompliance(
  input: ComplianceCheckInput,
): Promise<ComplianceCheckResult> {
  const policy = getPolicyText(input);

  // Define the JSON shape we want back
  const schema = {
    type: 'object',
    properties: {
      riskLevel: {
        type: 'string',
        enum: ['low', 'medium', 'high'],
      },
      issues: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            description: { type: 'string' },
            severity: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
            },
            suggestion: { type: 'string' },
            category: { type: 'string' },
          },
          required: ['code', 'description', 'severity', 'suggestion', 'category'],
          additionalProperties: false,
        },
      },
      suggestedText: { type: 'string' },
      requiredDisclosures: {
        type: 'array',
        items: { type: 'string' },
      },
      modelExplanation: { type: 'string' },
    },
    required: ['riskLevel', 'issues', 'suggestedText', 'requiredDisclosures', 'modelExplanation'],
    additionalProperties: false,
  } as const;

  const prompt = `
${policy}

Review the following message for compliance. 
Return ONLY JSON that matches the provided schema.

Message from agent:
"""${input.text}"""
`;

  // Using Responses API with JSON schema – adjust model if you prefer
  const response: any = await openai.responses.create({
    model: 'gpt-4.1-mini',
    input: prompt,
    max_output_tokens: 800,
    text: {
      format: {
        type: 'json_schema',
        name: 'ComplianceCheckResult',
        schema,
        strict: true,
      },
    },
  });
  

  let json: any;
  const block = response.output[0]?.content[0];
  
  if (!block) {
    throw new Error('No content in OpenAI response');
  }

  if (block.type === 'refusal') {
    // you can choose to surface this nicely to the frontend
    throw new Error(`Model refused: ${block.refusal}`);
  }

  if (block.type === 'output_text') {
    json = JSON.parse(block.text);
  } else if (block.type === 'output_json') {
    json = block.json;
  } else {
    throw new Error(`Unexpected OpenAI content type: ${block.type}`);
  }

  const result: ComplianceCheckResult = {
    riskLevel: (json.riskLevel ?? 'low') as RiskLevel,
    issues: Array.isArray(json.issues) ? (json.issues as ComplianceIssue[]) : [],
    suggestedText: json.suggestedText ?? input.text,
    requiredDisclosures: Array.isArray(json.requiredDisclosures)
      ? json.requiredDisclosures
      : [],
    modelExplanation: json.modelExplanation ?? undefined,
  };

  return result;

}
