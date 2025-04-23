import React, { useState } from 'react';

export const HomePage = () => {
  const [count, setCount] = useState(0);
  return (
    <div
      onClick={() => {
        setCount(prevState => prevState + 1);
      }}
    >
      {count}
    </div>
  );
};
