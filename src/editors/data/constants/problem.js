import { StrictDict } from '../../utils';
import singleSelect from '../images/singleSelect.png';
import multiSelect from '../images/multiSelect.png';
import dropdown from '../images/dropdown.png';
import numericalInput from '../images/numericalInput.png';
import textInput from '../images/textInput.png';
import { circuitSchematic } from './olxTemplates/circuitschematic';
import { customGrader } from './olxTemplates/customgrader';
import { dragAndDrop } from './olxTemplates/drag_and_drop';
import { formulaResponse } from './olxTemplates/formularesponse';
import { imageResponse } from './olxTemplates/imageresponse';
import { jsInputResponse } from './olxTemplates/jsinput_response';
import { problemWithHint } from './olxTemplates/problem_with_hint';

export const ProblemTypeKeys = StrictDict({
  SINGLESELECT: 'multiplechoiceresponse',
  MULTISELECT: 'choiceresponse',
  DROPDOWN: 'optionresponse',
  NUMERIC: 'numericalresponse',
  TEXTINPUT: 'stringresponse',
  ADVANCED: 'advanced',
});

export const ProblemTypes = StrictDict({
  [ProblemTypeKeys.SINGLESELECT]: {
    title: 'Single Select Problem',
    preview: singleSelect,
    description: 'Specify one correct answer from a list of possible options',
    helpLink: 'https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/exercises_tools/multiple_choice.html',
    prev: ProblemTypeKeys.TEXTINPUT,
    next: ProblemTypeKeys.MULTISELECT,
  },
  [ProblemTypeKeys.MULTISELECT]: {
    title: 'Multi Select Problem',
    preview: multiSelect,
    description: 'Specify one or more correct answers from a list of possible options.',
    helpLink: 'https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/exercises_tools/checkbox.html',
    next: ProblemTypeKeys.DROPDOWN,
    prev: ProblemTypeKeys.SINGLESELECT,
  },
  [ProblemTypeKeys.DROPDOWN]: {
    title: 'Dropdown Problem',
    preview: dropdown,
    description: 'Specify one correct answer from a list of possible options, selected in a dropdown menu.',
    helpLink: 'https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/exercises_tools/dropdown.html',
    next: ProblemTypeKeys.NUMERIC,
    prev: ProblemTypeKeys.MULTISELECT,
  },
  [ProblemTypeKeys.NUMERIC]: {
    title: 'Numeric Response Problem',
    preview: numericalInput,
    description: 'Specify one or more correct numeric answers, submitted in a response field.',
    helpLink: 'https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/exercises_tools/numerical_input.html',
    next: ProblemTypeKeys.TEXTINPUT,
    prev: ProblemTypeKeys.DROPDOWN,
  },
  [ProblemTypeKeys.TEXTINPUT]: {
    title: 'Text Input Problem',
    preview: textInput,
    description: 'Specify one or more correct text answers, including numbers and special characters, submitted in a response field.',
    helpLink: 'https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/exercises_tools/text_input.html',
    prev: ProblemTypeKeys.NUMERIC,
    next: ProblemTypeKeys.SINGLESELECT,
  },
  [ProblemTypeKeys.ADVANCED]: {
    title: 'Advanced Problem',
    preview: ('<div />'),
    description: 'An Advanced Problem Type',
    helpLink: 'something.com',
  },
});

export const AdvanceProblemKeys = StrictDict({
  BLANK: 'blankadvanced',
  CIRCUITSCHEMATIC: 'circuitschematic',
  JSINPUT: 'jsinputresponse',
  CUSTOMGRADER: 'customgrader',
  DRAGANDDROP: 'draganddrop',
  IMAGE: 'imageresponse',
  FORMULA: 'formularesponse',
  PROBLEMWITHHINT: 'problemwithhint',
});

