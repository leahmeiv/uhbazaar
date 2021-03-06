import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Roles } from 'meteor/alanning:roles';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import UHBazaar from '../pages/UHBazaar';
import AdminPage from '../pages/AdminPage';
import CreateItem from '../pages/CreateItem';
import EditStuff from '../pages/EditStuff';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import Signout from '../pages/Signout';
import CategoriesPage from '../pages/CategoriesPage';
import CategoryPage from '../pages/CategoryPage';
import UserProfile from '../pages/UserProfile';
import EditUserProfile from '../pages/EditUserProfile';
import ShowUsers from '../pages/ShowUsers';
import UserProfileById from '../pages/UserProfileById';
import CreateUserProfile from '../pages/CreateUserProfile';
import ShowItem from '../components/ShowItem';
import EditUserAdmin from '../pages/EditUserAdmin';
import EditCategoryAdmin from '../pages/EditCategoryAdmin';
import EditItemAdmin from '../pages/EditItemAdmin';
import EditReportAdmin from '../pages/EditReportAdmin';
import CreateReport from '../pages/CreateReport';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
class App extends React.Component {
  render() {
    return (
        <Router>
          <div>
            <NavBar/>
            <Switch>
              <Route exact path="/" component={UHBazaar}/>
              <Route exact path="/userprofile" component={UserProfile}/>
              <Route path="/signin" component={Signin}/>
              <Route path="/signup" component={Signup}/>
              <Route exact path="/categoriespage" component={CategoriesPage}/>
              <Route path="/showusers" component={ShowUsers}/>
              <Route path="/createuserprofile" component={CreateUserProfile}/>
              <ProtectedRoute path="/item/:_id" component={ShowItem}/>
              <Route path="/categorypage/:name/:icon" component={CategoryPage}/>
              <ProtectedRoute path="/createitem" component={CreateItem}/>
              <ProtectedRoute path="/createReport" component={CreateReport}/>
              <ProtectedRoute path="/edit/:_id" component={EditStuff}/>
              <ProtectedRoute path="/edituserprofile/:_id" component={EditUserProfile}/>
              <ProtectedRoute path="/userprofilebyid/:_id" component={UserProfileById}/>
              <AdminProtectedRoute path="/admin" component={AdminPage}/>
              <AdminProtectedRoute path="/edit-user/:_id" component={EditUserAdmin}/>
              <AdminProtectedRoute path="/edit-category/:_id" component={EditCategoryAdmin}/>
              <AdminProtectedRoute path="/edit-item/:_id" component={EditItemAdmin}/>
              <AdminProtectedRoute path="/edit-report/:_id" component={EditReportAdmin}/>
              <ProtectedRoute path="/signout" component={Signout}/>
              <Route component={NotFound}/>
            </Switch>
            <Footer/>
          </div>
        </Router>
    );
  }
}

/**
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */

const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
          const isLogged = Meteor.userId() !== null;
          return isLogged ?
              (<Component {...props} />) :
              (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
              );
        }}
    />
);

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */

const AdminProtectedRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
          const isLogged = Meteor.userId() !== null;
          const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
          return (isLogged && isAdmin) ?
              (<Component {...props} />) :
              (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
              );
        }}
    />
);

/** Require a component and location to be passed to each ProtectedRoute. */
ProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object,
};

/** Require a component and location to be passed to each AdminProtectedRoute. */
AdminProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object,
};

export default App;
