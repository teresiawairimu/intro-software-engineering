import { Button, Card, Col, Form, Row} from 'react-bootstrap';
import React, {useState} from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useAuth } from '../context/AuthContext';
import { logMood } from '../api/moodApi';
import { useNavigate } from 'react-router-dom';

const MoodPickerCard = () => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [message, setMessage] = useState("");
  const { currentUser} = useAuth();
  const  navigate = useNavigate();
  
  const onEmojiSelect = (emojiData) => {
    setSelectedEmoji(emojiData.native);
  };

  const saveMood = async () => {
    if (!currentUser) {
      console.error("User is not logged in.");
      return;
    }
    const emojiMoods = {
      Happy: ["😊", "😁", "😀", "😄", "😆", "😆", "😅", "😂", "🙃", "🙂", "🫠" ], 
      Loving: ["😍"],
      Affectionate: ["🤗"],
      Angelic: ["😇"],
      Amused: ["😂"],
      Content: ["😌"],
      Excited: ["🤩"],
      Neutral: ["😐"],
      Thoughtful: ["🤔"],
      Tired: ["😴"],
      Playful: ["🙃", "🤭", "😉", "😈"],
      Unwell: ["🤒", "🤢", "🤮", "🤕", "🤧", "🥴", "😵‍💫"],
      Speechless: ["😶", "🤐"],
      Sad: ["😢", "😭"],
      Angry: ["😡 "],
      Anxious: ["😨"],
      Disappointed: ["😞"],
      Overwhelmed: ["😩"],
      Shocked: ["😳", "🤯"]
    };
    if (selectedEmoji) {
      const mood = Object.keys(emojiMoods).find(key =>
        emojiMoods[key].includes(selectedEmoji)
      );
      const moodData = {
        emoji: selectedEmoji,
        mood: mood || "Unknown Mood",   
      };

      try {
        const token =  await currentUser.getIdToken();
        await logMood({emoji: moodData.emoji, mood: moodData.mood}, token);
        setMessage(`You are feeling ${mood || "Unknown Mood"} today!`);
      } catch (error) {
        console.error("Failed to get token: ", error);
        setMessage("Sorry, couldn't capture your mood today.");
      }
    }
  };

  return (
    <Card className="mx-auto mt-4" style={{ maxWidth:"500px"}}>
      <Card.Header className="text-center">Daily Mood Check-in</Card.Header>
      <Card.Body>
        <Card.Title className="text-center">How are you feeling today?</Card.Title>
        <div className="d-flex justify-content-center">
          <Picker
            data={data}
            onEmojiSelect={onEmojiSelect}
            categories={['people']}
            previewPosition="none"
            skinTonePosition="none"
            theme="light"
        />
        </div>
        {message && <p className="text-center mt-3">{message}</p>}
      </Card.Body>
      <Card.Footer>
        <Form>
          <Row className="text-center">
            <Col>
              <Button variant="primary" onClick={saveMood} disabled={!selectedEmoji}> Log Mood</Button>
            </Col>
            <Col>
              <Button variant="secondary" onClick={() => navigate('/calender-view')}> View Calender</Button>
            </Col>
        </Row>
        </Form>
      </Card.Footer>
    </Card>
    
    
  );
};

export default MoodPickerCard;