import React from 'react';
import { useSpinoza } from '@/context/SpinozaContext';
import { useThemeColors } from '@/hooks/useThemeColors';

const InteractiveGroup = ({
    children,
    onClick,
    className = "cursor-pointer transition-all duration-300 hover:opacity-80",
    transform
}: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    transform?: string;
}): React.JSX.Element => (
    <g
        onClick={onClick}
        className={className}
        transform={transform}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                onClick?.();
            }
        }}
    >
        {children}
    </g>
);

const PowerDiagram = (): React.JSX.Element => {
    const { explainConcept } = useSpinoza();
    const C = useThemeColors();

    const handleNodeClick = (title: string, context: string): void => {
        explainConcept(title, context);
    };

    const CANVAS_WIDTH = 1200;
    const CANVAS_HEIGHT = 1000;

    return (
        <div className="w-full min-h-screen relative font-sans overflow-hidden border-bt-xl border-tr-xl" style={{ backgroundColor: C.bg }}>
            <div className="absolute top-4 left-8 z-10 pointer-events-none">
                <h2 className="text-[var(--text-muted)] text-sm font-semibold tracking-widest uppercase mb-1.5">
                    Ethica: Potentia et Virtus
                </h2>
                <h3 className="text-[var(--text-muted)] text-xs font-medium tracking-wider uppercase opacity-60">
                    / The Dynamics of Human Power
                </h3>
            </div>

            <div className="w-full max-w-[1600px] mx-auto aspect-12/10 relative px-4">
                <svg aria-labelledby="power-title" role="img" viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full">
                    <title id="power-title">Power and virtue diagram</title>
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

                        <linearGradient id="gradPower" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.substance.fill} />
                            <stop offset="100%" stopColor={C.substance.fill} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="gradConatus" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.thought.fill} />
                            <stop offset="100%" stopColor={C.thought.fill} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="gradAffects" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.extension.fill} />
                            <stop offset="100%" stopColor={C.extension.fill} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="gradJoy" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.freedom.fill} />
                            <stop offset="100%" stopColor={C.freedom.fill} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="gradSadness" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.bondage.fill} />
                            <stop offset="100%" stopColor={C.bondage.fill} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="gradKnowledge" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.thought.fill} />
                            <stop offset="100%" stopColor={C.thought.fill} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="gradInadequate" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.bondage.fill} />
                            <stop offset="100%" stopColor={C.bondage.fill} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="gradReason" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.reason.fill} />
                            <stop offset="100%" stopColor={C.reason.fill} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="gradIntuition" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.freedom.fill} />
                            <stop offset="100%" stopColor={C.freedom.fill} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="gradVirtue" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.freedom.fill} />
                            <stop offset="100%" stopColor={C.freedom.fill} stopOpacity="0.7" />
                        </linearGradient>
                        <linearGradient id="gradBlessedness" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.bliss.fill} />
                            <stop offset="100%" stopColor={C.bliss.fill} stopOpacity="0.8" />
                        </linearGradient>
                        <linearGradient id="gradBox" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={C.surface} />
                            <stop offset="100%" stopColor={C.surface} stopOpacity="0.8" />
                        </linearGradient>

                        <marker id="arrow" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">
                            <path d="M0,0 L5,1.5 L0,3 L0,0" fill={C.text.muted} />
                        </marker>
                        <marker id="arrowVirtue" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">
                            <path d="M0,0 L5,1.5 L0,3 L0,0" fill={C.freedom.stroke} />
                        </marker>
                    </defs>

                    <rect width="100%" height="100%" fill="url(#grid)" />

                    <text x={CANVAS_WIDTH / 2} y="25" textAnchor="middle" fontSize="22" fontWeight="800" fill={C.text.primary} letterSpacing="0.5">
                        From Conatus to Blessedness: The Power Equation
                    </text>

                    <InteractiveGroup transform={`translate(${CANVAS_WIDTH / 2}, 120)`} onClick={() => handleNodeClick("God's Power", "Infinite productive power")}>
                        <rect x="-240" y="-70" width="480" height="140" rx="8" fill="url(#gradPower)" fillOpacity="0.9" stroke={C.substance.stroke} strokeWidth="3" filter="url(#softShadow)" />
                        <text x="0" y="10" textAnchor="middle" fontSize="20" fontWeight="800" letterSpacing="1" fill={C.substance.text}>
                            GOD&apos;S ESSENCE = GOD&apos;S POWER
                        </text>
                        <text x="0" y="35" textAnchor="middle" fontSize="14" fontWeight="600" fontStyle="italic" fill={C.substance.text}>
                            Infinite productive power (IP34)
                        </text>
                    </InteractiveGroup>

                    <path d={`M ${CANVAS_WIDTH / 2} 190 C ${CANVAS_WIDTH / 2} 210, ${CANVAS_WIDTH / 2} 230, ${CANVAS_WIDTH / 2} 250`} stroke={C.substance.stroke} strokeWidth="2" fill="none" opacity="0.8" markerEnd="url(#arrow)" />

                    <InteractiveGroup transform={`translate(${CANVAS_WIDTH / 2}, 250)`} onClick={() => handleNodeClick("Conatus", "Striving to persevere")}>
                        <rect x="-180" y="0" width="360" height="100" rx="8" fill="url(#gradConatus)" stroke={C.thought.stroke} strokeWidth="2" filter="url(#softShadow)" />
                        <text x="0" y="35" textAnchor="middle" fontSize="18" fontWeight="800" letterSpacing="1" fill={C.thought.text}>
                            CONATUS
                        </text>
                        <text x="0" y="57" textAnchor="middle" fontSize="14" fontWeight="600" fill={C.thought.text}>
                            Each thing&apos;s striving = its essence (IIIP7)
                        </text>
                        <text x="0" y="75" textAnchor="middle" fontSize="12" fontWeight="500" fontStyle="italic" fill={C.thought.text}>
                            Finite expression of God&apos;s power
                        </text>
                    </InteractiveGroup>

                    <path d={`M ${CANVAS_WIDTH / 2 - 100} 350 C ${CANVAS_WIDTH / 2 - 100} 380, 300 380, 300 420`} stroke={C.thought.stroke} strokeWidth="2" fill="none" opacity="0.8" markerEnd="url(#arrow)" />
                    <path d={`M ${CANVAS_WIDTH / 2 + 100} 350 C ${CANVAS_WIDTH / 2 + 100} 380, 900 380, 900 420`} stroke={C.thought.stroke} strokeWidth="2" fill="none" opacity="0.8" markerEnd="url(#arrow)" />

                    <g transform="translate(100, 420)">
                        <InteractiveGroup onClick={() => handleNodeClick("Affects", "Transitions in power")}>
                            <rect width="400" height="180" rx="8" fill="url(#gradAffects)" stroke={C.extension.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="200" y="40" textAnchor="middle" fontSize="18" fontWeight="800" letterSpacing="1" fill={C.extension.text}>AFFECTS</text>
                            <text x="200" y="65" textAnchor="middle" fontSize="14" fontWeight="600" fill={C.extension.text}>Transitions in power</text>
                        </InteractiveGroup>

                        <g transform="translate(30, 85)">
                            <rect width="160" height="80" rx="8" fill="url(#gradJoy)" stroke={C.freedom.stroke} strokeWidth="1.5" filter="url(#softShadow)" />
                            <text x="80" y="30" textAnchor="middle" fontSize="14" fontWeight="800" fill={C.freedom.text}>JOY</text>
                            <text x="80" y="48" textAnchor="middle" fontSize="12" fontWeight="600" fill={C.freedom.text}>↑ Power</text>
                            <text x="80" y="62" textAnchor="middle" fontSize="10" fontWeight="500" fill={C.freedom.text}>Greater perfection</text>
                        </g>

                        <g transform="translate(210, 85)">
                            <rect width="160" height="80" rx="8" fill="url(#gradSadness)" stroke={C.bondage.stroke} strokeWidth="1.5" filter="url(#softShadow)" />
                            <text x="80" y="30" textAnchor="middle" fontSize="14" fontWeight="800" fill={C.bondage.text}>SADNESS</text>
                            <text x="80" y="48" textAnchor="middle" fontSize="12" fontWeight="600" fill={C.bondage.text}>↓ Power</text>
                            <text x="80" y="62" textAnchor="middle" fontSize="10" fontWeight="500" fill={C.bondage.text}>Lesser perfection</text>
                        </g>
                    </g>

                    <g transform="translate(700, 420)">
                        <InteractiveGroup onClick={() => handleNodeClick("Knowledge", "Degrees of understanding")}>
                            <rect width="400" height="180" rx="8" fill="url(#gradKnowledge)" stroke={C.thought.stroke} strokeWidth="2" filter="url(#softShadow)" />
                            <text x="200" y="40" textAnchor="middle" fontSize="18" fontWeight="800" letterSpacing="1" fill={C.thought.text}>KNOWLEDGE</text>
                            <text x="200" y="65" textAnchor="middle" fontSize="14" fontWeight="600" fill={C.thought.text}>Degrees of understanding</text>
                        </InteractiveGroup>

                        <g transform="translate(20, 85)">
                            <rect width="110" height="80" rx="8" fill="url(#gradInadequate)" stroke={C.bondage.stroke} strokeWidth="1.5" filter="url(#softShadow)" />
                            <text x="55" y="30" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.bondage.text}>Inadequate</text>
                            <text x="55" y="50" textAnchor="middle" fontSize="10" fontWeight="600" fill={C.bondage.text}>Imagination</text>
                            <text x="55" y="65" textAnchor="middle" fontSize="10" fontWeight="600" fill={C.bondage.text}>↓ Power</text>
                        </g>

                        <g transform="translate(145, 85)">
                            <rect width="110" height="80" rx="8" fill="url(#gradReason)" stroke={C.reason.stroke} strokeWidth="1.5" filter="url(#softShadow)" />
                            <text x="55" y="30" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.reason.text}>Adequate</text>
                            <text x="55" y="50" textAnchor="middle" fontSize="10" fontWeight="600" fill={C.reason.text}>Reason</text>
                            <text x="55" y="65" textAnchor="middle" fontSize="10" fontWeight="600" fill={C.reason.text}>↑ Power</text>
                        </g>

                        <g transform="translate(270, 85)">
                            <rect width="110" height="80" rx="8" fill="url(#gradIntuition)" stroke={C.freedom.stroke} strokeWidth="1.5" filter="url(#softShadow)" />
                            <text x="55" y="30" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.freedom.text}>Adequate</text>
                            <text x="55" y="50" textAnchor="middle" fontSize="10" fontWeight="600" fill={C.freedom.text}>Intuition</text>
                            <text x="55" y="65" textAnchor="middle" fontSize="10" fontWeight="600" fill={C.freedom.text}>↑↑ Power</text>
                        </g>
                    </g>

                    <path d="M 300 600 C 300 640, 500 640, 500 680" stroke={C.freedom.stroke} strokeWidth="2" fill="none" opacity="0.8" markerEnd="url(#arrowVirtue)" />
                    <path d="M 900 600 C 900 640, 700 640, 700 680" stroke={C.freedom.stroke} strokeWidth="2" fill="none" opacity="0.8" markerEnd="url(#arrowVirtue)" />

                    <InteractiveGroup transform={`translate(${CANVAS_WIDTH / 2}, 680)`} onClick={() => handleNodeClick("Virtue", "Power of acting")}>
                        <rect x="-200" y="0" width="400" height="120" rx="8" fill="url(#gradVirtue)" stroke={C.freedom.stroke} strokeWidth="2" filter="url(#softShadow)" />
                        <text x="0" y="40" textAnchor="middle" fontSize="18" fontWeight="800" letterSpacing="1" fill={C.freedom.text}>
                            VIRTUE = POWER
                        </text>
                        <text x="0" y="65" textAnchor="middle" fontSize="14" fontWeight="600" fill={C.freedom.text}>
                            Acting from reason = Self-determination (IVD8)
                        </text>
                        <text x="0" y="85" textAnchor="middle" fontSize="12" fontWeight="500" fontStyle="italic" fill={C.freedom.text}>
                            Maximum capacity to exist and act
                        </text>
                    </InteractiveGroup>

                    <path d={`M ${CANVAS_WIDTH / 2} 800 C ${CANVAS_WIDTH / 2} 820, ${CANVAS_WIDTH / 2} 840, ${CANVAS_WIDTH / 2} 860`} stroke={C.freedom.stroke} strokeWidth="2" fill="none" opacity="0.8" markerEnd="url(#arrowVirtue)" />

                    <InteractiveGroup transform={`translate(${CANVAS_WIDTH / 2}, 860)`} onClick={() => handleNodeClick("Blessedness", "Virtue itself")}>
                        <rect x="-240" y="-20" width="480" height="120" rx="8" fill="url(#gradBlessedness)" stroke={C.bliss.stroke} strokeWidth="2" filter="url(#softShadow)" />
                        <text x="0" y="45" textAnchor="middle" fontSize="20" fontWeight="800" letterSpacing="1" fill={C.bliss.text}>
                            BLESSEDNESS
                        </text>
                        <text x="0" y="70" textAnchor="middle" fontSize="14" fontWeight="600" fill={C.bliss.text}>
                            Not reward for virtue, but virtue itself (VP42)
                        </text>
                    </InteractiveGroup>

                    <g transform="translate(100, 720)">
                        <rect width="300" height="160" rx="8" fill="url(#gradBox)" stroke={C.text.muted} strokeWidth="1.5" />
                        <text x="150" y="40" textAnchor="middle" fontSize="16" fontWeight="800" fill={C.text.primary}>THE POWER EQUATION</text>
                        <text x="150" y="70" textAnchor="middle" fontSize="14" fontWeight="500" fill={C.text.secondary}>More adequate ideas</text>
                        <text x="150" y="95" textAnchor="middle" fontSize="14" fontWeight="500" fill={C.text.secondary}>= More power = More virtue</text>
                        <text x="150" y="120" textAnchor="middle" fontSize="14" fontWeight="500" fill={C.text.secondary}>= More joy</text>
                        <text x="150" y="140" textAnchor="middle" fontSize="14" fontWeight="500" fill={C.text.secondary}>= More blessedness</text>
                    </g>

                    <g transform="translate(800, 720)">
                        <rect width="300" height="160" rx="8" fill="url(#gradBox)" stroke={C.text.muted} strokeWidth="1.5" />
                        <text x="150" y="40" textAnchor="middle" fontSize="16" fontWeight="800" fill={C.text.primary}>INTELLECTUAL LOVE</text>
                        <text x="150" y="70" textAnchor="middle" fontSize="14" fontWeight="500" fill={C.text.secondary}>VP32c: Joy from third kind</text>
                        <text x="150" y="95" textAnchor="middle" fontSize="14" fontWeight="500" fill={C.text.secondary}>of knowledge + idea of God</text>
                        <text x="150" y="120" textAnchor="middle" fontSize="14" fontWeight="500" fill={C.text.secondary}>VP36: Mind&apos;s love =</text>
                        <text x="150" y="140" textAnchor="middle" fontSize="14" fontWeight="500" fill={C.text.secondary}>God&apos;s self-love</text>
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default PowerDiagram;
