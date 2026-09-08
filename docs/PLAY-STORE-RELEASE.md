# Puskesmas Somagede — Google Play release

## GitHub Actions secrets

Add these repository secrets before running `Android Play Store Release`:

- `ANDROID_KEYSTORE_BASE64` — the permanent production keystore encoded with base64.
- `ANDROID_KEYSTORE_PASSWORD` — keystore password.
- `ANDROID_KEY_PASSWORD` — signing key password.
- `PLAY_SERVICE_ACCOUNT_JSON` — Google Play Developer API service-account JSON.

Never commit the keystore, service-account JSON, or passwords.

## Vercel environment

Set:

- `ANDROID_SHA256_CERT_FINGERPRINT` — the SHA-256 certificate fingerprint used by the Play-distributed app.

The app exposes Digital Asset Links at `/.well-known/assetlinks.json`.

## Release flow

1. Create a release tag, for example `v1.0.1`.
2. GitHub Actions builds a signed Android App Bundle (`.aab`).
3. The workflow publishes to the selected Google Play track (default: `internal`).
4. The workflow updates `public/app-version.json` so older installations can show an in-app update notice.
5. Promote the tested release to closed testing / production from Play Console.

## Important

The Android signing key must remain the same for all updates to the same Play app. Do not fall back to a temporary signing key for production releases.

Google Play App Signing is recommended. After the first Play upload, use the certificate fingerprint shown by Play Console for Digital Asset Links when appropriate.
