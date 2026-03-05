import {
  scoreFormBySport,
  loadSportRules,
  generateSportSpecificMistakes,
  predictInjuryRisk,
  predictFutureImpact,
  generatePersonalizedPlan
} from './scoring.js';

describe('scoreFormBySport', () => {
  const metrics = {
    kneeValgus: 0.2,
    hipDrop: 0.1,
    trunkLean: 15,
    hipRotation: 12,
    plantFootStability: 0.6,
    hamstringLoad: 0.7
  };

  test('basketball scoring', () => {
    const rules = loadSportRules('basketball');
    const scores = scoreFormBySport(metrics, rules, {});
    expect(scores.balance).toBeGreaterThan(50);
  });

  test('soccer scoring', () => {
    const rules = loadSportRules('soccer');
    const scores = scoreFormBySport(metrics, rules, {});
    expect(scores.sportTechnique).toBeGreaterThan(50);
  });

  test('tennis scoring', () => {
    const rules = loadSportRules('tennis');
    const scores = scoreFormBySport(metrics, rules, {});
    expect(scores.symmetry).toBeGreaterThan(50);
  });
});

describe('generateSportSpecificMistakes', () => {
  const metrics = { kneeValgus: 0.3, hipDrop: 0.15 };
  const rules = loadSportRules('basketball');

  test('detects mistakes above threshold', () => {
    const mistakes = generateSportSpecificMistakes(metrics, rules);
    expect(mistakes.length).toBeGreaterThan(0);
    expect(mistakes[0]).toHaveProperty('code');
  });
});

describe('predictInjuryRisk', () => {
  const metrics = { hipDrop: 0.12 };

  test('predicts risks', () => {
    const risks = predictInjuryRisk(metrics, {}, 'basketball');
    expect(Array.isArray(risks)).toBe(true);
  });
});

describe('predictFutureImpact', () => {
  const metrics = { hipDrop: 0.04, kneeValgus: 0.1 };

  test('predicts future', () => {
    const predictions = predictFutureImpact(metrics, 'basketball', {});
    expect(predictions).toHaveProperty('performanceTrend');
  });
});

describe('generatePersonalizedPlan', () => {
  const analysisResults = { mistakes: [{ code: 'hipDrop' }], drills: [{ name: 'Squat' }], injuryRisk: [] };

  test('generates plan', () => {
    const plan = generatePersonalizedPlan('user1', 'basketball', analysisResults);
    expect(plan).toHaveProperty('weeklySchedule');
  });
});