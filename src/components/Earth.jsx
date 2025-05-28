import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import earthTexture from '/8k_earth_nightmap.jpg';
import cloudTexture from '/8k_earth_clouds.jpg';  

export default function Earth() {
  const earthRef = useRef();
  const cloudsRef = useRef();

  const earthMap = useLoader(TextureLoader, earthTexture);
  const cloudsMap = useLoader(TextureLoader, cloudTexture);

  useFrame(() => {
    earthRef.current.rotation.y += 0.002;   
    cloudsRef.current.rotation.y += 0.003; 
  });

  return (
    <>
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.75, 64, 64]} />
        <meshStandardMaterial map={earthMap} />
      </mesh>

      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.78, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.2}
          depthWrite={false}
          side={2} 
        />
      </mesh>
    </>
  );
}
