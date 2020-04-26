import { ColorMap, EventType } from "@/libs/Feed";

function getColor(type: EventType): string {
  return ColorMap.get(type) || "";
}

export const MenuItems = [
  // Ask a question
  {
    type: EventType.question,
    icon: "mdi-help",
    tip: "Ask a question",
    admin: false,
    color: getColor(EventType.question)
  },

  // Share a link
  {
    type: EventType.link,
    icon: "mdi-link",
    tip: "Add a link",
    admin: false,
    color: getColor(EventType.link)
  },

  // Create an AI
  {
    type: EventType.todo,
    icon: "mdi-clipboard-check",
    tip: "Create a todo",
    admin: false,
    color: getColor(EventType.todo)
  },

  // Create a poll (admin only)
  {
    type: EventType.poll,
    icon: "mdi-poll-box",
    tip: "Create a poll",
    admin: true,
    color: getColor(EventType.poll)
  },

  // Wait for everyone (admin only)
  {
    type: EventType.wait,
    icon: "mdi-timer-outline",
    tip: "Wait for ack from everyone",
    admin: true,
    color: getColor(EventType.wait)
  },

  // AFK
  {
    type: EventType.afk,
    icon: "mdi-timer-sand-full",
    tip: "Agree and +1 the discussion",
    admin: false,
    color: getColor(EventType.afk)
  }
];

export const EmoteItems = [
  // Thumbsup
  { type: EventType.emote, icon: "mdi-thumb-up", emote: "👍", color: "brown" },

  // Heart
  {
    type: EventType.emote,
    icon: "mdi-heart",
    emote: "❤️",
    color: "red accent-3"
  }
];

export default MenuItems;
