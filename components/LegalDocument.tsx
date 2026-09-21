import { MountainMark } from "./MountainMark";
import { Reveal } from "./Reveal";
import { RevealMask } from "./RevealMask";

type Section = { heading: string; body: string[] };

// Layout compartido por /terminos y /privacidad — a diferencia del resto de
// páginas, sin foto de fondo en el header: son páginas de lectura, no de
// marketing, así que priorizan legibilidad (columna angosta, texto plano)
// sobre impacto visual. El toque de marca acá es deliberadamente chico (el
// ícono + la línea de acento en cada h2), no un hero — que compita con la
// lectura sería lo opuesto de lo que pide esta página.
export function LegalDocument({
  title,
  subtitle,
  lastUpdated,
  sections,
}: {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Section[];
}) {
  return (
    <div className="bg-sand px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-sage-pale bg-cream-soft text-sage-deep">
            <MountainMark className="h-5 w-5" />
          </span>
          <h1 className="mt-5 font-display text-4xl text-ink sm:text-5xl">{title}</h1>
          <p className="mt-4 text-ink-soft">{subtitle}</p>
          <span className="mt-3 inline-block rounded-full border border-sage-pale bg-cream-soft px-3 py-1 text-xs uppercase tracking-[0.2em] text-ink-soft/80">
            {lastUpdated}
          </span>
        </Reveal>

        <div className="mt-12 space-y-10">
          {sections.map((section, i) => (
            <RevealMask key={section.heading} delay={Math.min(i * 0.04, 0.3)}>
              <h2 className="border-l-2 border-terracotta/50 pl-4 font-display text-xl text-sage-deep">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3 pl-4 text-sm leading-relaxed text-ink-soft">
                {section.body.map((paragraph, j) => (
                  <p key={j}>{paragraph}</p>
                ))}
              </div>
            </RevealMask>
          ))}
        </div>
      </div>
    </div>
  );
}
