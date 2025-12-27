import type { Product } from '../types';

export const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Organic Granola Bar',
        summary: 'This snack is sweet and enjoyable, but it may not align with a low-sugar or heart-focused diet.',
        reasoning: [
            { type: 'warning', title: 'Watch the sugar', description: 'Sugar is one of the main ingredients (around 12g per serving), which could spike blood sugar if eaten often.' },
            { type: 'positive', title: 'Good choice overall', description: 'It’s palm-oil free and high in fiber, which is generally better for heart health.' },
            { type: 'neutral', title: 'Uncertainty', description: 'There’s limited research on long-term daily consumption of snacks like this.' }
        ],
        recommendation: 'Treat this as an occasional snack rather than a daily habit.'
    },
    {
        id: '2',
        name: 'Almond Breeze Milk',
        summary: 'A widely used plant-based alternative that is low in calories but also low in protein compared to dairy.',
        reasoning: [
            { type: 'positive', title: 'Low Calorie', description: 'At 30 calories per cup, it is significantly lighter than dairy milk.' },
            { type: 'warning', title: 'Low Protein', description: 'Contains only 1g of protein per cup, unlike the 8g in dairy milk.' },
            { type: 'positive', title: 'Vitamin Enriched', description: 'Fortified with Calcium and Vitamin E for bone and skin health.' }
        ],
        recommendation: 'Great for smoothies, but ensure you get protein from other sources.'
    },
    {
        id: '3',
        name: 'Spicy Nacho Chips',
        summary: 'Highly processed and high in sodium; enjoy sparingly.',
        reasoning: [
            { type: 'warning', title: 'High Sodium', description: 'One serving contains nearly 20% of your daily recommended sodium intake.' },
            { type: 'warning', title: 'Artificial Additives', description: 'Contains artificial colors (Red 40, Yellow 5) and MSG.' },
            { type: 'neutral', title: 'Enjoyment', description: 'A popular party snack designed for high palatability.' }
        ],
        recommendation: 'Best saved for parties, not your daily lunchbox.'
    }
];
