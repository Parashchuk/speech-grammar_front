import { useState } from 'react';
import axios from '../axios.js';

import style from './main.module.scss';

const Main = () => {
  const [userText, setUserText] = useState();
  const [checkedMessage, setCheckedMessage] = useState();

  const handleSubmit = (event) => {
    event.preventDefault();
    const inputText = event.target[0].value;
    event.target[0].value = '';

    setUserText(inputText);

    axios.post('correctMessage', { message: inputText }).then((res) => {
      setCheckedMessage(res.data.message);
    });
  };

  return (
    <div className={style.main}>
      <div className={style.main__container}>
        <div className={style.main__container__textDisplay}>
          <div className={style.main__container__textDisplay__correct}>
            <span>The corrected version:</span> {checkedMessage}
          </div>
          <div className={style.main__container__textDisplay__userText}>
            <span>Your version:</span> {userText}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <input type='text' />
        </form>
      </div>
    </div>
  );
};

export default Main;
