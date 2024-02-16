<template>
	<div class="loading">
		<div class="loader"></div>
		<div class="loading__status">
			<span class="loading__status-text" v-html="status"></span>

			<div class="loading__progress-wrapper">
				<div class="loading__progress" v-show="isDownloading">
					<div class="loading__progress-fill" :style="{ width: `${downloadPercent}%` }"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { animate } from 'motion';

export default {
	name: "LoadingPage",
	data() {
		return {
			status: "Запуск лаунчера...",
			downloadPercent: 0,
			isDownloading: false,
		}
	},
	mounted() {
		animate('.loading', { opacity: [0, 100] }, { duration: 1 })
	},
	methods: {
		setLoadingParams(status = "status", downloadPercent = 0, isDownloading = false) {
			this.status = `${status}...`;
			this.downloadPercent = downloadPercent;
			this.isDownloading = isDownloading;
		},
	},
	created() {
		window.setLoadingParams = this.setLoadingParams;
	},
}
</script>

<style>
.loading {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
}

.loading__status {
	margin-top: 70px;
}

.loading__status-text {
	font-size: 32px;
	font-weight: 600;
	text-align: center;
	font-family: var(--raleway-font);
}

.loader {
	width: 400px;
	padding: 35px;
	aspect-ratio: 1;
	border-radius: 50%;
	background: #205D96;
	--_m:
		conic-gradient(#0000 10%, #000),
		linear-gradient(#000 0 0) content-box;
	-webkit-mask: var(--_m);
	mask: var(--_m);
	-webkit-mask-composite: source-out;
	mask-composite: subtract;
	animation: l3 1s infinite linear;
}

@keyframes l3 {
	to {
		transform: rotate(1turn)
	}
}</style>