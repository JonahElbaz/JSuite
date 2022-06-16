import React, { useEffect, useState } from "react"
import { useUserData } from "../../store/hooks/user.hook.js"
import Title from "../../components/Title.js"
import { config } from "../../config"
import { AddCircle } from "react-ionicons"
import { useHistory } from "react-router-dom"
import { FlexBox, ListContainer, ListItem, NewEntryInput, ResultItem, TypePill } from "../../styles"
import "firebase/auth"
import CenterLoader from "../../components/CenterLoader.js"
import Dropdown from "react-dropdown"

const List = ({}) => {
	const history = useHistory()
	const { data, isFetching } = useUserData()
	const blocks = data ? data.data || [] : []
	const [results, setResults] = useState([])


	const [filters, setFilters] = useState({
		search: "",
		languages: []
	})

	useEffect(() => {
		if (!blocks.length) {
			return
		}
		try {
			const filterLang = (arr) => {
				if (!filters.languages.length) {
					return arr
				}
				return arr.filter(o => {
					const languages = o.segments.map(l => l.language)
					for (const lang of filters.languages) {
						if (languages.indexOf(lang) > -1) {
							return true
						}
					}
					return false
				})
			}

			let filteredData = filterLang([...blocks])

			if (filters.search.length) {
				filteredData = [...filteredData].filter(o => o.title.toLowerCase().includes(filters.search.toLowerCase()))

				filterLang([...blocks])
					.map(o => {
						o.segmentResults = []
						return o
					})
					.forEach((entry, i) => {
						entry.segments.forEach((segment, j) => {
							const foundIndex = segment.code.toLowerCase().indexOf(filters.search.toLowerCase())
							if (foundIndex > -1) {
								const start = foundIndex - 10 < 0 ? 0 : foundIndex - 5
								const end = foundIndex + 50 > segment.code.length - 1 ? segment.code.length - 1 : foundIndex + 50
								const rez = {
									filename: segment.fileName,
									line: segment.code.substr(start, end - start)
								}
								const existingI = filteredData.findIndex(o => o.id === entry.id)
								if (existingI === -1) {
									const newEntry = { ...entry }
									newEntry.segmentResults = [rez]
									filteredData.push(newEntry)
								} else {
									filteredData[existingI].segmentResults.push(rez)
								}
							}
						})
					})
				if (JSON.stringify(results) !== JSON.stringify(filteredData)) {
					setResults(filteredData)
				}
			} else {
				if (JSON.stringify(results) !== JSON.stringify(filteredData)) {
					setResults(filteredData.map(o => {
						o.segmentResults = []
						return o
					}))
				}
			}
		} catch (e) {
			alert("There was an error running a search")
			setResults(blocks)
		}

	}, [data, filters])

	const selectBlock = (id) => {
		history.push(`/list/${id}`)
	}

	const addBlock = () => {
		history.push(`/list/add`)
	}

	const highlight = (text) => {
		const index = text.toLowerCase().indexOf(filters.search.toLowerCase())
		if (index >= 0) {
			return text.substring(0, index) + "<span class='highlight'>" + text.substring(index, index + filters.search.length) + "</span>" + text.substring(index + filters.search.length)
		}
	}

	if (isFetching) {
		return (
			<CenterLoader/>
		)
	}

	return (
		<div>
			<FlexBox justify={"space-between"} style={{ marginRight: 12, padding: 12 }}>
				<Title/>
				<FlexBox>
					{/*<Cog*/}
					{/*	color={"white"}*/}
					{/*	height="20px"*/}
					{/*	width="20px"*/}
					{/*	style={{ cursor: "pointer", marginLeft: 20 }}*/}
					{/*	onClick={() => history.push("/settings")}*/}
					{/*/>*/}
				</FlexBox>
			</FlexBox>
			<h3 style={{ paddingLeft: 12, marginTop: 20, marginBottom: 6 }}>
				Code Blocks
				<AddCircle
					color={config.colors.primary}
					height="20px"
					width="20px"
					style={{ cursor: "pointer", position: "relative", top: 3, left: 6 }}
					onClick={() => addBlock()}
				/>
			</h3>

			<FlexBox style={{ padding: 12 }}>
				<NewEntryInput style={{ flex: 1, marginRight: 20 }} placeholder={"Block Title"} value={filters.search}
											 onChange={ev => {
												 setFilters({
													 ...filters,
													 search: ev.target.value
												 })
											 }}/>

				<Dropdown options={["none", ...config.languages.map(o => o.value)]} onChange={(e) => {
					setFilters({
						...filters,
						languages: e.value.toLowerCase() === "none" ? [] : [e.value.toLowerCase()]
					})
				}} value={filters.languages.length ? filters.languages[0] : "none"} placeholder="Language"/>
			</FlexBox>

			<ListContainer>
				{results.map((block, i) => {
					return (
						<>
							<ListItem key={"block" + i} onClick={() => selectBlock(block.id)}>
								<div>{block.title}</div>
								<FlexBox>
									{Array.from(new Set(block.segments.map(o => o.language))).map(l => <TypePill
										language={l}>{l}</TypePill>)}
								</FlexBox>
							</ListItem>
							{(block.segmentResults || []).map(rez => (
								<ResultItem>
									<div>
										{rez.filename}:
									</div>
									<div dangerouslySetInnerHTML={{ __html: highlight(rez.line) }}/>
								</ResultItem>
							))
							}
						</>
					)
				})}
			</ListContainer>
		</div>
	)
}

export default List

