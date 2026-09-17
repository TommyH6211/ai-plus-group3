PRIORITY_LEVELS = [
    "URGENT", "Attention needed", "General awareness", "Off",
]

# Default priority settings for each supported sound.
# These are defaults only. The user can change them.

DEFAULT_PRIORITIES = {
    "Siren": "URGENT",
    "Smoke Alarm": "URGENT",

    "Car Horn": "Attention needed",
    "Dog Barking": "Attention needed",
    "Water Boiling": "Attention needed",

    "Speech": "General awareness",
    "Urban noise": "General awareness",
    "Traffic Noise": "General awareness",
}


def get_priority(sound, user_settings=None):
    """
    Return the priority assigned to a sound.

    If the user has provided custom settings,
    those settings override the defaults.
    """

    if user_settings is None:
        user_settings = DEFAULT_PRIORITIES

    return user_settings.get(sound, "Off")