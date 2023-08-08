import { useEffect, useRef, useState } from 'react';
import axios from '../axios.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';

import useAudioRecorder from '../hooks/useAudioRecorder.js';
import style from './main.module.scss';

const Main = () => {
  const [messageHistory, setMessageHistory] = useState([]);
  const [recordStatus, setRecordStatus] = useState(false);
  let audioRecorder = useRef();

  useEffect(() => {
    audioRecorder.current = useAudioRecorder();
  }, []);

  //Text form hendler
  const handleSubmit = (event) => {
    event.preventDefault();
    const inputText = event.target[1].value;

    if (inputText != '') {
      event.target[1].value = '';

      axios.post('correctMessage', { message: inputText }).then((res) => {
        setMessageHistory((state) => {
          return [
            ...state,
            { userMessage: inputText, correctedMessage: res.data.correctedMessage },
          ];
        });
      });
    }

    //Add edgeCase !!!!!!!!!!
  };

  //Handle record events
  const toggleRecord = () => {
    if (!recordStatus) {
      setRecordStatus((state) => !state);
      audioRecorder.current.start();
    } else {
      setRecordStatus((state) => !state);

      audioRecorder.current
        .stop()
        .then((audioBlob) => {
          //If audio recording was longer then 1 second
          if (audioBlob.size > 10000) {
            //Create form data object to store audio blob
            const blobData = new FormData();
            blobData.append('audio', audioBlob);

            axios
              .post('transcript', blobData, { 'Content-type': 'multipart/form-data' })
              .then((res) => {
                setMessageHistory((state) => {
                  return [
                    ...state,
                    {
                      userMessage: res.userMessage,
                      correctedMessage: res.data.correctedMessage,
                    },
                  ];
                });
              });
          }
        })
        .catch((err) => console.log(err));
    }
  };

  //Functio to create template message
  const createMessage = () => {
    return messageHistory.map((item, id) => {
      return (
        <div key={id} className={style.main__container__textDisplay__message}>
          <div className={style.main__container__textDisplay__message__correct}>
            <span>We transcripted your voice into text: </span>
            {item.userMessage}
          </div>
          <div className={style.main__container__textDisplay__message__userText}>
            <span>{item.correctedMessage == '' ? 'You made no errors' : 'Errors we find:'}</span>
            {item.correctedMessage}
          </div>
        </div>
      );
    });
  };

  const textAreaResize = (e) => {
    const element = e.target;

    element.style.overflowY = element.offsetHeight < 200 ? 'hidden' : 'scroll';
    element.style.height = '1px';

    element.style.height = 0 + element.scrollHeight + 'px';
  };

  return (
    <div className={style.main}>
      <div className={style.main__container}>
        <div className={style.main__container__textDisplay}>{createMessage()}</div>
        <form onSubmit={handleSubmit}>
          <button
            type='button'
            className={
              style.inputVoiceRecord + ' ' + (recordStatus ? style.inputVoiceRecord_active : '')
            }
            onClick={toggleRecord}>
            {recordStatus ? 'Stop Record' : 'Start Record'}
          </button>
          <div className={style.inputForm}>
            <textarea
              data-gramm='false'
              onKeyDown={textAreaResize}
              type='text'
              placeholder='Type your message'
            />
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
