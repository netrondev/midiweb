import { useGLTF } from "@react-three/drei";

import { type BufferGeometry } from "three";

export function Suzi() {
  type SuziType = { nodes: { Suzanne: { geometry: BufferGeometry } } };

  const data = useGLTF(
    "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/suzanne-high-poly/model.gltf"
  ) as unknown as SuziType;

  return (
    <>
      <mesh
        castShadow
        receiveShadow
        geometry={data?.nodes?.Suzanne?.geometry}
        rotation={[-0.63, 0, 0]}
      >
        <meshStandardMaterial color="#9d4b4b" />
      </mesh>
    </>
  );
}
