import React from 'react';
import styles from './Features.module.css';

import Card from './Card';

const Features = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Features</h2>
      <div className={styles.container}>
        <Card
          className={styles.card}
          title="Remote Monitoring and Control"
          description="Keep your crops under control, no matter where you are."
          imgUrl="/imgs/admin-panel.png"
          color="var(--orange)"
        />

        <Card
          className={styles.card}
          title="Real-time Notifications"
          description="Receive instant alerts about any important changes in your growing system."
          imgUrl="/imgs/notification.png"
          color="var(--blue)"
        />

        <Card
          className={styles.card}
          title="Smart Resource Optimization"
          description="Make the most of water, light, and energy."
          imgUrl="/imgs/idea.png"
          color="var(--green)"
        />

        <Card
          className={styles.card}
          title="Easily Scalable"
          description="Grow your system effortlessly to meet your expanding needs."
          imgUrl="/imgs/scalability.png"
          color="var(--red-cake)"
        />
      </div>
    </section>
  );
};

export default Features;
