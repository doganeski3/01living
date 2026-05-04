import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-primary-ivory">
      <Navbar />
      <div className="pt-40 pb-20 px-6 flex flex-col items-center justify-center text-center max-w-xl mx-auto">
        <div className="bg-white/40 p-16 rounded-[3rem] shadow-sm border border-white/20">
          <h2 className="text-6xl font-heading text-primary-anthracite mb-6 uppercase tracking-widest">404</h2>
          <p className="text-primary-anthracite/60 font-serif italic text-xl mb-12">Oeps! De pagina die u zoekt is niet gevonden.</p>
          <Link href="/" className="inline-block bg-primary-anthracite text-primary-ivory px-10 py-5 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-accent-oak transition-all shadow-xl">
            Terug naar Home
          </Link>
        </div>
      </div>
    </main>
  );
}
