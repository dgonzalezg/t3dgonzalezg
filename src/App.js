import React, {useState, useEffect} from 'react';
import 'bulma';
import './App.css';
import io from 'socket.io-client';
import Stock from './stock'
import Exchange from './exchange';

const socket = io('wss://le-18262636.bitzonte.com', {
  path: '/stocks'
});
socket.connect();
function App() {
  const [connected,setConnected] = useState(true)
  const [updates, setUpdates] = useState([]);
  const [buys, setBuys] = useState([]);
  const [sells, setSells] = useState([]);
  const [exchanges, setExchanges] = useState({});

  const handleClick = () => {
    if (socket.connected) {
      socket.disconnect();
      setConnected(socket.connected)
    }
    else {
      socket.connect();
      setConnected(true)
    }
    
  }
  
  useEffect(() => {
    socket.on('UPDATE', update => {
      setUpdates(currentData => [...currentData, update]);
    });
    socket.on('BUY', buy => {
      setBuys(currentData => [...currentData, buy]);
    });
    socket.on('SELL', sell => {
      setSells(currentData => [...currentData, sell]);
    });
    socket.emit('EXCHANGES');
    socket.on('EXCHANGES', exchanges => {
      setExchanges(exchanges);
    })
  },[]);
 

  return (
    <div className="App">
      <div className="header">
  <button className="header__button button" onClick={handleClick}>{connected ? 'Desconectar':'Conectar'}</button>
  <p>Estado de Conexión: {connected ? 'Conectado':'Desconectado'}</p>
      </div>
      <Stock data={{updates, buys, sells}}></Stock>
      <Exchange exchanges={exchanges}></Exchange>
    </div>
  );
}

export default App;
