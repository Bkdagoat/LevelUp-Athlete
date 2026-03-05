// Sport-specific analysis prompts for AI-powered video feedback
// These prompts guide an AI service to deliver structured, actionable coaching feedback

export const MASTER_PROMPT = `You are an elite multi-sport performance analyst. Analyze the athlete video and return detailed, personalized feedback that is specific to the selected sport.

Inputs
- Sport: {{SPORT}}
- Athlete level: {{LEVEL}}
- Athlete handedness/footedness: {{HANDEDNESS}}
- Goal of session: {{GOAL}}
- Drill or movement: {{DRILL_NAME}}
- Optional notes from coach/athlete: {{NOTES}}

Output Rules
- Do not give generic advice. Make feedback specific to the selected sport and drill.
- Break technique into phases and score each phase from 1–10.
- For each phase include:
  * What was done well
  * What was incorrect
  * Why it matters for performance/injury risk
  * One exact correction cue
- Include a final section with:
  * Top 3 priority fixes for next session
  * 3 drill recommendations with sets/reps
  * One injury-risk watchout
- Keep language direct, coach-like, and actionable.
`;

export const SPORT_EVALUATION_FRAMEWORKS = {
  basketball: {
    name: 'Basketball',
    categories: [
      'Set point',
      'Wrist flick / follow-through',
      'Ball pickup path',
      'Hand placement (guide hand + shooting hand)',
      'Base and balance',
      'Elbow alignment',
      'Release timing',
      'Arc consistency',
      'Landing and shot balance'
    ],
    prompt: `Evaluate this basketball shooting video. Analyze and score these specific phases:
1. Set point – ready position and ball placement at chest
2. Wrist flick / follow-through – guide hand release and shooting hand finish
3. Ball pickup path – trajectory from set point to release
4. Hand placement – shooting hand (dominant) and guide hand positioning
5. Base and balance – foot position, width, and weight distribution
6. Elbow alignment – elbow under wrist throughout motion
7. Release timing – point of release relative to jump apex
8. Arc consistency – ball trajectory angle (optimal 48–52 degrees)
9. Landing and shot balance – feet position post-release and follow-through hold

For each phase, provide:
- Score (1–10)
- What went well
- Error detected (if any)
- Why it matters (performance/injury)
- One correction cue (specific, not generic)

Return as structured table with columns: Phase | Score | Strengths | Errors | Why It Matters | Correction Cue

Then provide:
- Top 3 priority fixes (with root cause)
- 3 drills with sets/reps to address the issues
- One injury-risk watchout specific to the mechanics observed`
  },
  soccer: {
    name: 'Soccer',
    categories: [
      'First touch quality',
      'Plant foot placement',
      'Hip rotation',
      'Strike surface contact',
      'Follow-through direction',
      'Balance on contact',
      'Scanning and decision timing'
    ],
    prompt: `Evaluate this soccer video. Analyze and score these specific phases:
1. First touch quality – control and soft reception of the ball
2. Plant foot placement – non-kicking foot position relative to ball
3. Hip rotation – trunk and hip engagement in the motion
4. Strike surface contact – inside foot / outside foot / instep contact point
5. Follow-through direction – leg swing direction and follow-through
6. Balance on contact – stability before, during, and after contact
7. Scanning and decision timing – head position and timing of the action

For each phase, provide:
- Score (1–10)
- What went well
- Error detected (if any)
- Why it matters (performance/injury)
- One correction cue (specific, not generic)

Return as structured table with columns: Phase | Score | Strengths | Errors | Why It Matters | Correction Cue

Then provide:
- Top 3 priority fixes (with root cause)
- 3 drills with sets/reps to address the issues
- One injury-risk watchout specific to the mechanics observed`
  },
  baseball: {
    name: 'Baseball',
    categories: [
      'Stance and load',
      'Stride timing',
      'Hip-shoulder separation',
      'Bat path',
      'Contact point',
      'Top/bottom hand control',
      'Extension and finish'
    ],
    prompt: `Evaluate this baseball hitting video. Analyze and score these specific phases:
1. Stance and load – ready position and weight loading into back leg
2. Stride timing – stride commencement and length relative to pitch
3. Hip-shoulder separation – degree of rotation and separation angle
4. Bat path – path from load to contact point
5. Contact point – location of contact relative to body and pitch location
6. Top/bottom hand control – upper and lower hand management through swing
7. Extension and finish – follow-through and balanced finish position

For each phase, provide:
- Score (1–10)
- What went well
- Error detected (if any)
- Why it matters (performance/injury)
- One correction cue (specific, not generic)

Return as structured table with columns: Phase | Score | Strengths | Errors | Why It Matters | Correction Cue

Then provide:
- Top 3 priority fixes (with root cause)
- 3 drills with sets/reps to address the issues
- One injury-risk watchout specific to the mechanics observed`
  },
  tennis: {
    name: 'Tennis',
    categories: [
      'Unit turn',
      'Racquet takeback',
      'Footwork spacing',
      'Contact point in front',
      'Wrist stability',
      'Follow-through path',
      'Recovery steps'
    ],
    prompt: `Evaluate this tennis forehand video. Analyze and score these specific phases:
1. Unit turn – shoulder and hip rotation to set position
2. Racquet takeback – backswing path and arm position
3. Footwork spacing – foot positioning and court movement to contact point
4. Contact point in front – ball contact location relative to body
5. Wrist stability – wrist lag and stability through contact
6. Follow-through path – follow-through direction and finish
7. Recovery steps – footwork reset after shot completion

For each phase, provide:
- Score (1–10)
- What went well
- Error detected (if any)
- Why it matters (performance/injury)
- One correction cue (specific, not generic)

Return as structured table with columns: Phase | Score | Strengths | Errors | Why It Matters | Correction Cue

Then provide:
- Top 3 priority fixes (with root cause)
- 3 drills with sets/reps to address the issues
- One injury-risk watchout specific to the mechanics observed`
  },
  volleyball: {
    name: 'Volleyball',
    categories: [
      'Approach rhythm',
      'Last two steps and plant',
      'Arm swing sequencing',
      'Contact height and hand shape',
      'Wrist snap',
      'Landing mechanics',
      'Block/defense transition readiness'
    ],
    prompt: `Evaluate this volleyball spike video. Analyze and score these specific phases:
1. Approach rhythm – timing and footwork of the approach run
2. Last two steps and plant – explosive final two steps and plant position
3. Arm swing sequencing – arm acceleration and swing pattern timing
4. Contact height and hand shape – contact point and hand positioning at peak
5. Wrist snap – wrist flexion and snap through contact
6. Landing mechanics – landing position and energy absorption
7. Block/defense transition readiness – ready position post-spike

For each phase, provide:
- Score (1–10)
- What went well
- Error detected (if any)
- Why it matters (performance/injury)
- One correction cue (specific, not generic)

Return as structured table with columns: Phase | Score | Strengths | Errors | Why It Matters | Correction Cue

Then provide:
- Top 3 priority fixes (with root cause)
- 3 drills with sets/reps to address the issues
- One injury-risk watchout specific to the mechanics observed`
  },
  track: {
    name: 'Track',
    categories: [
      'Set position angles',
      'Front/back shin projection',
      'Arm action out of blocks',
      'First 3 steps projection',
      'Trunk angle progression',
      'Ground contact quality',
      'Cadence build'
    ],
    prompt: `Evaluate this sprint start video. Analyze and score these specific phases:
1. Set position angles – knee and ankle angles in the set position
2. Front/back shin projection – shin angle of front and back legs
3. Arm action out of blocks – arm drive timing and acceleration
4. First 3 steps projection – step length and ground contact of initial acceleration phase
5. Trunk angle progression – forward lean angle decrease through acceleration
6. Ground contact quality – force application and takeoff quality of each step
7. Cadence build – progressive increase in step frequency into acceleration

For each phase, provide:
- Score (1–10)
- What went well
- Error detected (if any)
- Why it matters (performance/injury)
- One correction cue (specific, not generic)

Return as structured table with columns: Phase | Score | Strengths | Errors | Why It Matters | Correction Cue

Then provide:
- Top 3 priority fixes (with root cause)
- 3 drills with sets/reps to address the issues
- One injury-risk watchout specific to the mechanics observed`
  },
  swimming: {
    name: 'Swimming',
    categories: [
      'Body line and head position',
      'Catch setup',
      'Early vertical forearm',
      'Pull path',
      'Kick rhythm',
      'Breathing timing',
      'Stroke rate consistency'
    ],
    prompt: `Evaluate this freestyle swimming video. Analyze and score these specific phases:
1. Body line and head position – horizontal alignment and neutral head position
2. Catch setup – hand and forearm position entering the water
3. Early vertical forearm – elbow position and forearm alignment during pull
4. Pull path – hand path through water and propulsive phases
5. Kick rhythm – kick amplitude and tempo relative to arm strokes
6. Breathing timing – breath coordination with arm stroke rotation
7. Stroke rate consistency – consistent cadence throughout the distance

For each phase, provide:
- Score (1–10)
- What went well
- Error detected (if any)
- Why it matters (performance/injury)
- One correction cue (specific, not generic)

Return as structured table with columns: Phase | Score | Strengths | Errors | Why It Matters | Correction Cue

Then provide:
- Top 3 priority fixes (with root cause)
- 3 drills with sets/reps to address the issues
- One injury-risk watchout specific to the mechanics observed`
  },
  boxing: {
    name: 'Boxing',
    categories: [
      'Stance and guard integrity',
      'Weight transfer',
      'Hip/shoulder rotation',
      'Hand return speed',
      'Punch path efficiency',
      'Balance after combination',
      'Defensive reset'
    ],
    prompt: `Evaluate this boxing combination video. Analyze and score these specific phases:
1. Stance and guard integrity – guard position and stance maintenance
2. Weight transfer – weight shift timing and distribution through combination
3. Hip/shoulder rotation – hip and shoulder engagement in power generation
4. Hand return speed – glove return to guard position between punches
5. Punch path efficiency – direct path to target without wasted motion
6. Balance after combination – stability and balance post-combination
7. Defensive reset – return to guard and defensive readiness

For each phase, provide:
- Score (1–10)
- What went well
- Error detected (if any)
- Why it matters (performance/injury)
- One correction cue (specific, not generic)

Return as structured table with columns: Phase | Score | Strengths | Errors | Why It Matters | Correction Cue

Then provide:
- Top 3 priority fixes (with root cause)
- 3 drills with sets/reps to address the issues
- One injury-risk watchout specific to the mechanics observed`
  },
  hockey: {
    name: 'Hockey',
    categories: [
      'Skating balance',
      'Stick control',
      'Lower body strength',
      'Edge work',
      'Puck handling'
    ],
    prompt: `Evaluate this hockey video. Analyze and score these specific phases:
1. Skating balance – body position and weight distribution on ice
2. Stick control – stick positioning and blade control
3. Lower body strength – power generation from legs
4. Edge work – inside and outside edge usage
5. Puck handling – puck control and touch

For each phase, provide a score and detailed feedback.
Return actionable drills with sets/reps and injury-risk watchout.`
  },
  rugby: {
    name: 'Rugby',
    categories: [
      'Tackle form',
      'Scrum power',
      'Endurance',
      'Contact technique',
      'Body position'
    ],
    prompt: `Evaluate this rugby video. Analyze and score these specific phases:
1. Tackle form – approach angle and contact technique
2. Scrum power – hip drive and binding position
3. Endurance – energy management and pace sustainability
4. Contact technique – ball carrying and contact mechanics
5. Body position – positional awareness and alignment

For each phase, provide a score and detailed feedback.
Return actionable drills with sets/reps and injury-risk watchout.`
  },
  golf: {
    name: 'Golf',
    categories: [
      'Swing plane',
      'Balance',
      'Club head speed',
      'Tempo',
      'Follow through'
    ],
    prompt: `Evaluate this golf swing video. Analyze and score these specific phases:
1. Swing plane – shaft angle and plane consistency
2. Balance – stance stability throughout swing
3. Club head speed – acceleration through impact
4. Tempo – rhythm and timing consistency
5. Follow through – finish position and balance

For each phase, provide a score and detailed feedback.
Return actionable drills with sets/reps and injury-risk watchout.`
  },
  gymnastics: {
    name: 'Gymnastics',
    categories: [
      'Body alignment',
      'Core strength',
      'Flexibility',
      'Technique execution',
      'Landing mechanics'
    ],
    prompt: `Evaluate this gymnastics routine video. Analyze and score these specific phases:
1. Body alignment – body line and position consistency
2. Core strength – core engagement and stability
3. Flexibility – range of motion in skills
4. Technique execution – proper form and precision
5. Landing mechanics – safe and controlled landing

For each phase, provide a score and detailed feedback.
Return actionable drills with sets/reps and injury-risk watchout.`
  }
};

