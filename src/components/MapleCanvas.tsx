import React from "react";

const CSS = `
  .bg{fill:#FDF6E8;}
  .tline{stroke:#7A5C10;stroke-width:0.65;opacity:0.45;}
  .bar{stroke:#8B6914;stroke-width:0.9;opacity:0.45;}
  .bar2{stroke:#8B6914;stroke-width:2;opacity:0.55;}
  .div{stroke:#A07828;stroke-width:0.4;opacity:0.35;stroke-dasharray:3,4;}
  .sec{font-family:Georgia,serif;font-size:10px;fill:#6B4C0A;opacity:0.75;letter-spacing:1.8px;}
  .hl{font-family:Georgia,serif;font-size:8.5px;fill:#5A3C0A;font-style:italic;}
  .ttl{font-family:Georgia,serif;font-size:15px;fill:#4A3008;font-weight:bold;}
  .sub{font-family:Georgia,serif;font-size:10px;fill:#7A5C10;letter-spacing:1px;}
  .met{font-family:Georgia,serif;font-size:9px;fill:#2A1A00;}
  .chn{font-family:Georgia,serif;font-size:10px;fill:#4A2800;font-weight:bold;}
  .lyr{font-family:Georgia,serif;font-size:10px;fill:#2A1A00;}
  .tn{font-family:Georgia,serif;font-size:9px;fill:#2A1A00;}
  .sl{font-family:Georgia,serif;font-size:8px;fill:#8B6914;opacity:0.65;}
  .cbox{fill:#FFF8EE;stroke:#B08030;stroke-width:0.8;}
  .cdot{fill:#4A2800;}
  .csub{font-family:Georgia,serif;font-size:8px;fill:#5A3C0A;}
  .fl{stroke:#8B6914;stroke-width:0.5;opacity:0.5;}
  .nut{stroke:#4A2800;stroke-width:1.5;opacity:0.7;}
  .pv{fill:#FFE0A0;stroke:#C09040;stroke-width:0.7;opacity:0.8;}
  .pf{font-family:Georgia,serif;font-size:8px;fill:#8B6914;opacity:0.45;letter-spacing:3px;}
  .rowsep{stroke:#8B6914;stroke-width:0.3;opacity:0.15;}
`;

export const MapleCanvas: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={794} height={1122} viewBox="0 0 794 1122" xmlns="http://www.w3.org/2000/svg">
    <defs><style>{CSS}</style></defs>

    <rect width="794" height="1122" className="bg" />
    <rect x="0" y="0" width="5" height="1122" fill="#C17F2A" opacity="0.55" />
    <rect x="5" y="0" width="2" height="1122" fill="#D4942F" opacity="0.25" />

    {/* Maple leaf watermarks */}
    <path
      d="M0,-18 C2,-14 8,-12 6,-6 C10,-8 14,-6 12,0 C16,-2 18,2 14,4 C18,6 16,12 10,10 C12,14 8,16 4,12 C4,16 0,18 0,14 C0,18 -4,16 -4,12 C-8,16 -12,14 -10,10 C-16,12 -18,6 -14,4 C-18,2 -16,-2 -12,0 C-14,-6 -10,-8 -6,-6 C-8,-12 -2,-14 0,-18 Z M0,-18 L0,20"
      fill="#8B3A00" opacity="0.09" transform="translate(380,130) scale(3.8) rotate(12)"
    />
    <path
      d="M0,-14 C1,-10 6,-9 4,-4 C8,-6 11,-4 9,0 C12,-1 14,2 11,3 C14,5 12,9 8,8 C9,11 6,13 3,10 C3,13 0,14 0,11 C0,14 -3,13 -3,10 C-6,13 -9,11 -8,8 C-12,9 -14,5 -11,3 C-14,2 -12,-1 -9,0 C-11,-4 -8,-6 -4,-4 C-6,-9 -1,-10 0,-14 Z M0,-14 L0,16"
      fill="#8B3A00" opacity="0.09" transform="translate(680,820) scale(3.2) rotate(-8)"
    />
    <path
      d="M0,-10 C1,-7 4,-6 3,-3 C5,-4 8,-3 6,0 C9,-1 10,1 8,2 C10,4 9,7 6,6 C7,8 4,9 2,7 C2,9 0,10 0,8 C0,10 -2,9 -2,7 C-4,9 -7,8 -6,6 C-9,7 -10,4 -8,2 C-10,1 -9,-1 -6,0 C-8,-3 -5,-4 -3,-3 C-4,-6 -1,-7 0,-10 Z M0,-10 L0,11"
      fill="#7A2800" opacity="0.14" transform="translate(55,530) scale(2.4) rotate(20)"
    />
    <path
      d="M0,-14 C1,-10 6,-9 4,-4 C8,-6 11,-4 9,0 C12,-1 14,2 11,3 C14,5 12,9 8,8 C9,11 6,13 3,10 C3,13 0,14 0,11 C0,14 -3,13 -3,10 C-6,13 -9,11 -8,8 C-12,9 -14,5 -11,3 C-14,2 -12,-1 -9,0 C-11,-4 -8,-6 -4,-4 C-6,-9 -1,-10 0,-14 Z M0,-14 L0,16"
      fill="#7A2800" opacity="0.14" transform="translate(720,380) scale(2) rotate(-25)"
    />

    {children}
  </svg>
);
