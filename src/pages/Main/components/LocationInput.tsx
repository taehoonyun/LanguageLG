import React from 'react';
import { Button } from 'react-bootstrap';
import { LocationInput as LocationInputType } from '../types';
import { styles } from '../styles';

interface LocationInputProps extends LocationInputType {
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onQuit: () => void;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  label,
  value,
  onInputChange,
  onSubmit,
  onQuit,
}) => {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={label} className={styles.label}>
        {label}
      </label>
      <input
        id={label}
        type="text"
        onChange={(e) => onInputChange(e.target.value)}
        value={value}
        className={styles.input}
      />
      <Button
        variant="primary"
        className={styles.button}
        onClick={onSubmit}
      >
        Send
      </Button>
      <Button
        variant="light"
        className={styles.button}
        onClick={onQuit}
      >
        quit
      </Button>
    </div>
  );
}; 