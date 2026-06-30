'use client';

import {EditorState} from '@codemirror/state';
import {EditorView, keymap} from '@codemirror/view';
import {defaultKeymap} from '@codemirror/commands';
import React, {useCallback, useEffect, useState} from 'react';

export default function CodeEditor() {
  const startState = EditorState.create({
    doc: 'Hello World',
    extensions: [keymap.of(defaultKeymap)]
  });
  const [element, setElement] = useState<HTMLElement>();

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    setElement(node);
  }, []);

  useEffect(() => {
    const view = new EditorView({
      state: startState,
      parent: element
    });

    return () => {
      view?.destroy();
    };
  }, [element, startState]);

  return (<div ref={ref}></div>);
}