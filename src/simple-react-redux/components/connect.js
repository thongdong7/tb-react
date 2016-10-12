import React, {Component} from 'react'
import storeShape from '../utils/storeShape'

import invariant from 'invariant'

const emptyProps = (state) => ({})

const connect = (stateToProps=emptyProps, mapDispatchToProps) => (Comp) => {
  class Connect extends Component {
    constructor(props, context) {
      super(props, context)
  //    this.version = version
      this.store = props.store || context.store
//      this.store = store

      invariant(this.store,
        `Could not find "store" in either the context or ` +
        `props`
      )

      const storeState = this.store.getState()
      this.state = { storeState }
//      console.log('store state', this.state);
  //    this.clearCache()
      if (mapDispatchToProps) {
        this.dispatchToProps = mapDispatchToProps(this.store.dispatch)
      } else {
        this.dispatchToProps = {}
      }
    }

    componentWillMount() {
//      console.log('subscribe');
      this.unsubscribe = this.store.subscribe(this.storeStateChanged)
    }

    componentWillUnmount() {
      console.log('unsubscribe');
      if (this.unsubscribe) {
        this.unsubscribe()
      }
    }

    storeStateChanged = () => {
//      console.log('store changed', this.store.getState());
      const storeState = stateToProps(this.store.getState())
//      console.log('props', storeState, typeof storeState);
      this.setState({storeState})
    }

    render() {
//      console.log('connect props', this.props);
      return (
        <Comp {...this.state.storeState} {...this.dispatchToProps} dispatch={this.store.dispatch} />
      )
    }
  }

  Connect.contextTypes = {
    store: storeShape
  }
  Connect.propTypes = {
    store: storeShape
  }

  return Connect
}


export default connect
