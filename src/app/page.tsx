import Image from "next/image";
import Link from "next/link";

const partnerLogos = Array.from(
  { length: 8 },
  (_, index) => `/assets/home-assets/partners/${index + 1}.png`
);
const foreignPlayers = Array.from(
  { length: 8 },
  (_, index) => `/assets/home-assets/player-imgs/foreign/${index + 1}.png`
);
const localPlayers = Array.from(
  { length: 8 },
  (_, index) => `/assets/home-assets/player-imgs/local/${index + 1}.png`
);

const services = [
  "Knocking in bats",
  "Handle replacement",
  "Apply facing",
  "Fiber facing",
  "Full refurbishment",
  "Apply toe guards",
  "Weight reduction",
  "Clean face",
  "Crack repairs",
  "Handle reshaping",
  "Handle rebinding",
  "Oil seasoning",
];

function LogoMarquee({
  items,
  speedClass,
}: {
  items: string[];
  speedClass: string;
}) {
  const loopItems = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <div className={`flex w-max gap-4 ${speedClass}`}>
        {loopItems.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="flex h-20 w-36 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-white p-3 shadow-sm sm:h-24 sm:w-44"
          >
            <Image
              src={src}
              alt="Partner logo"
              width={150}
              height={70}
              className="h-full w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PlayerMarquee({
  items,
  speedClass,
}: {
  items: string[];
  speedClass: string;
}) {
  const loopItems = [...items, ...items];
  return (
    <div className="relative mx-auto max-w-full overflow-hidden rounded-3xl border border-black/10 bg-[#fffdf8] p-4 sm:p-6">
      <div className={`flex w-max gap-4 ${speedClass}`}>
        {loopItems.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="h-44 w-32 shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm sm:h-60 sm:w-44"
          >
            <Image
              src={src}
              alt="Player"
              width={260}
              height={360}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fff9f2] text-[#1f1b18]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,113,1,0.18),transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(44,42,44,0.08),transparent_38%)]" />
      </div>

      <header className="sticky top-0 z-40 mx-auto mt-2 w-[92%] max-w-6xl rounded-full border border-black/10 bg-white/75 px-4 py-3 backdrop-blur-md sm:mt-2 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="#home" className="flex items-center gap-2">
            <Image
              src="/assets/logo-dob.png"
              alt="Doctor of Bat"
              width={120}
              height={40}
              className="h-8 w-auto sm:h-10"
            />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-black/70 md:flex">
            <Link href="#partners" className="transition hover:text-[#ff7101]">
              Partners
            </Link>
            <Link href="#clients" className="transition hover:text-[#ff7101]">
              Clients
            </Link>
            <Link href="#services" className="transition hover:text-[#ff7101]">
              Services
            </Link>
            <Link href="#about" className="transition hover:text-[#ff7101]">
              About
            </Link>
            <Link href="#contact" className="transition hover:text-[#ff7101]">
              Contact
            </Link>
          </nav>
          <Link
            href="/operation/login"
            className="rounded-full bg-[#2c2a2c] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#ff7101]"
          >
            Staff Login
          </Link>
        </div>
      </header>

      <section
        id="home"
        className="mx-auto grid w-[92%] max-w-6xl gap-10 pb-16 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:pt-12"
      >
        <div className="animate-rise space-y-6">
          <p className="inline-flex rounded-full border border-[#ff7101]/30 bg-[#ff7101]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8b3f00]">
            Doctor of Bat (Pvt) Ltd
          </p>
          <h1 className="text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Elite Cricket Bat Repair and Customization
          </h1>
          <p className="max-w-xl text-base text-black/70 sm:text-lg">
            Trusted by Sri Lankan national players and international professionals.
            From precision crack repair to full bat refurbishment, our workshop
            keeps your bat in peak match condition.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/tracking"
              className="rounded-full bg-[#ff7101] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#da6100]"
            >
              Track Your Repair
            </Link>
            <a
              href="#contact"
              className="rounded-full border border-black/20 bg-white px-6 py-3 text-sm font-semibold text-[#2c2a2c] transition hover:border-[#ff7101]/60 hover:text-[#ff7101]"
            >
              Contact Workshop
            </a>
          </div>
        </div>

        <div className="animate-rise rounded-3xl border border-black/10 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.45)]">
          <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-black/10 bg-[#fffaf4] p-6 sm:min-h-[380px]">
            <Image
              src="/assets/logo-dob.png"
              alt="Doctor of Bat logo"
              width={560}
              height={220}
              className="h-auto w-full max-w-[520px] object-contain"
              priority
            />
          </div>
        </div>
      </section>

      <section id="partners" className="mx-auto w-[92%] max-w-6xl py-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-black/50">
              Partner Network
            </p>
            <h2 className="mt-2 text-2xl">Trusted Partnerships</h2>
          </div>
        </div>
        <LogoMarquee
          items={partnerLogos}
          speedClass="animate-home-marquee-left"
        />
      </section>

      <section
        id="clients"
        className="mx-auto w-[92%] max-w-6xl overflow-x-hidden py-10"
      >
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-black/50">
            Our Clients
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl">
            Foreign and Sri Lankan National Players
          </h2>
        </div>
        <div className="grid gap-6">
          <div>
            <h3 className="mb-3 text-lg">Foreign National Players</h3>
            <PlayerMarquee
              items={foreignPlayers}
              speedClass="animate-home-marquee-left-slow"
            />
          </div>
          <div>
            <h3 className="mb-3 text-lg">Sri Lankan National Players</h3>
            <PlayerMarquee
              items={localPlayers}
              speedClass="animate-home-marquee-right-slow"
            />
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto w-[92%] max-w-6xl py-14">
        <div className="mb-7">
          <p className="text-xs uppercase tracking-[0.2em] text-black/50">
            Workshop Services
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl">
            Comprehensive Bat Repair and Custom Work
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service}
              className="rounded-2xl border border-black/10 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#ff7101]/45"
            >
              <p className="text-sm font-semibold">{service}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="about"
        className="mx-auto grid w-[92%] max-w-6xl gap-8 py-14 lg:grid-cols-[0.75fr_1.25fr]"
      >
        <div className="rounded-3xl border border-black/10 bg-white p-5 sm:p-6">
          <div className="relative mx-auto h-64 w-full max-w-xs overflow-hidden rounded-2xl border border-black/10">
            <Image
              src="/assets/founder.png"
              alt="Udayasiri Jayawardena"
              width={420}
              height={500}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-black/50">About Us</p>
          <h2 className="mt-2 text-2xl sm:text-3xl">
            Founder: Udayasiri Jayawardena
          </h2>
          <p className="mt-4 text-black/75">
            Doctor of Bat was built on deep craft, discipline, and consistency.
            The workshop is known for restoring bats used at the highest level of
            cricket while preserving each bat&apos;s feel, balance, and longevity.
          </p>
          <blockquote className="mt-5 rounded-2xl border border-[#ff7101]/25 bg-[#fff8f1] p-4 text-sm leading-relaxed text-black/80">
            &quot;When I joined the field of cricket, despite its rapid popularity as a
            sport, the additional fields and services related to it were not
            available here. The bat repair service was especially lacking here. I
            started this service to fulfill that need. Gradually, with the
            popularity of school and domestic-level cricket, the need for bat
            repair increased.
            <br />
            <br />
            In my opinion, the skill of the batsman as well as the quality of the
            bat is essential for a long innings or scoring runs in cricket. So, it
            is very important to maintain the quality of that bat. Because the
            cricket bat is one of the most sensitive pieces of cricket equipment,
            it is correct to say that it is sensitive to the ball, the nature of
            its handling, as well as natural factors such as air humidity.
            <br />
            <br />
            Over time, the bat may develop cracks, dents, or weakened areas that
            can affect its performance. Repairing these issues can help restore
            the bat&apos;s integrity, ensuring optimal performance and durability.
            <br />
            <br />
            Over three decades, I&apos;ve consistently and responsibly prepared bats,
            driven only by your trust. Your belief in me is what keeps me going in
            this field. I promise to continue enhancing your cricket bat&apos;s
            strength with each preparation.&quot;
          </blockquote>
        </div>
      </section>

      <section className="mx-auto w-[92%] max-w-6xl py-10">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-black/50">
            Dispatch and Delivery
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl">
            Global Courier Flow and Live Repair Updates
          </h2>
        </div>
        <div className="grid gap-4 text-sm text-black/70 md:grid-cols-3">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-black/50">
              Global Dispatch
            </p>
            <p className="mt-2">
              Send your bat from anywhere in the world. Please contact us before
              courier dispatch. Shipping cost is managed by the customer.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-black/50">
              Delivery + Updates
            </p>
            <p className="mt-2">
              Once work is completed, collect at workshop or request delivery.
              You receive SMS status updates and tracking link access.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-black/50">
              Performance First
            </p>
            <p className="mt-2">
              Proven methods for oil seasoning, face repair, handle work,
              balancing, and long-term bat durability.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto w-[92%] max-w-6xl py-14">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-black/10 bg-[#2c2a2c] p-6 text-white sm:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Contact Us</p>
            <h2 className="mt-2 text-2xl sm:text-3xl">Workshop Details</h2>
            <div className="mt-5 space-y-3 text-sm text-white/80">
              <p>
                <span className="font-semibold text-white">Phone:</span> +94 77 718
                4814
              </p>
              <p>
                <span className="font-semibold text-white">Email:</span>{" "}
                doctorofbat@gmail.com
              </p>
              <p>
                <span className="font-semibold text-white">Service:</span> Pickup /
                delivery available after repair completion
              </p>
              <p>
                <span className="font-semibold text-white">Note:</span> Please contact
                us before courier dispatch
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-white">
            <iframe
              title="Doctor of Bat workshop location"
              src="https://maps.google.com/maps?q=doctor%20of%20bat%20sri%20lanka&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="h-[320px] w-full border-0 sm:h-full sm:min-h-[360px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-black/10 py-8">
        <div className="mx-auto flex w-[92%] max-w-6xl flex-col gap-3 text-sm text-black/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Dozen Digital Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/tracking" className="transition hover:text-[#ff7101]">
              Track Repair
            </Link>
            <Link href="/operation/login" className="transition hover:text-[#ff7101]">
              Staff Login
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
