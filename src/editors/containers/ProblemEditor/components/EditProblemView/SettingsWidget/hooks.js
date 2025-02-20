import { useState, useEffect } from 'react';

import _ from 'lodash-es';
import * as module from './hooks';
import messages from './messages';
import { ShowAnswerTypesKeys } from '../../../../../data/constants/problem';

export const state = {
  showAdvanced: (val) => useState(val),
  cardCollapsed: (val) => useState(val),
  summary: (val) => useState(val),
  showAttempts: (val) => useState(val),
};

export const showAdvancedSettingsCards = () => {
  const [isAdvancedCardsVisible, setIsAdvancedCardsVisible] = module.state.showAdvanced(false);
  return {
    isAdvancedCardsVisible,
    showAdvancedCards: () => setIsAdvancedCardsVisible(true),
  };
};

export const showFullCard = () => {
  const [isCardCollapsed, setIsCardCollapsed] = module.state.cardCollapsed(false);
  return {
    isCardCollapsed,
    toggleCardCollapse: () => setIsCardCollapsed(!isCardCollapsed),
  };
};

export const hintsCardHooks = (hints, updateSettings) => {
  const [summary, setSummary] = module.state.summary({ message: messages.noHintSummary, values: {} });

  useEffect(() => {
    const hintsNumber = hints.length;
    if (hintsNumber === 0) {
      setSummary({ message: messages.noHintSummary, values: {} });
    } else {
      setSummary({ message: messages.hintSummary, values: { hint: hints[0].value, count: (hintsNumber - 1) } });
    }
  }, [hints]);

  const handleAdd = () => {
    let newId = 0;
    if (!_.isEmpty(hints)) {
      newId = Math.max(...hints.map(hint => hint.id)) + 1;
    }
    const hint = { id: newId, value: '' };
    const modifiedHints = [...hints, hint];
    updateSettings({ hints: modifiedHints });
  };

  return {
    summary,
    handleAdd,
  };
};

export const hintsRowHooks = (id, hints, updateSettings) => {
  const handleChange = (event) => {
    const { value } = event.target;
    const modifiedHints = hints.map(hint => {
      if (hint.id === id) {
        return { ...hint, value };
      }
      return hint;
    });
    updateSettings({ hints: modifiedHints });
  };

  const handleDelete = () => {
    const modifiedHints = hints.filter((hint) => (hint.id !== id));
    updateSettings({ hints: modifiedHints });
  };

  return {
    handleChange,
    handleDelete,
  };
};

export const matlabCardHooks = (matLabApiKey, updateSettings) => {
  const [summary, setSummary] = module.state.summary({ message: '', values: {}, intl: false });

  useEffect(() => {
    if (_.isEmpty(matLabApiKey)) {
      setSummary({ message: messages.matlabNoKeySummary, values: {}, intl: true });
    } else {
      setSummary({ message: matLabApiKey, values: {}, intl: false });
    }
  }, [matLabApiKey]);

  const handleChange = (event) => {
    updateSettings({ matLabApiKey: event.target.value });
  };

  return {
    summary,
    handleChange,
  };
};

export const resetCardHooks = (updateSettings) => {
  const setReset = (value) => {
    updateSettings({ showResetButton: value });
  };

  return {
    setResetTrue: () => setReset(true),
    setResetFalse: () => setReset(false),
  };
};

export const scoringCardHooks = (scoring, updateSettings) => {
  const handleMaxAttemptChange = (event) => {
    let unlimitedAttempts = true;
    let attemptNumber = parseInt(event.target.value);
    if (_.isNaN(attemptNumber)) {
      attemptNumber = 0;
    }
    if (attemptNumber > 0) {
      unlimitedAttempts = false;
    }
    if (!attemptNumber) {
      // saving 0 attempts will disable submit button
      attemptNumber = '';
    }
    updateSettings({ scoring: { ...scoring, attempts: { number: attemptNumber, unlimited: unlimitedAttempts } } });
  };

  const handleWeightChange = (event) => {
    let weight = parseFloat(event.target.value);
    if (_.isNaN(weight)) {
      weight = 0;
    }
    updateSettings({ scoring: { ...scoring, weight } });
  };

  return {
    handleMaxAttemptChange,
    handleWeightChange,
  };
};

export const showAnswerCardHooks = (showAnswer, updateSettings) => {
  const [showAttempts, setShowAttempts] = module.state.showAttempts(false);
  const numberOfAttemptsChoice = [
    ShowAnswerTypesKeys.AFTER_SOME_NUMBER_OF_ATTEMPTS,
    ShowAnswerTypesKeys.AFTER_ALL_ATTEMPTS,
    ShowAnswerTypesKeys.AFTER_ALL_ATTEMPTS_OR_CORRECT,
  ];

  useEffect(() => {
    setShowAttempts(_.includes(numberOfAttemptsChoice, showAnswer.on));
  }, [showAttempts]);

  const handleShowAnswerChange = (event) => {
    const { value } = event.target;
    setShowAttempts(_.includes(numberOfAttemptsChoice, value));
    updateSettings({ showAnswer: { ...showAnswer, on: value } });
  };

  const handleAttemptsChange = (event) => {
    let attempts = parseInt(event.target.value);
    if (_.isNaN(attempts)) {
      attempts = 0;
    }
    updateSettings({ showAnswer: { ...showAnswer, afterAttempts: attempts } });
  };

  return {
    handleShowAnswerChange,
    handleAttemptsChange,
    showAttempts,
  };
};

export const timerCardHooks = (updateSettings) => ({

  handleChange: (event) => {
    let time = parseInt(event.target.value);
    if (_.isNaN(time)) {
      time = 0;
    }
    updateSettings({ timeBetween: time });
  },
});

export const typeRowHooks = (typeKey, updateField) => {
  const onClick = () => {
    updateField({ problemType: typeKey });
  };

  return {
    onClick,
  };
};
