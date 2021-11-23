import styled from "styled-components"
import { config } from "../config"

export const FlexBox = styled.div`
	display: flex;
	flex-direction: ${props => props.direction || props.dir || "row"};
	justify-content: ${props => props.justify || "flex-start"};
	align-items: ${props => props.align || "center"};
	flex-wrap: ${props => props.wrap || "nowrap"};
	${props => props.fluid ? { width: "100%", flex: 1 } : {}}
`

export const Button = styled.button`
	background-color: ${props => props.basic ? "transparent" : props.warn ? "red" : props.primary ? config.colors.primary : "transparent"};
	color: ${props => props.basic ? (props.warn ? "red" : props.primary ? config.colors.primary : "transparent") : "white"};
	border: none;
	padding: 6px 8px 6px 8px;
	cursor: pointer;
	font-weight: bold;
	border-radius: 30px;

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
`

export const ListContainer = styled.div`

	div:first-child {
		border-top: none;
	}

`

export const TypePill = styled.div`
	min-width: 100px;
	height: 24px;
	border-radius: 50px;
	color: ${props => config.languages.find(o => o.value === props.language).color};
	background-color: ${props => config.languages.find(o => o.value === props.language).background};
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
	text-transform: uppercase;
	font-size: 10px;
	opacity: 0.9;
	margin-right: 4px;
`

export const ListItem = styled.div`
	height: 40px;
	background-color: ${config.colors.background};
	display: flex;
	align-items: center;
	padding-left: 12px;
	cursor: pointer;
	justify-content: space-between;
	padding-right: 8px;
	text-transform: capitalize;
	border-top: thin solid ${config.colors.body};
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

`

export const NewEntryInput = styled.input`
	border-radius: 2px;
	height: 30px;
	background-color: white;
	border: thin solid rgba(255, 255, 255, 0.1);
	padding-left: 12px;
	padding-right: 12px;

	&:focus {
		outline: none;
	}
`

export const Footer = styled(FlexBox)`
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 60px;
	padding-left: 12px;
	padding-right: 12px;
	background-color: #131c41;
	z-index: 999999;
`

export const CodeTopBar = styled(FlexBox)`
	flex: 1;
	width: 100%;
	background-color: #0d0e0d;
	margin-top: 2px;

	.delete-seg {
		cursor: pointer;
		padding-right: 12px;
		font-size: 10px;
		color: #ae0303;
		font-weight: 500;
		margin-left: auto;
		&:hover {
			font-weight: bold;
		}
	}

	.minus {
		text-align: center;
		width: 40px;
		font-weight: bold;
		font-size: 20px;
		cursor: pointer;
	}

	input {
		background-color: transparent;
		border: none;
		height: 30px;
		color: white;
		padding-left: 6px;
		opacity: 0.6;
		letter-spacing: 1.4px;

		&:focus {
			outline: none;
		}
	}

	select {
		margin-left: auto;
		margin-right: 12px;
		background-color: transparent;
		border: none;
		color: white;
		opacity: 0.6;
		text-transform: uppercase;
		text-align: right;

		&:focus {
			outline: none;
		}
	}
`


export const TextButton = styled.button`
	color: ${config.colors.textPrimary};
	background-color: transparent;
	border: none;
	margin-left: 12px;
	cursor: pointer;
`

export const ResultItem = styled(FlexBox)`
	background-color: #273053;
	font-size: 10px;
	padding: 6px 12px 6px 12px;
	div:first-child {
		font-weight: bold;
	}

	div:last-child {
		margin-left: 12px;
	}
`;
