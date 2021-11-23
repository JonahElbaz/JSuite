import React from "react"
import AceEditor from "react-ace"
import "ace-builds/src-noconflict/mode-javascript"
import "ace-builds/src-noconflict/mode-html"
import "ace-builds/src-noconflict/mode-css"
import "ace-builds/src-noconflict/theme-monokai"

const languageShortMap = {
	java: "Java",
	javascript: "JS"
}

const CodeBlockEditor = ({ readOnly = false, code, onChange, mode = "javascript", theme = "monokai" }) => {

	const title = (languageShortMap[mode] || mode).toUpperCase()

	return <AceEditor
		mode={mode}
		value={code}
		theme={theme}
		name={title}
		showGutter
		fontSize={12}
		tabSize={2}
		width={"100%"}
		height={300}
		readOnly={readOnly}
		placeholder={"Show me what you got"}
		className={'code-editor'}
		onChange={onChange}
		setOptions={{
			useWorker: false
		}}
	/>
}

export default CodeBlockEditor
