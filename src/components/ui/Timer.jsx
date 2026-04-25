// import React, { useState, useEffect } from 'react';

// /**
//  * A reusable countdown timer component.
//  * @param {{
//  * duration: number, // Total time in seconds
//  * onComplete: () => void // Function to call when the timer finishes
//  * }} props
//  */
// const Timer = ({ duration, onComplete }) => {
//     const [timeLeft, setTimeLeft] = useState(duration);

//     useEffect(() => {
//         // Exit early if the timer is already at zero or an invalid duration is passed.
//         if (timeLeft <= 0) {
//             onComplete();
//             return;
//         }

//         // Set up an interval to decrease the time by 1 every second (1000 ms).
//         const intervalId = setInterval(() => {
//             setTimeLeft(prevTime => prevTime - 1);
//         }, 1000);

//         // This is a cleanup function. React runs this when the component
//         // is removed from the screen to prevent memory leaks.
//         return () => clearInterval(intervalId);
//     }, [timeLeft, onComplete]);

//     // Calculate minutes and seconds for display.
//     const minutes = Math.floor(timeLeft / 60);
//     const seconds = timeLeft % 60;

//     // Format the time to always show two digits (e.g., 09:05).
//     const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
//     // Change text color to red in the last minute for a visual warning.
//     const timerColorClass = timeLeft <= 60 ? 'text-red-400' : 'text-white';

//     return (
//         <div className={`text-2xl font-bold font-mono p-2 rounded-lg bg-gray-800 ${timerColorClass}`}>
//             <span>{formattedTime}</span>
//         </div>
//     );
// };

// export default Timer;

















import React, { useState, useEffect, useRef } from 'react';

/**
 * A reusable countdown timer component.
 * @param {{
 *   duration: number,    // Total time in SECONDS
 *   onComplete: () => void
 * }} props
 */
const Timer = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const onCompleteRef = useRef(onComplete);

  // Keep the ref current so the interval closure never goes stale
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    if (duration <= 0) { onCompleteRef.current?.(); return; }

    setTimeLeft(duration); // reset if duration prop changes

    const startedAt = Date.now();

    // Use wall-clock math so the display never drifts even if the tab is
    // backgrounded or the JS thread is busy.
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(id);
        onCompleteRef.current?.();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [duration]); // only re-runs if the duration prop itself changes

  const hours   = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const urgent = timeLeft <= 300; // last 5 minutes → red

  const formattedTime = hours > 0
    ? `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`
    : `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;

  return (
    <div className={`text-2xl font-bold font-mono p-2 rounded-lg bg-gray-800 ${urgent ? 'text-red-400' : 'text-white'}`}>
      {formattedTime}
    </div>
  );
};

export default Timer;
