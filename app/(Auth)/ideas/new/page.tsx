import IdeaForm from '@/components/IdeaForm';

export default function NewIdeaPage() {
  return (
    <div className='max-w-2xl mx-auto px-4 py-8'>
      <div className='mb-10'>
        <h1 className='text-3xl font-bold text-foreground'>Submit Your Idea</h1>
        <p className='text-white/50 mt-1.5'>Share your business idea and get AI-powered market insights</p>
      </div>

      <IdeaForm />
    </div>
  );
}
