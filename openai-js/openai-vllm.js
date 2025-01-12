import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';


const createVLLMClient = (baseURL = 'http://192.168.4.28:8000/v1') => {
  return new OpenAI({
    baseURL,
    apiKey: 'dummy-key', // vLLM doesn't require real OpenAI key
  });
};

export async function generateCompletion(input, options = {}) {
  try {
    const vllm = createVLLMClient();
    
    const defaultOptions = {
      model: 'OpenGVLab/InternVL2_5-1B', // example model, replace with your loaded model
      messages: [
        { role: 'user', content: input }
      ],
      temperature: 0.7,
    };

    const response = await vllm.chat.completions.create({
      ...defaultOptions,
      ...options,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling vLLM:', error);
    throw error;
  }
}

async function convertImageToBase64(filePath) {
  const imageData = fs.readFileSync(filePath);
  const base64String = imageData.toString('base64');
  return base64String;
}


export async function generateCompletionWithImage(prompt, imagePath, options = {}) {
  try {
    const client = createVLLMClient();

    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file does not exist at path: ${imagePath}`);
    }

    const base64Image = await convertImageToBase64(imagePath);

    const defaultOptions = {
      model: 'OpenGVLab/InternVL2_5-1B', // example model, replace with your loaded model
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      temperature: 0.7,
    };

    const response = await client.chat.completions.create({
      ...defaultOptions,
      ...options,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating completion with image:', error.message);
    throw error;
  }
}
