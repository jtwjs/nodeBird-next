import {useState, useCallback} from 'react';

export default function useInput(initialValue = null){
  const [value, setValue] = useState(initialValue);
  const handler = useCallback((e) => {
    const {value} = e.target;
    setValue(value);
  }, []);

  return [value, handler];
}