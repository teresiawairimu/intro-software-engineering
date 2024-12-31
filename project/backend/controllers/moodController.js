import { db, admin } from '../firebaseAdmin.js';

const createMood= async (req, res) => {
  try {
    const { emoji, mood} =req.body;
    const uid = req.user.uid;
   

    await db.collection('users').doc(uid).collection('moods').add({
      emoji,
      mood,
      createdAt: admin.firestore.Timestamp.now(),
    });
    res.status(201).json('Mood logged');
  } catch(error) {
    res.status(500).json({ error: 'Failed to log mood'})
  }
}

const retrieveMood = async (req, res) => {
  const userId = req.user.uid;
  try {
    const moodsRef = db.collection('users').doc(userId).collection('moods');
    const moodsSnapShot = await moodsRef.get();
    const moods = []
    moodsSnapShot.forEach((doc) => {
      moods.push({ id: doc.id, ...doc.data()});
    });
    console.log(moods);
    res.status(200).json(moods);
  } catch (error) {
    console.error('Error retrieving moods:', error);
  }
}

export {
  createMood,
  retrieveMood
}