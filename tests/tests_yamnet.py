from src.classification.yamnet import YAMNetClassifier


audio_file = "data/raw/siren_1.wav"

classifier = YAMNetClassifier()

results = classifier.predict(audio_file)

print()
print("Top YAMNet predictions:")
print("------------------------")

for result in results:
    print(
        f"{result['sound']}: "
        f"{result['confidence']:.3f}"
    )
