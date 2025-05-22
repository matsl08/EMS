import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/students/courses');
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        
        // Sample courses data for demo
        const sampleCourses = [
          {
            courseCode: 'CS101',
            courseName: 'Introduction to Computer Science',
            instructor: 'Dr. John Smith',
            schedule: {
              day: 'MWF',
              time: '9:00 AM - 10:30 AM',
              room: 'Room 301'
            },
            units: 3
          },
          {
            courseCode: 'MATH201',
            courseName: 'Calculus I',
            instructor: 'Dr. Jane Doe',
            schedule: {
              day: 'TTh',
              time: '1:00 PM - 2:30 PM',
              room: 'Room 205'
            },
            units: 4
          },
          {
            courseCode: 'ENG101',
            courseName: 'English Composition',
            instructor: 'Prof. Robert Johnson',
            schedule: {
              day: 'MWF',
              time: '11:00 AM - 12:30 PM',
              room: 'Room 102'
            },
            units: 3
          }
        ];
        
        setCourses(sampleCourses);
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  return (
    <div className="my-courses-container">
      <h2>My Courses</h2>
      
      {courses.length === 0 ? (
        <div className="no-courses">
          <p>You are not enrolled in any courses for the current semester.</p>
        </div>
      ) : (
        <div className="courses-list">
          {courses.map((course, index) => (
            <div key={index} className="course-item">
              <div className="course-header">
                <h3>{course.courseCode}: {course.courseName}</h3>
                <span className="course-units">{course.units} units</span>
              </div>
              <div className="course-details">
                <p><strong>Instructor:</strong> {course.instructor}</p>
                <p><strong>Schedule:</strong> {course.schedule.day} {course.schedule.time}</p>
                <p><strong>Room:</strong> {course.schedule.room}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
