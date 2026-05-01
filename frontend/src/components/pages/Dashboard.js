import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/tasks', {
          headers: { 'User-ID': userId }
        });
        setTasks(response.data);
      } catch (err) {
        console.error("Fetch error", err);
      }
    };
    fetchTasks();
  }, [userId]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Projects & Tasks</h1>
        <button onClick={() => { localStorage.clear(); window.location.href='/login'; }} className="text-red-500">Logout</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Pending', 'In Progress', 'Done'].map(status => (
          <div key={status} className="bg-gray-50 p-4 rounded border">
            <h2 className="font-bold border-b mb-3 pb-1">{status}</h2>
            {tasks.filter(t => t.status === status).map(task => (
              <div key={task.id} className="bg-white p-3 mb-2 rounded shadow-sm border-l-4 border-blue-500">
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-gray-500">{task.project}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;