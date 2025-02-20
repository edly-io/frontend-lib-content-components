import _ from 'lodash-es';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { ProblemTypeKeys } from '../../../data/constants/problem';

class ReactStateOLXParser {
  constructor(problemState) {
    const parserOptions = {
      ignoreAttributes: false,
      alwaysCreateTextNode: true,
      // preserveOrder: true,
    };
    const builderOptions = {
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      suppressBooleanAttributes: false,
      format: true,
    };
    const questionParserOptions = {
      ignoreAttributes: false,
      alwaysCreateTextNode: true,
      numberParseOptions: {
        leadingZeros: false,
        hex: false,
      },
      preserveOrder: true,
      trimValues: false,
    };
    const questionBuilderOptions = {
      ignoreAttributes: false,
      alwaysCreateTextNode: true,
      attributeNamePrefix: '@_',
      suppressBooleanAttributes: false,
      format: true,
      numberParseOptions: {
        leadingZeros: false,
        hex: false,
      },
      preserveOrder: true,
      trimValues: false,
    };
    this.parser = new XMLParser(parserOptions);
    this.builder = new XMLBuilder(builderOptions);
    this.questionParser = new XMLParser(questionParserOptions);
    this.questionBuilder = new XMLBuilder(questionBuilderOptions);
    this.problemState = problemState.problem;
  }

  addHints() {
    const hintsArray = [];
    const hints = _.get(this.problemState, 'settings.hints', []);
    hints.forEach(element => {
      hintsArray.push({
        '#text': element.value,
      });
    });
    const demandhint = {
      demandhint: {
        hint: hintsArray,
      },
    };
    return demandhint;
  }

  addMultiSelectAnswers(option) {
    const choice = [];
    let compoundhint = [];
    let widget = {};
    const { answers } = this.problemState;
    answers.forEach((answer) => {
      const feedback = [];
      let singleAnswer = {};
      if (this.hasAttributeWithValue(answer, 'title')) {
        if (this.hasAttributeWithValue(answer, 'selectedFeedback')) {
          feedback.push({
            '#text': _.get(answer, 'selectedFeedback'),
            '@_selected': true,
          });
        }
        if (this.hasAttributeWithValue(answer, 'unselectedFeedback')) {
          feedback.push({
            '#text': _.get(answer, 'unselectedFeedback'),
            '@_selected': false,
          });
        }
        if (this.hasAttributeWithValue(answer, 'feedback')) {
          feedback.push({
            '#text': _.get(answer, 'feedback'),
          });
        }
        if (feedback.length) {
          singleAnswer[`${option}hint`] = feedback;
        }
        singleAnswer = {
          '#text': answer.title,
          '@_correct': answer.correct,
          ...singleAnswer,
        };
        choice.push(singleAnswer);
      }
    });
    widget = { [option]: choice };
    if (_.has(this.problemState, 'groupFeedbackList')) {
      compoundhint = this.addGroupFeedbackList();
      widget = {
        ...widget,
        compoundhint,
      };
    }
    return widget;
  }

  addGroupFeedbackList() {
    const compoundhint = [];
    const { groupFeedbackList } = this.problemState;
    groupFeedbackList.forEach((element) => {
      compoundhint.push({
        '#text': element.feedback,
        '@_value': element.answers.join(' '),
      });
    });
    return compoundhint;
  }

  addQuestion() {
    const { question } = this.problemState;
    const questionObject = this.questionParser.parse(question);

    /* Removes block tags like <p> or <h1> that surround the <label> format.
      Block tags are required by tinyMCE but have adverse effect on css in studio.
      */
    questionObject.forEach((tag, ind) => {
      const tagName = Object.keys(tag)[0];
      let label = null;
      tag[tagName].forEach(subTag => {
        const subTagName = Object.keys(subTag)[0];
        if (subTagName === 'label') {
          label = subTag;
        }
      });
      if (label) {
        questionObject[ind] = label;
      }
    });

    return questionObject;
  }

  buildMultiSelectProblem(problemType, widget, option) {
    const question = this.addQuestion();
    const widgetObject = this.addMultiSelectAnswers(option);
    const demandhint = this.addHints();
    const problemObject = {
      problem: {
        [problemType]: {
          [widget]: widgetObject,
        },
        ...demandhint,
      },
    };

    const problemString = this.builder.build(problemObject);
    const questionString = this.questionBuilder.build(question);

    const questionIndex = problemString.indexOf(`<${problemType}>`) + problemType.length + 2;
    const updatedProblemString = `${problemString.slice(0, questionIndex)}\n${questionString}\n${problemString.slice(questionIndex + 1)}`;

    return updatedProblemString;
  }

