import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class SimpleCard extends Component{
  render(){
    return (
      <div className="mainCard">
        <h3 className="cardTitle">{this.props.cardTitle}</h3>
      <p className="cardText">{this.props.cardText}</p>
        <Link className="cardLink" to={this.props.cardLinkPath}>{this.props.cardLinkText}</Link>
      </div>
    );

  }
}

export default (SimpleCard);
