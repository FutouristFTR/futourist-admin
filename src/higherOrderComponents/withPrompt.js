import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { showPrompt, closePrompt } from 'redux/actions';

const withPrompt = (Component) => {
  class WithPrompt extends React.Component {
    render (){
      return <Component {...this.props}/>
    }
  }

  function mapStateToProps(state){
    return { }
  }

  const dispatch = function(dispatch) {
    return {
      showPrompt: function(title, text, mainAction, mainButton, closeAction, closeButton){
        showPrompt(title, text, mainAction, mainButton, closeAction, closeButton, dispatch);
      },
      closePrompt: function(){
        closePrompt(dispatch);
      },
    }
  }

  return compose( connect( mapStateToProps, dispatch ))( WithPrompt )
}

export default withPrompt;
