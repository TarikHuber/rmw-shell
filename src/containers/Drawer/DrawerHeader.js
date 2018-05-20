import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DrawerHeader } from '../../components/Drawer'
import { setDialogIsOpen } from '../../store/dialogs/actions'
import drawerActions from '../../store/drawer/actions'

DrawerHeader.propTypes = {
  auth: PropTypes.object
}

const mapStateToProps = (state) => {
  const { auth, locale, dialogs, drawer } = state

  return {
    auth,
    // theme,
    locale,
    dialogs,
    drawer
  }
}

export default connect(
  mapStateToProps,
  { setDialogIsOpen, ...drawerActions }
)(DrawerHeader)
