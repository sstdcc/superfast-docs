---
id: building-apk
title: Building the Android APK
sidebar_label: Building APK
sidebar_position: 5
---

# Building the Android APK

SuperFast's Android app is built with **Tauri Android** — the same Rust/Next.js codebase wrapped for Android using Tauri's mobile target. The output is a standard `.apk` file.

## Prerequisites

### 1. Java Development Kit (JDK)

Install JDK 17 (required by Gradle):

```bash
# macOS (using Homebrew)
brew install openjdk@17

# Ubuntu/Debian
sudo apt install openjdk-17-jdk

# Windows: Download from https://adoptium.net/
```

Verify:
```bash
java -version
# openjdk version "17.x.x"
```

### 2. Android Studio & SDK

1. Download and install [Android Studio](https://developer.android.com/studio).
2. Open Android Studio → **SDK Manager** → install:
   - Android SDK Platform **API 34** (Android 14)
   - Android SDK Build-Tools **34.0.0**
   - Android NDK (Side by side) **r27** or newer
   - Android SDK Command-line Tools

### 3. Set Environment Variables

```bash
# Add to ~/.bashrc or ~/.zshrc (macOS/Linux)
export ANDROID_HOME=$HOME/Library/Android/sdk   # macOS
# export ANDROID_HOME=$HOME/Android/Sdk         # Linux

export NDK_HOME=$ANDROID_HOME/ndk/27.x.x        # use your installed NDK version
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
```

On **Windows**, set these via System → Environment Variables.

### 4. Rust Android Targets

```bash
rustup target add aarch64-linux-android    # ARM 64-bit (primary)
rustup target add armv7-linux-androideabi  # ARM 32-bit (optional)
rustup target add x86_64-linux-android     # x86_64 (for emulator)
```

Verify:
```bash
rustup target list --installed | grep android
```

---

## Step 1 — Initialize Tauri Android Project

Run this once to set up the Android project structure:

```bash
npm run tauri android init
```

This creates `src-tauri/gen/android/` with the Android Gradle project.

:::note
If you get errors about `ANDROID_HOME` not being set, ensure the environment variable is exported in the same shell session.
:::

---

## Step 2 — Configure App Capabilities

Edit `src-tauri/capabilities/mobile.json` to declare Android permissions:

```json
{
  "$schema": "../gen/schemas/mobile-schema.json",
  "identifier": "mobile-capability",
  "description": "Mobile permissions",
  "platforms": ["android", "iOS"],
  "windows": ["main"],
  "permissions": [
    "core:default",
    "core:path:default",
    "core:event:default",
    "sql:default",
    "fs:default",
    "notification:default",
    "biometric:default",
    "http:default"
  ]
}
```

---

## Step 3 — Build the Next.js Frontend

The Tauri Android build embeds the Next.js static export. Build it first:

```bash
npm run build
```

This produces the `out/` directory with the static HTML/CSS/JS.

---

## Step 4 — Build the APK

### Debug APK (for testing)

```bash
npm run tauri android build -- --apk --debug
```

The debug APK will be at:
```
src-tauri/gen/android/app/build/outputs/apk/debug/app-debug.apk
```

### Release APK (for distribution)

```bash
npm run tauri android build -- --apk
```

The release APK requires a signing keystore. See [Signing the APK](#signing-the-apk) below.

---

## Signing the APK

Release APKs must be signed with a keystore. Create one if you don't have it:

```bash
keytool -genkey -v \
  -keystore superfast-release.keystore \
  -alias superfast \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=SuperFast, OU=Dev, O=SuperFast, L=Sana'a, S=Yemen, C=YE"
```

Configure signing in `src-tauri/gen/android/app/build.gradle`:

```groovy
android {
    signingConfigs {
        release {
            storeFile file("../../../superfast-release.keystore")
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias "superfast"
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
        }
    }
}
```

Then build:
```bash
KEYSTORE_PASSWORD=yourpassword KEY_PASSWORD=yourpassword \
  npm run tauri android build -- --apk
```

---

## Step 5 — Install on Device

### Via ADB

```bash
# Enable USB Debugging on your Android device:
# Settings → Developer Options → USB Debugging → Enable

# Connect via USB, then:
adb devices
# Lists your device

adb install src-tauri/gen/android/app/build/outputs/apk/debug/app-debug.apk
```

### Via File Transfer

1. Copy the `.apk` file to your phone.
2. Open the file in a file manager.
3. Tap **Install**.
4. If prompted about unknown sources, see [Installation Guide](../getting-started/installation#android-apk).

---

## Common Issues

### "SDK location not found"

```
FAILURE: Build failed with an exception.
* What went wrong: SDK location not found.
```

Fix: Create `src-tauri/gen/android/local.properties`:
```properties
sdk.dir=/Users/your-user/Library/Android/sdk
```

### "NDK not found" or "No version of NDK matched"

Ensure the NDK is installed via Android Studio SDK Manager and `NDK_HOME` is set:
```bash
echo $NDK_HOME
ls $NDK_HOME  # Should list NDK contents
```

### Build hangs at Gradle download

First build downloads Gradle 8.x (~100 MB). Allow 5–10 minutes on first run.

### "error[E0463]: can't find crate for `core`"

The Android Rust target is not installed:
```bash
rustup target add aarch64-linux-android
```

### App crashes on launch (release build)

Check logcat for the error:
```bash
adb logcat -s "RustStdoutStderr" -d
```

Common causes:
- Missing SQLite plugin initialization
- Incorrect capability configuration
- Missing Android permissions in `AndroidManifest.xml`

---

## APK Size Optimization

The release APK is approximately 15–25 MB. To reduce size:

```bash
# Build only for arm64-v8a (drops x86 support, not needed for physical devices)
npm run tauri android build -- --apk --target aarch64-linux-android
```

This produces a 10–15 MB APK suitable for distribution.
