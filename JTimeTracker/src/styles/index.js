import styled from "styled-components"
import {config} from "../config";

export const FlexBox = styled.div`
	display: flex;
	flex-direction: ${props => props.direction || props.dir || "row"};
	justify-content: ${props => props.justify || "flex-start"};
	align-items: ${props => props.align || "center"};
	flex-wrap: ${props => props.wrap || "nowrap"};
  ${props => props.fluid ? {width: '100%', flex: 1} : {}}
`

export const Button = styled.button`
  background-color: ${props => props.warn ? 'red' : config.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 8px 6px 8px;
  cursor: pointer;
`

export const EntryInput = styled.input`
  width: 60px;
  text-align: center;
  border: thin solid #282c34;
  background-color: transparent;
  border-radius: 4px;
  color: white;
  margin-right: 1px;

  &:focus {
    outline: none;
    border: thin solid ${config.colors.primary};
  }
`;

export const ListContainer = styled.div`

  div {
    border-top: thin solid ${config.colors.body};
  }

  div:first-child {
    border-top: none;
  }

`

export const ListItem = styled.div`
  height: 40px;
  background-color: ${config.colors.background};
  display: flex;
  align-items: center;
  padding-left: 12px;
  cursor: pointer;
  justify-content: space-between;
  padding-right: 12px;
`
export const EntryContainer = styled(FlexBox)`
  height: 40px;

  .title {
    font-size: 14px;
    font-weight: 500;

    svg {
      position: relative;
      top: 2px;
      margin-right: 4px;
    }
  }

`;

export const NewEntryInput = styled.input`
  border-radius: 4px;
  margin-left: 12px;
  height: 24px;
  border: none;
`;


export const TextButton = styled.button`
  color: ${config.colors.textPrimary};
  background-color: transparent;
  border: none;
  margin-left: 12px;
  cursor: pointer;
`;
