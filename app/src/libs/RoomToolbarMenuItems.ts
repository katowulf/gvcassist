import { ColorMap, EventType } from "@/libs/Feed";

function getColor(type: EventType): string {
  return ColorMap.get(type) || "";
}

export interface ButtonProps {
  type: EventType;
  icon: string;
  tip: string;
  emote: string | null;
  admin: boolean;
  collapse: boolean;
  color: string;
  menuOnly: boolean;
}

export const MenuItems = [
  // Ask a question
  {
    type: EventType.question,
    icon: "mdi-help",
    tip: "Ask a question",
    emote: null,
    admin: false,
    collapse: false,
    color: getColor(EventType.question),
    menuOnly: false
  },

  // Share a link
  {
    type: EventType.link,
    icon: "mdi-link",
    tip: "Add a link",
    emote: null,
    admin: false,
    collapse: false,
    color: getColor(EventType.link),
    menuOnly: false
  },

  // Create an AI
  {
    type: EventType.todo,
    icon: "mdi-clipboard-check",
    tip: "Create a todo",
    emote: null,
    admin: false,
    collapse: false,
    color: getColor(EventType.todo),
    menuOnly: false
  },

  // Create a poll (admin only)
  {
    type: EventType.poll,
    icon: "mdi-poll-box",
    tip: "Create a poll",
    emote: null,
    admin: true,
    collapse: false,
    color: getColor(EventType.poll),
    menuOnly: false
  },

  // Wait for everyone (admin only)
  {
    type: EventType.wait,
    icon: "mdi-timer-outline",
    tip: "Wait for ack from everyone",
    emote: null,
    admin: true,
    collapse: false,
    color: getColor(EventType.wait),
    menuOnly: false
  },

  // AFK
  {
    type: EventType.afk,
    icon: "mdi-timer-sand-full",
    tip: "Mark me away",
    emote: null,
    admin: false,
    collapse: false,
    color: getColor(EventType.afk),
    menuOnly: true
  }
] as ButtonProps[];

export const EmoteItems = [
  // Thumbsup
  {
    type: EventType.emote,
    icon: "",
    tip: "thumbs up",
    emote: "👍",
    color: "brown",
    admin: false,
    collapse: false,
    menuOnly: false
  },

  // Happy
  {
    type: EventType.emote,
    icon: "",
    tip: "happy face",
    emote: "😀",
    color: "orange",
    admin: false,
    collapse: false,
    menuOnly: false
  },

  // Heart
  {
    type: EventType.emote,
    icon: "",
    tip: "heart",
    emote: "❤️",
    color: "red accent-3",
    admin: false,
    collapse: true,
    menuOnly: false
  },

  // +100
  {
    type: EventType.emote,
    icon: "",
    tip: "+100",
    emote: "💯️",
    color: "red accent-3",
    admin: false,
    collapse: true,
    menuOnly: false
  }
] as ButtonProps[];

export default MenuItems;
