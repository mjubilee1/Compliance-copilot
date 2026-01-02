import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Home() {
  console.log('enter here')
  return (
    <div className="min-h-screen bg-muted/30 flex justify-center px-4 py-10">
      <main className="w-full max-w-5xl space-y-10">
        {/* Top nav / logo */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
              CC
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Compliance Copilot
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/copilot"
              className="text-muted-foreground hover:text-foreground"
            >
              Open Copilot
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Button size="sm" asChild>
              <Link href="/copilot">Start demo</Link>
            </Button>
          </div>
        </header>

        {/* Hero */}
        <section className="grid gap-10 md:grid-cols-[1.4fr,1fr] items-start">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              An AI compliance copilot for your sales team —{" "}
              <span className="text-indigo-600">
                so you don&apos;t have to micro-manage every call.
              </span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl">
              Whether it&apos;s a real estate agent on a listing appointment or a
              financial rep pitching a product, Compliance Copilot keeps them
              on-script, within policy, and fully documented — without you
              hovering over every conversation.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/chat">Try the copilot</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="#how-it-works">See how it works</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
              <div>
                ✅ Real-time guardrails for sales calls
              </div>
              <div>
                ✅ Pre-approved language & disclosures
              </div>
              <div>
                ✅ Audit-ready transcripts & summaries
              </div>
            </div>
          </div>

          {/* Right side: “live” summary card */}
          <Card className="border-indigo-100 bg-background/80 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Live compliance assist
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Example: Real estate agent in a listing conversation.
              </p>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="rounded-md bg-muted px-3 py-2">
                <div className="text-[11px] font-semibold text-muted-foreground">
                  Agent says
                </div>
                <p className="mt-1 text-foreground">
                  “The seller will definitely get top dollar in 30 days.”
                </p>
              </div>
              <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
                <div className="text-[11px] font-semibold text-amber-800">
                  Copilot nudge
                </div>
                <p className="mt-1 text-amber-900">
                  Avoid guarantees. Suggest:
                  <br />
                  <span className="italic">
                    “Based on recent sales, we&apos;ll price the home
                    competitively and review activity together every week.”
                  </span>
                </p>
              </div>
              <div className="rounded-md bg-muted px-3 py-2">
                <div className="text-[11px] font-semibold text-muted-foreground">
                  Logged for audit
                </div>
                <p className="mt-1 text-foreground">
                  • Risky phrasing detected & corrected
                  <br />
                  • Disclosure status: compliant
                  <br />
                  • Conversation tagged to listing record
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                1. Define your rules
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Upload playbooks, disclosures, and “words we never say” for each
              sales motion — listings, buyer consults, financial reviews, and
              more.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                2. Copilot guides the rep
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              During the sales cycle, reps can ask the copilot what they&apos;re
              allowed to say, how to explain a product, or how to respond
              without breaking policy.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                3. You get an audit trail
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Every nudge, script, and clarification is logged. Owners and
              brokers can review patterns instead of micromanaging every call.
            </CardContent>
          </Card>
        </section>

        {/* Personas section */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Real estate teams
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Keep agents compliant with fair housing, MLS rules, and brokerage
              policies — especially when you can&apos;t be in every appointment.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Brokers & managers
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Replace constant “Don&apos;t say that” conversations with smart guardrails
              and alerts when reps drift from approved language.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Financial sales
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Help reps stay inside regulatory guidelines while still having
              natural conversations about risk, returns, and suitability.
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
