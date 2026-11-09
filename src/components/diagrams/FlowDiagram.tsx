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

interface FlowCardProps {
    x: number;
    y: number;
    width: number;
    height: number;
    title: string;
    subtitle: string;
    fill: string;
    stroke: string;
    textFill: string;
    onClick: () => void;
}

interface SubCardProps {
    x: number;
    y: number;
    width: number;
    text: string;
    fill: string;
    stroke: string;
    textFill: string;
    parentX: number;
    parentY: number;
    onClick: () => void;
}

const FlowCard = ({ x, y, width, height, title, subtitle, fill, stroke, textFill, onClick }: FlowCardProps): React.JSX.Element => (
    <InteractiveGroup transform={`translate(${x}, ${y})`} onClick={onClick}>
        <rect width={width} height={height} rx="8" fill={fill} stroke={stroke} strokeWidth="3" filter="url(#softShadow)" />
        <text x={width / 2} y={35} textAnchor="middle" fill={textFill} fontSize="20" fontWeight="800" letterSpacing="0.5">
            {title}
        </text>
        <text x={width / 2} y={60} textAnchor="middle" fill={textFill} fontSize="16" fontWeight="500" fontStyle="italic" opacity="0.9">
            {subtitle}
        </text>
    </InteractiveGroup>
);

const SubCard = ({ x, y, width, text, fill, stroke, textFill, parentX, parentY, onClick }: SubCardProps): React.JSX.Element => (
    <g>
        <path
            d={`M ${parentX} ${parentY} C ${parentX} ${y - 15}, ${x + width / 2} ${parentY + 15}, ${x + width / 2} ${y}`}
            stroke={stroke}
            strokeWidth="2"
            opacity="0.4"
            fill="none"
        />
        <InteractiveGroup transform={`translate(${x}, ${y})`} onClick={onClick}>
            <rect width={width} height={36} rx="6" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <text x={width / 2} y={23} textAnchor="middle" fill={textFill} fontSize="15" fontWeight="600">
                {text}
            </text>
        </InteractiveGroup>
    </g>
);

