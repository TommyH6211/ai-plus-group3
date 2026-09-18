from src.audio.audio_utils import create_stereo_direction


sounds = [
    "car_horn_1",
    "smoke_alarm_1",
    "dog_barking_1",
    "urban_noise_1",
    "water_boiling_1"
]

directions = [
    "LEFT",
    "RIGHT",
    "CENTER"
]


for sound in sounds:

    input_file = f"data/raw/{sound}.wav"

    for direction in directions:

        output_file = (
            f"data/processed/{sound}_{direction.lower()}.wav"
        )

        create_stereo_direction(
            input_file,
            output_file,
            direction
        )

        print(f"Created: {output_file}")


print("Created all LEFT, RIGHT, and CENTER test files.")

