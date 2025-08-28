'use client'
import {   useGetActiveSessionQuery, useStopTimeTrackingMutation } from '@/lib/api/taskApi'
import React, { useEffect, useState, useRef } from 'react'
import dayjs from 'dayjs'
import durationPlugin from 'dayjs/plugin/duration'
import { Play, Pause } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setActiveSessionData, setTimerStarted } from '@/lib/kanbanSlice'
import { useAppSelector } from '@/hooks/redux'

dayjs.extend(durationPlugin)

interface SessionDetails{
    taskId:string,
    taskTitle:string
}

const ActiveSession: React.FC = () => {
  const   {data:sessionData ,isLoading,isFetching,refetch } = useGetActiveSessionQuery()
  const dispatch = useDispatch()
  const [time, setTime] = useState<number>(0) // in seconds
  const [isRunning, setIsRunning] = useState<boolean>(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [sessionDetails,setSessionDetails]=useState<SessionDetails>({taskId:"",taskTitle:""});
     const { timerStarted } = useAppSelector(state => state.kanban);
  
 const [stopTimeTracking] = useStopTimeTrackingMutation();
   // fetch initial duration
  useEffect(() => {
    if(sessionData?.count>0){
      console.log({sessionData})
        const res: any = sessionData
      if (res?.activeSessions?.[0]?.duration) {
        setTime(res?.activeSessions?.[0]?.duration) // start from duration;
        setSessionDetails(res?.activeSessions?.[0])
        dispatch(setActiveSessionData(res?.activeSessions?.[0]))
        }else{
        setIsRunning(false)
        dispatch(setTimerStarted(false))
       }
    }else{
      setTime(0) // start from duration;
        setSessionDetails({taskId:"",taskTitle:""})
        dispatch(setActiveSessionData(null))
    }
    
   }, [sessionData])

   useEffect(()=>{
    if(timerStarted){
        // refetch()
        setIsRunning(true)
    }
   },[timerStarted])

  // timer effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1) // keep increasing
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

   const handleTiemerStor = (isRunning) => {
    stopTimeTracking(sessionDetails.taskId)
    dispatch(setActiveSessionData(null))
    dispatch(setTimerStarted(false))
  }
  // format hh:mm:ss
  const formatTime = (secs: number) => {
    const d = dayjs.duration(secs, 'seconds')
    return `${String(d.hours()).padStart(2, '0')}:${String(
      d.minutes()
    ).padStart(2, '0')}:${String(d.seconds()).padStart(2, '0')}`
  }

 if(!sessionDetails.taskId ){
    return<></>
 }

  return (
    <div className="w-full mb-3 p-4 rounded  
                    bg-white dark:bg-gray-800 
                    text-gray-900 dark:text-gray-100 
                    flex items-center justify-between">
      {isLoading ? (
        <p className="text-sm opacity-70">Loading session...</p>
      ) : (
        <>
          <div className='flex gap-10 items-center'>
            <h3 className="text-lg font-semibold">Current Task : {sessionDetails.taskTitle}</h3>
            <p className="text-xl font-mono mt-1">{formatTime(time)}</p>
          </div>
          <button
            onClick={() => handleTiemerStor(!isRunning)}
            className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 
                       hover:bg-gray-200 dark:hover:bg-gray-600 
                       transition"
          >
            {isRunning ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
        </>
      )}
    </div>
  )
}

export default ActiveSession
