// // src/hooks/useProctoring.js

// import { useEffect, useCallback } from 'react';

// /**
//  * A helper function to request the browser to enter fullscreen mode.
//  * Must be called from a user-initiated event (e.g., a button click).
//  */
// export const requestFullScreen = () => {
//     const element = document.documentElement; // Get the root element of the page
//     if (element.requestFullscreen) {
//         element.requestFullscreen();
//     } else if (element.mozRequestFullScreen) { // Firefox
//         element.mozRequestFullScreen();
//     } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
//         element.webkitRequestFullscreen();
//     } else if (element.msRequestFullscreen) { // IE/Edge
//         element.msRequestFullscreen();
//     }
// };

// /**
//  * A custom hook to enforce anti-cheat measures during an exam.
//  * @param {() => void} onViolation - Callback function to execute when a violation is detected.
//  */
// export const useProctoring = (onViolation) => {
//     // useCallback ensures the functions are not recreated on every render.
//     const handleVisibilityChange = useCallback(() => {
//         if (document.visibilityState === 'hidden') {
//             console.warn('Proctoring Violation: Tab switched.');
//             onViolation();
//         }
//     }, [onViolation]);

//     const handleContextMenu = useCallback((e) => {
//         e.preventDefault();
//         console.warn('Proctoring Violation: Right-click blocked.');
//         onViolation();
//     }, [onViolation]);
    
//     const handleCopyPaste = useCallback((e) => {
//         e.preventDefault();
//         console.warn('Proctoring Violation: Copy/Paste blocked.');
//         onViolation();
//     }, [onViolation]);

//     // NEW: Handler for fullscreen change
//     const handleFullscreenChange = useCallback(() => {
//         // If document.fullscreenElement is null, it means the user has exited fullscreen
//         if (!document.fullscreenElement) {
//             console.warn('Proctoring Violation: Exited fullscreen mode.');
//             onViolation();
//         }
//     }, [onViolation]);

//     useEffect(() => {
//         // Add all event listeners when the hook is mounted.
//         document.addEventListener('visibilitychange', handleVisibilityChange);
//         document.addEventListener('contextmenu', handleContextMenu);
//         document.addEventListener('copy', handleCopyPaste);
//         document.addEventListener('paste', handleCopyPaste);
//         document.addEventListener('fullscreenchange', handleFullscreenChange); // NEW

//         // Cleanup function to remove all listeners when the component unmounts.
//         return () => {
//             document.removeEventListener('visibilitychange', handleVisibilityChange);
//             document.removeEventListener('contextmenu', handleContextMenu);
//             document.removeEventListener('copy', handleCopyPaste);
//             document.removeEventListener('paste', handleCopyPaste);
//             document.removeEventListener('fullscreenchange', handleFullscreenChange); // NEW
//         };
//     }, [handleVisibilityChange, handleContextMenu, handleCopyPaste, handleFullscreenChange]);

//     // This hook doesn't return any value; it just sets up listeners.
// };









// import { useEffect, useCallback } from 'react';

// /**
//  * Utility to request browser fullscreen. 
//  * Must be triggered by user action (e.g. "Start Exam" button).
//  */
// export const requestFullScreen = () => {
//     const el = document.documentElement;
//     const requestMethod = el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
//     if (requestMethod) {
//         requestMethod.call(el).catch(err => {
//             console.error(`Error attempting to enable full-screen mode: ${err.message}`);
//         });
//     }
// };

// /**
//  * Custom hook to enforce exam integrity.
//  * @param {Function} onViolation - Callback triggered on suspicious activity.
//  */
// export const useProctoring = (onViolation) => {
    
//     const handleViolation = useCallback((type) => {
//         console.warn(`Proctoring Violation Detected: ${type}`);
//         onViolation(type);
//     }, [onViolation]);

//     // 1. Tab Switching Detection
//     const handleVisibilityChange = useCallback(() => {
//         if (document.visibilityState === 'hidden') {
//             handleViolation('TAB_SWITCH');
//         }
//     }, [handleViolation]);

//     // 2. Fullscreen Exit Detection
//     const handleFullscreenChange = useCallback(() => {
//         if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement) {
//             handleViolation('FULLSCREEN_EXIT');
//         }
//     }, [handleViolation]);

//     // 3. Right Click (Context Menu) Block
//     const handleContextMenu = useCallback((e) => {
//         e.preventDefault();
//         handleViolation('RIGHT_CLICK');
//     }, [handleViolation]);
    
//     // 4. Copy/Paste Block
//     const handleCopyPaste = useCallback((e) => {
//         e.preventDefault();
//         handleViolation('COPY_PASTE');
//     }, [handleViolation]);

//     // 5. DevTools Shortcut Block (F12, Ctrl+Shift+I, etc.)
//     const handleKeyDown = useCallback((e) => {
//         if (
//             e.key === 'F12' || 
//             (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
//             (e.ctrlKey && e.key === 'U')
//         ) {
//             e.preventDefault();
//             handleViolation('DEV_TOOLS_SHORTCUT');
//         }
//     }, [handleViolation]);

