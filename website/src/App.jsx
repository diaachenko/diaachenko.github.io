import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebase';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import Bookings from './pages/Bookings';
import Contacts from './pages/Contacts';
import Auth from './pages/Auth';

export default function App() {
  const [suites, setSuites] = useState([]);
  const [bookedSuites, setBookedSuites] = useState({});
  const [user, setUser] = useState(null);

  // Слухач авторизації
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  // Завантаження даних з бази Firebase
  useEffect(() => {
    const fetchSuites = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "apartments"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSuites(data);
      } catch (err) { console.error("Firebase fetch error:", err); }
    };
    fetchSuites();

    const saved = localStorage.getItem('bookedSuites');
    if (saved) setBookedSuites(JSON.parse(saved));
  }, []);

  // Завантаження початкових даних (кнопка зникне, коли база не порожня)
  const seedDatabase = async () => {
    try {
      const res = await fetch('/suites.json');
      const data = await res.json();
      for (const item of data) await setDoc(doc(db, "apartments", item.id), item);
      alert("Дані завантажені! Оновіть сторінку (F5).");
    } catch (err) { console.error(err); }
  };

  const toggleBooking = (suiteId) => {
    setBookedSuites(prev => {
      const updated = { ...prev };
      if (updated[suiteId]) delete updated[suiteId];
      else updated[suiteId] = true;
      localStorage.setItem('bookedSuites', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <>
      <div id="top"></div>
      <Header user={user} />
      {suites.length === 0 && (
         <button onClick={seedDatabase} style={{display: 'block', margin: '100px auto'}}>
           Завантажити JSON у Firebase
         </button>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search suites={suites} bookedSuites={bookedSuites} toggleBooking={toggleBooking} user={user} />} />
        <Route path="/bookings" element={<Bookings suites={suites} bookedSuites={bookedSuites} toggleBooking={toggleBooking} user={user} />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      <Footer />
    </>
  );
}\