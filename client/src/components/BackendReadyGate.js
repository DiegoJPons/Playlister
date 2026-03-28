import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { getBackendRootUrl } from "../wakeBackend";

const POLL_MS = 2500;
const MAX_WAIT_MS = 120000;

/**
 * Blocks the UI until GET / on the API succeeds (handles Render cold starts).
 */
function BackendReadyGate({ children }) {
  const [phase, setPhase] = useState("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function waitForBackend() {
      setPhase("loading");
      const url = getBackendRootUrl();
      const deadline = Date.now() + MAX_WAIT_MS;

      while (Date.now() < deadline && !cancelled) {
        try {
          const res = await fetch(url, {
            method: "GET",
            mode: "cors",
            credentials: "omit",
          });
          if (res.ok) {
            if (!cancelled) setPhase("ready");
            return;
          }
        } catch (_) {
          /* network / CORS — retry */
        }
        await new Promise((r) => setTimeout(r, POLL_MS));
      }
      if (!cancelled) setPhase("error");
    }

    waitForBackend();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const handleRetry = () => setAttempt((a) => a + 1);

  if (phase === "ready") {
    return children;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        bgcolor: "#ffffe4",
        border: "2px solid black",
        boxSizing: "border-box",
      }}
    >
      {phase === "loading" ? (
        <>
          <CircularProgress sx={{ color: "#669966" }} />
          <Typography variant="body1" align="center">
            Connecting to server…
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            This can take up to a minute after the API has been idle.
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="body1" align="center">
            Could not reach the server in time.
          </Typography>
          <Button variant="contained" onClick={handleRetry} sx={{ bgcolor: "#669966" }}>
            Retry
          </Button>
        </>
      )}
    </Box>
  );
}

export default BackendReadyGate;
