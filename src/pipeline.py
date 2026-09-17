from scipy.io import wavfile

from src.classification.yamnet import YAMNetClassifier
from src.classification.sound_mapping import map_yamnet_prediction
from src.localization.gcc_phat import estimate_direction
from src.logic_decision.priority import get_priority
from src.logic_decision.haptics import get_haptic_file


class SoundAwarenessPipeline:

    def __init__(self, user_settings=None):
        print("Initializing pipeline...")

        self.classifier = YAMNetClassifier()
        self.user_settings = user_settings

    def process(self, wav_file):

        # 1. Classify the audio with YAMNet
        yamnet_results = self.classifier.predict(wav_file)

        # 2. Convert YAMNet's label into one of our app categories
        prediction = map_yamnet_prediction(yamnet_results)

        sound = prediction["sound"]
        confidence = prediction["confidence"]

        # 3. Reject low-confidence predictions
        if confidence < 0.75:
            return {
                "sound": "unknown",
                "confidence": confidence,
                "direction": "UNKNOWN",
                "priority": "OFF",
            }

        # 4. Load the audio for GCC-PHAT
        sample_rate, audio = wavfile.read(wav_file)

        if audio.ndim != 2:
            raise ValueError(
                "GCC-PHAT requires stereo audio."
            )

        # 5. Separate the two microphone channels
        left = audio[:, 0].astype(float)
        right = audio[:, 1].astype(float)

        # 6. Estimate direction
        direction = estimate_direction(left, right)

        # 7. Apply the user's priority setting
        priority = get_priority(
            sound,
            self.user_settings
        )

        haptic_file = get_haptic_file(priority)

        # 8. Create the final result
        return {
            "sound": sound,
            "confidence": confidence,
            "direction": direction,
            "priority": priority,
            "haptic": haptic_file,
        }