import React from 'react';

import styles from './index.module.css';

import SideMenu from '../../components/layout/SideMenu/SideMenu';
import DeviceCard from '../../components/ui/DeviceCard/DeviceCard';

const Dashboard = ({ currentUser, devices }) => {
  const variables = ['10%', '20%'];
  return (
    <div className="dashboard">
      <div className={styles.bodyContainer}>
        <div className={styles.sideMenuPlaceholder}></div>
        <SideMenu />
        <div className={styles.body}>
          <h1 className={styles.mainTitle}>Dashboard</h1>
          <section className={styles.deviceSection}>
            {devices.map((device, index) => (
              <DeviceCard
                key={index}
                id={device.id}
                type={device.type}
                name={device.name}
                status={device.status}
                lastUpdated={device.lastUpdated}
                payload={device.payload}
                variables={variables}
              />
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

Dashboard.getInitialProps = async (context, client, currentUser) => {
  const { data: devices } = await client.get('/api/devices');

  return { devices };
};

export default Dashboard;
