// apps/web/src/app/copilot/page.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

type RiskLevel = 'low' | 'medium' | 'high';

interface ComplianceIssue {
  code: string;
  description: string;
  severity: RiskLevel;
  suggestion?: string;
  category?: string;
}

interface ComplianceResult {
  riskLevel: RiskLevel;
  issues: ComplianceIssue[];
  suggestedText: string;
  requiredDisclosures: string[];
  modelExplanation?: string;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function ComplianceCopilotPage() {
  const [text, setText] = useState('');
  const [industry, setIndustry] = useState<'real_estate' | 'finance' | 'generic'>(
    'real_estate',
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCheck() {
    setError(null);
    setResult(null);

    if (!text.trim()) {
      setError('Please enter a message to check.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/compliance/check-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          industry,
          jurisdiction: 'MD',
          channel: 'email',
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Request failed');
      }

      const data = (await res.json()) as ComplianceResult;
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function riskBadgeColor(level: RiskLevel) {
    switch (level) {
      case 'low':
        return 'bg-emerald-500';
      case 'medium':
        return 'bg-amber-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Compliance Copilot
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Paste what you&apos;re about to send to a client. We&apos;ll flag
            risks and suggest a compliant version.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr,3fr]">
          {/* Left side – input */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={industry === 'real_estate' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIndustry('real_estate')}
                >
                  Real Estate
                </Button>
                <Button
                  type="button"
                  variant={industry === 'finance' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIndustry('finance')}
                >
                  Financial Services
                </Button>
                <Button
                  type="button"
                  variant={industry === 'generic' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIndustry('generic')}
                >
                  Generic
                </Button>
              </div>

              <Textarea
                rows={10}
                placeholder="Type or paste the email / text you'd send to a client..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              {error && (
                <p className="text-sm text-red-500">
                  {error}
                </p>
              )}

              <Button
                type="button"
                onClick={handleCheck}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Checking…' : 'Check Compliance'}
              </Button>
            </CardContent>
          </Card>

          {/* Right side – result */}
          <Card>
            <CardHeader>
              <CardTitle>Review & Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!result && !loading && !error && (
                <p className="text-sm text-muted-foreground">
                  Results will appear here. Start by entering a message and
                  clicking <span className="font-medium">Check Compliance</span>.
                </p>
              )}

              {result && (
                <div className="space-y-4">
                  {/* Risk level */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Risk level</span>
                      <Badge className={riskBadgeColor(result.riskLevel)}>
                        {result.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Issues */}
                  {result.issues.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Issues detected</h3>
                      <ul className="space-y-2 text-sm">
                        {result.issues.map((issue, idx) => (
                          <li
                            key={idx}
                            className="rounded-md border bg-card/40 p-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium">
                                {issue.code}
                              </span>
                              <Badge variant="outline">
                                {issue.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm">
                              {issue.description}
                            </p>
                            {issue.suggestion && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                Suggestion: {issue.suggestion}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggested text */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Suggested message</h3>
                    <div className="rounded-md border bg-muted p-3 text-sm whitespace-pre-wrap">
                      {result.suggestedText}
                    </div>
                  </div>

                  {/* Disclosures */}
                  {result.requiredDisclosures.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">
                        Required disclosures
                      </h3>
                      <ul className="list-disc pl-5 text-sm">
                        {result.requiredDisclosures.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {loading && (
                <p className="text-sm text-muted-foreground">
                  Running compliance check…
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
