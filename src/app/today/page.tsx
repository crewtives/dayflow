export default function TodayPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-6 text-sumi">
      <section aria-labelledby="dayflow-title" className="max-w-lg border border-paper-mid bg-paper-bright p-6 shadow-fold">
        <p className="font-label text-vermilion-deep">DAYFLOW</p>
        <h1 id="dayflow-title" className="mt-3 font-display text-4xl">
          Tu jornada está lista para tomar forma.
        </h1>
        <p className="mt-4 text-sumi-soft">Cargando la experiencia de hoy.</p>
      </section>
    </main>
  );
}
