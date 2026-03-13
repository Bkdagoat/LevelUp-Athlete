// fakeAnalysis.js
// Prototype AI analysis simulation system
// Generates realistic fake analysis for sports performance

const MISTAKE_DATABASE = {
  basketball: [
    { mistake: "Elbow angle too wide during release", drills: ["Form shooting drill (50 reps)", "Footwork ladder drill", "One-hand release practice"] },
    { mistake: "Slow footwork during approach", drills: ["Speed ladder drill", "Agility cone drill", "First-step explosive training"] },
    { mistake: "Poor knee alignment on landing", drills: ["Single-leg balance work", "Lateral band walks", "Jump mechanics drill"] },
    { mistake: "Inconsistent follow-through", drills: ["Mirror practice (form only)", "Arc consistency drill", "Free throw routine"] },
    { mistake: "Limited range of motion in hips", drills: ["Hip mobility stretch series", "Bulgarian split squats", "Deep lunge holds"] }
  ],
  soccer: [
    { mistake: "Slow release speed", drills: ["Quick release shooting drill", "Catch-and-shoot timer drill", "One-motion shooting practice"] },
    { mistake: "Poor footwork", drills: ["Agility ladder drill", "Cone direction drill", "Explosive first-step drill"] },
    { mistake: "Weak plant foot control", drills: ["Single-leg balance reach", "Copenhagen plank", "Stability ball exercises"] },
    { mistake: "Hamstring overload risk", drills: ["Nordic curls", "RDL progression", "Deceleration training"] },
    { mistake: "Hip imbalance detected", drills: ["Lateral band walk", "Single-leg dead lift", "Glute activation drills"] }
  ],
  tennis: [
    { mistake: "Shoulder tilt excessive", drills: ["Shoulder stability exercises", "Rotator cuff strengthening", "Wall sliding drills"] },
    { mistake: "Elbow angle compromised", drills: ["Tennis elbow prevention stretches", "Forearm pronation drills", "Arm circles with resistance"] },
    { mistake: "Wrist flexion limited", drills: ["Wrist circles with light weights", "Medicine ball catches", "Racket drills in slow motion"] },
    { mistake: "Foot positioning off-balance", drills: ["Court positioning drills", "Footwork ladder routine", "Lateral movement practice"] },
    { mistake: "Serve toss inconsistency", drills: ["Toss-only practice (100 reps)", "Alignment mirror drills", "Rhythm tennis practice"] }
  ],
  track: [
    { mistake: "Stride length suboptimal", drills: ["Plyometric jumps", "Hill sprints", "Bounding exercises"] },
    { mistake: "Cadence rhythm inconsistent", drills: ["Quick feet drills", "Interval training", "Metronome-based running"] },
    { mistake: "Ground contact time excessive", drills: ["Jump rope intervals", "Single-leg hopping", "Sprint mechanics drill"] },
    { mistake: "Arm swing inefficient", drills: ["Arm swing isolation drills", "Shadow running", "Resistance band arm drills"] },
    { mistake: "Core engagement weak", drills: ["Plank holds (progressive)", "Dead bug variations", "Core rotary drills"] }
  ],
  swimming: [
    { mistake: "Stroke efficiency poor", drills: ["Catch-up drills", "Single-arm freestyle", "Kick-on-side drill"] },
    { mistake: "Body rotation insufficient", drills: ["Rotation drills", "Balance board exercises", "Side kick progression"] },
    { mistake: "Kick technique compromised", drills: ["Kick progression drill", "Dolphin kick practice", "Flutter kick with board"] },
    { mistake: "Breathing timing off", drills: ["Breath-hold progression", "Breathing rhythm drill", "Bilateral breathing practice"] },
    { mistake: "Pull phase weak", drills: ["Catch drill", "Fingertip drag drill", "Paddles resistance training"] }
  ],
  baseball: [
    { mistake: "Batting stance unstable", drills: ["Stance balance drill", "Plate coverage practice", "Tee work progression"] },
    { mistake: "Swing plane inconsistent", drills: ["Mirror swing practice", "Video analysis (slow motion)", "Tee drills with alignment"] },
    { mistake: "Hip rotation delayed", drills: ["Hip isolation drills", "Medicine ball rotations", "Explosive hip training"] },
    { mistake: "Follow-through incomplete", drills: ["Finish position holds", "Full swing practice", "Balance point drills"] },
    { mistake: "Fielding footwork sloppy", drills: ["Footwork ladder", "Ground ball shuffle drills", "Positioning repetition"] }
  ],
  volleyball: [
    { mistake: "Jump serve timing off", drills: ["Serve toss practice (100 reps)", "Jump timing drill", "Serve motion breakdown"] },
    { mistake: "Vertical jump insufficient", drills: ["Depth jump training", "squat jump progression", "Plyometric ladder work"] },
    { mistake: "Arm swing power weak", drills: ["Shoulder strength training", "Core engagement drills", "Medicine ball throws"] },
    { mistake: "Platform pass unstable", drills: ["Passing target drill", "Footwork positioning", "Platform contact practice"] },
    { mistake: "Set hand form inconsistent", drills: ["Set form isolation drill", "Triangle hand shape practice", "Release point consistency"] }
  ],
  boxing: [
    { mistake: "Guard position drops", drills: ["Guard maintenance drill", "Mirror work (static position)", "Shadow boxing with focus"] },
    { mistake: "Footwork rhythm breaks", drills: ["Footwork pattern drill", "Heavy bag rhythm training", "Padwork coordination"] },
    { mistake: "Chin protection weak", drills: ["Weave drill", "Head movement practice", "Punch and slip repetition"] },
    { mistake: "Power generation insufficient", drills: ["Hip rotation emphasis", "Explosive step training", "Medicine ball power drills"] },
    { mistake: "Punching technique sloppy", drills: ["Slow punch practice", "Proper weight transfer", "Padwork with coach"] }
  ],
  hockey: [
    { mistake: "Skating balance compromised", drills: ["Edge work drill", "Balance board exercises", "Crossover step progression"] },
    { mistake: "Stick control inconsistent", drills: ["Puck handling stickwork", "Cone weave drill", "Stationary stick control"] },
    { mistake: "Lower body weak", drills: ["Squat progression", "Single-leg balance work", "Explosive push-off drills"] },
    { mistake: "Shooting release slow", drills: ["Quick release practice", "Snap shot emphasis", "Shooting accuracy drill"] },
    { mistake: "Positioning defensive weak", drills: ["Positioning footwork", "Gap control drill", "Spacing awareness"] }
  ],
  rugby: [
    { mistake: "Tackle form risky", drills: ["Contact drill with pads", "Wrap technique practice", "Safer tackling positioning"] },
    { mistake: "Scrum power insufficient", drills: ["Core strength training", "Explosive start drill", "Binding technique practice"] },
    { mistake: "Endurance flagging", drills: ["Interval running", "Fartlek training", "Conditioning circuits"] },
    { mistake: "Hand-off timing weak", drills: ["Hand-off practice (non-contact)", "Timing and spacing drill", "Ball security work"] },
    { mistake: "Passing accuracy poor", drills: ["Passing accuracy target drill", "Distance passing practice", "Decision-making drill"] }
  ],
  golf: [
    { mistake: "Swing plane outside", drills: ["Mirror drills (alignment)", "Slow motion swing video", "Alignment stick practice"] },
    { mistake: "Balance during swing", drills: ["Single-leg stance practice", "Stability ball exercises", "Weight shift drill"] },
    { mistake: "Club head speed low", drills: ["Flexibility stretching", "Core rotation power", "Swing tempo drill"] },
    { mistake: "Grip pressure inconsistent", drills: ["Grip awareness practice", "Pressure gauge feedback", "Light grip swing drills"] },
    { mistake: "Follow-through incomplete", drills: ["Full finish position holds", "Video form analysis", "Tempo-matched swings"] }
  ],
  gymnastics: [
    { mistake: "Body alignment off", drills: ["Plank hold progression", "Wall slide alignment", "Hollow body holds"] },
    { mistake: "Core strength insufficient", drills: ["Hollow body progression", "Leg raise variations", "Plank side progression"] },
    { mistake: "Flexibility limited", drills: ["Active stretching routine", "Dynamic flexibility work", "Split progression"] },
    { mistake: "Upper body tension weak", drills: ["Shoulder shrug holds", "Handstand strength work", "Scapula engagement drill"] },
    { mistake: "Landing form poor", drills: ["Landing angle practice", "Balance beam dismount drill", "Soft landing control"] }
  ]
};

