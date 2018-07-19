import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Avatar from '../../components/ReduxFormFields/Avatar'
import { Field } from 'redux-form'
import { ImageCropDialog } from '../../containers/ImageCropDialog'


class AvatarImageField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected_avatar_image: undefined
    }
  }

  handlePhotoUploadSuccess = (snapshot) => {
    const { change, name } = this.props;

    snapshot.ref.getDownloadURL().then(downloadURL => {
      change(name, downloadURL);
      this.setState({ selected_avatar_image: undefined })
    })
  }


  render() {
    const {
      altIconName,
      disabled,
      initialized,
      intl,
      path,
      uid,
      name
    } = this.props;

    return (
      <div style={{ margin: 20 }}>
        <div>
          <Field
            name={name}
            style={{ width: 120, height: 120, fontSize: 30 }}
            component={Avatar}
            iconName={altIconName}
          />
        </div>
        <div>
          <IconButton
            style={{ width: '100%' }}
            onClick={() => {
              this.setState({ selected_avatar_image: 'true' })
            }}
            disabled={disabled === true ? true : (uid === undefined || !initialized)}
            color='primary'
          >
            <Icon >  photo_camera </Icon>
          </IconButton>
        </div>

        <ImageCropDialog
          path={`${path}/${uid}`}
          fileName={name}
          onUploadSuccess={(s) => { this.handlePhotoUploadSuccess(s) }}
          open={this.state.selected_avatar_image !== undefined}
          src={this.state.selected_avatar_image}
          handleClose={() => { this.setState({ 'selected_avatar_image': undefined }) }}
          title={intl.formatMessage({ id: 'change_photo' })}
        />

      </div>
    );
  }
}

AvatarImageField.propTypes = {
  uid: PropTypes.string.isRequired,
  altIconName: PropTypes.string,
  path: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default AvatarImageField
