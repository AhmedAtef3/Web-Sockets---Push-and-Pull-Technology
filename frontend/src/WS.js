import { useEffect, useRef, useState } from 'react';
import { addResponseMessage, Widget } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import Select from 'react-select';
import { io } from "socket.io-client";

const socket = io('http://localhost:3000');

const WS = (props)=>{
  const [sockets, setSockets] = useState([]);
  const [selectedSocket, setSelectedSocket] = useState('');
  const currentSelectSocket = useRef('');
  const handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
    if(! selectedSocket) return socket.emit('broadcastNewMessage', newMessage);
    socket.emit('sendToUser',{user: selectedSocket, newMessage: newMessage});
    console.log('will send now');
  };
  useEffect(()=>{
    socket.emit('socketConnected');
    socket.on('messageToAll', (data)=>{
      console.log('broadcast', data);
      addResponseMessage(data);
    })
    socket.on("newSpecificMessage", (data) => {
      addResponseMessage(data);
    });
    socket.on('allSockets',(allSockets)=>{
      setSockets(allSockets);
    });
    socket.on('broadcastedSockets', (allSockets)=>{
      setSockets(allSockets);
    });
    socket.on('allSocketsAfterRemoval', (allSockets,closedSocket)=>{
      setSockets(allSockets);
      if(closedSocket===currentSelectSocket.current){
        setSelectedSocket('');
      }
    });
  },[]);
  let allSocketsExceptSender = sockets.filter((currentSocket)=>socket.id!==currentSocket);
  const optionsArray = [{value:'', label: 'All users'}];
  allSocketsExceptSender.forEach((oneSocket)=>{
    optionsArray.push({'value': oneSocket, 'label':oneSocket})
    return optionsArray
  })
  return(
    <div>
      <div className='container'>
      <Select
        value={selectedSocket}
        onChange={((option)=>setSelectedSocket(option.value))}
        options={optionsArray}
      />
      <p>Selected User: {currentSelectSocket.current=selectedSocket}</p>
      </div>
      <Widget handleNewUserMessage={handleNewUserMessage}/>
    </div>
  )
};

export default WS;