import os
import torch
import sys
import numpy as np
from datetime import datetime
import subprocess

# Clone the repository if it doesn't exist
if not os.path.exists('Kokoro-82M'):
    print("Cloning Kokoro-82M repository...")
    os.system('git clone https://huggingface.co/hexgrad/Kokoro-82M')

# Store the original directory and Kokoro path
original_dir = os.getcwd()
kokoro_path = os.path.abspath('Kokoro-82M')

# Change to the Kokoro-82M directory and add it to Python path
os.chdir(kokoro_path)
sys.path.append(kokoro_path)

try:
    from models import build_model
    from kokoro import generate
except ImportError:
    print("Error: Couldn't import models. Please ensure the repository was cloned correctly.")
    print("Current directory:", os.getcwd())
    print("Files in current directory:", os.listdir())
    sys.exit(1)

# Build the model and load the default voicepack
device = 'cuda' if torch.cuda.is_available() else 'cpu'
MODEL = build_model('kokoro-v0_19.pth', device)

# Select voice
VOICE_NAME = [
    'af', # Default voice is a 50-50 mix of Bella & Sarah
    'af_bella', 'af_sarah', 'am_adam', 'am_michael',
    'bf_emma', 'bf_isabella', 'bm_george', 'bm_lewis',
    'af_nicole', 'af_sky',
][0]

VOICEPACK = torch.load(f'voices/{VOICE_NAME}.pt', weights_only=True).to(device)
print(f'Loaded voice: {VOICE_NAME}')

def split_text_into_sentences(text):
    # Split by periods, question marks, and exclamation marks
    # but keep the punctuation with the sentence
    import re
    sentences = re.split('(?<=[.!?])\s+', text)
    return [s.strip() for s in sentences if s.strip()]

def generate_audio_files(model, text, voicepack, lang):
    sentences = split_text_into_sentences(text)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Create output directory with timestamp
    output_dir = f'output_{timestamp}'
    os.makedirs(output_dir, exist_ok=True)
    
    for i, sentence in enumerate(sentences):
        print(f"Processing sentence {i+1}/{len(sentences)}")
        audio, _ = generate(model, sentence, voicepack, lang=lang)
        
        # Save individual sentence audio
        filename = f'{output_dir}/sentence_{i+1:03d}.wav'
        import scipy.io.wavfile as wavfile
        wavfile.write(filename, 24000, audio)
        
        # Save the text content
        with open(f'{output_dir}/sentence_{i+1:03d}.txt', 'w') as tf:
            tf.write(sentence)
    
    return output_dir

def merge_audio_files(output_dir):
    # Create a file list for ffmpeg
    file_list_path = os.path.join(output_dir, 'files.txt')
    
    # Get all wav files and sort them
    wav_files = sorted([f for f in os.listdir(output_dir) if f.startswith('sentence_') and f.endswith('.wav')])
    
    # Create the files.txt for ffmpeg
    with open(file_list_path, 'w') as f:
        for wav_file in wav_files:
            f.write(f"file '{wav_file}'\n")
    
    # Get timestamp from directory name
    timestamp = output_dir.split('_')[1]
    merged_output = f'merged.wav'
    
    # Merge all files using ffmpeg
    ffmpeg_cmd = [
        'ffmpeg',
        '-f', 'concat',
        '-safe', '0',
        '-i', 'files.txt',
        '-c', 'copy',
        merged_output
    ]
    
    print("\nMerging audio files...")
    subprocess.run(ffmpeg_cmd, cwd=output_dir)
    print(f"Merged audio saved as: {output_dir}/{merged_output}")

def read_transcript(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"Error: Could not find {file_path}")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading file: {e}")
        sys.exit(1)

# Load text from transcript.txt from the original directory
transcript_path = os.path.join(original_dir, 'transcript.txt')
print(f"Reading transcript from {transcript_path}...")
text = read_transcript(transcript_path)

print("Generating audio files... This may take a while for long texts.")
output_dir = generate_audio_files(MODEL, text, VOICEPACK, VOICE_NAME[0])
print(f"Individual files have been saved in directory: '{output_dir}'")

# Merge the files after all have been generated
merge_audio_files(output_dir)
