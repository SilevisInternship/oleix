import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './views/Home/Home';
import NoMatch from './views/NoMatch/NoMatch';
import Advert from './views/Advert/Advert';
import NewAdvert from './views/NewAdvert/NewAdvert';
import Login from './views/Login/Login';
import Register from './views/Register/Register';
import MyAdverts from './views/MyAdverts/MyAdverts';
import AuthEmail from './views/AuthEmail/AuthEmail';
import EditAdvert from './views/EditAdvert/EditAdvert';

const App = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Navigate to="/adverts" replace={true} />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="authorize/email/:id" element={<AuthEmail />} />
      <Route path="adverts">
        <Route index element={<Home />} />
        <Route path=":id" element={<Advert />} />

        <Route path="me" element={<MyAdverts />} />
        <Route path="new" element={<NewAdvert />} />
        <Route path=":id/edit" element={<EditAdvert />} />
      </Route>
      <Route path="*" element={<NoMatch />} />
    </Route>
  </Routes>
);

export default App;
