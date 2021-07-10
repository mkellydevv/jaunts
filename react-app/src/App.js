import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { authenticate } from "./store/session";
import { getTrails } from "./store/trails";
import { getLists, getListById } from "./store/lists";
import { listQuery } from "./utils/queryObjects";

import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/user/UsersList";
import User from "./components/user/User";

import NavBar from "./components/nav/NavBar";
import SplashPage from "./components/splash/SplashPage";
import TrailPage from "./components/trail/TrailPage";
import ListsPage from "./components/lists/ListsPage";
import ListPage from "./components/list/ListPage";


function App() {
  const { user } = useSelector(state => state.session)
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const load = async () => {
      await dispatch(authenticate());
      setLoaded(true);
    };
    load();
  }, []);

  useEffect(() => {
    // dispatch(getLists(listQuery({fromUserId: 1, getUser: true, getTrails: 1})))
    // dispatch(getListById(1, {getUser: true, getTrails: true, getListsTrails: true}))
  }, [dispatch])

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path="/" exact={true} >
          <SplashPage />
        </Route>
        <Route path="/login" exact={true}>
          <LoginForm />
        </Route>
        <Route path="/sign-up" exact={true}>
          <SignUpForm />
        </Route>
        <Route path="/trails/:id" exact={true}>
          <TrailPage />
        </Route>
        <Route path="/lists" exact={true}>
          <ListsPage />
        </Route>
        <Route path="/lists/:id" exact={true}>
          <ListPage />
        </Route>
        <ProtectedRoute path="/users" exact={true} >
          <UsersList/>
        </ProtectedRoute>
        <ProtectedRoute path="/users/:userId" exact={true} >
          <User />
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
