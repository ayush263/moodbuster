import React, { useState, useRef } from 'react';
import { Mic, Stop, Upload, Volume2 } from 'lucide-react';
import '../styles/VoiceMoodTracker.css';

const VoiceMoodTracker = ({ onMoodSubmit }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        await processAudio(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access.');
      console.error('Microphone error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'mood-recording.wav');

      const response = await fetch('/api/moods/transcribe', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setTranscript(data.transcript);
      } else {
        throw new Error('Failed to transcribe audio');
      }
    } catch (err) {
      setError('Failed to process audio. Please try again.');
      console.error('Processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      processAudio(file);
    }
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      onMoodSubmit(transcript);
      setTranscript('');
    }
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  return (
    <div className="voice-mood-tracker">
      <div className="voice-header">
        <h3>🎤 Voice Mood Tracking</h3>
        <p>Record your mood thoughts naturally with voice</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="voice-controls">
        <button
          className={`record-btn ${isRecording ? 'recording' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
        >
          {isRecording ? (
            <>
              <Stop size={24} />
              <span>Stop Recording</span>
            </>
          ) : (
            <>
              <Mic size={24} />
              <span>Start Recording</span>
            </>
          )}
        </button>

        <label className="upload-btn">
          <Upload size={24} />
          <span>Upload Audio</span>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            disabled={isProcessing || isRecording}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {isProcessing && (
        <div className="processing-indicator">
          <div className="spinner"></div>
          <p>Processing your audio...</p>
        </div>
      )}

      {transcript && (
        <div className="transcript-section">
          <h4>Your Mood Entry</h4>
          <div className="transcript-box">
            <p>{transcript}</p>
          </div>

          <div className="transcript-actions">
            <button
              className="action-btn clear-btn"
              onClick={clearTranscript}
            >
              Clear
            </button>
            <button
              className="action-btn submit-btn"
              onClick={handleSubmit}
            >
              Log Mood Entry
            </button>
          </div>
        </div>
      )}

      <div className="voice-tips">
        <h4>💡 Tips for Better Voice Logging</h4>
        <ul>
          <li>Speak naturally and conversationally</li>
          <li>Mention specific feelings and emotions</li>
          <li>Include what triggered your mood if possible</li>
          <li>Use a quiet environment for better transcription</li>
          <li>Recording takes 30 seconds to 5 minutes</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceMoodTracker;
