// Import required modules
import { Ollama } from 'ollama';
import fs from 'fs';
import path from 'path';

// Initialize the Ollama client
const ollama = new Ollama({
  host: 'http://localhost:11434', // default Ollama host
});

// Specify the repository path
const repoPath = '/home/foyzul/personal/public-repo/react/packages';

// Function to get all files with allowed extensions in the repository
async function getJsFiles(dirPath, allowedExtensions = ['.js', '.jsx', '.ts', '.tsx']) {
  const ignoredDirs = ['tests', '__tests__', 'node_modules', 'dist', 'build', 'coverage'];
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

  const files = entries
    .filter(entry => !entry.isDirectory())
    .map(entry => path.join(dirPath, entry.name));

  const folders = entries
    .filter(entry => entry.isDirectory())
    .filter(folder => !ignoredDirs.includes(folder.name));  // Filter out ignored directories

  for (const folder of folders) {
    files.push(...await getJsFiles(path.join(dirPath, folder.name), allowedExtensions));
  }

  return files.filter(file => allowedExtensions.includes(path.extname(file)));
}

const prompt = `
Provide a comprehensive analysis in the following format:

## Code Analysis Report

### 1. Code Quality
- Purpose and functionality of the code and methods
- Code organization and readability
- Modularity and maintainability

### 2. Project Structure and Architecture
- Component organization
- Design patterns used
- Dependencies and relationships

### 3. Recommendations
- Key improvements needed
- Best practices to implement
- Priority action items

### 4. Final Recommendations:
[Summarize key findings and provide actionable, high-level recommendations for improving the project.]
`;

const model = 'qwen2.5-coder:14b';


// Function to analyze a file and save the report
async function analyzeFile(filePath) {
  try {
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');

    const response = await ollama.chat({
      model: model,
      messages: [
        {
          role: 'user',
          content: `${prompt}\n\n${fileContent}`,
        },
      ],
    });

    const reportContent = response.message.content;
    const reportFileName = `${path.basename(filePath, '.js')}.${model}.${new Date().getTime()}.md`;
    const reportFilePath = path.join(path.dirname(filePath), reportFileName);

    await fs.promises.writeFile(reportFilePath, reportContent, 'utf-8');
    console.log(`Analysis report generated for ${filePath}`);
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error);
  }
}

async function main() {
  try {
    const jsFiles = await getJsFiles(repoPath);

    for (const file of jsFiles) {
      await analyzeFile(file);
    }
    // await analyzeFile(jsFiles[0]);

    console.log('Analysis completed.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();
