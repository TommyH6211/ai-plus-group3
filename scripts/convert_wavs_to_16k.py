from scipy.io import wavfile
from scipy.signal import resample_poly
import numpy as np
import os


FILES = [
    "speech_1_center.wav",
    "traffic_noise_1_right.wav",
    "car_horn_1_left.wav",
    "smoke_alarm_1_right.wav",
    "dog_barking_1_center.wav",
    "urban_noise_1_right.wav",
    "water_boiling_1_left.wav",
]

INPUT_DIR = "data/processed"


for filename in FILES:

    input_path = os.path.join(INPUT_DIR, filename)

    sample_rate, audio = wavfile.read(input_path)

    print(f"Converting {filename}: {sample_rate} Hz")

    if sample_rate == 16000:
        print("Already 16 kHz. Skipping.")
        continue

    if sample_rate != 44100:
        raise ValueError(
            f"{filename} has unexpected sample rate: {sample_rate} Hz"
        )

    # Keep stereo channels separate.
    if audio.ndim != 2 or audio.shape[1] != 2:
        raise ValueError(
            f"{filename} is not stereo. Shape: {audio.shape}"
        )

    audio = audio.astype(np.float32)

    # Resample each stereo channel from 44.1 kHz → 16 kHz.
    left = resample_poly(audio[:, 0], 16000, 44100)
    right = resample_poly(audio[:, 1], 16000, 44100)

    stereo = np.column_stack((left, right))

    # Convert back to 16-bit PCM WAV.
    stereo = np.clip(
        stereo,
        -32768,
        32767
    ).astype(np.int16)

    wavfile.write(
        input_path,
        16000,
        stereo
    )

    print(f"Converted to 16 kHz stereo: {filename}")
    print()


print("Done.")