import { Helmet } from '@dr.pogodin/react-helmet';
import { opportunities } from '@/content/opportunities';

export default function OpportunitiesPage() {
  return (
    <>
      <Helmet>
        <title>Opportunities — StatSoc</title>
        <meta name="description" content="Internships, jobs, scholarships, and research opportunities in statistics and data science." />
      </Helmet>
      <main className="pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-4xl font-extrabold mb-4" style={{ color: 'hsl(var(--secondary))' }}>{opportunities.heading}</h1>
          <p className="text-muted-foreground text-lg">{opportunities.subheading}</p>
        </div>
      </main>
    </>
  );
}
