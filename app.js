// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 30px rgba(156,39,176,0.2)' : '';
});

// ===== HAMBURGER =====
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
});

// ===== DARK MODE =====
const darkToggle = document.getElementById('darkToggle');
darkToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  darkToggle.querySelector('i').className = isDark ? 'fas fa-moon' : 'fas fa-sun';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
});
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  darkToggle.querySelector('i').className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== FONT SIZE TOGGLE =====
const fontToggle = document.getElementById('fontToggle');
fontToggle.addEventListener('click', () => {
  const isLarge = document.documentElement.getAttribute('data-fontsize') === 'large';
  document.documentElement.setAttribute('data-fontsize', isLarge ? 'normal' : 'large');
  localStorage.setItem('fontsize', isLarge ? 'normal' : 'large');
  showToast(isLarge ? 'Normal text size' : 'Large text enabled');
});
const savedFont = localStorage.getItem('fontsize');
if (savedFont) document.documentElement.setAttribute('data-fontsize', savedFont);

// ===== LANGUAGE =====
function setLang(lang) {
  document.documentElement.setAttribute('data-lang', lang);
  document.querySelectorAll('.lang-en').forEach(el => el.classList.toggle('hidden', lang !== 'en'));
  document.querySelectorAll('.lang-ta').forEach(el => el.classList.toggle('hidden', lang !== 'ta'));
  document.querySelectorAll('.lang-hi').forEach(el => el.classList.toggle('hidden', lang !== 'hi'));
  localStorage.setItem('lang', lang);
  const labels = { en: 'English selected', ta: 'தமிழ் தேர்ந்தெடுக்கப்பட்டது', hi: 'हिंदी चुनी गई' };
  showToast(labels[lang]);
}
const savedLang = localStorage.getItem('lang') || 'en';
setLang(savedLang);

// ===== TABS =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// ===== FAQ =====
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) setTimeout(() => entry.target.classList.add('visible'), i * 80);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.animate-up').forEach(el => observer.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const step = target / (2000 / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { animateCounter(entry.target); counterObserver.unobserve(entry.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// ===== FORMS =====
document.getElementById('appointmentForm').addEventListener('submit', (e) => {
  e.preventDefault(); showToast('Appointment booked successfully!'); e.target.reset();
});
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault(); showToast('Message sent! We will get back to you soon.'); e.target.reset();
});

// ===== CHAT =====
const chatResponses = {
  default: "Thank you for reaching out. For urgent concerns, please call our helpline at 1800-XXX-XXXX.",
  symptom: "Common symptoms include lumps, unusual bleeding, persistent fatigue, and skin changes. Please consult a doctor if you notice any of these.",
  screening: "We recommend annual mammograms for women 40+, and Pap smears every 3 years starting at age 21.",
  appointment: "You can book an appointment using the 'Appointment' tab in our Services section.",
  vaccine: "The HPV vaccine is highly effective and recommended for girls and women aged 9–45.",
  prevention: "Key prevention steps: regular screenings, HPV vaccination, healthy diet, exercise, and avoiding tobacco and alcohol.",
  monitoring: "Our monitoring dashboard tracks heart rate, blood pressure, SpO2, and temperature in real time for each patient.",
};
function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  const messages = document.getElementById('chatMessages');
  messages.innerHTML += `<div class="chat-msg user">${msg}</div>`;
  input.value = '';
  const lower = msg.toLowerCase();
  let reply = chatResponses.default;
  if (lower.includes('symptom') || lower.includes('sign') || lower.includes('pain')) reply = chatResponses.symptom;
  else if (lower.includes('screen') || lower.includes('mammogram')) reply = chatResponses.screening;
  else if (lower.includes('appointment') || lower.includes('book')) reply = chatResponses.appointment;
  else if (lower.includes('vaccine') || lower.includes('hpv')) reply = chatResponses.vaccine;
  else if (lower.includes('prevent') || lower.includes('lifestyle')) reply = chatResponses.prevention;
  else if (lower.includes('monitor') || lower.includes('dashboard') || lower.includes('track')) reply = chatResponses.monitoring;
  setTimeout(() => {
    messages.innerHTML += `<div class="chat-msg bot"><i class="fas fa-robot"></i> ${reply}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }, 600);
  messages.scrollTop = messages.scrollHeight;
}
document.getElementById('chatInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== CHARTS =====
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const chartDefaults = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(156,39,176,0.08)' }, ticks: { font: { size: 11 } } },
    y: { grid: { color: 'rgba(156,39,176,0.08)' }, ticks: { font: { size: 11 } } }
  }
};

// Heart Rate Chart
new Chart(document.getElementById('heartRateChart'), {
  type: 'line',
  data: {
    labels: days,
    datasets: [{
      label: 'Heart Rate (bpm)',
      data: [76, 79, 75, 82, 78, 74, 78],
      borderColor: '#e91e8c',
      backgroundColor: 'rgba(233,30,140,0.1)',
      borderWidth: 2.5,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#e91e8c',
      pointRadius: 4
    }]
  },
  options: { ...chartDefaults, scales: { ...chartDefaults.scales, y: { ...chartDefaults.scales.y, min: 60, max: 100 } } }
});

// Blood Pressure Chart
new Chart(document.getElementById('bpChart'), {
  type: 'bar',
  data: {
    labels: days,
    datasets: [
      { label: 'Systolic', data: [122, 118, 125, 120, 119, 121, 120], backgroundColor: 'rgba(233,30,140,0.7)', borderRadius: 6 },
      { label: 'Diastolic', data: [82, 79, 83, 80, 78, 81, 80], backgroundColor: 'rgba(156,39,176,0.5)', borderRadius: 6 }
    ]
  },
  options: {
    ...chartDefaults,
    plugins: { legend: { display: true, labels: { font: { size: 11 } } } },
    scales: { ...chartDefaults.scales, y: { ...chartDefaults.scales.y, min: 60, max: 140 } }
  }
});

// SpO2 Chart
new Chart(document.getElementById('spo2Chart'), {
  type: 'line',
  data: {
    labels: days,
    datasets: [
      { label: 'SpO2 (%)', data: [98, 97, 98, 99, 98, 97, 98], borderColor: '#1565c0', backgroundColor: 'rgba(21,101,192,0.1)', borderWidth: 2.5, fill: true, tension: 0.4, pointBackgroundColor: '#1565c0', pointRadius: 4 },
      { label: 'Temp (°F)', data: [98.4, 98.7, 98.6, 99.1, 98.5, 98.6, 98.6], borderColor: '#e65100', backgroundColor: 'rgba(230,81,0,0.08)', borderWidth: 2.5, fill: false, tension: 0.4, pointBackgroundColor: '#e65100', pointRadius: 4 }
    ]
  },
  options: {
    ...chartDefaults,
    plugins: { legend: { display: true, labels: { font: { size: 11 } } } },
    scales: { ...chartDefaults.scales, y: { ...chartDefaults.scales.y, min: 95, max: 102 } }
  }
});

// Treatment Progress Doughnut
new Chart(document.getElementById('treatmentChart'), {
  type: 'doughnut',
  data: {
    labels: ['Completed', 'In Progress', 'Remaining'],
    datasets: [{
      data: [3, 1, 2],
      backgroundColor: ['#4caf50', '#ff9800', 'rgba(156,39,176,0.2)'],
      borderWidth: 0,
      hoverOffset: 8
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, padding: 16 } }
    },
    cutout: '65%'
  }
});
