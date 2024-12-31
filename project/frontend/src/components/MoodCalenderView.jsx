import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../context/AuthContext';
import {getMoods} from '../api/moodApi';
import NavbarComponent from '../components/NavBarComponent';


function MoodCalenderView() {
  const [date, setDate] = useState(new Date());
  const { currentUser } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [moods, setMoods] = useState([]);
  const [selectedDateMoods, setSelectedDateMoods] = useState([]);

  const formatDate = (firestoreTimestamp) => {
    if (!firestoreTimestamp) return new Date(0);
    if (firestoreTimestamp.toDate) {
      return firestoreTimestamp.toDate(); 
    }
    if (firestoreTimestamp._seconds) {
      return new Date(firestoreTimestamp._seconds * 1000); 
    }
    console.error("Unhandled timestamp format:", firestoreTimestamp);
    return new Date(0); 
  };
  

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);

    const filteredMoods = moods.filter(mood => {
      const moodDate = formatDate(mood.createdAt);
      console.log("Raw createdAt:", mood.createdAt);
      console.log("mooddate", moodDate);
      return (
        moodDate.getFullYear() === selectedDate.getFullYear() &&
        moodDate.getMonth() === selectedDate.getMonth() &&
        moodDate.getDate() === selectedDate.getDate()
      )
    })
    console.log("filteredMoods", filteredMoods);
    setSelectedDateMoods(filteredMoods);
  };

  useEffect(() => {
    const fetchMoods = async () => {
      if (!currentUser) return;
      try {
        setIsLoading(true);
        setError(null);
        const idToken = await currentUser.getIdToken();
        const moodsData = await getMoods(idToken);
        console.log("heres", moodsData);
        setMoods(moodsData);
      } catch (error) {
        console.error('Failed to fetch moods:', error);
        setError('Failed to retrieve moods. Please try again later');
      } finally {
        setIsLoading(false);
      }
    }
    fetchMoods();
  }, [currentUser])

  const getTileContent = ({ date}) => {
    const moodForDate = moods.find(mood => {
      const moodDate = formatDate(mood.createdAt);
      return (
        moodDate.getFullYear() === date.getFullYear() &&
        moodDate.getMonth() === date.getMonth() &&
        moodDate.getDate() === date.getDate()
      );
    });
    return moodForDate ? <span>{moodForDate.emoji}</span> : null;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <NavbarComponent />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
        <h1>View past moods</h1>
        <Calendar 
          onChange={handleDateChange} 
          value={date} 
          tileContent={getTileContent}
        />
          <p>Selected Date: {date.toDateString()}</p>
          {selectedDateMoods.length > 0 ? (
            <div>
              <h3>Moods for {date.toDateString()}:</h3>
              <ul>
                {selectedDateMoods.map((mood, index) => (
                  <li key={index}>
                    {mood.emoji} - {mood.mood}
                  </li>
                ))}
              </ul>
            </div>
          ): (
            <p>No moods logged for this date.</p>
        )}
      </div>
    </div>
  );
}

export default MoodCalenderView;

