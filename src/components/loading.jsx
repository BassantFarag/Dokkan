import { motion } from "framer-motion";

/**
 * Loading Component
 * Features active celestial physics: orbiting planets, moving moons,
 * traveling energy comets, flowing dashed orbital streams, and responsive soundwaves.
 */
const Loading = () => {
  // Heights for the 6 central gold pillars matching the logo
    const barHeights = [40, 58, 78, 108, 86, 62];

  // Subtle floating background dust particles
    const dustParticles = [
        { id: 1, top: "16%", left: "14%", size: 3, delay: 0 },
        { id: 2, top: "22%", left: "76%", size: 2.5, delay: 0.8 },
        { id: 3, top: "74%", left: "20%", size: 3, delay: 1.4 },
        { id: 4, top: "84%", left: "82%", size: 2, delay: 0.4 },
        { id: 5, top: "32%", left: "89%", size: 3.5, delay: 1.8 },
        { id: 6, top: "58%", left: "9%", size: 2, delay: 1.1 },
        { id: 7, top: "14%", left: "60%", size: 2.5, delay: 0.6 },
        { id: 8, top: "87%", left: "36%", size: 2, delay: 1.6 },
        { id: 9, top: "40%", left: "26%", size: 2.5, delay: 2.1 },
        { id: 10, top: "28%", left: "38%", size: 2, delay: 0.9 },
        { id: 11, top: "66%", left: "67%", size: 3, delay: 1.3 },
        { id: 12, top: "76%", left: "94%", size: 2.5, delay: 0.7 },
    ];

    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-[#F8F4EE] dark:bg-[#181411] flex items-center justify-center select-none font-sans">
        {/* =========================================================
            BACKGROUND FINE GRID
            Moves horizontally from left to right
        ========================================================== */}

        <motion.div
        className="absolute inset-0 pointer-events-none opacity-45 dark:opacity-15"
        style={{
            backgroundImage: `
            linear-gradient(
                to right,
                rgba(175, 148, 118, 0.28) 1px,
                transparent 1px
            ),
            linear-gradient(
                to bottom,
                rgba(175, 148, 118, 0.28) 1px,
                transparent 1px
            )
            `,
            backgroundSize: "44px 44px",
        }}
        animate={{
            backgroundPosition: ["0px 0px", "44px 0px"],
        }}
        transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
        }}
        />

        {/* Center Soft Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_65%_55%_at_50%_50%,rgba(228,192,138,0.24),transparent_70%)] dark:bg-[radial-gradient(ellipse_65%_55%_at_50%_50%,rgba(215,165,95,0.12),transparent_70%)]" />

        {/* Floating Dust / Micro Stars */}
        {dustParticles.map((star) => (
            <motion.div
            key={star.id}
            className="absolute rounded-full bg-[#B89874] dark:bg-[#D5B895] pointer-events-none"
            style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
            }}
            animate={{
                opacity: [0.15, 0.85, 0.15],
                scale: [0.8, 1.3, 0.8],
                y: [0, -6, 0],
            }}
            transition={{
                duration: 3 + (star.id % 3),
                repeat: Infinity,
                delay: star.delay,
                ease: "easeInOut",
            }}
            />
        ))}

        {/* =========================================================
            ACTIVE CELESTIAL ORBITAL SYSTEM (SVG OVERLAY)
        ========================================================== */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            <svg
            viewBox="0 0 1400 800"
            className="w-full h-full min-w-[1100px] max-w-[1650px] object-contain opacity-95"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            >
            <defs>
                {/* Soft Glow Filter for nodes */}
                <filter id="goldHalo" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
                </filter>

                {/* Intense Node Glow */}
                <filter id="intenseGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
                </filter>

                {/* Core Node Gradient */}
                <radialGradient id="planetCoreGrad" cx="38%" cy="38%" r="62%">
                <stop offset="0%" stopColor="#8A674B" />
                <stop offset="55%" stopColor="#5E432F" />
                <stop offset="100%" stopColor="#3E2B1D" />
                </radialGradient>

                {/* Light Halo Gradient */}
                <radialGradient id="haloGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F5DCB1" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#D9AC6A" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#D9AC6A" stopOpacity="0" />
                </radialGradient>

                {/* Comet Tail Gradient */}
                <linearGradient id="cometTail" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4A76A" stopOpacity="0" />
                <stop offset="70%" stopColor="#D4A76A" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F5DCB1" stopOpacity="1" />
                </linearGradient>
            </defs>

            {/* ================= 1. GRAVITATIONAL WAVES (CENTER PULSES) ================= */}
            <g transform="translate(700, 400)">
                <motion.circle
                cx="0"
                cy="0"
                r="120"
                stroke="#D4A76A"
                strokeWidth="1"
                fill="none"
                animate={{
                    r: [90, 240],
                    opacity: [0.4, 0],
                    strokeWidth: [1.5, 0.5],
                }}
                transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeOut",
                }}
                />
                <motion.circle
                cx="0"
                cy="0"
                r="120"
                stroke="#C49A62"
                strokeWidth="1"
                fill="none"
                animate={{
                    r: [90, 240],
                    opacity: [0.4, 0],
                    strokeWidth: [1.5, 0.5],
                }}
                transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    delay: 2.25,
                    ease: "easeOut",
                }}
                />
            </g>

            {/* ================= 2. PRIMARY MAIN ORBITAL PLANE (Tilted -9°) ================= */}
            <g transform="rotate(-9, 700, 400)">
                {/* Outer Static Reference Ellipse */}
                <ellipse
                cx="700"
                cy="400"
                rx="640"
                ry="320"
                stroke="#D3BEA6"
                strokeWidth="1.2"
                strokeOpacity="0.6"
                />

                {/* FLOWING ENERGY DASHED ORBIT (Moves clockwise) */}
                <motion.ellipse
                cx="700"
                cy="400"
                rx="615"
                ry="305"
                stroke="#C9B197"
                strokeWidth="1.4"
                strokeDasharray="6 10"
                strokeOpacity="0.8"
                animate={{
                    strokeDashoffset: [0, -160],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                }}
                />

                {/* Mid Outer Ellipse */}
                <ellipse
                cx="700"
                cy="400"
                rx="540"
                ry="260"
                stroke="#D5C2AD"
                strokeWidth="1"
                strokeOpacity="0.5"
                />

                {/* FLOWING COUNTER-ENERGY DASHED ORBIT (Moves counter-clockwise) */}
                <motion.ellipse
                cx="700"
                cy="400"
                rx="490"
                ry="230"
                stroke="#C4A98D"
                strokeWidth="1.3"
                strokeDasharray="7 9"
                strokeOpacity="0.75"
                animate={{
                    strokeDashoffset: [0, 160],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                }}
                />

                {/* Inner Ellipse */}
                <ellipse
                cx="700"
                cy="400"
                rx="410"
                ry="185"
                stroke="#DAC8B5"
                strokeWidth="1"
                strokeOpacity="0.45"
                />

                {/* Sweeping Wide Orbital Ring Arcs */}
                <path
                d="M 50 380 Q 700 80 1350 360"
                stroke="#C8AE93"
                strokeWidth="1"
                strokeDasharray="4 6"
                strokeOpacity="0.6"
                />
                <path
                d="M 70 420 Q 700 710 1330 430"
                stroke="#D2BDAB"
                strokeWidth="1"
                strokeOpacity="0.55"
                />

                {/* Static Telemetry & Minor Dots */}
                <circle cx="210" cy="300" r="4.5" fill="#785B43" />
                <circle cx="340" cy="220" r="3.5" fill="#9C7E63" />
                <circle cx="450" cy="170" r="3" fill="#B39477" />
                <circle cx="1060" cy="180" r="3" fill="#8C6A49" />
                <circle cx="1180" cy="270" r="4" fill="#75563E" />
                <circle cx="1240" cy="450" r="4.5" fill="#694C35" />
                <circle cx="1140" cy="560" r="3.5" fill="#96775C" />
                <circle cx="980" cy="620" r="4" fill="#7E6047" />
                <circle cx="460" cy="610" r="3" fill="#A88B70" />
                <circle cx="260" cy="530" r="3.5" fill="#96775C" />
                <circle cx="160" cy="450" r="4" fill="#7D5E45" />

                {/* Hollow Ring Markers */}
                <circle cx="470" cy="95" r="5" stroke="#B89775" strokeWidth="1.4" fill="none" />
                <circle cx="270" cy="250" r="4" stroke="#B89775" strokeWidth="1.3" fill="none" />
                <circle cx="1190" cy="345" r="4.5" stroke="#B89775" strokeWidth="1.3" fill="none" />
                <circle cx="1050" cy="590" r="3.5" stroke="#B89775" strokeWidth="1.3" fill="none" />
                <circle cx="370" cy="480" r="4" stroke="#B89775" strokeWidth="1.3" fill="none" />
            </g>

            {/* ================= 3. SECONDARY CROSS-ORBITAL PLANE (Tilted +18°) ================= */}
            <g transform="rotate(18, 700, 400)">
                <ellipse
                cx="700"
                cy="400"
                rx="560"
                ry="210"
                stroke="#CDB79E"
                strokeWidth="1"
                strokeDasharray="4 8"
                strokeOpacity="0.4"
                />
                {/* Active Travelling Energy Photon on Cross-Orbit */}
                <motion.g
                animate={{
                    rotate: [0, 360],
                }}
                transition={{
                    duration: 16,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{ originX: "700px", originY: "400px" }}
                >
                <g transform="translate(1260, 400)">
                    <circle cx="0" cy="0" r="4" fill="#E6B86C" filter="url(#goldHalo)" />
                    <circle cx="0" cy="0" r="2.5" fill="#FFF4D9" />
                </g>
                </motion.g>
            </g>

            {/* ================= 4. TERTIARY POLAR ORBIT (Tilted -32°) ================= */}
            <g transform="rotate(-32, 700, 400)">
                <ellipse
                cx="700"
                cy="400"
                rx="470"
                ry="160"
                stroke="#CBB399"
                strokeWidth="0.9"
                strokeDasharray="3 7"
                strokeOpacity="0.35"
                />
                {/* Active Orbiter in Polar Orbit */}
                <motion.g
                animate={{
                    rotate: [360, 0],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{ originX: "700px", originY: "400px" }}
                >
                <g transform="translate(1170, 400)">
                    <circle cx="0" cy="0" r="3.5" fill="#8C6A49" />
                    <circle cx="0" cy="0" r="7" stroke="#D4A76A" strokeWidth="0.8" fill="none" />
                </g>
                </motion.g>
            </g>

            {/* ================= 5. FAST INNER CORE ORBIT (Tilted +6°) ================= */}
            <g transform="rotate(6, 700, 400)">
                <ellipse
                cx="700"
                cy="400"
                rx="260"
                ry="115"
                stroke="#D8BEA3"
                strokeWidth="0.9"
                strokeDasharray="5 5"
                strokeOpacity="0.45"
                />
                {/* Fast Inner Core Satellite 1 */}
                <motion.g
                animate={{
                    rotate: [0, 360],
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{ originX: "700px", originY: "400px" }}
                >
                <g transform="translate(960, 400)">
                    <circle cx="0" cy="0" r="3" fill="#DDAF64" filter="url(#goldHalo)" />
                    <circle cx="0" cy="0" r="1.8" fill="#FFFFFF" />
                </g>
                </motion.g>

                {/* Fast Inner Core Satellite 2 (Opposite side) */}
                <motion.g
                animate={{
                    rotate: [180, 540],
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{ originX: "700px", originY: "400px" }}
                >
                <g transform="translate(960, 400)">
                    <circle cx="0" cy="0" r="2.5" fill="#936D48" />
                </g>
                </motion.g>
            </g>

            {/* ================= 6. MAJOR CELESTIAL BODIES (WITH ACTIVE MOONS & OSCILLATION) ================= */}

            {/* 1. TOP-RIGHT LARGE GLOWING CELESTIAL NODE */}
            <motion.g
                animate={{
                x: [0, 8, -4, 0],
                y: [0, -6, 5, 0],
                }}
                transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                }}
                transform="translate(1080, 200)"
            >
                {/* Ambient Pulsing Golden Halo */}
                <motion.circle
                cx="0"
                cy="0"
                r="48"
                fill="url(#haloGrad)"
                animate={{
                    r: [44, 56, 44],
                    opacity: [0.7, 1, 0.7],
                }}
                transition={{
                    duration: 3.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                />
                {/* Outer Luminous Ring */}
                <motion.circle
                cx="0"
                cy="0"
                r="36"
                stroke="#DFB87E"
                strokeWidth="1.8"
                fill="none"
                filter="url(#intenseGlow)"
                animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.8, 1, 0.8],
                }}
                transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                />
                {/* Thin Middle Ring */}
                <circle cx="0" cy="0" r="28" stroke="#BFA07C" strokeWidth="1" fill="none" />

                {/* Core Dark Sphere */}
                <circle
                cx="0"
                cy="0"
                r="20"
                fill="url(#planetCoreGrad)"
                stroke="#D4A76A"
                strokeWidth="1.5"
                />

                {/* ACTIVE ORBITING MOON around Top-Right Planet */}
                <motion.g
                animate={{
                    rotate: [0, 360],
                }}
                transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "linear",
                }}
                >
                <g transform="translate(34, 0)">
                    <circle cx="0" cy="0" r="4" fill="#C5974F" stroke="#F5DCB1" strokeWidth="1" />
                </g>
                </motion.g>
            </motion.g>

            {/* 2. BOTTOM-LEFT LARGE GLOWING CELESTIAL NODE */}
            <motion.g
                animate={{
                x: [0, -7, 5, 0],
                y: [0, 6, -4, 0],
                }}
                transition={{
                duration: 8.5,
                repeat: Infinity,
                delay: 0.8,
                ease: "easeInOut",
                }}
                transform="translate(230, 540)"
            >
                {/* Ambient Pulsing Golden Halo */}
                <motion.circle
                cx="0"
                cy="0"
                r="46"
                fill="url(#haloGrad)"
                animate={{
                    r: [42, 53, 42],
                    opacity: [0.7, 1, 0.7],
                }}
                transition={{
                    duration: 3.6,
                    repeat: Infinity,
                    delay: 0.6,
                    ease: "easeInOut",
                }}
                />
                {/* Outer Luminous Ring */}
                <motion.circle
                cx="0"
                cy="0"
                r="34"
                stroke="#DFB87E"
                strokeWidth="1.8"
                fill="none"
                filter="url(#intenseGlow)"
                animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.8, 1, 0.8],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 0.4,
                    ease: "easeInOut",
                }}
                />
                {/* Thin Middle Ring */}
                <circle cx="0" cy="0" r="26" stroke="#BFA07C" strokeWidth="1" fill="none" />

                {/* Core Dark Sphere */}
                <circle
                cx="0"
                cy="0"
                r="19"
                fill="url(#planetCoreGrad)"
                stroke="#D4A76A"
                strokeWidth="1.5"
                />

                {/* ACTIVE ORBITING MOON around Bottom-Left Planet */}
                <motion.g
                animate={{
                    rotate: [360, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                }}
                >
                <g transform="translate(32, 0)">
                    <circle cx="0" cy="0" r="3.5" fill="#8C6A49" stroke="#DFB87E" strokeWidth="0.9" />
                </g>
                </motion.g>
            </motion.g>

            {/* 3. UPPER-LEFT CONCENTRIC NODE WITH PULSE */}
            <motion.g
                animate={{
                scale: [1, 1.08, 1],
                }}
                transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                }}
                transform="translate(330, 180)"
            >
                <circle cx="0" cy="0" r="16" stroke="#CBB194" strokeWidth="1.2" fill="none" />
                <circle cx="0" cy="0" r="10" fill="#71543E" stroke="#B89470" strokeWidth="1" />
            </motion.g>

            {/* 4. LOWER-LEFT CONCENTRIC NODE */}
            <g transform="translate(335, 625)">
                <circle cx="0" cy="0" r="13" stroke="#CBB194" strokeWidth="1.2" fill="none" />
                <circle cx="0" cy="0" r="8" fill="#71543E" />
            </g>

            {/* 5. TOP-CENTER-RIGHT SMALL CONCENTRIC NODE */}
            <g transform="translate(900, 240)">
                <circle cx="0" cy="0" r="10" stroke="#CBB194" strokeWidth="1" fill="none" />
                <circle cx="0" cy="0" r="5.5" fill="#71543E" />
            </g>

            {/* 6. BOTTOM-RIGHT MEDIUM SOLID NODE WITH GLOW */}
            <motion.g
                animate={{
                scale: [1, 1.06, 1],
                }}
                transition={{
                duration: 3.5,
                repeat: Infinity,
                delay: 1,
                ease: "easeInOut",
                }}
                transform="translate(1120, 615)"
            >
                <circle
                cx="0"
                cy="0"
                r="15"
                fill="#5A412F"
                stroke="#D6AA6D"
                strokeWidth="1.4"
                />
                <circle
                cx="0"
                cy="0"
                r="22"
                stroke="#D6AA6D"
                strokeWidth="0.8"
                strokeOpacity="0.5"
                fill="none"
                />
            </motion.g>

            {/* 7. FAR-RIGHT MEDIUM SOLID NODE */}
            <g transform="translate(1225, 430)">
                <circle cx="0" cy="0" r="12" fill="#5A412F" stroke="#B89470" strokeWidth="1" />
            </g>

            {/* 8. TOP-LEFT HOLLOW RING */}
            <g transform="translate(435, 60)">
                <circle cx="0" cy="0" r="8.5" stroke="#B89775" strokeWidth="1.6" fill="none" />
            </g>
            </svg>
        </div>

        {/* =========================================================
            CENTER CONTENT CONTAINER
        ========================================================== */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-2xl mx-auto">
            {/* ================= 1. GOLDEN PILLAR SOUNDWAVE LOGO ================= */}
            <div className="relative flex items-center justify-center gap-2.5 sm:gap-3.5 mb-7 h-32">
            {/* Subtle Ambient Logo Glow behind pillars */}
            <motion.div
                className="absolute -inset-6 rounded-full bg-[#E5B56E]/25 dark:bg-[#C99856]/15 blur-2xl pointer-events-none"
                animate={{
                scale: [0.9, 1.15, 0.9],
                opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                }}
            />

            {/* 6 Vertical Bars with Staggered Equalizer / Pulse Motion */}
            {barHeights.map((height, index) => {
                const delay = index * 0.14;
                return (
                <motion.div
                    key={index}
                    className="relative rounded-full shadow-[0_0_15px_rgba(214,166,94,0.45)] dark:shadow-[0_0_18px_rgba(214,166,94,0.3)]"
                    style={{
                    width: index === 3 ? "12px" : "10px",
                    height: `${height}px`,
                    background:
                        "linear-gradient(180deg, #DDB16C 0%, #C9974F 55%, #A77430 100%)",
                    }}
                    animate={{
                    scaleY: [1, 1.2, 0.86, 1.14, 1],
                    opacity: [0.92, 1, 0.85, 1, 0.92],
                    }}
                    transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    delay: delay,
                    ease: "easeInOut",
                    }}
                />
                );
            })}
            </div>

            {/* ================= 2. TITLE: PREPARING STORE ================= */}
            <div className="relative overflow-hidden mb-2">
            <motion.h1
                className="text-2xl sm:text-3xl md:text-[34px] font-black uppercase tracking-[0.24em] sm:tracking-[0.28em] text-[#2D231B] dark:text-[#EAE0D5]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                DOKKAN STORE
            </motion.h1>

            {/* Subtle Golden Shimmer / Scanner Sweep */}
            <motion.div
                className="absolute inset-y-0 -left-[100%] w-[60%] bg-gradient-to-r from-transparent via-amber-200/40 to-transparent pointer-events-none skew-x-[-25deg]"
                animate={{
                left: ["-100%", "200%"],
                }}
                transition={{
                duration: 3.5,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: "easeInOut",
                }}
            />
            </div>

            {/* ================= 3. SUBTITLE ================= */}
            <motion.p
            className="text-xs sm:text-sm md:text-base font-normal text-[#806F60] dark:text-[#A8988A] tracking-wider mb-5"
            animate={{
                opacity: [0.65, 0.95, 0.65],
            }}
            transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            >
            Setting everything up for you.....
            </motion.p>

            {/* ================= 4. THREE GLOWING BOUNCING DOTS ================= */}
            <div className="flex items-center justify-center gap-2.5 mb-10">
            {[0, 1, 2].map((dot) => (
                <motion.span
                key={dot}
                className="w-2.5 h-2.5 rounded-full bg-[#C29452] dark:bg-[#D8AB69] shadow-[0_0_10px_rgba(202,152,78,0.7)]"
                animate={{
                    y: [0, -6, 0],
                    scale: [1, 1.25, 1],
                    opacity: [0.45, 1, 0.45],
                }}
                transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: dot * 0.22,
                    ease: "easeInOut",
                }}
                />
            ))}
            </div>

            {/* ================= 5. BOTTOM STORE STATUS RAIL ================= */}
            <div className="w-full max-w-sm sm:max-w-md flex items-center justify-center gap-4">
            {/* Left Divider Line with light beam */}
            <div className="relative h-[1.5px] flex-1 overflow-hidden bg-[#59483B]/70 dark:bg-[#D5C2B1]/40">
                <motion.div
                className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-[#E8BA72] to-transparent"
                animate={{
                    x: ["-100%", "350%"],
                }}
                transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                />
            </div>

            {/* STORE text */}
            <span className="text-[11px] font-semibold tracking-[0.38em] text-[#695748] dark:text-[#C5B3A2] uppercase px-1">
                STORE
            </span>

            {/* Right Divider Line with light beam */}
            <div className="relative h-[1.5px] flex-1 overflow-hidden bg-[#59483B]/70 dark:bg-[#D5C2B1]/40">
                <motion.div
                className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-[#E8BA72] to-transparent"
                animate={{
                    x: ["-100%", "350%"],
                }}
                transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    delay: 0.5,
                    ease: "easeInOut",
                }}
                />
            </div>
            </div>
        </div>
        </main>
    );
};

export default Loading;