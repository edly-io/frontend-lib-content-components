import { createSlice } from '@reduxjs/toolkit';

import { StrictDict } from '../../../utils';

const initialState = {
  videoSource: '',
  videoId: '',
  fallbackVideos: [
    '',
    '',
  ],
  allowVideoDownloads: false,
  thumbnail: null,
  transcripts: [],
  allowTranscriptDownloads: false,
  duration: {
    startTime: '00:00:00',
    stopTime: '00:00:00',
    total: '00:00:00',
  },
  showTranscriptByDefault: false,
  handout: null,
  licenseType: null,
  licenseDetails: {
    attribution: true,
    noncommercial: false,
    noDerivatives: false,
    shareAlike: false,
  },
  courseLicenseType: null,
  courseLicenseDetails: {
    attribution: true,
    noncommercial: false,
    noDerivatives: false,
    shareAlike: false,
  },
  allowThumbnailUpload: null,
};

// eslint-disable-next-line no-unused-vars
const video = createSlice({
  name: 'video',
  initialState,
  reducers: {
    updateField: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
    load: (state, { payload }) => ({
      ...payload,
    }),
    resetVideo: (state) => ({
      ...state, ...initialState,
    }),
  },
});

const actions = StrictDict(video.actions);

const { reducer } = video;

export {
  actions,
  initialState,
  reducer,
};
