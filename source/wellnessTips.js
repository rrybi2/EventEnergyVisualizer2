const wellnessActivities = [
  {
    prompt: "Remember To Breathe",
    text: "Do a slow breathing reset. It helps calm your body and refocus your mind.",
    instructions: [
      "Inhale slowly for 4 seconds.",
      "Hold for 2 seconds.",
      "Exhale gently for 6 seconds.",
      "Repeat 5 times."
    ]
  },
  {
    prompt: "Quick Stretch Break",
    text: "Relieve tension with a quick full-body stretch.",
    instructions: [
      "Roll your shoulders backward 5 times.",
      "Reach both arms overhead and stretch upward.",
      "Gently rotate your neck left and right."
    ]
  },
  {
    prompt: "Hydration Check",
    text: "Give your brain a boost with a sip of water.",
    instructions: [
      "Drink a few sips of water.",
      "Take one slow deep breath."
    ]
  },


  {
    prompt: "Take A Break!",
    text: "Your completing lots of draining events within a short interval.",
    instructions: [
      "Find a place to sit and try to replan your schedule.",
      "Try to pace yourself better for the rest of the day.",
      "Practice breathing exercises as you go on with your day.",
      "Get some alone time or meet with friends."
    ]
  },
  {
    prompt: "Quick Stretch Break",
    text: "Relieve tension with a quick full-body stretch.",
    instructions: [
      "Roll your shoulders backward 5 times.",
      "Reach both arms overhead and stretch upward.",
      "Gently rotate your neck left and right."
    ]
  },
  {
    prompt: "Hydration Check",
    text: "Give your brain a boost with a sip of water.",
    instructions: [
      "Drink a few sips of water.",
      "Take one slow deep breath."
    ]
  },
];



export function pickRandomWellnessActivity() {
    const activity = wellnessActivities[Math.floor(Math.random() * wellnessActivities.length)];
    return activity;
}