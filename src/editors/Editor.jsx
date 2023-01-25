import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import messages from './messages';
import * as hooks from './hooks';

import supportedEditors from './supportedEditors';

export const Editor = ({
  learningContextId,
  blockType,
  blockId,
  lmsEndpointUrl,
  studioEndpointUrl,
  onClose,
}) => {
  const dispatch = useDispatch();
  const data = React.useMemo(
    () => ({
      dispatch,
      data: {
        blockId,
        blockType,
        learningContextId,
        lmsEndpointUrl,
        studioEndpointUrl,
      },
    }),
    [dispatch, blockId, blockType, learningContextId, lmsEndpointUrl, studioEndpointUrl],
  );
  hooks.initializeApp(data);

  const EditorComponent = supportedEditors[blockType];
  return (
    <div className="d-flex flex-column">
      <div
        className="pgn__modal-fullscreen"
        role="dialog"
        aria-label={blockType}
      >
        {(EditorComponent !== undefined)
          ? <EditorComponent onClose={onClose} />
          : <FormattedMessage {...messages.couldNotFindEditor} />}
      </div>
    </div>
  );
};

Editor.defaultProps = {
  blockId: null,
  learningContextId: null,
  lmsEndpointUrl: null,
  onClose: null,
  studioEndpointUrl: null,
};

Editor.propTypes = {
  blockId: PropTypes.string,
  blockType: PropTypes.string.isRequired,
  learningContextId: PropTypes.string,
  lmsEndpointUrl: PropTypes.string,
  onClose: PropTypes.func,
  studioEndpointUrl: PropTypes.string,
};

export default Editor;
