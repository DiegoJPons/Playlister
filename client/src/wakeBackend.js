const backendBase =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

/** Normalized API origin (no trailing slash). */
export function getBackendRootUrl() {
  return `${backendBase.replace(/\/$/, "")}/`;
}

/**
 * Fire-and-forget GET / so a hosted API (e.g. Render) begins waking as soon as
 * the SPA loads, without opening the API URL in another tab.
 */
export function wakeBackend() {
  const url = getBackendRootUrl();
  fetch(url, { method: "GET", mode: "cors", credentials: "omit" }).catch(
    () => {}
  );
}
