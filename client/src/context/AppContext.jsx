import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();


export const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const { getToken } = useAuth();
    const { user } = useUser();

    const navigate = useNavigate();
    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [userData, setUserData] = useState(null);

    //fetch all courses
    const fetchAllCourses = async () => {
        // setAllCourses(dummyCourses);
        try {
            const { data } = await axios.get(backendUrl + '/api/course/all');

            if (data.success) {
                setAllCourses(data.courses);
            }
            else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    //Fetch user Data 
    const fetchUserData = async () => {

        if (user.publicMetadata.role === "educator") {
            setIsEducator(true);
        }

        try {
            const token = await getToken();

            //api call 
            const { data } = await axios.get(backendUrl + '/api/user/data', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (data.success) {
                setUserData(data.user);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    //Function to calc avg rating
    const calcAvgRating = (course) => {
        if (course.courseRatings.length === 0) {
            return 0;
        }
        let totalRating = 0;
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating;
        })
        return Math.floor(totalRating / course.courseRatings.length);
    }

    //function to calc course chapter time
    const calcChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.map((lecture) => {
            time += lecture.lectureDuration;
        })
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
    }

    //func to cal course duration
    const calcCourseDuration = (course) => {
        let time = 0;
        course.courseContent.map((chapter) => {
            chapter.chapterContent.map((lecture) => {
                time += lecture.lectureDuration;
            })
        })
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
    }

    //calc no of lectures  in the course
    const calcNoOfLectures = (course) => {
        let lectures = 0;
        course.courseContent.forEach((chapter) => {
            if (Array.isArray(chapter.chapterContent)) {
                lectures += chapter.chapterContent.length;
            }
        })
        return lectures;
    }

    //fetch user enrolled courses 
    const fetchUserEnrolledCourses = async () => {
        // setEnrolledCourses(dummyCourses);

        try {
            const token = await getToken();
            const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (data.success) {
                setEnrolledCourses(data.enrolledCourses.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //create func for getToken
    // const logToken = async () => {
    //     console.log(await getToken());
    // }

    useEffect(() => {
        fetchAllCourses();
        // fetchUserEnrolledCourses();
    }, [])

    useEffect(() => {
        if (user) {
            // logToken()
            fetchUserData();
            fetchUserEnrolledCourses();
        }
    }, [user])

    const value = {
        currency,
        allCourses,
        navigate,
        calcAvgRating,
        isEducator, setIsEducator,
        calcChapterTime,
        calcCourseDuration,
        calcNoOfLectures,
        enrolledCourses,
        setEnrolledCourses,
        fetchUserEnrolledCourses,
        backendUrl,
        userData,
        setUserData,
        getToken,
        fetchAllCourses,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}