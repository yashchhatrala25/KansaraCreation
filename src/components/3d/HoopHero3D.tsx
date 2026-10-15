"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import CanvasFallback from "./CanvasFallback";

export default function HoopHero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    // Check WebGL support & reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setHasWebGL(false);
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    setHasWebGL(true);
  }, []);

  useEffect(() => {
    if (hasWebGL !== true || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7.5;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch (e) {
      setHasWebGL(false);
      return;
    }

    // Master Group
    const hoopGroup = new THREE.Group();
    scene.add(hoopGroup);

    // 1. Wooden Outer Ring (Hoop)
    const torusGeo = new THREE.TorusGeometry(2.3, 0.09, 24, 72);
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x8b5a2b,
      roughness: 0.65,
      metalness: 0.1,
    });
    const woodRing = new THREE.Mesh(torusGeo, woodMat);
    hoopGroup.add(woodRing);

    // Inner Bamboo Ring
    const innerTorusGeo = new THREE.TorusGeometry(2.18, 0.05, 16, 64);
    const innerWoodMat = new THREE.MeshStandardMaterial({
      color: 0xa06d3b,
      roughness: 0.7,
      metalness: 0.05,
    });
    const innerRing = new THREE.Mesh(innerTorusGeo, innerWoodMat);
    hoopGroup.add(innerRing);

    // 2. Brass Screw Top Clamp
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.25,
    });
    const clampBaseGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.45, 16);
    const clampBase = new THREE.Mesh(clampBaseGeo, brassMat);
    clampBase.position.set(0, 2.38, 0);
    hoopGroup.add(clampBase);

    const boltGeo = new THREE.BoxGeometry(0.35, 0.1, 0.1);
    const bolt = new THREE.Mesh(boltGeo, brassMat);
    bolt.position.set(0, 2.58, 0);
    hoopGroup.add(bolt);

    // 3. Linen Fabric Center Disc
    const fabricGeo = new THREE.CircleGeometry(2.22, 48);
    const fabricMat = new THREE.MeshStandardMaterial({
      color: 0xf8f5ee,
      roughness: 0.95,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
    const fabricDisc = new THREE.Mesh(fabricGeo, fabricMat);
    fabricDisc.position.z = -0.01;
    hoopGroup.add(fabricDisc);

    // 4. Hand-stitched Floral Wreath (Embroidery French Knots & Petals)
    const floralGroup = new THREE.Group();
    hoopGroup.add(floralGroup);

    const petalColors = [0xec4899, 0x7c3aed, 0xf59e0b, 0xf43f5e, 0x10b981, 0x6366f1];
    const flowerMaterials = petalColors.map(
      (c) =>
        new THREE.MeshStandardMaterial({
          color: c,
          roughness: 0.8,
          metalness: 0.1,
        })
    );

    // Create a circular wreath of floral embroidery clusters
    const flowerCount = 18;
    for (let i = 0; i < flowerCount; i++) {
      const angle = (i / flowerCount) * Math.PI * 2;
      const radius = 1.6 + Math.sin(i * 3) * 0.15;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // Center Knot
      const mat = flowerMaterials[i % flowerMaterials.length];
      const knotGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const knot = new THREE.Mesh(knotGeo, mat);
      knot.position.set(x, y, 0.06);
      floralGroup.add(knot);

      // Surrounding French knot petals
      for (let p = 0; p < 4; p++) {
        const pAngle = (p / 4) * Math.PI * 2;
        const pGeo = new THREE.SphereGeometry(0.065, 8, 8);
        const petal = new THREE.Mesh(pGeo, mat);
        petal.position.set(x + Math.cos(pAngle) * 0.12, y + Math.sin(pAngle) * 0.12, 0.05);
        floralGroup.add(petal);
      }
    }

    // 5. Stitched Red Date Circle (Calendar Anniversary Feature)
    const redThreadMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.7,
      metalness: 0.1,
    });
    const redCircleGeo = new THREE.TorusGeometry(0.24, 0.04, 16, 32);
    const redCircle = new THREE.Mesh(redCircleGeo, redThreadMat);
    redCircle.position.set(0.15, -0.15, 0.06);
    hoopGroup.add(redCircle);

    // Heart inside date
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, 0.06, -0.06, 0.1, -0.09, 0.06);
    heartShape.bezierCurveTo(-0.13, 0.02, -0.08, -0.06, 0, -0.1);
    heartShape.bezierCurveTo(0.08, -0.06, 0.13, 0.02, 0.09, 0.06);
    heartShape.bezierCurveTo(0.06, 0.1, 0, 0.06, 0, 0);
    const heartGeo = new THREE.ShapeGeometry(heartShape);
    const heartMesh = new THREE.Mesh(heartGeo, redThreadMat);
    heartMesh.scale.set(0.7, 0.7, 0.7);
    heartMesh.position.set(0.15, -0.13, 0.07);
    hoopGroup.add(heartMesh);

    // 6. Hanging Boho Tassels & Beads
    const tasselGroup = new THREE.Group();
    hoopGroup.add(tasselGroup);

    const stringMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.9 });
    const beadMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.7 });

    const tasselOffsets = [-1.1, -0.7, -0.3, 0, 0.3, 0.7, 1.1];
    tasselOffsets.forEach((offsetX, idx) => {
      const length = 1.3 + Math.sin(idx * 0.8) * 0.4;
      const strandGeo = new THREE.CylinderGeometry(0.015, 0.015, length, 8);
      const strand = new THREE.Mesh(strandGeo, stringMat);
      strand.position.set(offsetX, -2.3 - length / 2, 0);
      tasselGroup.add(strand);

      // Gold bead
      const beadGeo = new THREE.SphereGeometry(0.07, 10, 10);
      const bead = new THREE.Mesh(beadGeo, beadMat);
      bead.position.set(offsetX, -2.35, 0);
      tasselGroup.add(bead);
    });

    // 7. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    // Accent rim lights (violet & pink) for artistic boutique feel
    const violetLight = new THREE.PointLight(0x7c3aed, 3.5, 10);
    violetLight.position.set(-4, 3, 2);
    scene.add(violetLight);

    const pinkLight = new THREE.PointLight(0xec4899, 3.5, 10);
    pinkLight.position.set(3, -3, 2);
    scene.add(pinkLight);

    // Animation & Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 2;
      mouseY = y * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Floating oscillation
      hoopGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.12;

      // Base slow rotation
      targetRotationY = Math.sin(elapsedTime * 0.4) * 0.25 + mouseX * 0.4;
      targetRotationX = -mouseY * 0.3;

      // Smooth lerp
      hoopGroup.rotation.y += (targetRotationY - hoopGroup.rotation.y) * 0.05;
      hoopGroup.rotation.x += (targetRotationX - hoopGroup.rotation.x) * 0.05;

      // Slight tilt on Z
      hoopGroup.rotation.z = Math.sin(elapsedTime * 0.8) * 0.04;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight || 450;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      // Clean disposal
      torusGeo.dispose();
      innerTorusGeo.dispose();
      fabricGeo.dispose();
      clampBaseGeo.dispose();
      boltGeo.dispose();
      woodMat.dispose();
      innerWoodMat.dispose();
      fabricMat.dispose();
      brassMat.dispose();
      redThreadMat.dispose();
      flowerMaterials.forEach((m) => m.dispose());

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [hasWebGL]);

  if (hasWebGL === false) {
    return <CanvasFallback />;
  }

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] flex items-center justify-center">
      {/* Aurora Ambient Glows */}
      <div className="ambient-glow glow-purple -top-10 -left-10" />
      <div className="ambient-glow glow-pink -bottom-10 -right-10" />

      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
        aria-label="Interactive 3D Handmade Embroidery Hoop Display"
      />

      {/* Subtle interaction tip */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-widest text-content-secondary/60 bg-surface/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 pointer-events-none">
        Move mouse to tilt • Handcrafted in 3D
      </div>
    </div>
  );
}
