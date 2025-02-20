import { useEffect, useState } from 'react';
import {
  AdvanceProblemKeys, AdvanceProblems, ProblemTypeKeys, ProblemTypes,
} from '../../../../data/constants/problem';
import { StrictDict } from '../../../../utils';
import * as module from './hooks';

export const state = StrictDict({
  selected: (val) => useState(val),
});

export const selectHooks = () => {
  const [selected, setSelected] = module.state.selected(ProblemTypeKeys.SINGLESELECT);
  return {
    selected,
    setSelected,
  };
};

export const onSelect = (setProblemType, selected, updateField) => () => {
  if (Object.values(AdvanceProblemKeys).includes(selected)) {
    updateField({ rawOLX: AdvanceProblems[selected].template });
  }
  setProblemType({ selected });
};

export const useArrowNav = (selected, setSelected) => {
  const detectKeyDown = (e) => {
    const problemTypeValues = Object.values(ProblemTypeKeys);
    switch (e.key) {
      case 'ArrowUp':
        if (problemTypeValues.includes(selected) && ProblemTypes[selected].prev) {
          setSelected(ProblemTypes[selected].prev);
          document.getElementById(ProblemTypes[selected].prev).focus();
        }
        break;
      case 'ArrowDown':
        if (problemTypeValues.includes(selected) && ProblemTypes[selected].next) {
          setSelected(ProblemTypes[selected].next);
          document.getElementById(ProblemTypes[selected].next).focus();
        }
        break;
      default:
    }
  };
  useEffect(() => {
    document.addEventListener('keydown', detectKeyDown, true);
    return () => {
      document.removeEventListener('keydown', detectKeyDown, true);
    };
  }, [selected, setSelected]);
};

export default {
  state,
  selectHooks,
  onSelect,
  useArrowNav,
};
