import { type ReactNode } from "react";

/** duplicates an object multiple times with offset */
export function R3FArrayObj(props: {
  count: number;
  children: ReactNode;
  /** offset position */
  position?: [x: number, y: number, z: number];
  /** offset rotation */
  rotation?: [x: number, y: number, z: number];
  /** offset scale */
  scale?: [x: number, y: number, z: number];
}) {
  const arr = [];

  for (let a = 0; a < props.count; a = a + 1) {
    arr.push({ index: a });
  }

  return (
    <>
      {arr.map((i) => (
        <group
          key={i.index}
          scale={
            props.scale && [
              i.index * props.scale[0],
              i.index * props.scale[1],
              i.index * props.scale[2],
            ]
          }
          rotation={
            props.rotation && [
              i.index * props.rotation[0],
              i.index * props.rotation[1],
              i.index * props.rotation[2],
            ]
          }
          position={
            props.position && [
              i.index * props.position[0],
              i.index * props.position[1],
              i.index * props.position[2],
            ]
          }
        >
          {props.children}
        </group>
      ))}
    </>
  );
}
