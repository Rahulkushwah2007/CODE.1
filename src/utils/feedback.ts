import React from 'react';

/**
 * Safe haptic feedback utility for mobile/tablet devices
 * Triggers hardware vibration on critical actions like FAB tap, booking confirmation, etc.
 */
export function triggerHaptic(pattern: number | number[] = [35, 25, 45]): void {
  try {
    if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  } catch {
    // Fail silently on unsupported devices or security policy
  }
}

/**
 * Creates visual ripple effect on buttons for Material Design feedback
 */
export function handleRipple(event: React.MouseEvent<HTMLElement>): void {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  const rect = button.getBoundingClientRect();
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.classList.add('ripple-wave');

  const ripple = button.getElementsByClassName('ripple-wave')[0];
  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
  setTimeout(() => {
    circle.remove();
  }, 600);
}

/**
 * Fast Haversine Distance in Kilometers
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in KM
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
