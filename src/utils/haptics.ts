/**
 * Safe, cross-platform haptic feedback using the Web Vibration API.
 * Gracefully no-ops on desktop or unsupported devices.
 */
export type HapticType = 'success' | 'error' | 'hint' | 'tap';

export function triggerHaptic(type: HapticType = 'tap') {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
  if (!('vibrate' in navigator)) return;

  try {
    switch (type) {
      case 'success':
        navigator.vibrate(25);
        break;
      case 'error':
        navigator.vibrate([35, 45, 35]);
        break;
      case 'hint':
        navigator.vibrate(15);
        break;
      case 'tap':
        navigator.vibrate(10);
        break;
    }
  } catch {
    // Silent fallback if vibration permissions or hardware are unavailable
  }
}
