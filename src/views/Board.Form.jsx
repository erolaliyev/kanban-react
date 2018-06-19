import React from 'react'
import { withFormik } from 'formik'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { Modal, Button, Icon } from 'semantic-ui-react'
import { BoardForm as Form } from 'components/board'
import { api } from 'app/api'

async function saveBoard(board, component) {
  const { props, setSubmitting, setErrors, resetForm } = component
  const { history, dispatch } = props
  try {
    const { data } = await api.post('/board', board)
    resetForm()
    history.goBack('..')
    dispatch({ type: 'BOARD/LOAD', payload: data })
  } catch (error) {
    setSubmitting(false)
    setErrors(error)
  }
}

@withRouter
@connect(
  (state) => ({}),
  (dispatch) => ({
    dispatch: dispatch
  })
)
@withFormik({
  mapPropsToValues: () => ({ color: 'grey' }),
  handleSubmit: saveBoard
})
export class BoardForm extends React.PureComponent {

  render() {
    const { location, handleSubmit, isSubmitting, ...props } = this.props
    return (
      <Modal open style={{ top: 30 }}>
        <Modal.Header icon='browser' content="New Board" />
        <Modal.Content>
          <Form {...props} />
        </Modal.Content>
        <Modal.Actions>
          <Link to={location?.query?.backTo || '..'}>
            <Button><Icon name='close' /> Cancel</Button>
          </Link>
          <Button type="submit" onClick={handleSubmit} positive disabled={isSubmitting}>
            <Icon name='checkmark' /> Save
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}