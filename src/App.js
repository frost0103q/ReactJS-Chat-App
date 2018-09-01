import React, { Component } from 'react';
import './App.css';
import MessagesList from './components/MessagesList';
import SendMessageForm from './components/SendMessageForm';

//texto de ejemplo
const DUMMY_DATA = [
  {
    senderId: "perborgen",
    text: "Alguien en linea?"
  },
  {
    senderId: "janedoe",
    text: "hola !"
  }
];

//variables para conectar con chatkit
const instanceLocator = "v1:us1:4557057a-9e82-4aa5-bda7-27d124f1baf2"
const testToken = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/4557057a-9e82-4aa5-bda7-27d124f1baf2/token"
const username = "toms"
const roomId = 15206505

//componente funcional, ya que solo tiene un render
function Title() {
  return <p className="title">React chat</p>
}


class App extends React.Component {
  
  constructor() {
    super()
    this.state = {
       messages: DUMMY_DATA
    }
    this.sendMessage = this.sendMessage.bind(this)
  }

  componentDidMount() {
   const chatManager = new window.Chatkit.ChatManager({
     instanceLocator: instanceLocator,
     userId: username,
     tokenProvider: new window.Chatkit.TokenProvider({
       url: testToken
     })
   })
   chatManager.connect()
   .then(currentUser => {
      this.currentUser = currentUser
      this.currentUser.subscribeToRoom({
      roomId: roomId,
      hooks: {
        onNewMessage: message => {
          this.setState({
            messages: [...this.state.messages, message]
          })
        }
      }
    })
   })
 }

sendMessage(text) {
  this.currentUser.sendMessage({
    text,
    roomId: roomId
  })
}

render() {
    return (
      <div className="app">
        <Title />
        <MessagesList messages={this.state.messages} />
        <SendMessageForm sendMessage={this.sendMessage} />
     </div>
    )
  }
}


export default App;