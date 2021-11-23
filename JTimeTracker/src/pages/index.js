import React from 'react'
import {useUserData} from "../store/hooks/user.hook.js";
import {Route, Switch} from "react-router-dom";
import Notebook from "./notebooks/notebook.js";
import Notebooks from "./notebooks";
import Settings from "./settings";
import CenterLoader from "../components/CenterLoader.js";
import ManageCompanies from "./settings/manageCompanies.js";
import RecurringCompanies from "./settings/recurringCompanies.js";
import Reports from "./settings/reports.js";

const UserNav = ({}) => {
  const {isLoading} = useUserData()

  if (isLoading) {
    return (
      <CenterLoader/>
    )
  }

  return (
    <Switch>
      <Route path={'/notebooks/:nbid'} exact component={Notebook}/>
      <Route path={'/notebooks'} exact component={Notebooks}/>
      <Route path={'/settings'} exact component={Settings}/>
      <Route path={'/settings/manage'} exact component={ManageCompanies}/>
      <Route path={'/settings/recurring'} exact component={RecurringCompanies}/>
      <Route path={'/settings/reports'} exact component={Reports}/>
    </Switch>
  );
};

export default UserNav;
