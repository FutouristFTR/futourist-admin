import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class SplitCard extends Component{
  render(){
    return (
      <div className="splitCard">
        <h3>{this.props.cardTitle}</h3>
        <p>{this.props.cardText}</p>
        <Link className="cardLinkText" to={this.props.cardLinkPath}>{this.props.cardLinkText}</Link>
      </div>
    );

  }
}

export default (SplitCard);
