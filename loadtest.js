// const autocannon = require('autocannon');
import autocannon from 'autocannon';
import prompts from './prompts.js';

const run = async () => {
  const endpoint = 'http://localhost:11434/api/generate';
  const model = 'qwen2.5-coder:3b';
  const prompt = 'Explain how the internet works';
  const instance = autocannon({
    url: endpoint,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
      stream: false
    }),
    connections: 5, // Number of concurrent connections
    duration: 15     // Duration of the test in seconds
  });

  autocannon.track(instance, { renderProgressBar: true });

  await instance;
};

const runVllmOpenAI = async () => {
  const endpoint = 'http://192.168.4.28:8000/v1/completions';
  const model = 'Qwen/Qwen2.5-Coder-3B-Instruct';
  const prompt = 'Explain how the internet works';

  const instance = autocannon({
    url: endpoint,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
    }),
    connections: 5, // Number of concurrent connections
    duration: 15     // Duration of the test in seconds
  });

  autocannon.track(instance, { renderProgressBar: true });

  await instance;

};

runVllmOpenAI();
// run();
