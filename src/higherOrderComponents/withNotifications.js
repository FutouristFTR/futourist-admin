import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { showNotification } from 'redux/actions';

const withNotifications = (Component) => {
  class WithNotifications extends React.Component {
    render (){
      return <Component {...this.props}/>
    }
  }

  function mapStateToProps(state){
    return { }
  }

  const NotificationDispatch = function(dispatch) {
    return {
      showNotification: function(message, colorClass, iconClass) {
        showNotification(message, colorClass, iconClass, dispatch);
      },
    }
  }

  return compose( connect( mapStateToProps, NotificationDispatch ))( WithNotifications )
}

export default withNotifications;
