/**
 * SuccessAnimation - Confetti burst animation for celebration moments.
 * 
 * Uses CSS animations for lightweight confetti effect.
 */

import React, { useEffect, useState } from 'react';

interface ConfettiPiece {
    id: number;
    x: number;
    delay: number;
    color: string;
    size: number;
}

const COLORS = ['#055DDB', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

function generateConfetti(count: number): ConfettiPiece[] {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 6,
    }));
}

interface SuccessAnimationProps {
    isActive: boolean;
    duration?: number; // ms
}

export function SuccessAnimation({ isActive, duration = 3000 }: SuccessAnimationProps) {
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isActive) {
            setConfetti(generateConfetti(50));
            setVisible(true);

            const timer = setTimeout(() => {
                setVisible(false);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isActive, duration]);

    if (!visible) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            {confetti.map((piece) => (
                <div
                    key={piece.id}
                    className="absolute animate-confetti-fall"
                    style={{
                        left: `${piece.x}%`,
                        top: '-20px',
                        animationDelay: `${piece.delay}s`,
                        animationDuration: `${2 + Math.random()}s`,
                    }}
                >
                    <div
                        className="rounded-sm"
                        style={{
                            width: piece.size,
                            height: piece.size,
                            backgroundColor: piece.color,
                            transform: `rotate(${Math.random() * 360}deg)`,
                        }}
                    />
                </div>
            ))}

            {/* Add keyframes via style tag */}
            <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti-fall {
          animation: confetti-fall linear forwards;
        }
      `}</style>
        </div>
    );
}

export default SuccessAnimation;
