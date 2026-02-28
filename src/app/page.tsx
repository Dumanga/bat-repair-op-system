import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0f14]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute right-[-10%] top-[-10%] h-96 w-96 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute bottom-[-20%] left-1/3 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_45%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <Image
          src="/assets/logo-dob.png"
          alt="Doctor of Bat"
          width={360}
          height={120}
          priority
          className="h-auto w-[220px] max-w-full opacity-95 sm:w-[300px] md:w-[360px]"
        />
      </div>
    </main>
  );
}
