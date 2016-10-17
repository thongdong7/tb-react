import React, {Component} from 'react'
import storeShape from '../utils/storeShape'
import {createStoreMap} from './StoreMap'
import invariant from 'invariant'

const emptyProps = (state) => ({})

export const connect2 = (options={}) => (Comp) => {
  class Connect extends Component {
    constructor(props, context) {
      super(props, context)
  //    this.version = version
      this.store = props.store || context.store

      invariant(this.store,
        `Could not find "store" in either the context or ` +
        `props`
      )

      this.storeMap = createStoreMap(this.store, {
        ...options,
        propsChange: this.onPropsChange
      })

      this.state = this.storeMap.getProps()
    }

    componentWillMount() {
//      console.log('subscribe', this.store);
      this.storeMap.start()
    }

    componentWillUnmount() {
      console.log('unsubscribe');
      this.storeMap.stop()
    }

    onPropsChange = (nextProps) => {
      console.log('props change', nextProps);
      this.setState(nextProps)
    }

    render() {
//      console.log('connect props', this.props);
      return (
        <Comp {...this.state} dispatch={this.store.dispatch} />
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
