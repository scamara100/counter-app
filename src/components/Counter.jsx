import { useRef } from "react"
import { useEffect, useState } from "react"

export function Counter(){
    // STATE
    const [count, setCount] =  useState(() => {
    const saved = localStorage.getItem("count")
    return saved ? Number(saved): 0
   })
   const [step, setStep] = useState(1)
   const [isRunning, setIsRunning] = useState(false)
   const [max, setMax] = useState(50)
   // Store interval ID
  const intervalRef = useRef(null);

  // Store previous count
  const prevCountRef = useRef(null);

  // EFFECT 2: Track previous value
  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);
    // LocalStorage useEffet
   useEffect(() => {
    localStorage.setItem("count", count.toString())
   }, [count])
   useEffect(() => {
    const intervalId = setInterval(() => {
        console.log(`Problem interval count is ${count}`)
    }, 500)
    return clearInterval(intervalId)
   }, [count])
   // Auto increment logic
   useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev + step >= max) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          return max;
        }
        return prev + step;
      });
    }, 1000);

    // CLEANUP
    return () => clearInterval(intervalRef.current);
  }, [isRunning, step, max]);

  const increment = () => {
    setCount((prev) => Math.min(prev + step, max));
  };

  const decrement = () => {
    setCount((prev) => Math.max(prev - step, 0));
  };

  const reset = () => {
    setCount(0);
    setIsRunning(false);
  };

  const toggleAuto = () => {
    setIsRunning((prev) => !prev);
  };
  // Detect direction
  const direction =
    prevCountRef.current === null
      ? null
      : count > prevCountRef.current
      ? "up"
      : count < prevCountRef.current
      ? "down"
      : null;

    return(
       <div style={{ padding: 20, textAlign: "center" }}>
      <h1>Advanced Counter</h1>

      <h2>{count}</h2>

      {direction === "up" && <p>⬆ Increasing</p>}
      {direction === "down" && <p>⬇ Decreasing</p>}

      <div style={{ margin: 10 }}>
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
        <button onClick={reset}>Reset</button>
      </div>

      <div style={{ margin: 10 }}>
        <button onClick={toggleAuto}>
          {isRunning ? "Stop Auto" : "Start Auto"}
        </button>
      </div>

      <div style={{ margin: 10 }}>
        <label>
          Step:
          <input
            type="number"
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
          />
        </label>
      </div>

      <div style={{ margin: 10 }}>
        <label>
          Max:
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
          />
        </label>
      </div>

      <p>Status: {isRunning ? "🟢 Running" : "🔴 Stopped"}</p>
    </div>
  );
}