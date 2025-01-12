import { exec } from 'child_process';
import prompts from './prompts.js';

const vllmOpenAI = {
  endpoint: 'http://localhost:8001/v1/chat/completions',
  model: 'Qwen/Qwen2.5-1.5B-Instruct',
  maxTokens: 500
};


function sendCurlRequest({
  endpoint,
  model,
  prompt,
  id
}) {
  const start = new Date().getTime();
  console.log(`Request ${id} sent at: ${new Date().toISOString()}`);
  return new Promise((resolve, reject) => {
      exec(`curl --max-time 300 \
      -X POST ${endpoint} \
      -H "Content-Type: application/json" \
      -d '{"model":"${model}","messages":[{"role":"user","content":[{"type":"text","text":"${prompt}"}]}],"stream":false}'`, (error, stdout, stderr) => {
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
const totalStart = new Date().getTime();
console.log('Sending requests', vllmOpenAI);
for (let i = 0; i < prompts.length; i++) {
  requestPromises.push(sendCurlRequest({
    id: i + 1,
    prompt: prompts[i],
    ...vllmOpenAI
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
