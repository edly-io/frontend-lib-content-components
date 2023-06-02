import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import {
  Card,
  Button,
  IconButton,
  Icon,
  ActionRow,
} from '@edx/paragon';
import { DeleteOutline } from '@edx/paragon/icons';

import {
  FormattedMessage,
  injectIntl,
} from '@edx/frontend-platform/i18n';
import { thunkActions } from '../../../../../../data/redux';

import TranscriptActionMenu from './TranscriptActionMenu';
import LanguageSelector from './LanguageSelector';
import * as module from './Transcript';
import messages from './messages';

export const hooks = {
  state: {
    inDeleteConfirmation: (args) => React.useState(args),
  },
  setUpDeleteConfirmation: () => {
    const [inDeleteConfirmation, setInDeleteConfirmation] = module.hooks.state.inDeleteConfirmation(false);
    return {
      inDeleteConfirmation,
      launchDeleteConfirmation: () => setInDeleteConfirmation(true),
      cancelDelete: () => setInDeleteConfirmation(false),
    };
  },
};

export const Transcript = ({
  index,
  language,
  // redux
  deleteTranscript,
}) => {
  const { inDeleteConfirmation, launchDeleteConfirmation, cancelDelete } = module.hooks.setUpDeleteConfirmation();
  return (
    <>
      {inDeleteConfirmation
        ? (
          <Card className="mb-2">
            <Card.Header title={(<FormattedMessage {...messages.deleteConfirmationHeader} />)} />
            <Card.Body>
              <Card.Section>
                <div><FormattedMessage {...messages.deleteConfirmationMessage} /></div>
                <div><FormattedMessage {...messages.fileReplaceDeleteWarning} /></div>
              </Card.Section>
              <Card.Footer>
                <Button variant="tertiary" className="mb-2 mb-sm-0" onClick={cancelDelete}>
                  <FormattedMessage {...messages.cancelDeleteLabel} />
                </Button>
                <Button
                  variant="danger"
                  className="mb-2 mb-sm-0"
                  onClick={() => {
                    deleteTranscript({ language });
                    // stop showing the card
                    cancelDelete();
                  }}
                >
                  <FormattedMessage {...messages.confirmDeleteLabel} />
                </Button>
              </Card.Footer>
            </Card.Body>
          </Card>
        )
        : (
          <ActionRow>
            <LanguageSelector
              title={index}
              language={language}
            />
            <ActionRow.Spacer />
            { language === '' ? (
              <IconButton
                iconAs={Icon}
                src={DeleteOutline}
                onClick={() => launchDeleteConfirmation()}
              />
            ) : (
              <TranscriptActionMenu
                index={index}
                language={language}
                launchDeleteConfirmation={launchDeleteConfirmation}
              />
            )}
          </ActionRow>
        )}
    </>
  );
};

Transcript.propTypes = {
  index: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired,
  deleteTranscript: PropTypes.func.isRequired,
};

export const mapStateToProps = () => ({
});
export const mapDispatchToProps = {
  deleteTranscript: thunkActions.video.deleteTranscript,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Transcript));
