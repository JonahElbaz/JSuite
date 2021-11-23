import React from 'react'
import styled from "styled-components";
import {config} from "../config";

const Title = ({props}) => {

  return (
    <TitleComponent {...props}>
      J Code Block
    </TitleComponent>
  );
};

export default Title;

const TitleComponent = styled.div`
  color: ${config.colors.primary};
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
`
