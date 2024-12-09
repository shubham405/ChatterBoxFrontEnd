import React from 'react';
import './App.css';
import {  Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage'; // Update with the correct path
import ChatsPage from './Pages/ChatPage'; // Update with the correct path
// const TestComponent = () => <h1>Test Component Loaded</h1>;

// const App = () => {
  
//   return (
//     <Routes>
      
//       <Route path="/" element={<TestComponent />} />
//       {/* <Route path="/chats" element={<ChatsPage />} /> */}
//     </Routes>
//   );
// };

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatsPage />} />
      </Routes>
      </div>
   
  );
}

export default App;
