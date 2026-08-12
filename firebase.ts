import { NicheOption, ProjectTemplate } from "./types";

export const TOP_NICHES: NicheOption[] = [
  { id: "crypto-investing", title: "Crypto Investing for Beginners", potential: "High", competition: "High", timeToMarket: "Under 10 hours" },
  { id: "ai-side-hustle", title: "AI Side Hustle Blueprints", potential: "High", competition: "Medium", timeToMarket: "Under 8 hours" },
  { id: "remote-productivity", title: "Remote Work Productivity Systems", potential: "Medium", competition: "Medium", timeToMarket: "Under 6 hours" },
  { id: "passive-income-real-estate", title: "Passive Income through Real Estate Crowdfunding", potential: "High", competition: "Low", timeToMarket: "Under 12 hours" },
  { id: "sustainable-living", title: "Sustainable Living on a Budget", potential: "Medium", competition: "Low", timeToMarket: "Under 5 hours" },
  { id: "mental-health-tech", title: "Mental Health for Tech Professionals", potential: "High", competition: "Medium", timeToMarket: "Under 10 hours" },
  { id: "no-code-saas", title: "Building No-Code SaaS Products", potential: "High", competition: "Medium", timeToMarket: "Under 15 hours" },
  { id: "digital-nomad-visa", title: "Digital Nomad Visa Guide 2025", potential: "Medium", competition: "Low", timeToMarket: "Under 4 hours" },
  { id: "plant-based-meal-prep", title: "Plant-Based Meal Prep for Busy Parents", potential: "Medium", competition: "High", timeToMarket: "Under 6 hours" },
  { id: "cybersecurity-small-biz", title: "Cybersecurity for Small Business Owners", potential: "High", competition: "Low", timeToMarket: "Under 8 hours" },
  // ... adding more to reach 50 or at least a good number
  { id: "biohacking-sleep", title: "Biohacking Your Sleep", potential: "High", competition: "Medium", timeToMarket: "Under 7 hours" },
  { id: "freelance-writing-ai", title: "Freelance Writing in the AI Era", potential: "Medium", competition: "High", timeToMarket: "Under 5 hours" },
  { id: "minimalist-home-office", title: "The Minimalist Home Office Guide", potential: "Low", competition: "Low", timeToMarket: "Under 3 hours" },
  { id: "stock-options-trading", title: "Stock Options Trading for Dummies", potential: "High", competition: "High", timeToMarket: "Under 20 hours" },
  { id: "van-life-conversion", title: "Van Life: DIY Conversion Guide", potential: "Medium", competition: "Medium", timeToMarket: "Under 25 hours" },
  { id: "prompt-engineering", title: "Prompt Engineering for Business", potential: "High", competition: "Medium", timeToMarket: "Under 6 hours" },
  { id: "defi-mastery", title: "DeFi Mastery: Yield Farming & Staking", potential: "High", competition: "Medium", timeToMarket: "Under 12 hours" },
  { id: "fire-movement", title: "The FIRE Movement Blueprint", potential: "High", competition: "Medium", timeToMarket: "Under 8 hours" },
  { id: "intermittent-fasting", title: "Intermittent Fasting for Longevity", potential: "Medium", competition: "High", timeToMarket: "Under 5 hours" },
  { id: "urban-gardening", title: "Urban Gardening for Small Spaces", potential: "Medium", competition: "Low", timeToMarket: "Under 4 hours" },
  { id: "solo-travel-safety", title: "Solo Female Travel Safety Guide", potential: "Medium", competition: "Low", timeToMarket: "Under 6 hours" },
  { id: "cyberpunk-thriller", title: "Neon Shadows: A Cyberpunk Thriller", potential: "Medium", competition: "Medium", timeToMarket: "Under 40 hours" },
  { id: "space-opera", title: "Galactic Frontiers: Space Opera Epic", potential: "High", competition: "Medium", timeToMarket: "Under 50 hours" },
  { id: "dinosaur-adventures", title: "Dino-Mite Adventures for Kids", potential: "Medium", competition: "High", timeToMarket: "Under 10 hours" },
  { id: "magic-forest", title: "The Secret of the Magic Forest", potential: "Medium", competition: "High", timeToMarket: "Under 12 hours" },
  { id: "gut-health", title: "The Gut Health Revolution", potential: "High", competition: "Medium", timeToMarket: "Under 8 hours" },
  { id: "tax-strategies", title: "Tax Strategies for Freelancers", potential: "High", competition: "Low", timeToMarket: "Under 10 hours" },
  { id: "web3-dev", title: "Web3 Development for Beginners", potential: "High", competition: "Medium", timeToMarket: "Under 15 hours" },
  { id: "keto-air-fryer", title: "Keto Air Fryer Recipes for Busy Professionals", potential: "High", competition: "High", timeToMarket: "Under 8 hours" },
  { id: "real-estate-flipping", title: "House Flipping: The 2025 Blueprint", potential: "High", competition: "Medium", timeToMarket: "Under 12 hours" },
  { id: "ai-marketing-agency", title: "Starting an AI Marketing Agency", potential: "High", competition: "Low", timeToMarket: "Under 10 hours" },
  { id: "adhd-productivity", title: "Productivity Systems for ADHD Brains", potential: "High", competition: "Medium", timeToMarket: "Under 6 hours" },
  { id: "anti-aging-biohacking", title: "The Longevity Protocol: Anti-Aging Science", potential: "High", competition: "Medium", timeToMarket: "Under 9 hours" },
  { id: "solar-power-home", title: "Off-Grid Solar Power for Homeowners", potential: "Medium", competition: "Low", timeToMarket: "Under 7 hours" },
  { id: "dropshipping-2025", title: "High-Ticket Dropshipping in 2025", potential: "High", competition: "High", timeToMarket: "Under 15 hours" },
  { id: "meditation-anxiety", title: "Mindfulness for High-Functioning Anxiety", potential: "High", competition: "Medium", timeToMarket: "Under 5 hours" },
  { id: "python-for-finance", title: "Python for Financial Analysis", potential: "High", competition: "Medium", timeToMarket: "Under 18 hours" },
  { id: "tiny-house-living", title: "The Tiny House Lifestyle Guide", potential: "Medium", competition: "Low", timeToMarket: "Under 10 hours" },
  { id: "vertical-farming", title: "Hydroponics & Vertical Farming at Home", potential: "Medium", competition: "Low", timeToMarket: "Under 12 hours" },
  { id: "dark-romance-novel", title: "Shadowed Hearts: A Dark Romance", potential: "High", competition: "High", timeToMarket: "Under 45 hours" },
  { id: "true-crime-analysis", title: "Cold Case Files: A True Crime Analysis", potential: "Medium", competition: "Medium", timeToMarket: "Under 20 hours" },
  { id: "parenting-teens", title: "Navigating the Teenage Years: A Parent's Guide", potential: "Medium", competition: "Medium", timeToMarket: "Under 15 hours" },
  { id: "dog-training-basics", title: "Positive Reinforcement: Dog Training 101", potential: "Medium", competition: "High", timeToMarket: "Under 8 hours" },
  { id: "meditation-for-kids", title: "Mindfulness for Little Minds", potential: "Medium", competition: "Low", timeToMarket: "Under 5 hours" },
  { id: "zero-waste-kitchen", title: "The Zero-Waste Kitchen Handbook", potential: "Medium", competition: "Low", timeToMarket: "Under 6 hours" },
  { id: "freelance-graphic-design", title: "Scaling Your Graphic Design Freelance Biz", potential: "High", competition: "Medium", timeToMarket: "Under 10 hours" },
  { id: "podcast-launch-guide", title: "Launch Your Podcast in 30 Days", potential: "High", competition: "Medium", timeToMarket: "Under 12 hours" },
  { id: "virtual-assistant-career", title: "Becoming a High-Paid Virtual Assistant", potential: "High", competition: "High", timeToMarket: "Under 8 hours" },
  { id: "self-publishing-mastery", title: "The Self-Publishing Mastery Guide", potential: "High", competition: "Medium", timeToMarket: "Under 15 hours" },
  { id: "yoga-for-seniors", title: "Gentle Yoga for Seniors", potential: "Medium", competition: "Low", timeToMarket: "Under 7 hours" },
  { id: "home-brewing-beer", title: "Craft Beer at Home: A Brewing Guide", potential: "Low", competition: "Medium", timeToMarket: "Under 20 hours" },
  { id: "watercolor-painting", title: "Watercolor for Absolute Beginners", potential: "Medium", competition: "High", timeToMarket: "Under 10 hours" },
  { id: "chess-strategy", title: "Chess Strategy: From Novice to Master", potential: "Low", competition: "High", timeToMarket: "Under 25 hours" },
  { id: "survival-first-aid", title: "Wilderness First Aid & Survival", potential: "Medium", competition: "Low", timeToMarket: "Under 12 hours" },
  { id: "minimalist-wardrobe", title: "The Curated Closet: Minimalist Fashion", potential: "Medium", competition: "Medium", timeToMarket: "Under 5 hours" },
  { id: "public-speaking-fear", title: "Conquering Public Speaking Anxiety", potential: "High", competition: "Medium", timeToMarket: "Under 8 hours" },
  { id: "digital-detox-plan", title: "The 21-Day Digital Detox Plan", potential: "Medium", competition: "Low", timeToMarket: "Under 4 hours" },
  { id: "apartment-homesteading", title: "Homesteading in a Small Apartment", potential: "Medium", competition: "Low", timeToMarket: "Under 10 hours" },
  { id: "coding-for-non-coders", title: "Coding Logic for Non-Coders", potential: "High", competition: "Medium", timeToMarket: "Under 12 hours" },
  { id: "remote-team-management", title: "Managing Remote Teams Effectively", potential: "High", competition: "Medium", timeToMarket: "Under 10 hours" },
  { id: "sustainable-fashion-biz", title: "Starting a Sustainable Fashion Brand", potential: "High", competition: "Low", timeToMarket: "Under 20 hours" },
];

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "non-fiction-guide",
    name: "Non-Fiction Guide",
    description: "Perfect for 'How-to' books, technical guides, and business blueprints.",
    icon: "BookOpen",
    defaultWritingStyle: "Professional, instructional, and clear",
    defaultTone: "Professional",
    defaultAudience: "Beginner to Intermediate",
    defaultFormatting: {
      fontFamily: "Inter",
      lineSpacing: 1.6,
      fontSize: 16,
      textAlign: "left"
    },
    suggestedNiches: ["ai-side-hustle", "remote-productivity", "no-code-saas", "prompt-engineering", "cybersecurity-small-biz", "web3-dev", "adhd-productivity", "remote-team-management", "coding-for-non-coders"]
  },
  {
    id: "fiction-novel",
    name: "Fiction Novel",
    description: "Optimized for storytelling, character development, and immersive worlds.",
    icon: "Sparkles",
    defaultWritingStyle: "Descriptive, engaging, and narrative-driven",
    defaultTone: "Dramatic",
    defaultAudience: "General Fiction Readers",
    defaultFormatting: {
      fontFamily: "Georgia",
      lineSpacing: 1.8,
      fontSize: 18,
      textAlign: "justify"
    },
    suggestedNiches: ["cyberpunk-thriller", "space-opera", "dark-romance-novel", "true-crime-analysis"]
  },
  {
    id: "childrens-book",
    name: "Children's Book",
    description: "Simple language, vibrant imagery, and educational themes.",
    icon: "Sun",
    defaultWritingStyle: "Simple, playful, and educational",
    defaultTone: "Cheerful",
    defaultAudience: "Children (Ages 4-8)",
    defaultFormatting: {
      fontFamily: "Comic Sans MS",
      lineSpacing: 2.0,
      fontSize: 20,
      textAlign: "center"
    },
    suggestedNiches: ["dinosaur-adventures", "magic-forest", "meditation-for-kids"]
  },
  {
    id: "self-help",
    name: "Self-Help / Wellness",
    description: "Empowering, empathetic, and action-oriented content.",
    icon: "Heart",
    defaultWritingStyle: "Empathetic, encouraging, and actionable",
    defaultTone: "Empathetic",
    defaultAudience: "Self-Improvement Seekers",
    defaultFormatting: {
      fontFamily: "Outfit",
      lineSpacing: 1.5,
      fontSize: 17,
      textAlign: "left"
    },
    suggestedNiches: ["biohacking-sleep", "mental-health-tech", "sustainable-living", "intermittent-fasting", "gut-health", "fire-movement", "meditation-anxiety", "anti-aging-biohacking", "digital-detox-plan"]
  },
  {
    id: "cookbook",
    name: "Cookbook / Recipe Book",
    description: "Structured for recipes, nutritional info, and culinary tips.",
    icon: "Utensils",
    defaultWritingStyle: "Concise, instructional, and appetizing",
    defaultTone: "Warm",
    defaultAudience: "Home Cooks",
    defaultFormatting: {
      fontFamily: "Montserrat",
      lineSpacing: 1.4,
      fontSize: 16,
      textAlign: "left"
    },
    suggestedNiches: ["keto-air-fryer", "plant-based-meal-prep", "zero-waste-kitchen"]
  },
  {
    id: "business-blueprint",
    name: "Business Blueprint",
    description: "Data-driven, strategic, and focused on ROI and scalability.",
    icon: "TrendingUp",
    defaultWritingStyle: "Analytical, strategic, and results-oriented",
    defaultTone: "Authoritative",
    defaultAudience: "Entrepreneurs & Executives",
    defaultFormatting: {
      fontFamily: "Inter",
      lineSpacing: 1.5,
      fontSize: 15,
      textAlign: "left"
    },
    suggestedNiches: ["ai-marketing-agency", "dropshipping-2025", "real-estate-flipping", "no-code-saas", "tax-strategies", "freelance-writing-ai", "virtual-assistant-career", "podcast-launch-guide"]
  },
  {
    id: "travel-guide",
    name: "Travel / Nomad Guide",
    description: "Logistical, adventurous, and packed with local insights.",
    icon: "Map",
    defaultWritingStyle: "Informative, adventurous, and practical",
    defaultTone: "Adventurous",
    defaultAudience: "Travelers & Digital Nomads",
    defaultFormatting: {
      fontFamily: "Open Sans",
      lineSpacing: 1.6,
      fontSize: 16,
      textAlign: "left"
    },
    suggestedNiches: ["digital-nomad-visa", "van-life-conversion", "solo-travel-safety", "tiny-house-living"]
  },
  {
    id: "memoir-biography",
    name: "Memoir / Biography",
    description: "Personal, reflective, and narrative-driven life stories.",
    icon: "User",
    defaultWritingStyle: "Reflective, personal, and storytelling",
    defaultTone: "Introspective",
    defaultAudience: "General Readers",
    defaultFormatting: {
      fontFamily: "Lora",
      lineSpacing: 1.7,
      fontSize: 17,
      textAlign: "justify"
    },
    suggestedNiches: ["solo-travel-safety", "fire-movement", "van-life-conversion"]
  },
  {
    id: "educational-textbook",
    name: "Educational / Textbook",
    description: "Academic, structured, and focused on learning outcomes.",
    icon: "GraduationCap",
    defaultWritingStyle: "Academic, structured, and explanatory",
    defaultTone: "Educational",
    defaultAudience: "Students & Lifelong Learners",
    defaultFormatting: {
      fontFamily: "Roboto",
      lineSpacing: 1.5,
      fontSize: 16,
      textAlign: "left"
    },
    suggestedNiches: ["python-for-finance", "cybersecurity-small-biz", "web3-dev", "prompt-engineering", "coding-for-non-coders"]
  }
];

