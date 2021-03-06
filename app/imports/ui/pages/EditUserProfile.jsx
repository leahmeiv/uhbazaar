import React from 'react';
import { Grid, Loader, Header, Segment, Button, Container, Input, Image, Icon } from 'semantic-ui-react';
import { Users, UserSchema } from '/imports/api/user/user';
import { Bert } from 'meteor/themeteorchef:bert';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import HiddenField from 'uniforms-semantic/HiddenField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Slingshot } from 'meteor/edgee:slingshot';

/** Renders the Page for editing a single document. */
class EditUserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.deleteCallback = this.deleteCallback.bind(this);
    this.state = {
      image: 'images/user.png',
      file: null,
      imagePreviewUrl: null,
    };
  }

  deleteCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Delete failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Delete succeeded' });
      this.formRef.reset();
    }
  }

  onClick() {
    if (confirm('The will permanently delete your account!')) {
      Users.remove(this.props.doc._id, this.deleteCallback);
    }
  }

  componentWillMount() {
    // we create this rule both on client and server
    Slingshot.fileRestrictions('image', {
      allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
      maxSize: 1 * 1024 * 1024,
    });
  }

  upload() {
    const user = Users.findOne({ owner: Meteor.username });
    const userId = user.username;
    console.log(userId);
    const metaContext = { imageId: userId };
    const uploader = new Slingshot.Upload('fileUploads', metaContext);

    /* eslint-disable-next-line no-undef */
    uploader.send(document.getElementById('input').files[0], function (error, downloadUrl) {
      if (error) {
        // Log service detailed response
        console.error('Error uploading', uploader.xhr.response);
        Bert.alert(error);
      }
      this.setState({ image: downloadUrl });
    }.bind(this));
  }

  /** On successful submit, insert the data. */
  submit(data) {
    const { firstName, lastName, description, _id } = data;
    const image = this.state.image;

    Users.update(_id, { $set: { firstName, lastName, description, image } }, (error) => (error ?
        Bert.alert({ type: 'danger', message: `Update failed: ${error.message}` }) :
        Bert.alert({ type: 'success', message: 'Update succeeded' })));
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    const formStyle = {
      marginTop: '64px',
      marginBottom: '64px',
      paddingBottom: '16vh',
    };
    const thumbStyle = { paddingTop: '8px', paddingBottom: '8px' };
    const user = Users.findOne({ owner: Meteor.username });
    return (
        <Container>
          <style>{'body { background: url(images/uh-logo.png) no-repeat center fixed; }'}</style>
          <style>{'body { background-color: #def2f1; }'}</style>
          <Grid style={formStyle} container centered>
            <Grid.Column>
              <Header as="h2" textAlign="center">Edit Profile</Header>
              <AutoForm schema={UserSchema} onSubmit={this.submit.bind(this)} model={this.props.doc}>
                <Segment>
                  <TextField name='firstName'/>
                  <TextField name='lastName'/>
                  <LongTextField name='description'/>
                  <Segment placeholder>
                    <Header textAlign='center' icon><Icon name='image'/>
                      Upload an image, under 1 mb
                    </Header>
                    <Container style={thumbStyle}>
                      <Image centered size='small'
                             rounded src={user.image !== 'images/user.png' ? user.image : this.state.image}
                      />
                    </Container>
                    <Input fluid type="file" id="input" onChange={this.upload.bind(this)}/>
                  </Segment>
                  <SubmitField value='Submit'/>
                  <Link to={'/userprofile/'}>
                    <Button floated='right'>Back to Profile</Button>
                  </Link>
                  <Segment placeholder>
                    <Header textAlign='center' icon>
                      <Icon name='warning sign'/>
                      Danger!
                    </Header>
                    <Container textAlign='center'>
                      <Link to={'/userprofile/'}>
                        <Button inverted color='red' onClick={this.onClick}>Delete my account</Button>
                      </Link>
                    </Container>
                  </Segment>
                  <ErrorsField/>
                  <HiddenField name='username'/>
                </Segment>
              </AutoForm>
            </Grid.Column>
          </Grid>
        </Container>
    );
  }
}

EditUserProfile.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;

  const subscription = Meteor.subscribe('Users');
  return {
    doc: Users.findOne(documentId),
    ready: subscription.ready(),
  };
})(EditUserProfile);
