import React, { useCallback, useState } from "react"
import { useRunUpdateCodeBlock, useUserData } from "../store/hooks/user.hook.js"
import { Route, Switch, useHistory, Redirect } from "react-router-dom"
import List from "./code"
import CenterLoader from "../components/CenterLoader.js"
import CodeBlock from "./code/CodeBlock"
import DragOverComponent from "../components/DragOverComponent"
import { useDropzone } from "react-dropzone"
import { config } from "../config"
import moment from "moment"

const UserNav = ({}) => {
	const history = useHistory()
	const [loading, setLoading] = useState(false)
	const { isLoading: userLoading } = useUserData()
	const runUpdateCode = useRunUpdateCodeBlock()
	const isLoading = loading || userLoading

	const onDrop = useCallback(acceptedFiles => {
		const file = acceptedFiles[0]
		if (file) {
			try {
				const fileName = file.name
				const extension = fileName.substr(fileName.lastIndexOf("."))
				const language = config.languages.find(o => o.extensions.indexOf(extension) > -1)
				if (language && fileName) {
					const reader = new FileReader()
					reader.onload = function(event) {
						const text = event.target.result
						if (text && text.length) {
							if (window.confirm("Save code block?")) {
								setLoading(true)
								try {
									runUpdateCode.mutateAsync({
										segments: [{
											fileName: fileName,
											language: language.value,
											code: text
										}],
										title: fileName,
										creationDate: moment().format(),
										lastAccessed: moment().format()
									}).then(() => history.push("/"))
										.catch(e => alert("Error creating block"))
										.finally(() => setLoading(false))
								} catch (e) {
								}
								setLoading(false)
							}
						}
					}
					reader.readAsText(file)
				}
			} catch (e) {
				return
			}
		}

	}, [])
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true })

	if (isLoading) {
		console.log("Going")
		return (
			<CenterLoader/>
		)
	}

	return (
		<div {...getRootProps()} style={{ height: 500 }}>
			<input {...getInputProps()}  />
			{isDragActive && <DragOverComponent/>}
			<Switch>
				<Redirect from={'/'} to={'/list'} exact />
				<Route path={"/list/:id"} exact component={CodeBlock}/>
				<Route path={"/list"} exact component={List}/>
			</Switch>
		</div>
	)
}

export default UserNav
