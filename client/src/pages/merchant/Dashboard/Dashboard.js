import React from 'react';
import _ from 'lodash';
import CustomAreaChart from './customAreaChart';
import CustomBarChart from './customBarChart';
import {
  Card,
  Feed,
  Icon,
  Dropdown,
  Button,
  Form,
  TextArea,
  Header,
} from 'semantic-ui-react';

const Feeds = [
  {
    view: 'Total Product',
    number: '246K',
    scale: '13.8%',
    icon: 'area graph',
    iconColor: 'red',
  },
  {
    view: 'Products Sold',
    number: '2453',
    scale: '13.8%',
    icon: 'usd',
    iconColor: 'green',
  },
  {
    view: 'Total Earnings',
    number: '$39K ',
    scale: '13.8%',
    icon: 'line graph',
    iconColor: 'blue',
  },

];

const getOptions = (number) =>
  _.times(number, (index) => ({
    key: `${options[index]}`,
    text: `${options[index]}`,
    value: `${options[index].toLowerCase()}`,
  }));

const options = [
  'Today',
  'Last Week',
  'Last Month',
  'Last 3 Month',
  'Last Year',
];


const data = [
  {
    name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
  },
  {
    name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
  },
  {
    name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
  },
  {
    name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
  },
  {
    name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
  },
  {
    name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
  },
  {
    name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
  },
];
const data2 = [
  {
    name: 'Page A', uv: 5000, pv: 2400, amt: 2400,
  },
  {
    name: 'Page B', uv: 3900, pv: 1398, amt: 2210,
  },
  {
    name: 'Page C', uv: 1000, pv: 9800, amt: 2290,
  },
  {
    name: 'Page D', uv: 4780, pv: 3908, amt: 2000,
  },
  {
    name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
  },
  {
    name: 'Page F', uv: 2990, pv: 3800, amt: 2500,
  },
  {
    name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
  },
];
const peopleData = [
  {
    image: '/images/avatar/small/jenny.jpg',
    data: '3 days ago',
    summary: 'Jenny Hess',
  },
  {
    image: '/images/avatar/small/jenny.jpg',
    data: '3 days ago',
    summary: 'Jenny Hess',
  },
  {
    image: '/images/avatar/small/jenny.jpg',
    data: '3 days ago',
    summary: 'Jenny Hess',
  },
  {
    image: '/images/avatar/small/jenny.jpg',
    data: '3 days ago',
    summary: 'Jenny Hess',
  },
  {
    image: '/images/avatar/small/jenny.jpg',
    data: '3 days ago',
    summary: 'Jenny Hess',
  },
];
const Dashboard = () => {
  return (
    <>
      <section id='section-card'>
        <Card fluid>
          <Card.Content>
            <Card.Header>Recent Activity</Card.Header>
            <div id='dropdown-select'>
              <Dropdown
                placeholder='Select'
                search
                selection
                options={getOptions(5)}
              />
            </div>
          </Card.Content>
          {
            Feeds.map((feed) => (
              <Card.Content key={feed.view}>
                <Feed>
                  <Feed.Event>
                    <Feed.Label>
                      <Icon circular name={feed.icon}
                        color={feed.iconColor} size='big'/>
                    </Feed.Label>
                    <Feed.Content>
                      <Feed.Date content={feed.view} />
                      <Feed.Summary
                        className={
                          feed.view === 'Total Earnings' ?
                            'light-green-text' : ''
                        }>
                        {feed.number}
                      </Feed.Summary>
                      <Feed.Like>
                        <Icon name='like' />
                        {feed.scale}
                      </Feed.Like>
                    </Feed.Content>
                  </Feed.Event>
                </Feed>
              </Card.Content>
            ))
          }
          <Card.Content extra>
            <Button
              content='View Complete Report'
              color='blue'
            />
          </Card.Content>
        </Card>
      </section>

      <section id='section-card-info'>
        <Card.Group>
          <Card color='orange' raised>
            <Card.Content>
              <Feed>
                <Feed.Event>
                  <Feed.Label>
                    <Icon
                      loading
                      name='certificate'
                      color='red'
                    />
                  </Feed.Label>
                  <Feed.Content>
                    <Feed.Date>Best Selling Product</Feed.Date>
                  </Feed.Content>
                </Feed.Event>
              </Feed>
            </Card.Content>

            <Card.Content>
              <Feed>
                <Feed.Event>
                  <Feed.Label className='label-info'>
                    <Icon circular name='arrow alternate circle up outline'
                      color='blue' size='big'/>
                  </Feed.Label>
                  <Feed.Content>
                    <Feed.Date content='Beans' />
                    <Feed.Summary className='card-info'>
                      $39K
                    </Feed.Summary>
                    <Feed.Like>
                      <Icon name='like' />
                      13.8%
                    </Feed.Like>
                  </Feed.Content>
                </Feed.Event>

                <CustomAreaChart
                  fillColor='#8884d8'
                  data={data}
                  id='custom-area-chart'
                />
                {
                  peopleData.map((d, i) => (
                    <Feed.Event
                      key={i}
                      image={d.image}
                      data={d.data}
                      summary={d.summary}
                    />
                  ))
                }
              </Feed>
            </Card.Content>
            <Card.Content extra>
              <Button
                icon labelPosition='right'
                color='blue'
              >
              View complete report
                <Icon name='right arrow' />
              </Button>
            </Card.Content>
          </Card>

          <Card color='yellow' raised>
            <Card.Content>
              <Feed>
                <Feed.Event>
                  <Feed.Label>
                    <Icon loading name='money' color='green'/>
                  </Feed.Label>
                  <Feed.Content>
                    <Feed.Date>Top Buyers</Feed.Date>
                  </Feed.Content>
                </Feed.Event>
              </Feed>
            </Card.Content>
            <Card.Content>
              <Feed>
                <Feed.Event>
                  <Feed.Label className='label-info'>
                    <Icon circular name='circle outline'
                      color='blue' size='big'/>
                  </Feed.Label>
                  <Feed.Content>
                    <Feed.Date content='New Accounts since last month' />
                    <Feed.Summary className='card-info'>
                      9%
                    </Feed.Summary>
                    <Feed.Like>
                      <Icon name='like' />
                      13.8%
                    </Feed.Like>
                  </Feed.Content>
                </Feed.Event>

                <CustomAreaChart
                  fillColor='#82ca9d'
                  data={data2}
                />

                {
                  peopleData.map((d, i) => (
                    <Feed.Event
                      key={i}
                      image={d.image}
                      data={d.data}
                      summary={d.summary}
                    />
                  ))
                }
              </Feed>
            </Card.Content>
            <Card.Content extra>
              <Button
                icon labelPosition='right'
                color='blue'
              >
              View complete report
                <Icon name='right arrow' />
              </Button>
            </Card.Content>
          </Card>

          <Card color='red' raised>
            <Card.Content>
              <Card.Header>Review</Card.Header>
            </Card.Content>
            <Card.Content>
              <Feed>
                <Feed.Event>
                  <Feed.Label className='label-info'>
                    <Icon circular name='arrow alternate circle up outline'
                      color='blue' size='big'/>
                  </Feed.Label>
                  <Feed.Content>
                    <Feed.Date content='Capital Gains' />
                    <Feed.Summary className='card-info'>
                      $39K
                    </Feed.Summary>
                    <Feed.Like>
                      <Icon name='like' />
                      13.8%
                    </Feed.Like>
                  </Feed.Content>
                </Feed.Event>

                <Feed.Event style={{marginTop: '2rem', marginBottom: '2rem'}}>
                  <Feed.Label className='label-info'>
                    <Icon circular name='arrow alternate circle up outline'
                      color='blue' size='big'/>
                  </Feed.Label>
                  <Feed.Content>
                    <Feed.Date content='Withdrawals' />
                    <Feed.Summary className='card-info'>
                      $39K
                    </Feed.Summary>
                    <Feed.Like>
                      <Icon name='like' />
                      13.8%
                    </Feed.Like>
                  </Feed.Content>
                </Feed.Event>

                <CustomBarChart />
              </Feed>
            </Card.Content>
            <Card.Content extra>
              <Button
                icon labelPosition='right'
                color='blue'
              >
              View complete report
                <Icon name='right arrow' />
              </Button>
            </Card.Content>
          </Card>
        </Card.Group>
      </section>

      <section id='section-form'>
        <Card.Group stackable>
          <Card color='blue' raised >
            <Header as='h4'>
              <Header.Content>
              Resolve Issue
                <Header.Subheader>
                  send a message to Admin
                </Header.Subheader>
              </Header.Content>
            </Header>
            <Form>
              <Form.Field required>
                <label>Description of the issue</label>
                <TextArea
                  id='form-textarea-control-Description'
                  name='description'
                  placeholder='Description'
                  style={{minHeight: '126px'}}
                />
              </Form.Field>
              <Button
                color='blue'
                content='Send'
              />
            </Form>
          </Card>

          <Card id='advertise-form' raised>
            <Header as='h4'>
              <Header.Content>
                Advertise
                <Header.Subheader>
                  Add your product to featured product
                </Header.Subheader>
              </Header.Content>
            </Header>
            <Form>
              <Form.Field required>
                <label >Description</label>
                <TextArea
                  id='form-textarea-control-Description'
                  name='description'
                  placeholder='Description'
                />
              </Form.Field>
              <Button.Group>
                <Button>Upload Image</Button>
                <Button.Or />
                <Button positive>Upload video</Button>
              </Button.Group>
              <div style={{marginTop: '1rem'}}>
                <Button
                  color='blue'
                  content='Confirm'
                />
              </div>
            </Form>
          </Card>
          <Card id='advertise-form' raised>
            <Header as='h4'>
              <Header.Content>
                Advertise
                <Header.Subheader>
                  Add your product to featured product
                </Header.Subheader>
              </Header.Content>
            </Header>
            <Form>
              <Form.Field required>
                <label >Description</label>
                <TextArea
                  id='form-textarea-control-Description'
                  name='description'
                  placeholder='Description'
                />
              </Form.Field>
              <Button
                color='blue'
                content='Confirm'
              />
            </Form>
          </Card>
        </Card.Group>
      </section>
      <div id='portfolio' />
    </>
  );
};

export default Dashboard;
