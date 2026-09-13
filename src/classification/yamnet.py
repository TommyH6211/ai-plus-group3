import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
from scipy.io import wavfile


class YAMNetClassifier:
    def __init__(self):
        print("Loading YAMNet...")

        self.model = hub.load(
            "https://tfhub.dev/google/yamnet/1"
        )

        print("YAMNet loaded.")

        class_map_path = self.model.class_map_path().numpy().decode("utf-8")

        self.class_names = []

        with open(class_map_path, "r") as file:
            next(file)

            for line in file:
                parts = line.strip().split(",")

                if len(parts) >= 3:
                    class_name = parts[2].strip().strip('"')
                    self.class_names.append(class_name)

    def predict(self, wav_path):
        sample_rate, waveform = wavfile.read(wav_path)

        print(f"Sample rate: {sample_rate} Hz")

        # Convert integer WAV audio to floating-point audio.
        if waveform.dtype == np.int16:
            waveform = waveform.astype(np.float32) / 32768.0

        elif waveform.dtype == np.int32:
            waveform = waveform.astype(np.float32) / 2147483648.0

        else:
            waveform = waveform.astype(np.float32)

        # YAMNet uses a mono waveform.
        if waveform.ndim > 1:
            waveform = np.mean(waveform, axis=1)

        if sample_rate != 16000:
            raise ValueError(
                f"Expected 16 kHz audio, but received {sample_rate} Hz."
            )

        scores, embeddings, spectrogram = self.model(waveform)

        # Average the predictions across the audio clip.
        mean_scores = tf.reduce_mean(scores, axis=0).numpy()

        # Find the five strongest predictions.
        top_indices = np.argsort(mean_scores)[::-1][:5]

        results = []

        for index in top_indices:
            results.append(
                {
                    "sound": self.class_names[index],
                    "confidence": float(mean_scores[index]),
                }
            )

        return results