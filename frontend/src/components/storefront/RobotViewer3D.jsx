import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';
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
  FileCode,
  Box,
} from 'lucide-react';

export function RobotViewer3D({
  className = '',
  height = '500px',
  modelType = 'voxel_robot',
  modelUrl = null,
  productName = '',
  autoRotate: autoRotateProp = false,
  showControls = false,
  showTelemetry = false,
  showBottomBar = true,
  initialColor = 'white',
  onColorChange = null,
}) {
  const mountRef = useRef(null);
  const containerRef = useRef(null);
  const cameraRef = useRef(null);
  const primaryArmorMatRef = useRef(null);
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [isWireframe, setIsWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(autoRotateProp);
  const [webglSupported, setWebglSupported] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [telemetry, setTelemetry] = useState({ rotX: 0, rotY: 0, zoom: 100 });
  const [modelStats, setModelStats] = useState({
    format: 'VOXEL RIG',
    triangles: 140,
    dimensions: '140 × 90 × 260 mm',
    source: 'PARAMETRIC 3D CAD',
  });

  const COLOR_PALETTES = {
    copper: { color: 0xeb6b2c, metalness: 0.85, roughness: 0.2 },
    white: { color: 0xd6d9e0, metalness: 0.2, roughness: 0.25 },
    dark: { color: 0x22252e, metalness: 0.88, roughness: 0.3 },
    gold: { color: 0xf59e0b, metalness: 0.95, roughness: 0.18 },
  };

  const handleColorSelect = (colorKey) => {
    setCurrentColor(colorKey);
    if (onColorChange) onColorChange(colorKey);
    const pal = COLOR_PALETTES[colorKey] || COLOR_PALETTES.white;
    if (primaryArmorMatRef.current) {
      primaryArmorMatRef.current.color.setHex(pal.color);
      primaryArmorMatRef.current.metalness = pal.metalness;
      primaryArmorMatRef.current.roughness = pal.roughness;
      primaryArmorMatRef.current.needsUpdate = true;
    }
  };

  const handleResetView = () => {
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.set(0, -0.3, 0);
    }
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 1.05, 5.8);
      cameraRef.current.lookAt(0, 1.0, 0);
    }
  };

  const handleToggleFullscreen = () => {
    const el = containerRef.current || mountRef.current?.parentElement;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch((err) => console.warn('Fullscreen error:', err));
    } else {
      document.exitFullscreen().catch((err) => console.warn('Exit fullscreen error:', err));
    }
  };

  // References to mutable Three.js objects
  const sceneRef = useRef(null);
  const modelGroupRef = useRef(null);
  const animUpdatersRef = useRef([]);
  const materialsRef = useRef([]);

  // Resolve actual model identifier
  const resolvedType = (modelType || modelUrl || 'voxel_robot').toLowerCase();

  useEffect(() => {
    setAutoRotate(autoRotateProp);
  }, [autoRotateProp]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const parseExplicitHeight = () => {
      if (typeof height === 'number') return height;
      if (typeof height === 'string' && height.endsWith('px')) {
        return parseInt(height, 10);
      }
      return null;
    };

    const explicitH = parseExplicitHeight();
    const getDims = () => {
      const w = container.clientWidth || container.parentElement?.clientWidth || 600;
      let h = explicitH || container.clientHeight || container.parentElement?.clientHeight;
      if (!h || h < 200) {
        h = 520;
      }
      return { width: Math.max(w, 200), height: Math.max(h, 250) };
    };

    const initialDims = getDims();
    const width = initialDims.width;
    const heightPx = initialDims.height;

    // 1. Scene with dark aesthetic matching reference mockup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x232530);
    sceneRef.current = scene;

    // 2. Camera: Centered and positioned for high-resolution inspection
    const camera = new THREE.PerspectiveCamera(40, width / heightPx, 0.1, 100);
    camera.position.set(0, 1.05, 5.8);
    camera.lookAt(0, 1.0, 0);
    cameraRef.current = camera;

    // 3. Renderer with graceful fallback if WebGL is unavailable (e.g. test environments)
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, heightPx);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn('WebGLRenderer unavailable in current runtime:', err.message);
      setWebglSupported(false);
      return;
    }

    // 4. Studio Sci-Fi Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 2.2);
    frontLight.position.set(0, 3, 5);
    scene.add(frontLight);

    const topKeyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    topKeyLight.position.set(4, 7, 3);
    topKeyLight.castShadow = true;
    scene.add(topKeyLight);

    // Warm Orange / Copper Accent Light
    const orangeRim = new THREE.DirectionalLight(0xff7a00, 2.2);
    orangeRim.position.set(-4, 3, 2);
    scene.add(orangeRim);

    // Electric Blue Rim Light
    const blueRim = new THREE.DirectionalLight(0x0066ff, 2.5);
    blueRim.position.set(4, -1, -3);
    scene.add(blueRim);

    // Center Stage Reactor Glow
    const reactorLight = new THREE.PointLight(0xffaa33, 2.5, 7);
    reactorLight.position.set(0, 1.1, 0.7);
    scene.add(reactorLight);

    // 5. High-Tech Grid Floor
    const gridHelper = new THREE.GridHelper(16, 32, 0x3e4458, 0x2b303e);
    gridHelper.position.y = -0.85;
    scene.add(gridHelper);

    // 6. Base Materials Palette
    const materials = [];
    materialsRef.current = materials;

    const currentPal = COLOR_PALETTES[currentColor] || COLOR_PALETTES.white;

    const whiteArmorMat = new THREE.MeshStandardMaterial({
      color: currentPal.color,
      metalness: currentPal.metalness,
      roughness: currentPal.roughness,
    });
    materials.push(whiteArmorMat);
    primaryArmorMatRef.current = whiteArmorMat;

    const voxelOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xffa028,
      emissive: 0xff7a00,
      emissiveIntensity: 1.8,
      metalness: 0.1,
      roughness: 0.2,
    });
    materials.push(voxelOrangeMat);

    const voxelDarkMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      metalness: 0.4,
      roughness: 0.5,
    });
    materials.push(voxelDarkMat);

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
      color: 0x38bdf8,
      emissive: 0x0066ff,
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

    // Check if custom uploaded 3D model (STL, 3MF, GLB, GLTF, etc.)
    const isCustomUrl = Boolean(
      modelUrl &&
      (modelUrl.startsWith('http') ||
       modelUrl.startsWith('/uploads/') ||
       modelUrl.endsWith('.stl') ||
       modelUrl.endsWith('.3mf') ||
       modelUrl.endsWith('.glb') ||
       modelUrl.endsWith('.gltf'))
    );
    const fileExt = (modelUrl || '').split('?')[0].split('.').pop()?.toLowerCase();

    if (isCustomUrl) {
      if (fileExt === 'stl') {
        const loader = new STLLoader();
        loader.load(
          modelUrl,
          (geometry) => {
            geometry.computeVertexNormals();
            geometry.computeBoundingBox();
            const box = geometry.boundingBox;
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const scale = 2.4 / maxDim;

            const triCount = geometry.attributes.position ? Math.round(geometry.attributes.position.count / 3) : 0;
            const dimStr = `${Math.round(size.x * 10)} × ${Math.round(size.y * 10)} × ${Math.round(size.z * 10)} mm`;
            setModelStats({
              format: 'STL 3D MESH',
              triangles: triCount,
              dimensions: dimStr,
              source: 'ADMIN STL UPLOAD',
            });

            // Engineering material dynamically responsive to color swatches
            const stlMat = new THREE.MeshStandardMaterial({
              color: currentPal.color,
              metalness: currentPal.metalness,
              roughness: currentPal.roughness,
            });
            primaryArmorMatRef.current = stlMat;
            materials.push(stlMat);

            const mesh = new THREE.Mesh(geometry, stlMat);
            mesh.scale.setScalar(scale);
            const center = box.getCenter(new THREE.Vector3());
            mesh.position.x = -center.x * scale;
            mesh.position.y = -center.y * scale + 0.8;
            mesh.position.z = -center.z * scale;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            modelGroup.add(mesh);
            setLoadError(null);
          },
          undefined,
          (err) => {
            console.warn('Failed to load custom STL model, falling back to preset:', err.message);
            setLoadError('Custom STL file unavailable, rendering CAD proxy.');
            buildProceduralModel('apex_mascot');
          }
        );
      } else if (fileExt === '3mf') {
        const loader = new ThreeMFLoader();
        loader.load(
          modelUrl,
          (object) => {
            const box = new THREE.Box3().setFromObject(object);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const scale = 2.4 / maxDim;
            object.scale.setScalar(scale);

            const center = box.getCenter(new THREE.Vector3());
            object.position.x = -center.x * scale;
            object.position.y = -center.y * scale + 0.8;
            object.position.z = -center.z * scale;

            let triCount = 0;
            object.traverse((child) => {
              if (child.isMesh) {
                if (child.geometry?.attributes?.position) {
                  triCount += Math.round(child.geometry.attributes.position.count / 3);
                }
                if (child.material) {
                  materials.push(child.material);
                }
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            const dimStr = `${Math.round(size.x * 10)} × ${Math.round(size.y * 10)} × ${Math.round(size.z * 10)} mm`;
            setModelStats({
              format: '3MF ADDITIVE CAD',
              triangles: triCount,
              dimensions: dimStr,
              source: 'ADMIN 3MF UPLOAD',
            });

            modelGroup.add(object);
            setLoadError(null);
          },
          undefined,
          (err) => {
            console.warn('Failed to load custom 3MF model, falling back to preset:', err.message);
            setLoadError('Custom 3MF file unavailable, rendering CAD proxy.');
            buildProceduralModel('apex_mascot');
          }
        );
      } else {
        // GLB / GLTF Loader
        const loader = new GLTFLoader();
        loader.load(
          modelUrl,
          (gltf) => {
            const loadedModel = gltf.scene;
            const box = new THREE.Box3().setFromObject(loadedModel);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const scale = 2.4 / maxDim;
            loadedModel.scale.setScalar(scale);

            const center = box.getCenter(new THREE.Vector3());
            loadedModel.position.x = -center.x * scale;
            loadedModel.position.y = -center.y * scale + 0.8;
            loadedModel.position.z = -center.z * scale;

            let triCount = 0;
            loadedModel.traverse((child) => {
              if (child.isMesh) {
                if (child.geometry?.attributes?.position) {
                  triCount += Math.round(child.geometry.attributes.position.count / 3);
                }
                if (child.material) {
                  materials.push(child.material);
                }
                child.castShadow = true;
              }
            });

            setModelStats({
              format: 'GLB 3D RIG',
              triangles: triCount,
              dimensions: `${Math.round(size.x * 10)} × ${Math.round(size.y * 10)} × ${Math.round(size.z * 10)} mm`,
              source: 'ADMIN 3D UPLOAD',
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
      }
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
      } else if (type.includes('apex_mascot') && !type.includes('voxel')) {
        buildApexMascotModel();
      } else {
        buildVoxelRobotModel();
      }
    }

    // --- VARIANT: Reference Voxel Robot (Matching Exact Reference Mockup) ---
    function buildVoxelRobotModel() {
      // 1. Torso (Main light gray cuboid body)
      const torsoGeo = new THREE.BoxGeometry(1.35, 1.55, 0.95);
      const torso = new THREE.Mesh(torsoGeo, whiteArmorMat);
      torso.position.set(0, 0.45, 0);
      torso.castShadow = true;
      torso.receiveShadow = true;
      modelGroup.add(torso);

      // Chest plate (Orange glowing rectangular badge on torso front)
      const chestBadgeGeo = new THREE.BoxGeometry(0.65, 0.42, 0.08);
      const chestBadge = new THREE.Mesh(chestBadgeGeo, voxelOrangeMat);
      chestBadge.position.set(0, 0.55, 0.50);
      modelGroup.add(chestBadge);

      // 2. Head (Main light gray cuboid head)
      const headGeo = new THREE.BoxGeometry(1.25, 1.05, 1.0);
      const head = new THREE.Mesh(headGeo, whiteArmorMat);
      head.position.set(0, 1.80, 0);
      head.castShadow = true;
      head.receiveShadow = true;
      modelGroup.add(head);

      // Left Eye (Orange rectangular box)
      const eyeGeo = new THREE.BoxGeometry(0.18, 0.18, 0.04);
      const leftEye = new THREE.Mesh(eyeGeo, voxelOrangeMat);
      leftEye.position.set(-0.32, 1.85, 0.52);
      modelGroup.add(leftEye);

      // Right Eye (Orange rectangular box)
      const rightEye = new THREE.Mesh(eyeGeo, voxelOrangeMat);
      rightEye.position.set(0.32, 1.85, 0.52);
      modelGroup.add(rightEye);

      // Top Antenna Stalk (dark thin vertical rod)
      const stalkGeo = new THREE.BoxGeometry(0.08, 0.45, 0.08);
      const stalk = new THREE.Mesh(stalkGeo, voxelDarkMat);
      stalk.position.set(0, 2.55, 0);
      modelGroup.add(stalk);

      // Top Antenna Tip (Orange cube)
      const tipGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
      const tip = new THREE.Mesh(tipGeo, voxelOrangeMat);
      tip.position.set(0, 2.82, 0);
      modelGroup.add(tip);

      // 3. Arms (Dark charcoal cuboids on sides)
      const armGeo = new THREE.BoxGeometry(0.36, 1.35, 0.48);
      const leftArm = new THREE.Mesh(armGeo, voxelDarkMat);
      leftArm.position.set(-0.90, 0.35, 0);
      leftArm.castShadow = true;
      modelGroup.add(leftArm);

      const rightArm = new THREE.Mesh(armGeo, voxelDarkMat);
      rightArm.position.set(0.90, 0.35, 0);
      rightArm.castShadow = true;
      modelGroup.add(rightArm);

      // 4. Legs (Dark charcoal cuboids at bottom)
      const legGeo = new THREE.BoxGeometry(0.42, 0.95, 0.52);
      const leftLeg = new THREE.Mesh(legGeo, voxelDarkMat);
      leftLeg.position.set(-0.32, -0.80, 0);
      leftLeg.castShadow = true;
      modelGroup.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeo, voxelDarkMat);
      rightLeg.position.set(0.32, -0.80, 0);
      rightLeg.castShadow = true;
      modelGroup.add(rightLeg);

      // Default model orientation to match the reference 3D perspective angle
      modelGroup.rotation.set(0.05, -0.42, 0);

      setModelStats({
        format: 'VOXEL RIG',
        triangles: 140,
        dimensions: '140 × 90 × 260 mm',
        source: 'VOXEL CAD RIG',
      });
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

    // Touch support for mobile devices
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      modelGroup.rotation.y += deltaX * 0.01;
      modelGroup.rotation.x += deltaY * 0.01;
      setTelemetry((prev) => ({
        ...prev,
        rotX: Math.round((modelGroup.rotation.x * 180) / Math.PI) % 360,
        rotY: Math.round((modelGroup.rotation.y * 180) / Math.PI) % 360,
      }));
    };
    const onTouchEnd = () => {
      isDragging = false;
    };
    domEl.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

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

    // 10. Resize Handling with ResizeObserver
    const handleResize = () => {
      if (!container) return;
      const dims = getDims();
      camera.aspect = dims.width / dims.height;
      camera.updateProjectionMatrix();
      renderer.setSize(dims.width, dims.height);
    };

    window.addEventListener('resize', handleResize);

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(container);
    }

    // 11. Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('wheel', onWheel);
      domEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

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

  const getModelLabel = () => {
    if (productName) return productName.toUpperCase();
    if (resolvedType.includes('spider')) return 'ESP32 12-DOF SPIDER ROBOT';
    if (resolvedType.includes('arm')) return '4-DOF INDUSTRIAL ROBOTIC ARM';
    if (resolvedType.includes('esp32')) return 'ESP32-WROOM-32D DEV BOARD';
    if (resolvedType.includes('drone')) return 'HEXA-ROTOR DRONE SWARM CAD';
    return 'VOXEL COMPANION ROBOT';
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[440px] rounded-2xl overflow-hidden bg-[#232530] border border-slate-700/80 shadow-2xl flex flex-col justify-between ${className}`}
    >
      {/* WebGL Canvas Container or Fallback */}
      {webglSupported ? (
        <div
          ref={mountRef}
          style={{ height: height === '100%' ? '100%' : height }}
          className="w-full h-full min-h-[400px] flex-1 cursor-grab active:cursor-grabbing relative overflow-hidden"
        />
      ) : (
        <div
          style={{ height }}
          className="w-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#1F222C] to-[#161820]"
        >
          <div className="w-20 h-20 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-center text-[#FF7A00] mb-4 animate-pulse">
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

      {/* Floating Header Badges */}
      <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none z-10">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FFA028] backdrop-blur-md shadow-glow-sm">
            <Bot className="w-3.5 h-3.5 animate-pulse text-[#FFA028]" />
            <span>{getModelLabel()}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 border border-white/20 text-white backdrop-blur-md">
            <FileCode className="w-3 h-3 text-[#FFA028]" />
            <span>{modelStats.format}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-semibold text-slate-300 bg-black/60 border border-white/10 px-2 py-0.5 rounded-md backdrop-blur-xs">
            {modelStats.triangles > 0 ? `${modelStats.triangles.toLocaleString()} Tris` : 'Procedural Mesh'}
          </span>
          <span className="text-[10px] font-mono text-amber-300 bg-black/60 border border-white/10 px-2 py-0.5 rounded-md backdrop-blur-xs">
            {modelStats.dimensions}
          </span>
        </div>
        {loadError && (
          <span className="text-[10px] font-mono text-amber-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
            {loadError}
          </span>
        )}
      </div>

      {/* Real-time Telemetry HUD */}
      {showTelemetry && (
        <div className="absolute bottom-16 left-4 p-3.5 rounded-2xl bg-black/80 border border-white/10 backdrop-blur-md text-[10px] font-mono text-slate-300 space-y-1.5 pointer-events-none hidden sm:block z-10 shadow-2xl min-w-[210px]">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-[#FFA028] font-bold">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 animate-spin" />
              <span>LIVE 60 FPS CAD HUD</span>
            </div>
            <span className="text-[9px] text-emerald-400 font-mono">STABLE</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">FORMAT:</span>
            <span className="text-white font-bold">{modelStats.format}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">POLYGONS:</span>
            <span className="text-[#FFA028] font-bold">{modelStats.triangles.toLocaleString()} TRIS</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">BOUNDING:</span>
            <span className="text-white font-bold">{modelStats.dimensions}</span>
          </div>
          <div className="flex justify-between gap-4 pt-1 border-t border-white/5">
            <span className="text-slate-400">PITCH / YAW:</span>
            <span className="text-[#FFA028] font-bold">{telemetry.rotX}&deg; / {telemetry.rotY}&deg;</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">ZOOM:</span>
            <span className="text-emerald-400 font-bold">{telemetry.zoom}%</span>
          </div>
          <div className="text-[9px] text-slate-500 pt-1 border-t border-white/5 truncate">
            SOURCE: {modelStats.source}
          </div>
        </div>
      )}

      {/* Interactive Controls Overlay */}
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
              autoRotate
                ? 'bg-[#FF7A00] text-white border-[#FFA028] shadow-[0_0_15px_rgba(255,122,0,0.6)]'
                : 'bg-black/60 text-slate-300 border-white/10 hover:border-[#FF7A00] hover:text-white'
            }`}
            title={autoRotate ? 'Pause 360 Rotation' : 'Enable 360 Auto-Rotate'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsWireframe(!isWireframe)}
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
              isWireframe
                ? 'bg-[#FF7A00] text-white border-[#FFA028] shadow-[0_0_15px_rgba(255,122,0,0.6)]'
                : 'bg-black/60 text-slate-300 border-white/10 hover:border-[#FF7A00] hover:text-white'
            }`}
            title="Toggle Wireframe CAD Mode"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Control Bar matching Reference Mockup exactly */}
      {showBottomBar && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
          {/* Left Controls: Reset view & Fullscreen */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetView}
              className="px-3.5 py-1.5 rounded-md bg-[#1E2028]/95 hover:bg-[#2A2C38] text-slate-200 border border-slate-700 text-xs font-medium backdrop-blur-md transition-all shadow-sm flex items-center gap-1.5 cursor-pointer hover:border-slate-500"
              title="Reset View"
            >
              <span>Reset view</span>
            </button>
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="px-3.5 py-1.5 rounded-md bg-[#1E2028]/95 hover:bg-[#2A2C38] text-slate-200 border border-slate-700 text-xs font-medium backdrop-blur-md transition-all shadow-sm flex items-center gap-1.5 cursor-pointer hover:border-slate-500"
              title="Fullscreen"
            >
              <span>Fullscreen</span>
            </button>
          </div>

          {/* Right Color Swatches */}
          <div className="flex items-center gap-2.5">
            {/* 1. Copper / Orange gradient circle */}
            <button
              type="button"
              onClick={() => handleColorSelect('copper')}
              className={`w-6 h-6 rounded-full transition-all cursor-pointer relative ${
                currentColor === 'copper'
                  ? 'ring-2 ring-white scale-110 shadow-[0_0_10px_rgba(255,122,0,0.9)]'
                  : 'hover:scale-110 opacity-90'
              }`}
              style={{
                background: 'conic-gradient(from 180deg at 50% 50%, #FF8C38 0deg, #E65100 180deg, #FFA726 360deg)',
              }}
              title="Copper / Orange Finish"
            />

            {/* 2. White / Silver circle */}
            <button
              type="button"
              onClick={() => handleColorSelect('white')}
              className={`w-6 h-6 rounded-full bg-[#E5E7EB] transition-all cursor-pointer relative ${
                currentColor === 'white'
                  ? 'ring-2 ring-[#FF7A00] scale-110 shadow-[0_0_10px_rgba(255,255,255,0.8)]'
                  : 'hover:scale-110 opacity-90'
              }`}
              title="White / Silver Armor"
            />

            {/* 3. Dark Charcoal circle */}
            <button
              type="button"
              onClick={() => handleColorSelect('dark')}
              className={`w-6 h-6 rounded-full bg-[#374151] transition-all cursor-pointer relative ${
                currentColor === 'dark'
                  ? 'ring-2 ring-[#FF7A00] scale-110 shadow-[0_0_10px_rgba(0,0,0,0.8)]'
                  : 'hover:scale-110 opacity-90'
              }`}
              title="Dark Stealth Charcoal"
            />

            {/* 4. Gold / Yellow circle */}
            <button
              type="button"
              onClick={() => handleColorSelect('gold')}
              className={`w-6 h-6 rounded-full bg-[#EAB308] transition-all cursor-pointer relative ${
                currentColor === 'gold'
                  ? 'ring-2 ring-white scale-110 shadow-[0_0_10px_rgba(234,179,8,0.9)]'
                  : 'hover:scale-110 opacity-90'
              }`}
              title="Gold Cyber Finish"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default RobotViewer3D;