  buildTextInput() {
    const question = this.addQuestion();
    const demandhint = this.addHints();
    const answerObject = this.buildTextInputAnswersFeedback();
    const problemObject = {
      problem: {
        [ProblemTypeKeys.TEXTINPUT]: {
          ...answerObject,
        },
        ...demandhint,
      },
    };

    const problemString = this.builder.build(problemObject);
    const questionString = this.questionBuilder.build(question);

    const re = new RegExp(`<${ProblemTypeKeys.TEXTINPUT}.*>`);
    const res = problemString.match(re);
    const questionIndex = res.index + res[0].length + 1;
    const updatedProblemString = `${problemString.slice(0, questionIndex)}\n${questionString.trim()}\n${problemString.slice(questionIndex + 1)}`;

    return updatedProblemString;
  }

  buildTextInputAnswersFeedback() {
    const { answers } = this.problemState;
    let answerObject = {};
    const additionAnswers = [];
    const wrongAnswers = [];
    let firstCorrectAnswerParsed = false;
    answers.forEach((answer) => {
      const correcthint = this.getAnswerHints(answer);
      if (this.hasAttributeWithValue(answer, 'title')) {
        if (answer.correct && firstCorrectAnswerParsed) {
          additionAnswers.push({
            '@_answer': answer.title,
            ...correcthint,
          });
        } else if (answer.correct && !firstCorrectAnswerParsed) {
          firstCorrectAnswerParsed = true;
          answerObject = {
            '@_answer': answer.title,
            ...correcthint,
          };
        } else if (!answer.correct) {
          wrongAnswers.push({
            '@_answer': answer.title,
            '#text': answer.feedback,
          });
        }
      }
    });
    answerObject = {
      ...answerObject,
      additional_answer: additionAnswers,
      stringequalhint: wrongAnswers,
      '@_type': _.get(this.problemState, 'additionalAttributes.type', 'ci'),
      textline: {
        '@_size': _.get(this.problemState, 'additionalAttributes.textline.size', 20),
      },
    };
    return answerObject;
  }

  buildNumericInput() {
    const question = this.addQuestion();
    const demandhint = this.addHints();
    const answerObject = this.buildNumericalResponse();
    const problemObject = {
      problem: {
        ...question,
        [ProblemTypeKeys.NUMERIC]: answerObject,
        ...demandhint,
      },
    };
    return this.builder.build(problemObject);
  }

  buildNumericalResponse() {
    const { answers } = this.problemState;
    let answerObject = {};
    const additionalAnswers = [];
    let firstCorrectAnswerParsed = false;
    /*
    TODO: Need to figure out how to add multiple numericalresponse,
    the parser right now converts all the other right answers into
    additional answers.
    */
    answers.forEach((answer) => {
      const correcthint = this.getAnswerHints(answer);
      if (this.hasAttributeWithValue(answer, 'title')) {
        if (answer.correct && !firstCorrectAnswerParsed) {
          firstCorrectAnswerParsed = true;
          let responseParam = {};
          if (_.has(answer, 'tolerance')) {
            responseParam = {
              responseparam: {
                '@_type': 'tolerance',
                '@_default': _.get(answer, 'tolerance', 0),
              },
            };
          }
          answerObject = {
            '@_answer': answer.title,
            ...responseParam,
            ...correcthint,
          };
        } else if (answer.correct && firstCorrectAnswerParsed) {
          additionalAnswers.push({
            '@_answer': answer.title,
            ...correcthint,
          });
        }
      }
    });
    answerObject = {
      ...answerObject,
      additional_answer: additionalAnswers,
      formulaequationinput: {
        '#text': '',
      },
    };
    return answerObject;
  }

  getAnswerHints(elementObject) {
    const feedback = elementObject?.feedback;
    let correcthint = {};
    if (feedback !== undefined && feedback !== '') {
      correcthint = {
        correcthint: {
          '#text': feedback,
        },
      };
    }
    return correcthint;
  }

  hasAttributeWithValue(obj, attr) {
    const objAttr = _.has(obj, attr) && _.get(obj, attr, '');
    return objAttr && objAttr.toString().trim() !== '';
  }

  buildOLX() {
    const { problemType } = this.problemState;
    let problemString = '';
    switch (problemType) {
      case ProblemTypeKeys.MULTISELECT:
        problemString = this.buildMultiSelectProblem(ProblemTypeKeys.MULTISELECT, 'checkboxgroup', 'choice');
        break;
      case ProblemTypeKeys.DROPDOWN:
        problemString = this.buildMultiSelectProblem(ProblemTypeKeys.DROPDOWN, 'optioninput', 'option');
        break;
      case ProblemTypeKeys.SINGLESELECT:
        problemString = this.buildMultiSelectProblem(ProblemTypeKeys.SINGLESELECT, 'choicegroup', 'choice');
        break;
      case ProblemTypeKeys.TEXTINPUT:
        problemString = this.buildTextInput();
        break;
      case ProblemTypeKeys.NUMERIC:
        problemString = this.buildNumericInput();
        break;
      default:
        break;
    }
    return problemString;
  }
}

export default ReactStateOLXParser;
