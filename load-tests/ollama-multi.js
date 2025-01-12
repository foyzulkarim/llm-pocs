import { exec } from 'child_process';
import prompts from './prompts.js';

const ollama1 = {
  endpoint: 'http://localhost:11435/api/generate',
  model: 'qwen2.5:1.5b',
};

const ollama2 = {
  endpoint: 'http://localhost:11436/api/generate',
  model: 'qwen2.5:1.5b',
};

const ollama3 = {
  endpoint: 'http://localhost:11437/api/generate',
  model: 'qwen2.5:1.5b',
};

const ollama4 = {
  endpoint: 'http://localhost:11438/api/generate',
  model: 'qwen2.5:1.5b',
};


function sendCurlRequest({
  endpoint,
  model,
  prompt,
  id
}) {
  const start = new Date().getTime();
  console.log(`Request ${id} sent at: ${new Date().toISOString()} to endpoint: ${endpoint}`);
  return new Promise((resolve, reject) => {
    exec(`curl --max-time 300 \
      -X POST ${endpoint} \
      -H "Content-Type: application/json" \
      -d '{"model":"${model}","prompt":"${prompt}","stream":false}'`, (error, stdout, stderr) => {
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
const ollamaServers = [ollama1, ollama2, ollama3, ollama4];
const totalStart = new Date().getTime();
console.log('Sending requests', ollamaServers);
for (let i = 0; i < prompts.length; i++) {
  const ollamaServer = ollamaServers[i % 4];
  requestPromises.push(sendCurlRequest({
    id: i + 1,
    prompt: prompts[i],
    ...ollamaServer
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
