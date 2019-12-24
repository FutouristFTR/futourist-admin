import React, { Component } from "react";
import SimpleCard from "appComponents/Cards/SimpleCard";

class Home extends Component {
  render() {
    return (
      <div>
        <SimpleCard
          cardTitle="Places"
          cardText="You can now view all the Futourist places."
          cardLinkText="Go to Places"
          cardLinkPath="/places"
        />
        <SimpleCard
          cardTitle="Claims"
          cardText="You can now view all the Futourist claims."
          cardLinkText="Go to Claims"
          cardLinkPath="/claims"
        />
      </div>
    );
  }
}

export default Home;
