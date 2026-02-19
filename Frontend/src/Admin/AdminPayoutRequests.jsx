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
    <div className="bg-[#fbf7f2] rounded-xl shadow-md border border-[#e6ddd2] p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#e6ddd2] rounded-lg">
          <svg className="w-5 h-5 text-[#9c7c3a]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 12h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 20v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 className="text-lg md:text-xl font-light italic text-[#3b3b3b] font-serif">Pending Payout Change Requests</h2>
      </div>

      {requests.length === 0 && <div className="text-sm text-gray-500">No pending requests</div>}

      <div className="space-y-4">
        {requests.map(item => (
          <div key={`${item.sellerId}_${item.request._id}`} className="border border-[#e6ddd2] rounded-lg bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-500">Seller</div>
                <div className="text-base font-medium">{item.storeName} <span className="text-sm text-gray-500">({item.user?.email})</span></div>
                <div className="text-xs text-gray-400 mt-1">Requested At: {new Date(item.request.requestedAt).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleApprove(item.sellerId, item.request._id)} disabled={loading} className="px-4 py-2 bg-[#9c7c3a] text-white rounded hover:bg-[#8a6a2f] disabled:opacity-50">Approve</button>
                <button onClick={() => handleReject(item.sellerId, item.request._id)} disabled={loading} className="px-4 py-2 bg-white border border-[#e6ddd2] text-[#3b3b3b] rounded hover:bg-gray-50 disabled:opacity-50">Reject</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-sm text-gray-500 mb-2">Old</div>
                {item.request.old?.bank ? (
                  <div className="text-sm text-gray-700 space-y-1">
                    <div><span className="text-xs text-gray-500">Account Name:</span> <span className="font-medium">{item.request.old.bank.accountName || '-'}</span></div>
                    <div><span className="text-xs text-gray-500">Account Number:</span> <span className="font-medium">{item.request.old.bank.accountNumber || '-'}</span></div>
                    <div><span className="text-xs text-gray-500">IFSC:</span> <span className="font-medium">{item.request.old.bank.ifsc || '-'}</span></div>
                    <div><span className="text-xs text-gray-500">Bank:</span> <span className="font-medium">{item.request.old.bank.bankName || '-'}</span></div>
                  </div>
                ) : <div className="text-sm text-gray-500">No bank data</div>}
                {item.request.old?.upi && (
                  <div className="mt-2"><div className="text-xs text-gray-500">UPI ID</div><div className="font-medium">{item.request.old.upi.upiId || '-'}</div></div>
                )}
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-2">New</div>
                {item.request.new?.bank ? (
                  <div className="text-sm text-gray-700 space-y-1">
                    <div><span className="text-xs text-gray-500">Account Name:</span> <span className="font-medium">{item.request.new.bank.accountName || '-'}</span></div>
                    <div><span className="text-xs text-gray-500">Account Number:</span> <span className="font-medium">{item.request.new.bank.accountNumber || '-'}</span></div>
                    <div><span className="text-xs text-gray-500">IFSC:</span> <span className="font-medium">{item.request.new.bank.ifsc || '-'}</span></div>
                    <div><span className="text-xs text-gray-500">Bank:</span> <span className="font-medium">{item.request.new.bank.bankName || '-'}</span></div>
                  </div>
                ) : <div className="text-sm text-gray-500">No bank data</div>}
                {item.request.new?.upi && (
                  <div className="mt-2"><div className="text-xs text-gray-500">UPI ID</div><div className="font-medium">{item.request.new.upi.upiId || '-'}</div></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
