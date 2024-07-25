import React, { useState, useEffect } from "react";

interface ChangingProgressProviderProps {
  values: number[];
  interval?: number;
  children: (value: number) => React.ReactNode;
}

const ChangingProgressProvider: React.FC<ChangingProgressProviderProps> = ({
  values,
  interval = 1000,
  children,
}) => {
  const [valuesIndex, setValuesIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setValuesIndex((prevIndex) => (prevIndex + 1) % values.length);
    }, interval);

    return () => clearInterval(id);
  }, [values, interval]);

  return <>{children(values[valuesIndex])}</>;
};

export default ChangingProgressProvider;
