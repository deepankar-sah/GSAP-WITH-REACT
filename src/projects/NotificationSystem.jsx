import { useEffect, useRef } from "react";
import gsap from "gsap";

const NotificationSystem = () => {
  const notificaionRef = useRef([]);

  useEffect(() => {
    gsap.from(notificaionRef.current, {
      x: 100,
      opacity: 0,
      duration: 0.3,
      delay: 0.5,
    });
    gsap.to(notificaionRef.current, {
      x: 100,
      opacity: 0,
      duration: 0.3,
      delay: 3,
    });
  });
  return (
    <main
      style={{
        padding: 10,
        display: "flex",
        justifyContent: "end",
        overflowX: "hidden",
      }}
    >
      <div
        ref={notificaionRef}
        style={{
          width: 300,
          height: 80,
          margin: 0,
          padding: 12,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "start",
          borderColor: "red",
          borderRadius: 18,
          border: 1,
          backgroundColor: "white",
          color: "black",
          gap: 0,
        }}
      >
        <h3 style={{ fontSize: 20 }}>New Notificaion</h3>
        <p style={{ fontSize: 15 }}>Hello Deepu</p>
      </div>
    </main>
  );
};
export default NotificationSystem;
