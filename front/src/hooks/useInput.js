import {useState, useCallback} from 'react';

export default (initialValue = null) => {
  const [value, setValue] = useState(initialValue);
  const handler = useCallback((e) => {
    const {value} = e.target;
    setValue(value);
  }, []);

  return [value, handler];
}