import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@edx/paragon';
import { ArrowBackIos } from '@edx/paragon/icons';
import {
  FormattedMessage,
} from '@edx/frontend-platform/i18n';

// import VideoPreview from './components/VideoPreview';
import ErrorSummary from './ErrorSummary';
import DurationWidget from './components/DurationWidget';
import TranscriptWidget from './components/TranscriptWidget';
import VideoSourceWidget from './components/VideoSourceWidget';
import './index.scss';
import messages from '../../messages';

export const VideoSettingsModal = ({
  onReturn,
}) => (
  <>
    <Button
      variant="link"
      className="text-primary-500"
      size="sm"
      onClick={onReturn}
      style={{
        textDecoration: 'none',
        marginLeft: '3px',
      }}
      disabled
    >
      <Icon src={ArrowBackIos} style={{ height: '13px' }} />
      <FormattedMessage {...messages.replaceVideoButtonLabel} />
    </Button>
    <ErrorSummary />
    <VideoSourceWidget />
    <TranscriptWidget />
    <DurationWidget />
  </>
);

VideoSettingsModal.propTypes = {
  showReturn: PropTypes.bool.isRequired,
  onReturn: PropTypes.func.isRequired,
};

export default VideoSettingsModal;
