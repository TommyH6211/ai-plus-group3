from scipy.io import wavfile
from src.localization.gcc_phat import gcc_phat, estimate_direction


def test_file(filename):
    sample_rate, audio = wavfile.read(filename)

    left = audio[:, 0].astype(float)
    right = audio[:, 1].astype(float)

    delay = gcc_phat(left, right)
    direction = estimate_direction(left, right)

    print()
    print(filename)
    print("------------------------")
    print(f"Sample rate: {sample_rate} Hz")
    print(f"Delay: {delay} samples")
    print(f"Direction: {direction}")


test_file("data/processed/siren_left.wav")
test_file("data/processed/siren_right.wav")
test_file("data/processed/siren_center.wav")