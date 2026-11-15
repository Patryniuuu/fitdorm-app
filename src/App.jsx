// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Dumbbell,
  Utensils,
  TrendingUp,
  Check,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CloudUpload,
  Download,
  Upload,
  Info,
  Flame,
  Timer,
  ChevronRight,
  Award,
  HeartPulse
} from 'lucide-react';

// --- DOMYŚLNE DANE DNI TYGODNIA ---
const DEFAULT_WEEK_DAYS = [
  { id: 'pn', name: 'Poniedziałek', short: 'Pn', uni: '8:00 - 14:00', workout: 'Bieg Spokojny (BS 6 km)', type: 'run', caffeineOk: true, paceInfo: 'Tempo BS: 6:45-7:15 min/km | Tętno: 145-158 bpm' },
  { id: 'wt', name: 'Wtorek', short: 'Wt', uni: '8:00 - 15:00 (+ nauka)', workout: 'Siłownia - Trening A (3 Superserie)', type: 'gym', caffeineOk: false, note: 'ZAKAZ KOFEINY PO 16:30! Trening wieczorny (22:00).' },
  { id: 'sr', name: 'Środa', short: 'Śr', uni: '10:00 - 16:00', workout: 'Ścianka Bouldering (Sekcja / Projektowanie)', type: 'climb', caffeineOk: true, note: 'Kofeina 200mg 45 min przed ścianką OK.' },
  { id: 'cz', name: 'Czwartek', short: 'Czw', uni: '14:00 - 16:00', workout: 'Bieg z Akcentem (6-8 km w tym rytmy/TM)', type: 'run', caffeineOk: true, paceInfo: 'Rozgrzewka 7:00 -> Akcent ~6:10-6:20 min/km' },
  { id: 'pt', name: 'Piątek', short: 'Pt', uni: '8:00 - 12:00', workout: 'Bouldering Luźny LUB Regeneracja', type: 'climb', caffeineOk: true },
  { id: 'so', name: 'Sobota', short: 'Sob', uni: 'Wolne (Nauka / Odpoczynek)', workout: 'Regeneracja / Mobilność / Spacer', type: 'rest', caffeineOk: true },
  { id: 'nd', name: 'Niedziela', short: 'Niedz', uni: 'Wolne (Poranny pakiet!)', workout: 'Rano: Siłownia Trening B + Wybieganie (8-18 km)', type: 'hybrid', caffeineOk: true, paceInfo: '1 km rozgrzewki (7:15) + reszta 6:45-7:15 min/km (HR <158)', note: 'Rano przed wyjściem: Precle solone + WPC + 200mg Kofeiny!' }
];

