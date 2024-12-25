// Example 2
import { pipeline } from '@xenova/transformers';

// Create text-generation pipeline
const generator = await pipeline('text-generation', 'Xenova/Qwen1.5-0.5B-Chat');

// Define the prompt and list of messages
const prompt = 'Give me a short introduction to large language model.';
const messages = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: prompt },
];

// Apply chat template
const text = generator.tokenizer.apply_chat_template(messages, {
  tokenize: false,
  add_generation_prompt: true,
});

// Generate text
const output = await generator(text, {
  max_new_tokens: 150,
  do_sample: false,
  return_full_text: false,
});
console.log(JSON.stringify(output));
