'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FileUp, Loader2, Users } from 'lucide-react';
import { generateTeams } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';

const formSchema = z.object({
  teamCount: z.coerce.number().int().min(2, 'Please enter at least 2 teams.'),
  file: typeof window === 'undefined' ? z.any() : z.instanceof(File).refine((file) => file.size > 0, 'A file is required.'),
  teamNames: z.string().optional(),
});

export default function HomePage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const [fileName, setFileName] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamCount: 2,
      teamNames: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if(file.type !== 'text/csv' && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          toast({
              variant: 'destructive',
              title: 'Invalid File Type',
              description: 'Please upload a .csv or .xlsx file.',
          });
          event.target.value = ''; // Reset file input
          return;
      }
      form.setValue('file', file, { shouldValidate: true });
      setFileName(file.name);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('teamCount', String(values.teamCount));
      formData.append('file', values.file);
      formData.append('teamNames', values.teamNames || '');

      const result = await generateTeams(formData);

      if (result.success) {
        router.push(`/results?data=${encodeURIComponent(JSON.stringify(result))}`);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <main className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Logo />
          <p className="text-muted-foreground mt-2">
            Instantly generate random teams from your list.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Your Teams</CardTitle>
            <CardDescription>Upload a file, set your teams, and let the magic happen.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="file"
                  render={() => (
                    <FormItem>
                      <FormLabel>Member List File</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type="file" className="hidden" id="file-upload" accept=".xlsx, .csv" onChange={handleFileChange} />
                          <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <FileUp className="w-10 h-10 mb-3 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold text-accent">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">XLSX or CSV file</p>
                            </div>
                          </label>
                        </div>
                      </FormControl>
                      {fileName && <p className="text-sm text-muted-foreground mt-2">Selected file: {fileName}</p>}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <FormField
                    control={form.control}
                    name="teamCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Teams</FormLabel>
                        <FormControl>
                          <Input type="number" min="2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="teamNames"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Team Names (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Team A, Team B, ..." {...field} />
                        </FormControl>
                         <p className="text-xs text-muted-foreground pt-1">Comma-separated names.</p>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Generate Teams
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <footer className="text-center mt-8 text-sm text-muted-foreground">
        <p>A simple tool to make team splitting a breeze.</p>
      </footer>
    </div>
  );
}
