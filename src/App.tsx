import { createEffect, onCleanup, type Component } from "solid-js";

import { createStore } from "solid-js/store";

const [state, setState] = createStore({
  clipSlice: [
    {
      start: 1.0,
      end: 2.0,
      audio: new Audio("/src/assets/1sec.mp3"),
    },
    {
      start: 4.0,
      end: 6.0,
      audio: new Audio("/src/assets/2sec.mp3"),
    },
  ],
  globalPlayHeadPosition: 3.0,
  isPlaying: false,
  trackDuration: 10.0,
});

// Example functions to update state
const play = () => setState("isPlaying", true);
const pause = () => setState("isPlaying", false);

function PlayerControls() {
  return (
    <div>
      <p>Playhead Position: {state.globalPlayHeadPosition}</p>
      <p>Status: {state.isPlaying ? "Playing" : "Paused"}</p>
      <button onClick={play}>Play</button>
      <button onClick={pause}>Pause</button>
    </div>
  );
}

function Clip(props: { start: number; end: number; audioUrl: string }) {
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
    >
      {props.audioUrl}
    </div>
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
  });
  return (
    <div
      style={{
        position: "relative",
        width: state.trackDuration * 100 + "px",
        height: "100px",
        border: "1px solid black",
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
        <Clip start={clip.start} end={clip.end} audioUrl={clip.audioUrl}></Clip>
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
