"use client";

import { useRef, useMemo, useCallback } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import {
  GeoFeature,
  FeatureBBox,
  buildBorderGeometry,
  getFeatureBBox,
  vectorToLatLng,
  findFeatureAtPoint,
  GLOBE_RADIUS,
} from './utils';

const COLOR_DEFAULT = new THREE.Color('#1a2a1a');
const COLOR_HOVERED = new THREE.Color('#39ff14');
const COLOR_SELECTED = new THREE.Color('#00f5ff');

interface StateLayerProps {
  features: GeoFeature[];
  selectedCode: string | null;
  onHover: (code: string | null, name: string | null) => void;
  onSelect: (code: string, name: string) => void;
}

export default function StateLayer({
  features,
  selectedCode,
  onHover,
  onSelect,
}: StateLayerProps) {
  const lineRefs = useRef<Map<string, THREE.LineSegments>>(new Map());
  const prevHoveredCode = useRef<string | null>(null);

  const { borderGeos, bboxes } = useMemo(() => {
    const borderGeos = features.map((f) => ({
      code: f.properties.ISO_A3,
      name: f.properties.name,
      geo: buildBorderGeometry(f),
    }));
    const bboxes = new Map<string, FeatureBBox>(
      features.map((f) => [f.properties.ISO_A3, getFeatureBBox(f)])
    );
    return { borderGeos, bboxes };
  }, [features]);

  const setLineColor = useCallback((code: string, color: THREE.Color) => {
    const line = lineRefs.current.get(code);
    if (line) (line.material as THREE.LineBasicMaterial).color.copy(color);
  }, []);

  const handlePointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      const [lat, lng] = vectorToLatLng(event.point);
      const feature = findFeatureAtPoint(lat, lng, features, bboxes);
      const newCode = feature?.properties.ISO_A3 ?? null;

      if (newCode === prevHoveredCode.current) return;

      if (prevHoveredCode.current && prevHoveredCode.current !== selectedCode) {
        setLineColor(prevHoveredCode.current, COLOR_DEFAULT);
      }
      if (newCode && newCode !== selectedCode) {
        setLineColor(newCode, COLOR_HOVERED);
      }

      prevHoveredCode.current = newCode;
      onHover(newCode, feature?.properties.name ?? null);
    },
    [features, bboxes, selectedCode, setLineColor, onHover]
  );

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      const [lat, lng] = vectorToLatLng(event.point);
      const feature = findFeatureAtPoint(lat, lng, features, bboxes);
      if (feature) {
        const code = feature.properties.ISO_A3;
        onSelect(code, feature.properties.name);
        lineRefs.current.forEach((line, c) => {
          const mat = line.material as THREE.LineBasicMaterial;
          mat.color.copy(c === code ? COLOR_SELECTED : COLOR_DEFAULT);
        });
      }
    },
    [features, bboxes, onSelect]
  );

  const handlePointerLeave = useCallback(() => {
    if (prevHoveredCode.current && prevHoveredCode.current !== selectedCode) {
      setLineColor(prevHoveredCode.current, COLOR_DEFAULT);
    }
    prevHoveredCode.current = null;
    onHover(null, null);
  }, [selectedCode, setLineColor, onHover]);

  return (
    <group>
      {/* Invisible hit sphere */}
      <mesh
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        onPointerLeave={handlePointerLeave}
      >
        <sphereGeometry args={[GLOBE_RADIUS, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* State border lines */}
      {borderGeos.map(({ code, geo }) => (
        <lineSegments
          key={code}
          ref={(el: THREE.LineSegments | null) => {
            if (el) lineRefs.current.set(code, el);
            else lineRefs.current.delete(code);
          }}
          geometry={geo}
        >
          <lineBasicMaterial
            color={code === selectedCode ? COLOR_SELECTED : COLOR_DEFAULT}
          />
        </lineSegments>
      ))}
    </group>
  );
}
