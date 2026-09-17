import json
import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_FILE = os.path.join(BASE_DIR, "haptic_patterns.json")


with open(JSON_FILE, "r") as file:
    HAPTIC_PATTERNS = json.load(file)


def get_haptic_file(priority):
    """
    Return the .ahap file associated with a priority level.
    """

    return HAPTIC_PATTERNS.get(priority)

