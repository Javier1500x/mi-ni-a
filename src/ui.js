'use strict';

const MUSIC_URL = 'https://javier1500x.github.io/Educ-In/Chino%20&%20Nacho%20-%20Ni%C3%B1a%20Bonita.mp3';

const LOVE_NOTES = [
	'Te amo, mi niña bonita',
	'Eres mi persona favorita',
	'Me haces muy feliz',
	'Pienso en ti todo el día',
	'Eres mi lugar seguro',
	'Gracias por existir',
	'Contigo todo es mejor',
	'Eres mi paz',
	'Cada día te amo más',
	'Me encanta tu sonrisa',
	'Eres mi sueño cumplido',
	'Mi corazón es tuyo',
	'Siempre tú',
	'Lo mejor que me ha pasado',
	'Eres mi casualidad favorita',
	'Te amo más de lo que imaginas',
	'Tu risa es mi sonido favorito',
	'A tu lado todo tiene sentido',
	'Eres mi hogar',
	'Mi niña hermosa'
];

const isTouch = ('ontouchstart' in window) ||
	navigator.maxTouchPoints > 0 ||
	(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

function ensureViewport() {
	let meta = document.querySelector('meta[name="viewport"]');
	if (!meta) {
		meta = document.createElement('meta');
		meta.name = 'viewport';
		document.head.appendChild(meta);
	}
	meta.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
}

function injectStyles() {
	const style = document.createElement('style');
	style.textContent = `
		html, body {
			margin: 0;
			padding: 0;
			width: 100%;
			height: 100%;
			overflow: hidden;
			background: #080506;
			overscroll-behavior: none;
		}
		body {
			-webkit-tap-highlight-color: transparent;
			-webkit-user-select: none;
			user-select: none;
		}
		canvas {
			display: block;
			touch-action: none;
		}
		#gallery-intro {
			position: fixed;
			inset: 0;
			z-index: 30;
			display: flex;
			align-items: center;
			justify-content: center;
			background: radial-gradient(circle at 50% 38%, #3c1220 0%, #1a0d12 52%, #080506 100%);
			color: #f4e7d2;
			font-family: Georgia, "Times New Roman", serif;
			text-align: center;
			transition: opacity 1s ease, visibility 1s ease;
			touch-action: manipulation;
		}
		#gallery-intro.hidden {
			opacity: 0;
			visibility: hidden;
			pointer-events: none;
		}
		#gallery-intro .intro-inner {
			max-width: 660px;
			padding: 44px 26px;
		}
		#gallery-intro svg {
			width: 62px;
			height: 62px;
			fill: none;
			stroke: #d9b96c;
			stroke-width: 1.1;
			stroke-linecap: round;
			stroke-linejoin: round;
			filter: drop-shadow(0 0 16px rgba(217, 185, 108, .5));
		}
		#gallery-intro h1 {
			margin: 22px 0 12px;
			font-size: clamp(38px, 7vw, 68px);
			font-weight: normal;
			letter-spacing: .06em;
			color: #f7ecd9;
		}
		#gallery-intro .intro-kicker {
			margin: 22px 0 0;
			font-size: 12px;
			letter-spacing: .34em;
			text-transform: uppercase;
			color: #d9b96c;
		}
		#gallery-intro .intro-sub {
			margin: 0;
			font-size: 16px;
			font-style: italic;
			color: #cbb698;
		}
		#gallery-intro .intro-line {
			display: block;
			width: 120px;
			height: 1px;
			margin: 34px auto 0;
			background: linear-gradient(90deg, transparent, #c9a24a, transparent);
		}
		#gallery-intro .intro-cta {
			margin: 34px 0 0;
			font-size: 13px;
			letter-spacing: .24em;
			text-transform: uppercase;
			color: #eed8a7;
			animation: intro-pulse 2.4s ease-in-out infinite;
		}
		#gallery-intro .intro-controls {
			margin: 14px 0 0;
			font-size: 11px;
			letter-spacing: .12em;
			color: #8c7d6b;
		}
		#gallery-intro .intro-credit {
			margin: 26px 0 0;
			font-size: 10px;
			letter-spacing: .16em;
			text-transform: uppercase;
			color: #6f5f50;
		}
		@keyframes intro-pulse {
			0%, 100% { opacity: .45; }
			50% { opacity: 1; }
		}
		#gallery-player {
			position: fixed;
			left: max(16px, env(safe-area-inset-left));
			bottom: max(16px, env(safe-area-inset-bottom));
			z-index: 20;
			display: flex;
			align-items: center;
			gap: 12px;
			width: min(330px, calc(100vw - 32px));
			padding: 10px 14px 10px 10px;
			border: 1px solid rgba(201, 162, 74, .45);
			border-radius: 14px;
			background: rgba(24, 11, 16, .82);
			box-shadow: 0 10px 40px rgba(0, 0, 0, .45);
			backdrop-filter: blur(14px);
			-webkit-backdrop-filter: blur(14px);
			color: #f4e7d2;
			font-family: Georgia, "Times New Roman", serif;
			opacity: 0;
			transform: translateY(12px);
			transition: opacity .6s ease, transform .6s ease;
			pointer-events: none;
			touch-action: manipulation;
			box-sizing: border-box;
		}
		#gallery-player.visible {
			opacity: 1;
			transform: none;
			pointer-events: auto;
		}
		#gallery-player audio {
			display: none;
		}
		.player-toggle {
			flex: 0 0 42px;
			width: 42px;
			height: 42px;
			padding: 0;
			border-radius: 50%;
			border: 1px solid rgba(217, 185, 108, .7);
			background: rgba(217, 185, 108, .08);
			color: #e8cf98;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			-webkit-appearance: none;
			appearance: none;
			touch-action: manipulation;
		}
		.player-toggle svg {
			width: 18px;
			height: 18px;
			fill: currentColor;
		}
		.player-toggle .icon-pause {
			display: none;
		}
		#gallery-player.is-playing .player-toggle .icon-play {
			display: none;
		}
		#gallery-player.is-playing .player-toggle .icon-pause {
			display: block;
		}
		.player-info {
			flex: 1;
			min-width: 0;
		}
		.player-now {
			display: flex;
			align-items: center;
			gap: 8px;
			min-width: 0;
		}
		.player-eq {
			display: flex;
			align-items: flex-end;
			gap: 2px;
			width: 14px;
			height: 12px;
			flex: 0 0 14px;
		}
		.player-eq i {
			display: block;
			width: 3px;
			height: 4px;
			border-radius: 1px;
			background: #d9b96c;
			opacity: .65;
		}
		#gallery-player.is-playing .player-eq i {
			animation: player-eq 1s ease-in-out infinite;
		}
		#gallery-player.is-playing .player-eq i:nth-child(2) {
			animation-delay: .18s;
		}
		#gallery-player.is-playing .player-eq i:nth-child(3) {
			animation-delay: .36s;
		}
		@keyframes player-eq {
			0%, 100% { height: 4px; }
			50% { height: 12px; }
		}
		.player-title {
			font-size: 13px;
			letter-spacing: .03em;
			color: #f2e4cc;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.player-artist {
			margin-left: 5px;
			font-size: 11px;
			font-style: italic;
			color: #a08e75;
		}
		.player-track {
			position: relative;
			height: 3px;
			margin-top: 7px;
			border-radius: 999px;
			background: rgba(255, 255, 255, .13);
			cursor: pointer;
			touch-action: manipulation;
		}
		.player-track::before {
			content: '';
			position: absolute;
			inset: -8px 0;
		}
		.player-progress {
			display: block;
			height: 100%;
			width: 0%;
			border-radius: 999px;
			background: linear-gradient(90deg, #b8893a, #f0d58f);
		}
		.player-time {
			display: flex;
			justify-content: space-between;
			margin-top: 5px;
			font-size: 10px;
			letter-spacing: .08em;
			color: #907e68;
		}
		.player-hint {
			font-size: 9px;
			letter-spacing: .12em;
			text-transform: uppercase;
		}
		#gallery-player.has-error .player-title {
			color: #d8a09a;
		}
		.touch-device #gallery-player .player-hint {
			display: none;
		}
		@media (max-width: 480px) {
			#gallery-player {
				gap: 10px;
				width: min(280px, calc(100vw - 24px));
				padding: 9px 12px 9px 9px;
			}
			.player-toggle {
				flex-basis: 38px;
				width: 38px;
				height: 38px;
			}
			.player-title {
				font-size: 12px;
			}
			.player-artist {
				font-size: 10px;
			}
		}
		#love-notes {
			position: fixed;
			inset: 0;
			z-index: 15;
			overflow: hidden;
			pointer-events: none;
		}
		.love-note {
			position: absolute;
			max-width: min(420px, 70vw);
			font-family: Georgia, "Times New Roman", serif;
			font-size: clamp(13px, 1.5vw, 17px);
			font-style: italic;
			line-height: 1.35;
			letter-spacing: .02em;
			text-align: center;
			color: #f3dfb9;
			text-shadow: 0 2px 18px rgba(0, 0, 0, .9), 0 0 26px rgba(217, 185, 108, .18);
			transform: translate(-50%, -50%) rotate(var(--rot, 0deg));
			opacity: 0;
			animation: love-note-float 8s ease-in-out forwards;
			will-change: opacity, transform;
		}
		@keyframes love-note-float {
			0% { opacity: 0; transform: translate(-50%, -46%) rotate(var(--rot, 0deg)) scale(.96); }
			12% { opacity: .95; }
			72% { opacity: .9; }
			100% { opacity: 0; transform: translate(-50%, -58%) rotate(var(--rot, 0deg)) scale(1); }
		}
		#touch-hint {
			position: fixed;
			top: max(16px, env(safe-area-inset-top));
			left: 50%;
			z-index: 18;
			padding: 8px 14px;
			border: 1px solid rgba(201, 162, 74, .25);
			border-radius: 999px;
			background: rgba(24, 11, 16, .6);
			color: #d8c3a0;
			font-family: Georgia, "Times New Roman", serif;
			font-size: 11px;
			letter-spacing: .06em;
			white-space: nowrap;
			opacity: 0;
			transform: translate(-50%, -8px);
			transition: opacity .6s ease, transform .6s ease;
			pointer-events: none;
		}
		#touch-hint.visible {
			opacity: 1;
			transform: translate(-50%, 0);
		}
		@media (max-width: 480px) {
			.love-note {
				max-width: 68vw;
				font-size: 13px;
			}
			#touch-hint {
				padding: 7px 12px;
				font-size: 10px;
			}
		}
	`;
	document.head.appendChild(style);
}

module.exports = function () {
	ensureViewport();
	injectStyles();
	document.documentElement.classList.toggle('touch-device', isTouch);

	const intro = document.createElement('div');
	intro.id = 'gallery-intro';
	intro.setAttribute('data-ui', '');
	intro.innerHTML = `
		<div class="intro-inner">
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path d="M12 20.6 3.9 12.5a5.5 5.5 0 0 1 7.8-7.8l.3.3.3-.3a5.5 5.5 0 0 1 7.8 7.8Z" />
			</svg>
			<p class="intro-kicker">Un museo privado</p>
			<h1>Para ti, mi amor</h1>
			<p class="intro-sub">Cada cuadro guarda un momento contigo</p>
			<span class="intro-line"></span>
			<p class="intro-cta">${isTouch ? 'Toca para entrar' : 'Haz clic para entrar'}</p>
			<p class="intro-controls">${isTouch
				? 'Desliza para mirar &nbsp;&middot;&nbsp; Toca el suelo para caminar'
				: 'WASD para caminar &nbsp;&middot;&nbsp; Ratón para mirar &nbsp;&middot;&nbsp; Shift para correr'}</p>
			<p class="intro-credit">Música: Niña Bonita &middot; Chino &amp; Nacho</p>
		</div>`;
	document.body.appendChild(intro);

	const player = document.createElement('div');
	player.id = 'gallery-player';
	player.setAttribute('data-ui', '');
	player.innerHTML = `
		<audio preload="auto" loop></audio>
		<button class="player-toggle" type="button" aria-label="Reproducir música">
			<svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
			<svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z" /></svg>
		</button>
		<div class="player-info">
			<div class="player-now">
				<span class="player-eq" aria-hidden="true"><i></i><i></i><i></i></span>
				<span class="player-title">Niña Bonita<span class="player-artist">Chino &amp; Nacho</span></span>
			</div>
			<div class="player-track" role="slider" tabindex="0" aria-label="Progreso de la canción" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
				<span class="player-progress"></span>
			</div>
			<div class="player-time"><span class="player-current">0:00</span><span class="player-hint">M &middot; música</span></div>
		</div>`;
	document.body.appendChild(player);

	const audio = player.querySelector('audio');
	const toggle = player.querySelector('.player-toggle');
	const title = player.querySelector('.player-title');
	const track = player.querySelector('.player-track');
	const progress = player.querySelector('.player-progress');
	const current = player.querySelector('.player-current');
	audio.src = MUSIC_URL;

	const notes = document.createElement('div');
	notes.id = 'love-notes';
	document.body.appendChild(notes);

	const touchHint = document.createElement('div');
	touchHint.id = 'touch-hint';
	touchHint.setAttribute('data-ui', '');
	touchHint.textContent = 'Desliza para mirar · Toca el suelo para caminar';
	document.body.appendChild(touchHint);

	let entered = false;
	let noteTimer = null;
	let lastNote = -1;
	let musicUnlocked = false;

	const formatTime = (value) => {
		if (!isFinite(value)) return '0:00';
		const minutes = Math.floor(value / 60);
		const seconds = Math.floor(value % 60);
		return minutes + ':' + String(seconds).padStart(2, '0');
	};

	const updateProgress = () => {
		const duration = audio.duration;
		const fraction = isFinite(duration) && duration > 0 ? audio.currentTime / duration : 0;
		progress.style.width = (fraction * 100).toFixed(2) + '%';
		current.textContent = formatTime(audio.currentTime);
		track.setAttribute('aria-valuenow', String(Math.round(fraction * 100)));
	};

	const updatePlayState = () => {
		const playing = !audio.paused;
		player.classList.toggle('is-playing', playing);
		toggle.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
	};

	const startMusic = () => {
		const promise = audio.play();
		if (promise && promise.catch) promise.catch(updatePlayState);
		return promise;
	};

	const toggleMusic = () => {
		if (audio.paused) {
			startMusic();
		} else {
			audio.pause();
		}
	};

	const stopFallback = () => {
		musicUnlocked = true;
		window.removeEventListener('touchend', retryMusic, true);
		window.removeEventListener('click', retryMusic, true);
	};

	const retryMusic = (event) => {
		if (musicUnlocked) return;
		const target = event.target;
		if (target && target.closest && target.closest('[data-ui]') && !target.closest('#gallery-intro')) return;
		startMusic();
	};

	audio.addEventListener('playing', stopFallback, { once: true });
	toggle.addEventListener('click', toggleMusic);
	player.addEventListener('mousedown', (event) => event.stopPropagation());
	audio.addEventListener('play', updatePlayState);
	audio.addEventListener('pause', updatePlayState);
	audio.addEventListener('timeupdate', updateProgress);
	audio.addEventListener('loadedmetadata', updateProgress);
	audio.addEventListener('error', () => {
		player.classList.add('has-error');
		title.textContent = 'Música no disponible';
	});

	track.addEventListener('click', (event) => {
		const rect = track.getBoundingClientRect();
		if (!isFinite(audio.duration) || rect.width === 0) return;
		const fraction = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
		audio.currentTime = fraction * audio.duration;
	});
	track.addEventListener('keydown', (event) => {
		if (!isFinite(audio.duration)) return;
		if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
			event.preventDefault();
			audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + (event.key === 'ArrowRight' ? 5 : -5)));
		}
	});

	window.addEventListener('keydown', (event) => {
		if (event.code !== 'KeyM' || !entered || event.ctrlKey || event.metaKey || event.altKey) return;
		event.preventDefault();
		toggleMusic();
	});

	const spawnNote = () => {
		if (!entered || document.visibilityState === 'hidden') return;
		let index = Math.floor(Math.random() * LOVE_NOTES.length);
		if (LOVE_NOTES.length > 1 && index === lastNote) index = (index + 1) % LOVE_NOTES.length;
		lastNote = index;
		const note = document.createElement('span');
		note.className = 'love-note';
		note.textContent = LOVE_NOTES[index];
		note.style.left = (10 + Math.random() * 80).toFixed(1) + '%';
		note.style.top = (16 + Math.random() * 60).toFixed(1) + '%';
		const rotation = (-5 + Math.random() * 10).toFixed(1);
		note.style.setProperty('--rot', rotation + 'deg');
		note.addEventListener('animationend', () => note.remove());
		notes.appendChild(note);
	};

	const scheduleNotes = (delay) => {
		noteTimer = setTimeout(() => {
			spawnNote();
			scheduleNotes(9000 + Math.random() * 9000);
		}, delay);
	};

	const showTouchHint = () => {
		touchHint.classList.add('visible');
		setTimeout(() => touchHint.classList.remove('visible'), 8000);
	};

	const enter = () => {
		if (entered) return;
		entered = true;
		intro.classList.add('hidden');
		player.classList.add('visible');
		setTimeout(() => intro.remove(), 1100);
		window.removeEventListener('keydown', enterOnKey);
		window.addEventListener('touchend', retryMusic, true);
		window.addEventListener('click', retryMusic, true);
		startMusic();
		if (isTouch) showTouchHint();
		scheduleNotes(3200);
	};

	const enterOnKey = () => enter();
	intro.addEventListener('pointerdown', enter);
	window.addEventListener('keydown', enterOnKey);

	window.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'hidden' && !audio.paused) {
			audio.pause();
		}
	});
};
