import React, { useEffect, useState } from 'react';
import { auth, firestore as db } from '../firebase/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../style/Profile.css';
import TextToSpeech from "./TextToSpeech";

function Profile() {
  const user = auth.currentUser;
  const uid = user?.uid;
  const email = user?.email;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    birthday: '',
    allergies: '',
    currentMedications: '',
    conditions: '',
    doctor: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    preferredLanguage: '',
    bloodType: '',
    emailRemindersEnabled: true,
    preferredReminderTime: 'Morning',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!uid) return;
      const docRef = doc(db, 'users', uid, 'profile', 'info');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
      setLoading(false);
    };
    fetchProfile();
  }, [uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!uid) return;
    const docRef = doc(db, 'users', uid, 'profile', 'info');
    await setDoc(docRef, profile);
    alert('✅ Profile updated!');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <TextToSpeech text="Fill out your profile to receive better reminders." />

      <h2>User Profile</h2>
      <p><strong>Email:</strong> {email}</p>

      <button onClick={handleLogout} className="logout-button">🚪 Logout</button>

      <form onSubmit={handleSave}>
        {/* GENERAL INFO */}
        <h3>👤 General Info</h3>
        <label>Name:
          <input name="name" value={profile.name} onChange={handleChange} />
        </label>
        <label>Age:
          <input name="age" type="number" value={profile.age} onChange={handleChange} />
        </label>
        <label>Gender:
          <select name="gender" value={profile.gender} onChange={handleChange}>
            <option value="">--Select--</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label>Phone:
          <input name="phone" value={profile.phone} onChange={handleChange} />
        </label>
        <label>Birthday:
          <input name="birthday" type="date" value={profile.birthday} onChange={handleChange} />
        </label>
        <label>Preferred Language:
          <input name="preferredLanguage" value={profile.preferredLanguage} onChange={handleChange} />
        </label>

        {/* HEALTH INFO */}
        <h3>🏥 Health Info</h3>
        <label>Allergies:
          <input name="allergies" value={profile.allergies} onChange={handleChange} />
        </label>
        <label>Current Medications:
          <input name="currentMedications" value={profile.currentMedications} onChange={handleChange} />
        </label>
        <label>Known Conditions:
          <input name="conditions" value={profile.conditions} onChange={handleChange} />
        </label>
        <label>Primary Doctor:
          <input name="doctor" value={profile.doctor} onChange={handleChange} />
        </label>
        <label>Blood Type:
          <input name="bloodType" value={profile.bloodType} onChange={handleChange} />
        </label>

        <label>Emergency Contact Name:
          <input name="emergencyContactName" value={profile.emergencyContactName} onChange={handleChange} />
        </label>
        <label>Emergency Contact Phone:
          <input name="emergencyContactPhone" value={profile.emergencyContactPhone} onChange={handleChange} />
        </label>

        {/* PREFERENCES */}
        <h3>⚙️ Preferences</h3>
        <label>Preferred Reminder Time:
          <select name="preferredReminderTime" value={profile.preferredReminderTime} onChange={handleChange}>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Custom">Custom</option>
          </select>
        </label>

        <label>
          <input
            type="checkbox"
            name="emailRemindersEnabled"
            checked={profile.emailRemindersEnabled}
            onChange={(e) =>
              setProfile((prev) => ({
                ...prev,
                emailRemindersEnabled: e.target.checked,
              }))
            }
          />
          Enable Email Reminders
        </label>

        <button type="submit">💾 Save Profile</button>
      </form>
    </div>
  );
}

export default Profile;
