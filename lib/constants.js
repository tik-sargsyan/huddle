export const BUDGETS = [
  { id: "free", label: "Free", hint: "No cost" },
  { id: "low", label: "$", hint: "Under $25 pp" },
  { id: "mid", label: "$$", hint: "$25–75 pp" },
  { id: "high", label: "$$$", hint: "$75+ pp" },
];

export const CATEGORIES = [
  { id: "outdoor", label: "Outdoor", emoji: "🌲" },
  { id: "food", label: "Food & Drinks", emoji: "🍕" },
  { id: "games", label: "Games", emoji: "🎲" },
  { id: "workshop", label: "Workshop", emoji: "🎨" },
  { id: "wellness", label: "Wellness", emoji: "🧘" },
  { id: "other", label: "Other", emoji: "✨" },
];

export const budgetOf = (id) => BUDGETS.find((b) => b.id === id) || BUDGETS[0];
export const categoryOf = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[5];
