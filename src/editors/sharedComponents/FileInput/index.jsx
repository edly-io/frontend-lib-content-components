import React from 'react';
import PropTypes from 'prop-types';

export const fileInput = ({ onAddFile, onCancel }) => {
  const ref = React.useRef();
  const click = () => ref.current.click();
  const handleWindowFocus = () => {
    // https://github.com/GoogleChromeLabs/browser-fs-access/blob/5d8a551af106121d010c1c50ca4a15d3cb0b189d/src/legacy/file-open.mjs
    // Hacky solution for handling file input cancel button event
    window.removeEventListener('focus', handleWindowFocus);
    setTimeout(() => {
      if (ref.current?.files.length <= 0 && onCancel) {
        onCancel();
      }
    }, 1400);
  };
  const handleClick = () => {
    window.addEventListener('focus', handleWindowFocus);
  };
  const addFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      onAddFile(file);
    }
  };
  return {
    click,
    addFile,
    ref,
    handleClick,
  };
};

export const FileInput = ({ fileInput: hook, acceptedFiles }) => (
  <input
    accept={acceptedFiles}
    className="upload d-none"
    onChange={hook.addFile}
    ref={hook.ref}
    type="file"
    onClick={hook.handleClick}
  />
);

FileInput.propTypes = {
  acceptedFiles: PropTypes.string.isRequired,
  fileInput: PropTypes.shape({
    addFile: PropTypes.func,
    ref: PropTypes.oneOfType([
      // Either a function
      PropTypes.func,
      // Or the instance of a DOM native element (see the note about SSR)
      PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    ]),
  }).isRequired,
};

export default FileInput;
