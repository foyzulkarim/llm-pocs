import {fileURLToPath} from "url";
import path from "path";
import {getLlama, LlamaChatSession} from "node-llama-cpp";


// original path: /home/foyzul/Downloads/Llama-3.2-1B-Instruct-IQ3_M.gguf
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelPath = path.join(__dirname, "Llama-3.2-1B-Instruct-IQ3_M.gguf");

const llama = await getLlama();
const model = await llama.loadModel({
    modelPath: modelPath,
    gpuLayers: 32, // Increase GPU usage
    contextSize: 2048, // Increase context size
    batchSize: 512, // Keep batch size moderate
    gpuVRAMLimit: 11 * 1024 * 1024 * 1024, // Set VRAM limit to 11GB,
    nGpuLayers: 32, // For CUDA. Set to 0 for CPU-only.
    useVulkan: false, // Explicitly disable Vulkan
    useCuda: true, // Enable CUDA. Set to false for CPU-only.
});
const context = await model.createContext();
const session = new LlamaChatSession({
    contextSequence: context.getSequence(),
});


// const q1 = "Hi there, how are you?";
// console.log("User: " + q1);

// const a1 = await session.prompt(q1);
// console.log("AI: " + a1);


// const q2 = "Summarize what you said";
// console.log("User: " + q2);

// const a2 = await session.prompt(q2);
// console.log("AI: " + a2);

const question = "How do I become better at coding?";
console.log("User: " + question);

const answer = await session.prompt(question);
console.log("AI: " + answer);
