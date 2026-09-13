from src.pipeline import SoundAwarenessPipeline


pipeline = SoundAwarenessPipeline()

result = pipeline.process(
    "data/processed/siren_left.wav"
)

print()
print("FINAL PIPELINE OUTPUT")
print("---------------------")

print(f"Sound: {result['sound']}")
print(f"Confidence: {result['confidence']:.3f}")
print(f"Direction: {result['direction']}")
print(f"Priority: {result['priority']}")

