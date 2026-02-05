import IdeaForm from "@/components/IdeaForm";

export default function NewIdeaPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Submit Your Idea
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Share your business idea and get AI-powered market insights
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <IdeaForm />
      </div>
    </div>
  );
}
