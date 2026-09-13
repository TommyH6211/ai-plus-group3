from src.logic_decision.priority import PRIORITY_LEVELS


SOUNDS = [
    "Siren",
    "Speech",
    "Traffic Noise",
    "Car Horn",
    "Smoke Alarm",
    "Dog Barking",
    "Urban noise",
    "Water Boiling",
]


def get_user_priorities():
    user_settings = {}

    print("=== Sound Priority Settings ===")
    print()

    for sound in SOUNDS:

        print(f"{sound}")
        print("1. URGENT")
        print("2. ATTENTION")
        print("3. AWARENESS")
        print("4. OFF")

        while True:
            choice = input("Choose priority (1-4): ")

            if choice in ["1", "2", "3", "4"]:
                user_settings[sound] = PRIORITY_LEVELS[int(choice) - 1]
                break

            print("Please enter 1, 2, 3, or 4.")

        print()

    return user_settings


user_settings = get_user_priorities()


print("=== Your Settings ===")

for sound, priority in user_settings.items():
    print(f"{sound}: {priority}")