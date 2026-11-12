import React, { useState, useEffect, useCallback } from 'react';

// --- IKONY SVG (Niezależne od bibliotek zewnętrznych) ---
const Icons = {
  Calendar: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  Dumbbell: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
  Utensils: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
      />
    </svg>
  ),
  TrendingUp: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  ),
  Check: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  Play: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Pause: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  ),
  Refresh: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  ),
  AlertTriangle: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  CloudSync: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
  ),
  Download: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  ),
  Upload: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      />
    </svg>
  ),
};

// --- DOMYŚLNE DANE DNI TYGODNIA ---
const DEFAULT_WEEK_DAYS = [
  {
    id: 'pn',
    name: 'Poniedziałek',
    short: 'Pn',
    uni: '8:00 - 14:00',
    workout: 'Bieg Spokojny (BS 6 km)',
    type: 'run',
    caffeineOk: true,
  },
  {
    id: 'wt',
    name: 'Wtorek',
    short: 'Wt',
    uni: '8:00 - 15:00 (+ nauka)',
    workout: 'Siłownia Akademik - Trening A (22:00)',
    type: 'gym',
    caffeineOk: false,
    note: 'ZAKAZ KOFEINY PO 16:30! Nocny trening.',
  },
  {
    id: 'sr',
    name: 'Środa',
    short: 'Śr',
    uni: '10:00 - 16:00',
    workout: 'Ścianka Bouldering (Sekcja/Wspinanie)',
    type: 'climb',
    caffeineOk: true,
    note: 'Kofeina 200mg 45 min przed ścianką OK.',
  },
  {
    id: 'cz',
    name: 'Czwartek',
    short: 'Czw',
    uni: '14:00 - 16:00',
    workout: 'Bieg z Akcentem (6 km z OWB1/TM)',
    type: 'run',
    caffeineOk: true,
    note: 'Kofeina 200mg przed biegiem OK.',
  },
  {
    id: 'pt',
    name: 'Piątek',
    short: 'Pt',
    uni: '8:00 - 12:00',
    workout: 'Bouldering LUB Wolne / Regeneracja',
    type: 'climb',
    caffeineOk: true,
  },
  {
    id: 'so',
    name: 'Sobota',
    short: 'Sob',
    uni: 'Wolne (Nauka/Projekt)',
    workout: 'Regeneracja / Mobilność / Spacer',
    type: 'rest',
    caffeineOk: true,
  },
  {
    id: 'nd',
    name: 'Niedziela',
    short: 'Niedz',
    uni: 'Wolne',
    workout: 'Długie Wybieganie (8-18 km) + Siłownia B',
    type: 'hybrid',
    caffeineOk: false,
    note: 'Kofeina rano przed biegiem OK, ale ZAKAZ wieczorem!',
  },
];

// --- BAZA POSIŁKÓW KLOCEK W KLOCEK (3100 kcal) ---
const MEAL_DATABASE = {
  breakfast: [
    {
      id: 'A1',
      name: 'Nocna Owsianka TURBO + WPC',
      kcal: 885,
      p: 48,
      c: 118,
      f: 22,
      desc: '1,5 szkl. płatków, 1 miarka WPC, 1,5 szkl. mleka, banan, 1,5 łyżki masła orzech.',
    },
    {
      id: 'A2',
      name: 'Jajecznica 4 Jaja + Tosty + Szejk WPC',
      kcal: 860,
      p: 52,
      c: 78,
      f: 34,
      desc: '4 jaja, 3 grahamki, masło, szejk WPC z wodą.',
    },
    {
      id: 'A3',
      name: 'Tosty Francuskie z Chleba Tostowego + Skyr',
      kcal: 890,
      p: 46,
      c: 125,
      f: 18,
      desc: '4 kromki, 2 jaja, cynamon, 200g Skyru, owoce, miód.',
    },
    {
      id: 'A4',
      name: 'Zestaw "Zaspałem na 8:00" (Szejk Blenderski)',
      kcal: 870,
      p: 45,
      c: 110,
      f: 24,
      desc: 'Płatki owsiane 100g, 1,5 miarki WPC, mleko 300ml, 2 banany, masło orzechowe.',
    },
  ],
  lunch: [
    {
      id: 'B1',
      name: 'Chili Con Carne Studenta (2 Pudełka)',
      kcal: 1350,
      p: 68,
      c: 165,
      f: 38,
      desc: '250g mielonego z szynki, 2 woreczki ryżu (200g), kukurydza, fasola, sos pomidorowy.',
    },
    {
      id: 'B2',
      name: 'Makaron Bolognese z Mozzarellą',
      kcal: 1320,
      p: 65,
      c: 158,
      f: 42,
      desc: '200g makaronu, 250g mięsa, Passata, 1/2 kulki mozzarelli.',
    },
    {
      id: 'B3',
      name: 'Kurczak Curry w Sosie Kokosowym z Ryżem',
      kcal: 1380,
      p: 72,
      c: 170,
      f: 36,
      desc: '250g piersi z kurczaka, 2 woreczki ryżu, warzywa na patelnię, mleczko kokosowe.',
    },
    {
      id: 'B4',
      name: 'Burrito w Tortilli (Długi Wtorek)',
      kcal: 1310,
      p: 64,
      c: 150,
      f: 44,
      desc: '3 duże placki tortilli, 220g mięsa, fasola czerwona, ryż, ser żółty.',
    },
    {
      id: 'B5',
      name: 'Makaron z Tuńczykiem i Sos Pomidorowy',
      kcal: 1280,
      p: 66,
      c: 162,
      f: 32,
      desc: '200g makaronu, 2 puszki tuńczyka w sosie własnym, oliwa, pomidory.',
    },
  ],
  dinner: [
    {
      id: 'C1',
      name: 'Szejk Gainer Studenta (Po siłowni 22:30)',
      kcal: 865,
      p: 44,
      c: 115,
      f: 23,
      desc: '1 szklanka płatków, 1 miarka WPC, 350ml mleka, 1 banan, masło orzechowe, 5g Kreatyny.',
    },
    {
      id: 'C2',
      name: 'Mega Kanapki z Mozzarellą i Szynką + Szejk',
      kcal: 850,
      p: 48,
      c: 92,
      f: 28,
      desc: '4 kromki chleba, szynka z piersi, mozzarella, pomidor + WPC.',
    },
    {
      id: 'C3',
      name: '2x Serek Wiejski z Płatkami i Dżemem',
      kcal: 840,
      p: 46,
      c: 105,
      f: 20,
      desc: '400g serka wiejskiego, 80g płatków, dżem niskosłodzony, orzechy.',
    },
    {
      id: 'C4',
      name: 'Tortilla Quesadilla z Kurczakiem i Serem',
      kcal: 880,
      p: 50,
      c: 95,
      f: 30,
      desc: '2 placki tortilli, 120g kurczaka/wędliny, ser żółty, sos czosnkowy na jogurcie.',
    },
  ],
};

