from src.audio.audio_utils import create_stereo_direction


input_file = "data/raw/siren_1.wav"

create_stereo_direction(
    input_file,
    "data/processed/siren_left.wav",
    "LEFT"
)

create_stereo_direction(
    input_file,
    "data/processed/siren_right.wav",
    "RIGHT"
)

create_stereo_direction(
    input_file,
    "data/processed/siren_center.wav",
    "CENTER"
)

print("Created LEFT, RIGHT, and CENTER test files.")

