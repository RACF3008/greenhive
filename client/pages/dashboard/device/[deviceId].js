import React, { useState, useEffect } from 'react';
import axios from 'axios';

import styles from './device.module.css';
import SideMenu from '../../../components/layout/SideMenu/SideMenu';
import DeviceCard from '../../../components/ui/DeviceCard/DeviceCard';
import Toggle from '../../../components/ui/Toggle/Toggle';
import RangeSlider from '../../../components/ui/RangeSlider/RangeSlider';
import PaginatedTable from '../../../components/ui/PaginatedTable/PaginatedTable';
import Timer from '../../../components/ui/Timer/Timer';
import Stepper from '../../../components/ui/Stepper/Stepper';

const DevicePage = ({ device, readings }) => {
  const onMinutesInitial = 2;
  const onSecondsInitial = 0;
  const offMinutesInitial = 4;
  const offSecondsInitial = 0;
  const playPauseTimerInitial = true;

  const [waterPumpState, setWaterPumpState] = useState(
    device.payload.waterPump || false
  );
  const [ledLightsState, setLedLightsState] = useState(
    device.payload.ledLights || false
  );
  const [autoModeState, setAutoModeState] = useState(
    device.payload.autoMode || false
  );
  const [playPauseTimerState, setPlayPauseTimerState] = useState(
    playPauseTimerInitial
  );
  const [isPumpOn, setIsPumpOn] = useState(false);
  const [onMinutes, setOnMinutes] = useState(onMinutesInitial);
  const [onSeconds, setOnSeconds] = useState(onSecondsInitial);
  const [offMinutes, setOffMinutes] = useState(offMinutesInitial);
  const [offSeconds, setOffSeconds] = useState(offSecondsInitial);
  const [transformedReadings, setTransformedReadings] = useState([]);
  const [changeTimer, setChangeTimer] = useState(true);

  const handleSliderChange = (value) => {
    const command = `LED-${value}`;
    axios
      .post(`/api/commands/send-command/${device.id}`, { payload: command })
      .then((response) => {
        console.log('Command sent successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error sending command:', error);
      });
  };

  // Function to format date and time
  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);

    const dateOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };

    const localDate = new Intl.DateTimeFormat('en-US', dateOptions).format(
      date
    );
    const localTime = new Intl.DateTimeFormat('en-US', timeOptions).format(
      date
    );

    return {
      Date: localDate,
      Time: localTime,
    };
  };

  const toggleActuator = async (toOn, toOff, state, setState) => {
    const command = state ? toOff : toOn;
    try {
      const response = await axios.post(
        `/api/commands/send-command/${device.id}`,
        {
          payload: command,
        }
      );

      try {
        // Extract the content between curly brackets
        const match = response.data.match(/{.*}/);

        if (match) {
          const jsonString = match[0]; // Get the matched JSON string
          const jsonData = JSON.parse(jsonString); // Convert to JSON object
          // Update the specific actuator's state based on response
          if (jsonData.message === 'success') {
            setState(!state);
          } else {
            console.error(
              `Failed to send command ${command}:`,
              response.data.message
            );
          }
        } else {
          console.log('No JSON found in the string.');
        }
      } catch (error) {
        console.error('Failed to parse JSON:', error);
      }
    } catch (error) {
      console.error(`Error sending command ${command}:`, error);
    }
  };

  const updateTimers = () => {
    setChangeTimer(!changeTimer);
  };

  useEffect(() => {
    const formattedReadings = readings.map(({ timeStamp, payload }) => {
      const formattedData = formatDate(timeStamp);
      return {
        ...formattedData,
        'Ambient Light': payload.ambientLight,
        'Tank Level': payload.tankLevel,
      };
    });
    setTransformedReadings(formattedReadings);
  }, [readings]);

  return (
    <div className="dashboard">
      <div className={styles.bodyContainer}>
        <div className={styles.sideMenuPlaceholder}></div>
        <SideMenu />
        <div className={styles.body}>
          <DeviceCard
            id={device.id}
            type={device.type}
            name={device.name}
            status={device.status}
            lastUpdated={device.lastUpdated}
            payload={device.payload}
          />
          <div className={styles.section} style={{ height: '25rem' }}>
            <h1 className={styles.sectionTitle}>Actuators</h1>
            <div className={styles.actuatorControls}>
              <div className={styles.actuatorControl}>
                <h2 className={styles.actuatorTitle}>Water Pump</h2>
                <Toggle
                  isOn={waterPumpState}
                  toggleHandler={() =>
                    toggleActuator(
                      'PUMP-ON',
                      'PUMP-OFF',
                      waterPumpState,
                      setWaterPumpState
                    )
                  }
                  disabled={autoModeState}
                />
              </div>
              <div className={styles.actuatorControl}>
                <h2 className={styles.actuatorTitle}>LED Lights</h2>
                <Toggle
                  isOn={ledLightsState}
                  toggleHandler={() =>
                    toggleActuator(
                      'LEDS-ON',
                      'LEDS-OFF',
                      ledLightsState,
                      setLedLightsState
                    )
                  }
                  disabled={autoModeState}
                />
              </div>
              <div
                className={`${styles.actuatorControl} ${styles.spanColumn2}`}
              >
                <h2 className={styles.actuatorTitle}>LED Intensity</h2>
                <RangeSlider
                  className={styles.rangeSlider}
                  min={0}
                  max={100}
                  onValueChange={handleSliderChange}
                  disabled={autoModeState}
                />
              </div>
            </div>
          </div>
          <div className={`${styles.section} ${styles.spanRow2}`}>
            <h1 className={styles.sectionTitle}>Timers</h1>
            <div className={styles.autoModeContainer}>
              <span>Timer Mode</span>
              <Toggle
                isOn={autoModeState}
                toggleHandler={() =>
                  toggleActuator(
                    'AUTO-ON',
                    'AUTO-OFF',
                    autoModeState,
                    setAutoModeState
                  )
                }
              />
            </div>
            <div className={styles.timerSetcion}>
              <Timer
                buttonState={playPauseTimerState}
                setButtonState={setPlayPauseTimerState}
                isOn={isPumpOn}
                setIsOn={setIsPumpOn}
                onMsg="WATER PUMP ON"
                offMsg="WATER PUMP OFF"
                changeTimer={changeTimer}
                onMinutes={onMinutes}
                onSeconds={onSeconds}
                offMinutes={offMinutes}
                offSeconds={offSeconds}
              />
              <h1 className={styles.sectionTitle}>Timer Configurations</h1>
              <div className={styles.stepper}>
                <span className={styles.tag}>Set On Timer</span>
                <Stepper
                  minutes={onMinutes}
                  setMinutes={setOnMinutes}
                  seconds={onSeconds}
                  setSeconds={setOnSeconds}
                  step={30}
                />
              </div>
              <div className={styles.stepper}>
                <span className={styles.tag}>Set Off Timer</span>
                <Stepper
                  minutes={offMinutes}
                  setMinutes={setOffMinutes}
                  seconds={offSeconds}
                  setSeconds={setOffSeconds}
                  step={30}
                />
              </div>
              <button className={styles.updateTimersBtn} onClick={updateTimers}>
                Update Timers
              </button>
            </div>
          </div>
          <div className={`${styles.section} ${styles.spanColumn2}`}>
            <h1 className={styles.sectionTitle}>Readings</h1>
            <PaginatedTable data={transformedReadings} itemsPerPage={6} />
          </div>
        </div>
      </div>
    </div>
  );
};

DevicePage.getInitialProps = async (context, client) => {
  const { deviceId } = context.query;

  const { data: deviceData } = await client.get(`/api/devices/${deviceId}`);

  const { data: readingsData } = await client.get(`/api/readings/${deviceId}`);

  // const { data: timersData } = await client.get(`/api/timers/${deviceId}`);

  return { device: deviceData, readings: readingsData };
};

export default DevicePage;
