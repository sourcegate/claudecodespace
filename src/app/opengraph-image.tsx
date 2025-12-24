import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Talk to Landing - Transform any talk into a landing page";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1a2744 0%, #2a3a5c 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: 20,
              lineHeight: 1.1,
            }}
          >
            Talk to Landing
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#c9a227",
              marginBottom: 40,
              maxWidth: 800,
            }}
          >
            Transform any talk into a landing page
          </div>
          <div
            style={{
              display: "flex",
              gap: 20,
              marginTop: 20,
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "16px 32px",
                borderRadius: 12,
                color: "#ffffff",
                fontSize: 20,
              }}
            >
              YouTube Videos
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "16px 32px",
                borderRadius: 12,
                color: "#ffffff",
                fontSize: 20,
              }}
            >
              Podcasts
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "16px 32px",
                borderRadius: 12,
                color: "#ffffff",
                fontSize: 20,
              }}
            >
              Transcripts
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 18,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Built by Thought Owner
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
