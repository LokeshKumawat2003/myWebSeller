import React, { useEffect, useState } from 'react'
import { sellerSetPayout, sellerGetPayoutRequests } from '../services/api'

export default function SellerPayout() {
  const [bank, setBank] = useState({ accountName: '', accountNumber: '', ifsc: '', bankName: '' })
  const [upi, setUpi] = useState('')
  const [loading, setLoading] = useState(false)
  const [payout, setPayout] = useState(null)
  const [requests, setRequests] = useState([])
  const [message, setMessage] = useState('')

  const load = async () => {
    try {
      const res = await sellerGetPayoutRequests()
      setPayout(res.payout || null)
      setRequests(res.requests || [])
    } catch (err) {
      console.error('load payout', err)
    }
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const payload = { bank: null, upi: null }
    if (bank.accountNumber) payload.bank = bank
    if (upi) payload.upi = { upiId: upi }
    try {
      const res = await sellerSetPayout(payload)
      setMessage(res.message || 'Submitted')
      await load()
    } catch (err) {
      setMessage(err.message || 'Error')
    } finally { setLoading(false) }
  }

  return (
    <div className="bg-[#fbf7f2] rounded-xl shadow-md border border-[#e6ddd2] p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#e6ddd2] rounded-lg">
          <svg className="w-5 h-5 text-[#9c7c3a]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 12h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 20v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 className="text-lg md:text-xl font-light italic text-[#3b3b3b] font-serif">Payout Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mb-4">
        <div>
          <label className="block text-sm font-light italic text-[#3b3b3b] mb-2 flex items-center gap-2 font-serif">Bank Account</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Account Name" className="w-full px-4 py-3 border border-[#e6ddd2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#9c7c3a]" value={bank.accountName} onChange={e=>setBank({...bank, accountName: e.target.value})} />
            <input placeholder="Account Number" className="w-full px-4 py-3 border border-[#e6ddd2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#9c7c3a]" value={bank.accountNumber} onChange={e=>setBank({...bank, accountNumber: e.target.value})} />
            <input placeholder="IFSC" className="w-full px-4 py-3 border border-[#e6ddd2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#9c7c3a]" value={bank.ifsc} onChange={e=>setBank({...bank, ifsc: e.target.value})} />
            <input placeholder="Bank Name" className="w-full px-4 py-3 border border-[#e6ddd2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#9c7c3a]" value={bank.bankName} onChange={e=>setBank({...bank, bankName: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-light italic text-[#3b3b3b] mb-2 flex items-center gap-2 font-serif">UPI</label>
          <input placeholder="example@upi" className="w-full px-4 py-3 border border-[#e6ddd2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#9c7c3a]" value={upi} onChange={e=>setUpi(e.target.value)} />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-3 bg-[#9c7c3a] hover:bg-[#8a6a2f] disabled:bg-[#e6ddd2] text-white disabled:text-[#666] rounded-lg font-light italic transition-colors disabled:cursor-not-allowed font-serif">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : 'Save Payout / Request Change'}
          </button>
          <button type="button" onClick={load} className="text-sm text-gray-600">Refresh</button>
        </div>
      </form>

      {message && (
        <div className={`mb-4 p-3 rounded-lg border ${message.includes('Error') ? 'bg-[#e6ddd2] border-[#9c7c3a] text-[#3b3b3b]' : 'bg-[#fbf7f2] border-[#e6ddd2] text-[#666]'}`}>
          <div className="flex items-center gap-2">{message}</div>
        </div>
      )}

      <h3 className="text-md font-medium mb-2">Current Payout</h3>
      <div className="mb-6">
        {payout ? (
          <div className="bg-white border border-[#e6ddd2] rounded-lg p-3 text-sm text-gray-800">
            {payout.bank ? (
              <div className="space-y-1">
                <div><span className="text-xs text-gray-500">Account Name:</span> <span className="font-medium">{payout.bank.accountName || '-'}</span></div>
                <div><span className="text-xs text-gray-500">Account Number:</span> <span className="font-medium">{payout.bank.accountNumber || '-'}</span></div>
                <div><span className="text-xs text-gray-500">IFSC:</span> <span className="font-medium">{payout.bank.ifsc || '-'}</span></div>
                <div><span className="text-xs text-gray-500">Bank:</span> <span className="font-medium">{payout.bank.bankName || '-'}</span></div>
              </div>
            ) : null}
            {payout.upi ? (
              <div className="mt-2"><span className="text-xs text-gray-500">UPI ID:</span> <span className="font-medium">{payout.upi.upiId || '-'}</span></div>
            ) : null}
            {!payout.bank && !payout.upi && <div className="text-sm text-gray-500">No payout set</div>}
          </div>
        ) : (
          <div className="text-sm text-gray-500">No payout set</div>
        )}
      </div>

      <h3 className="text-md font-medium mb-2">Your Requests</h3>
      <div className="space-y-3">
        {requests.length === 0 && <div className="text-sm text-gray-500">No requests</div>}
        {requests.map(r => (
          <div key={r._id} className="border border-[#e6ddd2] rounded p-3 bg-white">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">Status: <span className="font-normal">{r.status}</span></div>
              <div className="text-xs text-gray-500">{new Date(r.requestedAt).toLocaleString()}</div>
            </div>
            <div className="mt-2 text-sm">
              <div className="text-xs text-gray-500">Requested By:</div>
              <div className="font-medium">{r.requestedBy?.name || r.requestedBy?.email || 'You'}</div>

              {r.new?.bank && (
                <div className="mt-2">
                  <div className="text-xs text-gray-500">Account Name</div>
                  <div className="font-medium">{r.new.bank.accountName || '-'}</div>
                  <div className="text-xs text-gray-500">Account Number</div>
                  <div className="font-medium">{r.new.bank.accountNumber || '-'}</div>
                  <div className="text-xs text-gray-500">IFSC</div>
                  <div className="font-medium">{r.new.bank.ifsc || '-'}</div>
                  <div className="text-xs text-gray-500">Bank Name</div>
                  <div className="font-medium">{r.new.bank.bankName || '-'}</div>
                </div>
              )}

              {r.new?.upi && (
                <div className="mt-2">
                  <div className="text-xs text-gray-500">UPI ID</div>
                  <div className="font-medium">{r.new.upi.upiId || '-'}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
