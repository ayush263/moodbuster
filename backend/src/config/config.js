// Database configuration
// Currently configured for Firebase, can be switched to other providers

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

module.exports = {
  database: {
    type: process.env.DB_TYPE || 'firebase',
    config: firebaseConfig
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: '7d'
  },
  ml: {
    modelPath: process.env.MODEL_PATH || './src/ml/models',
    batchSize: parseInt(process.env.ML_BATCH_SIZE) || 32
  }
};
