import React, { useState, useEffect, useRef } from 'react';
import styles from './Timer.module.css';

const Timer = ({
  buttonState = true,
  setButtonState,
  isOn = true,
  setIsOn,
  onMsg = 'ON',
  offMsg = 'OFF',
  changeTimer,
  onMinutes = 2,
  onSeconds,
  offMinutes,
  offSeconds,
}) => {
  const [timerState, setTimerState] = useState({
    displayOnMinutes: onMinutes,
    displayOnSeconds: onSeconds,
    displayOffMinutes: offMinutes,
    displayOffSeconds: offSeconds,
  });

  // Function to handle timer logic
  const handleTimer = () => {
    if (!buttonState) return; // Pausa activa
    setTimerState((prevState) => {
      const {
        displayOnMinutes,
        displayOnSeconds,
        displayOffMinutes,
        displayOffSeconds,
      } = prevState;

      if (isOn) {
        if (displayOnMinutes === 0 && displayOnSeconds === 0) {
          setIsOn(false);
          return {
            ...prevState,
            displayOffMinutes: offMinutes,
            displayOffSeconds: offSeconds,
          };
        }

        return {
          ...prevState,
          displayOnSeconds: displayOnSeconds === 0 ? 59 : displayOnSeconds - 1,
          displayOnMinutes:
            displayOnSeconds === 0 ? displayOnMinutes - 1 : displayOnMinutes,
        };
      } else {
        if (displayOffMinutes === 0 && displayOffSeconds === 0) {
          setIsOn(true);
          return {
            ...prevState,
            displayOnMinutes: onMinutes,
            displayOnSeconds: onSeconds,
          };
        }

        return {
          ...prevState,
          displayOffSeconds:
            displayOffSeconds === 0 ? 59 : displayOffSeconds - 1,
          displayOffMinutes:
            displayOffSeconds === 0 ? displayOffMinutes - 1 : displayOffMinutes,
        };
      }
    });
  };

  const adjustTimers = () => {
    setTimerState({
      displayOnMinutes: onMinutes,
      displayOnSeconds: onSeconds,
      displayOffMinutes: offMinutes,
      displayOffSeconds: offSeconds,
    });
  };

  useEffect(() => {
    adjustTimers(); // Llama a la función de ajuste cuando `changeTimer` cambie
  }, [changeTimer]);

  useEffect(() => {
    if (!buttonState) return; // Si está en pausa, no ejecutamos el temporizador
    const intervalId = setInterval(handleTimer, 1000); // Actualiza cada segundo
    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar
  }, [buttonState, isOn, timerState]);

  return (
    <div
      className={
        isOn
          ? `${styles.timerContainer} ${styles.on}`
          : `${styles.timerContainer}`
      }
    >
      <p className={styles.msg}>{isOn ? onMsg : offMsg}</p>
      <div className={styles.timer}>
        <span className={styles.counterPart}>
          {String(
            isOn ? timerState.displayOnMinutes : timerState.displayOffMinutes
          ).padStart(2, '0')}
        </span>
        <span className={styles.counterPart}>:</span>
        <span className={styles.counterPart}>
          {String(
            isOn ? timerState.displayOnSeconds : timerState.displayOffSeconds
          ).padStart(2, '0')}
        </span>
      </div>
      <div className={styles.controls}>
        <button
          className={styles.control}
          onClick={() => setButtonState(!buttonState)}
        >
          {!buttonState ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              className={styles.icon}
            >
              <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              className={styles.icon}
            >
              <path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Timer;
