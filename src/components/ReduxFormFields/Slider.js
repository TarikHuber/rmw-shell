import Slider from '@material-ui/lab/Slider'
import createComponent from 'redux-form-material-ui/lib/createComponent'

export default createComponent(
  Slider,
  // eslint-disable-line no-unused-vars
  ({ input: { onDragStart, onChange, name, value }, onChange: onChangeFromField, defaultValue, meta, ...props }) => ({
    // eslint-disable-line no-unused-vars
    ...props,
    name,
    value,
    onChange: (event, value) => {
      onChange(value)
      if (onChangeFromField) {
        onChangeFromField(value)
      }
    }
  })
)
