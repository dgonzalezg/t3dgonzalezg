import React, {useState} from 'react';
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts'
const Stock = ({data}) => {
const { updates, buys, sells } = data;
const tickers = updates.map(update => update.ticker);
const [stock, setStock] = useState(tickers[0]);
const filterupdates = updates.filter(update => update.ticker === stock)
const buyVolume = buys.filter(buy => buy.ticker === stock).map(buy => buy.volume).reduce((a, b) => a + b, 0);
const sellVolume = sells.filter(sell => sell.ticker === stock).map(sell => sell.volume).reduce((a, b) => a + b, 0);
const totalVolume = sellVolume + buyVolume;
const pecentalVar = () => {
  const values = filterupdates.map(update => update.value);
  const last = values[values.length - 2];
  const current = values[values.length - 1];
  const val = ((last-current)/current)*100;
  return (val.toFixed(2));
}
const handleChange = (e) => {
  setStock(e.target.value);
}


  return (
    <div className="stock container box tile is-ancestor">
      <div className="tile is-parent is-vertical">
      <div className="stock__select level">
        <div className="level-left">
        <div className="select level-item">
        <p>Stock </p>
        <select onChange={handleChange}>
          {tickers.filter((a, b) => tickers.indexOf(a) === b).map(ticker => {
            return (<option key={ticker} value={ticker}>{ticker}</option>);
          })}
        </select>
    </div>
        </div>
      
      </div>
      <div className="container">
        <p className="title">Valor v/s Tiempo</p>
      <LineChart width={730} height={250} data={filterupdates}
  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="time" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="value" stroke="#8884d8" />
</LineChart>
      </div>
      </div>
      <div className="tile is-parent is-vertical">
        <p className="title">Volument Total Transado: {totalVolume}</p>
        <p className="title">Alto Histórico: {Math.max(...filterupdates.map(update => update.value))}</p>
        <p className="title">Bajo Histórico: {Math.min(...filterupdates.map(update => update.value))}</p>
        <p className="title">Último Precio: {filterupdates.map(update => update.value)[filterupdates.length - 1]}</p>
        <p className="title">Variación Pocentual: {pecentalVar()}%</p>
      </div>
      
    
    </div>
  );
  
}

export default Stock;