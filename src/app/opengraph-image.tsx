import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
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
          background: "#0d0d0a",
          color: "#efe8d8",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: -1,
          }}
        >
          FUTURE
          <span style={{ color: "#ff4423" }}>IX</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 66,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -2,
            maxWidth: 980,
          }}
        >
          Build Your Future With AI, Technology &amp; Digital Growth
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 28,
            color: "#cbff3d",
          }}
        >
          Digital Marketing · Web Development · AI Courses — Jaipur, Rajasthan
        </div>
      </div>
    ),
    { ...size }
  );
}
