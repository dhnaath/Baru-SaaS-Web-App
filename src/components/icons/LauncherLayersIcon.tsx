import React from "react";

export interface LauncherLayersIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
}

/**
 * Custom 3-layer stacked rounded isometric diamond icon for the Launcher dock button.
 * The middle layer's upper border shows through the top layer using a dashed stroke.
 */
export function LauncherLayersIcon({
  size = 24,
  strokeWidth = 2,
  className = "",
  ...props
}: LauncherLayersIconProps) {
  const numericStroke = typeof strokeWidth === "number" ? strokeWidth : parseFloat(String(strokeWidth)) || 2;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={numericStroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Kotak 1 (Atas): penuh dengan sudut membulat */}
      <path d="M 10 3.8 Q 12 2.7 14 3.8 L 19 6.6 Q 21 7.7 19 8.8 L 14 11.6 Q 12 12.7 10 11.6 L 5 8.8 Q 3 7.7 5 6.6 Z" />

      {/* Kotak 2 (Tengah): penuh garis lurus solid menembus kotak 1 */}
      <path d="M 10 8.1 Q 12 7.0 14 8.1 L 19 10.9 Q 21 12.0 19 13.1 L 14 15.9 Q 12 17.0 10 15.9 L 5 13.1 Q 3 12.0 5 10.9 Z" />

      {/* Kotak 3 (Bawah): sisi luar bawah solid */}
      <path d="M 6.88 14.15 L 5 15.2 Q 3 16.3 5 17.4 L 10 20.2 Q 12 21.3 14 20.2 L 19 17.4 Q 21 16.3 19 15.2 L 17.12 14.15" />
    </svg>
  );
}
