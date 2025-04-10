import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase/firebaseConfig';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth } from '../firebase/firebaseConfig';
import emailjs from '@emailjs/browser';
import '../style/Medication.css';
import TextToSpeech from "./TextToSpeech";

const Medication = () => {
  const uid = auth.currentUser?.uid;
  const userEmail = auth.currentUser?.email;

  const [searchTerm, setSearchTerm] = useState('');
  const [medications, setMedications] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [selectedMedicationInfo, setSelectedMedicationInfo] = useState(null);
  const [dosage, setDosage] = useState('');
  const [medicationsList, setMedicationsList] = useState([]);
  const [sentReminders, setSentReminders] = useState(new Set());

  const [weeklySchedule, setWeeklySchedule] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  const fetchMedications = async (term) => {
    const res = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${term}`);
    const data = await res.json();
    const meds = [];

    data.drugGroup?.conceptGroup?.forEach(group => {
      group.conceptProperties?.forEach(prop => {
        meds.push({
          id: prop.rxcui,
          name: prop.name,
          rxcui: prop.rxcui,
        });
      });
    });

    setMedications(meds);
  };

  const handleMedicationSelect = async (med) => {
    setSelectedMedication(med);

    let fdaData = null;
    let pillImage = null;

    try {
      const fdaRes = await fetch(`https://api.fda.gov/drug/label.json?search=generic_name:${med.name}&limit=1`);
      const fdaJson = await fdaRes.json();
      fdaData = fdaJson.results?.[0];
    } catch (err) {}

    try {
      const imgRes = await fetch(`https://rximage.nlm.nih.gov/api/rximage/1/rxbase?rxcui=${med.rxcui}`);
      const imgJson = await imgRes.json();
      pillImage = imgJson.nlmRxImages?.[0]?.imageUrl;
    } catch (err) {}

    setSelectedMedicationInfo({
      description: fdaData?.description?.[0],
      image: pillImage,
    });
  };

  useEffect(() => {
    if (searchTerm.length > 2) {
      fetchMedications(searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    const fetchMedicationsList = async () => {
      if (!uid) return;
      const medsRef = collection(firestore, "users", uid, "medications");
      const snapshot = await getDocs(medsRef);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMedicationsList(data);
    };

    fetchMedicationsList();
  }, [uid, selectedMedication]);

  useEffect(() => {
    if (!uid || !userEmail) return;

    const interval = setInterval(() => {
      const now = new Date();
      const today = now.toLocaleDateString("en-US", { weekday: "long" });
      const currentTime = now.toTimeString().slice(0, 5);

      medicationsList.forEach((med) => {
        const times = med.schedule?.[today] || [];

        times.forEach((time) => {
          const uniqueId = `${med.name}-${time}`;

          if (time === currentTime && !sentReminders.has(uniqueId)) {
            emailjs.send(
              'service_hl7g80j',
              'template_sr19vns',
              {
                to_email: userEmail,
                name: med.name,
                dosage: med.dosage,
                time: currentTime,
                message: 'Scheduled medication reminder',
                from_name: 'Med Reminder App',
                reply_to: 'support@yourdomain.com'
              },
              'QHE4Xvlo_Di_nsR8E'
            ).then(() => {
              console.log(`📧 Reminder sent for ${med.name} at ${time}`);
              setSentReminders(prev => new Set(prev).add(uniqueId));
            }).catch((err) => {
              console.error('❌ Failed to send reminder:', err);
            });
          }
        });
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [medicationsList, uid, userEmail]);

  const handleAddTime = (day) => {
    setWeeklySchedule({
      ...weeklySchedule,
      [day]: [...weeklySchedule[day], ''],
    });
  };

  const handleTimeChange = (day, idx, value) => {
    const updated = [...weeklySchedule[day]];
    updated[idx] = value;
    setWeeklySchedule({ ...weeklySchedule, [day]: updated });
  };

  const handleSubmit = async () => {
    if (!uid || !selectedMedication || !userEmail) {
      alert("You must be logged in, select a medication, and have a valid email.");
      return;
    }

    const cleanName = selectedMedication.name.replace(/[\/\\.#$\[\]]/g, '-');
    const medicationId = `${cleanName}_${Date.now()}`;
    const isEditing = !selectedMedication.id;
    const docRef = doc(
      firestore,
      "users",
      uid,
      "medications",
      isEditing ? selectedMedication.id : medicationId
    );

    await setDoc(docRef, {
      name: selectedMedication.name,
      dosage,
      schedule: weeklySchedule,
      createdAt: new Date(),
    });

    alert("Reminder saved to Firestore!");
    setSelectedMedication(null);
    setSelectedMedicationInfo(null);
    setDosage('');
    setWeeklySchedule({
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    });
  };

  const handleDeleteMedication = async (medicationId) => {
    const docRef = doc(firestore, "users", uid, "medications", medicationId);
    await deleteDoc(docRef);
    setMedicationsList(medicationsList.filter(m => m.id !== medicationId));
  };

  const handleEditMedication = async (medId) => {
    const medToEdit = medicationsList.find(m => m.id === medId);
    if (!medToEdit) return;

    setSelectedMedication({
      name: medToEdit.name,
      id: medId,
    });

    setDosage(medToEdit.dosage);
    setWeeklySchedule(medToEdit.schedule);
  };

  return (
    <div className="medication-container">
      <TextToSpeech />
      <h2>Set Medication Reminder</h2>

      <input
        type="text"
        placeholder="Search medication..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {medications.length > 0 && (
        <ul>
          {medications.map((med) => (
            <li key={med.id} onClick={() => handleMedicationSelect(med)}>
              {med.name}
            </li>
          ))}
        </ul>
      )}

      {selectedMedication && (
        <div>
          <h3>{selectedMedication.name}</h3>

          {selectedMedicationInfo?.image && (
            <div>
              <img
                src={selectedMedicationInfo.image}
                alt="Pill"
                className="pill-image"
              />
            </div>
          )}

          {selectedMedicationInfo?.description && (
            <p className="med-description">
              {selectedMedicationInfo.description}
            </p>
          )}

          <label>
            Dosage:
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g. 200mg"
            />
          </label>

          <h4>Schedule for Days of the Week</h4>
          {Object.keys(weeklySchedule).map((day) => (
            <div className="weekday-row" key={day}>
              <strong>{day}</strong>
              {weeklySchedule[day].map((time, idx) => (
                <input
                  key={idx}
                  type="time"
                  value={time}
                  onChange={(e) => handleTimeChange(day, idx, e.target.value)}
                />
              ))}
              <button
                type="button"
                className="add-time-button"
                onClick={() => handleAddTime(day)}
              >
                + Add Time
              </button>
            </div>
          ))}

          <button className="save-button" onClick={handleSubmit}>
            Save Reminder
          </button>
        </div>
      )}

      <div className="weekly-dashboard">
        <h2>📅 Weekly Medication Schedule</h2>

        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
          const dayMeds = [];

          medicationsList.forEach((med) => {
            const times = med.schedule?.[day];
            if (times && times.length > 0) {
              times.forEach((time) => {
                dayMeds.push({
                  name: med.name,
                  dosage: med.dosage,
                  time,
                  id: med.id
                });
              });
            }
          });

          dayMeds.sort((a, b) => a.time.localeCompare(b.time));

          return (
            <div key={day} style={{ marginBottom: 20 }}>
              <h3>{day}</h3>
              {dayMeds.length === 0 ? (
                <p style={{ color: '#888' }}>No meds scheduled</p>
              ) : (
                <ul>
                  {dayMeds.map((med, idx) => (
                    <li key={idx}>
                      <strong>{med.time}</strong> — {med.name} ({med.dosage})
                      <button onClick={() => handleEditMedication(med.id)}>✏️</button>
                      <button onClick={() => handleDeleteMedication(med.id)}>🗑️</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Medication;