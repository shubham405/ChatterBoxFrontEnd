import React, { useState, useEffect } from "react";

const TypingAnimation = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500); // Update every 500ms

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div style={{ fontSize: "30px", fontWeight: "bold", color: "#888" }}>
      .{dots}
    </div>
  );
};

export default TypingAnimation;
