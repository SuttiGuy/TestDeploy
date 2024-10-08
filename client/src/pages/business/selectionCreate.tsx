import React, { useEffect, useRef, useState } from "react";
import { BsPersonWalking } from "react-icons/bs";

const LeftSide = () => {
  return (
    <div className="w-full md:w-[70%] xl:w-[70%] h-full md:h-screen flex flex-col items-center justify-center relative">
      <a
        href="http://localhost:5173/createHomeStay"
        className="relative group w-full text-center mb-6"
      >
        <div className="text-overlay text-[24px] md:text-[25px] xl:text-[40px] font-bold relative z-10">
          สร้างที่พัก
        </div>
        <div className="bg-custom-bg1 absolute inset-0 transition duration-300 ease-in-out transform group-hover:scale-105 rounded-br-lg rounded-tr-lg shadow-lg"></div>
      </a>
      <a
        href="https://www.youtube.com/"
        className="relative group mt-6 w-full text-center"
      >
        <div className="text-overlay text-[24px] md:text-[25px] xl:text-[40px] font-bold relative z-10">
          สร้างแพ็คเกจท่องเที่ยว
        </div>
        <div className="bg-custom-bg2 absolute inset-0 transition duration-300 ease-in-out transform group-hover:scale-105 rounded-br-lg rounded-tr-lg shadow-lg"></div>
      </a>
      <hr className="my-6 border-primaryNoRole w-full" />
      <a
        href="http://localhost:5173"
        className="relative group w-full text-center"
      >
        <div className="text-overlay text-[24px] md:text-[25px] xl:text-[40px] font-bold relative z-10">
          กลับไปยังหน้าหลัก
        </div>
        <div className="bg-custom-bg3 absolute inset-0 transition duration-300 ease-in-out transform group-hover:scale-105 rounded-br-lg rounded-tr-lg shadow-lg"></div>
      </a>
    </div>
  );
};

const NUM_DOTS = 20;

const SelectionCreate = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dots, setDots] = useState<number[][]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [closestDots, setClosestDots] = useState<number[][]>([]);
  const [directions, setDirections] = useState<number[][]>(
    Array(NUM_DOTS).fill([1, 1])
  );
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [lastMouseMoveTime, setLastMouseMoveTime] = useState(Date.now());

  useEffect(() => {
    const generateDots = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;

        const newDots = Array.from({ length: NUM_DOTS }, () => [
          Math.random() * offsetWidth,
          Math.random() * offsetHeight,
        ]);

        const newDirections = Array.from({ length: NUM_DOTS }, () => [
          Math.random() < 0.5 ? 1 : -1,
          Math.random() < 0.5 ? 1 : -1,
        ]);

        setDots(newDots);
        setDirections(newDirections);
      }
    };

    generateDots();
    const interval = setInterval(moveDots, 20);

    window.addEventListener("resize", generateDots);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", generateDots);
    };
  }, []);

  const moveDots = () => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDots((prevDots) =>
        prevDots.map((dot, index) => {
          const [x, y] = dot;
          let [dx, dy] = directions[index];

          if (Math.random() < 0.05) {
            const newDx = Math.random() < 0.5 ? 1 : -1;
            const newDy = Math.random() < 0.5 ? 1 : -1;

            dx += (newDx - dx) * 0.1;
            dy += (newDy - dy) * 0.1;

            directions[index] = [dx, dy];
          }

          let newX = x + dx * 2;
          let newY = y + dy * 2;

          if (newX < 0) {
            newX = offsetWidth;
          } else if (newX > offsetWidth) {
            newX = 0;
          }

          if (newY < 0) {
            newY = offsetHeight;
          } else if (newY > offsetHeight) {
            newY = 0;
          }

          return [newX, newY];
        })
      );
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      setMousePos({ x, y });
      setIsMouseMoving(true);
      setLastMouseMoveTime(Date.now());

      const distances = dots.map(([dotX, dotY]) =>
        Math.sqrt((dotX - x) ** 2 + (dotY - y) ** 2)
      );

      const sortedIndices = distances
        .map((distance, index) => [distance, index] as [number, number])
        .sort(([d1], [d2]) => d1 - d2)
        .slice(0, 5)
        .map(([, index]) => index);

      setClosestDots(sortedIndices.map((index) => dots[index]));
    }
  };

  const handleMouseLeave = () => {
    setIsMouseMoving(false);
  };

  useEffect(() => {
    const checkMouseStill = setInterval(() => {
      if (Date.now() - lastMouseMoveTime > 100) {
        setIsMouseMoving(false);
      }
    }, 100);

    return () => clearInterval(checkMouseStill);
  }, [lastMouseMoveTime]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between h-screen w-full overflow-hidden relative z-1">
      <div className="w-full md:w-1/2 h-1/2 md:h-full relative">
        <div className="absolute top-10 md:top-20 xl:top-20 flex items-center space-x-2 py-2 px-4 text-[20px] shadow-text md:text-[40px] xl:text-[50px]">
          <BsPersonWalking className="w-5 h-5 md:w-10 md:h-10 xl:w-12 xl:h-12" />
          <span className="md:inline">H2O</span>
        </div>
        <div className="absolute w-[70%] top-20 md:top-40 xl:top-40 flex items-center space-x-2 py-2 px-4 text-[6px] shadow-text md:text-[14px] xl:text-[18px]">
          <span className="md:inline">
            หากคุณมองหาโอกาสในการร่วมธุรกิจที่เติบโตไปด้วยกัน
            เราขอเชิญคุณมาร่วมเป็นส่วนหนึ่งกับเรา!
          </span>
        </div>
        <LeftSide />
      </div>
      <div
        className="w-full card-box md:w-1/2 md:max-w-[50%] md:max-h-[100%] h-1/2 md:h-full relative bg-white"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {dots.map(([x, y], index) => (
          <div
            key={index}
            className="dot"
            style={{ left: `${x}px`, top: `${y}px` }}
          />
        ))}

        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <h1 className="text-primaryNoRole text-[40px] md:text-[60px] xl:text-[80px] font-bold text-center shadow-text">
            HomeStays
          </h1>
          <h1 className="text-secondNoRole text-[40px] md:text-[60px] xl:text-[80px] font-bold text-center shadow-text">
            To
          </h1>
          <h1 className="text-primaryNoRole text-[40px] md:text-[60px] xl:text-[80px] font-bold text-center shadow-text">
            Online
          </h1>
        </div>

        <svg
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            pointerEvents: "none",
          }}
          width="100%"
          height="100%"
        >
          {isMouseMoving &&
            closestDots.map((closestDot, index) => (
              <line
                key={index}
                x1={mousePos.x}
                y1={mousePos.y}
                x2={closestDot[0]}
                y2={closestDot[1]}
                stroke="#7AA6E5"
                strokeWidth="1"
              />
            ))}
          {dots.map(([x1, y1], index1) => {
            const closestDots = dots
              .map(([x2, y2], index2) => {
                const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                return { distance, coordinates: [x2, y2], index2 };
              })
              .filter((dot) => dot.index2 !== index1)
              .sort((a, b) => a.distance - b.distance)
              .slice(0, 3);

            return closestDots.map((dot, idx) => (
              <line
                key={`${index1}-${idx}`}
                x1={x1}
                y1={y1}
                x2={dot.coordinates[0]}
                y2={dot.coordinates[1]}
                stroke="#7AA6E5"
                strokeWidth="1"
              />
            ));
          })}
        </svg>
      </div>
    </div>
  );
};

export default SelectionCreate;
