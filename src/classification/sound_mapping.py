#YAMNet mapping syntax is the dictionary of "UI display sound label": ["YAMNet class 1", "YAMNet class 2"]
SOUND_MAPPING = {
    "Siren": [
        "Emergency vehicle", "Police car (siren)", "Ambulance (siren)", "Fire engine, fire truck (siren)"
    ],

    "Speech": [
        "Speech", "Child speech, kid speaking", "Conversation", "Narration, monologue"
    ],

    "Traffic Noise": [
        "Traffic noise, roadway noise"
    ],

    "Car Horn": [
        "Vehicle horn, car horn, honking", "Toot", "Air horn, truck horn"
    ],

    "Smoke Alarm": [
        "Smoke detector, smoke alarm", "Fire alarm"
    ],

    "Dog Barking": [
        "Bark", "Dog", "Yip"
    ],

    "Urban noise": [
        "Outside, urban or manmade"
    ],

    "Water Boiling": [
        "Boiling"
    ],
}


def map_yamnet_prediction(yamnet_results):
    """
    Filter YAMNet's predictions to the application's
    target sound categories and return the category
    with the highest confidence.
    """

    best_match = None

    for result in yamnet_results:

        yamnet_sound = result["sound"]
        confidence = result["confidence"]

        for app_sound, possible_labels in SOUND_MAPPING.items():

            if yamnet_sound in possible_labels:

                if best_match is None or confidence > best_match["confidence"]:
                    best_match = {
                        "sound": app_sound,
                        "confidence": confidence
                    }

    if best_match is not None:
        return best_match

    return {
        "sound": "unknown",
        "confidence": 0.0
    }