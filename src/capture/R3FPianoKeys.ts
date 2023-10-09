export function R3FPianoKeys(props: {
  key_width: number;
  key_width_black_keys: number;
  key_height: number;
  octave_count: number;
}) {
  const white_keys = [];

  for (let a = 0; a < props.octave_count * 7; a = a + 1) {
    white_keys.push({ index: a });
  }

  const black_keys = [];

  for (let a = 0; a < props.octave_count * 7; a = a + 1) {
    black_keys.push({ index: a });
  }

  const output = {
    white_keys: white_keys.map((k) => {
      const left = k.index * props.key_width;
      return {
        index: k.index,
        scale: [props.key_width * 0.9, 0.01, props.key_height],
        position: [k.index * props.key_width, 0, 0],
        width: props.key_width,
        left,
        type: "white",
        mid: left + props.key_width / 2,
      };
    }),
    black_keys: black_keys
      .map((b) => {
        const left = 30 + b.index * props.key_width;

        return {
          index: b.index,
          removed_key: b.index % 7 == 2 || b.index % 7 == 6,
          scale: [props.key_width * 0.9, 0.01, props.key_height],
          width: props.key_width_black_keys,
          left,
          type: "black",
          mid: left + props.key_width_black_keys / 2,
        };
      })
      .filter((i) => !i.removed_key),
  };

  const combined: {
    index: number;
    width: number;
    left: number;
    type: "black" | "white";
    mid: number;
  }[] = [...output.white_keys, ...output.black_keys];

  return {
    combined,
    white_keys: output.white_keys,
    black_keys: output.black_keys,
  };

  // return (
  //   <>
  //     {white_keys.map((k) => {
  //       return (
  //         <group key={k.index}>
  //           <mesh
  //             scale={[props.key_width * 0.9, 0.01, props.key_height]}
  //             position={[k.index * props.key_width, 0, 0]}
  //           >
  //             <boxGeometry />
  //             <meshStandardMaterial color="rgb(225,225,225)" />
  //           </mesh>
  //         </group>
  //       );
  //     })}

  //     {black_keys.map((k) => {
  //       if (k.index % 7 == 2) return null;
  //       if (k.index % 7 == 6) return null;

  //       return (
  //         <group key={k.index}>
  //           <mesh
  //             scale={[props.key_width * 0.5, 0.02, props.key_height * 0.6]}
  //             position={[
  //               props.key_width / 2 + k.index * props.key_width,
  //               0.0,
  //               -0.2,
  //             ]}
  //           >
  //             <boxGeometry />
  //             <meshStandardMaterial color="rgb(45,45,45)" />
  //           </mesh>
  //         </group>
  //       );
  //     })}
  //   </>
  // );
}
