import { useEffect, useRef } from 'react';

interface FooterNode {
  x: number;
  y: number;
  radius: number;
  active: boolean;
  activationTime: number;
}

interface FooterEdge {
  from: number;
  to: number;
  active: boolean;
  progress: number;
}

export const FooterGraph = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Create a structured graph layout
    const nodePositions = [
      { x: 0.05, y: 0.5 },
      { x: 0.15, y: 0.3 },
      { x: 0.15, y: 0.7 },
      { x: 0.25, y: 0.5 },
      { x: 0.35, y: 0.25 },
      { x: 0.35, y: 0.75 },
      { x: 0.45, y: 0.5 },
      { x: 0.55, y: 0.3 },
      { x: 0.55, y: 0.7 },
      { x: 0.65, y: 0.5 },
      { x: 0.75, y: 0.25 },
      { x: 0.75, y: 0.75 },
      { x: 0.85, y: 0.5 },
      { x: 0.95, y: 0.3 },
      { x: 0.95, y: 0.7 },
    ];

    const nodes: FooterNode[] = nodePositions.map((pos) => ({
      x: pos.x * width,
      y: pos.y * height,
      radius: 4,
      active: false,
      activationTime: 0,
    }));

    const edgeConnections = [
      [0, 1], [0, 2], [1, 3], [2, 3],
      [3, 4], [3, 5], [4, 6], [5, 6],
      [6, 7], [6, 8], [7, 9], [8, 9],
      [9, 10], [9, 11], [10, 12], [11, 12],
      [12, 13], [12, 14],
      // Cross connections
      [1, 4], [2, 5], [4, 7], [5, 8], [7, 10], [8, 11], [10, 13], [11, 14],
    ];

    const edges: FooterEdge[] = edgeConnections.map(([from, to]) => ({
      from,
      to,
      active: false,
      progress: 0,
    }));

    let time = 0;
    let currentActiveIndex = 0;
    let lastActivationTime = 0;
    const activationInterval = 0.3;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.016;

      // Sequential activation
      if (time - lastActivationTime > activationInterval) {
        if (currentActiveIndex < nodes.length) {
          nodes[currentActiveIndex].active = true;
          nodes[currentActiveIndex].activationTime = time;
          
          // Activate connected edges
          edges.forEach((edge) => {
            if (edge.from === currentActiveIndex || edge.to === currentActiveIndex) {
              if (
                (edge.from === currentActiveIndex && nodes[edge.to].active) ||
                (edge.to === currentActiveIndex && nodes[edge.from].active)
              ) {
                edge.active = true;
              }
            }
          });
          
          currentActiveIndex++;
        } else {
          // Reset cycle
          currentActiveIndex = 0;
          nodes.forEach((node) => {
            node.active = false;
            node.activationTime = 0;
          });
          edges.forEach((edge) => {
            edge.active = false;
            edge.progress = 0;
          });
        }
        lastActivationTime = time;
      }

      // Draw edges
      edges.forEach((edge) => {
        const from = nodes[edge.from];
        const to = nodes[edge.to];

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);

        if (edge.active) {
          edge.progress = Math.min(1, edge.progress + 0.05);
          const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
          gradient.addColorStop(0, `rgba(45, 212, 191, ${0.8 * edge.progress})`);
          gradient.addColorStop(1, `rgba(56, 189, 248, ${0.6 * edge.progress})`);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = 'rgba(45, 212, 191, 0.15)';
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach((node) => {
        if (node.active) {
          const timeSinceActivation = time - node.activationTime;
          const pulse = Math.sin(timeSinceActivation * 4) * 0.3 + 1;
          const glowRadius = node.radius * pulse * 3;

          // Glow
          const gradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, glowRadius
          );
          gradient.addColorStop(0, 'rgba(45, 212, 191, 0.8)');
          gradient.addColorStop(0.5, 'rgba(45, 212, 191, 0.3)');
          gradient.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(45, 212, 191, 1)';
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(45, 212, 191, 0.3)';
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  );
};
