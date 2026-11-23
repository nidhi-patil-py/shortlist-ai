import { Capacitor } from '@capacitor/core'

/**
 * Checks whether the app is currently running inside a native mobile container
 * (e.g., Capacitor Android APK or iOS app) vs standard web browser.
 */
export function isCapacitorNative(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return Capacitor.isNativePlatform()
  } catch {
    return false
  }
}

/**
 * Returns active runtime platform ('android' | 'ios' | 'web')
 */
export function getCapacitorPlatform(): string {
  if (typeof window === 'undefined') return 'web'
  try {
    return Capacitor.getPlatform()
  } catch {
    return 'web'
  }
}

/**
 * Converts a browser Blob to base64 string (without data URL prefix)
 * for native filesystem storage
 */
export async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)

  // Use Buffer if available in Node / SSR / Testing environment
  const maybeBuffer = (globalThis as unknown as { Buffer?: { from: (b: Uint8Array) => { toString: (enc: string) => string } } }).Buffer
  if (maybeBuffer) {
    return maybeBuffer.from(bytes).toString('base64')
  }

  // Browser / WebView window.btoa conversion
  let binary = ''
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

/**
 * Native Android / iOS PDF Export:
 * Writes generated PDF to local device storage and invokes the native
 * Android share sheet (Save to Drive, Email, Bluetooth, WhatsApp, File Manager).
 * Dynamically loads plugins so web bundle size remains 0 KB impacted.
 */
export async function saveAndShareNativePDF(
  blob: Blob,
  filename: string
): Promise<boolean> {
  if (!isCapacitorNative()) {
    return false
  }

  try {
    const { Filesystem, Directory } = await import('@capacitor/filesystem')
    const { Share } = await import('@capacitor/share')

    const base64Data = await blobToBase64(blob)

    // Save to Cache directory for immediate native share intent
    const fileResult = await Filesystem.writeFile({
      path: filename,
      data: base64Data,
      directory: Directory.Cache,
    })

    // Open native Android system Share Sheet
    await Share.share({
      title: filename,
      text: `ATS-Compliant Resume: ${filename}`,
      url: fileResult.uri,
      dialogTitle: 'Save or Share Your ATS Resume',
    })

    return true
  } catch (err: unknown) {
    console.warn('Native mobile share failed, falling back to download:', err)
    return false
  }
}

/**
 * Hardware Back Button handler for Android navigation.
 * Allows Android users to press the hardware back button to navigate pages
 * rather than unexpectedly exiting the application.
 */
export async function registerAndroidBackButton(
  onBack: () => void,
  onExit?: () => void
): Promise<() => void> {
  if (!isCapacitorNative() || getCapacitorPlatform() !== 'android') {
    return () => {}
  }

  try {
    const { App } = await import('@capacitor/app')

    const listener = await App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        onBack()
      } else if (onExit) {
        onExit()
      } else {
        App.exitApp()
      }
    })

    return () => {
      listener.remove()
    }
  } catch (err) {
    console.warn('Could not register Android back button listener:', err)
    return () => {}
  }
}
