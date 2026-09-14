// Shared MongoDB connection state.
// Routes consult `dbState.connected` so that when MongoDB is unreachable they
// skip queries instantly instead of hanging for mongoose's server-selection
// timeout (~10s) before falling back to the in-memory seed engine.
export const dbState = { connected: false };
