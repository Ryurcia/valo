"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IdeaFormData } from "@/types";

export default function IdeaForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<IdeaFormData>({
    title: "",
    problem: "",
    solution: "",
    audience: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="problem"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
        />
      </div>

      <div>
        <label
          htmlFor="solution"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
        />
      </div>

      <div>
        <label
          htmlFor="audience"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
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
        ) : (
          "Submit & Get Market Insights"
        )}
      </button>
    </form>
  );
}
