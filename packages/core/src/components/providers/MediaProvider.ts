import { ComponentInterface } from '@stencil/core';

/**
 * The interface all providers must implement to ensure a consistent API and compatibility with
 * the Vime ecosystem.
 *
 * @ref https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
 */
export interface MediaProvider extends ComponentInterface {
  /**
   * Whether media playback is paused. Defaults to `true` if no media has loaded or playback
   * has not started. Setting this value toggles playback.
   */
  paused: boolean

  /**
   * READONLY: Whether media playback is progressing. Defaults to `false` if no media has loaded
   * or playback has not started.
   */
  playing: boolean

  /**
   * READONLY: A double-precision floating-point value indicating the total playback length of the
   * media in seconds. Defaults to `-1` if no media has been loaded.
   */
  duration: number

  /**
   * READONLY: The title of the current media. Defaults to an empty string if no media has been
   * loaded.
   */
  mediaTitle: string

  /**
   * READONLY: The absolute URL of the media resource that has been chosen.
   */
  currentSrc: string

  /**
   * A double-precision floating-point value indicating the current playback time in seconds; if
   * the media has not started to play and has not been seeked, this value is the media's initial
   * playback time. Setting this value seeks the media to the new time. The value can be set to
   * a minimum of 0 and maximum of the total length of the media (indicated by the duration prop).
   */
  currentTime: number

  /**
   *
   */
  playbackReady: number

  /**
   * Controls whether playback should automatically begin.
   */
  autoplay: boolean

  /**
   * props -> loop + muted + buffered + playbackRate/s + mediaQuality/s, seeking, playbackStarted
   * playbackEnded + buffering + isLive + controls (boolean) + error + playerState + seekable
   * + textTracks + currentTrack + volume + isFullscreenActive, aspectRatio, mediaType, isAudio,
   * isVideo isLive (include in mediatype?) + currentCue (.isActive etc.) + isTextTracksAvailable,
   * isPiPActive + autopause + playsinline, language
   *
   * make paused readonly.
   */

  // method -> getInternalPlayer() + play() + pause() + canPlayType(), requestFullscreen(),
  // exitFullscreen(), requestPiP(), exitPiP(), canAutoplay, canMutedAutoplay(),
  // isFullscreenAvailable isPiPAvailable, addLanguage(code, translations)

  /**
   * events -> play, pause, seeking, seeked, buffering (can fire automatically from store),
   * durationchange, timeupdate, playbackStarted, playbackEnded, buffered, error, loadstart,
   * loadedmetadata, playing, progress, ratechange, qualitychange, volumechange, trackchange?,
   * statechange, mediatypechange, cuechange
   */
}
