import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout.jsx';
import Home from './pages/Home.jsx';
import Messenger from './pages/Messenger.jsx';
import FreedomWall from './pages/FreedomWall.jsx';
import LostFound from './pages/LostFound.jsx';
import Explorer from './pages/Explorer.jsx';
import Profile from './pages/Profile.jsx';
import Feedbacks from './pages/Feedbacks.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="messenger" element={<Messenger />} />
          <Route path="freedomwall" element={<FreedomWall />} />
          <Route path="lostfound" element={<LostFound />} />
          <Route path="explorer" element={<Explorer />} />
          <Route path="profile" element={<Profile />} />
          <Route path="feedbacks" element={<Feedbacks />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