export const RESPONSE_FORMAT = `
Return output in this exact structure:

## Athlete Snapshot
- Sport, drill, level, handedness, session goal

## Phase-by-Phase Technique Breakdown
| Phase | Score (1–10) | What went well | Error detected | Why it matters | Correction cue |
|-------|-------------|----------------|----------------|-----------------|-----------------|

## Critical Errors (Top 3)
1. Error | Root cause | Immediate correction
2. Error | Root cause | Immediate correction
3. Error | Root cause | Immediate correction

## Next Session Plan
**Drill 1** (sets/reps + coaching cue)
**Drill 2** (sets/reps + coaching cue)
**Drill 3** (sets/reps + coaching cue)

## Injury Risk Watch
- One sport-specific risk found
- Prevention cue

## Progress Metric Targets for Next Upload
1. Measurable target
2. Measurable target
3. Measurable target

---
If confidence is low for any section, state: "Low confidence due to camera angle/visibility" and continue with best estimate.
`;

export function getPromptForSport(sport, athleteLevel = 'INTERMEDIATE', goal = 'improve technique', drillName = 'general movement') {
  const framework = SPORT_EVALUATION_FRAMEWORKS[sport.toLowerCase()];
  
  if (!framework) {
    return `Generic sport analysis. Sport not recognized: ${sport}. Apply general biomechanical principles.`;
  }

  return framework.prompt
    .replace('{{LEVEL}}', athleteLevel)
    .replace('{{GOAL}}', goal)
    .replace('{{DRILL_NAME}}', drillName);
}
