import Header from '../components/header';
import Main from '../components/main';
import Navigation from '../components/navigation';

const MainPage = () => {
  return (
    <>
      <Navigation />
      <div className='main__container'>
        <Header />
        <Main />
      </div>
    </>
  );
};

export default MainPage;
