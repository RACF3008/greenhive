import React from 'react';

import styles from './Card.module.css';

const Card = ({ title, description, color, imgUrl }) => {
  return (
    <div className={styles.card} style={{ backgroundColor: color }}>
      {imgUrl && <img src={imgUrl} alt={title} className={styles.image} />}{' '}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default Card;
