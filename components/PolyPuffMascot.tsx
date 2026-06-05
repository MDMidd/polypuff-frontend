/**
 * PolyPuffMascot.tsx
 * 
 * WHERE THIS FILE GOES:
 *   D:\Project\MyProject\translation-trainer-frontend\components\PolyPuffMascot.tsx
 * 
 * WHAT IT DOES:
 *   Renders a 3D baby-blue claymorphic mascot using react-three-fiber + expo-gl.
 *   - Soft silicone/matte material with a glowing rim light
 *   - Idle bounce animation (useFrame)
 *   - "Look-at-finger" rotation: the mascot's head follows your touch/cursor
 *   - aspectRatio: 1 container prevents oval distortion on all screen sizes
 * 
 * HOW TO USE IN ANY SCREEN:
 *   import PolyPuffMascot from '@/components/PolyPuffMascot';
 *   <PolyPuffMascot size={240} />
 */

import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Platform, GestureResponderEvent } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import * as THREE from 'three';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PolyPuffMascotProps {
  /** Width and height in dp. Defaults to 220. Always renders as a square. */
  size?: number;
}

// ─── Sub-component: the actual 3D scene rendered inside the Canvas ─────────────

function MascotScene({ lookTarget }: { lookTarget: React.MutableRefObject<[number, number]> }) {
  // Refs for the mesh parts we animate
  const bodyRef = useRef<THREE.Mesh>(null!);
  const headRef = useRef<THREE.Mesh>(null!);
  const eyeLeftRef = useRef<THREE.Mesh>(null!);
  const eyeRightRef = useRef<THREE.Mesh>(null!);

  // Tracks elapsed time for the bounce/idle cycle
  const clockRef = useRef(0);

  // ── Material: baby-blue matte silicone ──────────────────────────────────────
  // MeshStandardMaterial with low roughness + subtle metalness gives the
  // soft "claymorphic" silicone look without needing a custom shader.
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#7EC8E3'),   // baby blue
    roughness: 0.75,                     // matte, not glossy
    metalness: 0.05,                     // just a hint of sheen
  });

  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1A1A2E'),
    roughness: 0.5,
    metalness: 0.1,
  });

  const cheekMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#F4A7B9'),   // soft pink blush
    roughness: 0.9,
    metalness: 0.0,
    transparent: true,
    opacity: 0.6,
  });

  // ── useFrame: runs every render tick (~60fps) ────────────────────────────────
  useFrame((state, delta) => {
    clockRef.current += delta;
    const t = clockRef.current;

    // 1. Idle bounce — body bobs gently up and down
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(t * 1.8) * 0.06;
    }

    // 2. Idle squash & stretch — very subtle scale pulse
    if (bodyRef.current) {
      const pulse = 1 + Math.sin(t * 1.8) * 0.015;
      bodyRef.current.scale.set(pulse, 1 / pulse, pulse);
    }

    // 3. Look-at-finger rotation
    // lookTarget is a normalised [-1,1] x/y value derived from touch position.
    // We lerp (smoothly interpolate) toward it so the head glides, not snaps.
    if (headRef.current) {
      const [tx, ty] = lookTarget.current;
      const targetRotX = -ty * 0.4;   // tilt up/down
      const targetRotY = tx * 0.5;    // turn left/right

      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x, targetRotX, 0.08
      );
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y, targetRotY, 0.08
      );
    }
  });

  return (
    <>
      {/* ── Lighting rig ──────────────────────────────────────────────────── */}

      {/* Key light — soft warm fill from above-left */}
      <directionalLight
        position={[-2, 3, 2]}
        intensity={1.4}
        color="#FFF5E4"
      />

      {/* Rim light — the glowing blue-white edge that gives the silicone look */}
      <pointLight
        position={[2, 1, -2]}
        intensity={2.5}
        color="#A8D8EA"
        distance={8}
        decay={2}
      />

      {/* Fill light — soft ambient so shadows aren't too dark */}
      <ambientLight intensity={0.5} color="#D4EEF7" />

      {/* Bottom bounce light — slightly warm to mimic ground reflection */}
      <pointLight
        position={[0, -2, 1]}
        intensity={0.4}
        color="#FFE4CC"
        distance={5}
        decay={2}
      />

      {/* ── Body group: this node bobs up/down ────────────────────────────── */}
      <group ref={bodyRef} position={[0, -0.2, 0]}>

        {/* Body — rounded sphere, slightly squashed vertically */}
        <mesh material={bodyMaterial} position={[0, 0, 0]}>
          <sphereGeometry args={[0.72, 32, 32]} />
        </mesh>

        {/* Belly patch — slightly lighter circle on the front */}
        <mesh
          material={
            new THREE.MeshStandardMaterial({
              color: new THREE.Color('#B8E4F2'),
              roughness: 0.8,
              metalness: 0.0,
            })
          }
          position={[0, -0.05, 0.68]}
          rotation={[0, 0, 0]}
        >
          <sphereGeometry args={[0.38, 32, 32]} />
        </mesh>

        {/* Left arm */}
        <mesh
          material={bodyMaterial}
          position={[-0.82, 0.1, 0.1]}
          rotation={[0.3, 0, -0.6]}
        >
          <capsuleGeometry args={[0.18, 0.38, 8, 16]} />
        </mesh>

        {/* Right arm */}
        <mesh
          material={bodyMaterial}
          position={[0.82, 0.1, 0.1]}
          rotation={[0.3, 0, 0.6]}
        >
          <capsuleGeometry args={[0.18, 0.38, 8, 16]} />
        </mesh>

        {/* Left foot */}
        <mesh
          material={bodyMaterial}
          position={[-0.32, -0.72, 0.18]}
          rotation={[0.4, 0, 0.1]}
        >
          <capsuleGeometry args={[0.2, 0.28, 8, 16]} />
        </mesh>

        {/* Right foot */}
        <mesh
          material={bodyMaterial}
          position={[0.32, -0.72, 0.18]}
          rotation={[0.4, 0, -0.1]}
        >
          <capsuleGeometry args={[0.2, 0.28, 8, 16]} />
        </mesh>

        {/* ── Head group: this node rotates to follow the finger ──────────── */}
        <group ref={headRef} position={[0, 0.88, 0]}>

          {/* Head sphere */}
          <mesh material={bodyMaterial}>
            <sphereGeometry args={[0.58, 32, 32]} />
          </mesh>

          {/* Left eye */}
          <mesh ref={eyeLeftRef} material={eyeMaterial} position={[-0.22, 0.1, 0.5]}>
            <sphereGeometry args={[0.1, 16, 16]} />
          </mesh>

          {/* Right eye */}
          <mesh ref={eyeRightRef} material={eyeMaterial} position={[0.22, 0.1, 0.5]}>
            <sphereGeometry args={[0.1, 16, 16]} />
          </mesh>

          {/* Left eye shine */}
          <mesh
            material={new THREE.MeshStandardMaterial({ color: '#FFFFFF', emissive: '#FFFFFF', emissiveIntensity: 1 })}
            position={[-0.19, 0.14, 0.58]}
          >
            <sphereGeometry args={[0.03, 8, 8]} />
          </mesh>

          {/* Right eye shine */}
          <mesh
            material={new THREE.MeshStandardMaterial({ color: '#FFFFFF', emissive: '#FFFFFF', emissiveIntensity: 1 })}
            position={[0.25, 0.14, 0.58]}
          >
            <sphereGeometry args={[0.03, 8, 8]} />
          </mesh>

          {/* Left cheek blush */}
          <mesh material={cheekMaterial} position={[-0.38, -0.06, 0.42]}>
            <sphereGeometry args={[0.13, 16, 16]} />
          </mesh>

          {/* Right cheek blush */}
          <mesh material={cheekMaterial} position={[0.38, -0.06, 0.42]}>
            <sphereGeometry args={[0.13, 16, 16]} />
          </mesh>

          {/* Smile — a torus arc rotated to look like a curved mouth */}
          <mesh
            material={eyeMaterial}
            position={[0, -0.14, 0.54]}
            rotation={[0, 0, Math.PI]}
            scale={[0.7, 0.5, 0.7]}
          >
            <torusGeometry args={[0.18, 0.035, 8, 20, Math.PI]} />
          </mesh>

          {/* Left ear */}
          <mesh material={bodyMaterial} position={[-0.55, 0.3, 0]}>
            <sphereGeometry args={[0.18, 16, 16]} />
          </mesh>

          {/* Right ear */}
          <mesh material={bodyMaterial} position={[0.55, 0.3, 0]}>
            <sphereGeometry args={[0.18, 16, 16]} />
          </mesh>

        </group>
        {/* end head group */}

      </group>
      {/* end body group */}
    </>
  );
}

