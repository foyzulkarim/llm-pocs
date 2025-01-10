import { exec } from 'child_process';
import prompts from './prompts.js';

const ollama = {
    endpoint: 'http://localhost:11434/api/generate',
    model: 'qwen2.5-coder:3b',
    maxTokens: 500
};

const vllmOpenAI = {
    endpoint: 'http://localhost:8000/v1/chat/completions',
    model: 'Qwen/Qwen2.5-3B-Instruct',
    maxTokens: 500
};

const internVL = {
    endpoint: 'http://192.168.4.28:8000/v1/chat/completions',
    model: 'OpenGVLab/InternVL2_5-1B',
    maxTokens: 500
};

function sendCurlRequest({
    endpoint,
    model,
    maxTokens,
    prompt,
    id
}) {
    const start = new Date().getTime();
    console.log(`Request ${id} sent at: ${new Date().toISOString()}`);
    return new Promise((resolve, reject) => {
        exec(`curl --max-time 300 \
        -X POST ${endpoint} \
        -H "Content-Type: application/json" \
        -d '{"model":"${model}","prompt":"${prompt}","stream":false, "max_tokens": ${maxTokens}}'`, (error, stdout, stderr) => {
            console.log(`Request ${id} received at: ${new Date().toISOString()}`, { prompt });
            const diff = new Date().getTime() - start;
            console.log(`Request ${id} took ${diff} ms for token count: ${stdout.length}`);
            if (error) {
                reject(error);
            }
            resolve(stdout);
        });
    });
}

function sendCurlRequest2({
    endpoint,
    model,
    maxTokens,
    prompt,
    id
}) {
    const start = new Date().getTime();
    console.log(`Request ${id} sent at: ${new Date().toISOString()}`);
    return new Promise((resolve, reject) => {
        exec(`curl --max-time 300 \
        -X POST ${endpoint} \
        -H "Content-Type: application/json" \
        -d '{"model":"${model}","messages":[{"role":"user","content":[{"type":"text","text":"${prompt}"}]}],"stream":false, "max_tokens": ${maxTokens}}'`, (error, stdout, stderr) => {
            console.log(`Request ${id} received at: ${new Date().toISOString()}`, { prompt });
            const diff = new Date().getTime() - start;
            console.log(`Request ${id} took ${diff} ms for token count: ${stdout.length}`);
            if (error) {
                reject(error);
            }
            resolve(stdout);
        });
    });
}

const requestPromises = [];
const payload = internVL;
const totalStart = new Date().getTime();
console.log('Sending requests', payload);
for (let i = 0; i < prompts.length; i++) {
    requestPromises.push(sendCurlRequest2({
        id: i + 1,
        prompt: prompts[i],
        ...payload
    }));
}

Promise.all(requestPromises)
    .then(responses => {
        responses.forEach((response, index) => {
            console.log('--------------------------------');
            console.log(`Prompt ${index + 1}: ${prompts[index]}\n`);
            console.log(response);
            console.log('--------------------------------');
        });
        const totalDiff = new Date().getTime() - totalStart;
        const timeInSec = totalDiff / 1000;
        console.log(`Total time taken: ${timeInSec} s, total prompt handled ${prompts.length}, responses received: ${responses.length}`);
    })
    .catch(error => console.error(error));
