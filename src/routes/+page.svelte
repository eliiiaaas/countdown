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
		// Calculate total time in seconds
		totalSeconds = hours * 3600 + minutes * 60 + seconds;

		// Check if a valid time is entered and the timer isn't already running
		if (totalSeconds > 0 && !timerRunning) {
			timerRunning = true; // Set timerRunning flag to true
			timer = setInterval(() => {
				if (totalSeconds > 0) {
					totalSeconds--; // Decrement totalSeconds every second
					updateTime(); // Update hours, minutes, seconds based on totalSeconds
				} else {
					clearInterval(timer!); // Clear the timer interval
					timerRunning = false; // Set timerRunning flag to false when timer reaches 0
				}
			}, 1000); // Run the interval every 1000ms (1 second)
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

	// Lifecycle hook - runs when the component is mounted
	onMount(() => {
		updateTime(); // Update time when the component is mounted
	});
</script>

<!-- HTML part containing the input fields, buttons, and timer display -->
<div class="flex items-center">
	<!-- Input fields for hours, minutes, and seconds -->
	<div class="flex flex-col basis-1/2 items-center">
		<h1 class="text-center text-3xl font-bold">Countdown Timer</h1>
		<h2 class="text-center text-sm opacity-70 mb-7">nov-challenge from codesphere, <br> made by Elias Haller✨</h2>
		<div class="p-5 rounded-2xl bg-gradient-to-r from-gray-900 to-slate-900 shadow-sm">
			<div class="w-64 relative my-3">
				<input
					type="number"
					bind:value={hours}
					min="0"
					disabled={timerRunning}
					class="input peer"
					placeholder=" 00"
				/>
				<label for="floating_filled" class="lbl">Hours</label>
			</div>

			<div class="w-64 relative my-3">
				<input
					type="number"
					bind:value={minutes}
					min="0"
					max="59"
					disabled={timerRunning}
					class="input peer"
					placeholder=" 00 "
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
					disabled={timerRunning}
					class="input peer"
					placeholder=" 00 "
				/>
				<label for="floating_filled" class="lbl">Seconds</label>
			</div>

			<!-- Start and stop buttons -->
			<button class="btn w-64" on:click={toggleTimer}>
				<!-- Toggle button text based on timer state -->
				{timerRunning ? 'Stop' : 'Start'}
			</button>
		</div>
	</div>

	<!-- Display the countdown timer -->
	<div class="basis-1/2">
		<h2 class="text-maxxl font-black text-right">
			<div>{hours}</div>
			<div>{minutes < 10 ? `0${minutes}` : minutes}</div>
			<div>{seconds < 10 ? `0${seconds}` : seconds}</div>
		</h2>
	</div>
</div>
