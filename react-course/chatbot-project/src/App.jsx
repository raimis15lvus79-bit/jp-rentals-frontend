import { useState } from 'react'
import { ChatInput } from './components/ChatInput';
import ChatMessages from './components/ChatMessages';
import './App.css'

function App() {
        const [chatMessages, setChatMessages] = useState([{
          message: 'hello chatbot',
          sender: 'user',
          id: '1'
        }, {
          message: 'Hello. How can I help you?',
          sender: 'robot',
          id: '2'
        }, {
          message: 'can you get me today\'s date?',
          sender: 'user',
          id: '3'
        }, {
          message: 'Sure. Today\'s date is June 20, 2024.',
          sender: 'robot',
          id: '4'
        }]);
        
        //const [chatMessages, setChatMessages] = array;
        //const chatMessages = array[0];
        //const setChatMessages = array[1];

        return (
          <div className="app-container">
            
            <ChatMessages 
              chatMessages={chatMessages}
            />
            <ChatInput 
              chatMessages={chatMessages}
              setChatMessages={setChatMessages}
            />
          </div>
        );
      }

export default App
