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
  "Look at all this floor space.",
  "Got emojis? Put some here!",
  "It's not empty, it's... Spartan.",
  "If this is a party, you're unfashionably early.",
  "Is it a meeting if you're the only one here?",
  "Quick! Practice twiddling your thumbs.",
  "Like sands through the hourglass, so are the hours of our meetings.",
  "Whatever happens next, I’m glad we met.",
  "“Because meetings involve people, things can and will go wrong. Provide first aid " +
      "when necessary. ― Emily M. Axelrod",
  "If computers get too powerful, we can organize them into committees. " +
      "That'll do them in. ― Author Unknown"
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
