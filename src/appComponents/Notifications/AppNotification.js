import React, {Component} from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import { closeNotification } from 'redux/actions';

const mapColorToIcon = {
  success: "fas fa-check",
  danger: "fas fa-exclamation-triangle",
  warning: "fas fa-exclamation-circle",
  info: "fas fa-info-circle",
}

class AppNotification extends Component {
  render() {
    let iconClass = this.props.iconClass
      ? this.props.iconClass
      : mapColorToIcon[this.props.colorClass] || mapColorToIcon.info;

    return (
      <div className={`alert alert-${this.props.colorClass  || 'info'} appNotification ${this.props.isOpen ? 'show': ''}`} role="alert">
        <i className={iconClass} /> &nbsp;
        {this.props.message}
        &nbsp;
        <button type="button" className="close" aria-label="Close">
          <span aria-hidden="true" onClick={() => this.props.closeNotification()}>&times;</span>
        </button>
      </div>
    );
  }
}

AppNotification.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  colorClass: PropTypes.oneOf(['success', 'danger', 'warning', 'info']),
  iconClass: PropTypes.string,
}

const mapStateToProps = state => {
  return ({
    isOpen: state.page.notification.isOpen,
    message: state.page.notification.message,
    colorClass: state.page.notification.colorClass,
    iconClass: state.page.notification.iconClass,
  })
}

const dispatcher = function(dispatch) {
  return {
    closeNotification: function() {
      closeNotification(dispatch);
    },
  }
}

export default compose( connect(
    mapStateToProps,
    dispatcher
  )
)( AppNotification );
