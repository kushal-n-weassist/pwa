const BouncingDots = () => (
    <span className="flex items-center justify-center gap-1">
        {[0, 1, 2, 3].map((i) => (
            <span
                key={i}
                style={{
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: "0.6s",
                    animationName: "bounceDot",
                    animationTimingFunction: "ease-in-out",
                    animationIterationCount: "infinite",
                    animationDirection: "alternate",
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#2196F3",
                }}
            />
        ))}
        <style>{`
            @keyframes bounceDot {
                0%   { transform: translateY(0); opacity: 0.4; }
                100% { transform: translateY(-8px); opacity: 1; }
            }
        `}</style>
    </span>
);


export default BouncingDots;