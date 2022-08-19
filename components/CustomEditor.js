import { createReactEditorJS } from 'react-editor-js'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import React, { Fragment, useState, useRef, useCallback } from 'react'
import Markdoc from '@markdoc/markdoc'

const blockToMarkdoc = {
  header: ({level, text}) => (`${'#'.repeat(level)} ${text}`),
  paragraph: ({ text }) => text,
  list: ({ style, items }) => {
    return items.reduce((list, item, idx) => {
      const bullet = style === 'ordered' ? `${idx+1}.` : '-'
      return `${list}${bullet} ${item}\n`
    }, '')
  }
}

const CustomEditor = () => {

  const [renderedMarkdoc, setRenderedMarkdoc] = useState(null)
  const [markdocSource, setMarkdocSource] = useState('')

  const editorCore = useRef(null)

  const handleInitialize = useCallback((instance) => {
    editorCore.current = instance
  }, [])

  const handleSave = useCallback(async () => {
    const savedData = await editorCore.current.save()
    const source = savedData.blocks.reduce((accumlatedSource, block) => {
      const { type, data } = block
      return `${accumlatedSource}${blockToMarkdoc[type](data)}\n\n`
    }, '')
    const ast = Markdoc.parse(source)
    const content = Markdoc.transform(ast)
    setMarkdocSource(source)
    setRenderedMarkdoc(Markdoc.renderers.react(content, React))
  }, [])

  const blocks = {
    "time": 1652987752657,
    "blocks": [
      {
        "id": "pYQhLg-j1i",
        "type": "header",
        "data": {
          "text": "MarkDoc Editor PoC",
          "level": 2
        }
      },
      {
        "id": "WQmjpW61TS",
        "type": "header",
        "data": {
          "text": "Using Editor.js",
          "level": 3
        }
      },
      {
        "id": "u-DNurLM_L",
        "type": "paragraph",
        "data": {
          "text": "The idea is that this editor interface is for non-devs."
        }
      },
      {
        "id": "mQ-_keqyDd",
        "type": "paragraph",
        "data": {
          "text": "But the content itself will be saved to MarkDoc."
        }
      }
    ],
    "version": "2.24.3"
  }

  const ReactEditorJS = createReactEditorJS()

  return <Fragment>
          <button onClick={handleSave}>Save</button>
          <div style={{
          display: 'flex'
        }}>
          <ReactEditorJS
            holder="custom"
            onInitialize={handleInitialize}
            defaultValue={blocks}
            placeholder="Write your content here..."
            tools={{
              header: Header,
              list: List
            }}
          >
            <div id="custom" style={{
              flex: 1
            }} />
          </ReactEditorJS>
      <textarea value={markdocSource} style={{
        marginRight: '20px'
      }} readOnly={true}></textarea>
    <div style={{
      marginRight: '20px'
    }}>{renderedMarkdoc}</div>
        </div>
  </Fragment>
}

export default CustomEditor