const SKILL_AREA_DATABASE = {
  basketball: ["Shot accuracy", "Footwork speed", "Ball control", "Defense stance", "Three-point range"],
  soccer: ["Passing accuracy", "Ball control", "Defensive positioning", "Shot power", "Dribbling speed"],
  tennis: ["Serve power", "Forehand consistency", "Backhand control", "Court movement", "Volley precision"],
  track: ["Sprint start", "Stride consistency", "Endurance pacing", "Running form", "Acceleration"],
  swimming: ["Stroke efficiency", "Front crawl speed", "Breathing rhythm", "Flip turn precision", "Kick power"],
  baseball: ["Batting average", "Fielding range", "Throwing accuracy", "Base running", "Reaction time"],
  volleyball: ["Vertical jump", "Serving accuracy", "Setting precision", "Blocking timing", "Passing control"],
  boxing: ["Punch power", "Footwork combo", "Head movement", "Chin protection", "Ring control"],
  hockey: ["Skating speed", "Stick handling", "Pass accuracy", "Shooting power", "Positioning"],
  rugby: ["Contact power", "Passing accuracy", "Positioning sense", "Endurance", "Ball security"],
  golf: ["Long drive distance", "Short game accuracy", "Putting consistency", "Course management", "Swing consistency"],
  gymnastics: ["Balance control", "Strength endurance", "Flexibility", "Body awareness", "Landing precision"]
};

