import React, {Component} from 'react';
import {Link} from 'react-router-dom';



//const cardIcon =require(`../././assets/img/icons/${this.props.cardIcon}.png`)

class TipReportCard extends Component{
  render(){
    return (
      <div className="tipReportCard">
        <div className="iconContainer">
          <div className="row">
            <div className="col">
             <img alt="card icon" className="cardIcon" src={require('../../assets/img/icons/' + this.props.cardIcon + '.png')} />
            </div>
          </div>
        </div>

        <h3 className="cardTitle">{this.props.cardTitle}</h3>
        <p className="cardText">{this.props.cardText}</p>
        <Link className="cardLink" to={this.props.cardLinkPath}>{this.props.cardLinkText}</Link>
      </div>
    );

  }
}

export default (TipReportCard);