export const AdvanceProblems = StrictDict({
  [AdvanceProblemKeys.BLANK]: {
    title: 'Blank advance problem',
    status: '',
    template: '<problem></problem>',
  },
  [AdvanceProblemKeys.CIRCUITSCHEMATIC]: {
    title: 'Circuit schematic builder',
    status: 'Not supported',
    template: circuitSchematic,
  },
  [AdvanceProblemKeys.JSINPUT]: {
    title: 'Custom JavaScript display and grading',
    status: '',
    template: jsInputResponse,
  },
  [AdvanceProblemKeys.CUSTOMGRADER]: {
    title: 'Custom Python-evaluated input',
    status: 'Provisional',
    template: customGrader,
  },
  [AdvanceProblemKeys.DRAGANDDROP]: {
    title: 'Drag and drop (deprecated version)',
    status: 'Not supported',
    template: dragAndDrop,
  },
  [AdvanceProblemKeys.IMAGE]: {
    title: 'Image mapped input',
    status: 'Not supported',
    template: imageResponse,
  },
  [AdvanceProblemKeys.FORMULA]: {
    title: 'Math expression input',
    status: '',
    template: formulaResponse,
  },
  [AdvanceProblemKeys.PROBLEMWITHHINT]: {
    title: 'Problem with adaptive hint',
    status: 'Not supported',
    template: problemWithHint,
  },
});

export const ShowAnswerTypesKeys = StrictDict({
  ALWAYS: 'always',
  ANSWERED: 'answered',
  ATTEMPTED: 'attempted',
  CLOSED: 'closed',
  FINISHED: 'finished',
  CORRECT_OR_PAST_DUE: 'correct_or_past_due',
  PAST_DUE: 'past_due',
  NEVER: 'never',
  AFTER_SOME_NUMBER_OF_ATTEMPTS: 'after_attempts',
  AFTER_ALL_ATTEMPTS: 'after_all_attempts',
  AFTER_ALL_ATTEMPTS_OR_CORRECT: 'after_all_attempts_or_correct',
  ATTEMPTED_NO_PAST_DUE: 'attempted_no_past_due',
});

export const ShowAnswerTypes = StrictDict({
  [ShowAnswerTypesKeys.ALWAYS]: {
    id: 'authoring.problemeditor.settings.showanswertype.always',
    defaultMessage: 'Always',
  },
  [ShowAnswerTypesKeys.ANSWERED]: {
    id: 'authoring.problemeditor.settings.showanswertype.answered',
    defaultMessage: 'Answered',
  },
  [ShowAnswerTypesKeys.ATTEMPTED]: {
    id: 'authoring.problemeditor.settings.showanswertype.attempted',
    defaultMessage: 'Attempted or Past Due',
  },
  [ShowAnswerTypesKeys.CLOSED]: {
    id: 'authoring.problemeditor.settings.showanswertype.closed',
    defaultMessage: 'Closed',
  },
  [ShowAnswerTypesKeys.FINISHED]: {
    id: 'authoring.problemeditor.settings.showanswertype.finished',
    defaultMessage: 'Finished',
  },
  [ShowAnswerTypesKeys.CORRECT_OR_PAST_DUE]: {
    id: 'authoring.problemeditor.settings.showanswertype.correct_or_past_due',
    defaultMessage: 'Correct or Past Due',
  },
  [ShowAnswerTypesKeys.PAST_DUE]: {
    id: 'authoring.problemeditor.settings.showanswertype.past_due',
    defaultMessage: 'Past Due',
  },
  [ShowAnswerTypesKeys.NEVER]: {
    id: 'authoring.problemeditor.settings.showanswertype.never',
    defaultMessage: 'Never',
  },
  [ShowAnswerTypesKeys.AFTER_SOME_NUMBER_OF_ATTEMPTS]: {
    id: 'authoring.problemeditor.settings.showanswertype.after_attempts',
    defaultMessage: 'After Some Number of Attempts',
  },
  [ShowAnswerTypesKeys.AFTER_ALL_ATTEMPTS]: {
    id: 'authoring.problemeditor.settings.showanswertype.after_all_attempts',
    defaultMessage: 'After All Attempts',
  },
  [ShowAnswerTypesKeys.AFTER_ALL_ATTEMPTS_OR_CORRECT]: {
    id: 'authoring.problemeditor.settings.showanswertype.after_all_attempts_or_correct',
    defaultMessage: 'After All Attempts or Correct',
  },
  [ShowAnswerTypesKeys.ATTEMPTED_NO_PAST_DUE]: {
    id: 'authoring.problemeditor.settings.showanswertype.attempted_no_past_due',
    defaultMessage: 'Attempted',
  },
});
