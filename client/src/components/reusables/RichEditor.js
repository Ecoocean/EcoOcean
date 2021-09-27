import React, { useState, useEffect } from "react";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";

const parseData = (data) => {
  return data
    ? EditorState.createWithContent(convertFromRaw(JSON.parse(data)))
    : EditorState.createEmpty();
};

const RichEditor = (props) => {
  const [editorState, setEditorState] = useState(null);

  useEffect(() => {
    setEditorState(parseData(props.data));
  }, [props.data]);

  const getData = () => {
    let cc = editorState.getCurrentContent();
    // This \u0001 explained here: https://stackoverflow.com/questions/51665544/how-retrieve-text-from-draftjs
    let res;
    if (cc.getPlainText("\u0001").length === 0) {
      res = null;
    } else {
      res = JSON.stringify(convertToRaw(cc));
    }
    setEditorState(null);
    return res;
  };

  props.getCallback(getData);

  return (
    <div className="editor">
      <Editor
        editorState={editorState}
        textAlignment="right"
        readOnly={props.readOnly}
        onEditorStateChange={(es) => setEditorState(es)}
        toolbarHidden={props.readOnly}
        toolbar={{
          options: ["inline", "link", "list"],
          // inline: { inDropdown: true },
          // list: { inDropdown: true },
          // textAlign: { inDropdown: true },
          // link: { inDropdown: true },
          // history: { inDropdown: true },
          // image: {
          //     uploadCallback: uploadImageCallBack,
          //     alt: { present: true, mandatory: true },
          // },
        }}
      />
    </div>
  );
};

RichEditor.defaultProps = {
  disabled: false,
};

export default RichEditor;