//     useEffect(() => {
//         // Attach Listeners
//         document.addEventListener('visibilitychange', handleVisibilityChange);
//         document.addEventListener('fullscreenchange', handleFullscreenChange);
//         document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
//         document.addEventListener('mozfullscreenchange', handleFullscreenChange);
//         document.addEventListener('contextmenu', handleContextMenu);
//         document.addEventListener('copy', handleCopyPaste);
//         document.addEventListener('paste', handleCopyPaste);
//         window.addEventListener('keydown', handleKeyDown);

//         return () => {
//             // Detach Listeners
//             document.removeEventListener('visibilitychange', handleVisibilityChange);
//             document.removeEventListener('fullscreenchange', handleFullscreenChange);
//             document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
//             document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
//             document.removeEventListener('contextmenu', handleContextMenu);
//             document.removeEventListener('copy', handleCopyPaste);
//             document.removeEventListener('paste', handleCopyPaste);
//             window.removeEventListener('keydown', handleKeyDown);
//         };
//     }, [handleVisibilityChange, handleFullscreenChange, handleContextMenu, handleCopyPaste, handleKeyDown]);
// };











// import { useEffect, useCallback } from 'react';

// /**
//  * Utility to request browser fullscreen. 
//  * Must be triggered by a user-initiated event (e.g. "Start Exam" button).
//  */
// export const requestFullScreen = () => {
//     const el = document.documentElement;
//     const requestMethod = el.requestFullscreen || 
//                           el.webkitRequestFullScreen || 
//                           el.mozRequestFullScreen || 
//                           el.msRequestFullscreen;

//     if (requestMethod) {
//         requestMethod.call(el).catch(err => {
//             console.error(`Error attempting to enable full-screen mode: ${err.message}`);
//         });
//     }
// };

// /**
//  * Custom hook to enforce exam integrity.
//  * @param {Function} onViolation - Callback triggered on suspicious activity.
//  */
// export const useProctoring = (onViolation) => {
    
//     const handleViolation = useCallback((type) => {
//         // Log the violation locally for debugging
//         console.warn(`Proctoring Violation Detected: ${type}`);
//         // Pass the violation type to the parent component (to save to Firebase)
//         onViolation(type);
//     }, [onViolation]);

//     // 1. Tab Switching / Window Blur Detection
//     const handleVisibilityChange = useCallback(() => {
//         if (document.visibilityState === 'hidden') {
//             handleViolation('TAB_SWITCH');
//         }
//     }, [handleViolation]);

//     // 2. Fullscreen Exit Detection
//     const handleFullscreenChange = useCallback(() => {
//         const isFullscreen = document.fullscreenElement || 
//                              document.webkitFullscreenElement || 
//                              document.mozFullScreenElement ||
//                              document.msFullscreenElement;
                             
//         if (!isFullscreen) {
//             handleViolation('FULLSCREEN_EXIT');
//         }
//     }, [handleViolation]);

//     // 3. Right Click (Context Menu) Block
//     const handleContextMenu = useCallback((e) => {
//         e.preventDefault();
//         handleViolation('RIGHT_CLICK');
//     }, [handleViolation]);
    
//     // 4. Copy/Paste/Cut Block
//     const handleCopyPaste = useCallback((e) => {
//         e.preventDefault();
//         handleViolation('COPY_PASTE');
//     }, [handleViolation]);

//     // 5. DevTools Shortcut Block (F12, Ctrl+Shift+I, etc.)
//     const handleKeyDown = useCallback((e) => {
//         const isDevTools = 
//             e.key === 'F12' || 
//             (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
//             (e.ctrlKey && e.key === 'U') || // View Source
//             (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'j')); // Mac shortcuts

//         if (isDevTools) {
//             e.preventDefault();
//             handleViolation('DEV_TOOLS_SHORTCUT');
//         }
//     }, [handleViolation]);

//     useEffect(() => {
//         // Attach event listeners
//         document.addEventListener('visibilitychange', handleVisibilityChange);
//         document.addEventListener('fullscreenchange', handleFullscreenChange);
//         document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
//         document.addEventListener('mozfullscreenchange', handleFullscreenChange);
//         document.addEventListener('msfullscreenchange', handleFullscreenChange);
//         document.addEventListener('contextmenu', handleContextMenu);
//         document.addEventListener('copy', handleCopyPaste);
//         document.addEventListener('paste', handleCopyPaste);
//         document.addEventListener('cut', handleCopyPaste);
//         window.addEventListener('keydown', handleKeyDown);

