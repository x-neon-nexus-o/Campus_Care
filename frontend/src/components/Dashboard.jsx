function Dashboard({ role })
 {
  return <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</h2>;
}

export default Dashboard;