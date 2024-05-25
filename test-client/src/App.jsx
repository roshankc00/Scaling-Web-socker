import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000');
function App() {
  const [message, setmessage] = useState('');
  const [messageList, setmessageList] = useState([]);

  const sendMessage = async () => {
    if (message !== '') {
      const messageData = {
        message,
      };
      socket.emit('send_message', messageData);
    }
  };
  useEffect(() => {
    socket.on('message', (data) => {
      setmessageList((prev) => [...prev, data?.message]);
      setmessage('');
    });
  }, [socket]);

  return (
    <>
      <ul>{messageList && messageList.map((item) => <li> {item}</li>)}</ul>
      <div className="container">
        <input
          type="text"
          value={message}
          onChange={(e) => setmessage(e.target.value)}
          className="input-messesage"
          onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="btn" onClick={(e) => sendMessage()}>
          send
        </button>
      </div>
    </>
  );
}

export default App;