// --- GENERATOR PLANU 18 TYGODNI PÓŁMARATONU ---
const INITIAL_RUN_PLAN = Array.from({ length: 18 }, (_, i) => {
  const weekNum = i + 1;
  const longRunKm = Math.min(8 + Math.floor(i * 0.8), 18);
  const totalKm = 6 + 6 + (weekNum === 18 ? 21.1 : longRunKm);
  return {
    week: weekNum,
    title:
      weekNum === 18
        ? 'TYDZIEŃ STARTOWY - PÓŁMARATON WARSAW!'
        : `Tydzień ${weekNum}`,
    runs: [
      { id: `w${weekNum}_1`, name: 'Pn: Bieg Spokojny (BS)', km: 6 },
      { id: `w${weekNum}_2`, name: 'Czw: Bieg z Akcentem (TM)', km: 6 },
      {
        id: `w${weekNum}_3`,
        name:
          weekNum === 18
            ? 'Niedz: START PÓŁMARATON (21.1 km)'
            : `Niedz: Długie Wybieganie (${longRunKm} km)`,
        km: weekNum === 18 ? 21.1 : longRunKm,
      },
    ],
    targetTotal: totalKm,
  };
});

// --- EDYTOWALNE PLANOWANIE ĆWICZEŃ SIŁOWYCH ---
const DEFAULT_WORKOUT_PLAN = {
  A: [
    {
      id: 'A1',
      nameCali: 'Podciąganie Podchwytem (Kalistenika)',
      nameGym: 'Wyciąg Wąsko Podchwytem (Lat Pulldown)',
      sets: 4,
      targetReps: '4-6 powt. / 40-42.5 kg',
      mode: 'gym',
    },
    {
      id: 'A2',
      nameCali: 'Dipy na Poręczach',
      nameGym: 'Wyciskanie Hantli na Ławce Płaskiej',
      sets: 4,
      targetReps: '6-8 powt. / 2x 14-16 kg',
      mode: 'gym',
    },
    {
      id: 'A3',
      nameCali: 'Pompki Klasyczne Powolne',
      nameGym: 'Wiosłowanie Hantlem Jednorącz',
      sets: 2,
      targetReps: '10-12 powt. / 16-18 kg',
      mode: 'cali',
    },
  ],
  B: [
    {
      id: 'B1',
      nameCali: 'Podciąganie Nachwytem z Gumą',
      nameGym: 'Lat Pulldown Szeroki Nachwyt',
      sets: 4,
      targetReps: '4-6 powt. / 45 kg',
      mode: 'gym',
    },
    {
      id: 'B2',
      nameCali: 'Pike Push-ups (Pod Barki)',
      nameGym: 'Wyciskanie Hantli Nad Głowę (OHP)',
      sets: 4,
      targetReps: '6-8 powt. / 2x 10-12 kg',
      mode: 'gym',
    },
    {
      id: 'B3',
      nameCali: 'Zwis Aktywny na Drążku',
      nameGym: 'Prostowanie Ramion z Linką Wyciągu',
      sets: 2,
      targetReps: '10-12 powt. / 15-20 kg',
      mode: 'gym',
    },
  ],
};

// Automatyczne wykrywanie aktualnego dnia tygodnia (Pn-Niedz)
const getTodayId = () => {
  const dayIndex = new Date().getDay(); // 0 = Niedziela, 1 = Poniedziałek...
  const map = ['nd', 'pn', 'wt', 'sr', 'cz', 'pt', 'so'];
  return map[dayIndex] || 'pn';
};

