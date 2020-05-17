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

const parseDate = (timestap) => {
// sacado de https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
  let unix_timestamp = timestap;
// Create a new JavaScript Date object based on the timestamp
// multiplied by 1000 so that the argument is in milliseconds, not seconds.
var date = new Date(unix_timestamp * 1000);
// Hours part from the timestamp
var hours = date.getHours();
// Minutes part from the timestamp
var minutes = "0" + date.getMinutes();
// Seconds part from the timestamp
var seconds = "0" + date.getSeconds();

// Will display time in 10:30:23 format
var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
return formattedTime;
}
const parsedupdates = updates.map(update => {
  if (typeof update.time === 'number') {
    update.time = parseDate(update.time);
  }
  return update;
})
const percentalVar = (stock) => {
  const filterupdates = parsedupdates.filter(update => update.ticker === stock)
  const values = filterupdates.map(update => update.value);
  const last = values[values.length - 2];
  const current = values[values.length - 1];
  const val = ((last-current)/current)*100;
  return (val.toFixed(2));
}

const getData = (stock) => {
  const filterupdates = parsedupdates.filter(update => update.ticker === stock);
  const buyVolume = buys.filter(buy => buy.ticker === stock).map(buy => buy.volume).reduce((a, b) => a + b, 0);
  const sellVolume = sells.filter(sell => sell.ticker === stock).map(sell => sell.volume).reduce((a, b) => a + b, 0);
  const totalVolume = sellVolume + buyVolume;
  const high = Math.max(...filterupdates.map(update => update.value));
  const low = Math.min(...filterupdates.map(update => update.value));
  const last = filterupdates.map(update => update.value)[filterupdates.length - 1];
  return {filterupdates, totalVolume, high, low, last};
}
const currentData = getData(stock);

function formatNumber(num) {
  // sacada de https://blog.abelotech.com/posts/number-currency-formatting-javascript/
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}


  return (
    <div className="stock container box tile is-child is-fluid">
      <div className="stock__graph tile is-vertical">
      <div className="stock__graph graph container">
        <p className="title">Valor v/s Tiempo</p>
      <LineChart width={730} height={250} data={currentData.filterupdates}
  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="time" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="value" stroke="#40E0D0" />
</LineChart>
      </div>
      </div>
      <div className="stock__info tile is-vertical">
        <table className="table is-hoverable">
          <thead>
            <tr>
              <th className="has-text-centered">Stock</th>
              <th className="has-text-centered">Volumen Total Transado</th>
              <th className="has-text-centered">Alto Histórico</th>
              <th className="has-text-centered">Bajo Histórico</th>
              <th className="has-text-centered">Último Precio</th>
              <th className="has-text-centered">Variación Pocentual</th>
            </tr>
          </thead>
          <tbody>
            {tickers.filter((a, b) => tickers.indexOf(a) === b).map(ticker => {
              const data = getData(ticker);
              if (stock === ticker){
                return (
                  <tr key={ticker} onClick={()=>setStock(ticker)} className="is-selected">
                    <td className="has-text-centered">{ticker}</td>
                    <td className="has-text-centered">{formatNumber(data.totalVolume)} USD</td>
                    <td className="has-text-centered">{data.high} USD</td>
                    <td className="has-text-centered">{data.low} USD</td>
                    <td className="has-text-centered">{data.last} USD</td>
                    <td className="has-text-centered">{percentalVar(ticker)}</td>
                  </tr>
                );
              }
              else {
                return (
                  <tr key={ticker} onClick={()=>setStock(ticker)}>
                    <td className="has-text-centered">{ticker}</td>
                    <td className="has-text-centered">{formatNumber(data.totalVolume)} USD</td>
                    <td className="has-text-centered">{data.high} USD</td>
                    <td className="has-text-centered">{data.low} USD</td>
                    <td className="has-text-centered">{data.last} USD</td>
                    <td className="has-text-centered">{percentalVar(ticker)}</td>
                  </tr>
                );
              }
              
            })}
          </tbody>
        </table>
        <p>Haz click sobre un stock para ver la evolución de su precio en el tiempo.</p>
      </div>
    </div>
  );
  
}

export default Stock;