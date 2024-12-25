import { pipeline } from '@xenova/transformers';

// Create a text-generation pipeline
const generator = await pipeline(
  'text-generation',
  'Xenova/llama2.c-stories15M'
);

const text = 'Once upon a time, during the era of Gilgamesh, a traveller was walking through the desert of the silk road. It was late afternoon  and suddenly a sandstorm hit. The traveller had to find shelter. He saw a cave and went inside. The cave was dark and cold. The traveller was afraid but he found a light and a fire. He lit the fire and made a plan to survive the night.';

const output2 = await generator(text, { max_new_tokens: 150, temperature: 0.5 });
console.log(output2);
