import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from '@edx/frontend-platform/i18n';
import * as hooks from '../../../hooks';
import { selectors, actions } from '../../../../../data/redux';
import { messages } from './messages';
import 'tinymce/plugins/paste';

// This widget should be connected, grab all questions from store, update them as needed.
export const QuestionWidget = ({
  question,
  updateQuestion,
}) => {
  const { editorRef, refReady, setEditorRef } = hooks.prepareEditorRef();
  if (!refReady) { return null; }
  return (
    <div>
      <div>
        <h1>
          <FormattedMessage {...messages.questionWidgetTitle} />
        </h1>
        <Editor
          init={{
            menubar: true,
            toolbar: true,
            plugins: ['paste'],
            paste_as_text: true,
            paste_text_sticky: true,
            paste_auto_cleanup_on_paste: true,
            paste_remove_styles: true,
            paste_remove_styles_if_webkit: true,
            paste_strip_class_attributes: true,
            paste_enable_default_filters: false,
            paste_word_valid_elements: 'p',
            entity_encoding: 'raw',
          }}
          {
          ...hooks.problemEditorConfig({
            setEditorRef,
            editorRef,
            question,
            updateQuestion,
          })
        }
        />
      </div>
    </div>
  );
};

QuestionWidget.propTypes = {
  question: PropTypes.string.isRequired,
  updateQuestion: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  question: selectors.problem.question(state),
});

export const mapDispatchToProps = {
  updateQuestion: actions.problem.updateQuestion,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(QuestionWidget));
