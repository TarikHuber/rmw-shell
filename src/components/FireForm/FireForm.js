import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { initialize } from 'redux-form';

class FireForm extends Component {

  constructor(props, context) {
    super();
    this.context = context;
    this.state = {
      initialized: false
    }
  }

  clean(obj) {
    Object.keys(obj).forEach((key) => (obj[key] === undefined) && delete obj[key]);
    return obj
  }

  getCreateValues = (values) => {
    const { handleCreateValues } = this.props;

    if (handleCreateValues !== undefined && handleCreateValues instanceof Function) {
      return handleCreateValues(values);
    }

    return values;

  }

  getUpdateValues = (values, dispatch, props) => {
    const { handleUpdateValues } = this.props;

    if (handleUpdateValues !== undefined && handleUpdateValues instanceof Function) {
      return handleUpdateValues(values);
    }

    return values;
  }


  handleSubmit = (values) => {
    const { path, uid, firebaseApp, useFirestore } = this.props;

    if (uid) {
      const updateValues = this.getUpdateValues(this.clean(values));
      if (updateValues) {
        if (useFirestore) {
          firebaseApp.firestore().collection(path).doc(uid).update(updateValues)
        } else {
          firebaseApp.database().ref().child(`${path}${uid}`).update(updateValues)
        }
      }
    } else {

      const createValues = this.getCreateValues(this.clean(values));

      if (createValues) {
        if (useFirestore) {
          firebaseApp.firestore().collection(path).doc().set(createValues)
        } else {
          firebaseApp.database().ref().child(`${path}`).push(createValues)
        }
      }

    }

  }

  handleDelete = () => {
    const { onDelete, path, uid, firebaseApp, useFirestore } = this.props;

    if (uid) {
      if (useFirestore) {
        firebaseApp.firestore().collection(path).doc(uid).delete().then(() => {
          if (onDelete && onDelete instanceof Function) {
            onDelete();
          }
        })
      } else {
        firebaseApp.database().ref().child(`${path}${uid}`).remove().then(() => {
          if (onDelete && onDelete instanceof Function) {
            onDelete();
          }
        })
      }
    }

  }

  shouldComponentUpdate() {
    return false
  }

  componentWillMount() {
    const { path, uid, name, firebaseApp, initialize, useFirestore } = this.props;

    if (uid) {

      if (useFirestore) {

        this.unsub = firebaseApp.firestore().collection(path).doc(uid).onSnapshot(doc => {
          if (doc.exists) {
            this.setState({ initialized: true }, () => {
              initialize(name, doc.data(), true)
            })
          }
        })

      } else {
        firebaseApp.database().ref(`${path}${uid}`).on('value',
          snapshot => {
            this.setState({ initialized: true }, () => {
              initialize(name, snapshot.val(), true)
            })
          })
      }

    } else {
      this.setState({ initialValues: {}, initialized: true })
    }

  }

  /*
    componentWillReceiveProps = (nextProps) => {
      const { uid, name, path, firebaseApp, initialize, useFirestore } = this.props;
      const { uid: nextUid } = nextProps;
  
      if (uid && uid !== nextUid) {
  
        if (useFirestore) {
  
          if (this.unsub) {
            this.unsub()
          }
  
          this.unsub = firebaseApp.firestore().collection(path).doc(nextUid).onSnapshot(doc => {
            if (doc.exists) {
              this.setState({ initialized: true }, () => {
                initialize(name, doc.data(), true)
              })
            }
          })
  
  
        } else {
  
          firebaseApp.database().ref(`${path}${nextUid}`).on('value',
            snapshot => {
              this.setState({ initialized: true }, () => {
                initialize(name, snapshot.val(), true)
              })
            })
        }
      }
    }
    */

  componentWillUnmount() {
    const { path, uid, firebaseApp } = this.props;
    firebaseApp.database().ref(`${path}${uid}`).off()

    if (this.unsub) {
      this.unsub()
    }
  }

  render() {


    console.log('fire form render')

    return React.Children.only(React.cloneElement(this.props.children, {
      onSubmit: this.handleSubmit,
      ...this.state,
      ...this.props
    }))
  }
}

FireForm.propTypes = {
  path: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  useFirestore: PropTypes.bool,
  firebaseApp: PropTypes.any.isRequired,
  uid: PropTypes.string,
  onDelete: PropTypes.func,
  handleCreateValues: PropTypes.func,
  handleUpdateValues: PropTypes.func,
};


const mapStateToProps = (state) => {
  return {
  };
};

export default connect(
  mapStateToProps, { initialize }
)(FireForm);
