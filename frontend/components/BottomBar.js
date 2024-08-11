import React from 'react';
import { AiFillHome, AiOutlineCompass } from 'react-icons/ai';
import { IoIosAdd } from 'react-icons/io';
import { BiMessageMinus } from 'react-icons/bi';
import { BsPerson } from 'react-icons/bs';
import styles from '../styles/BottomBar.module.css';

const BottomBar = ({ setNewVideoShow, getTiktoks }) => {
  return (
    <div className={styles.wrapper}>
      <AiFillHome className={styles.bottomIcon} aria-label="Home" />
      <AiOutlineCompass
        className={styles.bottomIcon}
        onClick={getTiktoks}
        aria-label="Discover"
      />
      <div className={styles.addVideoButton}>
        <IoIosAdd
          className={styles.bottomIcon}
          onClick={() => setNewVideoShow(true)}
          aria-label="Add Video"
        />
      </div>
      <BiMessageMinus className={styles.bottomIcon} aria-label="Messages" />
      <BsPerson className={styles.bottomIcon} aria-label="Profile" />
    </div>
  );
};

export default BottomBar;
