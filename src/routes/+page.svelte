<script lang="ts">
	import { onMount } from 'svelte';

	// Variables to store time input values
	let hours = 0;
	let minutes = 0;
	let seconds = 0;

	// Total time in seconds
	let totalSeconds = 0;

	// Timer-related variables
	let timer: NodeJS.Timeout | null = null; // Timer reference
	let timerRunning = false; // Flag to track if the timer is running

	// Function to start the timer
	function startTimer() {
		if (!hours && !minutes && !seconds) {
			totalSeconds = 0;
			updateTime();
		} else {
			totalSeconds = hours * 3600 + minutes * 60 + seconds;
			if (totalSeconds > 0 && !timerRunning) {
				timerRunning = true;
				timer = setInterval(() => {
					if (totalSeconds > 0) {
						totalSeconds--;
						updateTime();
						// Save timer values to localStorage
						localStorage.setItem(
							'timerData',
							JSON.stringify({ hours, minutes, seconds, totalSeconds })
						);
					} else {
						clearInterval(timer!);
						timerRunning = false;
						localStorage.removeItem('timerData'); // Remove timer data when timer reaches 0
					}
				}, 1000);
			}
		}
	}

	// Function to update hours, minutes, seconds based on totalSeconds
	function updateTime() {
		const h = Math.floor(totalSeconds / 3600); // Calculate hours
		const m = Math.floor((totalSeconds % 3600) / 60); // Calculate minutes
		const s = totalSeconds % 60; // Calculate seconds

		// Update individual time variables
		hours = h;
		minutes = m;
		seconds = s;
	}

	// Function to stop the timer
	function stopTimer() {
		if (timer) {
			clearInterval(timer); // Clear the timer interval
			timerRunning = false; // Set timerRunning flag to false
		}
	}

	// Function to toggle the timer
	function toggleTimer() {
		if (timerRunning) {
			stopTimer(); // Stop the timer if it's running
		} else {
			startTimer(); // Start the timer if it's not running
		}
	}

	function resetTimer() {
		hours = 0;
		minutes = 0;
		seconds = 0;
		stopTimer();
	}

	function limitInputLength(value: number, maxValue: number) {
		if (value.toString().length > maxValue) {
			// Get only the first `maxValue` characters from the input
			return parseInt(value.toString().substring(0, maxValue));
		}
		return value;
	}

	// Lifecycle hook - runs when the component is mounted
	onMount(() => {
		const storedTimerData = localStorage.getItem('timerData');
		if (storedTimerData) {
			const parsedData = JSON.parse(storedTimerData);
			hours = parsedData.hours;
			minutes = parsedData.minutes;
			seconds = parsedData.seconds;
			totalSeconds = parsedData.totalSeconds;
			if (totalSeconds > 0) {
				startTimer();
			}
		}
	});
</script>

<!-- HTML part containing the input fields, buttons, and timer display -->

<div class="flex flex-col sm:flex-row items-center">
	<!-- Input fields for hours, minutes, and seconds -->
	<div class="flex flex-col basis-1/2 items-center">
		<h1 class="text-center text-3xl font-extrabold">Countdown Timer</h1>
		<h2 class="text-center text-sm opacity-70 mb-7">
			nov-challenge from codesphere, <br /> made by <b>Elias Haller</b>✨
		</h2>
		<div
			class="flex flex-col items-center p-5 dark:bg-gradient-to-r dark:from-gray-900 dark:to-slate-900 shadow-lg"
		>
			<div class="w-64 relative my-3">
				<input
					type="number"
					bind:value={hours}
					min="0"
					disabled={timerRunning}
					on:input={() => {
						hours = limitInputLength(hours, 3);
					}}
					class="input peer"
					placeholder="  "
				/>
				<label for="floating_filled" class="lbl">Hours</label>
			</div>

			<div class="w-64 relative my-3">
				<input
					type="number"
					bind:value={minutes}
					min="0"
					max="59"
					on:input={() => {
						minutes = limitInputLength(minutes, 2);
					}}
					disabled={timerRunning}
					class="input peer"
					placeholder="  "
				/>
				<label for="floating_filled" class="lbl">Minutes</label>
			</div>

			<div class="w-64 relative my-3">
				<input
					type="number"
					id="floating_outlined"
					bind:value={seconds}
					min="0"
					max="59"
					on:input={() => {
						seconds = limitInputLength(seconds, 2);
					}}
					disabled={timerRunning}
					class="input peer"
					placeholder="  "
				/>
				<label for="floating_filled" class="lbl">Seconds</label>
			</div>

			<!-- Start and stop buttons -->
			<button class="btn w-64 {timerRunning ? 'btn-stop' : 'btn'}" on:click={toggleTimer}>
				<!-- Toggle button text based on timer state -->
				{timerRunning ? 'Pause' : 'Start'}
			</button>
			<br />
			<button class="btn-reset drop-shadow-sm" on:click={resetTimer}
				><svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="#FDAF90"
					class="w-8 h-8"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z"
					/>
				</svg>
			</button>
		</div>
	</div>

	<!-- Display the countdown timer -->
	<div class="basis-1/2 mt-20 sm:mt-0">
		<h2
			class="pt-4 text-maxxl font-black text-right dark:bg-gradient-to-r dark:pb-1 dark:from-amber-200 dark:via-orange-200 dark:to-rose-400 dark:text-transparent dark:bg-clip-text text-zinc-800 drop-shadow-md"
		>
			<div>{hours || hours === 0 ? hours : '0'}</div>
			<div>{minutes || minutes === 0 ? (minutes < 10 ? `0${minutes}` : minutes) : '0'}</div>
			<div>{seconds || seconds === 0 ? (seconds < 10 ? `0${seconds}` : seconds) : '0'}</div>
		</h2>
	</div>
</div>
