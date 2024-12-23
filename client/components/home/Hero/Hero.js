import React from 'react';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroTextContainer}>
        <h1>Grow Smart and Efficiently</h1>
        <p>
          Our automated vertical farming system helps you care for your crops
          more easily and efficiently. Monitor plant conditions such as light,
          humidity, and irrigation, and automatically adjust everything to
          ensure optimal growth. Plus, you can control and oversee your garden
          from anywhere, saving time, water, and energy.
        </p>
        <p>
          <strong>
            The future of sustainable farming, right at your fingertips.
          </strong>
        </p>
      </div>
    </section>
  );
};

export default Hero;
