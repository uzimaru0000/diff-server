import * as React from 'react';
import { createPatch } from 'diff';
import SocketIOClient from 'socket.io-client';

export const useThrottle = <T>(value: T, limit: number = 500) => {
  const [throttledValue, setThrottledValue] = React.useState(value);
  const lastRan = React.useRef(Date.now());

  React.useEffect(() => {
    const handler = setTimeout(function() {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
};

export const useDiff = (value: string) => {
  const [currentText, setCurrentText] = React.useState(value);
  const [diff, setDiff] = React.useState('');

  React.useEffect(() => {
    setDiff(createPatch('code', currentText, value));
    setCurrentText(value);
    console.log(value);
  }, [value]);

  return diff;
};

export const useSocket = (url: string, event: string) => {
  const ioRef = React.useRef<SocketIOClient.Socket>(null);
  const [msg, setMsg] = React.useState(null);
  const [args, setArgs] = React.useState();

  React.useEffect(() => {
    if (ioRef.current !== null) {
      ioRef.current.disconnect();
    }
    ioRef.current = SocketIOClient(url);
    console.log(ioRef);
  }, [url]);

  React.useEffect(() => {
    if (ioRef.current === null) {
      return;
    }

    ioRef.current.emit(event, args);
  }, [args]);

  React.useEffect(() => {
    if (ioRef.current === null) {
      return;
    }
    ioRef.current.on(event, data => {
      setMsg(data);
    });
    return () => ioRef.current.disconnect();
  }, [ioRef]);

  return [msg, setArgs];
};
