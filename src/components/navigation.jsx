import style from './navigation.module.scss';

const Navigation = () => {
  return (
    <div className={style.navigation}>
      <div className={style.navigation__container}>
        <nav>
          <ul>
            <li id='#logo'>SpeechGrammar</li>
            <li>Settings</li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
