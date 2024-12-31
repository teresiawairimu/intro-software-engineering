import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js';
import { db } from '../firebaseAdmin.js';
import { expect } from  chai;

chai.use(chaiHttp);

const TEST_UID = 'test-user';
const TEST_MOOD = { emoji: '😊', mood: 'happy' };

const deleteCollection = async (collectionRef) => {
  const snapshot = await collectionRef.get();
  const batch = db.batch();
  snapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
};

describe('Mood Controller Tests', function () {
  this.timeout(10000);

  before(async () => {
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
    await db.settings({
      host: 'localhost:8080',
      ssl: false,
    });
  });

  beforeEach(async () => {
    await deleteCollection(db.collection('users'));
  });

  describe('POST /api/moods (createMood)', () => {
    it('should log a mood for a user', async () => {
      const res = await chai
        .request(app)
        .post('/api/moods')
        .set('Authorization', `Bearer mock-token`)
        .send(TEST_MOOD);

      expect(res).to.have.status(201);
      expect(res.body).to.equal('Mood logged');

      const snapshot = await db
        .collection('users')
        .doc(TEST_UID)
        .collection('moods')
        .get();

      expect(snapshot.empty).to.be.false;
      const [doc] = snapshot.docs;
      expect(doc.data().mood).to.equal(TEST_MOOD.mood);
    });
  });

  describe('GET /api/moods (retrieveMood)', () => {
    it('should retrieve all moods for a user', async () => {
      const moodRef = db.collection('users').doc(TEST_UID).collection('moods');
      await moodRef.add(TEST_MOOD);

      const res = await chai
        .request(app)
        .get('/api/moods')
        .set('Authorization', `Bearer mock-token`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0].mood).to.equal(TEST_MOOD.mood);
    });
  });
});
