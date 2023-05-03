export function R3FPianoKeys(props: {
  key_width: number;
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

  return (
    <>
      {white_keys.map((k) => {
        return (
          <group key={k.index}>
            <mesh
              scale={[props.key_width * 0.9, 0.01, props.key_height]}
              position={[k.index * props.key_width, 0, 0]}
            >
              <boxGeometry />
              <meshStandardMaterial color="rgb(225,225,225)" />
            </mesh>
          </group>
        );
      })}

      {black_keys.map((k) => {
        if (k.index % 7 == 2) return null;
        if (k.index % 7 == 6) return null;

        return (
          <group key={k.index}>
            <mesh
              scale={[props.key_width * 0.5, 0.02, props.key_height * 0.6]}
              position={[
                props.key_width / 2 + k.index * props.key_width,
                0.0,
                -0.2,
              ]}
            >
              <boxGeometry />
              <meshStandardMaterial color="rgb(45,45,45)" />
            </mesh>
          </group>
        );
      })}
    </>
  );
}
