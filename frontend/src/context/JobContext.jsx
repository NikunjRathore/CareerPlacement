import { createContext, useContext, useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const JobContext = createContext()

export const useJobs = () => {
  const context = useContext(JobContext)
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider')
  }
  return context
}

export function JobLayout() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs`)
        const data = await response.json()
        
        if (response.ok) {
          // Format the data to ensure the company name is easily accessible
          const formattedJobs = data.map(job => ({
            ...job,
            id: job._id // Map MongoDB _id to id for frontend consistency
          }))
          setJobs(formattedJobs)
        } else {
          console.error("Failed to fetch jobs:", data.message)
        }
      } catch (error) {
        console.error("Error loading jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  return (
    <JobContext.Provider value={{ jobs, loading, setJobs }}>
      {loading ? (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <Outlet />
      )}
    </JobContext.Provider>
  )
}