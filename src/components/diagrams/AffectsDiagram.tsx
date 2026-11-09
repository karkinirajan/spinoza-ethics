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

const AffectsDiagram = (): React.JSX.Element => {
    const { explainConcept } = useSpinoza();
    const C = useThemeColors();

    const handleNodeClick = (title: string, context: string): void => {
        explainConcept(title, context);
    };

    const CANVAS_WIDTH = 1100;
    const CANVAS_HEIGHT = 800;

    return (
        <div className="w-full min-h-screen relative font-sans overflow-hidden border-bt-xl border-tr-xl" style={{ backgroundColor: C.bg }}>
            <div className="absolute top-4 left-8 z-10 pointer-events-none">
                <h2 className="text-[var(--text-muted)] text-sm font-semibold tracking-widest uppercase mb-1.5">
                    Ethica: De Affectibus
                </h2>
                <h3 className="text-[var(--text-muted)] text-xs font-medium tracking-wider uppercase opacity-60">
                    / From Bondage to Freedom
                </h3>
            </div>

            <div className="w-full max-w-[1600px] mx-auto aspect-11/8 relative px-4">
                <svg aria-labelledby="affects-title" role="img" viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full">
                    <title id="affects-title">Affects and emotions diagram</title>
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
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

                        <linearGradient id="gradConatus" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.thought.fill} />
                            <stop offset="100%" stopColor={C.thought.fill} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="gradBondage" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.bondage.fill} />
                            <stop offset="100%" stopColor={C.bondage.fill} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="gradFreedom" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.freedom.fill} />
                            <stop offset="100%" stopColor={C.freedom.fill} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="gradTransform" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={C.substance.stroke} />
                            <stop offset="100%" stopColor={C.substance.stroke} stopOpacity="0.8" />
                        </linearGradient>

                        <marker id="arrowBondage" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">
                            <path d="M0,0 L5,1.5 L0,3 L0,0" fill={C.bondage.stroke} />
                        </marker>
                        <marker id="arrowFreedom" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">
                            <path d="M0,0 L5,1.5 L0,3 L0,0" fill={C.freedom.stroke} />
                        </marker>
                        <marker id="arrowPurple" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">
                            <path d="M0,0 L5,1.5 L0,3 L0,0" fill={C.substance.stroke} />
                        </marker>
                    </defs>

                    <rect width="100%" height="100%" fill="url(#grid)" />

                    <text x={CANVAS_WIDTH / 2} y="35" textAnchor="middle" fontSize="20" fontWeight="800" fill={C.text.primary} letterSpacing="0.5">
                        From Bondage to Freedom Through Understanding
                    </text>

                    <InteractiveGroup transform={`translate(${CANVAS_WIDTH / 2}, 100)`} onClick={() => handleNodeClick("Conatus", "Striving to persevere")}>
                        <rect x="-150" y="-50" width="300" height="100" rx="8" fill="url(#gradConatus)" stroke={C.thought.stroke} strokeWidth="3" filter="url(#softShadow)" />
                        <text x="0" y="-5" textAnchor="middle" fontSize="18" fontWeight="800" fill={C.thought.text} letterSpacing="1">CONATUS</text>
                        <text x="0" y="20" textAnchor="middle" fontSize="14" fontWeight="500" fill={C.thought.text}>Striving to persevere = Essence (IIIP7)</text>
                    </InteractiveGroup>

                    <path d={`M ${CANVAS_WIDTH / 2 - 100} 120 Q 270 160 270 260`} stroke={C.bondage.stroke} strokeWidth="2" fill="none" strokeDasharray="5,5" />
                    <path d={`M ${CANVAS_WIDTH / 2 + 100} 120 Q 830 160 830 260`} stroke={C.freedom.stroke} strokeWidth="2" fill="none" strokeDasharray="5,5" />

                    <g transform="translate(70, 200)">
                        <rect width="400" height="500" rx="8" fill={C.bondage.fill} stroke={C.bondage.stroke} strokeWidth="2" fillOpacity="0.1" />
                        <text x="200" y="35" textAnchor="middle" fontSize="18" fontWeight="800" fill={C.bondage.text} letterSpacing="1">
                            PATH OF BONDAGE
                        </text>

                        <InteractiveGroup transform="translate(50, 60)" onClick={() => handleNodeClick("Inadequate Ideas", "Confused perception")}>
                            <rect width="300" height="80" rx="8" fill={C.white} stroke={C.bondage.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="150" y="25" textAnchor="middle" fontSize="15" fontWeight="800" fill={C.bondage.text}>
                                INADEQUATE IDEAS
                            </text>
                            <text x="150" y="45" textAnchor="middle" fontSize="12" fill={C.text.secondary} fontWeight="500">
                                Confused • Partial • From external causes
                            </text>
                            <text x="150" y="62" textAnchor="middle" fontSize="11" fill={C.text.muted} fontStyle="italic">
                                First kind of knowledge (imagination)
                            </text>
                        </InteractiveGroup>

                        <path d="M 200 140 L 200 170" stroke={C.bondage.stroke} strokeWidth="2" markerEnd="url(#arrowBondage)" />

                        <InteractiveGroup transform="translate(50, 170)" onClick={() => handleNodeClick("Passive Affects", "Passions")}>
                            <rect width="300" height="140" rx="8" fill={C.white} stroke={C.bondage.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="150" y="25" textAnchor="middle" fontSize="15" fontWeight="800" fill={C.bondage.text}>
                                PASSIVE AFFECTS
                            </text>
                            <text x="150" y="45" textAnchor="middle" fontSize="13" fill={C.text.secondary} fontWeight="600">
                                (Passions)
                            </text>
                            <text x="150" y="65" textAnchor="middle" fontSize="12" fill={C.text.secondary}>
                                • Joy from external causes
                            </text>
                            <text x="150" y="82" textAnchor="middle" fontSize="12" fill={C.text.secondary}>
                                • Sadness from external causes
                            </text>
                            <text x="150" y="99" textAnchor="middle" fontSize="12" fill={C.text.secondary}>
                                • Desire from imagination
                            </text>
                            <text x="150" y="120" textAnchor="middle" fontSize="11" fill={C.text.muted} fontStyle="italic">
                                Love, Hate, Hope, Fear, Anger...
                            </text>
                        </InteractiveGroup>

                        <path d="M 200 310 L 200 340" stroke={C.bondage.stroke} strokeWidth="2" markerEnd="url(#arrowBondage)" />

                        <InteractiveGroup transform="translate(50, 340)" onClick={() => handleNodeClick("Bondage", "Human impotence")}>
                            <rect width="300" height="140" rx="8" fill="url(#gradBondage)" stroke={C.bondage.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="150" y="25" textAnchor="middle" fontSize="16" fontWeight="800" fill={C.bondage.text} letterSpacing="1">
                                BONDAGE
                            </text>
                            <text x="150" y="50" textAnchor="middle" fontSize="12" fill={C.bondage.text} fontWeight="600">
                                • Determined by external causes
                            </text>
                            <text x="150" y="68" textAnchor="middle" fontSize="12" fill={C.bondage.text} fontWeight="600">
                                • Fluctuating emotions
                            </text>
                            <text x="150" y="86" textAnchor="middle" fontSize="12" fill={C.bondage.text} fontWeight="600">
                                • See better, do worse (IVPreface)
                            </text>
                            <text x="150" y="104" textAnchor="middle" fontSize="12" fill={C.bondage.text} fontWeight="600">
                                • Slavery to transient goods
                            </text>
                            <text x="150" y="122" textAnchor="middle" fontSize="12" fill={C.bondage.text} fontWeight="600">
                                • Suffering & conflict
                            </text>
                        </InteractiveGroup>
                    </g>

                    <g transform="translate(630, 200)">
                        <rect width="400" height="500" rx="8" fill={C.freedom.fill} stroke={C.freedom.stroke} strokeWidth="2" fillOpacity="0.1" />
                        <text x="200" y="35" textAnchor="middle" fontSize="18" fontWeight="800" fill={C.freedom.text} letterSpacing="1">
                            PATH OF FREEDOM
                        </text>

                        <InteractiveGroup transform="translate(50, 60)" onClick={() => handleNodeClick("Adequate Ideas", "Clear and distinct")}>
                            <rect width="300" height="80" rx="8" fill={C.white} stroke={C.freedom.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="150" y="25" textAnchor="middle" fontSize="15" fontWeight="800" fill={C.freedom.text}>
                                ADEQUATE IDEAS
                            </text>
                            <text x="150" y="45" textAnchor="middle" fontSize="12" fill={C.text.secondary} fontWeight="500">
                                Clear & distinct • Complete • From our nature
                            </text>
                            <text x="150" y="62" textAnchor="middle" fontSize="11" fill={C.text.muted} fontStyle="italic">
                                Second & third kinds of knowledge
                            </text>
                        </InteractiveGroup>

                        <path d="M 200 140 L 200 170" stroke={C.freedom.stroke} strokeWidth="2" markerEnd="url(#arrowFreedom)" />

                        <InteractiveGroup transform="translate(50, 170)" onClick={() => handleNodeClick("Active Affects", "Actions")}>
                            <rect width="300" height="140" rx="8" fill={C.white} stroke={C.freedom.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="150" y="25" textAnchor="middle" fontSize="15" fontWeight="800" fill={C.freedom.text}>
                                ACTIVE AFFECTS
                            </text>
                            <text x="150" y="45" textAnchor="middle" fontSize="13" fill={C.text.secondary} fontWeight="600">
                                (Actions)
                            </text>
                            <text x="150" y="65" textAnchor="middle" fontSize="12" fill={C.text.secondary}>
                                • Active joy from understanding
                            </text>
                            <text x="150" y="82" textAnchor="middle" fontSize="12" fill={C.text.secondary}>
                                • Active desire from reason
                            </text>
                            <text x="150" y="99" textAnchor="middle" fontSize="12" fill={C.text.secondary}>
                                • Tenacity & Nobility (IIIP59)
                            </text>
                            <text x="150" y="120" textAnchor="middle" fontSize="11" fill={C.text.muted} fontStyle="italic">
                                Intellectual love, Self-esteem...
                            </text>
                        </InteractiveGroup>

                        <path d="M 200 310 L 200 340" stroke={C.freedom.stroke} strokeWidth="2" markerEnd="url(#arrowFreedom)" />

                        <InteractiveGroup transform="translate(50, 340)" onClick={() => handleNodeClick("Freedom", "Human Freedom")}>
                            <rect width="300" height="140" rx="8" fill="url(#gradFreedom)" stroke={C.freedom.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="150" y="25" textAnchor="middle" fontSize="16" fontWeight="800" fill={C.freedom.text} letterSpacing="1">
                                FREEDOM
                            </text>
                            <text x="150" y="50" textAnchor="middle" fontSize="12" fill={C.freedom.text} fontWeight="600">
                                • Self-determined through knowledge
                            </text>
                            <text x="150" y="68" textAnchor="middle" fontSize="12" fill={C.freedom.text} fontWeight="600">
                                • Stable emotions
                            </text>
                            <text x="150" y="86" textAnchor="middle" fontSize="12" fill={C.freedom.text} fontWeight="600">
                                • Virtue = Power (IVd8)
                            </text>
                            <text x="150" y="104" textAnchor="middle" fontSize="12" fill={C.freedom.text} fontWeight="600">
                                • Love of eternal goods
                            </text>
                            <text x="150" y="122" textAnchor="middle" fontSize="12" fill={C.freedom.text} fontWeight="600">
                                • Blessedness & peace
                            </text>
                        </InteractiveGroup>
                    </g>

                    <g transform="translate(470, 410)">
                        <path d="M 0 40 L 160 40" stroke={C.substance.stroke} strokeWidth="2" markerEnd="url(#arrowPurple)" strokeDasharray="10,5" />
                        <InteractiveGroup transform="translate(0, 0)" onClick={() => handleNodeClick("Transformation", "Understanding affects")}>
                            <rect width="160" height="80" rx="8" fill="url(#gradTransform)" filter="url(#softShadow)" />
                            <text x="80" y="25" textAnchor="middle" fontSize="12" fontWeight="800" fill="white" letterSpacing="0.5">
                                TRANSFORMATION
                            </text>
                            <text x="80" y="45" textAnchor="middle" fontSize="10" fill="white" fontWeight="500">
                                VP3: Clear idea of affect
                            </text>
                            <text x="80" y="60" textAnchor="middle" fontSize="10" fill="white" fontWeight="500">
                                transforms passion → action
                            </text>
                        </InteractiveGroup>
                    </g>

                    <g transform="translate(150, 740)">
                        <rect width="800" height="45" rx="8" fill={C.surface} stroke={C.layer.stroke} strokeWidth="1.5" />
                        <text x="400" y="28" textAnchor="middle" fontSize="12" fill={C.text.secondary} fontWeight="600">
                            Both paths are determined. Freedom ≠ Indetermination, but Self-Determination through Knowledge.
                        </text>
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default AffectsDiagram;