const FlowDiagram = (): React.JSX.Element => {
    const { explainConcept } = useSpinoza();
    const C = useThemeColors();

    const handleNodeClick = (title: string, context: string): void => {
        explainConcept(title, context);
    };

    const CANVAS_WIDTH = 1600;
    const CANVAS_HEIGHT = 950;

    const arrowStyle = { strokeWidth: "2", fill: "none", opacity: "0.8" };

    const Y_HEADER = 30;
    const Y_P1 = 70;
    const Y_P1_SUB = 200;
    const Y_P23 = 350;
    const Y_P23_SUB1 = 480;
    const Y_P23_SUB2 = 540;
    const Y_P45 = 700;
    const Y_P45_SUB1 = 830;
    const Y_P45_SUB2 = 890;

    return (
        <div className="w-full min-h-[950px] relative font-sans overflow-auto border-bt-xl border-tr-xl" style={{ backgroundColor: C.bg }}>
            <div className="absolute top-4 left-8 z-10 pointer-events-none">
                <h2 className="text-[var(--text-muted)] text-sm font-semibold tracking-widest uppercase mb-1.5">
                    ETHICA ORDINE GEOMETRICO DEMONSTRATA
                </h2>
                <h3 className="text-[var(--text-muted)] text-xs font-medium tracking-wider uppercase opacity-60">
                    / THE FIVE PARTS
                </h3>
            </div>

            <div className="w-full max-w-[1600px] mx-auto aspect-auto relative px-4 mt-2">
                <svg aria-labelledby="flow-title" role="img" viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} className="w-full h-auto min-h-[950px]">
                    <title id="flow-title">Flow diagram of the five parts of Spinoza&apos;s Ethics</title>
                    <defs>
                        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                            <feOffset dx="2" dy="3" result="offsetblur" />
                            <feComponentTransfer><feFuncA type="linear" slope="0.1" /></feComponentTransfer>
                            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>

                        <pattern id="globalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={C.grid} strokeWidth="1" />
                        </pattern>

                        <marker id="arrow" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">
                            <path d="M0,0 L5,1.5 L0,3 L0,0" fill={C.text.muted} />
                        </marker>
                        <marker id="arrowGreen" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">
                            <path d="M0,0 L5,1.5 L0,3 L0,0" fill={C.freedom.stroke} />
                        </marker>
                        <marker id="arrowOrange" markerWidth="5" markerHeight="3" refX="4" refY="1.5" orient="auto">
                            <path d="M0,0 L5,1.5 L0,3 L0,0" fill={C.bondage.stroke} />
                        </marker>
                    </defs>

                    <rect width="100%" height="100%" fill="url(#globalGrid)" />

                    <text x="400" y={Y_HEADER} textAnchor="middle" fill={C.substance.stroke} fontSize="16" fontWeight="800" letterSpacing="3" opacity="0.8">SUBSTANCE</text>
                    <text x="800" y={Y_HEADER} textAnchor="middle" fill={C.text.secondary} fontSize="16" fontWeight="800" letterSpacing="3" opacity="0.8">ATTRIBUTES</text>
                    <text x="1200" y={Y_HEADER} textAnchor="middle" fill={C.extension.stroke} fontSize="16" fontWeight="800" letterSpacing="3" opacity="0.8">MODES</text>

                    <path d={`M 800 ${Y_P1 + 90} C 800 ${Y_P23 - 40}, 400 ${Y_P23 - 40}, 400 ${Y_P23}`} stroke={C.text.muted} {...arrowStyle} markerEnd="url(#arrow)" />
                    <path d={`M 800 ${Y_P1 + 90} C 800 ${Y_P23 - 40}, 1200 ${Y_P23 - 40}, 1200 ${Y_P23}`} stroke={C.text.muted} {...arrowStyle} markerEnd="url(#arrow)" />

                    <path d={`M 400 ${Y_P23_SUB2 + 36} C 400 ${Y_P45 - 50}, 400 ${Y_P45 - 20}, 400 ${Y_P45}`} stroke={C.text.muted} {...arrowStyle} markerEnd="url(#arrow)" />
                    <path d={`M 1200 ${Y_P23_SUB2 + 36} C 1200 ${Y_P45 - 50}, 1200 ${Y_P45 - 20}, 1200 ${Y_P45}`} stroke={C.text.muted} {...arrowStyle} markerEnd="url(#arrow)" />

                    <path d={`M 400 ${Y_P23_SUB2 + 36} C 400 ${Y_P45 - 40}, 1200 ${Y_P45 - 40}, 1200 ${Y_P45}`} stroke={C.freedom.stroke} strokeWidth="2.5" fill="none" opacity="0.3" strokeDasharray="6,6" />
                    <path d={`M 1200 ${Y_P23_SUB2 + 36} C 1200 ${Y_P45 - 40}, 400 ${Y_P45 - 40}, 400 ${Y_P45}`} stroke={C.bondage.stroke} strokeWidth="2.5" fill="none" opacity="0.3" strokeDasharray="6,6" />

                    <FlowCard
                        x={640} y={Y_P1} width={320} height={90}
                        title="PART I: OF GOD" subtitle="The Foundation of Being"
                        fill={C.substance.fill} stroke={C.substance.stroke} textFill={C.substance.text}
                        onClick={() => handleNodeClick("Part I: Of God", "The foundation of the system")}
                    />
                    <g>
                        <SubCard x={300} y={Y_P1_SUB} width={180} text="One Infinite Substance" fill={C.white} stroke={C.substance.stroke} textFill={C.substance.text} parentX={800} parentY={Y_P1 + 90} onClick={() => handleNodeClick("Substance Monism", "Only one substance")} />
                        <SubCard x={500} y={Y_P1_SUB} width={180} text="Causa Sui (Self-Caused)" fill={C.white} stroke={C.substance.stroke} textFill={C.substance.text} parentX={800} parentY={Y_P1 + 90} onClick={() => handleNodeClick("Causa Sui", "Self-caused")} />
                        <SubCard x={700} y={Y_P1_SUB} width={200} text="Deus sive Natura" fill={C.white} stroke={C.substance.stroke} textFill={C.substance.text} parentX={800} parentY={Y_P1 + 90} onClick={() => handleNodeClick("Deus sive Natura", "God or Nature")} />
                        <SubCard x={920} y={Y_P1_SUB} width={180} text="Absolute Determinism" fill={C.white} stroke={C.substance.stroke} textFill={C.substance.text} parentX={800} parentY={Y_P1 + 90} onClick={() => handleNodeClick("Determinism", "No contingency")} />
                        <SubCard x={1120} y={Y_P1_SUB} width={180} text="Critique of Teleology" fill={C.white} stroke={C.substance.stroke} textFill={C.substance.text} parentX={800} parentY={Y_P1 + 90} onClick={() => handleNodeClick("Critique of Teleology", "No final causes")} />
                    </g>

                    <FlowCard
                        x={240} y={Y_P23} width={320} height={90}
                        title="PART II: THE MIND" subtitle="Nature & Origin of Mind"
                        fill={C.thought.fill} stroke={C.thought.stroke} textFill={C.thought.text}
                        onClick={() => handleNodeClick("Part II: Of The Mind", "Epistemology")}
                    />
                    <g>
                        <SubCard x={150} y={Y_P23_SUB1} width={160} text="Parallelism (IIP7)" fill={C.white} stroke={C.thought.stroke} textFill={C.thought.text} parentX={400} parentY={Y_P23 + 90} onClick={() => handleNodeClick("Parallelism", "Order of ideas")} />
                        <SubCard x={330} y={Y_P23_SUB1} width={160} text="Idea of the Body" fill={C.white} stroke={C.thought.stroke} textFill={C.thought.text} parentX={400} parentY={Y_P23 + 90} onClick={() => handleNodeClick("Idea of Body", "Mind object")} />
                        <SubCard x={510} y={Y_P23_SUB1} width={160} text="Imagination (1st)" fill={C.white} stroke={C.thought.stroke} textFill={C.thought.text} parentX={400} parentY={Y_P23 + 90} onClick={() => handleNodeClick("Imagination", "1st Kind")} />
                        <SubCard x={240} y={Y_P23_SUB2} width={160} text="Reason (2nd Kind)" fill={C.white} stroke={C.thought.stroke} textFill={C.thought.text} parentX={400} parentY={Y_P23 + 90} onClick={() => handleNodeClick("Reason", "2nd Kind")} />
                        <SubCard x={420} y={Y_P23_SUB2} width={160} text="Intuition (3rd Kind)" fill={C.white} stroke={C.thought.stroke} textFill={C.thought.text} parentX={400} parentY={Y_P23 + 90} onClick={() => handleNodeClick("Intuition", "3rd Kind")} />
                    </g>

                    <FlowCard
                        x={1040} y={Y_P23} width={320} height={90}
                        title="PART III: AFFECTS" subtitle="Origin & Nature of Emotions"
                        fill={C.extension.fill} stroke={C.extension.stroke} textFill={C.extension.text}
                        onClick={() => handleNodeClick("Part III: Affects", "Psychology")}
                    />
                    <g>
                        <SubCard x={950} y={Y_P23_SUB1} width={160} text="Conatus (Striving)" fill={C.white} stroke={C.extension.stroke} textFill={C.extension.text} parentX={1200} parentY={Y_P23 + 90} onClick={() => handleNodeClick("Conatus", "Striving")} />
                        <SubCard x={1130} y={Y_P23_SUB1} width={160} text="Desire (Cupiditas)" fill={C.white} stroke={C.extension.stroke} textFill={C.extension.text} parentX={1200} parentY={Y_P23 + 90} onClick={() => handleNodeClick("Desire", "Cupiditas")} />
                        <SubCard x={1310} y={Y_P23_SUB1} width={160} text="Joy (Laetitia)" fill={C.white} stroke={C.extension.stroke} textFill={C.extension.text} parentX={1200} parentY={Y_P23 + 90} onClick={() => handleNodeClick("Joy", "Laetitia")} />
                        <SubCard x={1040} y={Y_P23_SUB2} width={160} text="Sadness (Tristitia)" fill={C.white} stroke={C.extension.stroke} textFill={C.extension.text} parentX={1200} parentY={Y_P23 + 90} onClick={() => handleNodeClick("Sadness", "Tristitia")} />
                        <SubCard x={1220} y={Y_P23_SUB2} width={160} text="Imitation of Affects" fill={C.white} stroke={C.extension.stroke} textFill={C.extension.text} parentX={1200} parentY={Y_P23 + 90} onClick={() => handleNodeClick("Imitation of Affects", "Social psychology")} />
                    </g>

                    <FlowCard
                        x={240} y={Y_P45} width={320} height={90}
                        title="PART IV: BONDAGE" subtitle="Strength of the Emotions"
                        fill={C.bondage.fill} stroke={C.bondage.stroke} textFill={C.bondage.text}
                        onClick={() => handleNodeClick("Part IV: Bondage", "Human Bondage")}
                    />
                    <g>
                        <SubCard x={150} y={Y_P45_SUB1} width={160} text="Power of Ext. Causes" fill={C.white} stroke={C.bondage.stroke} textFill={C.bondage.text} parentX={400} parentY={Y_P45 + 90} onClick={() => handleNodeClick("External Causes", "Power of nature")} />
                        <SubCard x={330} y={Y_P45_SUB1} width={160} text="Good = Useful" fill={C.white} stroke={C.bondage.stroke} textFill={C.bondage.text} parentX={400} parentY={Y_P45 + 90} onClick={() => handleNodeClick("Good is Useful", "IV Def 1")} />
                        <SubCard x={510} y={Y_P45_SUB1} width={160} text="Virtue = Power" fill={C.white} stroke={C.bondage.stroke} textFill={C.bondage.text} parentX={400} parentY={Y_P45 + 90} onClick={() => handleNodeClick("Virtue is Power", "IV Def 8")} />
                        <SubCard x={240} y={Y_P45_SUB2} width={160} text="The Free Man" fill={C.white} stroke={C.bondage.stroke} textFill={C.bondage.text} parentX={400} parentY={Y_P45 + 90} onClick={() => handleNodeClick("The Free Man", "Model of nature")} />
                        <SubCard x={420} y={Y_P45_SUB2} width={160} text="Social Contract" fill={C.white} stroke={C.bondage.stroke} textFill={C.bondage.text} parentX={400} parentY={Y_P45 + 90} onClick={() => handleNodeClick("Social Contract", "Society")} />
                    </g>

                    <FlowCard
                        x={1040} y={Y_P45} width={320} height={90}
                        title="PART V: FREEDOM" subtitle="Power of the Intellect"
                        fill={C.freedom.fill} stroke={C.freedom.stroke} textFill={C.freedom.text}
                        onClick={() => handleNodeClick("Part V: Freedom", "Human Freedom")}
                    />
                    <g>
                        <SubCard x={950} y={Y_P45_SUB1} width={160} text="Reason over Affects" fill={C.white} stroke={C.freedom.stroke} textFill={C.freedom.text} parentX={1200} parentY={Y_P45 + 90} onClick={() => handleNodeClick("Reason over Affects", "Power of Mind")} />
                        <SubCard x={1130} y={Y_P45_SUB1} width={160} text="Intellectual Love" fill={C.white} stroke={C.freedom.stroke} textFill={C.freedom.text} parentX={1200} parentY={Y_P45 + 90} onClick={() => handleNodeClick("Intellectual Love", "Amor Dei Intellectualis")} />
                        <SubCard x={1310} y={Y_P45_SUB1} width={160} text="Eternity of Mind" fill={C.white} stroke={C.freedom.stroke} textFill={C.freedom.text} parentX={1200} parentY={Y_P45 + 90} onClick={() => handleNodeClick("Eternity of Mind", "Sub specie aeternitatis")} />
                        <SubCard x={1000} y={Y_P45_SUB2} width={200} text="Third Kind of Knowledge" fill={C.white} stroke={C.freedom.stroke} textFill={C.freedom.text} parentX={1200} parentY={Y_P45 + 90} onClick={() => handleNodeClick("Third Kind of Knowledge", "Intuition")} />
                        <SubCard x={1240} y={Y_P45_SUB2} width={160} text="Blessedness" fill={C.white} stroke={C.freedom.stroke} textFill={C.freedom.text} parentX={1200} parentY={Y_P45 + 90} onClick={() => handleNodeClick("Blessedness", "Virtue itself")} />
                    </g>

                    <path d={`M 570 ${Y_P45 + 45} C 670 ${Y_P45 + 45}, 930 ${Y_P45 + 45}, 1030 ${Y_P45 + 45}`} stroke={C.freedom.stroke} strokeWidth="3" markerEnd="url(#arrow)" opacity="0.5" />
                    <text x="800" y={Y_P45 + 35} textAnchor="middle" fill={C.freedom.stroke} fontSize="17" fontWeight="800" letterSpacing="1">TRANSFORMATION</text>

                </svg>
            </div>
        </div>
    );
};

export default FlowDiagram;
