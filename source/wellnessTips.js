const wellnessActivities = [
  {
    imageURL: "https://example.com/breathe.png",
    text: "Remember to inhale and exhale slowly for a minute."
  },
  {
    imageURL: "https://example.com/stretch.png",
    text: "Take a moment to stretch your arms and legs."
  },
  {
    imageURL: "https://example.com/hydrate.png",
    text: "Drink a glass of water to stay hydrated."
  }
];


export function pickRandomWellnessActivity() {
    const activity = wellnessActivities[Math.floor(Math.random() * wellnessActivities.length)];
    return activity;
}