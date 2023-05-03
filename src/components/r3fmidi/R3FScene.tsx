import { Canvas } from "@react-three/fiber";
import {
  PerspectiveCamera,
  CameraControls,
  AccumulativeShadows,
  RandomizedLight,
  Environment,
} from "@react-three/drei";

import { Ground } from "../r3fcomponents/Ground";

import { R3FPianoKeys } from "./R3FPianoKeys";

export function R3FScene() {
  return (
    <section className="h-full w-full bg-gray-700">
      <Canvas shadows>
        <CameraControls />

        <PerspectiveCamera
          makeDefault
          //   manual
          position={[1, 5, 10]}
          rotation={[0, 0, 0]}
        />

        <R3FPianoKeys key_width={0.2} key_height={1} octave_count={2} />

        {/* <group position={[2, 0, 2]}>
          <Center top>
            <Suzi />
          </Center>
        </group> */}

        {/* <Shadows /> */}

        <AccumulativeShadows
          frames={100}
          color="#339999"
          colorBlend={0.5}
          alphaTest={0.9}
          scale={20}
        >
          <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
        </AccumulativeShadows>
        <Ground />
        <Environment preset="city" />
      </Canvas>
    </section>
  );
}
