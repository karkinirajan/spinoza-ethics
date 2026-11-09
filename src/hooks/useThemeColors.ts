"use client";

import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

/** The palette used before the theme is known (and outside a ThemeProvider): the light theme. */
const defaultColors = {
    bg: '#ffffff',
    grid: '#e2e8f0',
    text: {
        primary: '#1f2937',
        secondary: '#4b5563',
        muted: '#94a3b8',
        mutedLight: '#cbd5e1',
    },
    substance: {
        stroke: '#a855f7',
        fill: '#f3e8ff',
        text: '#6b21a8',
    },
    thought: {
        stroke: '#4f46e5',
        fill: '#e0e7ff',
        text: '#312e81',
    },
    extension: {
        stroke: '#db2777',
        fill: '#fce7f3',
        text: '#831843',
    },
    bondage: {
        stroke: '#ea580c',
        fill: '#ffedd5',
        text: '#9a3412',
    },
    freedom: {
        stroke: '#059669',
        fill: '#d1fae5',
        text: '#065f46',
    },
    parallelism: {
        stroke: '#ec4899',
        fill: '#fce7f3',
        text: '#9f1239',
    },
    reason: {
        stroke: '#d97706',
        fill: '#fef3c7',
        text: '#92400e',
    },
    bliss: {
        stroke: '#15803d',
        fill: '#86efac',
        text: '#ffffff',
    },
    layer: {
        stroke: '#cbd5e1',
        fill: '#f8fafc',
        text: '#475569',
    },
    white: '#ffffff',
    surface: '#f8fafc',
};

export type ThemeColors = typeof defaultColors;

export const useThemeColors = (): ThemeColors => {
    const context = useContext(ThemeContext);


    if (!context || !context.mounted) {
        return defaultColors;
    }

    const { theme } = context;
    
    const colors = {
        bg: theme === 'light' ? '#ffffff' : '#121212',
        grid: theme === 'light' ? '#e2e8f0' : '#262626',
        text: {
            primary: theme === 'light' ? '#1f2937' : '#f5f5f5',
            secondary: theme === 'light' ? '#4b5563' : '#a3a3a3',
            muted: theme === 'light' ? '#94a3b8' : '#52525b',
            mutedLight: theme === 'light' ? '#cbd5e1' : '#404040',
        },
        substance: {
            stroke: theme === 'light' ? '#a855f7' : '#c084fc',
            fill: theme === 'light' ? '#f3e8ff' : '#2e1065',
            text: theme === 'light' ? '#6b21a8' : '#e9d5ff',
        },
        thought: {
            stroke: theme === 'light' ? '#4f46e5' : '#818cf8',
            fill: theme === 'light' ? '#e0e7ff' : '#1e1b4b',
            text: theme === 'light' ? '#312e81' : '#c7d2fe',
        },
        extension: {
            stroke: theme === 'light' ? '#db2777' : '#f472b6',
            fill: theme === 'light' ? '#fce7f3' : '#500724',
            text: theme === 'light' ? '#831843' : '#fbcfe8',
        },
        bondage: {
            stroke: theme === 'light' ? '#ea580c' : '#fb923c',
            fill: theme === 'light' ? '#ffedd5' : '#431407',
            text: theme === 'light' ? '#9a3412' : '#fed7aa',
        },
        freedom: {
            stroke: theme === 'light' ? '#059669' : '#34d399',
            fill: theme === 'light' ? '#d1fae5' : '#064e3b',
            text: theme === 'light' ? '#065f46' : '#a7f3d0',
        },
        parallelism: {
            stroke: theme === 'light' ? '#ec4899' : '#f9a8d4',
            fill: theme === 'light' ? '#fff1f2' : '#500724',
            text: theme === 'light' ? '#9f1239' : '#fbcfe8',
        },
        reason: {
            stroke: theme === 'light' ? '#d97706' : '#fbbf24',
            fill: theme === 'light' ? '#fef3c7' : '#451a03',
            text: theme === 'light' ? '#92400e' : '#fef3c7',
        },
        bliss: {
            stroke: theme === 'light' ? '#15803d' : '#22c55e',
            fill: theme === 'light' ? '#86efac' : '#14532d',
            text: theme === 'light' ? '#ffffff' : '#ffffff',
        },
        layer: {
            stroke: theme === 'light' ? '#cbd5e1' : '#404040',
            fill: theme === 'light' ? '#f8fafc' : '#1a1a1a',
            text: theme === 'light' ? '#475569' : '#a1a1aa',
        },
        white: theme === 'light' ? '#ffffff' : '#1a1a1a',
        surface: theme === 'light' ? '#f8fafc' : '#171717',
    };

    return colors;
};
