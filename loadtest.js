// const autocannon = require('autocannon');
import autocannon from 'autocannon';


const run = async () => {
  const endpoint = 'http://localhost:11434/api/generate';
  const model = 'llama3.2';
  const prompt = 'Why is the sky blue?';
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
    connections: 2, // Number of concurrent connections
    duration: 15     // Duration of the test in seconds
  });

  autocannon.track(instance, { renderProgressBar: true });

  await instance;
};

const runVllmOpenAI = async () => {
  /**
   * curl http://localhost:8000/v1/completions \
  -H "Content-Type: application/json" \
  -d '{
        "model": "facebook/opt-125m",
        "prompt": "San Francisco is a",
        "max_tokens": 7,
        "temperature": 0
      }'

   */

  const endpoint = 'http://192.168.4.28:8000/v1/completions';
  const model = 'Qwen/Qwen2.5-Coder-3B-Instruct';
  const prompt = 'Explain how the internet works';
  const maxTokens = 700;
  const temperature = 0;

  const instance = autocannon({
    url: endpoint,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
      max_tokens: maxTokens,
      temperature: temperature
    }),
    connections: 2, // Number of concurrent connections
    duration: 15     // Duration of the test in seconds
  });

  autocannon.track(instance, { renderProgressBar: true });

  await instance;

};

runVllmOpenAI();
