type Props = {
  mousePos: { x: number; y: number };
  scrolled: boolean;
};

const AnimatedBackground = ({ mousePos, scrolled }: Props) => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="absolute w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full transition-all duration-700 ease-out"
        style={{
          left: mousePos.x - 300,
          top: mousePos.y - 300,
          opacity: scrolled ? 0.2 : 0.4
        }}
      ></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 400 400%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.03%22/%3E%3C/svg%3E')] opacity-[0.03]"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.08]"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[100px] rounded-full animate-pulse"></div>
    </div>
  );
};

export default AnimatedBackground;
