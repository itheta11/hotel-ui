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
  const [layout, setLayout] = useState([{ i: "0", x: 0, y: 0, w: 2, h: 1 }]);

  return (
    <div
      className={` absolute top-12 left-36 w-[calc(100%-9rem)] h-[${
        totalHeight + "rem"
      }] bg-teal-100`}
    >
      <div>
        <GridLayout
          className="layout p-0 m-0 transform-none bg-teal-700"
          layout={layout}
          cols={7}
          rowHeight={56}
          width={1320}
          preventCollision={true}
          compactType={null}
        >
          {layout.map(({ i, x, y, w, h }) => (
            <div
              className="!transform-none"
              key={i}
              style={{ border: "1px solid black", textAlign: "center" }}
            >
              {`Item ${i} x: ${x} y: ${y} w: ${w} h: ${h}`}
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
};

export default Scheduler;
