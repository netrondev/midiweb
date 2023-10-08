import { Button } from "netrondata";
import { api } from "~/utils/api";

export default function Capture() {
  const docap = api.capture.do_capture.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  if (!docap.data) return <div>loading</div>;

  return (
    <div>
      Capture
      {/* <Button
        onClick={() => {
          docap.mutate();
        }}
      >
        Do Capture
      </Button> */}
      <div className="flex flex-wrap" style={{ width: docap.data.w }}>
        {docap.data.pixel_data.map((p) => (
          <div
            key={p.id}
            style={{
              width: 1,
              height: 50,
              backgroundColor: `rgb(${p.r}, ${p.g},${p.b})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
