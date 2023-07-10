import {
  useState, useEffect, useRef, useCallback,
} from 'react';
import { StrictDict } from '../../../../../utils';
import * as module from './hooks';
import { actions } from '../../../../../data/redux';

export const state = StrictDict({
  isFeedbackVisible: (val) => useState(val),
  refReady: (val) => useState(val),
});

export const removeAnswer = ({ answer, dispatch }) => () => {
  dispatch(actions.problem.deleteAnswer({ id: answer.id }));
};

export const setAnswer = ({ answer, hasSingleAnswer, dispatch }) => (payload) => {
  dispatch(actions.problem.updateAnswer({ id: answer.id, hasSingleAnswer, ...payload }));
};

export const prepareFeedback = (answer) => {
  const [isFeedbackVisible, setIsFeedbackVisible] = module.state.isFeedbackVisible(false);
  useEffect(() => {
    // Show feedback fields if feedback is present
    const isVisible = !!answer.selectedFeedback || !!answer.unselectedFeedback || !!answer.feedback;
    setIsFeedbackVisible(isVisible);
  }, [answer]);

  const toggleFeedback = (open) => {
    // Do not allow to hide if feedback is added
    if (!!answer.selectedFeedback || !!answer.unselectedFeedback || !!answer.feedback) {
      setIsFeedbackVisible(true);
      return;
    }
    setIsFeedbackVisible(open);
  };
  return {
    isFeedbackVisible,
    toggleFeedback,
  };
};

export const prepareEditorRef = () => {
  const editorRef = useRef(null);
  const setEditorRef = useCallback((ref) => {
    editorRef.current = ref;
  }, []);
  const [refReady, setRefReady] = module.state.refReady(false);
  useEffect(() => setRefReady(true), [setRefReady]);
  return { editorRef, refReady, setEditorRef };
};

export const editorConfig = ({
  setEditorRef,
  editorRef,
  initialValue,
  saveContent,
}) => ({
  onInit: (evt, editor) => {
    setEditorRef(editor);
  },
  initialValue: initialValue || '',
  onBlur: () => {
    const content = editorRef.current.getContent();
    saveContent(content);
  },
});

export default {
  state, removeAnswer, setAnswer, prepareFeedback,
};
