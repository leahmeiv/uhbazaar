import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Checkbox, Menu, Icon, Sidebar, Grid, Card, List, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { sortBy } from 'underscore';
import CategoryMenu from '../components/CategoryMenu';
import CategoryMenuList from '../components/CategoryMenuList';
import { Categories } from '../../api/category/category';
import { Items } from '../../api/item/item';
import CategoriesMenu from '../components/CategoriesMenu';

/** **********************************************************************
 *
 *        NAME:           Zachary Gilbert
 *
 *        PROJECT:        UH Bazaar
 *
 *        CLASS:          ICS 314
 *
 *        INSTRUCTOR:     Philip Johnson
 *
 *        FILE:           CategoryPage.jsx
 *
 *        DESCRIPTION:
 *            This file contains the functions and user interface for
 *            which the user can choose an item by its category and
 *            sort the items in various ways as follows.
 *
 ********************************************************************** */
class CategoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      sorter: 'date',
      titleIsActive: false,
      dateIsActive: true,
      priceIsActive: false,
      listMode: false,
      cardMode: true,
      priceToggle: false,
      dateToggle: false,
      titleToggle: false,
      reverse: true,
    };
  }

  handleHideClick = () => this.setState({ visible: false });

  handleShowClick = () => this.setState({ visible: true });

  handleSidebarHide = () => this.setState({ visible: false });

  /**
   * sortByItem Maps the item card data from ether
   * CategoryMenu.jsx or CategoryMenuList.jsx and sorts
   * which ever way the client desires.
   *
   * @param items: List of items,
   * @param cat: current category,
   * @param sortKey: Which field do we sort by,
   * @param Component: to be passed; list or gallery,
   * @param reverse: the order of sort,
   * @return {array}: List of cards mapped through Component
   */
  sortByItem(items, cat, sortKey, Component, reverse) {
    const stuff = sortBy(items, sortKey);
    if (reverse) {
      stuff.reverse();
      this.setState.reverse = false;
    }
    return stuff.filter(item => item.category === cat).map((item) => <Component key={item._id} item={item}/>);
  }

  /**
   * sortByCategory Maps the categories card data from CategoriesMenu.jsx
   * and sorts them alphabetically.
   *
   * @param categories: List of categories.
   * @return {array}: List of cards mapped through CategoriesMenu.jsx
   */
  sortByCategory(categories) {
    const stuff = sortBy(categories, 'name');
    return stuff.map((category) => <CategoriesMenu key={category._id} category={category}/>);
  }

  render() {
    const { visible } = this.state;
    let itemsComponent;
    /**
     * toggleName reverses the string indicating if sort is reverse or not.
     *
     * @param toggle: if we want to reverse then reverse,
     * @param message: string to be reversed,
     * @return {string}: string that was reversed.
     */
    const toggleName = (toggle, message) => {
      let str = '';
      if (toggle) {
        str = message;
      } else {
        str = message.split('-').reverse().join(' - ');
      }
      return str;
    };
    const titleStyle = {
      fontSize: '32px',
      fontFamily: 'Cinzel',
      paddingTop: '20px',
      paddingBottom: '20px',
      fontWeight: 'bold',
    };
    const subCat = {
      fontSize: '22px',
      fontFamily: 'Cinzel',
      paddingTop: '20px',
      paddingBottom: '12px',
      paddingLeft: '17px',
    };
    const mainContainerStyle = {
      paddingTop: '20px',
      paddingBottom: '64vh',
      paddingRight: '64px',
      paddingLeft: '64px',
    };
    const catSideMenu = {
      fontWeight: 'bold',
    };
    /** *********************************************************************************************
     *
     *   JSX FUNCTION TITLES:       titleCheckbox, dateCheckbox, priceCheckbox
     *
     *   DESCRIPTION:
     *        These three jsx functions change the state of the page when a sorting checkbox
     *        is activated by the user.  No two check boxes can be checked simultaneously.
     */
    const titleCheckbox = (
        <Checkbox checked={this.state.titleIsActive} onClick={() => this.setState({
          sorter: 'title',
          titleIsActive: true,
          dateToggle: false,
          priceToggle: false,
          dateIsActive: false,
          priceIsActive: false,
          reverse: false,
        })} label='Title'/>
    );
    const dateCheckbox = (
        <Checkbox checked={this.state.dateIsActive} onClick={() => this.setState({
          sorter: 'date',
          titleIsActive: false,
          dateIsActive: true,
          titleToggle: false,
          priceToggle: false,
          priceIsActive: false,
          reverse: false,
        })} label='Date'/>
    );
    const priceCheckbox = (
        <Checkbox checked={this.state.priceIsActive} onClick={() => this.setState({
          sorter: 'price',
          titleIsActive: false,
          dateIsActive: false,
          priceIsActive: true,
          titleToggle: false,
          dateToggle: false,
          reverse: false,
        })} label='Price'/>
    );
    /** *********************************************************************************************
     *
     *   JSX FUNCTION TITLES:       titleToggle, dateToggle, priceToggle
     *
     *   DESCRIPTION:
     *        These three jsx functions change the state of the page when a reverse toggle
     *        switch is activated by the user.  No two switches can be toggled simultaneously.
     */
    const priceToggle = (
        <Checkbox checked={this.state.priceToggle} disabled={!this.state.priceIsActive}
                  onClick={() => this.setState({ priceToggle: !this.state.priceToggle, reverse: !this.state.reverse })}
                  toggle
                  label={toggleName(this.state.priceToggle, 'Min - Max')}/>

    );
    const dateToggle = (
        <Checkbox checked={this.state.dateToggle} disabled={!this.state.dateIsActive}
                  onClick={() => this.setState({ dateToggle: !this.state.dateToggle, reverse: !this.state.reverse })}
                  toggle
                  label={toggleName(this.state.dateToggle, 'New - Old')}/>

    );
    const titleToggle = (
        <Checkbox checked={this.state.titleToggle} disabled={!this.state.titleIsActive}
                  onClick={() => this.setState({ titleToggle: !this.state.titleToggle, reverse: !this.state.reverse })}
                  toggle
                  label={toggleName(this.state.titleToggle, 'A - Z')}/>

    );
    /** *********************************************************************************************
     *
     *   JSX FUNCTION TITLES:       listCheckbox, cardCheckbox
     *
     *   DESCRIPTION:
     *        These two jsx functions contain the checkboxes that allow the user
     *        to switch to gallery or list modes.
     */
    const listCheckbox = (
        <Checkbox checked={this.state.listMode} onClick={() => this.setState({
          listMode: true,
          cardMode: false,
        })} label='List'/>
    );
    const cardCheckbox = (
        <Checkbox checked={this.state.cardMode} onClick={() => this.setState({
          listMode: false,
          cardMode: true,
        })} label='Gallery'/>
    );
    const background = (
        <style>{'body { background: rgba(222,242,241, 0.7) url(\'/images/mat.jpg\') no-repeat fixed;' +
        ' background-blend-mode: overlay; background-size: cover;}'}
        </style>
    );

    if (this.state.listMode) {
      itemsComponent = <List>
        {/* eslint-disable-next-line max-len */}
        {this.sortByItem(this.props.items, this.props.match.params.name, this.state.sorter, CategoryMenuList, this.state.reverse)}
      </List>;
    } else {
      itemsComponent = <Card.Group>
        {/* eslint-disable-next-line max-len */}
        {this.sortByItem(this.props.items, this.props.match.params.name, this.state.sorter, CategoryMenu, this.state.reverse)}
      </Card.Group>;
    }

    return (

        <div>
          <Menu.Header style={titleStyle}>
            <Icon size='big' name={this.props.match.params.icon}/> {`${this.props.match.params.name}`}
          </Menu.Header>
          <Button.Group>
            <Button disabled={visible} onClick={this.handleShowClick}>
              Show Options
            </Button>
          </Button.Group>
          <Sidebar.Pushable>
            <Sidebar
                as={Menu}
                vertical
                visible={visible}
                animation='push'
                width='wide'
                onHide={this.handleSidebarHide}>
              <Menu.Menu>
                <Menu.Header style={subCat}>
                  Display Mode
                </Menu.Header>
                <Menu.Item>
                  <Grid columns='2'>
                    <Grid.Column>
                      {listCheckbox}
                    </Grid.Column>
                    <Grid.Column>
                      {cardCheckbox}
                    </Grid.Column>
                  </Grid>
                </Menu.Item>
              </Menu.Menu>
              <Menu.Menu>
                <Menu.Header style={subCat}>
                  Sort By
                </Menu.Header>
                <Menu.Item>
                  <Grid columns='2'>
                    <Grid.Column>
                      {titleCheckbox}
                    </Grid.Column>
                    <Grid.Column>
                      {titleToggle}
                    </Grid.Column>
                  </Grid>
                </Menu.Item>
                <Menu.Item>
                  <Grid columns='2'>
                    <Grid.Column>
                      {dateCheckbox}
                    </Grid.Column>
                    <Grid.Column>
                      {dateToggle}
                    </Grid.Column>
                  </Grid>
                </Menu.Item>
                <Menu.Item>
                  <Grid columns='2'>
                    <Grid.Column>
                      {priceCheckbox}
                    </Grid.Column>
                    <Grid.Column>
                      {priceToggle}
                    </Grid.Column>
                  </Grid>
                </Menu.Item>
              </Menu.Menu>
              <Menu.Item style={catSideMenu}>
                {this.sortByCategory(this.props.categories)}
              </Menu.Item>
            </Sidebar>
            <Sidebar.Pusher>
              <Grid stackable style={mainContainerStyle}>
                {background}
                {itemsComponent}
              </Grid>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </div>
    );
  }
}

CategoryPage.propTypes = {
  match: PropTypes.object,
  categories: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('Categories');
  const itemSubscription = Meteor.subscribe('Items');
  return {
    categories: Categories.find({}).fetch(),
    items: Items.find({}).fetch(),
    ready: itemSubscription.ready() && subscription.ready(),
  };
})(CategoryPage);
