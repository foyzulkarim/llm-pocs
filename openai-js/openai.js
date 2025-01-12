import {  generateCompletion, generateCompletionWithImage } from './openai-vllm.js';

// Example usage
// const result = await generateCompletion('What is the capital of France?');
// console.log(result);

const resultWithImage = await generateCompletionWithImage('What are the food items in the image?', './dinner.jpg');
console.log(resultWithImage);