//         return () => {
//             // Cleanup: remove all event listeners
//             document.removeEventListener('visibilitychange', handleVisibilityChange);
//             document.removeEventListener('fullscreenchange', handleFullscreenChange);
//             document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
//             document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
//             document.removeEventListener('msfullscreenchange', handleFullscreenChange);
//             document.removeEventListener('contextmenu', handleContextMenu);
//             document.removeEventListener('copy', handleCopyPaste);
//             document.removeEventListener('paste', handleCopyPaste);
//             document.removeEventListener('cut', handleCopyPaste);
//             window.removeEventListener('keydown', handleKeyDown);
//         };
//     }, [handleVisibilityChange, handleFullscreenChange, handleContextMenu, handleCopyPaste, handleKeyDown]);
// };













import { useEffect, useCallback } from 'react';

/**
 * Utility to request browser fullscreen. 
 * Must be triggered by a user-initiated event (e.g. "Enter Exam" button).
 */
export const requestFullScreen = () => {
    const el = document.documentElement;
    const requestMethod = el.requestFullscreen || 
                          el.webkitRequestFullScreen || 
                          el.mozRequestFullScreen || 
                          el.msRequestFullscreen;

    if (requestMethod) {
        requestMethod.call(el).catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    }
};

/**
 * Custom hook to enforce exam integrity.
 * @param {Function} onViolation - Callback triggered on suspicious activity.
 */
export const useProctoring = (onViolation) => {
    
    const handleViolation = useCallback((type) => {
        // Log the violation locally for debugging
        console.warn(`Proctoring Violation Detected: ${type}`);
        // Pass the violation type to the parent component (triggers auto-submit logic if count >= 3)
        if (onViolation) {
            onViolation(type);
        }
    }, [onViolation]);

    // 1. Tab Switching / Window Blur Detection
    const handleVisibilityChange = useCallback(() => {
        if (document.visibilityState === 'hidden') {
            handleViolation('TAB_SWITCH');
        }
    }, [handleViolation]);

    // 2. Fullscreen Exit Detection
    const handleFullscreenChange = useCallback(() => {
        const isFS = !!(document.fullscreenElement || 
                        document.webkitFullscreenElement || 
                        document.mozFullScreenElement || 
                        document.msFullscreenElement);
        
        if (!isFS) {
            handleViolation('FULLSCREEN_EXIT');
        }
    }, [handleViolation]);

    // 3. Right Click (Context Menu) Block
    const handleContextMenu = useCallback((e) => {
        e.preventDefault();
        handleViolation('RIGHT_CLICK');
    }, [handleViolation]);
    
    // 4. Copy/Paste/Cut Block
    const handleCopyPaste = useCallback((e) => {
        e.preventDefault();
        handleViolation('COPY_PASTE');
    }, [handleViolation]);

    // 5. Malpractice Key-Blocking Logic (F12, Ctrl+U, Meta, Alt, etc.)
    const handleKeyDown = useCallback((e) => {
        const key = e.key;
        const ctrl = e.ctrlKey;
        const shift = e.shiftKey;
        const meta = e.metaKey; // Windows/Command Key
        const alt = e.altKey;

        // Block DevTools shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C)
        const isDevTools = 
            key === 'F12' || 
            (ctrl && shift && (key === 'I' || key === 'J' || key === 'C' || key === 'i' || key === 'j' || key === 'c'));

        // Block View Source (Ctrl+U)
        const isViewSource = ctrl && (key === 'u' || key === 'U');

        // Block Print (Ctrl+P)
        const isPrint = ctrl && (key === 'p' || key === 'P');

        // Block Save (Ctrl+S)
        const isSave = ctrl && (key === 's' || key === 'S');

        // Block Search (Ctrl+F)
        const isSearch = ctrl && (key === 'f' || key === 'F');

        // Block System Keys (Meta/Windows, Alt)
        // Note: Alt+Tab cannot be fully blocked by browsers, but Alt can be detected
        const isSystemKey = key === 'Meta' || key === 'OS' || key === 'Alt';

        // Block Mac Specific DevTools (Meta+Alt+I)
        const isMacDevTools = meta && alt && (key === 'i' || key === 'I' || key === 'j' || key === 'J');

        if (isDevTools || isViewSource || isPrint || isSave || isSearch || isSystemKey || isMacDevTools) {
            e.preventDefault();
            e.stopPropagation();
            handleViolation('FORBIDDEN_KEY_COMBINATION');
        }
    }, [handleViolation]);

    // 6. Window Blur (Detecting if user clicks outside the window/Alt+Tab)
    const handleWindowBlur = useCallback(() => {
        handleViolation('WINDOW_FOCUS_LOST');
    }, [handleViolation]);

    useEffect(() => {
        // Attach event listeners to document and window
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('copy', handleCopyPaste);
        document.addEventListener('paste', handleCopyPaste);
        document.addEventListener('cut', handleCopyPaste);
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('blur', handleWindowBlur);

        return () => {
            // Cleanup: remove all event listeners
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopyPaste);
            document.removeEventListener('paste', handleCopyPaste);
            document.removeEventListener('cut', handleCopyPaste);
            
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('blur', handleWindowBlur);
        };
    }, [handleVisibilityChange, handleFullscreenChange, handleContextMenu, handleCopyPaste, handleKeyDown, handleWindowBlur]);
};