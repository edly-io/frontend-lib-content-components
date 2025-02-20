// Parse OLX to JavaScript objects.
/* eslint no-eval: 0 */

import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import _ from 'lodash-es';
import { ProblemTypeKeys } from '../../../data/constants/problem';

export const indexToLetterMap = [...Array(26)].map((val, i) => String.fromCharCode(i + 65));

export const nonQuestionKeys = [
  'responseparam',
  'formulaequationinput',
  'correcthint',
  '@_answer',
  'optioninput',
  'checkboxgroup',
  'choicegroup',
  'additional_answer',
  'stringequalhint',
  'textline',
  '@_type',
  'formulaequationinput',
  'numericalresponse',
  'demandhint',
];

export const responseKeys = [
  'multiplechoiceresponse',
  'numericalresponse',
  'optionresponse',
  'stringresponse',
  'choiceresponse',
  'multiplechoiceresponse',
  'truefalseresponse',
  'optionresponse',
  'numericalresponse',
  'stringresponse',
  'customresponse',
  'symbolicresponse',
  'coderesponse',
  'externalresponse',
  'formularesponse',
  'schematicresponse',
  'imageresponse',
  'annotationresponse',
  'choicetextresponse',
];

export class OLXParser {
  constructor(olxString) {
    this.problem = {};
    const options = {
      ignoreAttributes: false,
      alwaysCreateTextNode: true,
      // preserveOrder: true
    };
    const parser = new XMLParser(options);
    this.parsedOLX = parser.parse(olxString);
    if (_.has(this.parsedOLX, 'problem')) {
      this.problem = this.parsedOLX.problem;
    }
    const questionParserOptions = {
      ignoreAttributes: false,
      alwaysCreateTextNode: true,
      numberParseOptions: {
        leadingZeros: false,
        hex: false,
      },
      processEntities: true,
      preserveOrder: true,
      trimValues: false,
    };

    const questionParser = new XMLParser(questionParserOptions);
    const olx = typeof olxString === 'string' ? olxString : '';
    const decodedOlx = olx.replaceAll('&#160;', ' ');
    this.tinyQuestionObject = questionParser.parse(decodedOlx);
  }

  parseMultipleChoiceAnswers(problemType, widgetName, option) {
    const answers = [];
    let data = {};
    const widget = _.get(this.problem, `${problemType}.${widgetName}`);
    const choice = _.get(widget, option);
    if (_.isArray(choice)) {
      choice.forEach((element, index) => {
        const title = element['#text'];
        const correct = eval(element['@_correct'].toLowerCase());
        const id = indexToLetterMap[index];
        const feedback = this.getAnswerFeedback(element, `${option}hint`);
        answers.push(
          {
            id,
            title,
            correct,
            ...feedback,
          },
        );
      });
    } else {
      const feedback = this.getAnswerFeedback(choice, `${option}hint`);
      if (choice) {
        answers.push({
          title: choice['#text'],
          correct: eval(choice['@_correct'].toLowerCase()),
          id: indexToLetterMap[answers.length],
          ...feedback,
        });
      }
    }
    data = { answers };
    const groupFeedbackList = this.getGroupedFeedback(widget);
    if (groupFeedbackList.length) {
      data = {
        ...data,
        groupFeedbackList,
      };
    }
    return data;
  }

  getAnswerFeedback(choice, hintKey) {
    let feedback = {};
    let feedbackKeys = 'feedback';
    if (_.has(choice, hintKey)) {
      const answerFeedback = choice[hintKey];
      if (_.isArray(answerFeedback)) {
        answerFeedback.forEach((element) => {
          if (_.has(element, '@_selected')) {
            feedbackKeys = eval(element['@_selected'].toLowerCase()) ? 'selectedFeedback' : 'unselectedFeedback';
          }
          feedback = {
            ...feedback,
            [feedbackKeys]: element['#text'],
          };
        });
      } else {
        if (_.has(answerFeedback, '@_selected')) {
          feedbackKeys = eval(answerFeedback['@_selected'].toLowerCase()) ? 'selectedFeedback' : 'unselectedFeedback';
        }
        feedback = {
          [feedbackKeys]: answerFeedback['#text'],
        };
      }
    }
    return feedback;
  }

  getGroupedFeedback(choices) {
    const groupFeedback = [];
    if (_.has(choices, 'compoundhint')) {
      const groupFeedbackArray = choices.compoundhint;
      if (_.isArray(groupFeedbackArray)) {
        groupFeedbackArray.forEach((element) => {
          groupFeedback.push({
            id: groupFeedback.length,
            answers: element['@_value'].split(' '),
            feedback: element['#text'],
          });
        });
      } else {
        groupFeedback.push({
          id: groupFeedback.length,
          answers: groupFeedbackArray['@_value'].split(' '),
          feedback: groupFeedbackArray['#text'],
        });
      }
    }
    return groupFeedback;
  }

