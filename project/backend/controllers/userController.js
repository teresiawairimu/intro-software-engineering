import { db, admin } from '../firebaseAdmin.js';

const createUser = async (req, res) => {
  try {
    const { name, email } =req.body;
    const uid = req.user.uid;
   

    await db.collection('users').doc(uid).set({
      name,
      email,
      createdAt: admin.firestore.Timestamp.now()
    });
    res.status(201).json('User created');
  } catch(error) {
    res.status(500).json({ error: 'Failed to create the user'})
  }
}

export {
  createUser
}