#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import parser from '@babel/parser';
import { default as traverse } from '@babel/traverse';
import { Ollama } from 'ollama';

// Configure how you parse the code
const PARSER_OPTIONS = {
  sourceType: 'module',     // or 'script'
  plugins: [
    'jsx',                  // if you are parsing JSX/React code
    'typescript',           // if it's TypeScript code
    'decorators-legacy',    // if decorators are in use
    // Add more plugins depending on your code
  ]
};

// New utility functions
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

function generatePrompt(chunks, inputFile) {
  return `
You are given code chunks extracted from ${path.basename(inputFile)}. 
For each chunk, provide a summary of what it does, identify its inputs and outputs, 
and highlight any noteworthy patterns or potential issues.

Please produce a structured explanation with the following format:

**Function/Chunk Name:** <Name of the chunk>
**Summary:** <Short summary>
**Inputs:** <List of input variables or parameters>
**Outputs:** <List of return values or side effects>
**Key Observations:** <Any noteworthy patterns, performance issues, or logic errors>

Here are the code chunks:
${chunks.map((c, index) => `\n---\n**Name:** ${c.name}\n**Lines:** ${c.startLine}-${c.endLine}\n\`\`\`\n${c.code}\n\`\`\``).join('\n')}
`;
}

function savePromptToFile(prompt, filename = 'analysis_report.md') {
  const outputPath = path.join(process.cwd(), filename);
  fs.writeFileSync(outputPath, prompt, 'utf8');
  console.log(`Analysis prompt generated and saved to ${outputPath}`);
}

const ollama = new Ollama({
  host: 'http://localhost:11434', // default Ollama host
});
const model = 'qwen2.5-coder:14b';


// Add new function to call Ollama
async function analyzeWithOllama(prompt) {
  try {
    const response = await ollama.chat({
      model: model,
      messages: [
        {
          role: 'user',
          content: `${prompt}`,
        },
      ],
    });

    console.log('Analysis from Ollama:');
    console.log(response.message.content);

    // Optionally save the response to a file
    savePromptToFile(response.message.content, `ollama_analysis.${model}.${new Date().getTime()}.md`);

  } catch (error) {
    console.error('Error calling Ollama:', error);
  }
}

// Modify main function to be async
async function main() {
  const inputFile = process.argv[2];
  const code = validateInput(inputFile);
  const ast = parseCode(code);
  const functions = extractFunctions(ast, code);

  const chunks = functions.length > 0 ? functions : createLineBasedChunks(code);
  const prompt = generatePrompt(chunks, inputFile);

  // Call Ollama instead of just logging
  await analyzeWithOllama(prompt);
}

// Modify the execution to handle async main
main().catch(console.error);
