type Props = {
    mousePos: { x: number; y: number };
    scrolled: boolean;
}

const AnimatedBackground = ({ mousePos, scrolled }: Props) => {return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div 
      className="absolute w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full transition-all duration-1000 ease-out"
      style={{ 
        left: mousePos.x - 300, 
        top: mousePos.y - 300,
        opacity: scrolled ? 0.3 : 0.6
      }}
    ></div>
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150"></div>
    <div className="absolute inset-0 bg-grid-pattern opacity-[0.15]"></div>
    <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full animate-pulse-slow"></div>
  </div>
)};

export default AnimatedBackground;
