import React, {useState} from 'react';

const Exchange = ({exchanges}) => {
console.log(exchanges);
return (
  <div className=" exchange tile is-ancestor box">
    <div className="tile is-parent is-vertical">
    <div className="select tile is-child level">
        <div className="level-left">
          <p>Exchange Seleccionado: </p>
          <select className="level-item">
            {Object.keys(exchanges).map(exchange => {
              return (<option key={exchange} value={exchange}>{exchange}</option>);
            })}
          </select>
        </div>
    </div>
    </div>

  </div>
);
}

export default Exchange;