import { useState, useEffect } from "react";

const Index = () => {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Start envelope animation after 1 second
    const openTimer = setTimeout(() => {
      setEnvelopeOpened(true);
    }, 1000);

    // Show content after envelope opens
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 3500);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  useEffect(() => {
    // Load TikTok embed script
    if (showContent) {
      const script = document.createElement("script");
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [showContent]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start py-12 px-4 overflow-x-hidden">
      {/* Envelope */}
      {!showContent && (
        <div className="relative w-72 h-48 mt-24">
          {/* Envelope body */}
          <div className="absolute inset-0 bg-primary rounded-lg shadow-2xl" />
          
          {/* Envelope flap */}
          <div
            className={`absolute top-0 left-0 right-0 h-24 bg-secondary origin-top ${
              envelopeOpened ? "animate-envelope-open" : ""
            }`}
            style={{
              clipPath: "polygon(0 0, 50% 100%, 100% 0)",
              transformStyle: "preserve-3d",
            }}
          />
          
          {/* Letter inside */}
          <div
            className={`absolute top-4 left-4 right-4 h-32 bg-card rounded shadow-lg flex items-center justify-center ${
              envelopeOpened ? "animate-letter-rise" : "opacity-0"
            }`}
          >
            <span className="text-2xl">💌</span>
          </div>
        </div>
      )}

      {/* Main content after envelope opens */}
      {showContent && (
        <div className="flex flex-col items-center gap-8 max-w-2xl w-full">
          {/* Cat kiss gif */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0s" }}
          >
            <img
              src="https://media.tenor.com/5TgGNNYp9dkAAAAM/cat-kiss.gif"
              alt="Cat kiss"
              className="w-64 h-auto rounded-2xl shadow-lg"
            />
          </div>

          {/* Birthday message */}
          <h1
            className="birthday-title text-center animate-fade-in-up animate-bounce-gentle"
            style={{ animationDelay: "0.3s" }}
          >
            Su gimtadieniu! 🎂
          </h1>

          {/* TikTok embed */}
          <div
            className="animate-fade-in-up w-full flex justify-center"
            style={{ animationDelay: "0.6s" }}
          >
            <blockquote
              className="tiktok-embed"
              cite="https://www.tiktok.com/@tovstasraka/video/7596449873893920011"
              data-video-id="7596449873893920011"
              style={{ maxWidth: "605px", minWidth: "325px" }}
            >
              <section />
            </blockquote>
          </div>

          {/* Decorative elements */}
          <div className="flex gap-4 text-4xl animate-bounce-gentle">
            <span>🎈</span>
            <span>🎁</span>
            <span>🎉</span>
            <span>✨</span>
            <span>🎈</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
