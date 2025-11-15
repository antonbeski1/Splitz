'use server';

import { z } from 'zod';
import * as xlsx from 'xlsx';
import JSZip from 'jszip';

const formSchema = z.object({
  teamCount: z.coerce.number().int().min(2, 'Must have at least 2 teams.'),
  file: z.instanceof(File).refine((file) => file.size > 0, 'File is required.'),
  teamNames: z.string().optional(),
});

// The data structure returned to the client.
// It will now contain Base64-encoded file content instead of URL paths.
export type ProcessedResult = {
  success: true;
  runId: string;
  files: {
    combined: { name: string; content: string };
    zip: { name:string; content: string };
    teams: { name: string; content: string }[];
  };
};

type ErrorResult = {
  success: false;
  error: string;
};


export async function generateTeams(formData: FormData): Promise<ProcessedResult | ErrorResult> {
  const validatedFields = formSchema.safeParse({
    teamCount: formData.get('teamCount'),
    file: formData.get('file'),
    teamNames: formData.get('teamNames'),
  });

  if (!validatedFields.success) {
    const fileError = validatedFields.error.flatten().fieldErrors.file?.[0];
    const teamCountError = validatedFields.error.flatten().fieldErrors.teamCount?.[0];
    return { success: false, error: fileError || teamCountError || 'Invalid input.' };
  }

  const { teamCount, file, teamNames } = validatedFields.data;

  try {
    const bytes = await file.arrayBuffer();
    const workbook = xlsx.read(bytes);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    let data: any[] = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

    if (data.length === 0) {
      return { success: false, error: 'The uploaded file is empty or in an invalid format.' };
    }
    
    // Shuffle data
    for (let i = data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data[i], data[j]] = [data[j], data[i]];
    }

    const customNames = teamNames?.split(',').map(name => name.trim()).filter(Boolean);
    const getTeamName = (index: number) => {
        return customNames?.[index] || `Team ${index + 1}`;
    }

    const teams: any[][] = Array.from({ length: teamCount }, () => []);
    const totalMembers = data.length;
    let currentMemberIndex = 0;
    
    // Distribute members into teams
    for (let i = 0; i < teamCount; i++) {
        const remainingMembers = totalMembers - currentMemberIndex;
        const remainingTeams = teamCount - i;
        const teamSize = Math.ceil(remainingMembers / remainingTeams);

        const teamData = data.slice(currentMemberIndex, currentMemberIndex + teamSize);
        
        teamData.forEach(member => {
            member.TeamIndex = i + 1;
            member.TeamName = getTeamName(i);
        });

        teams[i] = teamData;
        currentMemberIndex += teamSize;
    }

    const runId = Date.now().toString();
    const combinedWorkbook = xlsx.utils.book_new();
    const zip = new JSZip();
    const teamFiles: { name: string; content: string }[] = [];

    // Generate files in-memory
    for (let i = 0; i < teamCount; i++) {
        const teamName = getTeamName(i);
        const teamData = teams[i];
        if (teamData.length === 0) continue;

        const teamSheet = xlsx.utils.json_to_sheet(teamData);
        xlsx.utils.book_append_sheet(combinedWorkbook, teamSheet, teamName);

        const individualWorkbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(individualWorkbook, teamSheet, teamName);
        
        // Generate buffer and convert to Base64
        const xlsxBuffer = xlsx.write(individualWorkbook, { bookType: 'xlsx', type: 'buffer' });
        const base64Content = Buffer.from(xlsxBuffer).toString('base64');
        const fileName = `${teamName.replace(/[\W_]+/g, "_")}.xlsx`;
        
        zip.file(fileName, xlsxBuffer);
        teamFiles.push({ name: fileName, content: base64Content });
    }
    
    const combinedFileName = 'all_teams_combined.xlsx';
    const combinedXlsxBuffer = xlsx.write(combinedWorkbook, { bookType: 'xlsx', type: 'buffer' });
    const combinedBase64 = Buffer.from(combinedXlsxBuffer).toString('base64');

    const zipFileName = 'all_teams.zip';
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    const zipBase64 = zipBuffer.toString('base64');

    return {
      success: true,
      runId,
      files: {
        combined: { name: combinedFileName, content: combinedBase64 },
        zip: { name: zipFileName, content: zipBase64 },
        teams: teamFiles,
      },
    };
  } catch (error) {
    console.error('Team generation failed:', error);
    return { success: false, error: 'An unexpected error occurred while processing your file.' };
  }
}
