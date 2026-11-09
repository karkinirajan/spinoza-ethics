"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  type FC,
} from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { requestExplanation } from "@/lib/explain-client";

interface SpinozaContextType {
  explainConcept: (title: string, context: string) => Promise<void>;
}

const SpinozaContext = createContext<SpinozaContextType | undefined>(
  undefined
);

export const useSpinoza = (): SpinozaContextType => {
  const context = useContext(SpinozaContext);
  if (!context) {
    throw new Error("useSpinoza must be used within a SpinozaProvider");
  }
  return context;
};

interface SpinozaProviderProps {
  children: ReactNode;
}

export const SpinozaProvider: FC<SpinozaProviderProps> = ({
  children,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const explainConcept = useCallback(
    async (title: string, context: string): Promise<void> => {
      setSelectedTopic(title);
      setAiResponse("");
      setError(null);
      setIsLoading(true);

      try {
        const text = await requestExplanation({ kind: "concept", title, context });
        setAiResponse(text);
        setError(null);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Unable to reach the infinite intellect. Please try again.";
        console.error("Spinoza explanation error:", error);
        setError(errorMessage);
        setAiResponse("");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleClose = useCallback(() => {
    setSelectedTopic(null);
    setAiResponse("");
    setError(null);
  }, []);

  return (
    <SpinozaContext.Provider value={{ explainConcept }}>
      {children}

      {selectedTopic && (
        <div className="fixed top-0 right-0 w-80 h-full bg-[var(--surface)] shadow-2xl border-l border-[var(--border)] p-6 overflow-y-auto z-[100] animate-in slide-in-from-right duration-300 border-bt-xl border-tr-xl">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors border-bt-xl border-tr-xl"
            aria-label="Close explanation"
          >
            <X size={20} />
          </button>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            {selectedTopic}
          </h3>
          <div className="h-1 w-20 bg-[var(--accent)] mb-6 rounded-full"></div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2
                size={32}
                className="animate-spin text-[var(--accent)] mb-3"
              />
              <span className="text-sm font-medium text-[var(--text-muted)]">
                Consulting Spinoza&apos;s wisdom...
              </span>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-4 border-bt-xl border-tr-xl">
              <div className="flex gap-2 mb-2">
                <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={18} />
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-xs text-red-600 dark:text-red-400 hover:underline border-bt-xl border-tr-xl"
              >
                Dismiss
              </button>
            </div>
          ) : (
            <div className="prose prose-sm prose-slate max-w-none text-[var(--text-primary)]">
              <ReactMarkdown>{aiResponse}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </SpinozaContext.Provider>
  );
};
