import { useEffect, useRef, useState } from 'react';
import axios from '../axios.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';

import useAudioRecorder from '../hooks/useAudioRecorder.js';
import style from './main.module.scss';

const Main = () => {
  const [userText, setUserText] = useState();
  const [checkedMessage, setCheckedMessage] = useState();
  const [recordStatus, setRecordStatus] = useState(false);
  let audioRecorder = useRef();

  useEffect(() => {
    audioRecorder.current = useAudioRecorder();
  }, []);

  //Text form hendler
  const handleSubmit = (event) => {
    event.preventDefault();
    const inputText = event.target[1].value;

    if (inputText == '') {
      return;
    }

    event.target[1].value = '';

    setUserText(inputText);

    axios.post('correctMessage', { message: inputText }).then((res) => {
      setCheckedMessage(res.data.message);
    });
  };

  //Handle record events
  const toggleRecord = () => {
    if (!recordStatus) {
      setRecordStatus((state) => !state);
      audioRecorder.current.start().then(() => {
        console.log('audio recording ...');
      });
    } else {
      setRecordStatus((state) => !state);
      audioRecorder.current
        .stop()
        .then((audioBlob) => {
          if (audioBlob.size != 0 || audioBlob.size > 10000) {
            const blobData = new FormData();
            blobData.append('audio', audioBlob);

            axios
              .post('transcript', blobData, { 'Content-type': 'multipart/form-data' })
              .then((data) => {
                setCheckedMessage(data.data.message);
              });
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className={style.main}>
      <div className={style.main__container}>
        <div className={style.main__container__textDisplay}>
          <div className={style.main__container__textDisplay__message}>
            <div className={style.main__container__textDisplay__message__correct}>
              <span>The corrected version: </span>
              {checkedMessage}
            </div>
            <div className={style.main__container__textDisplay__message__userText}>
              <span>Your version: </span>
              {userText}
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <button type='button' className={style.inputVoiceRecord} onClick={toggleRecord}>
            {recordStatus ? 'Stop Record' : 'Start Record'}
          </button>
          <div className={style.inputForm}>
            <input type='text' placeholder='Type your message' />
            <button>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Main;
