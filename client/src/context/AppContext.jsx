import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();


export const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);

    //fetch all courses
    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses);
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
        return totalRating / course.courseRatings.length;
    }

    //function to calc course chapter time
    const calcChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.map((lecture)=>{
            time += lecture.lectureDuration;
        })
        return humanizeDuration(time * 60 * 1000, { units: ['h','m']})
    }

    //func to cal course duration
    const calcCourseDuration = (course) => {
        let time = 0;
        course.courseContent.map((chapter)=>{
            chapter.chapterContent.map((lecture)=>{
                time += lecture.lectureDuration;
            })
        })
        return humanizeDuration(time * 60 * 1000, { units: ['h','m']})
    }

    //calc no of lectures  in the course
    const calcNoOfLectures = (course) => {
        let lectures = 0;
        course.courseContent.forEach((chapter)=>{
            if(Array.isArray(chapter.chapterContent)){
                lectures += chapter.chapterContent.length;
            }
        })
        return lectures;
    }

    useEffect(() => {
        fetchAllCourses();
    }, [])

    const value = {
        currency,
        allCourses,
        navigate,
        calcAvgRating,
        isEducator, setIsEducator,
        calcChapterTime,
        calcCourseDuration,
        calcNoOfLectures,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}