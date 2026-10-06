import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#FAF6ED",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#4B5D3A",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 32, color: "#8A7F6E", letterSpacing: 2 }}>EVERYDAY NOURISH</div>
        </div>
        <div style={{ fontSize: 72, color: "#2B2620", fontWeight: 700, lineHeight: 1.1, display: "flex" }}>
          Your week, sorted.
        </div>
        <div style={{ fontSize: 32, color: "#8A7F6E", marginTop: 24, maxWidth: 900, display: "flex" }}>
          A practical Indian meal planner, balanced by default — with real sources instead of vague advice.
        </div>
      </div>
    ),
    { ...size }
  );
}