// --- NOWY PLAN SIŁOWY: 3 SUPERSERIE POD PEŁNĄ SIŁOWNIĘ (35-40 MIN) ---
const DEFAULT_WORKOUT_PLAN = {
  A: {
    title: 'TRENING A (Wtorek 22:00)',
    subtitle: 'Klatka Płasko + Plecy Szerokość + Modlitewnik & Bok Barku',
    supersets: [
      {
        id: 'SS1_A',
        name: 'SUPERSERIA 1: Ciężka Baza (Plecy + Klatka)',
        rounds: 4,
        restBetween: 60,
        restAfter: 90,
        instruction: 'Robisz A1 -> 60s przerwy -> robisz A2 -> 90s przerwy. Powtarzasz 4 razy.',
        exercises: [
          {
            id: 'A1',
            code: 'A1',
            part: 'Plecy - Szerokość',
            nameGym: 'Podciąganie podchwytem LUB Wyciąg wąsko',
            nameCali: 'Podciąganie podchwytem (Chin-ups) + Negatywy',
            sets: 4,
            targetReps: '4 serie x 5-8 powt. (lub 45-50 kg)',
            tip: 'Ciągnij łokcie w dół do bioder, broda nad drążek / drążek do obojczyka.',
            mode: 'gym'
          },
          {
            id: 'A2',
            code: 'A2',
            part: 'Klatka - Masa Główna',
            nameGym: 'Wyciskanie hantli lub sztangi na ławce płaskiej',
            nameCali: 'Dipy na poręczach (głębokie)',
            sets: 4,
            targetReps: '4 serie x 6-8 powt. (np. hantle 2x 16-20 kg)',
            tip: 'Łopatki ściągnięte w ławkę, kontrolowane opuszczanie 2 sekundy w dół.',
            mode: 'gym'
          }
        ]
      },
      {
        id: 'SS2_A',
        name: 'SUPERSERIA 2: Rozciągnięcie Klatki + Grubość Pleców',
        rounds: 3,
        restBetween: 45,
        restAfter: 90,
        instruction: 'Robisz B1 -> 45s przerwy -> robisz B2 -> 90s przerwy. Powtarzasz 3 razy.',
        exercises: [
          {
            id: 'B1',
            code: 'B1',
            part: 'Klatka - Izolacja i Pompa',
            nameGym: 'Maszyna Butterfly (Pec Deck - Rozpiętki siedząc)',
            nameCali: 'Pompki szerokie na uchwytach (powolne)',
            sets: 3,
            targetReps: '3 serie x 10-12 powt. (1s spięcia!)',
            tip: 'Zatrzymaj dłonie złączone przed sobą na 1 sekundę w maksymalnym spięciu klatki.',
            mode: 'gym'
          },
          {
            id: 'B2',
            code: 'B2',
            part: 'Plecy - Dół i Środek',
            nameGym: 'Wiosłowanie siedząc na wyciągu dolnym (wąski chwyt)',
            nameCali: 'Podciąganie australijskie nisko',
            sets: 3,
            targetReps: '3 serie x 8-10 powt. (ciągnij do pępka)',
            tip: 'Prowadź łokcie blisko ciała nisko w stronę bioder – zaangażujesz dół pleców.',
            mode: 'gym'
          }
        ]
      },
      {
        id: 'SS3_A',
        name: 'SUPERSERIA 3: Biceps Modlitewnik + Szerokość Barków',
        rounds: 3,
        restBetween: 30,
        restAfter: 75,
        instruction: 'Robisz C1 -> 30s przerwy -> robisz C2 -> 75s przerwy. Powtarzasz 3 razy.',
        exercises: [
          {
            id: 'C1',
            code: 'C1',
            part: 'Biceps - Szczyt',
            nameGym: 'Uginanie ramion na Modlitewniku (łamana / hantle)',
            nameCali: 'Podciąganie wąskim podchwytem (półzakres)',
            sets: 3,
            targetReps: '3 serie x 10-12 powt.',
            tip: 'Nie odrywaj łokci od poduszki modlitewnika, pełne rozciągnięcie na dole.',
            mode: 'gym'
          },
          {
            id: 'C2',
            code: 'C2',
            part: 'Barki - Bok (Szerokość V)',
            nameGym: 'Wznosy ramion bokiem na Bramie lub z hantlami',
            nameCali: 'Plank boczny z odwodzeniem',
            sets: 3,
            targetReps: '3 serie x 12-15 powt. (mały ciężar, technicznie)',
            tip: 'Prowadź ruch łokciem, nie szarp tułowiem – ma palić bok barku.',
            mode: 'gym'
          }
        ]
      }
    ]
  },
  B: {
    title: 'TRENING B (Niedziela Rano)',
    subtitle: 'Góra Klatki Skos + OHP Stojąc + Plecy + Brama & Triceps',
    supersets: [
      {
        id: 'SS1_B',
        name: 'SUPERSERIA 1: Góra Klatki + Szerokie Plecy',
        rounds: 4,
        restBetween: 60,
        restAfter: 90,
        instruction: 'Robisz A1 -> 60s przerwy -> robisz A2 -> 90s przerwy. Powtarzasz 4 razy.',
        exercises: [
          {
            id: 'B_A1',
            code: 'A1',
            part: 'Plecy - Góra i Szerokość',
            nameGym: 'Lat Pulldown (Wyciąg górny szerokim nachwytem)',
            nameCali: 'Podciąganie szerokim nachwytem z gumą',
            sets: 4,
            targetReps: '4 serie x 8-10 powt. (40-45 kg)',
            tip: 'Ściągaj drążek do górnej części klatki, lekko odchyl tułów w tył.',
            mode: 'gym'
          },
          {
            id: 'B_A2',
            code: 'A2',
            part: 'Klatka - Góra (Obojczyki)',
            nameGym: 'Wyciskanie hantli na ławce skośnej dodatniej (30°)',
            nameCali: 'Pompki z nogami na podwyższeniu',
            sets: 4,
            targetReps: '4 serie x 8-10 powt. (2x 14-18 kg)',
            tip: 'Ustaw ławkę na kąt 30° (1-2 ząbki w górę). Świetnie buduje górę klatki.',
            mode: 'gym'
          }
        ]
      },
      {
        id: 'SS2_B',
        name: 'SUPERSERIA 2: Siła Barków OHP + Wiosłowanie Jednorącz',
        rounds: 3,
        restBetween: 60,
        restAfter: 90,
        instruction: 'Robisz B1 -> 60s przerwy -> robisz B2 -> 90s przerwy. Powtarzasz 3 razy.',
        exercises: [
          {
            id: 'B_B1',
            code: 'B1',
            part: 'Barki + Core - Siła',
            nameGym: 'OHP - Wyciskanie sztangi lub hantli nad głowę stojąc',
            nameCali: 'Pike Push-ups (Pompki w stójce łamanej)',
            sets: 3,
            targetReps: '3 serie x 6-8 powt. (sztanga 25-32.5 kg)',
            tip: 'Napnij mocno pośladki i brzuch, nie wyginaj dolnych pleców w łuk!',
            mode: 'gym'
          },
          {
            id: 'B_B2',
            code: 'B2',
            part: 'Plecy - Jednostronnie',
            nameGym: 'Wiosłowanie hantlem w oparciu o ławkę',
            nameCali: 'Wiosłowanie australijskie jednorącz',
            sets: 3,
            targetReps: '3 serie x 8-10 powt. na rękę (18-22 kg)',
            tip: 'Ciągnij hantel po łuku w stronę biodra, mocno rozciągnij łopatkę na dole.',
            mode: 'gym'
          }
        ]
      },
      {
        id: 'SS3_B',
        name: 'SUPERSERIA 3: Brama Klatka + Triceps & Chwyt',
        rounds: 3,
        restBetween: 30,
        restAfter: 75,
        instruction: 'Robisz C1 -> 30s przerwy -> robisz C2 -> 75s przerwy. Powtarzasz 3 razy.',
        exercises: [
          {
            id: 'B_C1',
            code: 'C1',
            part: 'Klatka - Dolne i Środkowe Włókna',
            nameGym: 'Rozpiętki na Bramie z górnych wyciągów',
            nameCali: 'Pompki diamentowe / wąskie',
            sets: 3,
            targetReps: '3 serie x 12-15 powt.',
            tip: 'Ściągaj linki z góry w dół przed biodra, skrzyżuj lekko dłonie na końcu.',
            mode: 'gym'
          },
          {
            id: 'B_C2',
            code: 'C2',
            part: 'Triceps + Przedramię',
            nameGym: 'Prostowanie ramion ze sznurem na Bramie + Uginanie młotkowe',
            nameCali: 'Zwis aktywny na drążku (pod bouldery)',
            sets: 3,
            targetReps: '3 serie x 10-12 powt. (15-20 kg)',
            tip: 'Przytrzymaj łokcie przy żebrach, na dole rozdziel końcówki sznura na boki.',
            mode: 'gym'
          }
        ]
      }
    ]
  }
};

