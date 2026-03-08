import { useState, useEffect } from "react";

const Index = () => {
  const [phase, setPhase] = useState(0);
  const [typedText, setTypedText] = useState("");
  const fullText = ">>> opening_envelope.py";
  const birthdayText = "Su gimtadieniu!";
  const [birthdayTyped, setBirthdayTyped] = useState("");
  const [envelopeFrame, setEnvelopeFrame] = useState(0);

  const envelopeFrames = [
    `
  ___________
 /           \\
/_____________\\
|             |
|   CLOSED    |
|_____________|`,
    `
  ____/\\____
 /    \\/    \\
/____________\\
|             |
|             |
|_____________|`,
    `
  ___/    \\___
 /            \\
/              \\
|              |
|    <3  <3    |
|______________|`,
    `
  __/        \\__
 /              \\
|    OPEN!!!     |
|                |
|   ♥  ♥  ♥     |
|________________|`,
  ];

  // Phase 0: typewriter for command
  useEffect(() => {
    if (phase === 0) {
      let i = 0;
      const interval = setInterval(() => {
        setTypedText(fullText.slice(0, i + 1));
        i++;
        if (i >= fullText.length) {
          clearInterval(interval);
          setTimeout(() => setPhase(1), 800);
        }
      }, 80);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Phase 1: envelope animation frames
  useEffect(() => {
    if (phase === 1) {
      let frame = 0;
      const interval = setInterval(() => {
        frame++;
        setEnvelopeFrame(frame);
        if (frame >= envelopeFrames.length - 1) {
          clearInterval(interval);
          setTimeout(() => setPhase(2), 1000);
        }
      }, 800);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Phase 2: show content, type birthday text
  useEffect(() => {
    if (phase === 2) {
      let i = 0;
      const interval = setInterval(() => {
        setBirthdayTyped(birthdayText.slice(0, i + 1));
        i++;
        if (i >= birthdayText.length) {
          clearInterval(interval);
          setTimeout(() => setPhase(3), 500);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Phase 3: load tiktok
  useEffect(() => {
    if (phase === 3) {
      const script = document.createElement("script");
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [phase]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-mono">
      <div className="max-w-2xl mx-auto">
        {/* Terminal header */}
        <div className="text-muted-foreground text-sm mb-2">
          birthday_surprise.py v1.0
        </div>
        <div className="border border-border p-1 mb-4">
          <div className="flex gap-2 text-xs text-muted-foreground mb-2">
            <span>[=]</span>
            <span>[□]</span>
            <span>[x]</span>
          </div>
          <hr className="border-border" />
        </div>

        {/* Typewriter command */}
        <div className="text-foreground mb-4">
          <span>{typedText}</span>
          {phase === 0 && <span className="cursor-blink" />}
        </div>

        {/* Envelope ASCII animation */}
        {phase >= 1 && (
          <pre className="text-foreground text-sm md:text-base mb-6 leading-tight">
            {envelopeFrames[envelopeFrame]}
          </pre>
        )}

        {phase >= 1 && envelopeFrame >= envelopeFrames.length - 1 && (
          <div className="text-muted-foreground text-sm mb-4">
            &gt;&gt;&gt; envelope opened successfully!
          </div>
        )}

        {/* Content after envelope */}
        {phase >= 2 && (
          <div className="flex flex-col items-center gap-6 mt-8">
            <div className="text-muted-foreground text-sm">
              &gt;&gt;&gt; loading cat_kiss.gif ...
            </div>
            <div className="ascii-border p-2">
              <img
                src="https://media.tenor.com/5TgGNNYp9dkAAAAM/cat-kiss.gif"
                alt="Cat kiss"
                className="w-56 h-auto"
                style={{ imageRendering: "auto" }}
              />
            </div>

            <div className="text-center mt-4">
              <div className="text-muted-foreground text-sm mb-2">
                &gt;&gt;&gt; print(message)
              </div>
              <h1 className="text-3xl md:text-5xl text-accent font-bold">
                {birthdayTyped}
                {phase === 2 && <span className="cursor-blink" />}
              </h1>
            </div>

            {phase >= 3 && (
              <div className="mt-6 w-full flex flex-col items-center">
                <div className="text-muted-foreground text-sm mb-2">
                  &gt;&gt;&gt; loading tiktok_embed() ...
                </div>
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

            <div className="text-foreground text-sm mt-8">
              &gt;&gt;&gt; print("🎂 🎈 🎁 🎉 ✨")
              <br />
              🎂 🎈 🎁 🎉 ✨
            </div>

            <div className="text-muted-foreground text-xs mt-4">
              Process finished with exit code 0 (birthday_success)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
