import React from 'react';
import summaryData from '../../data/ethicsSummary.json';

interface ContentItem {
    type: string;
    text: string;
    href?: string;
}

interface Block {
    type: string;
    content: ContentItem[];
}

const SummaryView = (): React.JSX.Element => {
    const processedData = React.useMemo(() => {
        const merged: Block[] = [];
        (summaryData as Block[]).forEach((block) => {
            const last = merged[merged.length - 1];
            if (last && (last.type === 'heading' || last.type === 'title') && (block.type === 'heading' || block.type === 'title')) {
                last.content = [...last.content, { type: 'text', text: ' ' }, ...block.content];
            } else {
                merged.push({
                    ...block,
                    content: [...block.content]
                });
            }
        });
        return merged;
    }, []);

    return (
            <div className="w-full h-full p-8 md:p-12 overflow-y-auto bg-[var(--surface)] rounded-2xl border-bt-xl border-tr-xl">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-black text-[var(--text-primary)] mb-8 text-center whitespace-nowrap">
                    ETHICA ORDINE GEOMETRICO DEMONSTRATA
                </h2>

                <div className="space-y-6 font-serif text-lg leading-relaxed text-[var(--text-secondary)]">
                    {processedData.map((block, index) => {
                        if (block.type === 'heading' || block.type === 'title') {
                            return (
                                <h3 key={index} className="text-2xl font-bold text-[var(--text-primary)] mt-12 mb-6 border-b pb-2 border-[var(--border)] border-bt-xl border-tr-xl">
                                    {block.content.map((item) => item.text).join('')}
                                </h3>
                            );
                        }

                        return (
                            <p key={index} className="text-[var(--text-secondary)] text-justify">
                                {block.content.map((item, i) => {
                                    if (item.type === 'link') {
                                        return (
                                            <a
                                                key={i}
                                                href={item.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-1.5 py-0.5 mx-1 rounded text-base font-medium bg-[var(--color-thought-bg)] text-[var(--color-thought-text)] hover:opacity-80 transition-colors duration-200 align-baseline"
                                                title={item.text}
                                            >
                                                <span className="underline decoration-[var(--color-thought-stroke)] underline-offset-2">{item.text}</span>
                                            </a>
                                        );
                                    }
                                    return <span key={i}>{item.text}</span>;
                                })}
                            </p>
                        );
                    })}
                </div>

                <div className="mt-16 pt-8 border-t border-[var(--border)] text-center text-[var(--text-muted)] text-sm border-bt-xl border-tr-xl">
                    <p>Content based on Spinoza&apos;s Ethics. References provided by external sources.</p>
                </div>
            </div>
        </div>
    );
};

export default SummaryView;
