import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Category keyword mapping
const categoryKeywords = {
  electronics: [
    'laptop', 'tablet', 'tv', 'smartphone', 'headphone', 'monitor', 'camera',
    'memory card', 'fire stick', 'kindle', 'earbuds', 'dash cam', 'smart display'
  ],
  'home-kitchen': [
    'espresso', 'air fryer', 'air purifier', 'robot vacuum', 'vacuum', 'blender', 'microwave',
    'toaster', 'mattress', 'sheet set', 'pillow', 'cleaner', 'filter', 'humidifier',
    'fan', 'air conditioner'
  ],
  health: [
    'shampoo', 'conditioner', 'moisturizer', 'vitamin', 'supplement', 'toothpaste',
    'allergy', 'face mask', 'skin', 'anti-aging', 'collagen', 'serum', 'sun',
    'peel', 'facial'
  ],
  'toys-games': [
    'lego', 'toy', 'puzzle', 'game', 'playset', 'doll', 'nerf', 'action figure', 'board game'
  ],
  fashion: [
    'shirt', 't-shirt', 'jeans', 'dress', 'jacket', 'hoodie', 'shoes', 'sneakers',
    'tops', 'underwear', 'bra', 'leggings', 'apparel', 'tights'
  ],
  automotive: [
    'dash cam', 'tire', 'engine', 'car seat', 'car vacuum', 'booster', 'oil',
    'wiper', 'motor', 'automotive'
  ],
  pets: [
    'dog', 'cat', 'pet', 'litter', 'treats', 'animal', 'chew', 'kennel'
  ],
  books: [
    'book', 'novel', 'kindle edition', 'author', 'paperback'
  ]
};

export function assignCategory(dealTitle) {
  const lowerTitle = dealTitle.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerTitle.includes(keyword))) {
      return category;
    }
  }

  return 'other';
}
