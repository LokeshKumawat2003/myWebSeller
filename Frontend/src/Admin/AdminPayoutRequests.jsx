import React, { useEffect, useState } from 'react'
import { adminListPayoutRequests, adminApprovePayout, adminRejectPayout } from '../services/api'

export default function AdminPayoutRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    try {
      const res = await adminListPayoutRequests()
      setRequests(res || [])
    } catch (err) {
      console.error('load admin requests', err)
    }
  }

  useEffect(() => { load() }, [])

  const handleApprove = async (sellerId, requestId) => {
    setLoading(true)
    try {
      await adminApprovePayout(sellerId, requestId)
      await load()
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleReject = async (sellerId, requestId) => {
    const comment = prompt('Enter rejection comment (optional)') || ''
    setLoading(true)
    try {
      await adminRejectPayout(sellerId, requestId, comment)
      await load()
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Pending Payout Change Requests</h2>
      {requests.length === 0 && <div>No pending requests</div>}
      <ul>
        {requests.map(item => (
          <li key={`${item.sellerId}_${item.request._id}`} style={{ marginBottom: 12 }}>
            <div><strong>Seller:</strong> {item.storeName} ({item.user?.email})</div>
            <div><strong>Requested At:</strong> {new Date(item.request.requestedAt).toLocaleString()}</div>
            <div><strong>Old:</strong> <pre style={{ display: 'inline' }}>{JSON.stringify(item.request.old)}</pre></div>
            <div><strong>New:</strong> <pre style={{ display: 'inline' }}>{JSON.stringify(item.request.new)}</pre></div>
            <div style={{ marginTop: 6 }}>
              <button onClick={() => handleApprove(item.sellerId, item.request._id)} disabled={loading}>Approve</button>
              <button onClick={() => handleReject(item.sellerId, item.request._id)} disabled={loading} style={{ marginLeft: 8 }}>Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
