import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { StatsPage } from './StatsPage';



export const Root = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/stats" />} />
          <Route path="/stats" component={StatsPage} />
        </Switch>
      </Router>
    </>
  )
}
