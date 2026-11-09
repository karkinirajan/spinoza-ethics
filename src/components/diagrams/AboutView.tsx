
const AboutView = (): React.JSX.Element => {
    return (
        <div className="w-full h-full p-8 md:p-12 overflow-y-auto bg-[var(--surface)] rounded-2xl border-bt-xl border-tr-xl">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-black text-[var(--text-primary)] mb-8 text-center whitespace-nowrap">
                    ABOUT THIS PROJECT
                </h2>

                <div className="space-y-12 font-serif text-lg leading-relaxed text-[var(--text-secondary)]">
                    <section>
                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6 border-b pb-2 border-[var(--border)]">Why I Built This</h3>
                        <p className="text-[var(--text-secondary)] text-justify mb-4">
                            Spinoza&apos;s <i>Ethics</i> is one of the most profound but notoriously difficult philosophical texts ever written.
                            Its geometrical method—definitions, axioms, propositions, and proofs—can be overwhelming to read linearly.
                            The text is a dense network of logical dependencies, where a single proposition might rely on definitions from Part I,
                            axioms from Part II, and previous propositions from Part III.
                        </p>
                        <p className="text-[var(--text-secondary)] text-justify">
                            I built this interactive visual explorer to make the system more accessible, revealing the beautiful logical structure
                            that connects Substance to Human Freedom. It&apos;s designed to be a companion to the text, helping you see the forest
                            while you study the trees. By visualizing the connections, we can better understand how Spinoza&apos;s metaphysics
                            grounds his psychology, and how his psychology necessitates his ethics.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6 border-b pb-2 border-[var(--border)]">How It&apos;s Built</h3>
                        <p className="text-[var(--text-secondary)] text-justify mb-4">
                            This project is built with <strong>Next.js</strong> and <strong>Tailwind CSS</strong>, using <strong>SVG</strong> for the interactive diagrams.
                            The visualizations are not static images but dynamic components that map the logical dependencies of Spinoza&apos;s system.
                            I used <strong>Gemini AI</strong> to help structure the complex relationships and ensure the code is clean and efficient.
                        </p>
                        <p className="text-[var(--text-secondary)] text-justify">
                            The goal was to create a &quot;digital geometrical order&quot; that feels as precise and elegant as Spinoza&apos;s thought.
                            Every arrow represents a logical derivation, and every box represents a core concept. The color palette is chosen to reflect
                            the progression from the absolute nature of Substance (deep slate) to the active power of Freedom (vibrant indigo).
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6 border-b pb-2 border-[var(--border)]">How to Navigate</h3>
                        <p className="text-[var(--text-secondary)] text-justify mb-4">
                            Start with the <strong>Hierarchy</strong> view to see the big picture of the ontology—how Modes follow from Attributes, which follow from Substance.
                            Then, explore the <strong>5 Parts</strong> flow to understand the narrative arc from God to Freedom.
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 text-[var(--text-secondary)] mb-4">
                            <li>Use the <strong>Parallelism</strong> diagram to understand the mind-body identity.</li>
                            <li>Use the <strong>Affects</strong> diagram to dive deep into the mechanics of emotions.</li>
                            <li>Use the <strong>Power</strong> diagram to see how conatus drives human behavior.</li>
                            <li>Finally, the <strong>Complete System</strong> view brings it all together.</li>
                        </ul>
                        <p className="text-[var(--text-secondary)] text-justify">
                            Click on any node to get a concise explanation of the concept. Use the &quot;Read Summary&quot; view to consult the text alongside the diagrams.
                        </p>
                    </section>

                    <section className="bg-[var(--surface-muted)] p-8 rounded-xl border border-[var(--border)] mt-12 border-bt-xl border-tr-xl">
                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Your Feedback</h3>
                        <p className="text-[var(--text-secondary)] text-justify mb-4">
                            This is a living project, and I want to make it the best possible resource for students of Spinoza.
                            Do you have suggestions for new diagrams? Is there a part of the Ethics that is still unclear?
                            Found a bug or a typo?
                        </p>
                        <p className="text-[var(--text-secondary)] font-medium">
                            Please reach out with your thoughts, queries, or suggestions at <a href="mailto:kneeraazon@gmail.com" className="text-[var(--accent)] hover:underline decoration-[var(--accent)] underline-offset-2">kneeraazon@gmail.com</a>. Let&apos;s decode the Ethics together!
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AboutView;
