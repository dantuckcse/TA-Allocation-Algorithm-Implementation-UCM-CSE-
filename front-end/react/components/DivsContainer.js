import React from 'react';

function DivsContainer(props) {
  const divs = [];

  for (let i = 0; i < props.numDivs; i++) {
    const id = `div-${i}`;
    divs.push(<div key={i} id={id} className="box"></div>);
  }

  return <div className="container">{divs}</div>;
}

export default DivsContainer;