const INJURY_RISK_FACTORS = {
  basketball: ["ankle strain", "knee stress", "shoulder impingement", "back strain"],
  soccer: ["hamstring pull", "knee strain", "ankle sprain", "groin strain"],
  tennis: ["tennis elbow", "shoulder strain", "knee stress", "wrist strain"],
  track: ["shin splints", "knee pain", "hamstring tightness", "hip flexor strain"],
  swimming: ["shoulder impingement", "lower back strain", "neck tension", "knee breaststroke"],
  baseball: ["rotator cuff strain", "elbow stress", "lower back strain", "hip tightness"],
  volleyball: ["ankle sprain", "shoulder strain", "knee stress", "lower back strain"],
  boxing: ["head impact risk", "hand/wrist strain", "shoulder overuse", "lower back strain"],
  hockey: ["ankle sprain", "hip flexor strain", "knee stress", "shoulder impact"],
  rugby: ["neck strain", "shoulder impact", "knee stress", "back strain"],
  golf: ["lower back strain", "golfer's elbow", "wrist strain", "knee stress"],
  gymnastics: ["wrist strain", "shoulder impingement", "lower back strain", "ankle sprain"]
};

export function generateFakeAnalysis(sport = 'basketball', skillLevel = 'intermediate') {
  const sportLower = sport.toLowerCase();
  const sportMistakes = MISTAKE_DATABASE[sportLower] || MISTAKE_DATABASE.basketball;
  const sportSkills = SKILL_AREA_DATABASE[sportLower] || SKILL_AREA_DATABASE.basketball;
  const injuryFactors = INJURY_RISK_FACTORS[sportLower] || INJURY_RISK_FACTORS.basketball;

  // Generate random skill score based on level
  const levelMultiplier = {
    'beginner': { min: 20, max: 50 },
    'intermediate': { min: 50, max: 75 },
    'advanced': { min: 70, max: 90 },
    'elite': { min: 85, max: 100 }
  }[skillLevel?.toLowerCase()] || { min: 50, max: 75 };

  const skillScore = Math.floor(Math.random() * (levelMultiplier.max - levelMultiplier.min) + levelMultiplier.min);

  // Select 2-4 random mistakes
  const numMistakes = Math.floor(Math.random() * 3) + 2;
  const selectedMistakes = [];
  for (let i = 0; i < numMistakes; i++) {
    const mistake = sportMistakes[Math.floor(Math.random() * sportMistakes.length)];
    if (!selectedMistakes.find(m => m.mistake === mistake.mistake)) {
      selectedMistakes.push(mistake);
    }
  }

  // Collect recommended drills from selected mistakes
  const recommendedDrills = new Set();
  selectedMistakes.forEach(m => {
    m.drills.forEach(d => recommendedDrills.add(d));
  });

  // Determine injury risk based on skill score and mistakes
  let injuryRisk = 'Low';
  if (skillScore < 40) {
    injuryRisk = Math.random() > 0.4 ? 'High' : 'Medium';
  } else if (skillScore < 60) {
    injuryRisk = Math.random() > 0.7 ? 'Medium' : 'Low';
  } else if (skillScore >= 80) {
    injuryRisk = 'Low';
  } else {
    injuryRisk = ['Low', 'Medium'][Math.floor(Math.random() * 2)];
  }

  // Determine rank tier
  const getRankTier = (score) => {
    if (score >= 91) return 'Pro';
    if (score >= 81) return 'Elite';
    if (score >= 61) return 'Gold';
    if (score >= 41) return 'Silver';
    return 'Bronze';
  };

  // Get strength areas (random 2-3 skills from the sport)
  const numStrengths = Math.floor(Math.random() * 2) + 2;
  const strengths = [];
  for (let i = 0; i < numStrengths; i++) {
    const skill = sportSkills[Math.floor(Math.random() * sportSkills.length)];
    if (!strengths.includes(skill)) {
      strengths.push(skill);
    }
  }

  return {
    skillScore,
    mistakes: selectedMistakes.map(m => m.mistake),
    recommendedDrills: Array.from(recommendedDrills).slice(0, 8), // Limit to 8 drills
    injuryRisk,
    rankTier: getRankTier(skillScore),
    strengths,
    timestamp: new Date().toISOString(),
    sport: sport,
    videoFile: 'simulated_video.mp4'
  };
}

