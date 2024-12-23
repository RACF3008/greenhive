import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import styles from './DeviceCard.module.css';

const DeviceCard = ({ id, type, name, status, lastUpdated, payload }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [variables, setVariables] = useState([]);

  useEffect(() => {
    // This will run only on the client side
    const time = new Date(lastUpdated).toLocaleTimeString('en-GB');
    const date = new Date(lastUpdated).toLocaleDateString('en-GB');

    setDate(date);
    setTime(time);

    if (!payload) {
      setVariables(['--', '--']);
    } else {
      if (type === 'tower') {
        setVariables([
          String(payload.ambientLight) + ' lux',
          String(payload.tankLevel) + '%',
        ]);
      } else if (type === 'station') {
        setVariables([
          String(payload.temperature) + '°C',
          String(payload.humidity) + '%',
        ]);
      }
    }
  }, []);

  return (
    <Link
      href={`/dashboard/device/[deviceId]`}
      as={`/dashboard/device/${id}`}
      legacyBehavior
    >
      <a className={styles.card}>
        <div className={styles.imageContainer}>
          <img src={`/imgs/${type}.png`} alt={type} className={styles.image} />
        </div>
        <div className={styles.infoContainer}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.info}>
            <span className={styles.infoTag}>Type:</span> {type}
          </p>
          <p
            className={styles.info}
            style={{
              color: status === 'online' ? 'var(--light-green)' : 'red',
            }}
          >
            <span className={styles.infoTag}>Connection:</span> {status}
          </p>
          <br></br>
          <p className={styles.info}>
            <span className={styles.infoTag}>Last Update:</span>
          </p>
          <p className={styles.info}>
            <span className={styles.infoTag}>Date:</span> {date}
          </p>
          <p className={styles.info}>
            <span className={styles.infoTag}>Time:</span> {time}
          </p>

          {type === 'tower' ? (
            <div className={styles.variables}>
              <div className={styles.variable}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  className={styles.icon}
                  style={{ fill: 'var(--yellow)' }}
                >
                  <path d="M272 384c9.6-31.9 29.5-59.1 49.2-86.2c0 0 0 0 0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4c0 0 0 0 0 0c19.8 27.1 39.7 54.4 49.2 86.2l160 0zM192 512c44.2 0 80-35.8 80-80l0-16-160 0 0 16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z" />
                </svg>
                <p className={styles.variableInfo}>
                  {variables[0] ? variables[0].toString() : 'N/A'}
                </p>
              </div>
              <div className={styles.variable}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  className={styles.icon}
                  style={{ fill: 'var(--blue)' }}
                >
                  <path d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0l1.8 0c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z" />
                </svg>
                <p className={styles.variableInfo}>
                  {variables[1] ? variables[1].toString() : 'N/A'}
                </p>
              </div>
            </div>
          ) : (
            <div className={styles.variables}>
              <div className={styles.variable}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  className={styles.icon}
                  style={{ fill: 'var(--red)' }}
                >
                  <path d="M160 64c-26.5 0-48 21.5-48 48l0 164.5c0 17.3-7.1 31.9-15.3 42.5C86.2 332.6 80 349.5 80 368c0 44.2 35.8 80 80 80s80-35.8 80-80c0-18.5-6.2-35.4-16.7-48.9c-8.2-10.6-15.3-25.2-15.3-42.5L208 112c0-26.5-21.5-48-48-48zM48 112C48 50.2 98.1 0 160 0s112 50.1 112 112l0 164.4c0 .1 .1 .3 .2 .6c.2 .6 .8 1.6 1.7 2.8c18.9 24.4 30.1 55 30.1 88.1c0 79.5-64.5 144-144 144S16 447.5 16 368c0-33.2 11.2-63.8 30.1-88.1c.9-1.2 1.5-2.2 1.7-2.8c.1-.3 .2-.5 .2-.6L48 112zM208 368c0 26.5-21.5 48-48 48s-48-21.5-48-48c0-20.9 13.4-38.7 32-45.3L144 208c0-8.8 7.2-16 16-16s16 7.2 16 16l0 114.7c18.6 6.6 32 24.4 32 45.3z" />
                </svg>
                <p className={styles.variableInfo}>
                  {variables[0] ? variables[0].toString() : 'N/A'}
                </p>
              </div>
              <div className={styles.variable}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  className={styles.icon}
                  style={{ fill: 'var(--light-blue)' }}
                >
                  <path d="M288 32c0 17.7 14.3 32 32 32l32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128c-17.7 0-32 14.3-32 32s14.3 32 32 32l320 0c53 0 96-43 96-96s-43-96-96-96L320 0c-17.7 0-32 14.3-32 32zm64 352c0 17.7 14.3 32 32 32l32 0c53 0 96-43 96-96s-43-96-96-96L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0c-17.7 0-32 14.3-32 32zM128 512l32 0c53 0 96-43 96-96s-43-96-96-96L32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32z" />
                </svg>
                <p className={styles.variableInfo}>
                  {variables[1] ? variables[1].toString() : 'N/A'}
                </p>
              </div>
            </div>
          )}
        </div>
      </a>
    </Link>
  );
};

export default DeviceCard;