// --- BAZA POSIŁKÓW KLOCEK W KLOCEK (3100 kcal) ---
const MEAL_DATABASE = {
  breakfast: [
    { id: 'A1', name: 'Nocna Owsianka TURBO + WPC', kcal: 885, p: 48, c: 118, f: 22, desc: '1,5 szkl. płatków, 1 miarka WPC, 1,5 szkl. mleka, banan, 1,5 łyżki masła orzech.' },
    { id: 'A2', name: 'Jajecznica 4 Jaja + Pieczywo + Szejk WPC', kcal: 860, p: 52, c: 78, f: 34, desc: '4 jaja, 3 grahamki/kromki, masło, szejk WPC z wodą.' },
    { id: 'A3', name: 'Płatki Czekoladowe / Owsiane + Skyr + WPC', kcal: 875, p: 49, c: 122, f: 19, desc: 'Duża miska płatków (120g), mleko, 1x Skyr lub miarka WPC.' },
    { id: 'A4', name: 'Poranny Starter Biegacza (Precle + WPC + Śniadanie)', kcal: 890, p: 46, c: 128, f: 20, desc: 'Przed biegiem: garść precli solonych + WPC. Po biegu: kanapki/płatki.' }
  ],
  lunch: [
    { id: 'B1', name: 'Chili Con Carne Studenta (2 Pudełka)', kcal: 1350, p: 68, c: 165, f: 38, desc: '250g mielonego z szynki, 2 woreczki ryżu (200g), kukurydza, fasola, sos pomidorowy.' },
    { id: 'B2', name: 'Makaron Bolognese z Mozzarellą', kcal: 1320, p: 65, c: 158, f: 42, desc: '200g makaronu, 250g mięsa, Passata, 1/2 kulki mozzarelli.' },
    { id: 'B3', name: 'Kurczak Curry w Sosie Kokosowym z Ryżem', kcal: 1380, p: 72, c: 170, f: 36, desc: '250g piersi z kurczaka, 2 woreczki ryżu, warzywa na patelnię, mleczko kokosowe.' },
    { id: 'B4', name: 'Burrito w Tortilli (Długi Wtorek)', kcal: 1310, p: 64, c: 150, f: 44, desc: '3 duże placki tortilli, 220g mięsa, fasola czerwona, ryż, ser żółty.' }
  ],
  dinner: [
    { id: 'C1', name: 'Szejk Gainer Studenta (Po siłowni 22:45)', kcal: 865, p: 44, c: 115, f: 23, desc: '1 szklanka płatków, 1 miarka WPC, 350ml mleka, 1 banan, masło orzechowe, 5g Kreatyny.' },
    { id: 'C2', name: 'Mega Kanapki z Mozzarellą i Szynką + WPC', kcal: 850, p: 48, c: 92, f: 28, desc: '4 kromki chleba, szynka z piersi, mozzarella, pomidor + szejk WPC.' },
    { id: 'C3', name: '2x Serek Wiejski z Płatkami / Preclami', kcal: 840, p: 46, c: 105, f: 20, desc: '400g serka wiejskiego, płatki czekoladowe lub precle, orzechy.' },
    { id: 'C4', name: 'Tortilla Quesadilla z Kurczakiem i Serem', kcal: 880, p: 50, c: 95, f: 30, desc: '2 placki tortilli, 120g kurczaka/wędliny, ser żółty, sos czosnkowy na jogurcie.' }
  ]
};

// --- GENERATOR PLANU 18 TYGODNI PÓŁMARATONU ---
const INITIAL_RUN_PLAN = Array.from({ length: 18 }, (_, i) => {
  const weekNum = i + 1;
  const longRunKm = Math.min(8 + Math.floor(i * 0.75), 18);
  const totalKm = 6 + 6 + (weekNum === 18 ? 21.1 : longRunKm);
  return {
    week: weekNum,
    title: weekNum === 18 ? 'TYDZIEŃ STARTOWY - PÓŁMARATON WARSZAWSKI!' : `Tydzień ${weekNum}`,
    runs: [
      { id: `w${weekNum}_1`, name: 'Pn: Bieg Spokojny (6:45-7:15/km)', km: 6 },
      { id: `w${weekNum}_2`, name: 'Czw: Bieg z Akcentem / Rytmy', km: 6 },
      { id: `w${weekNum}_3`, name: weekNum === 18 ? 'Niedz: START PÓŁMARATON (21.1 km)' : `Niedz: Wybieganie 1km rozgrz. + ${longRunKm - 1}km BS`, km: weekNum === 18 ? 21.1 : longRunKm }
    ],
    targetTotal: totalKm
  };
});

const getTodayId = () => {
  const dayIndex = new Date().getDay();
  const map = ['nd', 'pn', 'wt', 'sr', 'cz', 'pt', 'so'];
  return map[dayIndex] || 'nd';
};

