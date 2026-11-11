// A little lab-coated guide, drawn on the same pixel grid as the starters.
const PORTRAIT = [
  "........hh..hh..........",
  ".......hHHhhHHh.........",
  "......hHHHHHHHHh........",
  ".....hHHHHHHHHHHh.......",
  ".....hHssssssHHHh.......",
  ".....hsssssSSsHHh.......",
  ".....shhssshhsHh........",
  ".....sksSSsksSs.........",
  ".....ssssSsssSs.........",
  "......ssmmmssS..........",
  ".......sssssS...........",
  ".......cstsc............",
  ".....ccWtrtWcc..........",
  "....cWWWtrtWWWc.........",
  "...cWWWWtrtWWWWc........",
  "...cWWWWtrtWWWWc..rr....",
  "...cWWWWtrtWWWcc.rRrr...",
  "...cWWWctrtcWcc.kWkk...",
  "...cWWWctrtcWc..sWWs....",
  "...cWWcctrtcWcsssss.....",
  "...cWscctrtcWcSSS.......",
  "...ssscctrtcWWc.........",
  "....sscWWcWWWWc.........",
  ".....ccWWcWWWWc.........",
  "......cWWcWWWc..........",
  ".......bb.bbb...........",
  ".......bb.bbb...........",
  ".......bb.bbb...........",
  "......kkk.kkkk..........",
  ".....kkkk.kkkkk.........",
];

const PALETTE: Record<string, string> = {
  h: "#697080", H: "#d8dce2", s: "#edbb91", S: "#cd926d",
  k: "#303044", m: "#a26352", c: "#9aa5b6", W: "#ffffff",
  t: "#934b49", r: "#d75c58", R: "#ff8b7d", b: "#71604e",
};

export default function PixelProfessor() {
  return (
    <svg
      viewBox="0 0 24 32"
      width="120"
      height="160"
      role="img"
      aria-label="A friendly silver-haired professor in a white lab coat holding a Poké Ball"
      shapeRendering="crispEdges"
      className="pixel-professor"
    >
      <ellipse cx="12" cy="31" rx="8" ry="1" fill="#dce0ed" />
      {PORTRAIT.flatMap((row, y) =>
        [...row].map((pixel, x) => PALETTE[pixel] ? (
          <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={PALETTE[pixel]} />
        ) : null),
      )}
    </svg>
  );
}
