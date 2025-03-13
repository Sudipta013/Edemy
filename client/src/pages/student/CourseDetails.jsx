import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import Footer from '../../components/student/Footer';
import Youtube from 'react-youtube'
import axios from 'axios';
import { toast } from 'react-toastify';



const CourseDetails = () => {

  const { id } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const { allCourses, calcAvgRating, calcChapterTime, calcCourseDuration, calcNoOfLectures, currency, backendUrl, userData, getToken } = useContext(AppContext);

  const fetchCourseData = async () => {
    // const findCourse = allCourses.find((course) => course._id === id)
    // setCourseData(findCourse);

    try {
      const { data } = await axios.get(backendUrl + "/api/course/" + id);

      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  // function to enroll or buy in course
  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.warn('Login to Enroll');
      }
      if (isAlreadyEnrolled) {
        return toast.warn('You are already enrolled in this course');
      }
      const token = await getToken();

      const { data } = await axios.post(backendUrl + "/api/user/purchase", {
        courseId: courseData._id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchCourseData();
  }, []);

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id));
    }
  }, [userData, courseData]);


  const toggleSection = (sectionId) => {
    setOpenSections(prevState => ({
      ...prevState,
      [sectionId]: !prevState[sectionId]
    }));
  }

  return courseData ? (
    <>
      <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-40 px-8 md:pt-20 pt-10 sm:pt-20 text-left'>

        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-100/70'></div>

        <div className='max-w-xl z-10 text-gray-500'>
          <h1 className='md:text-4xl text-2xl font-semibold text-gray-800'>{courseData.courseTitle}</h1>
          <p className='pt-4 md:text-base text-sm' dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) + "..." }}></p>

          {/* review  */}
          <div className='flex items-center space-x-2 pt-3 pb-1 text-sm'>
            <p>{calcAvgRating(courseData).toFixed(1)}</p>
            <div className='flex'>
              {[...Array(5)].map((_, i) => (
                <img className='w-3.5 h-3.5' key={i} src={i < Math.floor(calcAvgRating(courseData)) ? assets.star : assets.star_blank} alt="" />
              ))}
            </div>
            <p className='text-blue-600'>({courseData.courseRatings.length}{courseData.courseRatings.length > 1 ? "reviews" : " review"})</p>

            <p className=''>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? " students enrolled" : "student enrolled"}</p>
          </div>

          <p className='text-sm'>Course by <span className='text-blue-600 underline'>{courseData.educator.name}</span></p>

          <div className='pt-8 text-gray-800'>
            <h2 className='text-lg font-semibold'>Course Structure</h2>

            <div className='pt-5'>
              {courseData.courseContent.map((chapter, index) => (
                <div className='border border-gray-500/30 bg-white mb-2 rounded' key={index}>
                  <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none' onClick={() => toggleSection(index)}>
                    <div className='flex items-center gap-2'>
                      <img className={`transform transition-transform ${openSections[index] ? 'rotate-180' : ''}`} src={assets.down_arrow_icon} alt="arrow_icon" />
                      <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                    </div>
                    <p className='text-xs sm:text-sm md:text-default'>{chapter.chapterContent.length} lectures - {calcChapterTime(chapter)}</p>
                  </div>

                  <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>

                    <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-500/30'>
                      {chapter.chapterContent.map((lecture, index) => (
                        <li key={index} className='flex items-start gap-2 py-1'>
                          <img src={assets.play_icon} alt="play-icon" className='w-4 h-4 mt-1' />
                          <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                            <p>{lecture.lectureTitle}</p>
                            <div className='flex gap-2'>
                              {lecture.isPreviewFree && <p onClick={() => setPlayerData({ videoId: lecture.lectureUrl.split('/').pop() })} className='text-blue-500 cursor-pointer'>Preview</p>}
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
          </div>

          <div className='py-10 text-sm md:text-default'>
            <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
            <p className='pt-3 rich-text' dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}></p>
          </div>

        </div>


        {/* right column */}
        <div className='max-w-coursecard z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]'>
          {
            playerData ?
              <Youtube videoId={playerData.videoId} opts={{ playerVars: { autoplay: 1 } }} iframeClassName='w-full aspect-video' />

              : <img src={courseData.courseThumbnail} alt="" />
          }

          <div className='p-5'>
            <div className='flex items-center gap-2'>

              <img className='w-3.5' src={assets.time_clock_icon} alt="time_clock_icon" />
              <p className='text-rose-500'><span className='font-medium'>5 days</span> left at this price!</p>
            </div>


            <div className='flex items-center gap-2 pt-2'>
              <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>{currency}{(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}</p>

              <p className='text-gray-400 md:text-lg line-through'>{currency}{courseData.coursePrice}</p>

              <p className='md:text-lg text-gray-500'>You save {courseData.discount}%</p>
            </div>

            <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>

              <div className='flex items-center gap-1'>
                <img src={assets.star} alt="star_icon" />
                <p>{calcAvgRating(courseData)}</p>
              </div>

              <div className='h-4 w-px bg-gray-500/40'></div>

              <div className='flex items-center gap-1'>
                <img src={assets.time_clock_icon} alt="clock_icon" />
                <p>{calcCourseDuration(courseData)}</p>
              </div>

              <div className='h-4 w-px bg-gray-500/40'></div>

              <div className='flex items-center gap-1'>
                <img src={assets.lesson_icon} alt="lessons_icon" />
                <p>{calcNoOfLectures(courseData)} lessons</p>
              </div>

            </div>

            <button onClick={enrollCourse} className='px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-lg rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl active:scale-95 w-full mt-5 cursor-pointer'>{isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}</button>

            <div className='pt-6'>
              <p className='md:text-xl text-lg font-medium text-gray-800'>What's in the course?</p>
              <ul className='ml-4 pt-2 text-sm md:text-default list-disc text-gray-500'>
                <li>Lifetime access to the course materials</li>
                <li>Step-by-step, hands on learning experience</li>
                <li>Downloadable resources and source code</li>
                <li>Quizzes to test your knowledge</li>
                <li>24/7 support from the instructor</li>
                <li>Certification on successful completion</li>
              </ul>
            </div>

          </div>
        </div>

      </div>
      <Footer />
    </>
  ) : <Loading />
}

export default CourseDetails
