import { Route, Routes } from 'react-router-dom';

import MainPage from './pages/main';
import './App.scss';

function App() {
  return (
    <div className='app__container'>
      <Routes>
        <Route path='/' element={<MainPage />} />
      </Routes>
    </div>
  );
}

export default App;
