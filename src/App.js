import React, {useState, useEffect} from 'react';
import 'bulma';
import './App.css';
import io from 'socket.io-client';
import Stock from './stock'
import Exchange from './exchange';
import './index.scss'
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
  const [stocks, setStocks] = useState([]);

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
    socket.emit('STOCKS');
    socket.on('STOCKS', stocks => {
      setStocks(stocks);
    })
  },[]);

  return (
    <div className="App">
      <div className="main container is-fluid tile is-ancestor">
        <div className="tile container is-fluid is-parent is-vertical">
          <p className="stocks title">Stocks</p>
        {updates.length > 0 ? <Stock data={{updates, buys, sells}}></Stock>:null}
        <p className="exchanges title">Exchanges</p>
        {Object.keys(exchanges).length > 0 && stocks.length ? <Exchange data={{ exchanges, stocks, buys, sells}}></Exchange> : null}
        </div>
      
      </div>
      <footer className="footer">
        <div className="footer__container container">
          <p className="title">Estado de Conexión: {connected ? 'Conectado':'Desconectado'}</p>
          <button className="header__button button" onClick={handleClick}>{connected ? 'Desconectar':'Conectar'}</button>
        </div>
    
    
      </footer>
    </div>
  );
}

export default App;
