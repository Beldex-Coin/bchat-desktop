import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

import { BchatIcon, BchatIconButton } from '../icon';
import autoBind from 'auto-bind';
import MicRecorder from 'mic-recorder-to-mp3';
import styled from 'styled-components';
import { Constants } from '../../bchat';
import { ToastUtils } from '../../bchat/utils';
import { DEFAULT_MIN_AUDIO_MEMORY_SIZE, MAX_ATTACHMENT_FILESIZE_BYTES } from '../../bchat/constants';
import { SendMessageButton } from './composition/CompositionButtons';
import StopIcon from '../icon/StopIcon';
import { CustomIconButton } from '../icon/CustomIconButton';

interface Props {
  onExitVoiceNoteView: () => void;
  onLoadVoiceNoteView: () => void;
  sendVoiceMessage: (audioBlob: Blob) => Promise<void>;
}

interface State {
  recordDuration: number;
  isRecording: boolean;
  isPlaying: boolean;
  isPaused: boolean;

  actionHover: boolean;
  startTimestamp: number;
  nowTimestamp: number;
}

function getTimestamp() {
  return Date.now() / 1000;
}

// interface StyledFlexWrapperProps {
//   marginHorizontal: string;
// }

/**
 * Generic wrapper for quickly passing in theme constant values.
 */
const StyledFlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  // width:100%;
  justify-content: space-between;
  width: 65px;
  .bchat-icon-button{
    border-radius:30px;
  }
  
  }
