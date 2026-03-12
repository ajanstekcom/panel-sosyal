import React, { useState, useCallback, useEffect } from 'react';
import MilyemCalculator from './Calculators/MilyemCalculator.jsx';
import CartSystem from './Sepet/CartSystem.jsx';

const RightPanel = ({ width, setWidth }) => {
    const [isResizing, setIsResizing] = useState(false);

    const startResizing = useCallback(() => {
        setIsResizing(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = useCallback((e) => {
        if (isResizing) {
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth > 350 && newWidth < 850) {
                setWidth(newWidth);
            }
        }
    }, [isResizing, setWidth]);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResizing);
        } else {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        }
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isResizing, resize, stopResizing]);

    return (
        <div
            className="right-panel"
            style={{
                width: `${width}px`,
                display: 'flex',
                background: 'var(--card)',
                borderLeft: '1px solid var(--border)',
                height: '100%',
                position: 'relative'
            }}
        >
            <div
                style={{
                    width: '6px',
                    cursor: 'col-resize',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 10,
                    transition: 'background 0.2s'
                }}
                onMouseDown={startResizing}
                onMouseEnter={(e) => e.target.style.background = 'rgba(0,122,255,0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
            />
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', scrollBehavior: 'smooth' }}>
                <MilyemCalculator />
                <div style={{ height: '32px' }} />
                <CartSystem />
                <div style={{ height: '40px' }} />
            </div>
        </div>
    );
};

export default RightPanel;
