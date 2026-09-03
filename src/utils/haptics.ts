/**
 * Web Vibration API utility for tactile mobile feedback in Flaggle.
 * Safe for SSR and browsers without vibration support.
 */

export const hapticSuccess = (): void => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(25);
    } catch {
      // Ignore vibration errors on unsupported or permission-blocked devices
    }
  }
};

export const hapticError = (): void => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([35, 50, 35]);
    } catch {
      // Ignore vibration errors
    }
  }
};

export const hapticTap = (): void => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(10);
    } catch {
      // Ignore vibration errors
    }
  }
};