export const CHAPTER_TEMPLATES = [
  {
    id: "introduction",
    title: "Introduction",
    description: "Set the stage, define the problem, and outline what the reader will learn in this book."
  },
  {
    id: "foundations",
    title: "The Foundations",
    description: "Cover the basic concepts, history, and essential background information needed to understand the core topic."
  },
  {
    id: "core-strategy",
    title: "Core Strategy & Framework",
    description: "Detail the primary methodology, system, or strategy that forms the heart of your book's value proposition."
  },
  {
    id: "step-by-step",
    title: "Step-by-Step Implementation",
    description: "A practical, actionable guide on how to apply the concepts discussed in previous chapters."
  },
  {
    id: "case-study",
    title: "Case Study: Real-World Application",
    description: "Analyze a specific example or success story that demonstrates the effectiveness of your approach."
  },
  {
    id: "advanced-tactics",
    title: "Advanced Tactics & Optimization",
    description: "Go beyond the basics with high-level techniques for readers who want to master the subject."
  },
  {
    id: "common-pitfalls",
    title: "Common Pitfalls & How to Avoid Them",
    description: "Identify frequent mistakes and provide proactive solutions to keep the reader on the right track."
  },
  {
    id: "future-trends",
    title: "Future Trends & Outlook",
    description: "Discuss where the industry or topic is heading and how the reader can stay ahead of the curve."
  },
  {
    id: "conclusion",
    title: "Conclusion & Final Thoughts",
    description: "Summarize key takeaways, provide a final call to action, and offer encouraging closing remarks."
  },
  {
    id: "resources",
    title: "Resources & Further Reading",
    description: "A curated list of tools, books, websites, and other materials to help the reader continue their journey."
  }
];
