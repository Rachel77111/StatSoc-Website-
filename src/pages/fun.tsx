
import funContent from '../../content/fun.json';
import { useCmsContent } from '@/lib/use-cms-content';

export default function FunPage() {
  const content = useCmsContent('fun', funContent);
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">
        {content.heading}
      </h1>

      <p className="text-lg text-gray-600 max-w-xl">
        {content.subheading}
      </p>
      {content.image && <img src={content.image} alt={content.imageAlt} className="mt-8 max-h-80 max-w-full rounded-2xl object-contain" />}
    </main>
  );
}
