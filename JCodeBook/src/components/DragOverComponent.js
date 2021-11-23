import React from "react"
import styled from "styled-components"
import { FileTray } from "react-ionicons"

const DragOverComponent = ({}) => {

	return (
		<DragContainer>
			<FileTray color={"#fff"} height="30px" width="30px"/>
			<div>
				Drop a File
			</div>
		</DragContainer>
	)
}

export default DragOverComponent

const DragContainer = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 999999;
	border: thick dashed rgba(255, 255, 255, 0.8);

	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;

	font-size: 24px;
`
