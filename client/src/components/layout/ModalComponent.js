import React, {PureComponent} from 'react';
import {Button,
  Modal,
  Icon,
  Form,
  Input,
} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {removeCategory, updateCategory} from 'actions';
import PropTypes from 'prop-types';

class ModalComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      updateName: this.props.name,
      error: false,
    };
  }

  show = (action) => () => this.setState({
    open: true,
    action,
  })

  close = () => this.setState({open: false})

  handleRemoveCategory = (id, fn) => {
    fn(id);
    this.setState({
      loading: true,
    });
  }

  handleUpdateCategory = (e, {value}) => {
    this.setState({
      updateName: value,
    });

    if (value === '' || value.length >=1) {
      this.setState({
        error: false,
      });
    }
  }

  handleUpdate = () => {
    const {updateName} = this.state;
    if (updateName.length > 2) {
      this.props.updateCategory(
        {
          name: updateName,
          id: this.props.id,
        });
      this.close();
    } else {
      this.setState({
        error: true,
      });
    }
  }

  render() {
    const {
      open,
      action,
      loading,
      error,
      updateName,
    } = this.state;
    const {
      id,
      name,
      size='mini',
      removeCategory=(f)=>f,
    } = this.props;
    return (
      <div>
        <Button.Group size='mini'>
          <Button
            onClick={this.show(false)}
            size= 'mini'
          >
            <Icon
              name='undo alternate'
              color='blue'
            />
          </Button>
          <Button.Or size='mini'/>
          <Button
            onClick={this.show(true)}
            animated
            size= 'mini'
          >
            <Icon
              name='trash'
              color='red'
            />
          </Button>
        </Button.Group>

        {action ? (
          <Modal size={size} open={open} onClose={this.close}>
            <Modal.Header>{`Delete "${name}"?`}</Modal.Header>
            <Modal.Content>
              <p>Are you sure?</p>
            </Modal.Content>
            <Modal.Actions>
              <Button
                onClick={this.close}
                positive
              >
              No
              </Button>
              <Button
                negative
                color='red'
                icon='checkmark'
                labelPosition='right'
                content='Yes'
                loading={loading}
                onClick={
                  ()=> this.handleRemoveCategory(id, removeCategory)
                }
              />
            </Modal.Actions>
          </Modal>
        ): (
          <Modal size='small' open={open} onClose={this.close}>
            <Modal.Header>{`Update  "${updateName}"?`}</Modal.Header>
            <Modal.Content>
              <Form>
                <Form.Field
                  error={error ? ({content: 'Invalid Name'}) : (error)}
                  id='form-input-update-category'
                  control={Input}
                  label='Update Category'
                  placeholder={updateName}
                  required
                  onChange={this.handleUpdateCategory}
                />
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button
                onClick={this.close}
                positive
              >
              Close
              </Button>
              <Button
                negative
                disabled = {error? true : false}
                icon='checkmark'
                labelPosition='right'
                content='Update'
                onClick={this.handleUpdate}
              />
            </Modal.Actions>
          </Modal>
        )}
      </div>
    );
  }
}

ModalComponent.proptypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.string,
  removeCategory: PropTypes.func.isRequired,
  updateCategory: PropTypes.func.isRequired,
};

export default connect(
  null,
  {
    removeCategory,
    updateCategory,
  }
)(ModalComponent);
