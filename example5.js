// Import the llama-cpp package
// const { Llama } = require('node-llama-cpp');
import { getLlama,LlamaChatSession } from 'node-llama-cpp';
import path from "path";
import {fileURLToPath} from "url";

// original path: /home/foyzul/Downloads/Llama-3.2-1B-Instruct-IQ3_M.gguf
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelPath = path.join(__dirname, "Llama-3.2-1B-Instruct-IQ3_M.gguf");


// Initialize the Llama model
const llama = await getLlama({
     gpu: "cuda",
     gpuLayers: 32,
     contextSize: 2048,
     batchSize: 512,
     gpuVRAMLimit: 11 * 1024 * 1024 * 1024,
});
const model = await llama.loadModel({
    modelPath: modelPath,
});
const context = await model.createContext();
const session = new LlamaChatSession({
    contextSequence: context.getSequence(),
});
//console.log(model);

// Function to tell a joke
async function tellAJoke() {
    const prompt = "Tell me a joke.";
    
    try {
        const response = await session.prompt(prompt);
        console.log(response);
    } catch (error) {
        console.error("Error generating joke:", error);
    }
}

// Call the function
for (let i = 0; i < 10; i++) {
    tellAJoke();
}
