/* Sources:
  https://www.goodhousekeeping.com/health/wellness/g25643343/self-care-ideas/
  https://www.mayoclinic.org/d
  https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/
*/

const wellnessActivities = [
  {
    prompt: "Remember To Breathe",
    text: "Even as your day gets busier, remember to take a moment to breathe.",
    instructions: [
      "Let your breath flow as deep down into your belly as comfortable",
      "Try breathing in through your nose and out through your mouth.",
      "Breathe in gently and regularly. If it helps steadly count from 1 to 5 while doing this.",
      "Do this for about 4 minutes"
    ] 
  },
  {
    prompt: "Take A Quick Stretch",
    text: "Stretching is one of the best ways to relax and loosen your body from tension.",
    instructions: [
      "Reach the sky with your hands",
      "Try to roll your arms and do a shoulder stretch",
      "Extend your arms and turn side to side",
      "As you go on with your day remember to stretch ocassionally."
    ]
  },
  {
    prompt: "Hydration Check",
    text: "Cool down and give your brain a boost with a beverage.",
    instructions: [
      "Drink a few sips of water.",
      "Take one slow deep breath.",
      "Dehydration can lead to tiredness and dizziness.",
      "Remember to keep a beverage by your side!"
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
    prompt: "Manifest A Positive Attitude",
    text: "Take a moment to cultivate postivity within yourself",
    instructions: [
      "Take a step back and think about your accomplishments",
      "Cleanse yourself from negatvity.",
      "Believe in yourself!",
      "Have an optimistic approach with the rest of your day."
    ]
  },
];



export function pickRandomWellnessActivity() {
    const activity = wellnessActivities[Math.floor(Math.random() * wellnessActivities.length)];
    return activity;
}