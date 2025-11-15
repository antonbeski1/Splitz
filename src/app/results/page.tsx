'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Download, FileArchive, FileSpreadsheet, Home, Copy, Check, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { useState } from 'react';
import type { ProcessedResult } from '@/app/actions';


function ResultsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dataString = searchParams.get('data');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  if (!dataString) {
    return (
      <div className="text-center">
        <p className="text-destructive">No data found. Please generate teams first.</p>
        <Button onClick={() => router.push('/')} className="mt-4">
          <Home className="mr-2 h-4 w-4" /> Go Home
        </Button>
      </div>
    );
  }

  const result: ProcessedResult = JSON.parse(dataString);
  const { downloadLinks } = result;

  const handleCopy = (path: string) => {
    const fullUrl = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(path);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl space-y-8">
      <div className="text-center">
        <ShieldCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold tracking-tight">Your Teams are Ready!</h2>
        <p className="text-muted-foreground mt-2">Download your generated team files below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/80 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileSpreadsheet className="text-accent"/> Combined Sheet</CardTitle>
            <CardDescription>One file with a separate sheet for each team.</CardDescription>
          </CardHeader>
          <CardContent>
            <a href={downloadLinks.combined} download>
              <Button className="w-full"><Download className="mr-2 h-4 w-4"/>Download .xlsx</Button>
            </a>
          </CardContent>
        </Card>

        <Card className="bg-card/80 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileArchive className="text-accent"/> ZIP Archive</CardTitle>
            <CardDescription>A zip file containing all individual team sheets.</CardDescription>
          </CardHeader>
          <CardContent>
            <a href={downloadLinks.zip} download>
              <Button className="w-full"><Download className="mr-2 h-4 w-4"/>Download .zip</Button>
            </a>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-center">Individual Team Files</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {downloadLinks.teams.map((team) => (
            <Card key={team.name} className="flex flex-col">
              <CardHeader className="flex-grow">
                <CardTitle className="text-lg">{team.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <a href={team.path} download className="flex-grow">
                  <Button variant="secondary" className="w-full"><Download className="mr-2 h-4 w-4"/> Download</Button>
                </a>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(team.path)} aria-label="Copy link">
                   {copiedLink === team.path ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="text-center pt-4">
        <Button onClick={() => router.push('/')}>
          <Home className="mr-2 h-4 w-4" /> Generate New Teams
        </Button>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading results...</div>}>
      <div className="flex min-h-screen flex-col items-center justify-center p-4 py-16">
         <div className="absolute top-8">
            <a href="/" aria-label="Go to homepage"><Logo /></a>
         </div>
        <ResultsPageContent />
        <footer className="text-center mt-8 text-sm text-muted-foreground">
          <p>Happy with your teams? Go build something great!</p>
        </footer>
      </div>
    </Suspense>
  );
}
