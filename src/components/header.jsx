import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';

import style from './header.module.scss';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className={style.header}>
      <div className={style.header__container}>
        <Link to='/' className={style.header__container__item}>
          <span className={style.header__container__item__logo}>SpeechGrammar</span>
        </Link>
        <Link to='/' className={style.header__container__item}>
          <span className={style.header__container__item__text}>Some user</span>

          <span className={style.header__container__item__icon}>
            <FontAwesomeIcon icon={faUser} />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Header;
