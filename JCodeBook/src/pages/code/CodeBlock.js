import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Button, CodeTopBar, FlexBox, Footer, NewEntryInput } from "../../styles"
import Title from "../../components/Title"
import CodeBlockEditor from "../../components/CodeBlockEditor"
import "react-dropdown/style.css"
import { config } from "../../config"
import { MAIN_QUERY, useRunDeleteCodeBlock, useRunUpdateCodeBlock } from "../../store/hooks/user.hook"
import { useQueryClient } from "react-query"
import CenterLoader from "../../components/CenterLoader"
import moment from "moment"
import { ChevronDown, ChevronForward } from "react-ionicons"

const CodeBlock = (props) => {
	const [loading, setLoading] = useState(false)
	const history = useHistory()
	const queryClient = useQueryClient()
	const runUpdateCode = useRunUpdateCodeBlock()
	const runDeleteBlock = useRunDeleteCodeBlock()
	const [minimized, setMinimized] = useState([])

	const [block, setBlock] = useState({
		segments: [{
			fileName: "javascript.js",
			language: "javascript",
			code: ""
		}],
		title: "",
		creationDate: moment().format(),
		lastAccessed: moment().format()
	})
	const { id } = useParams() || {}

	useEffect(() => {
		if (id !== "add") {
			const data = queryClient.getQueryData(MAIN_QUERY()) || { data: [] }
			const i = data.data.findIndex(o => o.id === id)
			if (i === -1) {
				history.goBack()
			} else {
				setBlock({
					...data.data[i],
					lastAccessed: moment().format()
				})
			}
		}
	}, [id])

	const deleteBlock = async () => {
		if (window.confirm("Would you like to delete this block?")) {
			setLoading(true)
			try {
				console.log('Delete block')
				await runDeleteBlock.mutateAsync(block)
				history.goBack()
			} catch (e) {
			}
			setLoading(false)
		}
	}

	const addBlock = async () => {
		if (!block.segments || !block.title) {
			return
		}

		if (window.confirm("Save code block?")) {
			setLoading(true)
			try {
				await runUpdateCode.mutateAsync(block)
				history.goBack()
			} catch (e) {
			}
			setLoading(false)
		}
	}

	const cancel = () => {
		// too annoying for now
		// if (block.segments.length && block.segments[0].code.length) {
		// 	if (window.confirm("Are you sure you want to exit without saving?")) {
		// 		history.goBack()
		// 	}
		// } else {
			history.goBack()
		// }
	}

	const addSegment = () => {
		const min = []
		for (let i = 0; i < block.segments.length; i++) {
			min.push(i)
		}
		setMinimized(min)
		const blocks = [...block.segments, {
			fileName: "javascript.js",
			language: "javascript",
			code: ""
		}]
		setBlock({
			...block,
			segments: blocks
		})
	}

	const toggleSegment = (index) => {
		const min = [...minimized]
		if (min.indexOf(index) === -1) {
			min.push(index)
		} else {
			min.splice(min.indexOf(index), 1)
		}
		setMinimized(min)
	}

	const deleteSegment = (i) => {
		const blocks = [...block.segments]
		blocks.splice(i, 1)
		setBlock({
			...block,
			segments: blocks
		})
	}

	const updateSegmentField = (e, i, field) => {
		const blocks = [...block.segments]
		blocks[i][field] = e.target.value;
		setBlock({
			...block,
			segments: blocks
		})
	}

	return (
		<div>
			{loading && <CenterLoader/>}
			<FlexBox justify={"space-between"} style={{ padding: "12px" }}>
				<Title/>
			</FlexBox>

			<FlexBox dir={"column"} align={"flex-start"}>
				<FlexBox align={"flex-end"} style={{ paddingLeft: 12, paddingRight: 12, marginBottom: 12, width: "96%" }}>
					<NewEntryInput style={{ flex: 1, marginRight: 20 }} placeholder={"Block Title"} value={block.title}
												 onChange={ev => {
													 setBlock({
														 ...block,
														 title: ev.target.value
													 })
												 }}/>
					<Button style={{ width: 100, borderRadius: 2, height: 34 }} primary onClick={addSegment}>ADD</Button>
				</FlexBox>


				{block.segments.map((segment, i) => {
					const min = minimized.indexOf(i) > -1
					return (
						<>
							<CodeTopBar>
								<div onClick={() => toggleSegment(i)} className={"minus"}>
									{!min ? <ChevronDown color={'#fff'} style={{top: 2, left: 1, position: 'relative'}} /> : <ChevronForward color={'#fff'} style={{top: 2, left: 1, position: 'relative'}} />}
								</div>
								<input style={{flex: 1}} onChange={e => updateSegmentField(e, i, 'fileName')} value={segment.fileName} placeholder={"filename"}/>
								{!min && <select onChange={e => updateSegmentField(e, i, 'language')}>
									{config.languages.map(o => <option value={o.value}>{o.short || o.display}</option>)}
								</select>}
								{min && <div onClick={() => deleteSegment(i)} className={'delete-seg'}>DELETE</div>}
							</CodeTopBar>
							{!min && <CodeBlockEditor code={segment.code}
																				mode={segment.language}
																				onChange={text => {
																					const blocks = [...block.segments]
																					blocks[i].code = text
																					setBlock({
																						...block,
																						segments: blocks
																					})
																				}}/>}
						</>
					)
				})}

				<Footer justify={"space-between"} flex={1}>
					{!!block.id ? <Button style={{ width: 100, marginRight: "auto" }} onClick={deleteBlock} warn basic>DELETE</Button> : <div/>}

					<FlexBox>
						<Button style={{ width: 100, marginRight: 10 }} onClick={cancel}>CANCEL</Button>
						<Button style={{ width: 100 }} primary onClick={addBlock}>SAVE</Button>
					</FlexBox>
				</Footer>
			</FlexBox>

		</div>
	)
}

export default CodeBlock
