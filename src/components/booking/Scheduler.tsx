import { Room } from "@/api/rooms";
import { useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

interface RoomProps {
  rooms: Room[];
}

const Scheduler: React.FC<RoomProps> = ({ rooms }) => {
  const totalHeight = rooms.length * 3.5;
  const [layout, setLayout] = useState([
    { i: "0", x: 0, y: 0, w: 2, h: 1 },
    { i: "1", x: 5, y: 1, w: 2, h: 1 },
  ]);

  return (
    <div className={`booking-layout absolute top-12 left-36 bg-teal-400`}>
      <GridLayout
        className={`p-0 m-0`}
        layout={layout}
        cols={4 * 7}
        rowHeight={56}
        width={1308}
        preventCollision={true}
        margin={[4, 0]}
        draggableHandle=".handle"
        resizeHandles={["n", "e", "s", "w"]}
      >
        {layout.map(({ i, x, y, w, h }) => (
          <div
            className="handle bg-teal-300 bg-opacity-50 border-1 text-center"
            key={i}
          >
            {`Item ${i}`}
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default Scheduler;
