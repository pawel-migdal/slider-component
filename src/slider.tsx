import { useEffect, useRef, useState } from 'react';
import './slider.css';

interface SliderProps {
    position: { x: number, y: number };
    setPosition: (position: { x: number, y: number }) => void;
    tracker?: boolean;
    grid?: boolean;
    labels?: {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
        topEmoji?: string;
        rightEmoji?: string;
        bottomEmoji?: string;
        leftEmoji?: string;
    };
}

function Slider({ position, setPosition, tracker, grid, labels }: SliderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [canvasCenter, setCanvasCenter] = useState({ x: 250, y: 250 });
    const [canvasSize, setCanvasSize] = useState({ width: 500, height: 500 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // if grid is true, draw the grid
        if (grid) {
            // Draw main axes with default style
            ctx.save();
            ctx.strokeStyle = 'black';
            ctx.setLineDash([]);

            // Draw X axis
            ctx.beginPath();
            ctx.moveTo(canvasCenter.x, 0);
            ctx.lineTo(canvasCenter.x, canvas.height);
            ctx.stroke();

            // Draw Y axis
            ctx.beginPath();
            ctx.moveTo(0, canvasCenter.y);
            ctx.lineTo(canvas.width, canvasCenter.y);
            ctx.stroke();

            ctx.restore();
        }

        // if tracker is true, draw the tracker first (behind other elements)
        if (tracker) {

            ctx.save();

            ctx.strokeStyle = 'blue';
            ctx.setLineDash([5, 5]);

            // Draw tracker lines following the selector position
            ctx.beginPath();
            ctx.moveTo(position.x, 0);
            ctx.lineTo(position.x, canvas.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, position.y);
            ctx.lineTo(canvas.width, position.y);
            ctx.stroke();

            ctx.restore();
        }

        ctx.save();


        // Draw selector
        ctx.beginPath();
        ctx.arc(position.x, position.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
    }, [position, canvasCenter, tracker, grid]);

    // Effect for canvas resizing
    useEffect(() => {
        const updateCanvasSize = () => {
            const container = containerRef.current;
            const canvas = canvasRef.current;
            if (!container || !canvas) return;

            // Get the actual rendered width of the container
            const containerWidth = container.clientWidth;

            // Set the canvas dimensions to match its container
            canvas.width = containerWidth;
            canvas.height = containerWidth;


            setCanvasSize({ width: containerWidth, height: containerWidth });
            setCanvasCenter({ x: containerWidth / 2, y: containerWidth / 2 });

            // Adjust position proportionally if needed
            if (position.x > 0 && position.y > 0) {
                const scaleRatio = containerWidth / 500; // Compare to default size
                // Only adjust if it's a significant change
                if ((1 - scaleRatio) > 0.1) {
                    setPosition({
                        x: position.x * scaleRatio,
                        y: position.y * scaleRatio
                    });
                }
            } else {
                // Initialize position to center if not already set
                setPosition({ x: containerWidth / 2, y: containerWidth / 2 });
            }
        };

        updateCanvasSize();

        // Setup resize listener
        const handleResize = () => {
            updateCanvasSize();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);



    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if click is within the selector
        const dx = x - position.x;
        const dy = y - position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= 20) {
            setIsDragging(true);
        }
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
        const touch = e.touches[0];
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        const dx = x - position.x;
        const dy = y - position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= 20) {
            setIsDragging(true);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Keep selector within canvas bounds
        const boundedX = Math.max(20, Math.min(canvas.width - 20, x));
        const boundedY = Math.max(20, Math.min(canvas.height - 20, y));

        setPosition({ x: boundedX, y: boundedY });
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        const boundedX = Math.max(20, Math.min(canvas.width - 20, x));
        const boundedY = Math.max(20, Math.min(canvas.height - 20, y));

        setPosition({ x: boundedX, y: boundedY });
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDragging(false);
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
        setIsDragging(false);
    };

    const handleTouchCancel = (e: React.TouchEvent<HTMLCanvasElement>) => {
        setIsDragging(false);
    };

    // Add getNormalizedCoordinates function to get coordinates in the mathematical plane
    const getNormalizedCoordinates = () => {
        return {
            x: Math.round(position.x - canvasCenter.x),
            y: Math.round(-(position.y - canvasCenter.y))
        };
    };

    return (
        <div className="slider-wrapper">
            {/* Top label with emoji */}
            {labels?.top && (
                <div className="slider-label top">
                    {labels.topEmoji && <div className="slider-emoji">{labels.topEmoji}</div>}
                    <div className="slider-text">{labels.top}</div>
                </div>
            )}

            <div className="slider-row">
                {/* Left label with emoji */}
                {labels?.left && (
                    <div className="slider-label left">
                        {labels.leftEmoji && <div className="slider-emoji">{labels.leftEmoji}</div>}
                        <div className="slider-text">{labels.left}</div>
                    </div>
                )}

                {/* Main slider container */}
                <div className="slider-container" ref={containerRef}>
                    <canvas
                        id="canvas"
                        style={{
                            border: '5px solid black',
                            width: '100%',
                            height: 'auto',
                            display: 'block'
                        }}
                        ref={canvasRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onTouchCancel={handleTouchCancel}
                    />
                </div>

                {/* Right label with emoji */}
                {labels?.right && (
                    <div className="slider-label right">
                        {labels.rightEmoji && <div className="slider-emoji">{labels.rightEmoji}</div>}
                        <div className="slider-text">{labels.right}</div>
                    </div>
                )}
            </div>

            {/* Bottom label with emoji */}
            {labels?.bottom && (
                <div className="slider-label bottom">
                    {labels.bottomEmoji && <div className="slider-emoji">{labels.bottomEmoji}</div>}
                    <div className="slider-text">{labels.bottom}</div>
                </div>
            )}

            <div className="slider-coordinates">
                <p>X: {getNormalizedCoordinates().x}</p>
                <p>Y: {getNormalizedCoordinates().y}</p>
            </div>
        </div>
    );
}

export default Slider;