import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const Charts = ({ complaints }) => {
  // Process data for department-wise issues
  const departmentData = complaints.reduce((acc, complaint) => {
    const dept = complaint.department || 'Unassigned';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const departmentChartData = Object.entries(departmentData).map(([department, count]) => ({
    department,
    count
  }));

  // Process data for SLA breaches
  const now = new Date();
  const slaBreachData = complaints.reduce((acc, complaint) => {
    if (complaint.dueAt) {
      const isBreached = new Date(complaint.dueAt) < now && complaint.status !== 'resolved';
      const status = isBreached ? 'Breached' : 'On Time';
      acc[status] = (acc[status] || 0) + 1;
    }
    return acc;
  }, {});

  const slaChartData = Object.entries(slaBreachData).map(([status, count]) => ({
    status,
    count
  }));

  // Process data for status distribution
  const statusData = complaints.reduce((acc, complaint) => {
    acc[complaint.status] = (acc[complaint.status] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    status: status.replace('_', ' ').toUpperCase(),
    count
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Department-wise Issues Chart */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Department-wise Issues</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SLA Breaches Chart */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">SLA Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={slaChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, count, percent }) => `${status}: ${count} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {slaChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution Chart */}
      <div className="card bg-base-100 shadow lg:col-span-2">
        <div className="card-body">
          <h3 className="card-title">Complaint Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
