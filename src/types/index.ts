export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    age?: string;
    gender?: string;
    goals?: string;
}

export interface Reasoning {
    type: 'warning' | 'positive' | 'neutral';
    title: string;
    description: string;
}

export interface Product {
    id: string;
    name: string;
    image?: string;
    summary: string;
    reasoning: Reasoning[];
    recommendation: string;
    alternatives?: { name: string; reason: string }[];
}
