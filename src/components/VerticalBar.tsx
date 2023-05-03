export function VerticalBar(props: { percentage: number }) {
  let h = props.percentage;

  if (h > 100) h = 100;

  if (h < 0) h = 0;

  return (
    <div
      className="flex-0 relative w-1 bg-gray-300"
      style={{
        width: 5,
      }}
    >
      <div
        className="absolute bottom-0 left-0 right-0 bg-red-500"
        style={{ height: `${h}%` }}
      />
    </div>
  );
}
