import React, {Component} from 'react'
import storeShape from '../utils/storeShape'
import {createStoreMap} from './StoreMap'
import invariant from 'invariant'
import _ from 'lodash'
import {isSameParams} from '../../data'

const emptyProps = (state) => ({})

export const connect2 = (options={}) => (Comp) => {
  class Connect extends Component {
    constructor(props, context) {
      super(props, context)
      this.store = props.store || context.store

      invariant(this.store,
        `Could not find "store" in either the context or ` +
        `props`
      )

      this.storeMap = createStoreMap(this.store, {
        ...options,
        ownProps: props,
        propsChange: this.onPropsChange
      })

      this.state = this.storeMap.getProps()
    }

    componentWillMount() {
    //  console.log('subscribe', this.store);
      this.storeMap.start(this.props)
    }

    componentWillUnmount() {
      console.log('unsubscribe');
      this.storeMap.stop()
    }

    componentWillReceiveProps(nextProps) {
      // if (!_.isEqual(this.props, nextProps)) {
      if (!isSameParams(this.props, nextProps)) {
        // console.log('props change', this.props, nextProps);
        this.storeMap.start(nextProps)
      }
    }

    onPropsChange = (nextProps) => {
      // console.log('props change', nextProps);
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
