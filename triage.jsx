/**
 * One-Tap Triage Card
 * React component for women's cancer symptom triage.
 * Turns "Alert Amber" on severe symptom selection and surfaces a click-to-call CTA.
 */

const { useState, useCallback } = React;

// Symptom definitions with severity levels
const SYMPTOMS = [
  { id: 'bleeding',    label: 'Unusual bleeding',          severity: 'severe'   },
  { id: 'discharge',  label: 'Abnormal discharge',         severity: 'moderate' },
  { id: 'pelvic',     label: 'Pelvic or abdominal pain',   severity: 'severe'   },
  { id: 'lump',       label: 'New lump or swelling',       severity: 'severe'   },
  { id: 'fatigue',    label: 'Unexplained fatigue',        severity: 'moderate' },
  { id: 'weightloss', label: 'Unintended weight loss',     severity: 'moderate' },
  { id: 'none',       label: 'No symptoms today',          severity: 'none'     },
];

// Nearest clinic data (replace with geolocation API in production)
const CLINIC = {
  name: 'City Women\'s Health Clinic',
  phone: '+1-800-555-0199',
  tel: 'tel:+18005550199',
};

function TriageCard() {
  const [selected, setSelected] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);

  // Derive alert state from selected symptoms
  const isAlert = [...selected].some(
    id => SYMPTOMS.find(s => s.id === id)?.severity === 'severe'
  );

  const toggleSymptom = useCallback((id) => {
    setSubmitted(false);
    setSelected(prev => {
      const next = new Set(prev);
      if (id === 'none') {
        // "No symptoms" clears all others
        return new Set(['none']);
      }
      next.delete('none'); // deselect "none" if picking a real symptom
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setSubmitted(true);
  }, []);

  const handleReset = useCallback(() => {
    setSelected(new Set());
    setSubmitted(false);
  }, []);

  // Dynamic card styles based on alert state
  const cardBase = 'triage-card rounded-2xl p-5 border-2';
  const cardStyle = isAlert
    ? `${cardBase} bg-amber-900/40 border-amber-400`
    : `${cardBase} bg-[#1E1824] border-white/10`;

  const headingColor = isAlert ? 'text-amber-300' : 'text-[#00C9B1]';
  const badgeStyle = isAlert
    ? 'bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full'
    : 'bg-teal-500/20 text-teal-300 text-xs font-bold px-2 py-0.5 rounded-full';

  return (
    <div className={cardStyle} role="region" aria-labelledby="triage-title" aria-live="polite">

      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 id="triage-title" className={`text-base font-semibold ${headingColor}`}>
          One-Tap Triage
        </h3>
        <span className={badgeStyle} aria-label={isAlert ? 'Alert: severe symptom selected' : 'Status: normal'}>
          {isAlert ? '⚠ Alert' : '✓ Check-in'}
        </span>
      </div>

      <p className="text-xs text-[#F9F9F9]/60 mb-4 leading-relaxed">
        Select any symptoms you're experiencing today. This helps your care team prioritize your needs.
      </p>

      {/* Symptom Selection Form */}
      {!submitted ? (
        <form onSubmit={handleSubmit} aria-label="Symptom selection form">
          <fieldset>
            <legend className="sr-only">Select your symptoms</legend>
            <ul className="space-y-2" role="list">
              {SYMPTOMS.map(symptom => {
                const isChecked = selected.has(symptom.id);
                const isSevere = symptom.severity === 'severe';

                const chipBase = 'w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-transparent';
                const chipStyle = isChecked
                  ? isSevere
                    ? `${chipBase} bg-amber-400 text-amber-900 border-amber-400 focus:ring-amber-400`
                    : `${chipBase} bg-[#00C9B1] text-[#2D2430] border-[#00C9B1] focus:ring-[#00C9B1]`
                  : `${chipBase} bg-white/5 text-[#F9F9F9]/80 border-white/10 hover:border-white/30 focus:ring-[#00C9B1]`;

                return (
                  <li key={symptom.id}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isChecked}
                      className={chipStyle}
                      onClick={() => toggleSymptom(symptom.id)}
                    >
                      <span aria-hidden="true" className="mr-2">
                        {isChecked ? '✓' : '○'}
                      </span>
                      {symptom.label}
                      {isSevere && (
                        <span className="sr-only"> (severe symptom)</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </fieldset>

          <button
            type="submit"
            disabled={selected.size === 0}
            className="mt-4 w-full py-3 rounded-xl font-semibold text-sm transition-all
              bg-[#00C9B1] text-[#2D2430] hover:bg-teal-400
              disabled:opacity-40 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-[#00C9B1] focus:ring-offset-2 focus:ring-offset-[#2D2430]"
            aria-disabled={selected.size === 0}
          >
            Submit Check-in
          </button>
        </form>
      ) : (
        /* Post-submission state */
        <div aria-live="assertive" aria-atomic="true">
          {isAlert ? (
            /* ALERT STATE: Severe symptom selected */
            <div className="space-y-4">
              <div className="bg-amber-400/20 border border-amber-400 rounded-xl p-4 text-center">
                <p className="text-amber-300 font-semibold text-sm mb-1">
                  ⚠ Urgent attention recommended
                </p>
                <p className="text-[#F9F9F9]/70 text-xs leading-relaxed">
                  One or more of your symptoms may need prompt evaluation.
                  Please contact a clinic as soon as possible.
                </p>
              </div>

              {/* Click-to-Call CTA */}
              <a
                href={CLINIC.tel}
                className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl
                  bg-amber-400 text-amber-900 font-bold text-sm
                  hover:bg-amber-300 active:bg-amber-500
                  focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#2D2430]"
                aria-label={`Call ${CLINIC.name} at ${CLINIC.phone}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                Call {CLINIC.name}
              </a>

              <p className="text-center text-xs text-[#F9F9F9]/40">{CLINIC.phone}</p>
            </div>
          ) : (
            /* NORMAL STATE: No severe symptoms */
            <div className="text-center space-y-3">
              <div className="text-4xl" aria-hidden="true">✅</div>
              <p className="text-[#00C9B1] font-semibold text-sm">Check-in recorded</p>
              <p className="text-[#F9F9F9]/60 text-xs leading-relaxed">
                Your symptoms have been logged. Your navigator will review them at your next session.
              </p>
            </div>
          )}

          <button
            onClick={handleReset}
            className="mt-4 w-full py-2.5 rounded-xl text-sm border border-white/20
              text-[#F9F9F9]/60 hover:border-white/40 hover:text-[#F9F9F9]
              focus:outline-none focus:ring-2 focus:ring-[#00C9B1]"
          >
            Start new check-in
          </button>
        </div>
      )}
    </div>
  );
}

// Mount into the DOM
const root = ReactDOM.createRoot(document.getElementById('triage-root'));
root.render(<TriageCard />);
