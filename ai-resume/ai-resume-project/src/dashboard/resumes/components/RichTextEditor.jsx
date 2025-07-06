import React, { useState, useEffect } from 'react';

import {
    Editor, EditorProvider, BtnBold,
    BtnBulletList,
    BtnItalic,
    BtnLink,
    BtnNumberedList,
    BtnRedo,
    BtnUnderline,
    BtnUndo,
    Separator,
    Toolbar,
} from 'react-simple-wysiwyg';

export const RichTextEditor = ({ value, onRichTextEditor }) => {
    const [editorValue, setEditorValue] = useState(value || "");

    useEffect(() => {
        setEditorValue(value);
    }, [value]);

    const handleChange = (newValue) => {
        setEditorValue(newValue);
        onRichTextEditor(newValue);
    };

    return (
        <div>
            <EditorProvider>
                <Editor value={editorValue} onChange={(e) => handleChange(e.target.value)}>
                    <Toolbar>
                        <BtnUndo />
                        <BtnRedo />
                        <Separator />
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                        <Separator />
                        <BtnNumberedList />
                        <BtnBulletList />
                        <Separator />
                        <BtnLink />
                    </Toolbar>
                </Editor>
            </EditorProvider>
        </div>
    );
};