`;

export class BchatRecording extends React.Component<Props, State> {
  private recorder?: any;
  private audioBlobMp3?: Blob;
  private audioElement?: HTMLAudioElement | null;
  private updateTimerInterval?: NodeJS.Timeout;
  private recordingRef:any; 
  constructor(props: Props) {
    super(props);
    autoBind(this);
    const now = getTimestamp();

    this.state = {
      recordDuration: 0,
      isRecording: true,
      isPlaying: false,
      isPaused: false,
      actionHover: false,
      startTimestamp: now,
      nowTimestamp: now,
    };
    this.recordingRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  public componentDidMount() {
    // This turns on the microphone on the system. Later we need to turn it off.
    document.addEventListener("mousedown", this.handleClickOutside);
    void this.initiateRecordingStream();
    // Callback to parent on load complete

    if (this.props.onLoadVoiceNoteView) {
      this.props.onLoadVoiceNoteView();
    }
    this.updateTimerInterval = global.setInterval(this.timerUpdate, 500);
  }

  public componentWillUnmount() {
    if (this.updateTimerInterval) {
      clearInterval(this.updateTimerInterval);
    }
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  public handleClickOutside(event: MouseEvent) {
    if (this.recordingRef.current && !this.recordingRef.current.contains(event.target as Node)) {
      this.stopRecordingStream()
    }
  }
  // tslint:disable-next-line: cyclomatic-complexity
  public render() {
    const { isPlaying, isPaused, isRecording, startTimestamp, nowTimestamp } = this.state;

    const hasRecordingAndPaused = !isRecording && !isPlaying;
    const hasRecording = !!this.audioElement?.duration && this.audioElement?.duration > 0;
    const actionPauseAudio = !isRecording && !isPaused && isPlaying;
    const actionDefault = !isRecording && !hasRecordingAndPaused && !actionPauseAudio;

    // if we are recording, we base the time recording on our state values
    // if we are playing ( audioElement?.currentTime is !== 0, use that instead)
    // if we are not playing but we have an audioElement, display its duration
    // otherwise display 0
    const displayTimeMs = isRecording
      ? (nowTimestamp - startTimestamp) * 1000
      : (this.audioElement &&
        (this.audioElement?.currentTime * 1000 || this.audioElement?.duration)) ||
      0;

    const displayTimeString = moment.utc(displayTimeMs).format('m:ss');
    const recordingDurationMs = this.audioElement?.duration
      ? this.audioElement?.duration * 1000
      : 1;

    let remainingTimeString = '';
    if (recordingDurationMs !== undefined) {
      remainingTimeString = ` / ${moment.utc(recordingDurationMs).format('m:ss')}`;
    }

    const actionPauseFn = isPlaying ? this.pauseAudio : this.stopRecordingStream;

    return (
      <div role="main" className="bchat-recording" tabIndex={0} onKeyDown={this.onKeyDown} ref={this.recordingRef}>
        <div className="bchat-recording-box">

          {hasRecording && !isRecording ? (
            <div className={classNames('bchat-recording--timer', !isRecording && 'playback-timer')}>
              <div className='bchat-recording--timer-micIcon'>
                <BchatIcon
                  iconType="recordMicrophone"
                  iconSize={20}
                // onClick={actionPauseFn}
                // iconColor="#277AFB"
                />
              </div>
              {displayTimeString + remainingTimeString}
            </div>
          ) : null}

          <div>
             { isRecording ? (
              <div className={classNames('bchat-recording--timer')}>
                <div className="bchat-recording--timer-wrapper">
                  <div className="bchat-recording--timer-light" />
                </div>
                {displayTimeString}
              </div>
            ) : null}
          </div>
          <div className="bchat-recording--actions">
            <StyledFlexWrapper>
              {actionPauseAudio  && hasRecording && (
                <BchatIconButton
                  iconType="pause"
                  iconSize="medium"
                  onClick={actionPauseFn}
                  iconColor="#277AFB"
                />
              )}
              {hasRecordingAndPaused &&  (
                <BchatIconButton
                  iconType="play"
                  iconSize={14}
                  onClick={()=>hasRecording && this.playAudio()}
                  iconColor="#F0F0F0"
                  btnBgColor="#108D32"
                  padding="8px"
                />
              )}  
              {!isRecording  && (
                <BchatIconButton
                  iconType="delete"
                  iconSize="medium"
                  onClick={this.onDeleteVoiceMessage}
                  iconColor="#F0F0F0"
                  btnBgColor="#FF3E3E"
                  padding="5px"
                />
              )}
            </StyledFlexWrapper>

            {actionDefault && <BchatIconButton iconType="microphone" iconSize={'huge'} />}
          </div>
          {isRecording && (
            // <BchatIconButton
            //   iconType="stop"
            //   iconSize="medium"
            //   iconColor={'#FF4538'}
            //   onClick={actionPauseFn}
            // />
            <CustomIconButton customIcon={<StopIcon iconSize={30} />} onClick={actionPauseFn} />
          )}
        </div>
        <div className={classNames('send-message-button',!hasRecording && !isRecording && 'delete-button' )}>
          {!isRecording && hasRecording && (
            <SendMessageButton name="Send" onClick={this.onSendVoiceMessage} />
          ) 
          // : (
          //   <SendMessageButton name="Send" onClick={() => { }}  />
          // )
          }
        </div>
      </div>
    );
  }

  private async timerUpdate() {
    const { nowTimestamp, startTimestamp } = this.state;
    const elapsedTime = nowTimestamp - startTimestamp;

    // Prevent voice messages exceeding max length.
    if (elapsedTime >= Constants.CONVERSATION.MAX_VOICE_MESSAGE_DURATION) {
      await this.stopRecordingStream();
    }

    this.setState({
      nowTimestamp: getTimestamp(),
    });
  }

  private stopRecordingState() {
    this.setState({
      isRecording: false,
      isPaused: true,
    });
  }

  private async playAudio() {
    // Generate audio element if it doesn't exist
    const { recordDuration } = this.state;

    if (!this.audioBlobMp3) {
      return;
    }

    if (this.audioElement) {
      window?.log?.info('Audio element already init');
    } else {
      const audioURL = window.URL.createObjectURL(this.audioBlobMp3);
      this.audioElement = new Audio(audioURL);

      this.audioElement.loop = false;
      this.audioElement.onended = () => {
        this.pauseAudio();
      };

      this.audioElement.oncanplaythrough = async () => {
        const duration = recordDuration;

        if (duration && this.audioElement && this.audioElement.currentTime < duration) {
          await this.audioElement?.play();
        }
      };
    }

    this.setState({
      isRecording: false,
      isPaused: false,
      isPlaying: true,
    });

    await this.audioElement.play();
  }

  private pauseAudio() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.setState({
      isPlaying: false,
      isPaused: true,
    });
  }

  private async onDeleteVoiceMessage() {
    this.pauseAudio();
    await this.stopRecordingStream();
    this.audioBlobMp3 = undefined;
    this.audioElement = null;
    this.props.onExitVoiceNoteView();
  }

  /**
   * Sends the recorded voice message
   */
  private async onSendVoiceMessage() {
    if (!this.audioBlobMp3 || !this.audioBlobMp3.size) {
      window?.log?.info('Empty audio blob');
      return;
    }
  
    // Is the audio file > attachment filesize limit
    if (this.audioBlobMp3.size > MAX_ATTACHMENT_FILESIZE_BYTES) {
      ToastUtils.pushFileSizeErrorAsByte(MAX_ATTACHMENT_FILESIZE_BYTES);
      return;
    }

    void this.props.sendVoiceMessage(this.audioBlobMp3);
  }

  private async initiateRecordingStream() {
    // Start recording. Browser will request permission to use your microphone.
    if (this.recorder) {
      await this.stopRecordingStream();
    }

    this.recorder = new MicRecorder({
      bitRate: 128,
    });
    this.recorder
      .start()
      .then(() => {
        // something else
      })
      .catch((e: any) => {
        window?.log?.error(e);
      });
  }

  /**
   * Stops recording audio, sets recording state to stopped.
   */
  private async stopRecordingStream() {
    if (!this.recorder) {
      return;
    }
    const [_, blob] = await this.recorder.stop().getMp3();
    this.recorder = undefined;

  // Get the audio duration to validate length
  const audioURL = window.URL.createObjectURL(blob);
  const validAudio = new Audio(audioURL);

  if(blob.size<DEFAULT_MIN_AUDIO_MEMORY_SIZE)
  {
    await this.onDeleteVoiceMessage();
    return;
  }
  validAudio.onloadedmetadata = async () => {
    if (validAudio.duration < 1) {
      // Less than 1 second - discard
      await this.onDeleteVoiceMessage();
      return;
    }
  }

    this.audioBlobMp3 = blob;
    this.updateAudioElementAndDuration();

    // Stop recording
    this.stopRecordingState();
  }

  /**
   * Creates an audio element using the recorded audio blob.
   * Updates the duration for displaying audio duration.
   */
  private updateAudioElementAndDuration() {
    // init audio element
    if (!this.audioBlobMp3) {
      return;
    }
    const audioURL = window.URL.createObjectURL(this.audioBlobMp3);
    this.audioElement = new Audio(audioURL);

    this.setState({
      recordDuration: this.audioElement.duration,
    });

    this.audioElement.loop = false;
    this.audioElement.onended = () => {
      this.pauseAudio();
    };

    this.audioElement.oncanplaythrough = async () => {
      const duration = this.state.recordDuration;

      if (duration && this.audioElement && this.audioElement.currentTime < duration) {
        await this.audioElement?.play();
      }
    };
  }

  private async onKeyDown(event: any) {
    if (event.key === 'Escape') {
      await this.onDeleteVoiceMessage();
    }
  }
}
