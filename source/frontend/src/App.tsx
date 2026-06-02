import { useState, useEffect } from 'react';
import './App.css';

interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  department: string;
  position: string;
  hireDate: string;
  status: string;
}

function App() {
  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'light');
  const [currentRole, setCurrentRole] = useState<string>('Employee');

  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number | ''>('');
  
  const [department, setDepartment] = useState('IT');
  const [position, setPosition] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [status, setStatus] = useState('Active');

  const [users, setUsers] = useState<User[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [showDetailedTable, setShowDetailedTable] = useState<boolean>(false);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };
  
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5173/users');
      if (response.ok) {
        const responseText = await response.text();
        const data = responseText ? JSON.parse(responseText) : [];
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to communicate with NestJS server:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('');

    const payload = {
      id: userId,
      name,
      email,
      department,
      position: position || 'Staff Specialist',
      hireDate: hireDate || new Date().toISOString().split('T')[0],
      status,
      ...(age ? { age: Number(age) } : {}) 
    };

    try {
      const response = await fetch('http://localhost:5173/users', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      const result = responseText ? JSON.parse(responseText) : {};

      if (!response.ok) {
        const errorMsg = Array.isArray(result.message) ? result.message.join(', ') : result.message;
        throw new Error(errorMsg || 'Failed to register record.');
      }

      const finalName = result.name || name;
      setStatusMessage(`✅ Employee ${finalName} added successfully!`);
      
      setUserId('');
      setName('');
      setEmail('');
      setAge('');
      setPosition('');
      setHireDate('');
      setDepartment('IT');
      setStatus('Active');
      fetchUsers();
    } catch (err: any) {
      setStatusMessage(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className={`app-container ${theme}`}>
      <header>
        <h1>OrgSphere Portal</h1>
        
        <div className="control-panel">
          <button 
            onClick={() => setShowDetailedTable(!showDetailedTable)} 
            style={{ backgroundColor: showDetailedTable ? '#28a745' : '', fontWeight: 'bold' }}
          >
            📋 informations
          </button>

          <button onClick={toggleTheme}>
            Mode: {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>

          <div>
            <label htmlFor="role-select" style={{ marginRight: '8px', fontWeight: 'bold' }}>Role:</label>
            <select 
              id="role-select" 
              value={currentRole} 
              onChange={(e) => setCurrentRole(e.target.value)}
              style={{ padding: '6px', borderRadius: '4px' }}
            >
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>
        </div>
      </header>

      <main>
        <h3>Active Working Session: <span style={{ color: '#007bff' }}>{currentRole}</span></h3>

        {showDetailedTable && (
          <section className="detailed-table-section" style={{ marginBottom: '30px' }}>
            <h4>Detailed Corporate Directory Matrix</h4>
            {users.length === 0 ? (
              <p>No records available to render in database rows.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #dee2e6', color: '#333' }}>
                    <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>ID</th>
                    <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Full Name</th>
                    <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Department</th>
                    <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Position</th>
                    <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Email</th>
                    <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Age</th>
                    <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Hire Date</th>
                    <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '10px', border: '1px solid #dee2e6', fontFamily: 'monospace' }}>{user.id}</td>
                      <td style={{ padding: '10px', border: '1px solid #dee2e6', fontWeight: 'bold' }}>{user.name}</td>
                      <td style={{ padding: '10px', border: '1px solid #dee2e6' }}><span className="badge-dept" style={{ background: '#e9ecef', padding: '3px 6px', borderRadius: '4px' }}>{user.department}</span></td>
                      <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{user.position}</td>
                      <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{user.email}</td>
                      <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{user.age || '—'}</td>
                      <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{user.hireDate}</td>
                      <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>
                        <span style={{ color: user.status === 'Active' ? 'green' : user.status === 'Remote' ? 'blue' : 'orange', fontWeight: 'bold' }}>
                          ● {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <hr style={{ marginTop: '25px', borderColor: 'rgba(0,0,0,0.1)' }} />
          </section>
        )}

        {currentRole === 'Administrator' ? (
          <div className="form-section">
            <h4>Add New Corporate Employee</h4>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>System String ID:</label>
                <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="e.g., emp_05" required />
              </div>
              <div className="form-group">
                <label>Full Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ivan Ivanov" required />
              </div>
              <div className="form-group">
                <label>Corporate Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ivan@org.ru" required />
              </div>
              <div className="form-group">
                <label>Age (Optional):</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Min value 18" />
              </div>

              <div className="form-group">
                <label>Corporate Department:</label>
                <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="HR">Human Resources (HR)</option>
                  <option value="Sales">Commercial & Sales</option>
                  <option value="Finance">Accounting & Finance</option>
                </select>
              </div>
              <div className="form-group">
                <label>Corporate Position / Title:</label>
                <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="e.g., Senior Engineer" />
              </div>
              <div className="form-group">
                <label>Official Hire Date:</label>
                <input type="date" value={hireDate} onChange={(e) => setHireDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Employment Operational Status:</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Active">Active On-Site</option>
                  <option value="Remote">Full Remote</option>
                  <option value="On Leave">On Official Leave</option>
                </select>
              </div>

              <button type="submit">Register Record</button>
            </form>
            {statusMessage && <p style={{ marginTop: '15px', fontWeight: '500' }}>{statusMessage}</p>}
          </div>
        ) : (
          <div style={{ padding: '15px', background: 'rgba(255,165,0,0.1)', borderRadius: '6px', marginBottom: '20px', maxWidth: '500px' }}>
            ℹ️ Registration forms are locked. Switch your active session dropdown to <strong>Administrator</strong> to add profiles.
          </div>
        )}

        <section>
          <h4>Corporate Directory Registry ({users.length} Users Found)</h4>
          {users.length === 0 ? (
            <p>No records stored in backend memory.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
              {users.map((user) => (
                <div key={user.id} className="user-card" style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '6px' }}>
                  <strong>{user.name}</strong> (ID: {user.id})
                  <br /><small style={{ color: '#666' }}>{user.position} — <strong>{user.department}</strong></small>
                  <br />Email: {user.email}
                  <br /><small>Hired: {user.hireDate} | Status: {user.status}</small>
                  {user.age && <><br /><span>Age: {user.age}</span></>}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
