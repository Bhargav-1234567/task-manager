// Example usage in a React component
import {
  useStartTimeTrackingMutation,
  useStopTimeTrackingMutation,
  useGetTimeTrackingStatusQuery,
  useGetTimeTrackingHistoryQuery,
} from '@/lib/api/taskApi';

function TimeTrackingComponent({ taskId }: { taskId: string }) {
  const [startTimeTracking] = useStartTimeTrackingMutation();
  const [stopTimeTracking] = useStopTimeTrackingMutation();
  const { data: status, refetch: refetchStatus } = useGetTimeTrackingStatusQuery(taskId);
  const { data: history } = useGetTimeTrackingHistoryQuery(taskId);

  const handleStart = async () => {
    try {
      await startTimeTracking(taskId).unwrap();
      refetchStatus();
    } catch (error) {
      console.error('Failed to start time tracking:', error);
    }
  };

  const handleStop = async () => {
    try {
      await stopTimeTracking(taskId).unwrap();
      refetchStatus();
    } catch (error) {
      console.error('Failed to stop time tracking:', error);
    }
  };

  return (
    <div>
      {status?.isActive ? (
        <button onClick={handleStop}>Stop Timer</button>
      ) : (
        <button onClick={handleStart}>Start Timer</button>
      )}
      
      {status && (
        <div>
          <p>Total Time: {status.totalTimeTracked} seconds</p>
          {status.activeSession && (
            <p>Current Session: {status.activeSession.currentDuration} seconds</p>
          )}
        </div>
      )}
    </div>
  );
}

export default TimeTrackingComponent