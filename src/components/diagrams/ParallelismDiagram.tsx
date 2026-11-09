import React from 'react';
import { useSpinoza } from '@/context/SpinozaContext';
import { useThemeColors } from '@/hooks/useThemeColors';

interface InteractiveGroupProps {
    transform?: string;
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
}

const InteractiveGroup = ({ transform, onClick, children, className = "" }: InteractiveGroupProps): React.JSX.Element => (
    <g
        transform={transform}
        onClick={onClick}
        className={`cursor-pointer ${className}`}
        style={{ pointerEvents: 'all' }}
    >
        <g className="transition-all duration-300 ease-out hover:-translate-y-1 hover:drop-shadow-xl">
            {children}
        </g>
    </g>
);

const ParallelismDiagram = (): React.JSX.Element => {
    const { explainConcept } = useSpinoza();
    const C = useThemeColors();

    const handleNodeClick = (title: string, context: string): void => {
        explainConcept(title, context);
    };

    const CANVAS_WIDTH = 1400;
    const CANVAS_HEIGHT = 1100;

    return (
        <div className="w-full min-h-[1100px] relative font-sans overflow-hidden border-bt-xl border-tr-xl" style={{ backgroundColor: C.bg }}>
            <div className="absolute top-4 left-8 z-10 pointer-events-none">
                <h2 className="text-[var(--text-muted)] text-sm font-semibold tracking-widest uppercase mb-1">
                    ETHICA ORDINE GEOMETRICO DEMONSTRATA
                </h2>
                <h3 className="text-[var(--text-muted)] text-xs font-medium tracking-wider uppercase opacity-60">
                    / MIND-BODY PARALLELISM
                </h3>
            </div>

            <div className="w-full max-w-[1600px] mx-auto aspect-auto relative px-4 mt-2">
                <svg aria-labelledby="parallelism-title" role="img" viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} className="w-full h-auto min-h-[1100px]">
                    <title id="parallelism-title">Parallelism diagram illustrating mind-body identity</title>
                    <defs>
                        <pattern id="globalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={C.grid} strokeWidth="1" />
                        </pattern>

                        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                            <feOffset dx="2" dy="3" result="offsetblur" />
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="0.1" />
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="gradThought" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.thought.fill} />
                            <stop offset="100%" stopColor={C.thought.fill} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="gradExtension" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.extension.fill} />
                            <stop offset="100%" stopColor={C.extension.fill} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="gradParallel" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.parallelism.fill} />
                            <stop offset="100%" stopColor={C.parallelism.fill} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="gradSubstance" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.substance.fill} />
                            <stop offset="100%" stopColor={C.substance.fill} stopOpacity="0.7" />
                        </linearGradient>

                        <marker id="arrowThought" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">
                            <path d="M0,0 L5,1.5 L0,3 L0,0" fill={C.thought.stroke} />
                        </marker>
                        <marker id="arrowExtension" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">
                            <path d="M0,0 L5,1.5 L0,3 L0,0" fill={C.extension.stroke} />
                        </marker>
                        <marker id="arrowParallel" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">
                            <path d="M0,0 L5,1.5 L0,3 L0,0" fill={C.parallelism.stroke} />
                        </marker>
                    </defs>

                    <rect width="100%" height="100%" fill="url(#globalGrid)" />

                    <g transform="translate(700, 100)">
                        <path d="M 0 60 C 0 100, -350 100, -350 140" stroke={C.substance.stroke} strokeWidth="4" fill="none" opacity="0.8" />
                        <path d="M 0 60 C 0 100, 350 100, 350 140" stroke={C.substance.stroke} strokeWidth="4" fill="none" opacity="0.8" />

                        <InteractiveGroup onClick={() => handleNodeClick("Substance", "God or Nature")}>
                            <rect x="-220" y="-60" width="440" height="120" rx="8" fill="url(#gradSubstance)" stroke={C.substance.stroke} strokeWidth="3" filter="url(#softShadow)" />
                            <text y="-10" textAnchor="middle" fill={C.substance.text} fontSize="20" fontWeight="800" letterSpacing="1">SUBSTANCE</text>
                            <text y="20" textAnchor="middle" fill={C.substance.text} fontSize="16" fontWeight="600" fontStyle="italic">One Infinite Reality</text>
                        </InteractiveGroup>
                    </g>

                    <g transform="translate(150, 240)">
                        <rect width="400" height="750" rx="8" fill={C.thought.fill} stroke={C.thought.stroke} strokeWidth="2" fillOpacity="0.3" />
                        <text x="200" y="40" textAnchor="middle" fill={C.thought.text} fontSize="14" fontWeight="800" letterSpacing="2" opacity="0.6">ATTRIBUTE OF THOUGHT</text>

                        <InteractiveGroup transform="translate(200, 100)" onClick={() => handleNodeClick("God as Thinking Thing", "Substance under the attribute of thought")}>
                            <rect x="-160" y="-40" width="320" height="80" rx="8" fill="url(#gradThought)" stroke={C.thought.stroke} strokeWidth="3" filter="url(#softShadow)" />
                            <text y="5" textAnchor="middle" fill={C.thought.text} fontSize="20" fontWeight="800" letterSpacing="0.5">GOD as Thinking Thing</text>
                        </InteractiveGroup>

                        <path d="M 200 140 C 200 155, 200 165, 200 180" stroke={C.thought.stroke} strokeWidth="3" opacity="0.8" markerEnd="url(#arrowThought)" fill="none" />

                        <InteractiveGroup transform="translate(200, 220)" onClick={() => handleNodeClick("Infinite Intellect", "Immediate infinite mode of thought")}>
                            <rect x="-140" y="-40" width="280" height="80" rx="8" fill={C.white} stroke={C.thought.stroke} strokeWidth="2" strokeDasharray="8,5" filter="url(#softShadow)" />
                            <text y="-5" textAnchor="middle" fill={C.thought.text} fontSize="16" fontWeight="800">Infinite Immediate Mode</text>
                            <text y="20" textAnchor="middle" fill={C.text.secondary} fontSize="12" fontWeight="400" fontStyle="italic">(Infinite Intellect, Laws of Thought)</text>
                        </InteractiveGroup>

                        <path d="M 200 260 C 200 275, 200 285, 200 300" stroke={C.thought.stroke} strokeWidth="3" opacity="0.8" markerEnd="url(#arrowThought)" fill="none" />

                        <InteractiveGroup transform="translate(200, 340)" onClick={() => handleNodeClick("Chain of Ideas", "Order and connection of ideas")}>
                            <rect x="-140" y="-30" width="280" height="60" rx="8" fill={C.white} stroke={C.thought.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text y="5" textAnchor="middle" fill={C.thought.text} fontSize="14" fontWeight="800">Causal Chains of Ideas</text>
                        </InteractiveGroup>

                        <path d="M 200 370 C 200 385, 200 395, 200 410" stroke={C.thought.stroke} strokeWidth="2" opacity="0.8" markerEnd="url(#arrowThought)" fill="none" />

                        <InteractiveGroup transform="translate(200, 460)" onClick={() => handleNodeClick("Finite Ideas", "Individual thoughts")}>
                            <rect x="-140" y="-40" width="280" height="80" rx="8" fill={C.white} stroke={C.thought.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text y="-15" textAnchor="middle" fill={C.thought.text} fontSize="16" fontWeight="800">Finite Ideas</text>
                            <text y="10" textAnchor="middle" fill={C.text.secondary} fontSize="14" fontWeight="600">Idea₁ → Idea₂ → Idea₃ → ...</text>
                            <text y="30" textAnchor="middle" fill={C.thought.text} fontSize="12" fontStyle="italic">Mental causation complete within thought</text>
                        </InteractiveGroup>

                        <path d="M 200 500 C 200 520, 200 540, 200 560" stroke={C.thought.stroke} strokeWidth="3" opacity="0.8" markerEnd="url(#arrowThought)" fill="none" />

                        <InteractiveGroup transform="translate(200, 620)" onClick={() => handleNodeClick("Human Mind", "Idea of the Body")}>
                            <rect x="-160" y="-60" width="320" height="120" rx="8" fill="url(#gradThought)" stroke={C.thought.stroke} strokeWidth="3" filter="url(#softShadow)" />
                            <text y="-20" textAnchor="middle" fill={C.thought.text} fontSize="20" fontWeight="800" letterSpacing="1">HUMAN MIND</text>
                            <text y="10" textAnchor="middle" fill={C.thought.text} fontSize="14" fontWeight="800">= Idea of Human Body</text>
                            <text y="35" textAnchor="middle" fill={C.text.secondary} fontSize="12" fontWeight="500">• Adequate Ideas (actions)</text>
                            <text y="55" textAnchor="middle" fill={C.text.secondary} fontSize="12" fontWeight="500">• Inadequate Ideas (passions)</text>
                        </InteractiveGroup>
                    </g>

                    <g transform="translate(850, 240)">
                        <rect width="400" height="750" rx="8" fill={C.extension.fill} stroke={C.extension.stroke} strokeWidth="2" fillOpacity="0.3" />
                        <text x="200" y="40" textAnchor="middle" fill={C.extension.text} fontSize="14" fontWeight="800" letterSpacing="2" opacity="0.6">ATTRIBUTE OF EXTENSION</text>

                        <InteractiveGroup transform="translate(200, 100)" onClick={() => handleNodeClick("God as Extended Thing", "Substance under the attribute of extension")}>
                            <rect x="-160" y="-40" width="320" height="80" rx="8" fill="url(#gradExtension)" stroke={C.extension.stroke} strokeWidth="3" filter="url(#softShadow)" />
                            <text y="5" textAnchor="middle" fill={C.extension.text} fontSize="20" fontWeight="800" letterSpacing="0.5">GOD as Extended Thing</text>
                        </InteractiveGroup>

                        <path d="M 200 140 C 200 155, 200 165, 200 180" stroke={C.extension.stroke} strokeWidth="3" opacity="0.8" markerEnd="url(#arrowExtension)" fill="none" />

                        <InteractiveGroup transform="translate(200, 220)" onClick={() => handleNodeClick("Motion and Rest", "Immediate infinite mode of extension")}>
                            <rect x="-140" y="-40" width="280" height="80" rx="8" fill={C.white} stroke={C.extension.stroke} strokeWidth="2" strokeDasharray="8,5" filter="url(#softShadow)" />
                            <text y="-5" textAnchor="middle" fill={C.extension.text} fontSize="16" fontWeight="800">Infinite Immediate Mode</text>
                            <text y="20" textAnchor="middle" fill={C.text.secondary} fontSize="12" fontWeight="400" fontStyle="italic">(Motion & Rest, Laws of Physics)</text>
                        </InteractiveGroup>

                        <path d="M 200 260 C 200 275, 200 285, 200 300" stroke={C.extension.stroke} strokeWidth="3" opacity="0.8" markerEnd="url(#arrowExtension)" fill="none" />

                        <InteractiveGroup transform="translate(200, 340)" onClick={() => handleNodeClick("Chain of Bodies", "Order and connection of things")}>
                            <rect x="-140" y="-30" width="280" height="60" rx="8" fill={C.white} stroke={C.extension.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text y="5" textAnchor="middle" fill={C.extension.text} fontSize="14" fontWeight="800">Causal Chains of Bodies</text>
                        </InteractiveGroup>

                        <path d="M 200 370 C 200 385, 200 395, 200 410" stroke={C.extension.stroke} strokeWidth="2" opacity="0.8" markerEnd="url(#arrowExtension)" fill="none" />

                        <InteractiveGroup transform="translate(200, 460)" onClick={() => handleNodeClick("Finite Bodies", "Individual physical things")}>
                            <rect x="-140" y="-40" width="280" height="80" rx="8" fill={C.white} stroke={C.extension.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text y="-15" textAnchor="middle" fill={C.extension.text} fontSize="16" fontWeight="800">Finite Bodies</text>
                            <text y="10" textAnchor="middle" fill={C.text.secondary} fontSize="14" fontWeight="600">Body₁ → Body₂ → Body₃ → ...</text>
                            <text y="30" textAnchor="middle" fill={C.extension.text} fontSize="12" fontStyle="italic">Physical causation complete within extension</text>
                        </InteractiveGroup>

                        <path d="M 200 500 C 200 520, 200 540, 200 560" stroke={C.extension.stroke} strokeWidth="3" opacity="0.8" markerEnd="url(#arrowExtension)" fill="none" />

                        <InteractiveGroup transform="translate(200, 620)" onClick={() => handleNodeClick("Human Body", "Complex physical individual")}>
                            <rect x="-160" y="-60" width="320" height="120" rx="8" fill="url(#gradExtension)" stroke={C.extension.stroke} strokeWidth="3" filter="url(#softShadow)" />
                            <text y="-20" textAnchor="middle" fill={C.extension.text} fontSize="20" fontWeight="800" letterSpacing="1">HUMAN BODY</text>
                            <text y="10" textAnchor="middle" fill={C.extension.text} fontSize="14" fontWeight="800">= Complex Physical Individual</text>
                            <text y="35" textAnchor="middle" fill={C.text.secondary} fontSize="12" fontWeight="500">• Body&apos;s affections</text>
                            <text y="55" textAnchor="middle" fill={C.text.secondary} fontSize="12" fontWeight="500">• Physical states & motions</text>
                        </InteractiveGroup>
                    </g>

                    <g transform="translate(700, 860)">
                        <path d="M -120 0 L 120 0" stroke={C.parallelism.stroke} strokeWidth="2" strokeDasharray="8 4" markerStart="url(#arrowParallel)" markerEnd="url(#arrowParallel)" />
                        <InteractiveGroup transform="translate(0, 0)" onClick={() => handleNodeClick("Parallelism", "IIP7: The order and connection of ideas is the same as the order and connection of things.")}>
                            <rect x="-80" y="-20" width="160" height="40" rx="8" fill="url(#gradParallel)" stroke={C.parallelism.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text y="5" textAnchor="middle" fill={C.parallelism.text} fontSize="14" fontWeight="800" letterSpacing="1">PARALLELISM</text>
                        </InteractiveGroup>
                    </g>

                    <text x="700" y={1045} textAnchor="middle" fill={C.text.secondary} fontSize="12" fontWeight="500" fontStyle="italic" letterSpacing="0.5">
                        &ldquo;The order and connection of ideas is the same as the order and connection of things.&rdquo;
                    </text>

                    <g transform="translate(700, 1080)">
                        <text y="5" textAnchor="middle" fill={C.text.muted} fontSize="16" fontWeight="600">
                            IP14: Besides God, no substance • IP15: Whatever is, is in God • IIP7: Order of ideas = Order of things
                        </text>
                    </g>

                </svg>
            </div>
        </div>
    );
};

export default ParallelismDiagram;
