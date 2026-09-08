import { NextResponse } from 'next/server';

export function GET() {
  const fingerprint = process.env.ANDROID_SHA256_CERT_FINGERPRINT?.trim();
  if (!fingerprint) {
    return NextResponse.json(
      [],
      { headers: { 'Cache-Control': 'public, max-age=300' } },
    );
  }

  return NextResponse.json(
    [
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: 'id.go.puskesmassomagede.portal',
          sha256_cert_fingerprints: [fingerprint],
        },
      },
    ],
    { headers: { 'Cache-Control': 'public, max-age=300' } },
  );
}
