// sportRules.js
export const SPORT_RULES = {
  basketball: {
    keyMetrics: ["kneeValgus", "hipDrop", "trunkLean", "ankleStiffness"],
    thresholds: { kneeValgus: 0.18, hipDrop: 0.08, trunkLean: 12 },
    drillsByIssue: {
      kneeValgus: ["banded squat", "single-leg step-down"],
      hipDrop: ["lateral band walk", "single-leg bridge"]
    }
  },
  soccer: {
    keyMetrics: ["hipRotation", "plantFootStability", "hamstringLoad", "trunkLean"],
    thresholds: { plantFootStability: 0.7, hamstringLoad: 0.65 },
    drillsByIssue: {
      plantFootStability: ["single-leg balance reach", "copenhagen plank"],
      hamstringLoad: ["nordic curls", "RDL progression"]
    }
  },
  tennis: {
    keyMetrics: ["shoulderTilt", "elbowAngle", "wristFlexion", "footPosition"],
    thresholds: { shoulderTilt: 10, elbowAngle: 90, wristFlexion: 15 },
    drillsByIssue: {
      shoulderTilt: ["shoulder stability exercises", "rotator cuff strengthening"],
      elbowAngle: ["tennis elbow prevention stretches", "forearm pronation drills"]
    }
  },
  track: {
    keyMetrics: ["strideLength", "cadence", "groundContactTime", "verticalOscillation"],
    thresholds: { strideLength: 2.0, cadence: 180, groundContactTime: 0.2 },
    drillsByIssue: {
      strideLength: ["plyometric jumps", "hill sprints"],
      cadence: ["quick feet drills", "interval training"]
    }
  },
  swimming: {
    keyMetrics: ["strokeEfficiency", "bodyRotation", "kickTechnique", "breathingTiming"],
    thresholds: { strokeEfficiency: 0.85, bodyRotation: 45 },
    drillsByIssue: {
      strokeEfficiency: ["catch-up drills", "single-arm freestyle"],
      bodyRotation: ["rotation drills", "balance board exercises"]
    }
  },
  hockey: {
    keyMetrics: ["skatingBalance", "stickControl", "lowerBodyStrength"],
    thresholds: { skatingBalance: 0.8, stickControl: 0.7 },
    drillsByIssue: {
      skatingBalance: ["edge drills", "balance board"],
      stickControl: ["puck handling", "cone weave"]
    }
  },
  rugby: {
    keyMetrics: ["tackleForm", "scrumPower", "endurance"],
    thresholds: { tackleForm: 0.6, endurance: 0.7 },
    drillsByIssue: {
      tackleForm: ["contact drills", "wrap technique"],
      endurance: ["interval runs", "fartlek training"]
    }
  },
  golf: {
    keyMetrics: ["swingPlane", "balance", "clubheadSpeed"],
    thresholds: { swingPlane: 10, balance: 0.5 },
    drillsByIssue: {
      swingPlane: ["mirror drills", "slow motion swings"],
      balance: ["single-leg stance", "stability ball" ]
    }
  },
  gymnastics: {
    keyMetrics: ["bodyAlignment", "coreStrength", "flexibility"],
    thresholds: { bodyAlignment: 5, coreStrength: 0.7 },
    drillsByIssue: {
      bodyAlignment: ["plank holds", "wall slides"],
      coreStrength: ["hollow holds", "leg raises"]
    }
  }
};