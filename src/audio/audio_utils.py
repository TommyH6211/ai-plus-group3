import numpy as np
from scipy.io import wavfile


def create_stereo_direction(
        input_file,
        output_file,
        direction,
        delay_samples=3
):
    """
    Create a simple two-channel test signal.

    LEFT:
        left channel receives the signal first.

    RIGHT:
        right channel receives the signal first.

    CENTER:
        both channels receive the signal simultaneously.

    This is a controlled test, not real microphone localization.
    """

    sample_rate, audio = wavfile.read(input_file)

    audio = audio.astype(np.float32)

    # Convert to mono if necessary.
    if audio.ndim > 1:
        audio = np.mean(audio, axis=1)

    if delay_samples <= 0:
        raise ValueError("delay_samples must be greater than zero.")

    if direction == "LEFT":

        left = audio

        right = np.concatenate(
            (
                np.zeros(delay_samples),
                audio[:-delay_samples]
            )
        )

    elif direction == "RIGHT":

        right = audio

        left = np.concatenate(
            (
                np.zeros(delay_samples),
                audio[:-delay_samples]
            )
        )

    elif direction == "CENTER":

        left = audio.copy()
        right = audio.copy()

    else:
        raise ValueError(
            "direction must be LEFT, RIGHT, or CENTER"
        )

    stereo = np.column_stack((left, right))

    stereo = np.clip(
        stereo,
        -32768,
        32767
    ).astype(np.int16)

    wavfile.write(
        output_file,
        sample_rate,
        stereo
    )