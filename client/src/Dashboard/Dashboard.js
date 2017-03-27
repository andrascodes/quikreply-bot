import React, { Component } from 'react'
import { BarChart, XAxis, YAxis, Bar, ResponsiveContainer, Tooltip, Pie, PieChart } from 'recharts'

import { createServiceApi } from '../lib/serviceApi' 

import './Dashboard.css'

import { 
  Panel as TotalUsers, 
  Panel as ActiveToday,
  Panel as ActiveMonthly,
  Panel as TotalMessages,
  Panel as AvgMessages,
  Panel as AvgLength,
  Panel as TotalErrors
} from './Panel'

export class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: {
        activeUsersByMonth: [],
        activeUsersLastMonth: 0,
        activeUsersToday: 0,
        activeUsersTwoMonthsAgo: 0,
        activeUsersYesterday: 0,
        totalUsers: 0
      },
      messages: {
        totalMessages: 0,
        avgMessages: 0,
        avgLength: '',
        outgoingMessages: 0,
        deliveredAndReadMessages: 0,
        deliveredNotReadMessages: 0,
        notDeliveredMessages: 0,
        messageErrors: 0
      }
    }
  }
  
  loadDashboard = createServiceApi(fetch, 'http://localhost:5000/api').loadDashboard

  componentDidMount() {
    this.loadDashboard()
    .then(data => 
      this.setState(state => ({
        ...data
      }))
    )
  }

  renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x  = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy  + radius * Math.sin(-midAngle * RADIAN)
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  render() {

    return (
      <div className="container-fluid">
        <h1>Dashboard</h1>

        <div className="row Dashboard">
          <div className="UserChart Chart">
            <h3 className="text-center" >Active Users By Month</h3>
            <ResponsiveContainer width="80%" minHeight={360} height="80%" style={{ margin: 'auto' }}>
              <BarChart data={this.state.users.activeUsersByMonth} >
                <XAxis dataKey="month"/>
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4 col-md-4">
            <TotalUsers 
              icon={'fa-users'}
              number={this.state.users.totalUsers}
              label={`Total Users`}
            />
          </div>
          
          <div className="col-lg-4 col-md-4">
            <ActiveToday 
              icon={'fa-user'}
              number={this.state.users.activeUsersToday}
              previous={this.state.users.activeUsersYesterday}
              label={`Active Users Today`}
            />
          </div>

          <div className="col-lg-4 col-md-4">
            <ActiveMonthly
              icon={'fa-user-circle-o'}
              number={this.state.users.activeUsersLastMonth}
              previous={this.state.users.activeUsersTwoMonthsAgo}
              label={`Active Users This Month`}
            />
          </div>
        </div>

        <div className="row">
          <div className="MessageChart Chart col-lg-12 col-md-12">
            <h3 className="text-center" >Delivered, Read, Undelivered Messages Ratio</h3>
            <ResponsiveContainer width="80%" minHeight={360} height="80%" style={{ margin: 'auto' }}>
              <PieChart width={730} height={250}>
                <Pie 
                  data={[
                    {
                      name: 'Delivered and Read',
                      value: this.state.messages.deliveredAndReadMessages
                    },
                    {
                      name: 'Delivered, but Not Read',
                      value: this.state.messages.deliveredNotReadMessages
                    },
                    {
                      name: 'Not Delivered',
                      value: this.state.messages.notDeliveredMessages
                    },
                  ]} 
                  cx="50%" cy="50%" 
                  outerRadius={125} fill="#31708f"
                  labelLine={false} label={this.renderCustomizedLabel}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="row">
            
          <div className="col-lg-4 col-md-4"></div>
          
          <div className="col-lg-4 col-md-4">
            <div className="TotalErrors">
              <TotalErrors 
                icon={'fa-exclamation-triangle'}
                number={this.state.messages.messageErrors}
                label={`No. of message errors`}
              />
            </div>
          </div>

          <div className="col-lg-4 col-md-4"></div>

        </div>

        <div className="row">
          <div className="col-lg-4 col-md-4">
            <TotalMessages 
              icon={'fa-comments'}
              number={this.state.messages.totalMessages}
              label={`Total Messages`}
            />
          </div>

          <div className="col-lg-4 col-md-4">
            <AvgMessages 
              icon={'fa-comment'}
              number={Number(this.state.messages.avgMessages).toFixed(2)}
              label={`Avg. no. messages in a conversation`}
            />
          </div>

          <div className="col-lg-4 col-md-4">
            <AvgLength 
              icon={'fa-commenting'}
              number={this.state.messages.avgLength}
              label={`Avg. length of a conversation`}
            />
          </div>
        </div>
       
      </div>
    )
  }
}