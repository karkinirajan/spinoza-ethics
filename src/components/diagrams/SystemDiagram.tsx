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

const SystemDiagram = (): React.JSX.Element => {
    const { explainConcept } = useSpinoza();
    const C = useThemeColors();

    const handleNodeClick = (title: string, context: string): void => {
        explainConcept(title, context);
    };

    const CANVAS_WIDTH = 1400;
    const CANVAS_HEIGHT = 1200;

    return (
        <div className="w-full min-h-screen relative font-sans overflow-hidden border-bt-xl border-tr-xl" style={{ backgroundColor: C.bg }}>
            <div className="absolute top-4 left-8 z-10 pointer-events-none">
                <h2 className="text-[var(--text-muted)] text-sm font-semibold tracking-widest uppercase mb-1.5">
                    Ethica Ordine Geometrico Demonstrata
                </h2>
                <h3 className="text-[var(--text-muted)] text-xs font-medium tracking-wider uppercase opacity-60">
                    / The Complete System
                </h3>
            </div>

            <div className="w-full max-w-[1600px] mx-auto aspect-14/12 relative px-4">
                <svg aria-labelledby="system-title" role="img" viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full font-sans">
                    <title id="system-title">Complete system diagram of Spinoza&apos;s Ethics</title>
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

                        <linearGradient id="gradMeta" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.surface} />
                            <stop offset="100%" stopColor={C.surface} stopOpacity="0.8" />
                        </linearGradient>
                        <linearGradient id="gradEpist" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.surface} />
                            <stop offset="100%" stopColor={C.surface} stopOpacity="0.8" />
                        </linearGradient>
                        <linearGradient id="gradPsych" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.surface} />
                            <stop offset="100%" stopColor={C.surface} stopOpacity="0.8" />
                        </linearGradient>
                        <linearGradient id="gradBondagePath" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.bondage.fill} />
                            <stop offset="100%" stopColor={C.bondage.fill} stopOpacity="0.5" />
                        </linearGradient>
                        <linearGradient id="gradFreedomPath" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.freedom.fill} />
                            <stop offset="100%" stopColor={C.freedom.fill} stopOpacity="0.5" />
                        </linearGradient>

                        <linearGradient id="gradNodeSubstance" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.substance.fill} />
                            <stop offset="100%" stopColor={C.substance.fill} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="gradNodeMind" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.thought.fill} />
                            <stop offset="100%" stopColor={C.thought.fill} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="gradNodeExtension" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.extension.fill} />
                            <stop offset="100%" stopColor={C.extension.fill} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="gradNodeBondage" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.bondage.fill} />
                            <stop offset="100%" stopColor={C.bondage.fill} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="gradNodeFreedom" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.freedom.fill} />
                            <stop offset="100%" stopColor={C.freedom.fill} stopOpacity="0.7" />
                        </linearGradient>

                        <marker id="arrow" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">
                            <path d="M0,0 L5,1.5 L0,3 L0,0" fill={C.text.muted} />
                        </marker>
                        <marker id="arrowRed" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">
                            <path d="M0,0 L5,1.5 L0,3 L0,0" fill={C.bondage.stroke} />
                        </marker>
                        <marker id="arrowGreen" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">
                            <path d="M0,0 L5,1.5 L0,3 L0,0" fill={C.freedom.stroke} />
                        </marker>
                        <marker id="arrowPurple" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">
                            <path d="M0,0 L5,1.5 L0,3 L0,0" fill={C.substance.stroke} />
                        </marker>
                        <marker id="arrowBondage" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">
                            <path d="M0,0 L5,1.5 L0,3 L0,0" fill={C.bondage.stroke} />
                        </marker>
                        <marker id="arrowFreedom" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">
                            <path d="M0,0 L5,1.5 L0,3 L0,0" fill={C.freedom.stroke} />
                        </marker>
                    </defs>

                    <text x={CANVAS_WIDTH / 2} y="50" textAnchor="middle" dominantBaseline="middle" fontSize="28" fontWeight="800" fill={C.text.primary} letterSpacing="0.5">
                        The Complete System of Spinoza&apos;s Ethics
                    </text>

                    <g transform="translate(50, 100)">
                        <rect width="1300" height="160" rx="12" fill="url(#gradMeta)" stroke={C.layer.stroke} strokeWidth="1" />
                        <text x="40" y="35" fontSize="16" fontWeight="800" fill={C.layer.text} letterSpacing="1">METAPHYSICS</text>

                        <InteractiveGroup transform="translate(200, 45)" onClick={() => handleNodeClick("Substance", "God or Nature")}>
                            <rect x="0" y="0" width="240" height="100" rx="8" fill="url(#gradNodeSubstance)" stroke={C.substance.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="120" y="40" textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight="800" fill={C.substance.text} letterSpacing="1">SUBSTANCE</text>
                            <text x="120" y="70" textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="600" fill={C.substance.text}>One God/Nature</text>
                        </InteractiveGroup>

                        <InteractiveGroup transform="translate(500, 45)" onClick={() => handleNodeClick("Attribute of Thought", "Infinite Intellect")}>
                            <rect width="200" height="80" rx="8" fill="url(#gradNodeMind)" stroke={C.thought.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="100" y="35" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="800" fill={C.thought.text}>Thought</text>
                            <text x="100" y="55" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="600" fill={C.thought.text}>Attribute</text>
                        </InteractiveGroup>

                        <InteractiveGroup transform="translate(750, 45)" onClick={() => handleNodeClick("Attribute of Extension", "Infinite Extension")}>
                            <rect width="200" height="80" rx="8" fill="url(#gradNodeExtension)" stroke={C.extension.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="100" y="35" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="800" fill={C.extension.text}>Extension</text>
                            <text x="100" y="55" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="600" fill={C.extension.text}>Attribute</text>
                        </InteractiveGroup>

                        <g transform="translate(1000, 45)" opacity="0.6">
                            <rect width="200" height="80" rx="8" fill={C.surface} stroke={C.text.muted} strokeWidth="2" strokeDasharray="4,4" />
                            <text x="100" y="35" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="700" fill={C.text.secondary}>∞ Others</text>
                            <text x="100" y="55" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="500" fill={C.text.muted}>Unknown</text>
                        </g>

                        <text x="1280" y="35" textAnchor="end" fontSize="12" fontWeight="600" fill={C.text.muted} opacity="0.8">IP14, IP15, IP29</text>
                    </g>

                    <g transform="translate(50, 290)">
                        <rect width="1300" height="150" rx="12" fill="url(#gradEpist)" stroke={C.layer.stroke} strokeWidth="1" />
                        <text x="40" y="35" fontSize="16" fontWeight="800" fill={C.layer.text} letterSpacing="1">EPISTEMOLOGY</text>

                        <InteractiveGroup transform="translate(150, 45)" onClick={() => handleNodeClick("Imagination", "First Kind of Knowledge")}>
                            <rect width="320" height="80" rx="8" fill="url(#gradNodeBondage)" stroke={C.bondage.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="160" y="30" textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="800" fill={C.bondage.text}>1st Kind: IMAGINATION</text>
                            <text x="160" y="55" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="600" fill={C.bondage.text}>Inadequate • Confused • Error</text>
                        </InteractiveGroup>

                        <InteractiveGroup transform="translate(520, 45)" onClick={() => handleNodeClick("Reason", "Second Kind of Knowledge")}>
                            <rect width="320" height="80" rx="8" fill="url(#gradNodeMind)" stroke={C.thought.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="160" y="30" textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="800" fill={C.thought.text}>2nd Kind: REASON</text>
                            <text x="160" y="55" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="600" fill={C.thought.text}>Adequate • Common notions</text>
                        </InteractiveGroup>

                        <InteractiveGroup transform="translate(890, 45)" onClick={() => handleNodeClick("Intuition", "Third Kind of Knowledge")}>
                            <rect width="320" height="80" rx="8" fill="url(#gradNodeFreedom)" stroke={C.freedom.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="160" y="30" textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="800" fill={C.freedom.text}>3rd Kind: INTUITION</text>
                            <text x="160" y="55" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="600" fill={C.freedom.text}>Adequate • Essence grasp</text>
                        </InteractiveGroup>
                    </g>

                    <g transform="translate(50, 470)">
                        <rect width="1300" height="200" rx="12" fill="url(#gradPsych)" stroke={C.layer.stroke} strokeWidth="1" />
                        <text x="40" y="35" fontSize="16" fontWeight="800" fill={C.layer.text} letterSpacing="1">PSYCHOLOGY</text>

                        <InteractiveGroup transform="translate(150, 55)" onClick={() => handleNodeClick("Conatus", "Striving to persevere")}>
                            <rect x="0" y="0" width="220" height="90" rx="8" fill="url(#gradNodeSubstance)" stroke={C.substance.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="110" y="35" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="800" fill={C.substance.text}>CONATUS</text>
                            <text x="110" y="60" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="600" fill={C.substance.text}>Essence</text>
                        </InteractiveGroup>

                        <InteractiveGroup transform="translate(450, 45)" onClick={() => handleNodeClick("Passive Affects", "Passions")}>
                            <rect width="340" height="110" rx="8" fill="url(#gradNodeBondage)" stroke={C.bondage.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="170" y="25" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="800" fill={C.bondage.text}>PASSIVE AFFECTS</text>
                            <text x="170" y="48" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="600" fill={C.bondage.text}>From inadequate ideas</text>
                            <text x="170" y="68" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="500" fill={C.bondage.text}>Joy, Sadness, Desire + derivatives</text>
                            <text x="170" y="90" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="800" fill={C.bondage.text}>→ BONDAGE</text>
                        </InteractiveGroup>

                        <InteractiveGroup transform="translate(850, 45)" onClick={() => handleNodeClick("Active Affects", "Actions")}>
                            <rect width="340" height="110" rx="8" fill="url(#gradNodeFreedom)" stroke={C.freedom.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="170" y="25" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="800" fill={C.freedom.text}>ACTIVE AFFECTS</text>
                            <text x="170" y="48" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="600" fill={C.freedom.text}>From adequate ideas</text>
                            <text x="170" y="68" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="500" fill={C.freedom.text}>Active joy, Active desire</text>
                            <text x="170" y="90" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="800" fill={C.freedom.text}>→ FREEDOM</text>
                        </InteractiveGroup>

                        <path d="M 370 100 L 450 100" stroke={C.bondage.stroke} strokeWidth="2" markerEnd="url(#arrowBondage)" />
                        <path d="M 370 100 C 400 100, 400 180, 620 180 C 820 180, 820 100, 850 100" stroke={C.freedom.stroke} strokeWidth="2" fill="none" markerEnd="url(#arrowFreedom)" />
                    </g>

                    <g transform="translate(50, 700)">
                        <rect width="550" height="420" rx="12" fill="url(#gradBondagePath)" stroke={C.bondage.stroke} strokeWidth="1" />
                        <text x="40" y="35" fontSize="16" fontWeight="800" fill={C.bondage.text} letterSpacing="1">BONDAGE PATH</text>

                        <InteractiveGroup transform="translate(55, 60)" onClick={() => handleNodeClick("Inadequate Ideas", "Confused perception")}>
                            <rect width="440" height="75" rx="8" fill={C.white} stroke={C.bondage.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="220" y="28" textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="800" fill={C.bondage.text}>Inadequate Ideas</text>
                            <text x="220" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="500" fill={C.text.secondary}>Confused perception • External causes</text>
                        </InteractiveGroup>

                        <path d="M 275 135 L 275 160" stroke={C.bondage.stroke} strokeWidth="2" markerEnd="url(#arrowBondage)" />

                        <InteractiveGroup transform="translate(55, 165)" onClick={() => handleNodeClick("Passions", "Fluctuating emotions")}>
                            <rect width="440" height="75" rx="8" fill={C.white} stroke={C.bondage.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="220" y="28" textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="800" fill={C.bondage.text}>Passions</text>
                            <text x="220" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="500" fill={C.text.secondary}>Determined by fortune • Fluctuating</text>
                        </InteractiveGroup>

                        <path d="M 275 240 L 275 265" stroke={C.bondage.stroke} strokeWidth="2" markerEnd="url(#arrowBondage)" />

                        <InteractiveGroup transform="translate(55, 270)" onClick={() => handleNodeClick("Bondage", "Human impotence")}>
                            <rect width="440" height="110" rx="8" fill="url(#gradNodeBondage)" stroke={C.bondage.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="220" y="30" textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight="800" fill={C.bondage.text}>BONDAGE</text>
                            <text x="220" y="55" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="600" fill={C.bondage.text}>Weakness • See better, do worse</text>
                            <text x="220" y="73" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="600" fill={C.bondage.text}>Slavery to transient goods</text>
                            <text x="220" y="91" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="600" fill={C.bondage.text}>Suffering • Conflict</text>
                        </InteractiveGroup>
                    </g>

                    <g transform="translate(800, 700)">
                        <rect width="550" height="420" rx="12" fill="url(#gradFreedomPath)" stroke={C.freedom.stroke} strokeWidth="1" />
                        <text x="40" y="35" fontSize="16" fontWeight="800" fill={C.freedom.text} letterSpacing="1">LIBERATION PATH</text>

                        <InteractiveGroup transform="translate(55, 60)" onClick={() => handleNodeClick("Adequate Ideas", "Clear and distinct")}>
                            <rect width="440" height="75" rx="8" fill={C.white} stroke={C.freedom.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="220" y="28" textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="800" fill={C.freedom.text}>Adequate Ideas</text>
                            <text x="220" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="500" fill={C.text.secondary}>Clear & distinct • From our nature</text>
                        </InteractiveGroup>

                        <path d="M 275 135 L 275 160" stroke={C.freedom.stroke} strokeWidth="2" markerEnd="url(#arrowFreedom)" />

                        <InteractiveGroup transform="translate(55, 165)" onClick={() => handleNodeClick("Actions", "Self-determined")}>
                            <rect width="440" height="75" rx="8" fill={C.white} stroke={C.freedom.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="220" y="28" textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="800" fill={C.freedom.text}>Actions</text>
                            <text x="220" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="500" fill={C.text.secondary}>Self-determined • Stable emotions</text>
                        </InteractiveGroup>

                        <path d="M 275 240 L 275 265" stroke={C.freedom.stroke} strokeWidth="2" markerEnd="url(#arrowFreedom)" />

                        <InteractiveGroup transform="translate(55, 270)" onClick={() => handleNodeClick("Virtue", "Power of acting")}>
                            <rect width="440" height="75" rx="8" fill="url(#gradNodeFreedom)" stroke={C.freedom.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="220" y="28" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="800" fill={C.freedom.text}>VIRTUE = POWER</text>
                            <text x="220" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="600" fill={C.freedom.text}>Acting from reason • Self-determination</text>
                        </InteractiveGroup>

                        <path d="M 275 345 L 275 360" stroke={C.freedom.stroke} strokeWidth="2" markerEnd="url(#arrowFreedom)" />

                        <InteractiveGroup transform="translate(135, 360)" onClick={() => handleNodeClick("Blessedness", "Virtue itself")}>
                            <rect x="0" y="0" width="280" height="40" rx="8" fill={C.bliss.fill} stroke={C.freedom.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="140" y="20" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="800" fill={C.bliss.text}>BLESSEDNESS</text>
                        </InteractiveGroup>
                    </g>

                    <g transform="translate(700, 890)">
                        <path d="M -60 0 L 60 0" stroke={C.substance.stroke} strokeWidth="4" markerEnd="url(#arrow)" />
                        <InteractiveGroup transform="translate(-70, -35)" onClick={() => handleNodeClick("Transformation", "Understanding affects")}>
                            <rect width="140" height="70" rx="8" fill="url(#gradNodeSubstance)" stroke={C.substance.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="70" y="28" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="800" fill={C.substance.text}>TRANSFORM</text>
                            <text x="70" y="48" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="600" fill={C.substance.text}>Understanding</text>
                        </InteractiveGroup>
                    </g>

                    <g opacity="0.4" style={{ pointerEvents: 'none' }}>
                        <path d="M 600 125 L 680 290" stroke={C.thought.stroke} strokeWidth="2" strokeDasharray="6,6" />
                        <path d="M 680 370 L 620 470" stroke={C.bondage.stroke} strokeWidth="2" strokeDasharray="6,6" />
                        <path d="M 1050 370 L 1020 470" stroke={C.freedom.stroke} strokeWidth="2" strokeDasharray="6,6" />
                    </g>

                    <g transform="translate(150, 1140)">
                        <rect width="550" height="40" rx="8" fill={C.white} stroke={C.layer.stroke} strokeWidth="1" />
                        <text x="275" y="20" textAnchor="middle" dominantBaseline="middle" fontSize="12" fill={C.text.secondary} fontWeight="600">
                            Everything in God → Mind = Idea of Body → Conatus → Affects → Bondage or Freedom
                        </text>
                    </g>

                    <g transform="translate(720, 1140)">
                        <rect width="530" height="40" rx="8" fill={C.white} stroke={C.layer.stroke} strokeWidth="1" />
                        <text x="265" y="20" textAnchor="middle" dominantBaseline="middle" fontSize="12" fill={C.text.secondary} fontWeight="600">
                            Freedom through Knowledge → Blessedness = Virtue itself (VP42)
                        </text>
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default SystemDiagram;