export function generateMultipleAnalyses(sport, numSessions = 5, skillLevel = 'intermediate') {
  const analyses = [];
  for (let i = 0; i < numSessions; i++) {
    analyses.push(generateFakeAnalysis(sport, skillLevel));
  }
  return analyses;
}

export function getAthleteProgress(analyses) {
  if (analyses.length === 0) return { trend: 'neutral', improvement: 0 };
  
  const scores = analyses.map(a => a.skillScore);
  const firstScore = scores[0];
  const lastScore = scores[scores.length - 1];
  const improvement = lastScore - firstScore;
  const trend = improvement > 5 ? 'improving' : improvement < -5 ? 'declining' : 'neutral';

  return {
    trend,
    improvement,
    firstScore,
    lastScore,
    averageScore: Math.round(scores.reduce((a, b) => a + b) / scores.length)
  };
}

export function generateTeamAnalytics(athletes) {
  const allAnalyses = athletes.flatMap(a => a.analyses || []);
  
  if (allAnalyses.length === 0) {
    return {
      teamAverageScore: 0,
      mostCommonMistake: 'None recorded',
      playersImproving: 0,
      injuryRiskAlerts: 0
    };
  }

  const scores = allAnalyses.map(a => a.skillScore);
  const teamAverage = Math.round(scores.reduce((a, b) => a + b) / scores.length);

  // Count mistakes
  const mistakeCounts = {};
  allAnalyses.forEach(a => {
    a.mistakes?.forEach(m => {
      mistakeCounts[m] = (mistakeCounts[m] || 0) + 1;
    });
  });

  const mostCommonMistake = Object.keys(mistakeCounts).length > 0 
    ? Object.entries(mistakeCounts).sort((a, b) => b[1] - a[1])[0][0]
    : 'None recorded';

  // Count improving athletes
  const playersImproving = athletes.filter(a => {
    const progress = getAthleteProgress(a.analyses || []);
    return progress.trend === 'improving';
  }).length;

  // Count injury alerts
  const injuryAlerts = allAnalyses.filter(a => a.injuryRisk === 'High').length;

  return {
    teamAverageScore: teamAverage,
    mostCommonMistake,
    playersImproving,
    injuryRiskAlerts: injuryAlerts
  };
}
