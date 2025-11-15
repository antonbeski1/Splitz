'use server';

import { z } from 'zod';
import * as xlsx from 'xlsx';
import JSZip from 'jszip';
import fs from 'fs/promises';
import path from 'path';

const formSchema = z.object({
  teamCount: z.coerce.number().int().min(2, 'Must have at least 2 teams.'),
  file: z.instanceof(File).refine((file) => file.size > 0, 'File is required.'),
  teamNames: z.string().optional(),
});

export type ProcessedResult = {
  success: true;
  runId: string;
  downloadLinks: {
    combined: string;
    zip: string;
    teams: { name: string; path: string }[];
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
    const outputDir = path.join(process.cwd(), 'public', 'output', runId);
    await fs.mkdir(outputDir, { recursive: true });

    const combinedWorkbook = xlsx.utils.book_new();
    const zip = new JSZip();
    const teamLinks: { name: string; path: string }[] = [];

    for (let i = 0; i < teamCount; i++) {
        const teamName = getTeamName(i);
        const teamData = teams[i];
        if (teamData.length === 0) continue;

        const teamSheet = xlsx.utils.json_to_sheet(teamData);
        xlsx.utils.book_append_sheet(combinedWorkbook, teamSheet, teamName);

        const individualWorkbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(individualWorkbook, teamSheet, teamName);
        const xlsxBuffer = xlsx.write(individualWorkbook, { bookType: 'xlsx', type: 'buffer' });
        
        const fileName = `${teamName.replace(/[\W_]+/g, "_")}.xlsx`;
        const filePath = path.join(outputDir, fileName);
        await fs.writeFile(filePath, xlsxBuffer);
        
        zip.file(fileName, xlsxBuffer);
        teamLinks.push({ name: teamName, path: `/output/${runId}/${fileName}` });
    }
    
    const combinedFileName = 'all_teams_combined.xlsx';
    const combinedFilePath = path.join(outputDir, combinedFileName);
    xlsx.writeFile(combinedWorkbook, combinedFilePath);

    const zipFileName = 'all_teams.zip';
    const zipFilePath = path.join(outputDir, zipFileName);
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    await fs.writeFile(zipFilePath, zipBuffer);

    return {
      success: true,
      runId,
      downloadLinks: {
        combined: `/output/${runId}/${combinedFileName}`,
        zip: `/output/${runId}/${zipFileName}`,
        teams: teamLinks,
      },
    };
  } catch (error) {
    console.error('Team generation failed:', error);
    return { success: false, error: 'An unexpected error occurred while processing your file.' };
  }
}