  parseStringResponse() {
    const { stringresponse } = this.problem;
    const answers = [];
    let answerFeedback = '';
    let additionalStringAttributes = {};
    let data = {};
    const feedback = this.getFeedback(stringresponse);
    answers.push({
      id: indexToLetterMap[answers.length],
      title: stringresponse['@_answer'],
      correct: true,
      feedback,
    });

    // Parsing additional_answer for string response.
    const additionalAnswer = _.get(stringresponse, 'additional_answer', []);
    if (_.isArray(additionalAnswer)) {
      additionalAnswer.forEach((newAnswer) => {
        answerFeedback = this.getFeedback(newAnswer);
        answers.push({
          id: indexToLetterMap[answers.length],
          title: newAnswer['@_answer'],
          correct: true,
          feedback: answerFeedback,
        });
      });
    } else {
      answerFeedback = this.getFeedback(additionalAnswer);
      answers.push({
        id: indexToLetterMap[answers.length],
        title: additionalAnswer['@_answer'],
        correct: true,
        feedback: answerFeedback,
      });
    }

    // Parsing stringequalhint for string response.
    const stringEqualHint = _.get(stringresponse, 'stringequalhint', []);
    if (_.isArray(stringEqualHint)) {
      stringEqualHint.forEach((newAnswer) => {
        answers.push({
          id: indexToLetterMap[answers.length],
          title: newAnswer['@_answer'],
          correct: false,
          feedback: newAnswer['#text'],
        });
      });
    } else {
      answers.push({
        id: indexToLetterMap[answers.length],
        title: stringEqualHint['@_answer'],
        correct: false,
        feedback: stringEqualHint['#text'],
      });
    }

    // TODO: Support multiple types.
    additionalStringAttributes = {
      type: _.get(stringresponse, '@_type'),
      textline: {
        size: _.get(stringresponse, 'textline.@_size'),
      },
    };

    data = {
      answers,
      additionalStringAttributes,
    };

    return data;
  }

  parseNumericResponse() {
    const { numericalresponse } = this.problem;
    let answers = [];
    let subAnswers = [];
    let data = {};
    // TODO: Find a way to add answers using additional_answers v/s numericalresponse
    if (_.isArray(numericalresponse)) {
      numericalresponse.forEach((numericalAnswer) => {
        subAnswers = this.parseNumericResponseObject(numericalAnswer, answers.length);
        answers = _.concat(answers, subAnswers);
      });
    } else {
      subAnswers = this.parseNumericResponseObject(numericalresponse, answers.length);
      answers = _.concat(answers, subAnswers);
    }

    data = {
      answers,
    };

    return data;
  }

  parseNumericResponseObject(numericalresponse, answerOffset) {
    let answerFeedback = '';
    const answers = [];
    let responseParam = {};
    // TODO: UI needs to be added to support adding tolerence in numeric response.
    const feedback = this.getFeedback(numericalresponse);
    if (_.has(numericalresponse, 'responseparam')) {
      const type = _.get(numericalresponse, 'responseparam.@_type');
      const defaultValue = _.get(numericalresponse, 'responseparam.@_default');
      responseParam = {
        [type]: defaultValue,
      };
    }
    answers.push({
      id: indexToLetterMap[answers.length + answerOffset],
      title: numericalresponse['@_answer'],
      correct: true,
      feedback,
      ...responseParam,
    });

    // Parsing additional_answer for numerical response.
    const additionalAnswer = _.get(numericalresponse, 'additional_answer', []);
    if (_.isArray(additionalAnswer)) {
      additionalAnswer.forEach((newAnswer) => {
        answerFeedback = this.getFeedback(newAnswer);
        answers.push({
          id: indexToLetterMap[answers.length + answerOffset],
          title: newAnswer['@_answer'],
          correct: true,
          feedback: answerFeedback,
        });
      });
    } else {
      answerFeedback = this.getFeedback(additionalAnswer);
      answers.push({
        id: indexToLetterMap[answers.length + answerOffset],
        title: additionalAnswer['@_answer'],
        correct: true,
        feedback: answerFeedback,
      });
    }
    return answers;
  }

