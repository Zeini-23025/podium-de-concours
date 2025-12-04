import { useEffect, useRef } from 'react';

/**
 * Custom hook for polling data at regular intervals
 * @param {Function} callback - Function to call on each poll
 * @param {number} interval - Polling interval in milliseconds (default: 5000)
 * @param {boolean} enabled - Whether polling is enabled (default: true)
 */
export const usePolling = (callback, interval = 5000, enabled = true) => {
  const savedCallback = useRef();

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    if (!enabled) return;

    const poll = () => {
      savedCallback.current();
    };

    // Initial call
    poll();

    // Set up interval
    const intervalId = setInterval(poll, interval);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [interval, enabled]);
};