export default function App() {
  const [activeTab, setActiveTab] = useState('today');
  const [selectedDayId, setSelectedDayId] = useState(getTodayId());
  const [selectedWorkoutType, setSelectedWorkoutType] = useState('A'); // 'A' lub 'B'
  const [selectedWeek, setSelectedWeek] = useState(2);

  // Stany zapisywane lokalnie w telefonie
  const [googleScriptUrl, setGoogleScriptUrl] = useState(() => localStorage.getItem('fitdorm_script_url') || '');
  const [completedWorkouts, setCompletedWorkouts] = useState(() => JSON.parse(localStorage.getItem('fitdorm_completed_workouts') || '{}'));
  const [supplements, setSupplements] = useState(() => JSON.parse(localStorage.getItem('fitdorm_supplements') || '{}'));
  const [selectedMeals, setSelectedMeals] = useState(() => JSON.parse(localStorage.getItem('fitdorm_meals') || '{"breakfast":"A1","lunch":"B1","dinner":"C1"}'));
  const [extraAdditions, setExtraAdditions] = useState(() => JSON.parse(localStorage.getItem('fitdorm_extras') || '{"pretzels":0,"oats":0,"wpc":0,"peanut":0}'));
  const [completedRuns, setCompletedRuns] = useState(() => JSON.parse(localStorage.getItem('fitdorm_runs') || '{}'));
  const [weeklyWeights, setWeeklyWeights] = useState(() => JSON.parse(localStorage.getItem('fitdorm_weights') || '{"0":67.3,"1":67.5,"2":68.6,"3":68.9,"4":69.2}'));

  // Nowy stan planu 3 superserii (wersja v2 klucza, żeby od razu odświeżyło nowy plan na telefonie)
  const [workoutPlan, setWorkoutPlan] = useState(() => {
    const saved = localStorage.getItem('fitdorm_workout_plan_v2');
    return saved ? JSON.parse(saved) : DEFAULT_WORKOUT_PLAN;
  });

  // Odhaczone rundy w superseriach (np. {"SS1_A_1": true, "SS1_A_2": true})
  const [completedRounds, setCompletedRounds] = useState(() => JSON.parse(localStorage.getItem('fitdorm_rounds_v2') || '{}'));

  // Zapisane ciężary i powtórzenia z dzisiejszego treningu
  const [loggedSets, setLoggedSets] = useState(() => JSON.parse(localStorage.getItem('fitdorm_logged_sets_v2') || '{"A1":"5,5,4,4","A2":"16kgx8,8,8,7","B1":"35kgx12,12,10","B2":"40kgx10,10,10","C1":"20kgx12,10,10","C2":"6kgx15,15,12"}'));

  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ loading: false, msg: '', type: '' });

  // Stoper Przerwy w Superserii
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Zapisywanie do localStorage
  useEffect(() => { localStorage.setItem('fitdorm_script_url', googleScriptUrl); }, [googleScriptUrl]);
  useEffect(() => { localStorage.setItem('fitdorm_completed_workouts', JSON.stringify(completedWorkouts)); }, [completedWorkouts]);
  useEffect(() => { localStorage.setItem('fitdorm_supplements', JSON.stringify(supplements)); }, [supplements]);
  useEffect(() => { localStorage.setItem('fitdorm_meals', JSON.stringify(selectedMeals)); }, [selectedMeals]);
  useEffect(() => { localStorage.setItem('fitdorm_extras', JSON.stringify(extraAdditions)); }, [extraAdditions]);
  useEffect(() => { localStorage.setItem('fitdorm_runs', JSON.stringify(completedRuns)); }, [completedRuns]);
  useEffect(() => { localStorage.setItem('fitdorm_weights', JSON.stringify(weeklyWeights)); }, [weeklyWeights]);
  useEffect(() => { localStorage.setItem('fitdorm_workout_plan_v2', JSON.stringify(workoutPlan)); }, [workoutPlan]);
  useEffect(() => { localStorage.setItem('fitdorm_rounds_v2', JSON.stringify(completedRounds)); }, [completedRounds]);
  useEffect(() => { localStorage.setItem('fitdorm_logged_sets_v2', JSON.stringify(loggedSets)); }, [loggedSets]);

  // Sygnał dźwiękowy po zakończeniu przerwy
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.log('Audio API unsupported');
    }
  };

  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
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

  const toggleRound = (supersetId, roundIndex) => {
    const key = `${supersetId}_r${roundIndex}`;
    const willBeDone = !completedRounds[key];
    setCompletedRounds(prev => ({ ...prev, [key]: willBeDone }));
    // Jeśli odhaczamy rundę, automatycznie włącz stoper na 90s przerwy po całej rundzie!
    if (willBeDone) {
      startTimer(90);
    }
  };

  // Wyliczenia kalorii i makro
  const currentBreakfast = MEAL_DATABASE.breakfast.find((m) => m.id === selectedMeals.breakfast) || MEAL_DATABASE.breakfast[0];
  const currentLunch = MEAL_DATABASE.lunch.find((m) => m.id === selectedMeals.lunch) || MEAL_DATABASE.lunch[0];
  const currentDinner = MEAL_DATABASE.dinner.find((m) => m.id === selectedMeals.dinner) || MEAL_DATABASE.dinner[0];

  const totalKcal = currentBreakfast.kcal + currentLunch.kcal + currentDinner.kcal +
    ((extraAdditions.pretzels || 0) * 220) +
    ((extraAdditions.oats || 0) * 185) +
    ((extraAdditions.wpc || 0) * 120) +
    ((extraAdditions.peanut || 0) * 155);

  const totalProtein = currentBreakfast.p + currentLunch.p + currentDinner.p +
    ((extraAdditions.pretzels || 0) * 6) +
    ((extraAdditions.oats || 0) * 6) +
    ((extraAdditions.wpc || 0) * 24) +
    ((extraAdditions.peanut || 0) * 4);

  const totalCarbs = currentBreakfast.c + currentLunch.c + currentDinner.c +
    ((extraAdditions.pretzels || 0) * 45) +
    ((extraAdditions.oats || 0) * 33) +
    ((extraAdditions.wpc || 0) * 2) +
    ((extraAdditions.peanut || 0) * 3);

  const totalFat = currentBreakfast.f + currentLunch.f + currentDinner.f +
    ((extraAdditions.pretzels || 0) * 2) +
    ((extraAdditions.oats || 0) * 3) +
    ((extraAdditions.wpc || 0) * 2) +
    ((extraAdditions.peanut || 0) * 12);

  // --- SYNCHRONIZACJA Z GOOGLE SHEETS (GET & POST) ---
  const fetchPlanFromGoogleSheets = useCallback(async () => {
    if (!googleScriptUrl) {
      setSyncStatus({ loading: false, msg: 'Wklej URL skryptu Google Apps Script!', type: 'error' });
      return;
    }
    setSyncStatus({ loading: true, msg: 'Pobieranie danych z Arkusza Google...', type: 'info' });

    try {
      const fetchUrl = googleScriptUrl.includes('?') ? `${googleScriptUrl}&action=getAll` : `${googleScriptUrl}?action=getAll`;
      const res = await fetch(fetchUrl);
      const data = await res.json();

      if (data && data.status === 'success') {
        if (data.weeklyWeights) {
          setWeeklyWeights(prev => ({ ...prev, ...data.weeklyWeights }));
        }
        setSyncStatus({ loading: false, msg: '✅ Pobrano dane z Google Sheets!', type: 'success' });
      } else {
        setSyncStatus({ loading: false, msg: 'Połączono, używasz najnowszego planu 3 Superserii.', type: 'success' });
      }
    } catch (err) {
      setSyncStatus({ loading: false, msg: 'Używasz lokalnej bazy 3 Superserii (tryb offline/szybki).', type: 'warning' });
    }
  }, [googleScriptUrl]);

  const sendReportToGoogleSheets = async () => {
    if (!googleScriptUrl) {
      setSyncStatus({ loading: false, msg: 'Najpierw wklej swój URL z Google Apps Script!', type: 'error' });
      return;
    }

    setSyncStatus({ loading: true, msg: 'Wysyłanie raportu do Google Sheets...', type: 'info' });

    const payload = {
      date: new Date().toLocaleDateString('pl-PL'),
      timestamp: new Date().toISOString(),
      dayId: selectedDayId,
      currentWeek: selectedWeek,
      weightToday: weeklyWeights[selectedWeek] || 68.6,
      kcalLogged: totalKcal,
      proteinLogged: totalProtein,
      completedWorkoutToday: !!completedWorkouts[selectedDayId],
      loggedWorkoutSets: loggedSets,
      selectedMeals: {
        breakfast: currentBreakfast.name,
        lunch: currentLunch.name,
        dinner: currentDinner.name
      }
    };

    try {
      await fetch(googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setSyncStatus({ loading: false, msg: '🚀 Zapisano! Sprawdź zakładkę Logi_Apka w Google Sheets.', type: 'success' });
    } catch (err) {
      setSyncStatus({ loading: false, msg: 'Błąd wysyłania: ' + err.message, type: 'error' });
    }
  };

  const currentDay = DEFAULT_WEEK_DAYS.find((d) => d.id === selectedDayId) || DEFAULT_WEEK_DAYS[0];
  const activeWorkoutObj = workoutPlan[selectedWorkoutType] || workoutPlan.A;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans pb-28 max-w-md mx-auto shadow-2xl relative border-x border-slate-900">
      
      {/* NAGŁÓWEK */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
            72
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight text-white flex items-center gap-1.5">
              FitDorm 72 kg
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded-full font-mono">PRO GYM</span>
            </h1>
            <p className="text-[11px] text-slate-400">3 Superserie • Półmaraton • 3100 kcal</p>
          </div>
        </div>

        <button
          onClick={() => setShowSyncModal(true)}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <CloudUpload className="w-4 h-4" />
          <span className="text-xs font-bold text-slate-200">Sync</span>
        </button>
      </header>

      {/* GŁÓWNY EKRAN */}
      <main className="p-4 space-y-5">

        {/* ========================================================= */}
        {/* ZAKŁADKA 1: DZISIAJ */}
        {/* ========================================================= */}
        {activeTab === 'today' && (
          <div className="space-y-4">
            
            {/* WYBÓR DNIA TYGODNIA */}
            <div className="flex space-x-1.5 overflow-x-auto pb-1">
              {DEFAULT_WEEK_DAYS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDayId(d.id)}
                  className={`flex-1 min-w-[48px] py-2.5 px-1 rounded-xl text-center text-xs font-semibold transition ${
                    selectedDayId === d.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[11px] uppercase">{d.short}</div>
                  <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${completedWorkouts[d.id] ? 'bg-emerald-400' : 'bg-slate-800'}`} />
                </button>
              ))}
            </div>

            {/* KARTA ZADANIA DNIA */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    {currentDay.name} • Rozkład Dnia
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">{currentDay.uni}</h2>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-200 font-medium border border-slate-700">
                  {currentDay.type === 'gym' ? '🏋️ Siłownia' : currentDay.type === 'run' ? '🏃 Bieg' : currentDay.type === 'climb' ? '🧗 Boulder' : currentDay.type === 'hybrid' ? '⚡ Siła + Bieg' : '🧘 Rest'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <p className="text-[11px] text-slate-400 font-medium">Główny Trening Dnia:</p>
                <p className="text-sm font-bold text-white">{currentDay.workout}</p>
                {currentDay.paceInfo && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium pt-1">
                    <HeartPulse className="w-4 h-4 shrink-0" />
                    <span>{currentDay.paceInfo}</span>
                  </div>
                )}
              </div>

              {currentDay.note && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200">{currentDay.note}</p>
                </div>
              )}

              <button
                onClick={() => setCompletedWorkouts(prev => ({ ...prev, [selectedDayId]: !prev[selectedDayId] }))}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition ${
                  completedWorkouts[selectedDayId]
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{completedWorkouts[selectedDayId] ? 'TRENING ZALICZONY!' : 'Oznacz dzisiejszy trening jako wykonany'}</span>
              </button>
            </div>

            {/* CHECKLISTA SUPLEMENTÓW */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-white">💊 Suplementy na Dziś</h3>
                <span className="text-[10px] text-slate-400">Odhacz po wzięciu</span>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'creatine', name: 'Kreatyna Monohydrat (5g)', desc: 'Codziennie do posiłku lub szejka (+woda)', badge: 'Siła' },
                  { id: 'vitD3', name: 'Witamina D3 (2000-4000 IU)', desc: 'Rano do śniadania', badge: 'Zdrowie' },
                  { id: 'wpc', name: 'Białko WPC (1 miarka = 30g)', desc: 'Przed biegiem z preclami lub po siłowni', badge: 'Masa' },
                  { id: 'magnesium', name: 'Magnez Cytrynian (4 kaps. = 400mg)', desc: '30 min przed snem (regeneracja układu nerwowego)', badge: 'Sen' },
                  { id: 'caffeine', name: 'Kofeina 200 mg (Kapsułka)', desc: currentDay.caffeineOk ? '30-45 min przed porannym treningiem / ścianką' : 'ZAKAZ WIECZOREM (Siłownia 22:00)!', badge: currentDay.caffeineOk ? 'OK' : 'STOP', disabled: !currentDay.caffeineOk }
                ].map((sup) => {
                  const itemKey = `${selectedDayId}_${sup.id}`;
                  const isChecked = !!supplements[itemKey];
                  return (
                    <div
                      key={sup.id}
                      onClick={() => !sup.disabled && setSupplements(prev => ({ ...prev, [itemKey]: !prev[itemKey] }))}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        sup.disabled
                          ? 'opacity-40 bg-slate-950 border-slate-900 cursor-not-allowed'
                          : isChecked
                          ? 'bg-slate-800/90 border-emerald-500/40'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isChecked ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700 bg-slate-900'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isChecked ? 'line-through text-slate-400' : 'text-slate-100'}`}>{sup.name}</p>
                          <p className="text-[10px] text-slate-400">{sup.desc}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        sup.disabled ? 'bg-red-950 text-red-400 border border-red-900' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {sup.badge}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* ZAKŁADKA 2: SIŁA (3 SUPERSERIE KROK PO KROKU) */}
        {/* ========================================================= */}
        {activeTab === 'strength' && (
          <div className="space-y-4">
            
            {/* PRZEŁĄCZNIK TRENING A / TRENING B */}
            <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setSelectedWorkoutType('A')}
                className={`py-2.5 rounded-xl text-xs font-bold transition ${
                  selectedWorkoutType === 'A' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                TRENING A (Wtorek 22:00)
              </button>
              <button
                onClick={() => setSelectedWorkoutType('B')}
                className={`py-2.5 rounded-xl text-xs font-bold transition ${
                  selectedWorkoutType === 'B' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                TRENING B (Niedziela)
              </button>
            </div>

            {/* BANER INSTRUKCJI SUPERSERII */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-900/80 rounded-2xl p-3.5 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-cyan-400 uppercase">{activeWorkoutObj.title}</h3>
                <p className="text-[11px] text-slate-300 mt-0.5">{activeWorkoutObj.subtitle}</p>
              </div>
              <button
                onClick={() => setShowGuideModal(true)}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold flex items-center gap-1 shrink-0"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Jak ćwiczyć?</span>
              </button>
            </div>

            {/* STOPER PRZERWY NA GÓRZE */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-center space-y-3 sticky top-16 z-20 shadow-xl">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <Timer className="w-4 h-4" /> Stoper Przerwy w Superserii
                </span>
                <button
                  onClick={() => setCompletedRounds({})}
                  className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset rund
                </button>
              </div>

              <div className="text-4xl font-extrabold text-white tracking-widest font-mono">
                {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:{(timerSeconds % 60).toString().padStart(2, '0')}
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => startTimer(45)}
                  className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-[11px] font-bold border border-slate-700"
                >
                  45s (C1➔C2)
                </button>
                <button
                  onClick={() => startTimer(60)}
                  className="py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl text-[11px] font-bold border border-slate-700"
                >
                  60s (A1➔A2)
                </button>
                <button
                  onClick={() => startTimer(90)}
                  className="py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl text-[11px] font-bold border border-slate-700"
                >
                  90s (Po rundzie)
                </button>
                <button
                  onClick={() => setTimerActive(!timerActive)}
                  className="py-2 bg-cyan-500 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center"
                >
                  {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 3 SUPERSERIE KROK PO KROKU */}
            <div className="space-y-5">
              {activeWorkoutObj.supersets.map((ss, ssIdx) => (
                <div key={ss.id} className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-4">
                  
                  {/* Nagłówek Superserii + Kółeczka Rund */}
                  <div className="space-y-2 border-b border-slate-800 pb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wide">
                        {ss.name}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                        {ss.rounds} Rundy
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{ss.instruction}</p>

                    {/* Interaktywne Rundy do odhaczania */}
                    <div className="pt-1 flex items-center justify-between gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400">Odhacz rundę:</span>
                      <div className="flex gap-1.5">
                        {Array.from({ length: ss.rounds }, (_, rIdx) => {
                          const roundNum = rIdx + 1;
                          const rKey = `${ss.id}_r${roundNum}`;
                          const isRoundDone = !!completedRounds[rKey];
                          return (
                            <button
                              key={rKey}
                              onClick={() => toggleRound(ss.id, roundNum)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1 ${
                                isRoundDone
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              {isRoundDone && <Check className="w-3 h-3 stroke-[3]" />}
                              <span>R{roundNum}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Ćwiczenia wewnątrz Superserii */}
                  <div className="space-y-3">
                    {ss.exercises.map((ex, exIdx) => (
                      <div key={ex.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2.5">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black px-2 py-0.5 rounded bg-cyan-500 text-slate-950">
                                {ex.code}
                              </span>
                              <span className="text-[11px] font-bold text-cyan-400">
                                {ex.part}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-white mt-1.5">
                              {ex.mode === 'cali' ? ex.nameCali : ex.nameGym}
                            </h4>
                          </div>

                          {/* Przełącznik Siłownia / Kalistenika */}
                          <button
                            onClick={() => {
                              const copy = JSON.parse(JSON.stringify(workoutPlan));
                              const targetEx = copy[selectedWorkoutType].supersets[ssIdx].exercises[exIdx];
                              targetEx.mode = targetEx.mode === 'gym' ? 'cali' : 'gym';
                              setWorkoutPlan(copy);
                            }}
                            className="text-[10px] px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white shrink-0"
                          >
                            {ex.mode === 'gym' ? '🏋️ Siłownia' : '🤸 Drążek'}
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          💡 {ex.tip}
                        </p>

                        <div className="flex items-center justify-between text-xs bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800">
                          <span className="text-slate-400 text-[11px]">Cel serii i powtórzeń:</span>
                          <span className="font-bold text-cyan-300 text-[11px]">{ex.targetReps}</span>
                        </div>

                        {/* Pole do wpisania dzisiejszego ciężaru i powtórzeń */}
                        <div className="space-y-1 pt-0.5">
                          <label className="text-[10px] font-bold text-slate-400 block">
                            Twój zapis z dzisiaj (ciężar x powtórzenia w seriach):
                          </label>
                          <input
                            type="text"
                            placeholder="np. 18kg x 8,8,8,7"
                            value={loggedSets[ex.code] || ''}
                            onChange={(e) => setLoggedSets(prev => ({ ...prev, [ex.code]: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-emerald-400 font-mono outline-none focus:border-emerald-500"
                          />
                        </div>

                        {/* Szybki przycisk stopera po pierwszym ćwiczeniu */}
                        {exIdx === 0 && (
                          <button
                            onClick={() => startTimer(ss.restBetween)}
                            className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-[11px] font-bold flex items-center justify-center gap-1.5"
                          >
                            <Timer className="w-3.5 h-3.5" />
                            <span>Zrobiłem {ex.code} ➔ Start {ss.restBetween}s przerwy przed {ss.exercises[1].code}</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* ZAKŁADKA 3: DIETA 3100 KCAL */}
        {/* ========================================================= */}
        {activeTab === 'diet' && (
          <div className="space-y-4">
            
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Kalkulator Diety Klockowej (Cel: 3100 kcal / 72 kg)
              </h3>

              {/* ŚNIADANIE */}
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-cyan-400 block">🥣 Śniadanie / Przed biegiem (~880 kcal)</label>
                <select
                  value={selectedMeals.breakfast}
                  onChange={(e) => setSelectedMeals(prev => ({ ...prev, breakfast: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-medium outline-none"
                >
                  {MEAL_DATABASE.breakfast.map((m) => (
                    <option key={m.id} value={m.id}>{m.id}: {m.name} ({m.kcal} kcal | {m.p}g B)</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 italic">{currentBreakfast.desc}</p>
              </div>

              {/* OBIAD */}
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-cyan-400 block">🍱 Obiad na Uczelnię (~1350 kcal)</label>
                <select
                  value={selectedMeals.lunch}
                  onChange={(e) => setSelectedMeals(prev => ({ ...prev, lunch: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-medium outline-none"
                >
                  {MEAL_DATABASE.lunch.map((m) => (
                    <option key={m.id} value={m.id}>{m.id}: {m.name} ({m.kcal} kcal | {m.p}g B)</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 italic">{currentLunch.desc}</p>
              </div>

              {/* KOLACJA */}
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-cyan-400 block">🌙 Kolacja / Po Siłowni (~860 kcal)</label>
                <select
                  value={selectedMeals.dinner}
                  onChange={(e) => setSelectedMeals(prev => ({ ...prev, dinner: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-medium outline-none"
                >
                  {MEAL_DATABASE.dinner.map((m) => (
                    <option key={m.id} value={m.id}>{m.id}: {m.name} ({m.kcal} kcal | {m.p}g B)</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 italic">{currentDinner.desc}</p>
              </div>
            </div>

            {/* SZYBKIE DOKŁADKI (Z PRECLAMI SOLONYMI!) */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Szybkie Dokładki Kaloryczne</h3>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'pretzels', label: '+Garść precli solonych', kcal: '+220 kcal (Przed biegiem!)' },
                  { key: 'wpc', label: '+1 miarka WPC', kcal: '+120 kcal / 24g B' },
                  { key: 'oats', label: '+Porcja płatków czek./ows.', kcal: '+185 kcal' },
                  { key: 'peanut', label: '+1 łyżka masła orz.', kcal: '+155 kcal' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setExtraAdditions(prev => ({ ...prev, [item.key]: (prev[item.key] || 0) + 1 }))}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-left hover:border-slate-700 transition"
                  >
                    <div className="text-xs font-bold text-slate-200">{item.label}</div>
                    <div className="text-[10px] text-cyan-400 flex justify-between mt-0.5">
                      <span>{item.kcal}</span>
                      <span className="font-bold text-white">x{extraAdditions[item.key] || 0}</span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setExtraAdditions({ pretzels: 0, oats: 0, wpc: 0, peanut: 0 })}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-300 py-1"
              >
                Wyzeruj dokładki
              </button>
            </div>

            {/* PODSUMOWANIE MAKRO */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-white">📊 Bilans Dnia</h3>
                <span className="text-xs font-bold text-emerald-400">{totalKcal} / 3100 kcal</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Kcal</div>
                  <div className="text-sm font-bold text-cyan-400">{totalKcal}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Białko</div>
                  <div className="text-sm font-bold text-emerald-400">{totalProtein}g</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Węgle</div>
                  <div className="text-sm font-bold text-amber-400">{totalCarbs}g</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Tłuszcz</div>
                  <div className="text-sm font-bold text-purple-400">{totalFat}g</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* ZAKŁADKA 4: PÓŁMARATON & WAGA */}
        {/* ========================================================= */}
        {activeTab === 'halfmarathon' && (
          <div className="space-y-4">
            
            {/* KARTA TEMPA PO BIEGU NIEPODLEGŁOŚCI */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Kalibracja po Biegu Niepodległości (6:22/km @ HR 178)
                </span>
                <HeartPulse className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Twoje tempo długich wybiegań (BS) to <strong className="text-emerald-400">6:45 – 7:15 min/km</strong> (1 km rozgrzewki po 7:15 + reszta w tlenie, tętno <strong>145–158 bpm</strong>). Dzięki temu budujesz bazę pod 21.1 km i nie palisz mięśni!
              </p>
            </div>

            {/* TRACKER WAGI 72 KG */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase text-cyan-400">Cel Lean Bulk</span>
                  <h3 className="text-base font-bold text-white">67.3 kg ➔ 72.0 kg</h3>
                </div>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="0.1"
                    value={weeklyWeights[selectedWeek] || 68.6}
                    onChange={(e) => setWeeklyWeights(prev => ({ ...prev, [selectedWeek]: parseFloat(e.target.value) }))}
                    className="w-16 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-center text-xs font-bold text-emerald-400"
                  />
                  <span className="text-xs text-slate-400">kg (Tydz. {selectedWeek})</span>
                </div>
              </div>
            </div>

            {/* PLAN BIEGOWY 18 TYGODNI */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase text-slate-400">Plan 18 Tygodni (Cel: 14 Marca)</h3>
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-cyan-400 font-bold"
                >
                  {Array.from({ length: 18 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Tydzień {i + 1}</option>
                  ))}
                </select>
              </div>

              {INITIAL_RUN_PLAN.filter(w => w.week === selectedWeek).map((w) => (
                <div key={w.week} className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-cyan-400">{w.title}</span>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-bold">
                      Suma: {w.targetTotal} km
                    </span>
                  </div>
                  <div className="space-y-2">
                    {w.runs.map((r) => {
                      const isDone = !!completedRuns[r.id];
                      return (
                        <div
                          key={r.id}
                          onClick={() => setCompletedRuns(prev => ({ ...prev, [r.id]: !prev[r.id] }))}
                          className={`p-3 rounded-xl text-xs flex justify-between items-center cursor-pointer transition ${
                            isDone ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border border-slate-800 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isDone ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700'
                            }`}>
                              {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className={isDone ? 'line-through text-slate-400' : 'font-medium'}>{r.name}</span>
                          </div>
                          <span className="font-mono font-bold">{r.km} km</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* MODAL INSTRUKCJI SUPERSERII */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full space-y-3 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-cyan-400">Jak działają Twoje 3 Superserie?</h3>
              <button onClick={() => setShowGuideModal(false)} className="text-slate-400 hover:text-white text-xs font-bold">✕</button>
            </div>
            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p><strong>1. Parowanie ćwiczeń:</strong> Każda Superseria łączy 2 ćwiczenia (np. A1 Plecy + A2 Klatka).</p>
              <p><strong>2. Przebieg 1 Rundy:</strong> Robisz 1 serię A1 ➔ odpoczywasz 60s ➔ robisz 1 serię A2 ➔ odpoczywasz 90s i klikasz przycisk <strong>R1</strong> (Runda 1 zaliczona!).</p>
              <p><strong>3. Kiedy przechodzisz dalej:</strong> Dopiero gdy odhaczysz wszystkie rundy w Superserii 1 (R1, R2, R3, R4), przechodzisz do Superserii 2 (Butterfly + Wiosłowanie).</p>
              <p><strong>4. Kiedy zwiększasz ciężar:</strong> Gdy we wszystkich rundach zrobisz górny zakres powtórzeń (np. 8,8,8,8), za tydzień dokładasz +2 kg!</p>
            </div>
            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              Rozumiem, lecimy!
            </button>
          </div>
        </div>
      )}

      {/* MODAL SYNCHRONIZACJI GOOGLE SHEETS */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <CloudUpload className="w-4 h-4 text-cyan-400" />
                <span>Synchronizacja z Google Sheets</span>
              </h3>
              <button onClick={() => setShowSyncModal(false)} className="text-slate-400 hover:text-white text-xs font-bold p-1">✕</button>
            </div>

            {syncStatus.msg && (
              <div className="p-3 rounded-xl text-xs font-medium border bg-slate-950 border-slate-800 text-cyan-300">
                {syncStatus.msg}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-300 block">URL Google Apps Script:</label>
              <input
                type="text"
                placeholder="https://script.google.com/macros/s/..."
                value={googleScriptUrl}
                onChange={(e) => setGoogleScriptUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-cyan-300 outline-none font-mono"
              />
            </div>

            <div className="space-y-2">
              <button
                onClick={sendReportToGoogleSheets}
                disabled={syncStatus.loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Wyślij dzisiejsze logi (A1-C2) do Arkusza (POST)</span>
              </button>

              <button
                onClick={fetchPlanFromGoogleSheets}
                disabled={syncStatus.loading}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold border border-slate-700 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Pobierz wagi z Google Sheets (GET)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOLNY PASEK NAWIGACJI */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2 z-40">
        <div className="flex justify-around items-center">
          {[
            { id: 'today', label: 'Dzisiaj', icon: Calendar },
            { id: 'strength', label: 'Siła (3 SS)', icon: Dumbbell },
            { id: 'diet', label: 'Dieta 3100', icon: Utensils },
            { id: 'halfmarathon', label: 'Półmaraton', icon: TrendingUp }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition ${
                  isActive ? 'text-cyan-400 font-bold scale-105' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-[10px] mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
}