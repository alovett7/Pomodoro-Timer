import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import { minutesToDuration, secondsToDuration } from "../utils/duration";

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [session, setSession] = useState({
    label: "Focusing",
    duration: minutesToDuration(focusDuration),
    timeTotal: focusDuration * 60,
    timeRemaining: focusDuration * 60,
    percentComplete: 0,
  });
  const [isSessionActive, setIsSessionActive] = useState(false);

  function nextTick(prevState) {
    const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
    const elapsedSeconds = prevState.timeTotal - timeRemaining;
    return {
      ...prevState,
      timeRemaining,
      percentComplete: (elapsedSeconds / prevState.timeTotal) * 100,
    };
  }
  function nextSession(focusDuration, breakDuration) {
    return (currentSession) => {
      if (currentSession.label === "Focusing") {
        return {
          label: "On Break",
          duration: minutesToDuration(breakDuration),
          timeTotal: breakDuration * 60,
          timeRemaining: breakDuration * 60,
          percentComplete: 0,
        };
      }
      return {
        label: "Focusing",
        duration: minutesToDuration(focusDuration),
        timeTotal: focusDuration * 60,
        timeRemaining: focusDuration * 60,
        percentComplete: 0,
      };
    };
  }

  useInterval(
    () => {
      // ToDo: Implement what should happen when the timer is running
      if (session.timeRemaining === 0) {
        new Audio(
          `${process.env.PUBLIC_URL}/alarm/submarine-dive-horn.mp3`
        ).play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );
  function playPause() {
    if (isSessionActive === false) {
      setIsSessionActive(true);
      setSession({
        label: "Focusing",
        duration: minutesToDuration(focusDuration),
        timeTotal: focusDuration * 60,
        timeRemaining: focusDuration * 60,
        percentComplete: 0,
      });
    }
    setIsTimerRunning((prevState) => !prevState);
  }
  function decreaseFocus() {
    setFocusDuration((lastFocus) => lastFocus - 5);
  }
  function increaseFocus() {
    setFocusDuration((lastFocus) => lastFocus + 5);
  }
  function decreaseBreak() {
    setBreakDuration((lastFocus) => lastFocus - 1);
  }
  function increaseBreak() {
    setBreakDuration((lastFocus) => lastFocus + 1);
  }
  function stopSession() {
    setIsTimerRunning(false);
  }

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              {/* TODO: Update this text to display the current focus session duration */}
              label={`Focus Duration: ${minutesToDuration(focusDuration)}`}
            </span>
            <div className="input-group-append">
              {/* TODO: Implement decreasing focus duration and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
                onClick={decreaseFocus}
                disabled={focusDuration <= 5 || isTimerRunning ? true : false}
              >
                <span className="oi oi-minus" />
              </button>
              {/* TODO: Implement increasing focus duration  and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="increase-focus"
                onClick={increaseFocus}
                disabled={focusDuration >= 60 || isTimerRunning ? true : false}
              >
                <span className="oi oi-plus" />
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                {/* TODO: Update this text to display the current break session duration */}
                label={`Break Duration: ${minutesToDuration(breakDuration)}`}
              </span>
              <div className="input-group-append">
                {/* TODO: Implement decreasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                  onClick={decreaseBreak}
                  disabled={breakDuration <= 1 || isTimerRunning ? true : false}
                >
                  <span className="oi oi-minus" />
                </button>
                {/* TODO: Implement increasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  onClick={increaseBreak}
                  disabled={
                    breakDuration >= 15 || isTimerRunning ? true : false
                  }
                >
                  <span className="oi oi-plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={playPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </button>
            {/* TODO: Implement stopping the current focus or break session and disable when there is no active session */}
            <button
              type="button"
              className="btn btn-secondary"
              title="Stop the session"
              onClick={stopSession}
              disabled={!isSessionActive}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>
      <div>
        {/* TODO: This area should show only when a focus or break session is running or pauses */}
        <div className="row mb-2">
          <div className="col">
            {/* TODO: Update message below to include current session (Focusing or On Break) and total duration */}
            <h2 data-testid="session-title">{` ${session.label} for ${session.duration} minutes`}</h2>
            {/* TODO: Update message below to include time remaining in the current session */}
            <p className="lead" data-testid="session-sub-title">
              {`${secondsToDuration(session.timeRemaining)} remaining`}
            </p>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <div className="progress" style={{ height: "20px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={session.percentComplete} // TODO: Increase aria-valuenow as elapsed time increases
                style={{ width: `${session.percentComplete}` }} // TODO: Increase width % as elapsed time increases
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pomodoro;