export default function App() {
  const [activeTab, setActiveTab] = useState('today');
  const [selectedDayId, setSelectedDayId] = useState(getTodayId());
  const [selectedWeek, setSelectedWeek] = useState(2);

  // Stany synchronizowalne i zapisywane lokalnie
  const [googleScriptUrl, setGoogleScriptUrl] = useState(() => {
    return localStorage.getItem('fitdorm_script_url') || '';
  });

  const [completedWorkouts, setCompletedWorkouts] = useState(() => {
    return JSON.parse(
      localStorage.getItem('fitdorm_completed_workouts') || '{}'
    );
  });

  const [supplements, setSupplements] = useState(() => {
    return JSON.parse(localStorage.getItem('fitdorm_supplements') || '{}');
  });

  const [selectedMeals, setSelectedMeals] = useState(() => {
    return JSON.parse(
      localStorage.getItem('fitdorm_meals') ||
        '{"breakfast":"A1","lunch":"B1","dinner":"C1"}'
    );
  });

  const [extraAdditions, setExtraAdditions] = useState(() => {
    return JSON.parse(
      localStorage.getItem('fitdorm_extras') ||
        '{"oats":0,"wpc":0,"banana":0,"peanut":0}'
    );
  });

  const [completedRuns, setCompletedRuns] = useState(() => {
    return JSON.parse(localStorage.getItem('fitdorm_runs') || '{}');
  });

  const [weeklyWeights, setWeeklyWeights] = useState(() => {
    return JSON.parse(
      localStorage.getItem('fitdorm_weights') ||
        '{"0":67.3,"1":67.5,"2":68.6,"3":68.9,"4":69.2}'
    );
  });

  const [workoutPlan, setWorkoutPlan] = useState(() => {
    return JSON.parse(
      localStorage.getItem('fitdorm_workout_plan') ||
        JSON.stringify(DEFAULT_WORKOUT_PLAN)
    );
  });

  // Zrobione powtórzenia/ciężar dzisiaj (wynik wpisany w trakcie treningu)
  const [loggedSets, setLoggedSets] = useState(() => {
    return JSON.parse(
      localStorage.getItem('fitdorm_logged_sets') ||
        '{"A1":"4,4,3,3","A2":"14kgx8,8,8,7"}'
    );
  });

  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState({
    loading: false,
    msg: '',
    type: '',
  });

  // Stoper Przerwy w Treningu Siłowym
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Zapisywanie w localStorage
  useEffect(() => {
    localStorage.setItem('fitdorm_script_url', googleScriptUrl);
  }, [googleScriptUrl]);

  useEffect(() => {
    localStorage.setItem(
      'fitdorm_completed_workouts',
      JSON.stringify(completedWorkouts)
    );
  }, [completedWorkouts]);

  useEffect(() => {
    localStorage.setItem('fitdorm_supplements', JSON.stringify(supplements));
  }, [supplements]);

  useEffect(() => {
    localStorage.setItem('fitdorm_meals', JSON.stringify(selectedMeals));
  }, [selectedMeals]);

  useEffect(() => {
    localStorage.setItem('fitdorm_extras', JSON.stringify(extraAdditions));
  }, [extraAdditions]);

  useEffect(() => {
    localStorage.setItem('fitdorm_runs', JSON.stringify(completedRuns));
  }, [completedRuns]);

  useEffect(() => {
    localStorage.setItem('fitdorm_weights', JSON.stringify(weeklyWeights));
  }, [weeklyWeights]);

  useEffect(() => {
    localStorage.setItem('fitdorm_workout_plan', JSON.stringify(workoutPlan));
  }, [workoutPlan]);

  useEffect(() => {
    localStorage.setItem('fitdorm_logged_sets', JSON.stringify(loggedSets));
  }, [loggedSets]);

  // Sygnał dźwiękowy stopera (Web Audio API)
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio API unsupported');
    }
  };

  // Logika Odliczania Stopera
  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
      playBeep();
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const startTimer = (sec) => {
    setTimerSeconds(sec);
    setTimerActive(true);
  };

  // Wyliczenia kalorii i makro dla wybranej diety
  const currentBreakfast =
    MEAL_DATABASE.breakfast.find((m) => m.id === selectedMeals.breakfast) ||
    MEAL_DATABASE.breakfast[0];
  const currentLunch =
    MEAL_DATABASE.lunch.find((m) => m.id === selectedMeals.lunch) ||
    MEAL_DATABASE.lunch[0];
  const currentDinner =
    MEAL_DATABASE.dinner.find((m) => m.id === selectedMeals.dinner) ||
    MEAL_DATABASE.dinner[0];

  const totalKcal =
    currentBreakfast.kcal +
    currentLunch.kcal +
    currentDinner.kcal +
    extraAdditions.oats * 185 +
    extraAdditions.wpc * 120 +
    extraAdditions.banana * 105 +
    extraAdditions.peanut * 155;

  const totalProtein =
    currentBreakfast.p +
    currentLunch.p +
    currentDinner.p +
    extraAdditions.oats * 6 +
    extraAdditions.wpc * 24 +
    extraAdditions.banana * 1 +
    extraAdditions.peanut * 4;

  const totalCarbs =
    currentBreakfast.c +
    currentLunch.c +
    currentDinner.c +
    extraAdditions.oats * 33 +
    extraAdditions.wpc * 2 +
    extraAdditions.banana * 27 +
    extraAdditions.peanut * 3;

  const totalFat =
    currentBreakfast.f +
    currentLunch.f +
    currentDinner.f +
    extraAdditions.oats * 3 +
    extraAdditions.wpc * 2 +
    extraAdditions.banana * 0 +
    extraAdditions.peanut * 12;

  // --- OBSŁUGA SYNCHRONIZACJI DWUKIERUNKOWEJ (GET & POST) ---

  // 1. POBIERANIE AKTUALNEGO PLANU Z GOOGLE SHEETS (GET)
  const fetchPlanFromGoogleSheets = useCallback(async () => {
    if (!googleScriptUrl) {
      setSyncStatus({
        loading: false,
        msg: 'Wklej URL skryptu Google Apps Script w ustawoeniach!',
        type: 'error',
      });
      return;
    }
    setSyncStatus({
      loading: true,
      msg: 'Łączenie i pobieranie danych z Arkusza...',
      type: 'info',
    });

    try {
      // Wywołanie GET z parametrem action=getAll
      const fetchUrl = googleScriptUrl.includes('?')
        ? `${googleScriptUrl}&action=getAll`
        : `${googleScriptUrl}?action=getAll`;

      const res = await fetch(fetchUrl);
      const data = await res.json();

      if (data && data.status === 'success') {
        if (data.workoutPlan) {
          setWorkoutPlan(data.workoutPlan);
          localStorage.setItem(
            'fitdorm_workout_plan',
            JSON.stringify(data.workoutPlan)
          );
        }
        if (data.weeklyWeights) {
          setWeeklyWeights((prev) => ({ ...prev, ...data.weeklyWeights }));
        }
        setSyncStatus({
          loading: false,
          msg: '✅ Zaktualizowano plan treningowy i wagi z Google Sheets!',
          type: 'success',
        });
      } else {
        setSyncStatus({
          loading: false,
          msg: 'Otrzymano odpowiedź, ale format danych był niepełny. Użyto zapisu lokalnego.',
          type: 'warning',
        });
      }
    } catch (err) {
      setSyncStatus({
        loading: false,
        msg: 'Uwaga: Brak odpowiedzi JSON z doGet (skrypt może wymagać uprawnień "Anyone"). Używasz lokalnej bazy.',
        type: 'warning',
      });
    }
  }, [googleScriptUrl]);

  // 2. WYSYŁANIE DZISIEJSZYCH DANYCH I WYNIKÓW DO GOOGLE SHEETS (POST)
  const sendReportToGoogleSheets = async () => {
    if (!googleScriptUrl) {
      setSyncStatus({
        loading: false,
        msg: 'Najpierw wklej swój Webhook URL z Google Apps Script!',
        type: 'error',
      });
      return;
    }

    setSyncStatus({
      loading: true,
      msg: 'Wysyłanie danych do Google Sheets...',
      type: 'info',
    });

    const payload = {
      date: new Date().toLocaleDateString('pl-PL'),
      timestamp: new Date().toISOString(),
      dayId: selectedDayId,
      weightToday: weeklyWeights[selectedWeek] || 68.6,
      kcalLogged: totalKcal,
      proteinLogged: totalProtein,
      completedWorkoutToday: !!completedWorkouts[selectedDayId],
      loggedWorkoutSets: loggedSets,
      selectedMeals: {
        breakfast: currentBreakfast.name,
        lunch: currentLunch.name,
        dinner: currentDinner.name,
      },
    };

    try {
      await fetch(googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setSyncStatus({
        loading: false,
        msg: '🚀 Dane wysłane! Arkusz Google został zaktualizowany.',
        type: 'success',
      });
    } catch (err) {
      setSyncStatus({
        loading: false,
        msg: 'Błąd wysyłania: ' + err.message,
        type: 'error',
      });
    }
  };

  // Pobierz plan z arkusza przy pierwszym uruchomieniu, jeśli URL jest zapisany
  useEffect(() => {
    if (googleScriptUrl) {
      fetchPlanFromGoogleSheets();
    }
  }, []);

  // Eksport do pliku CSV (Excel offline)
  const exportToCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Kategoria,Klucz/Dzien,Wartosc\n';

    Object.keys(supplements).forEach((k) => {
      csvContent += `Suplementy,${k},${supplements[k] ? 'ZROBIONE' : 'NIE'}\n`;
    });
    Object.keys(weeklyWeights).forEach((w) => {
      csvContent += `Waga,Tydzien_${w},${weeklyWeights[w]} kg\n`;
    });
    csvContent += `Dieta,Kcal_Razem,${totalKcal} kcal\n`;
    csvContent += `Dieta,Bialko_Razem,${totalProtein} g\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `FitDorm_Raport_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentDay =
    DEFAULT_WEEK_DAYS.find((d) => d.id === selectedDayId) ||
    DEFAULT_WEEK_DAYS[1];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-28 max-w-md mx-auto shadow-2xl relative border-x border-slate-900">
      {/* NAGŁÓWEK Z IKONĄ SYNCHRONIZACJI */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
            72
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight text-white flex items-center gap-1.5">
              FitDorm
              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.5 rounded-full font-mono">
                2-WAY SYNC
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Akademik • Półmaraton • Bouldering
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowSyncModal(true)}
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition flex items-center gap-1.5 shadow-sm active:scale-95"
          title="Centrum Synchronizacji z Google Sheets"
        >
          <Icons.CloudSync />
          <span className="text-xs font-bold text-slate-200">Sync</span>
        </button>
      </header>

      {/* GŁÓWNA ZAWARTOŚĆ STRONY */}
      <main className="p-4 space-y-5">
        {/* ========================================================= */}
        {/* ZAKŁADKA 1: DZIŚ (DASHBOARD) */}
        {/* ========================================================= */}
        {activeTab === 'today' && (
          <div className="space-y-4 animate-fadeIn">
            {/* WYBÓR DNIA TYGODNIA */}
            <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
              {DEFAULT_WEEK_DAYS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDayId(d.id)}
                  className={`flex-1 min-w-[50px] py-2.5 px-1 rounded-xl text-center text-xs font-semibold transition ${
                    selectedDayId === d.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 scale-[1.02]'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[11px] uppercase tracking-wider">
                    {d.short}
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full mx-auto mt-1 ${
                      completedWorkouts[d.id]
                        ? 'bg-emerald-400 ring-2 ring-emerald-950'
                        : 'bg-slate-800'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* KARTA DNIA I TRENINGU GŁÓWNEGO */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3 relative overflow-hidden shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    {currentDay.name} • Plan Uczelni
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    {currentDay.uni}
                  </h2>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-200 font-medium border border-slate-700">
                  {currentDay.workout.includes('Siłownia')
                    ? '🏋️ Siłownia 22:00'
                    : currentDay.workout.includes('Bieg')
                    ? '🏃 Bieg'
                    : currentDay.workout.includes('Ścianka')
                    ? '🧗 Boulder'
                    : '🧘 Rest'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <p className="text-[11px] text-slate-400 font-medium">
                  Zadanie Treningowe Dnia:
                </p>
                <p className="text-sm font-semibold text-slate-100 mt-0.5">
                  {currentDay.workout}
                </p>
              </div>

              {/* PRZYCISK ODHACZENIA TRENINGU */}
              <button
                onClick={() =>
                  setCompletedWorkouts((prev) => ({
                    ...prev,
                    [selectedDayId]: !prev[selectedDayId],
                  }))
                }
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md ${
                  completedWorkouts[selectedDayId]
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110'
                }`}
              >
                <Icons.Check />
                <span>
                  {completedWorkouts[selectedDayId]
                    ? 'TRENING WYKONANY!'
                    : 'Oznacz dzisiejszy trening jako wykonany'}
                </span>
              </button>
            </div>

            {/* OSTRZEŻENIE KOFEINOWE & SUPLEMENTACJA */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  💊 Suplementy na Dziś
                </h3>
                <span className="text-[10px] text-slate-400">
                  Regularność = Budowa masy
                </span>
              </div>

              {!currentDay.caffeineOk && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-2.5">
                  <div className="text-amber-400 mt-0.5">
                    <Icons.AlertTriangle />
                  </div>
                  <div className="text-xs text-amber-200 leading-snug">
                    <span className="font-bold">ZAKAZ KOFEINY PO 16:30!</span>{' '}
                    Dzisiaj trening o 22:00. Kofeina zaburzy Twój sen i
                    regenerację mięśni.
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {[
                  {
                    id: 'creatine',
                    name: 'Kreatyna Monohydrat (5g)',
                    desc: 'Popić dużą ilością wody (nasycenie mięśni)',
                    badge: 'Siła +',
                  },
                  {
                    id: 'vitD3',
                    name: 'Witamina D3 (2000-4000 IU)',
                    desc: 'Do śniadania razem z tłuszczem',
                    badge: 'Zdrowie',
                  },
                  {
                    id: 'wpc',
                    name: 'Odżywka Białkowa WPC (30-35g)',
                    desc: 'W szejku owocowym lub owsiance',
                    badge: 'Białko',
                  },
                  {
                    id: 'magnesium',
                    name: 'Magnez KFD Magnesium+ (4 kaps. = 400 mg)',
                    desc: 'Przed snem (o 22:30 / 23:00)',
                    badge: 'Sen',
                  },
                  {
                    id: 'caffeine',
                    name: 'Kofeina 200 mg (Kapsułka)',
                    desc: currentDay.caffeineOk
                      ? '30-45 min przed akcentem / ścianką'
                      : 'BLOKADA DZISIAJ!',
                    badge: currentDay.caffeineOk ? 'OK' : 'ZAKAZ',
                    disabled: !currentDay.caffeineOk,
                  },
                ].map((sup) => {
                  const itemKey = `${selectedDayId}_${sup.id}`;
                  const isChecked = !!supplements[itemKey];

                  return (
                    <div
                      key={sup.id}
                      onClick={() =>
                        !sup.disabled &&
                        setSupplements((prev) => ({
                          ...prev,
                          [itemKey]: !prev[itemKey],
                        }))
                      }
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        sup.disabled
                          ? 'opacity-40 bg-slate-950 border-slate-900 cursor-not-allowed'
                          : isChecked
                          ? 'bg-slate-800/90 border-emerald-500/40 text-slate-200'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                            isChecked
                              ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold'
                              : 'border-slate-700 bg-slate-900'
                          }`}
                        >
                          {isChecked && <Icons.Check />}
                        </div>
                        <div>
                          <p
                            className={`text-xs font-bold ${
                              isChecked
                                ? 'line-through text-slate-400'
                                : 'text-slate-100'
                            }`}
                          >
                            {sup.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {sup.desc}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          sup.disabled
                            ? 'bg-red-950 text-red-400 border border-red-900'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {sup.badge}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SZYBKI BILANS KALORII & BIAŁKA */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-white">📊 Bilans Dnia</h3>
                <span className="text-xs text-cyan-400 font-semibold">
                  Cel: 3100 kcal
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">
                      Kalorie ({totalKcal} / 3100 kcal)
                    </span>
                    <span className="font-bold text-cyan-400">
                      {Math.round((totalKcal / 3100) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                      style={{
                        width: `${Math.min((totalKcal / 3100) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">
                      Białko ({totalProtein}g / 150g)
                    </span>
                    <span className="font-bold text-emerald-400">
                      {Math.round((totalProtein / 150) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${Math.min((totalProtein / 150) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ZAKŁADKA 2: SIŁA 20 MIN (LIVE SYNCED WORKOUT) */}
        {/* ========================================================= */}
        {activeTab === 'strength' && (
          <div className="space-y-4 animate-fadeIn">
            {/* SELEKTOR TRENING A / TRENING B */}
            <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setSelectedDayId('wt')}
                className={`py-2.5 rounded-xl text-xs font-bold transition ${
                  selectedDayId === 'wt'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                TRENING A (Wtorek 22:00)
              </button>
              <button
                onClick={() => setSelectedDayId('nd')}
                className={`py-2.5 rounded-xl text-xs font-bold transition ${
                  selectedDayId === 'nd'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                TRENING B (Niedziela)
              </button>
            </div>

            {/* STOPER SUPERSERII (BOX PRZERWY) */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-center space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="font-semibold text-cyan-400 flex items-center gap-1">
                  ⏱️ Stoper Przerwy w Superserii
                </span>
                <span>Tempo 20 min</span>
              </div>

              <div className="text-4xl font-extrabold text-white tracking-widest font-mono py-1">
                {Math.floor(timerSeconds / 60)
                  .toString()
                  .padStart(2, '0')}
                :{(timerSeconds % 60).toString().padStart(2, '0')}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => startTimer(60)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl text-xs font-bold border border-slate-700"
                >
                  Przerwa 60s
                </button>
                <button
                  onClick={() => startTimer(90)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl text-xs font-bold border border-slate-700"
                >
                  Przerwa 90s
                </button>
                <button
                  onClick={() => setTimerActive(!timerActive)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700"
                >
                  {timerActive ? <Icons.Pause /> : <Icons.Play />}
                </button>
              </div>
            </div>

            {/* LISTA ĆWICZEŃ ZE SYNCHRONIZOWANEGO PLANU */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Rozpiska Ćwiczeń • Trening{' '}
                  {selectedDayId === 'wt' ? 'A' : 'B'}
                </h3>
                <span className="text-[10px] text-cyan-400 font-mono">
                  Edycja na Żywo / Sync
                </span>
              </div>

              {(selectedDayId === 'wt' ? workoutPlan.A : workoutPlan.B).map(
                (ex, idx) => {
                  const isCali = ex.mode === 'cali';
                  const exName = isCali ? ex.nameCali : ex.nameGym;

                  return (
                    <div
                      key={ex.id}
                      className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                            {idx === 2
                              ? 'FINISHER (2 serie)'
                              : `SUPERSERIA ${idx + 1}`}
                          </span>
                          <h4 className="font-bold text-sm text-white mt-1">
                            {exName}
                          </h4>
                        </div>

                        {/* PRZEŁĄCZNIK WARIANTU */}
                        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px] font-bold">
                          <button
                            onClick={() => {
                              const updated = { ...workoutPlan };
                              const targetArr =
                                selectedDayId === 'wt' ? updated.A : updated.B;
                              targetArr[idx].mode = 'cali';
                              setWorkoutPlan(updated);
                            }}
                            className={`px-2 py-1 rounded transition ${
                              isCali
                                ? 'bg-cyan-500 text-slate-950'
                                : 'text-slate-400'
                            }`}
                          >
                            Cali
                          </button>
                          <button
                            onClick={() => {
                              const updated = { ...workoutPlan };
                              const targetArr =
                                selectedDayId === 'wt' ? updated.A : updated.B;
                              targetArr[idx].mode = 'gym';
                              setWorkoutPlan(updated);
                            }}
                            className={`px-2 py-1 rounded transition ${
                              !isCali
                                ? 'bg-cyan-500 text-slate-950'
                                : 'text-slate-400'
                            }`}
                          >
                            Hantle
                          </button>
                        </div>
                      </div>

                      {/* EDYCJA ZAMIERZONEGO CIĘŻARU / REPS W APCE */}
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Cel w Arkuszu:</span>
                        <input
                          type="text"
                          value={ex.targetReps}
                          onChange={(e) => {
                            const updated = { ...workoutPlan };
                            const targetArr =
                              selectedDayId === 'wt' ? updated.A : updated.B;
                            targetArr[idx].targetReps = e.target.value;
                            setWorkoutPlan(updated);
                          }}
                          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-cyan-400 font-semibold text-xs outline-none focus:border-cyan-500 w-48"
                        />
                      </div>

                      {/* POLE DO WPISANIA DZISIEJSZEGO WYNIKU (NP. 4x4, 14kgx8) */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 block">
                          Wynik zrobiony dzisiaj (zapis w Logi_Apka):
                        </label>
                        <input
                          type="text"
                          placeholder="np. 4, 4, 3, 3 lub 16kg x 8"
                          value={loggedSets[ex.id] || ''}
                          onChange={(e) =>
                            setLoggedSets((prev) => ({
                              ...prev,
                              [ex.id]: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-emerald-400 font-mono outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ZAKŁADKA 3: DIETA 3100 (KALKULATOR KLOCEK W KLOCEK) */}
        {/* ========================================================= */}
        {activeTab === 'diet' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Wybierz Dzisiejszy Zestaw Posiłków (3100 kcal)
              </h3>

              {/* ŚNIADANIE */}
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-cyan-400 block">
                  🥣 Śniadanie (~880 kcal)
                </label>
                <select
                  value={selectedMeals.breakfast}
                  onChange={(e) =>
                    setSelectedMeals((prev) => ({
                      ...prev,
                      breakfast: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-medium focus:border-cyan-500 outline-none"
                >
                  {MEAL_DATABASE.breakfast.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id}: {m.name} ({m.kcal} kcal | {m.p}g B)
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 italic pt-1">
                  {currentBreakfast.desc}
                </p>
              </div>

              {/* OBIAD */}
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-cyan-400 block">
                  🍱 Obiad na Uczelnię (~1350 kcal)
                </label>
                <select
                  value={selectedMeals.lunch}
                  onChange={(e) =>
                    setSelectedMeals((prev) => ({
                      ...prev,
                      lunch: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-medium focus:border-cyan-500 outline-none"
                >
                  {MEAL_DATABASE.lunch.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id}: {m.name} ({m.kcal} kcal | {m.p}g B)
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 italic pt-1">
                  {currentLunch.desc}
                </p>
              </div>

              {/* KOLACJA */}
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-cyan-400 block">
                  🌙 Kolacja / Szejk Gainer (~860 kcal)
                </label>
                <select
                  value={selectedMeals.dinner}
                  onChange={(e) =>
                    setSelectedMeals((prev) => ({
                      ...prev,
                      dinner: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-medium focus:border-cyan-500 outline-none"
                >
                  {MEAL_DATABASE.dinner.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id}: {m.name} ({m.kcal} kcal | {m.p}g B)
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 italic pt-1">
                  {currentDinner.desc}
                </p>
              </div>
            </div>

            {/* SZYBKIE DOKŁADKI */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Szybkie Dokładki Kaloryczne
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    key: 'oats',
                    label: '+0.5 szkl. płatków',
                    kcal: '+185 kcal',
                  },
                  {
                    key: 'wpc',
                    label: '+1 miarka WPC',
                    kcal: '+120 kcal / 24g B',
                  },
                  { key: 'banana', label: '+1 banan', kcal: '+105 kcal' },
                  {
                    key: 'peanut',
                    label: '+1 łyżka masła orz.',
                    kcal: '+155 kcal',
                  },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() =>
                      setExtraAdditions((prev) => ({
                        ...prev,
                        [item.key]: prev[item.key] + 1,
                      }))
                    }
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-left hover:border-slate-700 transition"
                  >
                    <div className="text-xs font-bold text-slate-200">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-cyan-400 flex justify-between mt-0.5">
                      <span>{item.kcal}</span>
                      <span className="font-bold text-white">
                        x{extraAdditions[item.key]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setExtraAdditions({ oats: 0, wpc: 0, banana: 0, peanut: 0 })
                }
                className="w-full text-center text-xs text-slate-500 hover:text-slate-400 py-1"
              >
                Resetuj dokładki
              </button>
            </div>

            {/* PODSUMOWANIE MAKRO */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-white">
                  🥗 Podsumowanie Dnia
                </h3>
                <span
                  className={`text-[11px] px-2.5 py-1 rounded-full font-bold ${
                    totalKcal >= 3000 && totalKcal <= 3250
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {totalKcal >= 3000 && totalKcal <= 3250
                    ? 'IDEALNIE W CELU'
                    : totalKcal < 3000
                    ? 'DODAJ KALORII'
                    : 'ZA DUŻO KALORII'}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Kcal</div>
                  <div className="text-sm font-bold text-cyan-400 mt-0.5">
                    {totalKcal}
                  </div>
                  <div className="text-[9px] text-slate-500">Cel: 3100</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Białko</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    {totalProtein}g
                  </div>
                  <div className="text-[9px] text-slate-500">Cel: 150g</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Węgle</div>
                  <div className="text-sm font-bold text-amber-400 mt-0.5">
                    {totalCarbs}g
                  </div>
                  <div className="text-[9px] text-slate-500">Cel: 455g</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Tłuszcz</div>
                  <div className="text-sm font-bold text-purple-400 mt-0.5">
                    {totalFat}g
                  </div>
                  <div className="text-[9px] text-slate-500">Cel: 76g</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ZAKŁADKA 4: PÓŁMARATON & WAGA (TRACKER 72 KG) */}
        {/* ========================================================= */}
        {activeTab === 'halfmarathon' && (
          <div className="space-y-4 animate-fadeIn">
            {/* VYRAZNY WSKAŹNIK WAGI I WYKRES */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    Cel Masy Mięśniowej
                  </span>
                  <h3 className="text-base font-bold text-white">
                    67.3 kg ➔ 72.0 kg
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
                  +0.25 kg / tydz
                </span>
              </div>

              {/* WYKRES SVG PROGRESJI WAGI */}
              <div className="h-32 w-full pt-1">
                <svg className="w-full h-full" viewBox="0 0 300 100">
                  <line
                    x1="0"
                    y1="90"
                    x2="300"
                    y2="90"
                    stroke="#1e293b"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="50"
                    x2="300"
                    y2="50"
                    stroke="#1e293b"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="10"
                    x2="300"
                    y2="10"
                    stroke="#1e293b"
                    strokeWidth="1"
                  />

                  {/* Linia Celu */}
                  <path
                    d="M 10 85 Q 50 60, 100 50 T 200 30 T 290 10"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.5"
                    strokeDasharray="4"
                  />

                  {/* Punkty z wpisanej wagi */}
                  <circle cx="10" cy="85" r="4" fill="#38bdf8" />
                  <circle cx="50" cy="80" r="4" fill="#38bdf8" />
                  <circle cx="100" cy="55" r="5" fill="#10b981" />
                </svg>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Start (67.3kg)</span>
                  <span>Tyg 2 (+1.1kg Kreatyna)</span>
                  <span>Cel (72.0kg)</span>
                </div>
              </div>

              {/* INPUT WAGI NA WYBRANY TYDZIEN */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">
                    Waga w Tygodniu {selectedWeek}:
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Efekt kreatyny: +1.0 - +1.5kg wody
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    step="0.1"
                    value={weeklyWeights[selectedWeek] || 68.6}
                    onChange={(e) =>
                      setWeeklyWeights((prev) => ({
                        ...prev,
                        [selectedWeek]: parseFloat(e.target.value),
                      }))
                    }
                    className="w-16 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-center text-xs font-bold text-emerald-400 outline-none focus:border-emerald-500"
                  />
                  <span className="text-xs text-slate-400">kg</span>
                </div>
              </div>
            </div>

            {/* PLAN BIEGOWY NA 18 TYGODNI */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  🏃 18 Tygodni do Półmaratonu Warszawskiego
                </h3>
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-cyan-400 font-bold outline-none"
                >
                  {Array.from({ length: 18 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Tydzień {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2.5">
                {INITIAL_RUN_PLAN.filter((w) => w.week === selectedWeek).map(
                  (w) => (
                    <div
                      key={w.week}
                      className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-cyan-400">
                          {w.title}
                        </span>
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                          Suma: {w.targetTotal} km
                        </span>
                      </div>

                      <div className="space-y-2">
                        {w.runs.map((r) => {
                          const isDone = !!completedRuns[r.id];
                          return (
                            <div
                              key={r.id}
                              onClick={() =>
                                setCompletedRuns((prev) => ({
                                  ...prev,
                                  [r.id]: !prev[r.id],
                                }))
                              }
                              className={`p-3 rounded-xl text-xs flex justify-between items-center cursor-pointer transition ${
                                isDone
                                  ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                                  : 'bg-slate-950 border border-slate-800 text-slate-300'
                              }`}
                            >
                              <div className="flex items-center space-x-2.5">
                                <div
                                  className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                                    isDone
                                      ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold'
                                      : 'border-slate-700'
                                  }`}
                                >
                                  {isDone && <Icons.Check />}
                                </div>
                                <span
                                  className={
                                    isDone
                                      ? 'line-through text-slate-400'
                                      : 'font-medium'
                                  }
                                >
                                  {r.name}
                                </span>
                              </div>
                              <span className="font-mono text-xs font-bold text-slate-300">
                                {r.km} km
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL CENTRUM SYNCHRONIZACJI EXCEL / GOOGLE SHEETS */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Icons.CloudSync />
                <span>Synchronizacja z Google Sheets</span>
              </h3>
              <button
                onClick={() => setShowSyncModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* STATUS SYNCHRONIZACJI */}
            {syncStatus.msg && (
              <div
                className={`p-3 rounded-xl text-xs font-medium border ${
                  syncStatus.type === 'success'
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    : syncStatus.type === 'error'
                    ? 'bg-red-950/60 border-red-800 text-red-300'
                    : syncStatus.type === 'warning'
                    ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-cyan-300'
                }`}
              >
                {syncStatus.msg}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-300 block">
                URL Google Apps Script Web App:
              </label>
              <input
                type="text"
                placeholder="https://script.google.com/macros/s/..."
                value={googleScriptUrl}
                onChange={(e) => setGoogleScriptUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-cyan-300 outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* PRZYCISKI SYNCHRONIZACJI DWUKIERUNKOWEJ */}
            <div className="space-y-2 pt-1">
              <button
                onClick={fetchPlanFromGoogleSheets}
                disabled={syncStatus.loading}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 transition"
              >
                <Icons.Download />
                <span>Pobierz aktualny plan z Google Sheets (GET)</span>
              </button>

              <button
                onClick={sendReportToGoogleSheets}
                disabled={syncStatus.loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold shadow-md flex items-center justify-center gap-2 hover:brightness-110 transition"
              >
                <Icons.Upload />
                <span>Wyślij dzisiejsze logi do Google Sheets (POST)</span>
              </button>

              <button
                onClick={exportToCSV}
                className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-400 text-[11px] font-semibold border border-slate-800"
              >
                Eksportuj kopie zapasową do pliku CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOLNY PASEK NAWIGACJI (BOTTOM NAV) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-2 z-40">
        <div className="flex justify-around items-center">
          {[
            { id: 'today', label: 'Dzisiaj', icon: Icons.Calendar },
            { id: 'strength', label: 'Siła 20m', icon: Icons.Dumbbell },
            { id: 'diet', label: 'Dieta 3100', icon: Icons.Utensils },
            { id: 'halfmarathon', label: 'Półmaraton', icon: Icons.TrendingUp },
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition ${
                  isActive
                    ? 'text-cyan-400 font-bold scale-105'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <IconComponent />
                <span className="text-[10px] mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
