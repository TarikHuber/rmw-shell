import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Avatar } from '../../containers/Avatar'
import { Field } from 'redux-form'
import { ImageCropDialog } from '../../containers/ImageCropDialog'
import { intlShape } from 'react-intl'


export default class AvatarImageField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected_avatar_image: undefined
    }
  }

  handlePhotoUploadSuccess = (snapshot) => {
    const { change } = this.props;

    change('photoURL', snapshot.downloadURL);
    this.setState({ selected_avatar_image: undefined })
  }


  render() {
    const {
      altIconName,
      disabled,
      initialized,
      intl,
      path,
      uid
    } = this.props;

    return (
      <div style={{ margin: 20 }}>
        <div>
          <Field
            name="photoURL"
            size={120}
            component={Avatar}
            icon={
              <Icon
                className="material-icons">
                {altIconName}
              </Icon>
            }
            ref="photoURL"
            withRef
          />
        </div>
        <div>
          <Button
            style={{ width: '100%' }}
            onClick={() => {
              this.setState({ selected_avatar_image: 'true' })
            }}
            disabled={disabled === true ? true : (uid === undefined || !initialized)}
            containerElement='label'
            primary={true}
            icon={
              <Icon
                className="material-icons">
                photo_camera
              </Icon>
            }
          />
        </div>

        <ImageCropDialog
          path={`${path}/${uid}`}
          fileName={`photoURL`}
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
  //disabled: PropTypes.bool.isRequired,
  //initialized: PropTypes.bool.isRequired,
  uid: PropTypes.string.isRequired,
  //intl: intlShape.isRequired,
  altIconName: PropTypes.string,
  path: PropTypes.string.isRequired
};
