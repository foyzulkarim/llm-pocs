# Text Generation with LLMs from node.js 

![8d783373-5607-4195-b36f-cfce3fc46159](https://github.com/user-attachments/assets/02e9eaad-caa9-4113-b4f1-22833abfd547)


This project demonstrates how to use the different LLMs for text generation using the `@xenova/transformers` library or the `@huggingface/transformers` library.

## Prerequisites

- Node.js (version 20 or higher recommended)
- npm (Node Package Manager)

## Installation

1. Clone this repository or create a new directory for your project.

2. Navigate to the project directory in your terminal.

3. Install the required dependency:
   ```
   npm install @xenova/transformers @huggingface/transformers 
   ```

## Usage

1. Run the script using Node.js:

  For example, to run `example1.js`:
   ```
   node example1.js
   ```

2. The script will generate text based on the input prompt and display the output in the console.

## Customization

- You can modify the `text` variable or other input parameters to change the input prompt.
- Adjust the `max_new_tokens` and `temperature` parameters in the `generator` function call to control the length and creativity of the generated text.

## Note

- The first time you run the script, it may take some time to download the model. Subsequent runs will be faster.
- Make sure you have a stable internet connection for the initial model download.
- GPU is recommended for better performance.

## Troubleshooting

If you encounter any issues, please ensure that:
- You have the latest version of Node.js installed.
- All dependencies are correctly installed.
- You have sufficient disk space for the model download.
