import * as React from 'react';
import styled from 'styled-components';

interface Props {
  onInput: (value: string) => void;
  value: string;
}

export default (props: Props) => {
  return (
    <TextArea
      value={props.value}
      onChange={e => props.onInput(e.currentTarget.value)}
    ></TextArea>
  );
};

const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  resize: none;
  font-size: 1rem;
  padding: 1rem;
`;
