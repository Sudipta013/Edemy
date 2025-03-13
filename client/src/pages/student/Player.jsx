import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom';
import humanizeDuration from 'humanize-duration';
import { assets } from '../../assets/assets';
import Youtube from 'react-youtube'
import Rating from '../../components/student/Rating';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';
import Footer from '../../components/student/Footer';

const Player = () => {

  const { enrolledCourses, calcChapterTime, backendUrl, getToken, userData, fetchUserEnrolledCourses } = useContext(AppContext);
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);

  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);


  const getCourseData = () => {
    enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course);
        course.courseRatings.map((item) => {
          if (item.userId === userData._id) {
            setInitialRating(item.rating);
          }
        })
      }
    })
  }

  const toggleSection = (sectionId) => {
    setOpenSections(prevState => ({
      ...prevState,
      [sectionId]: !prevState[sectionId]
    }));
  }

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData();
    }
  }, [enrolledCourses])

  //function to mark complete a lecture

  const markLectureCompleted = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(backendUrl + '/api/user/update-course-progress', { courseId, lectureId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (data.success) {
        toast.success(data.message);
        getCourseProgress();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  // function to get course progress
  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(backendUrl + '/api/user/get-course-progress', { courseId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (data.success) {
        setProgressData(data.progressData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  // function to handle rate 
  const handleRate = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(backendUrl + '/api/user/add-rating', { courseId, rating }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (data.success) {
        toast.success(data.message);
        fetchUserEnrolledCourses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getCourseProgress();
  }, [])

  // Function to extract video ID from a YouTube URL
  const getYouTubeVideoId = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get("v"); // Extracts 'v' parameter from URL
    } catch (error) {
      console.error("Invalid YouTube URL:", url);
      return null;
    }
  };


  return courseData ? (
    <>
      <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>
        {/* left side*/}
        <div className='text-gray-800'>
          <h2 className='text-xl font-semibold'>Course Structure</h2>
          <div className='pt-5'>
            {courseData && courseData.courseContent.map((chapter, index) => (
              <div className='border border-gray-500/30 bg-white mb-2 rounded' key={index}>
                <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none' onClick={() => toggleSection(index)}>
                  <div className='flex items-center gap-2'>
                    <img className={`transform transition-transform ${openSections[index] ? 'rotate-180' : ''}`} src={assets.down_arrow_icon} alt="arrow_icon" />
                    <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                  </div>
                  <p className='text-sm md:text-default'>{chapter.chapterContent.length} lectures - {calcChapterTime(chapter)}</p>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>

                  <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-500/30'>
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className='flex items-start gap-2 py-1'>
                        <img src={progressData && progressData.lectureCompleted.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon} alt="play-icon" className='w-3 h-3 md:w-4 md:h-4 mt-1' />
                        <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                          <p className='text-sm md:text-base'>{lecture.lectureTitle}</p>
                          <div className='flex gap-2'>
                            {lecture.lectureUrl && <p onClick={() => setPlayerData({
                              ...lecture, chapter: index + 1, lecture: i + 1
                            })} className='text-blue-500 cursor-pointer'>Watch</p>}
                            <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className='flex items-center gap-2 py-3 mt-10 bg-gray-100 '>
            <div className='flex items-center mx-auto gap-3'>
              <h1 className='text-xl font-bold'>Rate this Course:</h1>
              <Rating initialRating={initialRating} onRate={handleRate} />
            </div>
          </div>
        </div>

        {/* right side*/}
        <div>
          {
            playerData ? (
              <div className='md:mt-10'>
                <Youtube videoId={getYouTubeVideoId(playerData.lectureUrl)} iframeClassName='w-full aspect-video' />
                <div className='flex justify-between items-center mt-1'>
                  <p>{playerData.chapter}.{playerData.lecture}{playerData.lectureTitle}</p>
                  <button onClick={() => markLectureCompleted(playerData.lectureId)} className='text-blue-600'>{progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? "Completed" : "Mark complete"}</button>
                </div>
              </div>
            )
              : <img src={courseData ? courseData.courseThumbnail : ''} alt="" />
          }

        </div>
      </div>
      <Footer />
    </>
  ) : <Loading />
}

export default Player
