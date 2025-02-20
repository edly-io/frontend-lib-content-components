import React from 'react';

import { StrictDict } from '../../../../utils';
import * as module from './hooks';

// Simple wrappers for useState to allow easy mocking for tests.
export const state = {
  altText: (val) => React.useState(val),
  dimensions: (val) => React.useState(val),
  showAltTextDismissibleError: (val) => React.useState(val),
  showAltTextSubmissionError: (val) => React.useState(val),
  isDecorative: (val) => React.useState(val),
  isLocked: (val) => React.useState(val),
  local: (val) => React.useState(val),
  lockDims: (val) => React.useState(val),
  lockInitialized: (val) => React.useState(val),
};

export const dimKeys = StrictDict({
  height: 'height',
  width: 'width',
});

/**
 * findGcd(numerator, denominator)
 * Find the greatest common denominator of a ratio or fraction.
 * @param {number} numerator - ratio numerator
 * @param {number} denominator - ratio denominator
 * @return {number} - ratio greatest common denominator
 */
export const findGcd = (a, b) => (b ? findGcd(b, a % b) : a);
const checkEqual = (d1, d2) => (d1.height === d2.height && d1.width === d2.width);

/**
 * getValidDimensions({ dimensions, local, locked })
 * Find valid ending dimensions based on start state, request, and lock state
 * @param {obj} dimensions - current stored dimensions
 * @param {obj} local - local (active) dimensions in the inputs
 * @param {obj} locked - locked dimensions
 * @return {obj} - output dimensions after move ({ height, width })
 */
export const getValidDimensions = ({
  dimensions,
  local,
  isLocked,
  lockDims,
}) => {
  if (!isLocked || checkEqual(local, dimensions)) {
    return local;
  }
  const out = {};
  let iter;
  const isMin = dimensions.height === lockDims.height;

  const keys = (local.height !== dimensions.height)
    ? { changed: dimKeys.height, other: dimKeys.width }
    : { changed: dimKeys.width, other: dimKeys.height };

  const direction = local[keys.changed] > dimensions[keys.changed] ? 1 : -1;

  // don't move down if already at minimum size
  if (direction < 0 && isMin) { return dimensions; }
  // find closest valid iteration of the changed field
  iter = Math.max(Math.round(local[keys.changed] / lockDims[keys.changed]), 1);
  // if closest valid iteration is current iteration, move one iteration in the change direction
  if (iter === (dimensions[keys.changed] / lockDims[keys.changed])) { iter += direction; }

  out[keys.changed] = Math.round(iter * lockDims[keys.changed]);
  out[keys.other] = Math.round(out[keys.changed] * (lockDims[keys.other] / lockDims[keys.changed]));

  return out;
};

/**
 * dimensionLockHooks({ dimensions })
 * Returns a set of hooks pertaining to the dimension locks.
 * Locks the dimensions initially, on lock initialization.
 * @param {obj} dimensions - current stored dimensions
 * @return {obj} - dimension lock hooks
 *   {func} initializeLock - enable the lock mechanism
 *   {bool} isLocked - are dimensions locked?
 *   {obj} lockDims - image dimensions ({ height, width })
 *   {func} lock - lock the dimensions
 *   {func} unlock - unlock the dimensions
 */
export const dimensionLockHooks = () => {
  const [lockDims, setLockDims] = module.state.lockDims(null);
  const [isLocked, setIsLocked] = module.state.isLocked(true);

  const initializeLock = ({ width, height }) => {
    // find minimum viable increment
    let gcd = module.findGcd(width, height);
    if ([width, height].some(v => !Number.isInteger(v / gcd))) {
      gcd = 1;
    }
    setLockDims({ width: width / gcd, height: height / gcd });
  };

  return {
    initializeLock,
    isLocked,
    lock: () => setIsLocked(true),
    lockDims,
    unlock: () => setIsLocked(false),
  };
};

/**
 * dimensionHooks()
 * Returns an object of dimension-focused react hooks.
 * @return {obj} - dimension hooks
 *   {func} onImgLoad - initializes image dimension fields
 *     @param {object} selection - selected image object with possible override dimensions.
 *     @return {callback} - image load event callback that loads dimensions.
 *   {object} locked - current locked state
 *   {func} lock - lock current dimensions
 *   {func} unlock - unlock dimensions
 *   {object} value - current dimension values
 *   {func} setHeight - set height
 *     @param {string} - new height string
 *   {func} setWidth - set width
 *     @param {string} - new width string
 *   {func} updateDimensions - set dimensions based on state
 *   {obj} errorProps - props for user feedback error
 *     {bool} isError - true if dimensions are blank
 *     {func} setError - sets isError to true
 *     {func} dismissError - sets isError to false
 *     {bool} isHeightValid - true if height field is ready to save
 *     {func} setHeightValid - sets isHeightValid to true
 *     {func} setHeightNotValid - sets isHeightValid to false
 *     {bool} isWidthValid - true if width field is ready to save
 *     {func} setWidthValid - sets isWidthValid to true
 *     {func} setWidthNotValid - sets isWidthValid to false
 */
