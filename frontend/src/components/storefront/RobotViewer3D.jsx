import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  RotateCcw,
  Eye,
  Zap,
  Sliders,
  Cpu,
  Layers,
  Sparkles,
  Bot,
  Activity,
} from 'lucide-react';

export function RobotViewer3D({
  className = '',
  height = '500px',
  modelType = 'apex_mascot',
  modelUrl = null,
  productName = '',
  autoRotate: autoRotateProp = true,
  showControls = true,
  showTelemetry = true,
}) {
  const mountRef = useRef(null);
  const [isWireframe, setIsWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(autoRotateProp);
  const [webglSupported, setWebglSupported] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [telemetry, setTelemetry] = useState({ rotX: 0, rotY: 0, zoom: 100 });

  // References to mutable Three.js objects
  const sceneRef = useRef(null);
  const modelGroupRef = useRef(null);
  const animUpdatersRef = useRef([]);
  const materialsRef = useRef([]);

  // Resolve actual model identifier
  const resolvedType = (modelType || modelUrl || 'apex_mascot').toLowerCase();

  useEffect(() => {
    setAutoRotate(autoRotateProp);
  }, [autoRotateProp]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const heightPx = container.clientHeight || parseInt(height, 10) || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0d14);
    sceneRef.current = scene;

    // 2. Camera: Centered and positioned for high-resolution inspection
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.set(0, 1.4, 5.2);
    camera.lookAt(0, 0.9, 0);

    // 3. Renderer with graceful fallback if WebGL is unavailable (e.g. test environments)
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, heightPx);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn('WebGLRenderer unavailable in current runtime:', err.message);
      setWebglSupported(false);
      return;
    }

    // 4. Studio Sci-Fi Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 2.0);
    frontLight.position.set(0, 3, 5);
    scene.add(frontLight);

    const topKeyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    topKeyLight.position.set(4, 7, 3);
    topKeyLight.castShadow = true;
    scene.add(topKeyLight);

    // Cyberpunk Cyan Fill Light
    const cyanRim = new THREE.DirectionalLight(0x00f0ff, 2.8);
    cyanRim.position.set(-4, 3, 2);
    scene.add(cyanRim);

    // Neon Violet Rim Light
    const violetRim = new THREE.DirectionalLight(0x8b5cf6, 3.2);
    violetRim.position.set(4, -1, -3);
    scene.add(violetRim);

    // Center Stage Reactor Glow
    const reactorLight = new THREE.PointLight(0xa855f7, 4.0, 7);
    reactorLight.position.set(0, 1.1, 0.7);
    scene.add(reactorLight);

    // 5. High-Tech Hexagonal Grid Floor
    const gridHelper = new THREE.GridHelper(16, 32, 0x00f0ff, 0x3b0764);
    gridHelper.position.y = -1.4;
    scene.add(gridHelper);

    // 6. Base Materials Palette
    const materials = [];
    materialsRef.current = materials;

    const whiteArmorMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.15,
      roughness: 0.2,
    });
    materials.push(whiteArmorMat);

    const darkChassisMat = new THREE.MeshStandardMaterial({
      color: 0x161926,
      metalness: 0.88,
      roughness: 0.2,
    });
    materials.push(darkChassisMat);

    const metalJointMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.95,
      roughness: 0.1,
    });
    materials.push(metalJointMat);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.2,
    });
    materials.push(goldMat);

    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 3.5,
      metalness: 0.3,
      roughness: 0.05,
    });
    materials.push(visorMat);

    const coreReactorMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0xa855f7,
      emissiveIntensity: 3.0,
      metalness: 0.1,
      roughness: 0.1,
    });
    materials.push(coreReactorMat);

    const cyanAccentMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 2.5,
      metalness: 0.2,
      roughness: 0.2,
    });
    materials.push(cyanAccentMat);

    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x0a192f,
      metalness: 0.4,
      roughness: 0.4,
    });
    materials.push(pcbMat);

    const rfShieldMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.92,
      roughness: 0.12,
    });
    materials.push(rfShieldMat);

    // 7. Root Model Assembly Group
    const modelGroup = new THREE.Group();
    modelGroup.rotation.y = -0.3; // Default 3/4 presentation angle
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    const animUpdaters = [];
    animUpdatersRef.current = animUpdaters;

    // Check if custom uploaded GLB/GLTF model
    const isCustomUrl = modelUrl && (modelUrl.startsWith('http') || modelUrl.startsWith('/uploads/'));

    if (isCustomUrl) {
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          const loadedModel = gltf.scene;
          // Compute bounding box and normalize scale
          const box = new THREE.Box3().setFromObject(loadedModel);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const scale = 2.4 / maxDim;
          loadedModel.scale.setScalar(scale);

          const center = box.getCenter(new THREE.Vector3());
          loadedModel.position.x = -center.x * scale;
          loadedModel.position.y = -center.y * scale + 0.8;
          loadedModel.position.z = -center.z * scale;

          loadedModel.traverse((child) => {
            if (child.isMesh && child.material) {
              materials.push(child.material);
              child.castShadow = true;
            }
          });

          modelGroup.add(loadedModel);
          setLoadError(null);
        },
        undefined,
        (err) => {
          console.warn('Failed to load custom GLB model, falling back to preset:', err.message);
          setLoadError('Custom 3D model unavailable, rendering CAD proxy.');
          buildProceduralModel('apex_mascot');
        }
      );
    } else {
      buildProceduralModel(resolvedType);
    }

    // Helper: Build procedural 3D model variants
    function buildProceduralModel(type) {
      if (type.includes('spider')) {
        buildSpiderBotModel();
      } else if (type.includes('arm')) {
        buildRoboticArmModel();
      } else if (type.includes('esp32') || type.includes('ctrl') || type.includes('board')) {
        buildEsp32BoardModel();
      } else if (type.includes('drone') || type.includes('dragon') || type.includes('gimbal')) {
        buildMechDroneModel();
      } else {
        buildApexMascotModel();
      }
    }

    // --- VARIANT A: Apex-01 Autonomous Mascot ---
    function buildApexMascotModel() {
      // Torso
      const torsoGeo = new THREE.BoxGeometry(1.6, 1.8, 1.1);
      const torso = new THREE.Mesh(torsoGeo, whiteArmorMat);
      torso.position.y = 1.0;
      torso.castShadow = true;
      modelGroup.add(torso);

      // Chest Core Reactor Plate
      const reactorGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 24);
      reactorGeo.rotateX(Math.PI / 2);
      const reactor = new THREE.Mesh(reactorGeo, coreReactorMat);
      reactor.position.set(0, 1.2, 0.55);
      modelGroup.add(reactor);

      // Neon Chest Vents
      const ventGeo = new THREE.BoxGeometry(0.65, 0.04, 0.1);
      const topVent = new THREE.Mesh(ventGeo, cyanAccentMat);
      topVent.position.set(0, 0.75, 0.56);
      modelGroup.add(topVent);

      const bottomVent = new THREE.Mesh(ventGeo, cyanAccentMat);
      bottomVent.position.set(0, 0.62, 0.56);
      modelGroup.add(bottomVent);

      // Torso Side Panels
      const sidePanelGeo = new THREE.BoxGeometry(0.2, 1.4, 0.9);
      const leftPanel = new THREE.Mesh(sidePanelGeo, darkChassisMat);
      leftPanel.position.set(-0.85, 1.0, 0);
      modelGroup.add(leftPanel);

      const rightPanel = new THREE.Mesh(sidePanelGeo, darkChassisMat);
      rightPanel.position.set(0.85, 1.0, 0);
      modelGroup.add(rightPanel);

      // Head Unit
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 2.3, 0);
      modelGroup.add(headGroup);

      const headGeo = new THREE.BoxGeometry(1.2, 0.9, 1.0);
      const headMesh = new THREE.Mesh(headGeo, whiteArmorMat);
      headGroup.add(headMesh);

      // Curved Visor
      const visorGeo = new THREE.BoxGeometry(0.95, 0.28, 0.2);
      const visor = new THREE.Mesh(visorGeo, visorMat);
      visor.position.set(0, 0.05, 0.52);
      headGroup.add(visor);

      // Antennae
      const antennaGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 12);
      const leftAntenna = new THREE.Mesh(antennaGeo, darkChassisMat);
      leftAntenna.position.set(-0.65, 0.3, 0);
      leftAntenna.rotation.z = 0.3;
      headGroup.add(leftAntenna);

      const rightAntenna = new THREE.Mesh(antennaGeo, darkChassisMat);
      rightAntenna.position.set(0.65, 0.3, 0);
      rightAntenna.rotation.z = -0.3;
      headGroup.add(rightAntenna);

      // Arms
      const shoulderGeo = new THREE.SphereGeometry(0.32, 16, 16);
      const leftShoulder = new THREE.Mesh(shoulderGeo, metalJointMat);
      leftShoulder.position.set(-1.25, 1.6, 0);
      modelGroup.add(leftShoulder);

      const armGeo = new THREE.CylinderGeometry(0.18, 0.15, 1.1, 16);
      const leftArm = new THREE.Mesh(armGeo, darkChassisMat);
      leftArm.position.set(-1.35, 1.0, 0);
      modelGroup.add(leftArm);

      const rightShoulder = new THREE.Mesh(shoulderGeo, metalJointMat);
      rightShoulder.position.set(1.25, 1.6, 0);
      modelGroup.add(rightShoulder);

      const rightArm = new THREE.Mesh(armGeo, darkChassisMat);
      rightArm.position.set(1.35, 1.0, 0);
      modelGroup.add(rightArm);

      // Pelvis with 4 Stance Pods
      const pelvisGeo = new THREE.CylinderGeometry(0.65, 0.45, 0.5, 16);
      const pelvis = new THREE.Mesh(pelvisGeo, darkChassisMat);
      pelvis.position.y = -0.15;
      modelGroup.add(pelvis);

      const podAngles = [0.8, -0.8, 2.3, -2.3];
      podAngles.forEach((ang) => {
        const podGroup = new THREE.Group();
        podGroup.position.set(Math.cos(ang) * 0.7, -0.3, Math.sin(ang) * 0.7);

        const podUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.9, 12), whiteArmorMat);
        podUpper.rotation.z = (Math.PI / 4) * (Math.cos(ang) > 0 ? 1 : -1);
        podUpper.position.y = -0.3;
        podGroup.add(podUpper);

        const podFoot = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.4, 12), metalJointMat);
        podFoot.position.set(Math.cos(ang) > 0 ? 0.35 : -0.35, -0.85, 0);
        podGroup.add(podFoot);

        modelGroup.add(podGroup);
      });

      // Orbiting Satellites
      const satelliteGroup = new THREE.Group();
      scene.add(satelliteGroup);

      const droneGeo = new THREE.IcosahedronGeometry(0.2, 1);
      const drone1 = new THREE.Mesh(droneGeo, coreReactorMat);
      drone1.position.set(2.4, 2.2, 0);
      satelliteGroup.add(drone1);

      const drone2 = new THREE.Mesh(droneGeo, visorMat);
      drone2.position.set(-2.2, 0.8, 1.2);
      satelliteGroup.add(drone2);

      animUpdaters.push((t) => {
        modelGroup.position.y = Math.sin(t * 2.0) * 0.08;
        headGroup.rotation.y = Math.sin(t * 1.2) * 0.15;
        const pulse = 1.8 + Math.sin(t * 4.0) * 0.6;
        coreReactorMat.emissiveIntensity = pulse;
        reactorLight.intensity = pulse * 1.5;
        satelliteGroup.rotation.y = t * 0.8;
      });
    }

    // --- VARIANT B: ESP32 Autonomous Quadruped Spider Robot ---
    function buildSpiderBotModel() {
      // Main Chassis Core (Hexagonal base plate)
      const bodyGeo = new THREE.CylinderGeometry(1.0, 1.1, 0.45, 8);
      const body = new THREE.Mesh(bodyGeo, darkChassisMat);
      body.position.y = 0.5;
      body.castShadow = true;
      modelGroup.add(body);

      // Upper Acrylic Shield Plate with Neon Core
      const topPlateGeo = new THREE.CylinderGeometry(0.85, 0.9, 0.1, 8);
      const topPlate = new THREE.Mesh(topPlateGeo, whiteArmorMat);
      topPlate.position.y = 0.75;
      modelGroup.add(topPlate);

      // Central Brain Microcontroller Module (ESP32)
      const espGeo = new THREE.BoxGeometry(0.65, 0.15, 0.45);
      const esp = new THREE.Mesh(espGeo, rfShieldMat);
      esp.position.set(0, 0.85, 0);
      modelGroup.add(esp);

      // Onboard Neon Core Ring
      const coreRingGeo = new THREE.TorusGeometry(0.4, 0.04, 8, 24);
      coreRingGeo.rotateX(Math.PI / 2);
      const coreRing = new THREE.Mesh(coreRingGeo, cyanAccentMat);
      coreRing.position.set(0, 0.82, 0);
      modelGroup.add(coreRing);

      // Ultrasonic Distance Sensor "Eyes" (Dual metal cylinders with cyan glow)
      const eyeMountGeo = new THREE.BoxGeometry(0.7, 0.3, 0.15);
      const eyeMount = new THREE.Mesh(eyeMountGeo, darkChassisMat);
      eyeMount.position.set(0, 0.6, 1.05);
      modelGroup.add(eyeMount);

      [-0.2, 0.2].forEach((x) => {
        const eyeCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.25, 16), metalJointMat);
        eyeCyl.rotateX(Math.PI / 2);
        eyeCyl.position.set(x, 0.6, 1.15);
        modelGroup.add(eyeCyl);

        const eyeLens = new THREE.Mesh(new THREE.CircleGeometry(0.09, 16), visorMat);
        eyeLens.position.set(x, 0.6, 1.28);
        modelGroup.add(eyeLens);
      });

      // 4 Articulated Quadruped Spider Legs (Femur + Tibia + Foot)
      const legAngles = [
        { angle: Math.PI / 4, signX: 1, signZ: 1 },
        { angle: (3 * Math.PI) / 4, signX: 1, signZ: -1 },
        { angle: -(3 * Math.PI) / 4, signX: -1, signZ: -1 },
        { angle: -Math.PI / 4, signX: -1, signZ: 1 },
      ];

      const legRefs = [];

      legAngles.forEach((cfg, idx) => {
        const legRoot = new THREE.Group();
        legRoot.position.set(cfg.signX * 0.85, 0.5, cfg.signZ * 0.85);

        // Hip Servo Cube
        const hipServo = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.28), metalJointMat);
        legRoot.add(hipServo);

        // Femur (Upper Leg Link)
        const femur = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 1.0, 12), whiteArmorMat);
        femur.position.set(cfg.signX * 0.5, 0.1, cfg.signZ * 0.2);
        femur.rotation.z = -cfg.signX * 0.6;
        femur.rotation.x = cfg.signZ * 0.3;
        legRoot.add(femur);

        // Knee Joint
        const knee = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), metalJointMat);
        knee.position.set(cfg.signX * 0.95, 0.45, cfg.signZ * 0.4);
        legRoot.add(knee);

        // Tibia (Lower Shin Link pointing down)
        const tibia = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.06, 1.4, 12), darkChassisMat);
        tibia.position.set(cfg.signX * 1.35, -0.2, cfg.signZ * 0.55);
        tibia.rotation.z = cfg.signX * 0.4;
        legRoot.add(tibia);

        // Rubber Contact Foot
        const foot = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), cyanAccentMat);
        foot.position.set(cfg.signX * 1.6, -0.85, cfg.signZ * 0.65);
        legRoot.add(foot);

        modelGroup.add(legRoot);
        legRefs.push({ root: legRoot, phase: idx * (Math.PI / 2) });
      });

      animUpdaters.push((t) => {
        // Living spider breathing & gait motion
        modelGroup.position.y = Math.sin(t * 3.0) * 0.05;
        legRefs.forEach((leg) => {
          leg.root.rotation.y = Math.sin(t * 3.5 + leg.phase) * 0.15;
          leg.root.rotation.z = Math.cos(t * 3.5 + leg.phase) * 0.08;
        });
      });
    }

    // --- VARIANT C: 4-DOF Metal Industrial Robotic Arm with Claw ---
    function buildRoboticArmModel() {
      // Circular Heavy Base Turntable
      const baseGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.3, 32);
      const base = new THREE.Mesh(baseGeo, darkChassisMat);
      base.position.y = -0.85;
      base.castShadow = true;
      modelGroup.add(base);

      // Polished Anodized Chrome Ring
      const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.04, 12, 32), cyanAccentMat);
      baseRing.rotateX(Math.PI / 2);
      baseRing.position.y = -0.7;
      modelGroup.add(baseRing);

      // Rotating Turret Platform
      const turretGroup = new THREE.Group();
      turretGroup.position.y = -0.65;
      modelGroup.add(turretGroup);

      const turretGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.4, 24);
      const turret = new THREE.Mesh(turretGeo, metalJointMat);
      turretGroup.add(turret);

      // Shoulder Joint & Heavy Servo Bracket
      const shoulderJoint = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.6, 16), darkChassisMat);
      shoulderJoint.rotateZ(Math.PI / 2);
      shoulderJoint.position.set(0, 0.4, 0);
      turretGroup.add(shoulderJoint);

      // Arm Link 1 (Shoulder to Elbow beam)
      const armLink1Group = new THREE.Group();
      armLink1Group.position.set(0, 0.4, 0);
      armLink1Group.rotation.z = 0.35;
      turretGroup.add(armLink1Group);

      const link1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.6, 0.35), whiteArmorMat);
      link1.position.set(0, 0.8, 0);
      armLink1Group.add(link1);

      // Neon Hydraulic Line Accent
      const hydraulicLine = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8), cyanAccentMat);
      hydraulicLine.position.set(0.16, 0.8, 0);
      armLink1Group.add(hydraulicLine);

      // Elbow Joint
      const elbowGroup = new THREE.Group();
      elbowGroup.position.set(0, 1.6, 0);
      elbowGroup.rotation.z = -0.7;
      armLink1Group.add(elbowGroup);

      const elbowServo = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.5, 16), metalJointMat);
      elbowServo.rotateZ(Math.PI / 2);
      elbowGroup.add(elbowServo);

      // Forearm Link 2
      const link2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.3, 0.3), darkChassisMat);
      link2.position.set(0, 0.65, 0);
      elbowGroup.add(link2);

      // Wrist Pivot & End Effector Claw Assembly
      const wristGroup = new THREE.Group();
      wristGroup.position.set(0, 1.3, 0);
      wristGroup.rotation.z = 0.4;
      elbowGroup.add(wristGroup);

      const wristServo = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), metalJointMat);
      wristGroup.add(wristServo);

      // Mechanical Gripper Palm
      const palm = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.25), whiteArmorMat);
      palm.position.set(0, 0.2, 0);
      wristGroup.add(palm);

      // Dual Articulated Claw Pinchers
      const clawLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.15), cyanAccentMat);
      clawLeft.position.set(-0.16, 0.45, 0);
      wristGroup.add(clawLeft);

      const clawRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.15), cyanAccentMat);
      clawRight.position.set(0.16, 0.45, 0);
      wristGroup.add(clawRight);

      animUpdaters.push((t) => {
        // Industrial smooth motion cycle
        turretGroup.rotation.y = Math.sin(t * 1.2) * 0.4;
        armLink1Group.rotation.z = 0.35 + Math.sin(t * 1.5) * 0.12;
        elbowGroup.rotation.z = -0.7 + Math.cos(t * 1.5) * 0.18;
        // Gripper pinch action
        const pinch = Math.sin(t * 2.5);
        clawLeft.position.x = -0.16 + pinch * 0.05;
        clawRight.position.x = 0.16 - pinch * 0.05;
      });
    }

    // --- VARIANT D: ESP32-WROOM-32D Dual-Core Dev Board ---
    function buildEsp32BoardModel() {
      // Main PCB Substrate
      const pcbGeo = new THREE.BoxGeometry(2.2, 0.08, 3.6);
      const pcb = new THREE.Mesh(pcbGeo, pcbMat);
      pcb.position.y = 0.6;
      pcb.castShadow = true;
      modelGroup.add(pcb);

      // Corner Mounting Holes (4 Gold Contact Rings)
      const cornerOffsets = [
        [-0.9, -1.6],
        [0.9, -1.6],
        [-0.9, 1.6],
        [0.9, 1.6],
      ];
      cornerOffsets.forEach(([x, z]) => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 8, 16), goldMat);
        ring.rotateX(Math.PI / 2);
        ring.position.set(x, 0.65, z);
        modelGroup.add(ring);
      });

      // Dual 19-Pin Header Strips (38 Pins) along Left and Right edges
      [-0.95, 0.95].forEach((x) => {
        // Plastic Header Socket
        const socket = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.3, 3.2), darkChassisMat);
        socket.position.set(x, 0.78, 0);
        modelGroup.add(socket);

        // Individual Gold Pins
        for (let i = -8; i <= 8; i++) {
          const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), goldMat);
          pin.position.set(x, 0.9, (i * 3.2) / 18);
          modelGroup.add(pin);
        }
      });

      // Metal RF Shield Module Can (ESP-WROOM-32)
      const shieldGeo = new THREE.BoxGeometry(1.2, 0.22, 1.6);
      const shield = new THREE.Mesh(shieldGeo, rfShieldMat);
      shield.position.set(0, 0.74, -0.4);
      modelGroup.add(shield);

      // PCB Meandered Inverted-F Antenna (Trace Section at top)
      const antennaZone = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.02, 0.6), goldMat);
      antennaZone.position.set(0, 0.66, -1.4);
      modelGroup.add(antennaZone);

      // Reversible USB Type-C Receptacle at bottom edge
      const usbPort = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.5), rfShieldMat);
      usbPort.position.set(0, 0.74, 1.65);
      modelGroup.add(usbPort);

      // BOOT & EN/RESET Micro Tactile Buttons
      [-0.45, 0.45].forEach((x) => {
        const btnBase = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.2), metalJointMat);
        btnBase.position.set(x, 0.72, 1.25);
        modelGroup.add(btnBase);

        const btnNipple = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.06, 8), whiteArmorMat);
        btnNipple.position.set(x, 0.81, 1.25);
        modelGroup.add(btnNipple);
      });

      // Status Indicator LEDs (Red Power + Cyan Flashing Data)
      const pwrLed = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      pwrLed.position.set(-0.25, 0.68, 0.9);
      modelGroup.add(pwrLed);

      const statusLed = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), visorMat);
      statusLed.position.set(0.25, 0.68, 0.9);
      modelGroup.add(statusLed);

      animUpdaters.push((t) => {
        // Gentle inspection hovering levitation
        modelGroup.position.y = Math.sin(t * 1.8) * 0.08;
        // High-frequency telemetry LED pulse
        visorMat.emissiveIntensity = 2.5 + Math.sin(t * 8.0) * 1.5;
      });
    }

    // --- VARIANT E: High-Tech Cyber Mech Drone ---
    function buildMechDroneModel() {
      // Central Fuselage Pod
      const bodyGeo = new THREE.SphereGeometry(0.8, 24, 16);
      bodyGeo.scale(1.2, 0.45, 1.2);
      const body = new THREE.Mesh(bodyGeo, whiteArmorMat);
      body.position.y = 0.8;
      body.castShadow = true;
      modelGroup.add(body);

      // Cyber Glowing Visor Dome on Top
      const domeGeo = new THREE.SphereGeometry(0.45, 16, 16);
      domeGeo.scale(1.0, 0.4, 1.0);
      const dome = new THREE.Mesh(domeGeo, coreReactorMat);
      dome.position.set(0, 0.98, 0);
      modelGroup.add(dome);

      // 4 Carbon Fiber Rotor Struts (X-Configuration)
      const rotors = [];
      const strutAngles = [Math.PI / 4, (3 * Math.PI) / 4, -(3 * Math.PI) / 4, -Math.PI / 4];

      strutAngles.forEach((ang) => {
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.8, 12), darkChassisMat);
        strut.rotateZ(Math.PI / 2);
        strut.rotateY(ang);
        strut.position.set(Math.cos(ang) * 0.9, 0.8, Math.sin(ang) * 0.9);
        modelGroup.add(strut);

        // Brushless Motor Hub
        const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.3, 16), metalJointMat);
        motor.position.set(Math.cos(ang) * 1.8, 0.85, Math.sin(ang) * 1.8);
        modelGroup.add(motor);

        // High-Speed Translucent Cyan Propeller Blades
        const propGroup = new THREE.Group();
        propGroup.position.set(Math.cos(ang) * 1.8, 1.02, Math.sin(ang) * 1.8);

        const propBlade1 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.02, 0.12), cyanAccentMat);
        propGroup.add(propBlade1);

        const propBlade2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 1.3), cyanAccentMat);
        propGroup.add(propBlade2);

        modelGroup.add(propGroup);
        rotors.push(propGroup);
      });

      // Underside 3-Axis Gimbal Sensor Eye
      const gimbalEye = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), visorMat);
      gimbalEye.position.set(0, 0.45, 0.4);
      modelGroup.add(gimbalEye);

      animUpdaters.push((t) => {
        // Quadcopter flight physics & propeller spin
        modelGroup.position.y = 0.8 + Math.sin(t * 3.0) * 0.12;
        modelGroup.rotation.z = Math.sin(t * 1.8) * 0.05;
        modelGroup.rotation.x = Math.cos(t * 1.8) * 0.05;
        rotors.forEach((rotor, idx) => {
          rotor.rotation.y += (idx % 2 === 0 ? 0.35 : -0.35);
        });
      });
    }

    // 8. Mouse Orbit & Pan Interaction
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      modelGroup.rotation.y += deltaX * 0.01;
      modelGroup.rotation.x = Math.max(-0.5, Math.min(0.5, modelGroup.rotation.x + deltaY * 0.01));

      prevMousePos = { x: e.clientX, y: e.clientY };

      setTelemetry({
        rotX: Math.round(modelGroup.rotation.x * 57.3),
        rotY: Math.round(modelGroup.rotation.y * 57.3),
        zoom: Math.round(((12 - camera.position.z) / 8) * 100),
      });
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      camera.position.z = Math.max(3.0, Math.min(10.0, camera.position.z + e.deltaY * 0.005));
      setTelemetry((prev) => ({
        ...prev,
        zoom: Math.round(((12 - camera.position.z) / 8) * 100),
      }));
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('wheel', onWheel, { passive: false });

    // 9. Animation Loop
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Run dynamic per-model animators
      for (let i = 0; i < animUpdatersRef.current.length; i++) {
        animUpdatersRef.current[i](elapsedTime);
      }

      if (autoRotate && !isDragging) {
        modelGroup.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || parseInt(height, 10) || 500;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 11. Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('wheel', onWheel);

      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      renderer.dispose();
    };
  }, [resolvedType, modelUrl, autoRotate, height]);

  // Wireframe toggle effect
  useEffect(() => {
    materialsRef.current.forEach((mat) => {
      if (mat) mat.wireframe = isWireframe;
    });
  }, [isWireframe]);

  const handleResetView = () => {
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.set(0, -0.3, 0);
    }
  };

  const getModelLabel = () => {
    if (productName) return productName.toUpperCase();
    if (resolvedType.includes('spider')) return 'ESP32 12-DOF SPIDER ROBOT';
    if (resolvedType.includes('arm')) return '4-DOF INDUSTRIAL ROBOTIC ARM';
    if (resolvedType.includes('esp32')) return 'ESP32-WROOM-32D DEV BOARD';
    if (resolvedType.includes('drone')) return 'HEXA-ROTOR DRONE SWARM CAD';
    return 'LAZYFORGE APEX-01 (ACTIVE CAD RIG)';
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden bg-[#0A0D14] border border-purple-500/30 shadow-2xl ${className}`}
    >
      {/* WebGL Canvas Container or Fallback */}
      {webglSupported ? (
        <div ref={mountRef} style={{ height }} className="w-full cursor-grab active:cursor-grabbing" />
      ) : (
        <div
          style={{ height }}
          className="w-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#0F111A] to-[#1E1B4B]"
        >
          <div className="w-20 h-20 rounded-2xl bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-brand-accent mb-4 animate-pulse">
            <Cpu className="w-10 h-10" />
          </div>
          <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            {getModelLabel()}
          </h4>
          <p className="text-xs text-slate-400 max-w-xs mt-1">
            Real-time interactive WebGL canvas active in hardware-accelerated browsers.
          </p>
        </div>
      )}

      {/* Floating Header Badge */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 pointer-events-none z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-brand-accent/20 border border-brand-accent/40 text-brand-accent backdrop-blur-md shadow-glow-sm">
          <Bot className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          <span>{getModelLabel()}</span>
        </span>
        {loadError && (
          <span className="text-[10px] font-mono text-amber-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
            {loadError}
          </span>
        )}
      </div>

      {/* Real-time Telemetry HUD */}
      {showTelemetry && (
        <div className="absolute bottom-4 left-4 p-3 rounded-2xl bg-black/70 border border-white/10 backdrop-blur-md text-[10px] font-mono text-slate-300 space-y-1 pointer-events-none hidden sm:block z-10 shadow-lg">
          <div className="flex items-center gap-2 pb-1 border-b border-white/10 text-cyan-400 font-bold">
            <Activity className="w-3 h-3 animate-spin" />
            <span>LIVE 60 FPS TELEMETRY</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">PITCH:</span>
            <span className="text-purple-400 font-bold">{telemetry.rotX}&deg;</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">YAW:</span>
            <span className="text-purple-400 font-bold">{telemetry.rotY}&deg;</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">ZOOM:</span>
            <span className="text-emerald-400 font-bold">{telemetry.zoom}%</span>
          </div>
          <div className="text-[9px] text-slate-500 pt-0.5">
            PBR METALLIC &bull; HARDWARE ACCELERATED
          </div>
        </div>
      )}

      {/* Interactive Controls Overlay */}
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
              autoRotate
                ? 'bg-brand-accent text-white border-brand-accent shadow-glow-sm'
                : 'bg-black/60 text-slate-300 border-white/10 hover:border-brand-accent'
            }`}
            title={autoRotate ? 'Pause 360 Rotation' : 'Enable 360 Auto-Rotate'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
              isWireframe
                ? 'bg-brand-accent text-white border-brand-accent shadow-glow-sm'
                : 'bg-black/60 text-slate-300 border-white/10 hover:border-brand-accent'
            }`}
            title="Toggle Wireframe CAD Mode"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetView}
            className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-300 hover:border-brand-accent hover:text-white backdrop-blur-md transition-all"
            title="Reset Alignment"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Drag & Orbit Prompt */}
      <div className="absolute bottom-4 right-4 pointer-events-none text-[11px] font-mono text-slate-400 bg-black/50 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-sm z-10 hidden sm:block">
        <span>Click &amp; Drag &bull; Scroll Zoom</span>
      </div>
    </div>
  );
}

export default RobotViewer3D;
