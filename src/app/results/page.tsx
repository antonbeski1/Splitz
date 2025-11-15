'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, FileArchive, FileSpreadsheet, Home, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { useResults } from '@/context/ResultsContext';

// Helper function to create a downloadable file from a Base64 string.
function downloadFile(name: string, content: string, contentType: string) {
    const link = document.createElement("a");
    link.href = `data:${contentType};base64,${content}`;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function ResultsPageContent() {
  const router = useRouter();
  const { results } = useResults();

  useEffect(() => {
    if (!results) {
      router.replace('/');
    }
  }, [results, router]);

  if (!results) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading results...</p>
      </div>
    );
  }
  
  const { files } = results;

  const handleDownload = (name: string, content: string, contentType: string) => {
    downloadFile(name, content, contentType);
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
            <Button className="w-full" onClick={() => handleDownload(files.combined.name, files.combined.content, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}>
              <Download className="mr-2 h-4 w-4"/>Download .xlsx
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/80 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileArchive className="text-accent"/> ZIP Archive</CardTitle>
            <CardDescription>A zip file containing all individual team sheets.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => handleDownload(files.zip.name, files.zip.content, 'application/zip')}>
              <Download className="mr-2 h-4 w-4"/>Download .zip
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-center">Individual Team Files</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.teams.map((team) => (
            <Card key={team.name} className="flex flex-col">
              <CardHeader className="flex-grow">
                <CardTitle className="text-lg">{team.name}</CardTitle>
              </CardHeader>
              <CardContent>
                 <Button variant="secondary" className="w-full" onClick={() => handleDownload(team.name, team.content, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}>
                    <Download className="mr-2 h-4 w-4"/> Download
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
