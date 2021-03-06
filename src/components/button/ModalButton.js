// @flow
import React, {Component, PropTypes} from 'react'

import Modal from 'react-modal'

import {Button} from './Button'
import {selectProps} from '../../props'

const customStyles = {
  overlay: {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(0, 0, 0, 0.8)'
  },
  content : {
//    top                   : '50%',
//    left                  : '50%',
//    right                 : 'auto',
//    bottom                : 'auto',
//    marginRight           : '-50%',
//    transform             : 'translate(-50%, -50%)'
    position                   : 'absolute',
    top                        : '40px',
    left                       : '40px',
    right                      : '40px',
    bottom                     : '40px',
//    border                     : '1px solid #ccc',
    background                 : '#fff',
    overflow                   : 'auto',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '20px'
  }
};

export class ModalButton extends Component {
  static propTypes = {
    icon: PropTypes.string,
    name: PropTypes.string.isRequired,
    comp: PropTypes.oneOfType([
      PropTypes.func.isRequired,
      PropTypes.element.isRequired,
    ]).isRequired,
    params: PropTypes.object,
    title: PropTypes.string,
    // Callback when modal is closed
    onClose: PropTypes.func
  }

  state = {
    modalIsOpen: false
  }

  openModal = () => {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    // this.refs.subtitle.style.color = '#f00';
  }

  closeModal = () => {
    if (this.props.onClose) {
      this.props.onClose()
    }

    this.setState({modalIsOpen: false});
  }

  render() {
    // console.log('comp props', this.props.comp)

    const {title=this.props.name, params} = this.props
    let buttonParams = selectProps(this.props, ['icon', 'name', 'type', 'hideName'])
    if (!buttonParams.type) {
      buttonParams.type = "info"
    }

    return (
      <span>
        <Button
          {...buttonParams}
          onClick={this.openModal} />
        <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles} >

          {
            this.state.modalIsOpen &&
            <div>
              {title &&
                <div className="modal-header">
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={this.closeModal}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <h4 className="modal-title">{title}</h4>
                </div>
              }
              <this.props.comp {...params} />
            </div>
          }
        </Modal>
      </span>
    )

  }
}
