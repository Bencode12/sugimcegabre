import { useState, useEffect, useRef } from "react";

const ENVELOPE_W = 300;
const ENVELOPE_H = 200;
const FLAP_H = 100;
const DRAW_SPEED = 4; // pixels per frame

type Point = [number, number];

function lerp(a: Point, b: Point, t: number): Point {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function pathLength(points: Point[]): number {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i][0] - points[i - 1][0];
    const dy = points[i][1] - points[i - 1][1];
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return len;
}

function getDrawnPath(points: Point[], drawnLength: number): Point[] {
  const result: Point[] = [points[0]];
  let remaining = drawnLength;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i][0] - points[i - 1][0];
    const dy = points[i][1] - points[i - 1][1];
    const segLen = Math.sqrt(dx * dx + dy * dy);
    if (remaining >= segLen) {
      result.push(points[i]);
      remaining -= segLen;
    } else {
      const t = remaining / segLen;
      result.push(lerp(points[i - 1], points[i], t));
      break;
    }
  }
  return result;
}

function pointsToSvgPath(points: Point[]): string {
  if (points.length === 0) return "";
  return points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
}

const Index = () => {
  const [drawPhase, setDrawPhase] = useState<"drawing" | "done" | "opened">("drawing");
  const [drawnLength, setDrawnLength] = useState(0);
  const [paperY, setPaperY] = useState(0);
  const [flapAngle, setFlapAngle] = useState(0);
  const rafRef = useRef<number>(0);

  // Envelope shape paths (relative to center of canvas)
  const ox = 50;
  const oy = 80;

  // Body rectangle
  const body: Point[] = [
    [ox, oy],
    [ox + ENVELOPE_W, oy],
    [ox + ENVELOPE_W, oy + ENVELOPE_H],
    [ox, oy + ENVELOPE_H],
    [ox, oy],
  ];

  // Flap (triangle on top)
  const flap: Point[] = [
    [ox, oy],
    [ox + ENVELOPE_W / 2, oy + FLAP_H],
    [ox + ENVELOPE_W, oy],
  ];

  // All segments to draw in order
  const allPaths = [...body, ...flap];
  const totalLength = pathLength(allPaths);

  // Drawing animation
  useEffect(() => {
    if (drawPhase !== "drawing") return;
    let len = 0;
    const animate = () => {
      len += DRAW_SPEED;
      setDrawnLength(len);
      if (len < totalLength) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDrawPhase("done");
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawPhase, totalLength]);

  // Handle flap click - animate opening
  const handleFlapClick = () => {
    if (drawPhase !== "done") return;
    setDrawPhase("opened");
  };

  // Animate flap opening and paper rising
  useEffect(() => {
    if (drawPhase !== "opened") return;
    let angle = 0;
    let py = 0;
    const animate = () => {
      if (angle < 180) {
        angle += 3;
        setFlapAngle(Math.min(angle, 180));
      }
      if (angle > 60 && py < ENVELOPE_H + 120) {
        py += 2;
        setPaperY(py);
      }
      if (angle < 180 || py < ENVELOPE_H + 60) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawPhase]);

  // Load TikTok embed
  useEffect(() => {
    if (drawPhase === "opened") {
      setTimeout(() => {
        const script = document.createElement("script");
        script.src = "https://www.tiktok.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
      }, 1000);
    }
  }, [drawPhase]);

  const bodyLen = pathLength(body);
  const drawnBody = getDrawnPath(body, Math.min(drawnLength, bodyLen));
  const flapDrawn = drawnLength > bodyLen ? getDrawnPath(flap, drawnLength - bodyLen) : [];

  const canvasW = ENVELOPE_W + 100;
  const canvasH = ENVELOPE_H + FLAP_H + 100;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start pt-12 px-4">
      {/* Envelope area */}
      <div className="relative" style={{ width: canvasW, height: canvasH + (drawPhase === "opened" ? 300 : 0) }}>
        {/* Paper coming out - rises ABOVE the envelope */}
        {drawPhase === "opened" && paperY > 0 && (
          <div
            className="absolute left-1/2 bg-background border-2 border-foreground flex flex-col items-center"
            style={{
              width: ENVELOPE_W - 20,
              transform: `translateX(-50%)`,
              top: oy - paperY + FLAP_H,
              padding: "16px 8px",
              zIndex: 10,
            }}
          >
            {paperY > 100 && (
              <>
                <img
                  src="https://media.tenor.com/5TgGNNYp9dkAAAAM/cat-kiss.gif"
                  alt="Cat kiss"
                  className="w-40 h-auto mb-4"
                />
                <p className="text-foreground text-xl font-bold text-center">
                  Su gimtadieniu!
                </p>
              </>
            )}
          </div>
        )}

        {/* SVG envelope */}
        <svg
          width={canvasW}
          height={canvasH}
          className="relative"
          style={{ zIndex: 2 }}
        >
          {/* Drawn body */}
          <path
            d={pointsToSvgPath(drawnBody)}
            fill="none"
            stroke="black"
            strokeWidth="2"
          />

          {/* Filled body background (after drawing done) */}
          {drawPhase !== "drawing" && (
            <rect
              x={ox}
              y={oy}
              width={ENVELOPE_W}
              height={ENVELOPE_H}
              fill="white"
              stroke="black"
              strokeWidth="2"
            />
          )}

          {/* Drawn flap */}
          {drawPhase === "drawing" && flapDrawn.length > 0 && (
            <path
              d={pointsToSvgPath(flapDrawn)}
              fill="none"
              stroke="black"
              strokeWidth="2"
            />
          )}

          {/* Interactive flap (after drawing) */}
          {drawPhase !== "drawing" && (
            <g
              style={{
                transformOrigin: `${ox + ENVELOPE_W / 2}px ${oy}px`,
                transform: `rotateX(${flapAngle}deg)`,
                cursor: drawPhase === "done" ? "pointer" : "default",
              }}
              onClick={handleFlapClick}
            >
              <polygon
                points={`${ox},${oy} ${ox + ENVELOPE_W / 2},${oy + FLAP_H} ${ox + ENVELOPE_W},${oy}`}
                fill="white"
                stroke="black"
                strokeWidth="2"
              />
              {drawPhase === "done" && (
                <text
                  x={ox + ENVELOPE_W / 2}
                  y={oy + FLAP_H / 2 + 5}
                  textAnchor="middle"
                  fontSize="14"
                  fill="black"
                >
                  click me!
                </text>
              )}
            </g>
          )}
        </svg>
      </div>

      {/* TikTok embed below */}
      {drawPhase === "opened" && paperY > 100 && (
        <div className="mt-8 mb-12 flex justify-center w-full">
          <blockquote
            className="tiktok-embed"
            cite="https://www.tiktok.com/@tovstasraka/video/7596449873893920011"
            data-video-id="7596449873893920011"
            style={{ maxWidth: "605px", minWidth: "325px" }}
          >
            <section />
          </blockquote>
        </div>
      )}
    </div>
  );
};

export default Index;
