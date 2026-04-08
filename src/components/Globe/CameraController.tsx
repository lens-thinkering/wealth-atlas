"use client";

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { latLngToVector3 } from './utils';

// Camera positions: direction from origin toward each view center, at given distance
const USA_CAM = latLngToVector3(39, -98, 4.8);
const WORLD_CAM = new THREE.Vector3(0, 0, 5.5);
const ORIGIN = new THREE.Vector3(0, 0, 0);

const LERP_SPEED = 0.055;
const SNAP_THRESHOLD = 0.005;

interface CameraControllerProps {
  isUSA: boolean;
}

export default function CameraController({ isUSA }: CameraControllerProps) {
  const { camera, controls } = useThree();
  const targetCam = useRef(WORLD_CAM.clone());
  const transitioning = useRef(false);

  useEffect(() => {
    targetCam.current = isUSA ? USA_CAM.clone() : WORLD_CAM.clone();
    transitioning.current = true;

    const ctrl = controls as unknown as OrbitControlsImpl | null;
    if (ctrl) {
      ctrl.autoRotate = !isUSA;
    }
  }, [isUSA, controls]);

  useFrame(() => {
    if (!transitioning.current) return;

    camera.position.lerp(targetCam.current, LERP_SPEED);

    const ctrl = controls as unknown as OrbitControlsImpl | null;
    if (ctrl) {
      ctrl.target.lerp(ORIGIN, LERP_SPEED);
      ctrl.update();
    }

    if (camera.position.distanceTo(targetCam.current) < SNAP_THRESHOLD) {
      camera.position.copy(targetCam.current);
      transitioning.current = false;
    }
  });

  return null;
}
