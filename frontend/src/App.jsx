import { useState, useEffect } from 'react'
import { apiFetch } from './lib/api'

function App() {
  const [workflows, setWorkflows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [response, setResponse] = useState('')

  // Form states
  const [workflowName, setWorkflowName] = useState('')
  const [workflowTriggerEvent, setWorkflowTriggerEvent] = useState('USER_SIGNUP')
  const [actionType, setActionType] = useState('EMAIL')
  const [actionConfig, setActionConfig] = useState('{"recipient": "test@example.com", "subject": "Test", "body": "Test body"}')

  // Trigger form states
  const [eventType, setEventType] = useState('USER_SIGNUP')
  const [triggerPayload, setTriggerPayload] = useState('{"userId": "123", "email": "test@example.com"}')

  // Fetch workflows on load
  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/workflows`)
      const data = await res.json()
      // Ensure data is an array
      setWorkflows(Array.isArray(data) ? data : [])
      setError('')
    } catch (err) {
      setError('Failed to fetch workflows: ' + err.message)
      setWorkflows([])
    }
    setLoading(false)
  }

  const createWorkflow = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const config = JSON.parse(actionConfig)
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/workflows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: workflowName,
          triggerEvent: workflowTriggerEvent,
          actions: [{ type: actionType, config }]
        })
      })
      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))
      setError('')
      setWorkflowName('')
      fetchWorkflows()
    } catch (err) {
      setError('Error: ' + err.message)
      setResponse('')
    }
    setLoading(false)
  }

  const activateWorkflow = async (id) => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/workflows/${id}/activate`, {
        method: 'POST'
      })
      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))
      setError('')
      fetchWorkflows()
    } catch (err) {
      setError('Error: ' + err.message)
    }
    setLoading(false)
  }

  const handleTriggerEvent = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = JSON.parse(triggerPayload)
      const res = await fetch('https://workflow-automation-engine-7mwb.onrender.com/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: eventType,
          payload
        })
      })
      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))
      setError('')
    } catch (err) {
      setError('Error: ' + err.message)
      setResponse('')
    }
    setLoading(false)
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Workflow Automation Engine</h1>
        <p>Create, manage, and trigger automated workflows</p>
      </div>


      <div className="card">
        <h2>Create New Workflow</h2>
        <form onSubmit={createWorkflow}>
          <div className="form-group">
            <label>Workflow Name</label>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="My Workflow"
              required
            />
          </div>
          <div className="form-group">
            <label>Trigger Event</label>
            <select
              value={workflowTriggerEvent}
              onChange={(e) => setWorkflowTriggerEvent(e.target.value)}
            >
              <option value="USER_SIGNUP">User Signup</option>
              <option value="USER_LOGIN">User Login</option>
              <option value="ORDER_CREATED">Order Created</option>
              <option value="PAYMENT_RECEIVED">Payment Received</option>
            </select>
          </div>
          <div className="form-group">
            <label>Action Type</label>
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
            >
              <option value="EMAIL">Send Email</option>
              <option value="WEBHOOK">Call Webhook</option>
              <option value="SLACK">Send Slack Message</option>
            </select>
          </div>
          <div className="form-group">
            <label>Action Config (JSON)</label>
            <textarea
              value={actionConfig}
              onChange={(e) => setActionConfig(e.target.value)}
              rows={4}
              required
            />
          </div>
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Creating...' : 'Create Workflow'}
          </button>
        </form>
      </div>


      <div className="card">
        <h2>Workflows ({workflows.length})</h2>
        {loading && workflows.length === 0 ? (
          <div className="loading">Loading workflows...</div>
        ) : (
          <div className="workflow-list">
            {workflows.map((workflow) => (
              <div key={workflow.id} className={`workflow-item ${workflow.status === 'ACTIVE' ? 'active' : ''}`}>
                <h3>{workflow.name}</h3>
                <p><strong>Trigger:</strong> {workflow.trigger?.eventType}</p>
                <p><strong>Actions:</strong> {workflow.actions?.length || 0}</p>
                <span className={`status ${workflow.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                  {workflow.status}
                </span>
                {workflow.status === 'INACTIVE' && (
                  <button
                    className="button"
                    style={{ marginTop: '10px', marginLeft: '10px' }}
                    onClick={() => activateWorkflow(workflow.id)}
                    disabled={loading}
                  >
                    Activate
                  </button>
                )}
              </div>
            ))}
            {workflows.length === 0 && !loading && (
              <p style={{ color: '#666' }}>No workflows created yet</p>
            )}
          </div>
        )}
      </div>


      <div className="card trigger-section">
        <h2>⚡ Trigger Event</h2>
        <form onSubmit={handleTriggerEvent}>
          <div className="form-group">
            <label>Event Type</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              <option value="USER_SIGNUP">User Signup</option>
              <option value="USER_LOGIN">User Login</option>
              <option value="ORDER_CREATED">Order Created</option>
              <option value="PAYMENT_RECEIVED">Payment Received</option>
            </select>
          </div>
          <div className="form-group">
            <label>Payload (JSON)</label>
            <textarea
              value={triggerPayload}
              onChange={(e) => setTriggerPayload(e.target.value)}
              rows={4}
              required
            />
          </div>
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Triggering...' : 'Trigger Event'}
          </button>
        </form>
      </div>


      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}
      {response && (
        <div className="response">
          <pre>{response}</pre>
        </div>
      )}
    </div>
  )
}

export default App
