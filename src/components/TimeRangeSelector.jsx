import { useRef, useEffect, useState } from 'react';
import { Calendar, Clock, TrendingUp, Globe, Infinity, Timer } from 'lucide-react';

export default function TimeRangeSelector({ timeRange, setTimeRange }) {
    const ranges = [
        { value: 'last24h', label: 'Last 24h', icon: Timer, ascii: '⏱️' },
        { value: 'today', label: 'Today', icon: Clock, ascii: '⏰' },
        { value: 'week', label: 'Week', icon: Calendar, ascii: '📅' },
        { value: 'month', label: 'Month', icon: TrendingUp, ascii: '📊' },
        { value: 'year', label: 'Year', icon: Globe, ascii: '🌍' },
        { value: 'all', label: 'All Time', icon: Infinity, ascii: '∞' }
    ];

    const [sliderStyle, setSliderStyle] = useState({});
    const [hoveredRange, setHoveredRange] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const buttonRefs = useRef({});
    const cardRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        // Calculate position and size of active button for sliding indicator
        const activeButton = buttonRefs.current[timeRange];
        if (activeButton) {
            const { offsetLeft, offsetWidth } = activeButton;
            setSliderStyle({
                left: `${offsetLeft}px`,
                width: `${offsetWidth}px`,
            });
        }
    }, [timeRange]);

    const handleMouseMove = (e) => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            setMousePos({ x, y });
        }

        // Handle dragging
        if (isDragging && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;

            // Find which button we're over
            for (const range of ranges) {
                const button = buttonRefs.current[range.value];
                if (button) {
                    const buttonRect = button.getBoundingClientRect();
                    const buttonX = buttonRect.left - rect.left;
                    const buttonWidth = buttonRect.width;

                    if (x >= buttonX && x <= buttonX + buttonWidth) {
                        if (timeRange !== range.value) {
                            setTimeRange(range.value);
                        }
                        break;
                    }
                }
            }
        }
    };

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging]);

    const getAsciiArt = (rangeValue) => {
        const arts = {
            last24h: '⏱️ 24h',
            today: '⏰ Today',
            week: '📅 7d',
            month: '📊 30d',
            year: '🌍 365d',
            all: '∞ ∞'
        };
        return arts[rangeValue] || '';
    };

    // ASCII art elements with parallax effect
    const asciiElements = [
        { char: '⏰', x: 10, y: 15, size: 'text-4xl', speed: 0.5, color: 'text-blue-400' },
        { char: '📅', x: 85, y: 20, size: 'text-3xl', speed: 0.3, color: 'text-purple-400' },
        { char: '📊', x: 15, y: 75, size: 'text-3xl', speed: 0.4, color: 'text-green-400' },
        { char: '🌍', x: 80, y: 70, size: 'text-4xl', speed: 0.6, color: 'text-cyan-400' },
        { char: '∞', x: 30, y: 45, size: 'text-2xl', speed: 0.2, color: 'text-amber-400' },
        { char: '⏱️', x: 65, y: 40, size: 'text-2xl', speed: 0.35, color: 'text-pink-400' },
        { char: '⌚', x: 50, y: 25, size: 'text-xl', speed: 0.25, color: 'text-indigo-400' },
        { char: '📈', x: 40, y: 65, size: 'text-xl', speed: 0.45, color: 'text-emerald-400' },
    ];

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6 relative overflow-hidden"
        >
            {/* Interactive ASCII Art Background with Parallax */}
            <div className="absolute inset-0 pointer-events-none select-none">
                {asciiElements.map((element, index) => {
                    const offsetX = (mousePos.x - 0.5) * element.speed * 20;
                    const offsetY = (mousePos.y - 0.5) * element.speed * 20;

                    return (
                        <div
                            key={index}
                            className={`absolute ${element.size} ${element.color} opacity-15 transition-all duration-300 ease-out hover:opacity-30 hover:scale-110`}
                            style={{
                                left: `${element.x}%`,
                                top: `${element.y}%`,
                                transform: `translate(${offsetX}px, ${offsetY}px) rotate(${offsetX * 0.5}deg)`,
                            }}
                        >
                            {element.char}
                        </div>
                    );
                })}
            </div>

            {/* Content */}
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-700">Time Range</h3>
                    <div className="w-24 text-right h-8 flex items-center justify-end">
                        <div className={`text-2xl font-mono transition-opacity duration-200 ${hoveredRange ? 'opacity-100 animate-pulse' : 'opacity-0'}`}>
                            {hoveredRange ? getAsciiArt(hoveredRange) : '⏰ Today'}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div
                        ref={containerRef}
                        className="relative inline-flex bg-gray-100 rounded-lg p-1 gap-1"
                    >
                        {/* Sliding white background indicator - draggable */}
                        <div
                            onMouseDown={handleMouseDown}
                            className={`absolute top-1 bottom-1 bg-white rounded-md shadow-sm transition-all duration-300 ease-out ${isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab'
                                }`}
                            style={sliderStyle}
                        />

                        {/* Buttons */}
                        {ranges.map((range) => {
                            const Icon = range.icon;
                            const isActive = timeRange === range.value;

                            return (
                                <button
                                    key={range.value}
                                    ref={(el) => (buttonRefs.current[range.value] = el)}
                                    onClick={() => setTimeRange(range.value)}
                                    onMouseEnter={() => setHoveredRange(range.value)}
                                    onMouseLeave={() => setHoveredRange(null)}
                                    className={`relative z-10 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${isActive
                                        ? 'text-gray-900'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon
                                        size={16}
                                        className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'
                                            } ${hoveredRange === range.value ? 'animate-bounce' : ''
                                            }`}
                                    />
                                    <span>{range.label}</span>
                                    {isActive && (
                                        <span className="text-xs opacity-60 font-mono">
                                            {range.ascii}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ASCII Art Timeline Visualization */}
                {timeRange && (
                    <div className="mt-4 text-center">
                        <div className="inline-block bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
                            <div className="text-xs font-mono text-gray-600">
                                {timeRange === 'last24h' && '├─────────────────────────┤ rolling 24h'}
                                {timeRange === 'today' && '├─────────────────────────┤ midnight → now'}
                                {timeRange === 'week' && '├───┼───┼───┼───┼───┼───┼───┤ 7 days'}
                                {timeRange === 'month' && '├──────────────────────────────┤ 30 days'}
                                {timeRange === 'year' && '├─ Jan ─ Apr ─ Jul ─ Oct ─ Dec ─┤ 12 months'}
                                {timeRange === 'all' && '├──────────────∞──────────────┤ all time'}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
