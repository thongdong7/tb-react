import React, {Component} from 'react';
//import logo from './logo.svg';

//styles

import {connect, connect2} from '../../../lib/simple-react-redux'
import {FetchAction} from '../../../lib/simple-redux'
import {map, get, get2} from '../../../lib'
import {siteActions, repositoryActions} from './actions'

const App = ({repositories, loading, loadData, addTodo, toggleTodo}) => {
  return (
    <div className="App">
      auto load repositories {loading && "loading..."}
      <button onClick={loadData}>loadData</button>
      <button onClick={addTodo}>Add</button>
      <ul>
        {repositories.map((t, idx) => {
          return (
            <li
              key={idx}
              style={{
                textDecoration: t.completed ? 'line-through' : 'none'
              }}
              onClick={() => toggleTodo(t.id)}
            >{t.id} {t.text}</li>
          )
        })}
      </ul>
    </div>
  )
}

const mapStateToProps = ({repositories, loading}) => {
  return {
    repositories,
    loading
  }
}

const mapDispatchToProps = (dispatch) => {
 return {
   loadData: () => dispatch(repositoryActions.load, 'octocat')
 }
}

export default connect2({
  start: (dispatch) => {
    console.log('app is started')
    dispatch(repositoryActions.load, 'thongdong7')
  },
  stateToProps: mapStateToProps,
  dispatchToProps: mapDispatchToProps
})(App)

class SiteList extends Component {
  render() {
    console.log('site list', this.props);
    return (
      <div>
        <ul className="nav nav-tabs">
        </ul>
        {this.props.children}

      </div>
    )
  }
}
//          {this.props.data.sort().map(name => {
//            const style = this.props.site === name ? "active" : ""
//            return (
//              <li key={name} className={`${style}`}>
//                {name}
//              </li>
//            )
//          })}


// export default map(
//   get2(siteActions.load),
// )(SiteList)
