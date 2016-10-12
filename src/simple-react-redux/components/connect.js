import React, {Component} from 'react'
import storeShape from '../utils/storeShape'

import invariant from 'invariant'

const emptyProps = (state) => ({})

const connect = (stateToProps=emptyProps) => (Comp) => {
  class Connect extends Component {
    constructor(props, context) {
      super(props, context)
  //    this.version = version
      console.log(props);
      console.log(context);
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
    }

    componentWillMount() {
      console.log('subscribe');
      this.unsubscribe = this.store.subscribe(this.storeStateChanged)
    }

    componentWillUnmount() {
      console.log('unsubscribe');
      if (this.unsubscribe) {
        this.unsubscribe()
      }
    }

    storeStateChanged = () => {
      console.log('store changed', this.store.getState());
      const storeState = stateToProps(this.store.getState())
//      console.log('props', storeState, typeof storeState);
      this.setState({storeState})
    }

    render() {
//      console.log('connect props', this.props);
      return (
        <Comp {...this.state.storeState} dispatch={this.store.dispatch} />
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
