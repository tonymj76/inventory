import {AreaChart, Area, ResponsiveContainer} from 'recharts';
import React, {PureComponent} from 'react';

export default class CustomAreaChart extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/tv8zfzxo/';

  render() {
    const {fillColor, data} = this.props;
    return (
      <ResponsiveContainer height={250} width='100%'>
        <AreaChart
          data={data}
          margin={{
            top: 5, right: 0, left: 0, bottom: 5,
          }}
        >
          <Area
            type="monotone"
            dataKey="uv"
            stroke="#8884d8"
            fill={fillColor}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}