// ─── Main exported component ───────────────────────────────────────────────────

export default function PolyPuffMascot({ size = 220 }: PolyPuffMascotProps) {
  // Stores the normalised look direction [-1..1, -1..1]
  // Using a ref (not state) so updates don't trigger a re-render — useFrame
  // reads this every tick instead.
  const lookTarget = useRef<[number, number]>([0, 0]);

  // Tracks the container's on-screen position so we can normalise touch coords
  const containerLayout = useRef({ x: 0, y: 0, width: size, height: size });

  // ── Touch / pointer handler ──────────────────────────────────────────────────
  const handleTouch = useCallback((event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;
    const { width, height } = containerLayout.current;

    // Normalise to [-1, 1] with (0,0) at centre
    const nx = (locationX / width) * 2 - 1;
    const ny = (locationY / height) * 2 - 1;

    lookTarget.current = [
      Math.max(-1, Math.min(1, nx)),
      Math.max(-1, Math.min(1, ny)),
    ];
  }, []);

  // When finger lifts, slowly drift back to centre (handled by lerp in useFrame)
  const handleTouchEnd = useCallback(() => {
    lookTarget.current = [0, 0];
  }, []);

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      onLayout={(e) => {
        containerLayout.current = {
          x: e.nativeEvent.layout.x,
          y: e.nativeEvent.layout.y,
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        };
      }}
      // Attach gesture handlers directly to the View so the whole square
      // area responds to touch — not just the visible mascot shape.
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderMove={handleTouch}
      onResponderRelease={handleTouchEnd}
      onResponderTerminate={handleTouchEnd}
    >
      <Canvas
        style={styles.canvas}
        // gl props configure the expo-gl WebGL context
        gl={{ antialias: true, alpha: true }}
        // Camera sits back enough to see the whole mascot
        camera={{ position: [0, 0.2, 3.8], fov: 42, near: 0.1, far: 100 }}
        // Transparent background — inherits whatever is behind the View
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <MascotScene lookTarget={lookTarget} />
      </Canvas>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    // aspectRatio + explicit width/height prevents the oval distortion bug.
    // The parent must NOT apply flex:1 without also constraining width,
    // otherwise the container stretches and breaks the square ratio.
    aspectRatio: 1,
    overflow: 'hidden',
    // Remove any background so the transparent canvas shows through
    backgroundColor: 'transparent',
    // Centre within whatever parent layout is used
    alignSelf: 'center',
  },
  canvas: {
    // Fill the square container exactly
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
