import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f3ff 50%, #dbeeff 100%)',
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(10, 102, 194, 0.08)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-60px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(10, 102, 194, 0.05)',
            display: 'flex',
          }}
        />

        {/* Top bar — LinkedIn blue accent */}
        <div
          style={{
            width: '100%',
            height: '6px',
            background: 'linear-gradient(90deg, #0A66C2, #0077B5, #00A0DC)',
            display: 'flex',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '60px 80px',
            flex: 1,
          }}
        >
          {/* Logo + badge row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: '#0A66C2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: 800,
              }}
            >
              in
            </div>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#0A66C2',
              }}
            >
              linkedinformatter-xi.vercel.app
            </span>
            <div
              style={{
                marginLeft: 'auto',
                background: '#dcfce7',
                color: '#16a34a',
                fontSize: '14px',
                fontWeight: 700,
                padding: '6px 16px',
                borderRadius: '999px',
                border: '1.5px solid #bbf7d0',
                display: 'flex',
              }}
            >
              100% FREE
            </div>
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: '62px',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.05,
              marginBottom: '20px',
              letterSpacing: '-2px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>LinkedIn Text</span>
            <span style={{ color: '#0A66C2' }}>Formatter</span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '22px',
              color: '#475569',
              marginBottom: '44px',
              lineHeight: 1.4,
              display: 'flex',
            }}
          >
            Bold · Italic · Script · Monospace · 20+ Unicode styles
          </div>

          {/* Style preview pills */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: '𝗕𝗼𝗹𝗱', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
              { label: '𝘐𝘵𝘢𝘭𝘪𝘤', bg: '#fdf4ff', color: '#7e22ce', border: '#e9d5ff' },
              { label: '𝔉𝔯𝔞𝔨𝔱𝔲𝔯', bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
              { label: '𝕯𝖔𝖚𝖇𝖑𝖊', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
              { label: '𝒮𝒸𝓇𝒾𝓅𝓉', bg: '#fff1f2', color: '#be123c', border: '#fecdd3' },
              { label: '𝙼𝚘𝚗𝚘', bg: '#f8fafc', color: '#334155', border: '#cbd5e1' },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: s.bg,
                  color: s.color,
                  border: `1.5px solid ${s.border}`,
                  borderRadius: '10px',
                  padding: '8px 20px',
                  fontSize: '20px',
                  fontWeight: 600,
                  display: 'flex',
                }}
              >
                {s.label}
              </div>
            ))}
          </div>

          {/* Bottom feature row */}
          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              gap: '32px',
              paddingTop: '24px',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            {[
              '⚡ Slash Commands',
              '📊 Post Score',
              '📱 Device Preview',
              '📥 Markdown Import',
              '🚀 No Sign-up',
            ].map((f) => (
              <span
                key={f}
                style={{
                  fontSize: '15px',
                  color: '#64748b',
                  fontWeight: 500,
                  display: 'flex',
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
