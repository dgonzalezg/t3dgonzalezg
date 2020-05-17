import React from 'react';
import {GoogleCharts} from 'google-charts';
import {BarChart, XAxis, CartesianGrid, YAxis, Tooltip, Legend, Bar} from 'recharts';


const Exchange = ({data}) => {
const { exchanges, stocks, buys, sells } = data;



const getTicker = (name) => {
  const ticker = stocks.filter(stock => stock.company_name === name);
  return ticker[0].ticker;
}

const getBuyVolume = (ticker) => {
  return buys.filter(buy => buy.ticker === ticker).map(buy => buy.volume).reduce((a, b) => a + b, 0);
}

const getSellVolume = (ticker) => {
  return sells.filter(sell => sell.ticker === ticker).map(sell => sell.volume).reduce((a, b) => a + b, 0);
}

const getData = (exchange) => {
  const key = exchange;
  const tickers = exchanges[key].listed_companies.map(company => getTicker(company));
  const buyVolume = tickers.map(ticker => getBuyVolume(ticker)).reduce((a, b) => a + b, 0);
  const sellVolume = tickers.map(ticker => getSellVolume(ticker)).reduce((a, b) => a + b, 0);
  const totalVolume = buyVolume + sellVolume;
  const quantity = tickers.length;
  return {buyVolume, sellVolume, totalVolume, quantity};
}


const getParticipation = (exchange) => {
  const currentVol = getData(exchange).totalVolume;
  const sumVolume = Object.keys(exchanges).map(exchange => getData(exchange).totalVolume).reduce((a, b) => a + b, 0);
  const participation = (currentVol/sumVolume)*100;
  return (participation.toFixed(2));
}
const labels = [['Exchange', 'Paticipation']]
const extradata = Object.keys(exchanges).map(exchange => {
  return [exchange, parseFloat(getParticipation(exchange))]
});

const barCharData = Object.keys(exchanges).map(exchange => {
  const data = getData(exchange);
  return {name: exchange, 'Volumen Compra': data.buyVolume, 'Volumen Venta': data.sellVolume};
});

const drawChart = () => {
 //console.log([...pieData,...extradata])
  // Standard google charts functionality is available as GoogleCharts.api after load
  const data = GoogleCharts.api.visualization.arrayToDataTable([...labels,...extradata]);
  const pie_1_chart = new GoogleCharts.api.visualization.PieChart(document.getElementById('piechart'));
  var options = {'width':650,
                  'height':300};
  pie_1_chart.draw(data, options);

}
GoogleCharts.load(drawChart);

function formatNumber(num) {
  // sacada de https://blog.abelotech.com/posts/number-currency-formatting-javascript/
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}
return (
    <div className=" exchange container tile is-child box is-fluid">
      <div className="exchange__graph tile is-vertical">
    <div className="exchange__graph piechart container">
    <p className="title">Participación de Mercado</p>
    <div id="piechart" className="container"></div>
    </div>
      </div>
    <div className="exchange__info tile is-vertical container">
      <p className="title">Volumenes de Compra</p>
    <BarChart width={500} height={300} data={barCharData}
            margin={{top: 20, right: 30, left: 20, bottom: 5}}>
       <CartesianGrid strokeDasharray="3 3"/>
       <XAxis dataKey="name"/>
       <YAxis/>
       <Tooltip/>
       <Legend />
       <Bar dataKey="Volumen Compra" stackId="a" fill="#8884d8" />
       <Bar dataKey="Volumen Venta" stackId="a" fill="#82ca9d" />
      </BarChart>
  
    </div>
    <div className="tile">
    <table className="table is-striped">
        <thead>
          <tr>
            <th>Exchange</th>
            <th>Volumen Compra</th>
            <th>Volumen Venta</th>
            <th>Volumen Total</th>
            <th>Cantidad Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(exchanges).map(ex => {
            const data = getData(ex);
            
              return (
                <tr key={ex}>
                  <td className="has-text-centered">{ex}</td>
                  <td className="has-text-centered">{formatNumber(data.buyVolume)} USD</td>
                  <td className="has-text-centered">{formatNumber(data.sellVolume)} USD</td>
                  <td className="has-text-centered">{formatNumber(data.totalVolume)} USD</td>
                  <td className="has-text-centered">{data.quantity}</td>
                </tr>
              );
          
          })}
        </tbody>
      </table>
    </div>
    
    </div>


);
}

export default Exchange;