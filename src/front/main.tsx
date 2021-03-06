import * as React from 'react';
import { render } from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';

import { useThrottle, useDiff, useSocket } from './hooks';
import Editor from './Editor';

const Global = createGlobalStyle`
    body {
        padding: 0;
        margin: 0;
        font-size: 16px;
    }

    * {
        box-sizing: border-box;
    }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const EditorWrapper = styled.div`
  width: 50vw;
  height: 100vh;
`;

const PreviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Preview = styled.pre`
  width: 50vw;
  height: 50vw;
  padding: 1rem;
  word-wrap: break-word;
`;

const useDiffServer = () => {
  const [msg, setArgs] = useSocket('http://localhost:3000', 'diff');
  const [token, setToken] = React.useState<string>('');

  React.useEffect(() => {
    if (msg !== null && msg.token) {
      setToken(msg.token);
    }
  }, [msg]);

  return (value: string) => {
    if (token === '') return;
    setArgs({
      token,
      diff: value,
    });
  };
};

const App = () => {
  const [text, setText] = React.useState('');
  const value = useThrottle(text, 1000);
  const diff = useDiff(value);
  const sendDiff = useDiffServer();

  React.useEffect(() => {
    sendDiff(diff);
  }, [diff]);

  return (
    <Wrapper>
      <EditorWrapper>
        <Editor value={text} onInput={setText} />
      </EditorWrapper>
      <PreviewWrapper>
        <Preview>{text}</Preview>
        <Preview>{diff}</Preview>
      </PreviewWrapper>
      <Global />
    </Wrapper>
  );
};

render(<App />, document.getElementById('main'));
