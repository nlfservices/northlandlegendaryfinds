/**
 * US Map Silhouette SVG - Lower 48 states outline
 * Used as a visual backdrop in the Card Shows hero section
 */

export default function USMapSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 960 600"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="mapStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* Lower 48 US outline - simplified path */}
      <path
        d="M 120 100 L 140 95 L 160 90 L 200 85 L 240 82 L 260 80 L 280 78 L 300 80 L 320 82 L 340 85 L 360 88 L 380 90 L 400 88 L 420 85 L 440 82 L 460 80 L 480 78 L 500 75 L 520 73 L 540 72 L 560 73 L 580 75 L 600 78 L 620 80 L 640 82 L 660 85 L 680 90 L 700 95 L 720 100 L 740 105 L 760 110 L 770 115 L 775 120 L 780 130 L 785 140 L 790 155 L 795 170 L 798 185 L 800 200 L 802 215 L 805 230 L 810 245 L 815 260 L 818 270 L 820 275 L 825 280 L 830 285 L 835 290 L 838 295 L 840 300 L 838 310 L 835 320 L 830 330 L 825 340 L 820 345 L 815 350 L 810 355 L 808 360 L 810 365 L 815 370 L 820 375 L 825 380 L 828 385 L 830 390 L 828 395 L 825 400 L 820 405 L 815 410 L 810 415 L 800 420 L 790 425 L 780 428 L 770 430 L 760 432 L 750 435 L 740 438 L 730 440 L 720 442 L 710 445 L 700 448 L 690 450 L 680 452 L 670 455 L 660 458 L 650 460 L 640 462 L 630 460 L 620 458 L 610 455 L 600 452 L 590 450 L 580 448 L 570 450 L 560 452 L 550 455 L 540 458 L 530 460 L 520 462 L 510 465 L 500 468 L 490 470 L 480 472 L 470 475 L 460 478 L 450 480 L 440 478 L 430 475 L 420 472 L 410 470 L 400 468 L 390 465 L 380 462 L 370 460 L 360 458 L 350 460 L 340 462 L 330 465 L 320 468 L 310 470 L 300 468 L 290 465 L 280 462 L 270 458 L 260 455 L 250 452 L 240 450 L 230 448 L 220 445 L 210 442 L 200 440 L 190 438 L 180 435 L 170 430 L 160 425 L 150 420 L 140 415 L 130 410 L 120 405 L 110 400 L 105 395 L 100 390 L 95 380 L 90 370 L 85 360 L 80 350 L 78 340 L 75 330 L 72 320 L 70 310 L 68 300 L 65 290 L 62 280 L 60 270 L 58 260 L 55 250 L 52 240 L 50 230 L 48 220 L 50 210 L 52 200 L 55 190 L 58 180 L 60 170 L 65 160 L 70 150 L 75 140 L 80 130 L 85 125 L 90 120 L 95 115 L 100 110 L 110 105 Z"
        fill="url(#mapGradient)"
        stroke="url(#mapStroke)"
        strokeWidth="1.5"
      />
      {/* State dots - major cities with shows */}
      {[
        // West
        { cx: 130, cy: 220, r: 3 }, // CA - LA
        { cx: 115, cy: 170, r: 2.5 }, // CA - SF
        { cx: 140, cy: 140, r: 2 }, // OR
        { cx: 175, cy: 300, r: 2.5 }, // AZ
        { cx: 220, cy: 200, r: 2 }, // NV
        { cx: 250, cy: 180, r: 2 }, // CO
        // Central
        { cx: 400, cy: 200, r: 2 }, // MN
        { cx: 430, cy: 250, r: 2 }, // IA
        { cx: 480, cy: 280, r: 2.5 }, // IL
        { cx: 510, cy: 270, r: 2 }, // IN
        { cx: 460, cy: 310, r: 2 }, // MO
        { cx: 380, cy: 350, r: 2 }, // KS
        { cx: 420, cy: 400, r: 2.5 }, // TX
        { cx: 480, cy: 380, r: 2 }, // LA
        { cx: 520, cy: 350, r: 2 }, // TN
        { cx: 530, cy: 310, r: 2 }, // KY
        // East
        { cx: 560, cy: 280, r: 2.5 }, // OH
        { cx: 600, cy: 260, r: 2 }, // PA
        { cx: 640, cy: 240, r: 3 }, // NY
        { cx: 660, cy: 260, r: 2.5 }, // NJ
        { cx: 620, cy: 290, r: 2 }, // MD
        { cx: 610, cy: 310, r: 2 }, // VA
        { cx: 590, cy: 340, r: 2 }, // NC
        { cx: 580, cy: 370, r: 2 }, // SC
        { cx: 560, cy: 390, r: 2 }, // GA
        { cx: 550, cy: 430, r: 2.5 }, // FL
        { cx: 670, cy: 250, r: 2 }, // CT
        { cx: 680, cy: 240, r: 2 }, // MA
        { cx: 690, cy: 230, r: 1.5 }, // ME
        { cx: 650, cy: 270, r: 2 }, // DE
        { cx: 520, cy: 290, r: 2 }, // WV
        { cx: 460, cy: 230, r: 2 }, // WI
        { cx: 500, cy: 250, r: 2 }, // MI
      ].map((dot, i) => (
        <circle
          key={i}
          cx={dot.cx}
          cy={dot.cy}
          r={dot.r}
          fill="currentColor"
          opacity="0.5"
        >
          <animate
            attributeName="opacity"
            values="0.3;0.7;0.3"
            dur={`${2 + (i % 5) * 0.5}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}
