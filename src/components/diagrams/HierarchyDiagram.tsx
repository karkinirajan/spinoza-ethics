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
        <g className="transition-all duration-300 ease-out hover:scale-[1.02] hover:drop-shadow-lg">
            {children}
        </g>
    </g>
);

const WavyCard = ({ x, y, text, fill, stroke }: { x: number, y: number, text: string, fill: string, stroke: string }): React.JSX.Element => (
    <g transform={`translate(${x}, ${y})`}>
        <path
            d="M -50 -14 C -35 -14, -15 -20, 0 -14 C 15 -8, 35 -8, 50 -14 L 50 14 C 35 14, 15 8, 0 14 C -15 20, -35 20, -50 14 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
        />
        <text x="0" y="5" textAnchor="middle" fill={stroke} fontSize="17" fontWeight="600" style={{ pointerEvents: 'none' }}>
            {text}
        </text>
    </g>
);

const HierarchyDiagram = (): React.JSX.Element => {
    const { explainConcept } = useSpinoza();
    const C = useThemeColors();

    const handleNodeClick = (title: string, context: string): void => {
        explainConcept(title, context);
    };

    const CANVAS_WIDTH = 1600;
    const CANVAS_HEIGHT = 1100;

    const Y_SUBSTANCE = 120;
    const Y_ATTRIBUTES = 380;
    const Y_IMMEDIATE = 550;
    const Y_MEDIATE = 690;
    const Y_FINITE = 880;

    const Y_SUB_BTM = Y_SUBSTANCE + 100;
    const Y_ATTR_TOP = Y_ATTRIBUTES - 75;
    const Y_ATTR_BTM = Y_ATTRIBUTES + 75;
    const Y_IMM_TOP = Y_IMMEDIATE - 45;
    const Y_IMM_BTM = Y_IMMEDIATE + 45;
    const Y_MED_TOP = Y_MEDIATE - 45;
    const Y_MED_BTM = Y_MEDIATE + 45;
    const Y_FIN_TOP = Y_FINITE - 80;

    const arrowStyle = { strokeWidth: "2", fill: "none", opacity: "0.8" };

    return (
        <div className="w-full min-h-[1100px] relative font-sans overflow-auto border-bt-xl border-tr-xl" style={{ backgroundColor: C.bg }}>
            <div className="absolute top-4 left-8 z-10 pointer-events-none">
                <h2 className="text-[var(--text-muted)] text-sm font-semibold tracking-widest uppercase mb-1">
                    ETHICA ORDINE GEOMETRICO DEMONSTRATA
                </h2>
                <h3 className="text-[var(--text-muted)] text-xs font-medium tracking-wider uppercase opacity-60">
                    / ETHICS DEMONSTRATED IN GEOMETRICAL ORDER
                </h3>
            </div>

            <div className="w-full max-w-[1600px] mx-auto aspect-auto relative px-4 mt-2">
                <svg aria-labelledby="hierarchy-title" role="img" viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} className="w-full h-auto min-h-[1100px]">
                    <title id="hierarchy-title">Hierarchy diagram of Spinoza&apos;s Ethics</title>
                    <defs>
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

                        <pattern id="globalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={C.grid} strokeWidth="1" />
                        </pattern>

                        <linearGradient id="gradLeft" x1="100%" y1="0%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor={C.substance.stroke} stopOpacity="0.8" />
                            <stop offset="100%" stopColor={C.substance.stroke} stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="gradRight" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={C.substance.stroke} stopOpacity="0.8" />
                            <stop offset="100%" stopColor={C.substance.stroke} stopOpacity="0.0" />
                        </linearGradient>

                        <marker id="arrowBlue" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">
                            <path d="M0,0 L5,1.5 L0,3 L0,0" fill={C.thought.stroke} />
                        </marker>
                        <marker id="arrowRed" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">
                            <path d="M0,0 L5,1.5 L0,3 L0,0" fill={C.extension.stroke} />
                        </marker>
                    </defs>

                    <rect width="100%" height="100%" fill="url(#globalGrid)" />

                    <g transform="translate(80, 250)" className="select-none pointer-events-none font-black tracking-widest">
                        <text x="0" y="0" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">N</text>
                        <text x="0" y="20" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">A</text>
                        <text x="0" y="40" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">T</text>
                        <text x="0" y="60" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">U</text>
                        <text x="0" y="80" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">R</text>
                        <text x="0" y="100" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">A</text>
                        <text x="0" y="130" textAnchor="middle" fill={C.text.muted} fontSize="16" fontWeight="bold">...</text>
                        <text x="0" y="150" textAnchor="middle" fill={C.text.muted} fontSize="14" fontWeight="600" letterSpacing="0">infinite</text>
                        <text x="0" y="180" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">N</text>
                        <text x="0" y="200" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">A</text>
                        <text x="0" y="220" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">T</text>
                        <text x="0" y="240" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">U</text>
                        <text x="0" y="260" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">R</text>
                        <text x="0" y="280" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">A</text>
                        <text x="0" y="300" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">N</text>
                        <text x="0" y="320" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">S</text>
                        <text x="0" y="350" textAnchor="middle" fill={C.text.muted} fontSize="16" fontWeight="400">/</text>
                        <text x="0" y="370" textAnchor="middle" fill={C.text.mutedLight} fontSize="14" fontWeight="700">A</text>
                        <text x="0" y="385" textAnchor="middle" fill={C.text.mutedLight} fontSize="14" fontWeight="700">c</text>
                        <text x="0" y="400" textAnchor="middle" fill={C.text.mutedLight} fontSize="14" fontWeight="700">t</text>
                        <text x="0" y="415" textAnchor="middle" fill={C.text.mutedLight} fontSize="14" fontWeight="700">i</text>
                        <text x="0" y="430" textAnchor="middle" fill={C.text.mutedLight} fontSize="14" fontWeight="700">v</text>
                        <text x="0" y="445" textAnchor="middle" fill={C.text.mutedLight} fontSize="14" fontWeight="700">e</text>
                    </g>

                    <g transform="translate(1520, 650)" className="select-none pointer-events-none font-black tracking-widest">
                        <text x="0" y="0" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">N</text>
                        <text x="0" y="20" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">A</text>
                        <text x="0" y="40" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">T</text>
                        <text x="0" y="60" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">U</text>
                        <text x="0" y="80" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">R</text>
                        <text x="0" y="100" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">A</text>
                        <text x="0" y="130" textAnchor="middle" fill={C.text.muted} fontSize="16" fontWeight="bold">...</text>
                        <text x="0" y="150" textAnchor="middle" fill={C.text.muted} fontSize="14" fontWeight="600" letterSpacing="0">infinite</text>
                        <text x="0" y="180" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">N</text>
                        <text x="0" y="200" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">A</text>
                        <text x="0" y="220" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">T</text>
                        <text x="0" y="240" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">U</text>
                        <text x="0" y="260" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">R</text>
                        <text x="0" y="280" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">A</text>
                        <text x="0" y="300" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">T</text>
                        <text x="0" y="320" textAnchor="middle" fill={C.text.mutedLight} fontSize="16">A</text>
                        <text x="0" y="350" textAnchor="middle" fill={C.text.muted} fontSize="16" fontWeight="400">/</text>
                        <text x="0" y="370" textAnchor="middle" fill={C.text.mutedLight} fontSize="14" fontWeight="700">P</text>
                        <text x="0" y="385" textAnchor="middle" fill={C.text.mutedLight} fontSize="14" fontWeight="700">a</text>
                        <text x="0" y="400" textAnchor="middle" fill={C.text.mutedLight} fontSize="14" fontWeight="700">s</text>
                        <text x="0" y="415" textAnchor="middle" fill={C.text.mutedLight} fontSize="14" fontWeight="700">s</text>
                        <text x="0" y="430" textAnchor="middle" fill={C.text.mutedLight} fontSize="14" fontWeight="700">i</text>
                        <text x="0" y="445" textAnchor="middle" fill={C.text.mutedLight} fontSize="14" fontWeight="700">v</text>
                        <text x="0" y="460" textAnchor="middle" fill={C.text.mutedLight} fontSize="14" fontWeight="700">e</text>
                    </g>

                    <path d={`M 550 ${Y_SUB_BTM} C 550 ${Y_SUB_BTM + 50}, 350 ${Y_SUB_BTM + 50}, 350 ${Y_ATTR_TOP}`} stroke={C.substance.stroke} strokeWidth="2" fill="none" opacity="0.8" markerEnd="url(#arrowBlue)" />
                    <path d={`M 1050 ${Y_SUB_BTM} C 1050 ${Y_SUB_BTM + 50}, 1250 ${Y_SUB_BTM + 50}, 1250 ${Y_ATTR_TOP}`} stroke={C.substance.stroke} strokeWidth="2" fill="none" opacity="0.8" markerEnd="url(#arrowRed)" />

                    <path d={`M 350 ${Y_ATTR_BTM} C 350 ${Y_ATTR_BTM + 30}, 350 ${Y_IMM_TOP - 30}, 350 ${Y_IMM_TOP}`} stroke={C.thought.stroke} {...arrowStyle} markerEnd="url(#arrowBlue)" />
                    <path d={`M 350 ${Y_IMM_BTM} C 350 ${Y_IMM_BTM + 30}, 350 ${Y_MED_TOP - 30}, 350 ${Y_MED_TOP}`} stroke={C.thought.stroke} {...arrowStyle} markerEnd="url(#arrowBlue)" />
                    <path d={`M 350 ${Y_MED_BTM} C 350 ${Y_MED_BTM + 30}, 350 ${Y_FIN_TOP - 30}, 350 ${Y_FIN_TOP}`} stroke={C.thought.stroke} {...arrowStyle} markerEnd="url(#arrowBlue)" />

                    <path d={`M 1250 ${Y_ATTR_BTM} C 1250 ${Y_ATTR_BTM + 30}, 1250 ${Y_IMM_TOP - 30}, 1250 ${Y_IMM_TOP}`} stroke={C.extension.stroke} {...arrowStyle} markerEnd="url(#arrowRed)" />
                    <path d={`M 1250 ${Y_IMM_BTM} C 1250 ${Y_IMM_BTM + 30}, 1250 ${Y_MED_TOP - 30}, 1250 ${Y_MED_TOP}`} stroke={C.extension.stroke} {...arrowStyle} markerEnd="url(#arrowRed)" />
                    <path d={`M 1250 ${Y_MED_BTM} C 1250 ${Y_MED_BTM + 30}, 1250 ${Y_FIN_TOP - 30}, 1250 ${Y_FIN_TOP}`} stroke={C.extension.stroke} {...arrowStyle} markerEnd="url(#arrowRed)" />

                    <WavyCard x={440} y={(Y_SUB_BTM + Y_ATTR_TOP) / 2} text="expresses" fill={C.thought.fill} stroke={C.thought.stroke} />
                    <WavyCard x={1160} y={(Y_SUB_BTM + Y_ATTR_TOP) / 2} text="expresses" fill={C.extension.fill} stroke={C.extension.stroke} />

                    <InteractiveGroup transform={`translate(800, ${Y_SUBSTANCE})`} onClick={() => handleNodeClick("Substance", "God or Nature")}>
                        <rect x="-350" y="-80" width="700" height="200" rx="8" fill={C.substance.fill} stroke="none" />
                        <rect x="-350" y="-80" width="700" height="200" rx="8" fill="none" stroke={C.substance.stroke} strokeWidth="3" filter="url(#softShadow)" />
                        <text x="0" y="-30" textAnchor="middle" fill={C.substance.text} fontSize="20" fontWeight="800" letterSpacing="1">SUBSTANCE</text>
                        <text x="0" y="5" textAnchor="middle" fill={C.substance.text} fontSize="16" fontWeight="600" fontStyle="italic">God / Nature (Deus sive Natura)</text>
                        <text x="0" y="40" textAnchor="middle" fill={C.text.secondary} fontSize="16" fontWeight="500" letterSpacing="0.5">
                            One • Infinite • Self-caused • Necessarily Exists
                        </text>

                        <g transform="translate(0, 80)">
                            <path d="M -150 0 C -300 0, -500 -30, -700 -80" stroke="url(#gradLeft)" strokeWidth="3" fill="none" />
                            <path d="M -150 10 C -300 20, -480 40, -680 10" stroke="url(#gradLeft)" strokeWidth="3" fill="none" />
                            <path d="M -150 20 C -300 50, -450 80, -650 100" stroke="url(#gradLeft)" strokeWidth="3" fill="none" />
                            <path d="M 150 0 C 300 0, 500 -30, 700 -80" stroke="url(#gradRight)" strokeWidth="3" fill="none" />
                            <path d="M 150 10 C 300 20, 480 40, 680 10" stroke="url(#gradRight)" strokeWidth="3" fill="none" />
                            <path d="M 150 20 C 300 50, 450 80, 650 100" stroke="url(#gradRight)" strokeWidth="3" fill="none" />
                            <text x="-720" y="-70" textAnchor="middle" fill={C.substance.text} opacity="0.3" fontSize="28">∞</text>
                            <text x="720" y="-70" textAnchor="middle" fill={C.substance.text} opacity="0.3" fontSize="28">∞</text>
                            <InteractiveGroup onClick={() => handleNodeClick("Unknown Attributes", "Infinite attributes unknown to the human mind")}>
                                <rect x="-140" y="-15" width="280" height="34" rx="17" fill={C.white} stroke={C.substance.stroke} strokeWidth="1" />
                                <text x="0" y="6" textAnchor="middle" fill={C.substance.text} fontSize="14" fontWeight="500">
                                    Infinite unknown attributes
                                </text>
                            </InteractiveGroup>
                        </g>
                    </InteractiveGroup>

                    <InteractiveGroup transform={`translate(350, ${Y_ATTRIBUTES})`} onClick={() => handleNodeClick("Attribute of Thought", "Infinite Intellect")}>
                        <rect x="-200" y="-75" width="400" height="150" rx="8" fill={C.thought.fill} stroke={C.thought.stroke} strokeWidth="3" filter="url(#softShadow)" />
                        <text x="0" y="-30" textAnchor="middle" fill={C.thought.text} fontSize="20" fontWeight="800" letterSpacing="0.5">ATTRIBUTE: THOUGHT</text>
                        <text x="0" y="0" textAnchor="middle" fill={C.thought.text} fontSize="16" fontWeight="500">Infinite • Eternal • Conceived through itself</text>
                        <text x="0" y="30" textAnchor="middle" fill={C.thought.text} fontSize="16" fontWeight="400" fontStyle="italic">All mental phenomena</text>
                    </InteractiveGroup>

                    <InteractiveGroup transform={`translate(1250, ${Y_ATTRIBUTES})`} onClick={() => handleNodeClick("Attribute of Extension", "Infinite Extension")}>
                        <rect x="-200" y="-75" width="400" height="150" rx="8" fill={C.extension.fill} stroke={C.extension.stroke} strokeWidth="3" filter="url(#softShadow)" />
                        <text x="0" y="-30" textAnchor="middle" fill={C.extension.text} fontSize="20" fontWeight="800" letterSpacing="0.5">ATTRIBUTE: EXTENSION</text>
                        <text x="0" y="0" textAnchor="middle" fill={C.extension.text} fontSize="16" fontWeight="500">Infinite • Eternal • Conceived through itself</text>
                        <text x="0" y="30" textAnchor="middle" fill={C.extension.text} fontSize="16" fontWeight="400" fontStyle="italic">All physical phenomena</text>
                    </InteractiveGroup>

                    <InteractiveGroup transform={`translate(350, ${Y_IMMEDIATE})`} onClick={() => handleNodeClick("Infinite Immediate Mode", "Infinite Intellect")}>
                        <rect x="-160" y="-45" width="320" height="90" rx="8" fill={C.white} stroke={C.thought.stroke} strokeWidth="2" strokeDasharray="8,5" />
                        <text x="0" y="-10" textAnchor="middle" fill={C.thought.text} fontSize="16" fontWeight="800">Infinite Immediate Mode</text>
                        <text x="0" y="18" textAnchor="middle" fill={C.text.secondary} fontSize="16" fontWeight="400" fontStyle="italic">(Infinite Intellect)</text>
                    </InteractiveGroup>

                    <InteractiveGroup transform={`translate(1250, ${Y_IMMEDIATE})`} onClick={() => handleNodeClick("Infinite Immediate Mode", "Motion & Rest")}>
                        <rect x="-160" y="-45" width="320" height="90" rx="8" fill={C.white} stroke={C.extension.stroke} strokeWidth="2" strokeDasharray="8,5" />
                        <text x="0" y="-10" textAnchor="middle" fill={C.extension.text} fontSize="16" fontWeight="800">Infinite Immediate Mode</text>
                        <text x="0" y="18" textAnchor="middle" fill={C.text.secondary} fontSize="16" fontWeight="400" fontStyle="italic">(Motion & Rest)</text>
                    </InteractiveGroup>

                    <InteractiveGroup transform={`translate(350, ${Y_MEDIATE})`} onClick={() => handleNodeClick("Infinite Mediate Mode", "Chains of Ideas")}>
                        <rect x="-160" y="-45" width="320" height="90" rx="8" fill={C.white} stroke={C.thought.stroke} strokeWidth="2" strokeDasharray="8,5" />
                        <text x="0" y="-10" textAnchor="middle" fill={C.thought.text} fontSize="16" fontWeight="800">Infinite Mediate Modes</text>
                        <text x="0" y="18" textAnchor="middle" fill={C.text.secondary} fontSize="16" fontWeight="400" fontStyle="italic">(Chains of Ideas)</text>
                    </InteractiveGroup>

                    <InteractiveGroup transform={`translate(1250, ${Y_MEDIATE})`} onClick={() => handleNodeClick("Infinite Mediate Mode", "Face of Universe")}>
                        <rect x="-160" y="-45" width="320" height="90" rx="8" fill={C.white} stroke={C.extension.stroke} strokeWidth="2" strokeDasharray="8,5" />
                        <text x="0" y="-10" textAnchor="middle" fill={C.extension.text} fontSize="16" fontWeight="800">Infinite Mediate Modes</text>
                        <text x="0" y="18" textAnchor="middle" fill={C.text.secondary} fontSize="16" fontWeight="400" fontStyle="italic">(Face of Universe)</text>
                    </InteractiveGroup>

                    <InteractiveGroup transform={`translate(350, ${Y_FINITE})`} onClick={() => handleNodeClick("Finite Modes: Mind", "Singular Ideas")}>
                        <rect x="-180" y="-80" width="360" height="160" rx="8" fill={C.white} stroke={C.thought.stroke} strokeWidth="3" />
                        <text x="0" y="-40" textAnchor="middle" fill={C.thought.text} fontSize="20" fontWeight="800" letterSpacing="1">FINITE MODES</text>
                        <text x="0" y="-5" textAnchor="middle" fill={C.text.primary} fontSize="16" fontWeight="600">Individual minds • Ideas</text>
                        <text x="0" y="25" textAnchor="middle" fill={C.thought.text} fontSize="16" fontWeight="500">Beliefs • Desires • Emotions</text>
                        <g transform="translate(0, 120)">
                            <rect x="-140" y="-25" width="280" height="50" rx="6" fill={C.thought.fill} stroke={C.thought.stroke} strokeWidth="2" />
                            <text x="0" y="0" textAnchor="middle" fill={C.thought.text} fontSize="14" fontWeight="800">HUMAN MIND</text>
                            <text x="0" y="18" textAnchor="middle" fill={C.thought.text} fontSize="15" fontStyle="italic">= idea of body (IIP13)</text>
                            <circle cx="140" cy="0" r="5" fill={C.thought.stroke} />
                        </g>
                    </InteractiveGroup>

                    <InteractiveGroup transform={`translate(1250, ${Y_FINITE})`} onClick={() => handleNodeClick("Finite Modes: Body", "Singular Bodies")}>
                        <rect x="-180" y="-90" width="360" height="160" rx="8" fill={C.white} stroke={C.extension.stroke} strokeWidth="3" />
                        <text x="0" y="-40" textAnchor="middle" fill={C.extension.text} fontSize="20" fontWeight="800" letterSpacing="1">FINITE MODES</text>
                        <text x="0" y="-5" textAnchor="middle" fill={C.text.primary} fontSize="16" fontWeight="600">Individual bodies • Objects</text>
                        <text x="0" y="25" textAnchor="middle" fill={C.extension.text} fontSize="16" fontWeight="500">Physical states • Movements</text>
                        <g transform="translate(0, 120)">
                            <rect x="-140" y="-25" width="280" height="50" rx="6" fill={C.extension.fill} stroke={C.extension.stroke} strokeWidth="2" />
                            <text x="0" y="0" textAnchor="middle" fill={C.extension.text} fontSize="14" fontWeight="800">HUMAN BODY</text>
                            <text x="0" y="18" textAnchor="middle" fill={C.extension.text} fontSize="15" fontStyle="italic">= complex individual</text>
                            <circle cx="-140" cy="0" r="5" fill={C.extension.stroke} />
                        </g>
                    </InteractiveGroup>

                    <g transform={`translate(800, ${Y_FINITE + 120})`}>
                        <line x1="-310" y1="0" x2="310" y2="0" stroke={C.parallelism.stroke} strokeWidth="2" />
                        <rect x="-120" y="-20" width="240" height="40" rx="20" fill={C.parallelism.fill} stroke={C.parallelism.stroke} strokeWidth="1.5" />
                        <text x="0" y="5" textAnchor="middle" fill={C.parallelism.text} fontSize="17" fontWeight="700">PARALLELISM (IIP7)</text>
                        <text x="0" y="34" textAnchor="middle" fill={C.parallelism.text} fontSize="15" fontStyle="italic">One thing expressed in two ways</text>
                    </g>

                    <text x="800" y={CANVAS_HEIGHT - 24} textAnchor="middle" fill={C.text.muted} fontSize="16" fontWeight="600">
                        IP14: Besides God, no substance • IP15: Whatever is, is in God • IIP7: Order of ideas = Order of things
                    </text>

                </svg>
            </div>
        </div>
    );
};

export default HierarchyDiagram;