export const dimensionHooks = (altTextHook) => {
  const [dimensions, setDimensions] = module.state.dimensions(null);
  const [local, setLocal] = module.state.local(null);
  const setAll = ({ height, width, altText }) => {
    if (altText === '' || altText) {
      if (altText === '') {
        altTextHook.setIsDecorative(true);
      }
      altTextHook.setValue(altText);
    }
    setDimensions({ height, width });
    setLocal({ height, width });
  };
  const {
    initializeLock,
    isLocked,
    lock,
    lockDims,
    unlock,
  } = module.dimensionLockHooks({ dimensions });

  return {
    onImgLoad: (selection) => ({ target: img }) => {
      const imageDims = { height: img.naturalHeight, width: img.naturalWidth };
      setAll(selection.height ? selection : imageDims);
      initializeLock(imageDims);
    },
    isLocked,
    lock,
    unlock,
    value: local,
    setHeight: (height) => {
      if (height.match(/[0-9]+[%]{1}/)) {
        const heightPercent = height.match(/[0-9]+[%]{1}/)[0];
        setLocal({ ...local, height: heightPercent });
      } else if (height.match(/[0-9]/)) {
        setLocal({ ...local, height: parseInt(height, 10) });
      }
    },
    setWidth: (width) => {
      if (width.match(/[0-9]+[%]{1}/)) {
        const widthPercent = width.match(/[0-9]+[%]{1}/)[0];
        setLocal({ ...local, width: widthPercent });
      } else if (width.match(/[0-9]/)) {
        setLocal({ ...local, width: parseInt(width, 10) });
      }
    },
    updateDimensions: () => setAll(module.getValidDimensions({
      dimensions,
      local,
      isLocked,
      lockDims,
    })),
  };
};

/**
 * altTextHooks(savedText)
 * Returns a set of react hooks focused around alt text
 * @return {obj} - alt text hooks
 *   {string} value - alt text value
 *   {func} setValue - set alt test value
 *     @param {string} - new alt text
 *   {bool} isDecorative - is the image decorative?
 *   {func} setIsDecorative - set isDecorative field
 *   {obj} error - error at top of page
 *     {bool} show - is error being displayed?
 *     {func} set - set show to true
 *     {func} dismiss - set show to false
 *   {obj} validation - local alt text error
 *     {bool} show - is validation error being displayed?
 *     {func} set - set validation to true
 *     {func} dismiss - set validation to false
 */
export const altTextHooks = (savedText) => {
  const [value, setValue] = module.state.altText(savedText || '');
  const [isDecorative, setIsDecorative] = module.state.isDecorative(false);
  const [showAltTextDismissibleError, setShowAltTextDismissibleError] = module.state.showAltTextDismissibleError(false);
  const [showAltTextSubmissionError, setShowAltTextSubmissionError] = module.state.showAltTextSubmissionError(false);

  const validateAltText = (newVal, newDecorative) => {
    if (showAltTextSubmissionError) {
      if (newVal || newDecorative) {
        setShowAltTextSubmissionError(false);
      }
    }
  };

  return {
    value,
    setValue: (val) => {
      setValue(val);
      validateAltText(val, null);
    },
    isDecorative,
    setIsDecorative: (decorative) => {
      setIsDecorative(decorative);
      validateAltText(null, decorative);
    },
    error: {
      show: showAltTextDismissibleError,
      set: () => setShowAltTextDismissibleError(true),
      dismiss: () => setShowAltTextDismissibleError(false),
    },
    validation: {
      show: showAltTextSubmissionError,
      set: () => setShowAltTextSubmissionError(true),
      dismiss: () => setShowAltTextSubmissionError(false),
    },
  };
};

/**
 * onInputChange(handleValue)
 * Simple event handler forwarding the event target value to a given callback
 * @param {func} handleValue - event value handler
 * @return {func} - evt callback that will call handleValue with the event target value.
 */
export const onInputChange = (handleValue) => (e) => handleValue(e.target.value);

/**
 * onCheckboxChange(handleValue)
 * Simple event handler forwarding the event target checked prop to a given callback
 * @param {func} handleValue - event value handler
 * @return {func} - evt callback that will call handleValue with the event target checked prop.
 */
export const onCheckboxChange = (handleValue) => (e) => handleValue(e.target.checked);

/**
 * checkFormValidation({ altText, isDecorative, onAltTextFail })
 * Handle saving the image context to the text editor
 * @param {string} altText - image alt text
 * @param {bool} isDecorative - is the image decorative?
 * @param {func} onAltTextFail - called if alt text validation fails
 */
export const checkFormValidation = ({
  altText,
  isDecorative,
  onAltTextFail,
}) => {
  if (!isDecorative && altText === '') {
    onAltTextFail();
    return false;
  }
  return true;
};

/**
 * onSave({ altText, dimensions, isDecorative, saveToEditor })
 * Handle saving the image context to the text editor
 * @param {string} altText - image alt text
 * @param {object} dimensions - image dimensions ({ width, height })
 * @param {bool} isDecorative - is the image decorative?
 * @param {func} saveToEditor - save method for submitting image settings.
 */
export const onSaveClick = ({
  altText,
  dimensions,
  isDecorative,
  saveToEditor,
}) => () => {
  if (module.checkFormValidation({
    altText: altText.value,
    isDecorative,
    onAltTextFail: () => {
      altText.error.set();
      altText.validation.set();
    },
  })) {
    altText.error.dismiss();
    altText.validation.dismiss();
    saveToEditor({
      altText: altText.value,
      dimensions,
      isDecorative,
    });
  }
};

export default {
  altText: altTextHooks,
  dimensions: dimensionHooks,
  onCheckboxChange,
  onInputChange,
  onSaveClick,
  checkFormValidation,
};
