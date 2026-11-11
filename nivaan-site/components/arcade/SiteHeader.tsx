import PixelAvatar from "./PixelAvatar";

export default function SiteHeader() {
  return (
    <header className="trainer-id" aria-label="Nivaan Gupta’s trainer card">
      <div className="trainer-id-bar mono">
        <span>TRAINER CARD</span>
        <span className="trainer-id-number">ID No. 001</span>
      </div>
      <div className="trainer-id-body">
        <div className="trainer-id-details">
          <dl>
            <div>
              <dt className="mono">NAME</dt>
              <dd className="mono trainer-id-name">NIVAAN GUPTA</dd>
            </div>
            <div>
              <dt className="mono">REGION</dt>
              <dd>New York, NY</dd>
            </div>
          </dl>
          <div className="trainer-id-stamps" aria-hidden="true">
            {["#6bff8f", "#ff5f9e", "#ffcc33", "#c99a5b", "#4de3d4"].map((color) => (
              <span key={color} style={{ "--stamp": color } as React.CSSProperties} />
            ))}
          </div>
        </div>
        <div className="trainer-id-portrait" role="img" aria-label="Pixel portrait of Nivaan">
          <PixelAvatar size={104} />
          <span className="mono" aria-hidden="true">PLAYER 01</span>
        </div>
      </div>
    </header>
  );
}
