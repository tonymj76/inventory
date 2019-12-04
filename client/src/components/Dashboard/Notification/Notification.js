import React, {Component} from 'react';
import {Icon, Dropdown} from 'semantic-ui-react';
import './Notification.scss';

const menuDropdownStyle = {
  marginRight: '-65px',
};
const iconStyle = {
  margin: '0 10px 0 0',
};

class Notification extends Component {
  newNotification = (numOfNew) => (
    <div className="new-notification">
      <span>{numOfNew}</span>
    </div>
  );

  trigger = (icon, numOfNew) => (
    <div>
      <i className={icon} style={iconStyle}/>
      {numOfNew > 0 ? this.newNotification(numOfNew) : null}
    </div>
  );

  render() {
    const {icon, numOfNew} = this.props;
    return (
      <Dropdown trigger={this.trigger(icon, numOfNew)} icon={false} pointing>
        <Dropdown.Menu style={menuDropdownStyle}>
          <Dropdown.Header icon="tags" content="Filter by tag" />
          <Dropdown.Divider />
          <Dropdown.Item>
            <Icon name="attention" className="right floated" />
            Important
          </Dropdown.Item>
          <Dropdown.Item>
            <Icon name="comment" className="right floated" />
            Announcement
          </Dropdown.Item>
          <Dropdown.Item>
            <Icon name="conversation" className="right floated" />
            Discussion
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default Notification;

