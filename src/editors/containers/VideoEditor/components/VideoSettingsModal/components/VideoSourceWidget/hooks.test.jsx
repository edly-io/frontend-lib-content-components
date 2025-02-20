import { dispatch } from 'react-redux';
import { actions } from '../../../../../../data/redux';
import * as hooks from './hooks';

jest.mock('react-redux', () => {
  const dispatchFn = jest.fn();
  return {
    ...jest.requireActual('react-redux'),
    dispatch: dispatchFn,
    useDispatch: jest.fn(() => dispatchFn),
  };
});

jest.mock('../../../../../../data/redux', () => ({
  actions: {
    video: {
      updateField: jest.fn(),
    },
  },
}));

describe('VideoEditorHandout hooks', () => {
  describe('updateVideoId', () => {
    const sourceEdxVideo = {
      onBlur: jest.fn(),
      local: '06b15030-7df0-4e70-b979-326e02dbcbe0',
    };
    const sourceYouTube = {
      onBlur: jest.fn(),
      local: 'youtu.be',
    };
    const sourceHtml5Source = {
      onBlur: jest.fn(),
      local: 'sOMEranDomfILe.mp4',
    };
    const mockState = {
      videoId: '',
      videoSource: '',
      allowVideoDownloads: false,
      thumbnail: null,
      transcripts: [],
      allowTranscriptDownloads: false,
      showTranscriptByDefault: false,
      duration: {
        startTime: '00:00:00',
        stopTime: '00:00:00',
        total: '00:00:00',
      },
      licenseType: null,
    };
    it('returns dispatches updateField action with default state and edxVideo Id', () => {
      hooks.updateVideoId({ dispatch })({ e: { target: { value: sourceEdxVideo.local } }, source: sourceEdxVideo });
      expect(dispatch).toHaveBeenCalledWith(
        actions.video.updateField({
          ...mockState,
          videoId: sourceEdxVideo.local,
        }),
      );
    });
    it('returns dispatches updateField action with default state and YouTube video', () => {
      hooks.updateVideoId({ dispatch })({
        e: { target: { value: sourceYouTube.local } },
        source: sourceYouTube,
      });
      expect(dispatch).toHaveBeenCalledWith(
        actions.video.updateField({
          ...mockState,
        }),
      );
    });
    it('returns dispatches updateField action with default state and html5source video', () => {
      hooks.updateVideoId({ dispatch })({
        e: { target: { value: sourceHtml5Source.local } },
        source: sourceHtml5Source,
      });
      expect(dispatch).toHaveBeenCalledWith(
        actions.video.updateField({
          ...mockState,
        }),
      );
    });
  });

  describe('deleteFallbackVideo', () => {
    const videoUrl = 'sOmERAndoMuRl1';
    const fallbackVideos = ['sOmERAndoMuRl1', 'sOmERAndoMuRl2', 'sOmERAndoMuRl1', ''];
    const updatedFallbackVideos = ['sOmERAndoMuRl2', 'sOmERAndoMuRl1', ''];
    it('returns dispatches updateField action with updatedFallbackVideos', () => {
      hooks.deleteFallbackVideo({ fallbackVideos, dispatch })(videoUrl);
      expect(dispatch).toHaveBeenCalledWith(
        actions.video.updateField({
          fallbackVideos: updatedFallbackVideos,
        }),
      );
    });
  });
});
