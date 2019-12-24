import React, { Component } from "react";

class Tabs extends Component {
  componentDidMount() {
    document.getElementById("defaultOpen").click();
  }

  openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }

  render() {
    return (
      <div className="row">
        <div className="tab col-2">
          {this.props.tabTitles.map((tabTitle, index) => {
            return (
              <button
                key={index}
                className="tablinks"
                onClick={event => this.openTab(event, "tab-" + index)}
                id="defaultOpen"
              >
                {tabTitle}
              </button>
            );
          })}
          <div
            key={"extraDiv"}
            style={{
              flexGrow: 1,
              borderRight: "1px solid #DDD",
              backgroundColor: "#CCC"
            }}
            className="tablinks"
          />
        </div>
        {this.props.tabsContent.map((tabContent, index) => {
          return (
            <div id={"tab-" + index} key={index} className="tabcontent col-10">
              {tabContent}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Tabs;
