
const idleImages = [
  'bulb.gif', 'hourglass.gif', 'mountain.gif', 'notepad.gif', 'rocket.gif', 'superhero.gif', 'wave.gif'
];
// const idleImages = [
//   '../assets/bulb.gif', '../assets/hourglass.gif', '../assets/mountain.gif', '../assets/notepad.gif', '../assets/rocket.gif', '../assets/superhero.gif', '../assets/wave.gif'
// ];
// const idleImages = [
//   './assets/bulb.gif', './assets/hourglass.gif', './assets/mountain.gif', './assets/notepad.gif', './assets/rocket.gif', './assets/superhero.gif', './assets/wave.gif'
// ];
// const idleImages = [
//   '/assets/bulb.gif', '/assets/hourglass.gif', '/assets/mountain.gif', '/assets/notepad.gif', '/assets/rocket.gif', '/assets/superhero.gif', '/assets/wave.gif'
// ];
// const idleImages = [
//   '@/assets/bulb.gif', '@/assets/hourglass.gif', '@/assets/mountain.gif', '@/assets/notepad.gif', '@/assets/rocket.gif', '@/assets/superhero.gif', '@/assets/wave.gif'
// ];

const idleText = [
  "Click things! Do stuff!",
  "Nothing to see here. Yet...",
  "I'm speechless, for now.",
  "Please don't stare so much.",
  "Got icons? We need some here.",
  "It's not 'empty'; it's... Spartan."
];

function rand(list) {
  return Math.floor(Math.random()*list.length);
}

export default {
  text(): string {
    return idleText[rand(idleText)];
  },

  image() {
    return idleImages[rand(idleImages)];
  }
};