  parseQuestions(problemType) {
    if (problemType === ProblemTypeKeys.MULTISELECT
     || problemType === ProblemTypeKeys.DROPDOWN
     || problemType === ProblemTypeKeys.SINGLESELECT
     || problemType === ProblemTypeKeys.TEXTINPUT) {
      const { problem } = this.tinyQuestionObject[0];

      let problemArray = null;
      for (let i = 0; i < problem.length; i++) {
        const element = problem[i];
        if (typeof element === 'object' && problemType in element) {
          problemArray = element[problemType];
          break;
        }
      }

      if (!problemArray) {
        return '';
      }

      const questionArray = [];

      problemArray.forEach(tag => {
        const tagName = Object.keys(tag)[0];
        if (!nonQuestionKeys.includes(tagName)) {
          if (tagName === 'script') {
            throw new Error('Script Tag, reverting to Advanced Editor');
          }
          questionArray.push(tag);
        } else if (responseKeys.includes(tagName)) {
          /* <label> and <description> tags often are both valid olx as siblings or children of response type tags.
           They, however, do belong in the question, so we append them to the question.
          */
          tag[tagName].forEach(subTag => {
            const subTagName = Object.keys(subTag)[0];
            if (subTagName === 'label' || subTagName === 'description') {
              questionArray.push(subTag);
            }
          });
        }
      });

      const richTextBuilderOptions = {
        ignoreAttributes: false,
        numberParseOptions: {
          leadingZeros: false,
          hex: false,
        },
        preserveOrder: true,
        processEntities: false,
      };
      const richTextBuilder = new XMLBuilder(richTextBuilderOptions);
      const questionString = richTextBuilder.build(questionArray);
      return questionString.replace(/<description>/gm, '<em>').replace(/<\/description>/gm, '</em>');
    }

    const builder = new XMLBuilder();
    const problemObject = _.get(this.problem, problemType);
    let questionObject = {};
    /* TODO: How do we uniquely identify the label and description?
      In order to parse label and description, there should be two states
      and settings should be introduced to edit the label and description.
      In turn editing the settings update the state and then it can be added to
      the parsed OLX.
    */
    const tagMap = {
      label: 'bold',
      description: 'em',
    };

    /* Only numerical response has different ways to generate OLX, test with
      numericInputWithFeedbackAndHintsOLXException and numericInputWithFeedbackAndHintsOLX
      shows the different ways the olx can be generated.
    */
    if (_.isArray(problemObject)) {
      questionObject = _.omitBy(problemObject[0], (value, key) => _.includes(nonQuestionKeys, key));
    } else {
      questionObject = _.omitBy(problemObject, (value, key) => _.includes(nonQuestionKeys, key));
    }
    // Check if problem tag itself will have question and descriptions.
    if (_.isEmpty(questionObject)) {
      questionObject = _.omitBy(this.problem, (value, key) => _.includes(nonQuestionKeys, key));
    }
    const serializedQuestion = _.mapKeys(questionObject, (value, key) => _.get(tagMap, key, key));

    const questionString = builder.build(serializedQuestion);
    return questionString;
  }

  getHints() {
    const hintsObject = [];
    if (_.has(this.problem, 'demandhint.hint')) {
      const hint = _.get(this.problem, 'demandhint.hint');
      if (_.isArray(hint)) {
        hint.forEach(element => {
          hintsObject.push({
            id: hintsObject.length,
            value: element['#text'],
          });
        });
      } else {
        hintsObject.push({
          id: hintsObject.length,
          value: hint['#text'],
        });
      }
    }
    return hintsObject;
  }

  getFeedback(xmlElement) {
    return _.has(xmlElement, 'correcthint') ? _.get(xmlElement, 'correcthint.#text') : '';
  }

  getProblemType() {
    const problemKeys = Object.keys(this.problem);
    const intersectedProblems = _.intersection(Object.values(ProblemTypeKeys), problemKeys);

    if (intersectedProblems.length === 0) {
      return null;
    }
    if (intersectedProblems.length > 1) {
      return ProblemTypeKeys.ADVANCED;
    }
    const problemType = intersectedProblems[0];
    return problemType;
  }

  getParsedOLXData() {
    if (_.isEmpty(this.problem)) {
      return {};
    }
    let answersObject = {};
    let additionalAttributes = {};
    let groupFeedbackList = [];
    const problemType = this.getProblemType();
    const hints = this.getHints();
    const question = this.parseQuestions(problemType);
    switch (problemType) {
      case ProblemTypeKeys.DROPDOWN:
        answersObject = this.parseMultipleChoiceAnswers(ProblemTypeKeys.DROPDOWN, 'optioninput', 'option');
        break;
      case ProblemTypeKeys.TEXTINPUT:
        answersObject = this.parseStringResponse();
        break;
      case ProblemTypeKeys.NUMERIC:
        answersObject = this.parseNumericResponse();
        break;
      case ProblemTypeKeys.MULTISELECT:
        answersObject = this.parseMultipleChoiceAnswers(ProblemTypeKeys.MULTISELECT, 'checkboxgroup', 'choice');
        break;
      case ProblemTypeKeys.SINGLESELECT:
        answersObject = this.parseMultipleChoiceAnswers(ProblemTypeKeys.SINGLESELECT, 'choicegroup', 'choice');
        break;
      case ProblemTypeKeys.ADVANCED:
        break;
      default:
        // if problem is unset, return null
        return {};
    }

    if (_.has(answersObject, 'additionalStringAttributes')) {
      additionalAttributes = { ...answersObject.additionalStringAttributes };
    }

    if (_.has(answersObject, 'groupFeedbackList')) {
      groupFeedbackList = answersObject.groupFeedbackList;
    }
    const { answers } = answersObject;
    const settings = { hints };
    return {
      question,
      settings,
      answers,
      problemType,
      additionalAttributes,
      groupFeedbackList,
    };
  }
}
