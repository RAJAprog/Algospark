// src/components/ui/ResizablePanels.jsx

import React, { useState, useCallback, useRef } from 'react';

const ResizablePanels = ({ leftPanel, rightPanel, bottomPanel }) => {
    const [leftWidth, setLeftWidth] = useState(50); // Initial width in percentage
    const containerRef = useRef(null);

    const handleMouseDown = useCallback(() => {
        const handleMouseMove = (e) => {
            if (containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
                // Constrain width between 20% and 80%
                if (newWidth > 20 && newWidth < 80) {
                    setLeftWidth(newWidth);
                }
            }
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, []);

    return (
        <div className="flex flex-col flex-grow overflow-hidden">
            <div ref={containerRef} className="flex flex-grow h-full">
                <div style={{ width: `${leftWidth}%` }} className="h-full overflow-y-auto">
                    {leftPanel}
                </div>

                <div
                    onMouseDown={handleMouseDown}
                    className="w-2 h-full bg-gray-700 cursor-col-resize hover:bg-blue-600 transition-colors"
                />

                <div style={{ width: `${100 - leftWidth}%` }} className="h-full">
                    {rightPanel}
                </div>
            </div>
            {bottomPanel && (
                <div className="h-64 flex-shrink-0 border-t-2 border-gray-700">
                    {bottomPanel}
                </div>
            )}
        </div>
    );
};

export default ResizablePanels;