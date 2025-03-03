import { createEffect, onCleanup, type Component } from "solid-js";

import { createStore } from "solid-js/store";

const [state, setState] = createStore({
  clipSlice: [
    {
      start: 1.0,
      end: 2.0,
      audio: new Audio("./src/assets/1sec.mp3"),
    },
    {
      start: 4.0,
      end: 6.0,
      audio: new Audio("./src/assets/2sec.mp3"),
    },
  ],
  globalPlayHeadPosition: 0.0,
  isPlaying: false,
  trackDuration: 10.0,
});

function PlayerControls() {
  const togglePlay = (e: MouseEvent | undefined = undefined) => {
    setState("isPlaying", (prev) => !prev);
    if (e) {
      (e.target as HTMLButtonElement)?.blur();
    }
  };
  createEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        togglePlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      window.removeEventListener("keydown", handleKeyDown);
    });
  });
  return (
    <div>
      <button onClick={togglePlay} tabIndex={-1}>
        {state.isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}

function Clip(props: { start: number; end: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: props.start * 100 + "px",
        width: (props.end - props.start) * 100 + "px",
        height: "inherit",
        "background-color": "red",
        opacity: "0.5",
        border: "1px solid, black",
      }}
    ></div>
  );
}

function Track() {
  let interval: number | null = null; // Store interval outside the effect

  createEffect(() => {
    if (state.isPlaying) {
      interval = setInterval(() => {
        setState("globalPlayHeadPosition", state.globalPlayHeadPosition + 0.01);
      }, 10);
    } else {
      if (interval) clearInterval(interval); // Properly clear the interval when pausing
    }

    onCleanup(() => {
      if (interval) clearInterval(interval); // Cleanup on component unmount
    });
  });

  createEffect(() => {
    state.clipSlice.forEach((clip) => {
      if (
        state.globalPlayHeadPosition >= clip.start &&
        state.globalPlayHeadPosition <= clip.end &&
        state.isPlaying
      ) {
        if (
          Math.abs(
            state.globalPlayHeadPosition - clip.start - clip.audio.currentTime
          ) > 0.3
        ) {
          clip.audio.currentTime = state.globalPlayHeadPosition - clip.start;
        }
        if (clip.audio.paused) {
          console.log("Playing clip", clip.audio);
          clip.audio.play();
        }
      } else {
        clip.audio.pause();
      }
    });
    if (state.globalPlayHeadPosition >= state.trackDuration) {
      setState("globalPlayHeadPosition", 0);
      setState("isPlaying", false);
    }
  });
  return (
    <div
      style={{
        position: "relative",
        width: state.trackDuration * 100 + "px",
        height: "100px",
        border: "1px solid black",
        left: "50px",
        // overflow: "scroll",
      }}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        setState("globalPlayHeadPosition", state.trackDuration * percentage);
      }}
    >
      <div
        style={{
          position: "absolute",
          left: state.globalPlayHeadPosition * 100 + "px",
          width: "2px",
          height: "inherit",
          "background-color": "green",
        }}
      ></div>
      {state.clipSlice.map((clip) => (
        <Clip start={clip.start} end={clip.end}></Clip>
      ))}
    </div>
  );
}

const App: Component = () => {
  // state.clipSlice.forEach((clip) => {
  //   clip.audio.load();
  // });
  return (
    <div>
      <PlayerControls />
      <Track></Track>
    </div>
  );
};

export default App;
