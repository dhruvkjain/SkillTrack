import { useState, useEffect, useRef } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlayIcon, PauseIcon, CheckCircleIcon } from 'lucide-react'

// Mock data for video topics
const videoTopics = [
  { id: 1, title: 'Module 1: Personal Protective Equipment (PPE)', src: '/assets/Video1.mp4' },
  { id: 2, title: 'Module 2: Fire Safety and Prevention', src: '/assets/Video2.mp4' },
  { id: 3, title: 'Module 3: Slip, Trip, and Fall Prevention', src: '/assets/Video3.mp4' },
]

export default function Dashboard() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [completedVideos, setCompletedVideos] = useState<number[]>([])
  const [nextVideo, setnextVideo] = useState<number>(0)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [pauseTime, setPauseTime] = useState<number | null>(null)
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  useEffect(() => {
    const completionPercentage = (completedVideos.length / videoTopics.length) * 100
    setProgress(completionPercentage)

    if (videoRef.current) {
      setPauseTime(videoRef.current.currentTime);
      videoRef.current.load();
      setIsPlaying(false);
    }
  }, [completedVideos, currentVideoIndex])

  const handleVideoComplete = () => {
    if (!completedVideos.includes(currentVideoIndex)) {
      setCompletedVideos([...completedVideos, currentVideoIndex])
    }
    if (currentVideoIndex < videoTopics.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1)
    }
    setIsPlaying(false)
    setnextVideo(nextVideo+1)
  }

  const handlePlayPause = () => {
    if (videoRef.current !== null) {
      if (isPlaying) {
        videoRef.current.pause();
        setPauseTime(videoRef.current.currentTime);
        // console.log(videoRef.current.currentTime);
      } else {
        if (pauseTime !== null) {
          videoRef.current.currentTime = pauseTime;
        }
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }

  const selectVideo = (index: number) => {
    setCurrentVideoIndex(index)
    setIsPlaying(false)
  }

  return (
    <div className="container mx-auto p-4 h-full">
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure u completed previous modules ?</AlertDialogTitle>
            <AlertDialogDescription>
              Complete previous videos to access futhur modules.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <h1 className="text-5xl font-bold mb-4">Employee Training Module</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{videoTopics[currentVideoIndex].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted relative">
                <video
                  id="vjsplayer"
                  ref={videoRef}
                  className="video-js w-full h-full object-cover"
                  controls={false}
                  onEnded={handleVideoComplete}
                  preload="auto"
                  poster="//vjs.zencdn.net/v/oceans.png"
                  data-setup='{}'>
                  <source src={videoTopics[currentVideoIndex].src} type="video/mp4"></source>
                  <p className="vjs-no-js">
                    To view this video please enable JavaScript, and consider upgrading to a
                    web browser that
                    <a href="http://videojs.com/html5-video-support/" target="_blank">
                      supports HTML5 video
                    </a>
                  </p>
                </video>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <Button id="vjsplaybutton" onClick={handlePlayPause} variant="secondary">
                    {isPlaying ? <PauseIcon className="mr-2 h-4 w-4" /> : <PlayIcon className="mr-2 h-4 w-4" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  <Button onClick={handleVideoComplete} variant="secondary">
                    Mark as Completed
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Video Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {videoTopics.map((topic, index) => (
                  <li key={topic.id} className={`flex items-center justify-between p-2 rounded ${currentVideoIndex === index ? 'bg-muted' : ''}`}>
                    
                    {(nextVideo == index) ? (
                      <Button onClick={() => selectVideo(index)} variant="ghost" className="text-left w-full justify-start">
                        <span className="truncate">{topic.title}</span>
                      </Button>
                    ) : (
                      completedVideos.includes(index) ? (
                        <Button onClick={() => selectVideo(index)} variant="ghost" className="text-left w-full justify-start">
                          <span className="truncate">{topic.title}</span>
                        </Button>
                      ) : (
                        <Button onClick={() => {setIsPlaying(!isPlaying); handlePlayPause(); setOpenDialog(true)}} variant="ghost" className="text-left w-full justify-start">
                          <span className="truncate">{topic.title}</span>
                        </Button>
                      )
                    )
                    }
                    
                    {completedVideos.includes(index) && (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="w-full" />
              <p className="text-center mt-2">{Math.round(progress)}% Completed</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}