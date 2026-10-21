import { Helmet } from '@dr.pogodin/react-helmet';
import opportunitiesContent from '../../content/opportunities.json';
import { useCmsContent } from '@/lib/use-cms-content';

type OpportunitiesContent = Omit<typeof opportunitiesContent, 'items'> & {
  items: { title: string; description: string; button: string; href: string; image: string }[];
};

export default function OpportunitiesPage() {
  const opportunities = useCmsContent<OpportunitiesContent>('opportunities', opportunitiesContent);
  return (
    <>
      <Helmet>
        <title>Opportunities — StatSoc</title>
        <meta name="description" content="Internships, jobs, scholarships, and research opportunities in statistics and data science." />
      </Helmet>
      <main className="pt-32 pb-20 min-h-screen">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="text-6xl mb-4">{opportunities.icon}</div>
          <h1 className="text-4xl font-extrabold mb-4" style={{ color: 'hsl(var(--secondary))' }}>{opportunities.heading}</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">{opportunities.subheading}</p>
          {opportunities.items.length > 0 && (
            <div className="mt-12 grid gap-5 text-left sm:grid-cols-2">
              {opportunities.items.map((item) => (
                <article key={item.title} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                  {item.image && <img src={item.image} alt="" className="h-48 w-full object-cover" loading="lazy" />}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-secondary">{item.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    {item.href && <a href={item.href} target="_blank" rel="noreferrer" className="mt-5 inline-flex font-bold text-secondary hover:text-primary">{item.button || 'Learn more'} <span aria-hidden="true"> →</span></a>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
