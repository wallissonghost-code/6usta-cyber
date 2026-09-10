const preventGesture = event => event.preventDefault();

export function lockViewport() {
  document.documentElement.classList.add('viewport-locked');
  document.body.classList.add('viewport-locked');
  document.addEventListener('gesturestart', preventGesture, { passive: false });
  document.addEventListener('gesturechange', preventGesture, { passive: false });
  document.addEventListener('gestureend', preventGesture, { passive: false });
  document.addEventListener('dblclick', preventGesture, { passive: false });

  const sync = () => {
    const viewport = window.visualViewport;
    document.documentElement.style.setProperty('--app-height', `${viewport?.height || window.innerHeight}px`);
  };
  sync();
  window.addEventListener('resize', sync, { passive: true });
  window.visualViewport?.addEventListener('resize', sync, { passive: true });
  return sync;
}
