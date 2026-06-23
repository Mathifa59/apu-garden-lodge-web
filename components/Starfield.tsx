// Posiciones fijas (no Math.random en cada render) para que el HTML del
// servidor y el del cliente coincidan exactamente — son solo decorativas.
const STARS = Array.from({ length: 70 }, (_, i) => {
  const seed = i * 137.508;
  return {
    top: (seed * 1.9) % 100,
    left: (seed * 3.7) % 100,
    size: 1 + ((i * 7) % 3),
    delay: (i % 10) * 0.34,
  };
});

export function Starfield() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {STARS.map((star, i) => (
        <span
          key={i}
          className="animate-twinkle absolute rounded-full bg-star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
