// Import required modules
import { Ollama } from 'ollama';
import fs from 'fs';
import path from 'path';
import parser from '@babel/parser';
import { default as traverse } from '@babel/traverse';
import { prompt } from './prompt.js';

const PARSER_OPTIONS = {
  sourceType: 'module',     // or 'script'
  plugins: [
    'jsx',                  // if you are parsing JSX/React code
    'typescript',           // if it's TypeScript code
    'decorators-legacy',    // if decorators are in use
    // Add more plugins depending on your code
  ]
};

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

const model = 'qwen2.5-coder:14b';

function validateInput(inputFile) {
  if (!inputFile) {
    console.error('Please specify a file to parse. For example: node parseAndChunk.js ./src/app.js');
    process.exit(1);
  }
  return fs.readFileSync(inputFile, 'utf8');
}

function parseCode(code) {
  return parser.parse(code, PARSER_OPTIONS);
}

function extractFunctionFromNode(node, code, name) {
  const { loc } = node;
  const startLine = loc.start.line;
  const endLine = loc.end.line;
  const functionCode = code.split('\n').slice(startLine - 1, endLine).join('\n');
  return { name, code: functionCode, startLine, endLine };
}

function extractFunctions(ast, code) {
  const functions = [];
  const fn = traverse.default;
  fn(ast, {
    FunctionDeclaration(path) {
      const { id } = path.node;
      const name = id ? id.name : 'anonymous_function';
      functions.push(extractFunctionFromNode(path.node, code, name));
    },
    VariableDeclaration(path) {
      path.node.declarations.forEach(decl => {
        if (decl.init && (decl.init.type === 'ArrowFunctionExpression' || decl.init.type === 'FunctionExpression')) {
          const name = decl.id && decl.id.name ? decl.id.name : 'anonymous_function_expr';
          functions.push(extractFunctionFromNode(decl.init, code, name));
        }
      });
    }
  });

  return functions;
}

function generatePrompt(prompt, chunks) {
  return `
${prompt}
\n\n\n
Here are the code chunks:
${chunks.map((c, index) => `\n---\n**Name:** ${c.name}\n**Lines:** ${c.startLine}-${c.endLine}\n\`\`\`\n${c.code}\n\`\`\``).join('\n')}
`;
}

function createLineBasedChunks(code, chunkSize = 50) {
  const lines = code.split('\n');
  const chunks = [];

  for (let i = 0; i < lines.length; i += chunkSize) {
    const chunkLines = lines.slice(i, i + chunkSize);
    chunks.push({
      name: `chunk_${i / chunkSize}`,
      code: chunkLines.join('\n'),
      startLine: i + 1,
      endLine: Math.min(i + chunkSize, lines.length)
    });
  }

  return chunks;
}


// Function to analyze a file and save the report
async function analyzeFile(filePath) {
  try {
    console.log(`Analyzing ${filePath}`);
    const reportFileName = `${path.basename(filePath)}.md`;
    const reportFilePath = path.join(path.dirname(filePath), reportFileName);
    console.log(reportFileName);
    if (fs.existsSync(reportFilePath)) {
      console.log(`Report already exists for ${filePath}`);
      return;
    }
    const code = validateInput(filePath);
    const ast = parseCode(code);
    const functions = extractFunctions(ast, code);

    const chunks = functions.length > 0 ? functions : createLineBasedChunks(code);
    const concatedPrompt = generatePrompt(prompt, chunks);
    console.log('chunks found:', chunks.length);
    const response = await ollama.chat({
      model: model,
      messages: [
        {
          role: 'user',
          content: concatedPrompt,
        },
      ],
    });

    const reportContent = response.message.content;

    await fs.promises.writeFile(reportFilePath, reportContent, 'utf-8');
    console.log(`Analysis report generated for ${filePath}`);
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error);
  }
}

async function main() {
  try {
    const jsFiles = await getJsFiles(repoPath);
    console.log('Total files:', jsFiles.length);
    let currentFile = 0;
    for (const file of jsFiles) {
      console.log(`Processing file ${currentFile + 1} of ${jsFiles.length}: ${file}`);
      await analyzeFile(file);
      currentFile++;
      console.log(`Processed ${currentFile} of ${jsFiles.length} files`);
    }
    // await analyzeFile(jsFiles[0]);

    console.log('Analysis completed.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();
