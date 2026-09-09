import { Reveal } from "./Reveal";
import { RevealMask } from "./RevealMask";

type Section = { heading: string; body: string[] };

// Layout compartido por /terminos y /privacidad — a diferencia del resto de
// páginas, sin foto de fondo en el header: son páginas de lectura, no de
// marketing, así que priorizan legibilidad (columna angosta, texto plano)
// sobre impacto visual.
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
          <h1 className="font-display text-4xl text-ink sm:text-5xl">{title}</h1>
          <p className="mt-4 text-ink-soft">{subtitle}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ink-soft/70">{lastUpdated}</p>
        </Reveal>

        <div className="mt-12 space-y-10">
          {sections.map((section, i) => (
            <RevealMask key={section.heading} delay={Math.min(i * 0.04, 0.3)}>
              <h2 className="font-display text-xl text-sage-deep">{section.heading}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-soft">
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
