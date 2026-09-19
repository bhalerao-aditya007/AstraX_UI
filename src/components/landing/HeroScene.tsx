// src/components/landing/HeroScene.tsx
//
// Same technique (R3F + drei Float/Line, ambient + point lights), restyled:
// the previous scene read as a generic "AI network" sphere cluster in gold.
// This one uses the ember/steel/emerald palette and slightly irregular node
// sizing so it reads as pins on an evidence board rather than a logo mark.

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import type { Mesh, Group } from "three";

function Node({
    position,
    color,
    size = 0.15,
}: {
    position: [number, number, number];
    color: string;
    size?: number;
}) {
    const meshRef = useRef<Mesh>(null);
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y +=
                Math.sin(state.clock.elapsedTime * 0.55 + position[0]) * 0.0011;
        }
    });
    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[size, 20, 20]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.28}
                roughness={0.4}
                metalness={0.55}
            />
        </mesh>
    );
}

function Edge({
    start,
    end,
    color = "#a85b3a",
    dashed = false,
}: {
    start: [number, number, number];
    end: [number, number, number];
    color?: string;
    dashed?: boolean;
}) {
    const points = useMemo<[number, number, number][]>(() => [start, end], [start, end]);
    return (
        <Line
            points={points}
            color={color}
            lineWidth={1}
            transparent
            opacity={dashed ? 0.16 : 0.24}
            dashed={dashed}
            dashSize={0.06}
            gapSize={0.05}
        />
    );
}

function EvidenceNetwork() {
    const groupRef = useRef<Group>(null);
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.032;
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.018) * 0.055;
        }
    });

    // Case File Noir palette: ember (authority), emerald (confirmed),
    // steel (data), a single violet phantom node (hypothesis).
    const nodes: { pos: [number, number, number]; color: string; size: number }[] = [
        { pos: [0, 0, 0], color: "#c2764f", size: 0.22 }, // Central case node
        { pos: [1.5, 0.8, -0.5], color: "#4e9e75", size: 0.15 }, // Confirmed link
        { pos: [-1.2, 1, 0.6], color: "#a85b3a", size: 0.14 }, // Secondary evidence node
        { pos: [0.8, -1.2, 0.8], color: "#5f86aa", size: 0.16 }, // Telecom/data node
        { pos: [-1.6, -0.5, -0.3], color: "#74be97", size: 0.15 }, // Confirmed
        { pos: [1.8, -0.3, -1], color: "#6e6763", size: 0.13 }, // Neutral/passive
        { pos: [-0.5, 1.5, -0.8], color: "#5f86aa", size: 0.13 }, // Telecom hit
        { pos: [0.3, -0.8, 1.5], color: "#c2764f", size: 0.12 }, // Financial mule cluster
        { pos: [-1, -1.3, 0.9], color: "#6e6763", size: 0.14 }, // Entity disambiguation
        { pos: [1.2, 1.2, 0.5], color: "#8776d1", size: 0.115 }, // Hypothesis phantom
        { pos: [-0.8, 0.2, 1.2], color: "#4e9e75", size: 0.13 }, // Verified hub
        { pos: [0.5, 0.5, -1.3], color: "#a85b3a", size: 0.13 }, // Peripheral node
    ];

    const edges: [number, number, boolean][] = [
        [0, 1, false],
        [0, 2, false],
        [0, 3, false],
        [0, 4, false],
        [1, 5, false],
        [1, 9, true], // to phantom → dashed
        [2, 6, false],
        [3, 7, false],
        [3, 8, false],
        [4, 8, false],
        [5, 9, true], // to phantom → dashed
        [6, 10, false],
        [7, 10, false],
        [2, 11, false],
        [5, 11, false],
    ];

    return (
        <group ref={groupRef}>
            {edges.map(([a, b, dashed], i) => (
                <Edge
                    key={i}
                    start={nodes[a].pos}
                    end={nodes[b].pos}
                    color={dashed ? "#8776d1" : "#a85b3a"}
                    dashed={dashed}
                />
            ))}
            {nodes.map((n, i) => (
                <Float key={i} speed={1.1} rotationIntensity={0} floatIntensity={0.22}>
                    <Node position={n.pos} color={n.color} size={n.size} />
                </Float>
            ))}
        </group>
    );
}

export default function HeroScene() {
    if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        return (
            <div className="absolute inset-0 bg-gradient-to-br from-ember-500/10 via-transparent to-surface-100/20" />
        );
    }

    return (
        <div className="absolute inset-0 opacity-60">
            <Canvas
                camera={{ position: [0, 0, 5.2], fov: 45 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
                style={{ pointerEvents: "none" }}
            >
                <ambientLight intensity={0.42} />
                <pointLight position={[5, 5, 5]} intensity={0.75} color="#c2764f" />
                <pointLight position={[-5, -3, 3]} intensity={0.4} color="#4e9e75" />
                <EvidenceNetwork />
            </Canvas>
        </div>
    );
}
