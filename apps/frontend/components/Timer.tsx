import { useEffect, useRef, useState } from "react";

import { startCounter } from "@/lib/utils";

function Timer({ startCounting }: { startCounting: boolean }) {
  const [timer, setTimer] = useState("00:00");

  const counterID = useRef<NodeJS.Timeout | number | undefined>(undefined);
  useEffect(() => {
    if (startCounting) {
      counterID.current = startCounter(setTimer);
      return;
    }
    setTimer("00:00");

    if (counterID.current) {
      clearInterval(counterID.current);
    }

    return () => {
      if (counterID.current) {
        clearInterval(counterID.current);
      }
    };
  }, [startCounting]);
  return <div>{timer}</div>;
}

export default Timer;
