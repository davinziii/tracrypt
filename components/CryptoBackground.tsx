'use client'

import { useEffect, useRef, useState } from 'react';

interface CandleData {
	id: number;
	down: boolean;
	h1: number;
	h2: number;
	duration: number;
	delay: number;
}

interface Node {
	x: number;
	y: number;
	vx: number;
	vy: number;
	r: number;
	hue: string;
	pulse: number;
}

const CYAN = '43,224,200';
const VIOLET = '139,107,255';
const LINK_DIST = 150;

function generateCandles(count = 40): CandleData[] {
	return Array.from({ length: count }, (_, i) => {
		const h1 = 0.15 + Math.random() * 0.55;
		const h2 = Math.max(0.08, h1 + (Math.random() * 0.3 - 0.15));
		return {
			id: i,
			down: Math.random() < 0.42,
			h1,
			h2,
			duration: 6 + Math.random() * 8,
			delay: -Math.random() * 10,
		};
	});
}

export default function CryptoBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [candles, setCandles] = useState<CandleData[]>([]);

	// generate candles client-side only, to avoid hydration mismatches
	useEffect(() => {
		setCandles(generateCandles(40));
	}, []);

	// ledger network canvas animation
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let w = 0;
		let h = 0;
		let dpr = 1;
		let nodes: Node[] = [];
		let rafId = 0;

		
        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = window.innerWidth;
            h = window.innerHeight;
            canvas!.width = w * dpr;
            canvas!.height = h * dpr;
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

		function initNodes() {
			const count = Math.max(24, Math.min(70, Math.floor((w * h) / 26000)));
			nodes = Array.from({ length: count }, (): Node => ({
				x: Math.random() * w,
				y: Math.random() * h,
				vx: (Math.random() - 0.5) * 0.18,
				vy: (Math.random() - 0.5) * 0.18,
				r: 1.2 + Math.random() * 1.6,
				hue: Math.random() < 0.7 ? CYAN : VIOLET,
				pulse: Math.random() * Math.PI * 2,
			}));
		}

		function step() {
			ctx!.clearRect(0, 0, w, h);

			for (const p of nodes) {
				p.x += p.vx;
				p.y += p.vy;
				p.pulse += 0.02;

				if (p.x < -20) p.x = w + 20;
				if (p.x > w + 20) p.x = -20;
				if (p.y < -20) p.y = h + 20;
				if (p.y > h + 20) p.y = -20;
			}

			for (let i = 0; i < nodes.length; i++) {
				for (let j = i + 1; j < nodes.length; j++) {
					const a = nodes[i];
					const b = nodes[j];
					const dx = a.x - b.x;
					const dy = a.y - b.y;
					const dist = Math.sqrt(dx * dx + dy * dy);

					if (dist < LINK_DIST) {
						const alpha = (1 - dist / LINK_DIST) * 0.18;
						ctx!.strokeStyle = `rgba(${CYAN},${alpha})`;
						ctx!.lineWidth = 1;
						ctx!.beginPath();
						ctx!.moveTo(a.x, a.y);
						ctx!.lineTo(b.x, b.y);
						ctx!.stroke();
					}
				}
			}

			for (const p of nodes) {
				const glow = 0.5 + Math.sin(p.pulse) * 0.5;
				const alpha = 0.35 + glow * 0.4;
				ctx!.beginPath();
				ctx!.arc(p.x, p.y, p.r + glow * 0.8, 0, Math.PI * 2);
				ctx!.fillStyle = `rgba(${p.hue},${alpha})`;
				ctx!.fill();
			}

			rafId = requestAnimationFrame(step);
		}

    function handleResize() {
            resize();
            initNodes();
        }

        resize();
        initNodes();
        step();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(rafId);
        };
	}, []);

	return (
		<div className="crypto-bg fixed inset-0 -z-10 overflow-hidden">
			<div className="candles absolute inset-0 flex items-end justify-between px-[2%] opacity-50">
				{candles.map((c) => (
					<div key={c.id}
						className={`candle w-[1.6%] rounded-t-[2px] h-[70%] ${c.down ? 'down' : ''}`}
						style={{
							// @ts-expect-error custom properties
							'--h1': c.h1.toFixed(2),
							'--h2': c.h2.toFixed(2),
							animationDuration: `${c.duration.toFixed(1)}s`,
							animationDelay: `${c.delay.toFixed(1)}s`,
						}}/>
				))}
			</div>

			<div className="sweep absolute inset-x-0 h-[40%]" />

			<canvas ref={canvasRef} className="absolute inset-0 block" />

			<div className="grid-overlay absolute inset-0" />
			<div className="vignette absolute inset-0" />
		</div>
	);
}