import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Brand-aligned favicon: burgundy square, white "K" centred,
// matching the 60 (white surface) / 30 (black ink) / 10 (burgundy accent) palette.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#6D001A",
          color: "#FFFFFF",
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          fontFamily:
            "system-ui, -apple-system, Helvetica, Arial, sans-serif",
          borderRadius: 6,
        }}
      >
        K
      </div>
    ),
    { ...size },
  );
}
