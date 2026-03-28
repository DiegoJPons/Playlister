const backendBase =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

/**
 * Fire-and-forget GET / so a hosted API (e.g. Render) begins waking as soon as
 * the SPA loads, without opening the API URL in another tab.
 */
export function wakeBackend() {
  const url = `${backendBase.replace(/\/$/, "")}/`;
  fetch(url, { method: "GET", mode: "cors", credentials: "omit" }).catch(
    () => {}
  );
}
