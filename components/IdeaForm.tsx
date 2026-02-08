"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Users } from "lucide-react";
import { IdeaFormData, IDEA_TAGS, IDEA_CATEGORIES, IDEA_STAGES } from "@/types";

export default function IdeaForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [getMarketInsights, setGetMarketInsights] = useState(true);
  const [formData, setFormData] = useState<IdeaFormData>({
    title: "",
    problem: "",
    solution: "",
    audience: "",
    tags: [],
    category: "",
    stage: "",
    looking_for_cofounder: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.tags.length === 0) {
      setError("Please select at least one tag");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, getMarketInsights }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit idea");
      }

      const idea = await response.json();
      router.push(`/ideas/${idea.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-0 py-3 bg-transparent border-0 border-b border-border/60 text-foreground placeholder:text-white/30 focus:ring-0 focus:border-primary-500 focus:outline-none transition-colors resize-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="py-3 px-4 rounded-lg bg-error-500/10 text-error-500 text-sm">
          {error}
        </div>
      )}

      <p className="text-sm text-white/70 px-4 py-3 rounded-lg bg-white/5 border border-white/10">
        Obviously don&apos;t give away the special sauce—share enough to validate. We are not responsible for stolen ideas.
      </p>

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-white/60 mb-1.5"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Give your idea a catchy title"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="problem"
          className="block text-sm font-medium text-white/60 mb-1.5"
        >
          The Problem
        </label>
        <textarea
          id="problem"
          name="problem"
          value={formData.problem}
          onChange={handleChange}
          required
          rows={4}
          placeholder="What problem are you trying to solve? Who experiences this problem?"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="solution"
          className="block text-sm font-medium text-white/60 mb-1.5"
        >
          Solution
        </label>
        <textarea
          id="solution"
          name="solution"
          value={formData.solution}
          onChange={handleChange}
          required
          rows={4}
          placeholder="How does your idea solve this problem? What makes it unique?"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="audience"
          className="block text-sm font-medium text-white/60 mb-1.5"
        >
          Target Audience
        </label>
        <textarea
          id="audience"
          name="audience"
          value={formData.audience}
          onChange={handleChange}
          required
          rows={3}
          placeholder="Who is your target customer? Describe their demographics, behaviors, and needs."
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/60 mb-3">
          Tags <span className="text-white/30">(select at least one)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {IDEA_TAGS.map((tag) => {
            const isSelected = formData.tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  isSelected
                    ? "bg-primary-500/20 border-primary-500 text-primary-400"
                    : "bg-transparent border-border/60 text-white/40 hover:border-white/40 hover:text-white/60"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-white/60 mb-1.5"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className={`${inputClass} cursor-pointer appearance-none`}
        >
          <option value="" disabled className="bg-surface text-white/30">
            Select a category
          </option>
          {IDEA_CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-surface text-white">
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="stage"
          className="block text-sm font-medium text-white/60 mb-1.5"
        >
          Stage
        </label>
        <select
          id="stage"
          name="stage"
          value={formData.stage}
          onChange={handleChange}
          required
          className={`${inputClass} cursor-pointer appearance-none`}
        >
          <option value="" disabled className="bg-surface text-white/30">
            Select a stage
          </option>
          {IDEA_STAGES.map((s) => (
            <option key={s} value={s} className="bg-surface text-white">
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between gap-4 py-3">
        <label
          htmlFor="cofounder-toggle"
          className="flex items-center gap-2.5 cursor-pointer flex-1"
        >
          <Users size={20} className="text-primary-500 shrink-0" />
          <span className="text-sm font-medium text-white/80">Looking for Co-founder</span>
        </label>
        <button
          type="button"
          role="switch"
          id="cofounder-toggle"
          aria-checked={formData.looking_for_cofounder}
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              looking_for_cofounder: !prev.looking_for_cofounder,
            }))
          }
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background ${
            formData.looking_for_cofounder ? "bg-primary-500" : "bg-white/20"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
              formData.looking_for_cofounder ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 py-3">
        <label
          htmlFor="market-insights-toggle"
          className="flex items-center gap-2.5 cursor-pointer flex-1"
        >
          <Sparkles size={20} className="text-primary-500 shrink-0" />
          <span className="text-sm font-medium text-white/80">Get Market Insights</span>
          <span className="text-xs text-white/40">(AI-powered)</span>
        </label>
        <button
          type="button"
          role="switch"
          id="market-insights-toggle"
          aria-checked={getMarketInsights}
          onClick={() => setGetMarketInsights((prev) => !prev)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background ${
            getMarketInsights ? "bg-primary-500" : "bg-white/20"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
              getMarketInsights ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="px-6 py-4 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-4 px-4 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generating Insights...
          </>
        ) : getMarketInsights ? (
          "Submit & Get Market Insights"
        ) : (
          "Submit Idea"
        )}
        </button>
      </div>
    </form>
  );
}
