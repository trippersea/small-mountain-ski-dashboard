/**
 * Loads narrative-engine.js before sd-app.js (classic script) runs.
 * sd-app.js calls getMountainNarrative() which delegates to this engine.
 */
import { getMountainNarrative as __wtsnNarrativeEngine } from './narrative-engine.js';
window.__wtsn_narrative_engine = __wtsnNarrativeEngine;
