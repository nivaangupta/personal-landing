type Pixel = {
  l: number;
  t: number;
  w: number;
  h: number;
  c: string;
  blink?: boolean;
};

// Pixel-art trainer sprite — teal beanie, pink earmuffs, gold jacket trim.
const PIXELS: Pixel[] = [
  { l: 25, t: 0, w: 50, h: 6.25, c: "#4de3d4" },
  { l: 18.75, t: 6.25, w: 6.25, h: 25, c: "#4de3d4" },
  { l: 75, t: 6.25, w: 6.25, h: 25, c: "#4de3d4" },
  { l: 12.5, t: 25, w: 12.5, h: 25, c: "#ff5f9e" },
  { l: 75, t: 25, w: 12.5, h: 25, c: "#ff5f9e" },
  { l: 25, t: 6.25, w: 50, h: 18.75, c: "#2e1f16" },
  { l: 25, t: 25, w: 50, h: 37.5, c: "#f2c9a0" },
  { l: 25, t: 25, w: 25, h: 6.25, c: "#2e1f16" },
  { l: 31.25, t: 37.5, w: 6.25, h: 6.25, c: "#1b1b2b", blink: true },
  { l: 62.5, t: 37.5, w: 6.25, h: 6.25, c: "#1b1b2b", blink: true },
  { l: 43.75, t: 56.25, w: 12.5, h: 6.25, c: "#b06a52" },
  { l: 43.75, t: 62.5, w: 12.5, h: 12.5, c: "#e0b48c" },
  { l: 18.75, t: 68.75, w: 62.5, h: 31.25, c: "#1e2a52" },
  { l: 37.5, t: 68.75, w: 25, h: 6.25, c: "#f2c9a0" },
  { l: 18.75, t: 87.5, w: 62.5, h: 6.25, c: "#ffcc33" },
];

export default function PixelAvatar({
  size = 48,
  className = "",
  onClick,
  title,
}: {
  size?: number;
  className?: string;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <div
      className={`pixel ${className}`}
      onClick={onClick}
      title={title}
      style={{ width: size, height: size }}
    >
      {PIXELS.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.l}%`,
            top: `${p.t}%`,
            width: `${p.w}%`,
            height: `${p.h}%`,
            background: p.c,
            transformOrigin: "center",
            animation: p.blink ? "blinkEye 4.4s infinite" : undefined,
          }}
        />
      ))}
    </div>
  );
}
