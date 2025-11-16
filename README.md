# Splitz Team Generator

A modern, user-friendly web application for randomly dividing lists into balanced teams. Built with Next.js 15, React, and TypeScript.

![Splitz Logo](public/favicon.ico)

## Features

- **File Upload Support**: Accept Excel (.xlsx) and CSV files containing member lists
- **Random Team Generation**: Automatically shuffle and distribute members into balanced teams
- **Custom Team Names**: Optional custom naming for each team
- **Multiple Export Options**:
  - Combined workbook with separate sheets per team
  - Individual team files
  - ZIP archive containing all team files
- **Base64 File Handling**: Secure, server-side file processing without filesystem dependencies
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Modern dark theme for comfortable viewing

## Tech Stack

- **Framework**: Next.js 15.5.6 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation
- **File Processing**: 
  - xlsx (SheetJS) for Excel file handling
  - JSZip for archive creation
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 18.18.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/splitz-team-generator.git
cd splitz-team-generator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:9002](http://localhost:9002) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Usage

1. **Upload Your File**: Click or drag-and-drop an Excel (.xlsx) or CSV file containing your member list
2. **Set Team Count**: Specify how many teams you want to create
3. **Custom Names (Optional)**: Enter comma-separated team names if you want custom naming
4. **Generate Teams**: Click the "Generate Teams" button
5. **Download Results**: Choose from multiple download options:
   - Combined Excel file with all teams
   - ZIP archive with individual team files
   - Individual team files

### File Format Requirements

Your input file should have:
- At least one column with member names or data
- Headers in the first row (recommended)
- Valid Excel (.xlsx) or CSV format

## Project Structure

```
splitz-team-generator/
├── src/
│   ├── app/
│   │   ├── actions.ts          # Server actions for team generation
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Home page with upload form
│   │   └── results/
│   │       └── page.tsx        # Results page with downloads
│   ├── components/
│   │   ├── logo.tsx            # Application logo
│   │   └── ui/                 # Reusable UI components
│   ├── context/
│   │   └── ResultsContext.tsx  # Global state for results
│   ├── hooks/                  # Custom React hooks
│   └── lib/
│       └── utils.ts            # Utility functions
├── public/                     # Static assets
├── docs/
│   └── blueprint.md           # Project specifications
└── package.json
```

## Key Features Explained

### Team Distribution Algorithm

The application uses a balanced distribution algorithm that:
1. Shuffles all members randomly
2. Calculates team sizes to ensure maximum balance
3. Distributes members sequentially to maintain even team sizes
4. Handles remainder members by distributing them across teams

### File Processing

All file processing happens server-side using Next.js Server Actions:
- Files are converted to Base64 for secure transmission
- No filesystem writes required (works in serverless environments)
- Results are stored in React Context for the session

### Download Mechanism

Files are generated in-memory and downloaded using data URIs:
- Combined Excel workbook with multiple sheets
- Individual team files in Excel format
- ZIP archive containing all team files

## Configuration

### Environment Variables

No environment variables required for basic functionality.

### Customization

Edit `src/app/globals.css` to customize the color scheme:
- `--accent`: Electric Blue (#1E6AFF)
- `--chart-2`: Gold Amber (#FFC741)
- `--chart-3`: Magenta Purple (#C141FF)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy with default settings

### Other Platforms

Compatible with any platform supporting Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- File processing by [SheetJS](https://sheetjs.com/)

## Support

For issues, questions, or contributions, please:
- Open an issue on GitHub
- Contact the development team

## Roadmap

- [ ] Support for additional file formats (Google Sheets, Numbers)
- [ ] Team history and saved configurations
- [ ] Advanced distribution options (skill-based, weighted)
- [ ] Team preview before final generation
- [ ] Export to additional formats (PDF, JSON)

---

Made with ❤️ by the Splitz Team
