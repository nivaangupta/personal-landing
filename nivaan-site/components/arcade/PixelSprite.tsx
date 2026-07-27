export type Px = [l: number, t: number, w: number, h: number, c: string];

export default function PixelSprite({
  pixels,
  size = 84,
  animation,
  style,
}: {
  pixels: Px[];
  size?: number;
  animation?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        imageRendering: "pixelated",
        animation,
        ...style,
      }}
    >
      {pixels.map(([l, t, w, h, c], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${l}%`,
            top: `${t}%`,
            width: `${w}%`,
            height: `${h}%`,
            background: c,
          }}
        />
      ))}
    </div>
  );
}
