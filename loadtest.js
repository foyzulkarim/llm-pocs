// const autocannon = require('autocannon');
import autocannon from 'autocannon';

const run = async () => {
  const instance = autocannon({
    url: 'http://localhost:11434/api/generate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3.2',
      prompt: 'Why is the sky blue?',
      stream: false
    }),
    connections: 2, // Number of concurrent connections
    duration: 15     // Duration of the test in seconds
  });

  autocannon.track(instance, { renderProgressBar: true });
  
  await instance;
};

run();
