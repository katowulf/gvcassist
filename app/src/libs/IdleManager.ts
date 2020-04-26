const idleImages = [
  "bulb.gif",
  "hourglass.gif",
  "mountain.gif",
  "notepad.gif",
  "rocket.gif",
  "superhero.gif",
  "wave.gif"
];

const idleText = [
  "Click things! Do stuff!",
  "Nothing to see here... Yet.",
  "I'm speechless, for now.",
  "Please don't stare so much.",
  "Got emojis? Put some here!",
  "It's not empty, it's... Spartan.",
  "If this is a party, you're unfashionably early.",
  "If you join an empty meeting, is it still a meeting?",
  "Quick! Practice twiddling your thumbs."
];

function rand(list) {
  return Math.floor(Math.random() * list.length);
}

export default {
  text(): string {
    return idleText[rand(idleText)];
  },

  image() {
    return idleImages[rand(idleImages)];
  }
};
