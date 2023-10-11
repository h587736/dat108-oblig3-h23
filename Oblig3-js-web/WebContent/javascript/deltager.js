
class DeltagerManager {

	#regElm;
	#statElm;
	#finndeltagerElm;
	#bestTidElm;
	#resultatDiv;
	#registrerteDeltakere = [];

	constructor(root) {
		this.#regElm = root.getElementsByClassName("registrering")[0];

		const regButton = this.#regElm.getElementsByTagName("button")[0];
		regButton.addEventListener("click", () => { this.#registrerdeltager() });

		this.#statElm = root.getElementsByClassName("statistikk")[0];
		const statButton = this.#statElm.getElementsByTagName("button")[0];
		statButton.addEventListener("click", () => { this.#beregnstatistikk() });

		this.#finndeltagerElm = root.getElementsByClassName("deltager")[0];
		const deltagerButton = this.#finndeltagerElm.getElementsByTagName("button")[0];
		deltagerButton.addEventListener("click", () => { this.#finndeltager() });

		this.#bestTidElm = this.#regElm.querySelector('.resultat span');
		this.#resultatDiv = this.#regElm.querySelector('.resultat');

		this._registrerteDeltakere = [];
	}

	#finndeltager() {
		const searchInput = this.#finndeltagerElm.querySelector("input");
		let startnummer = searchInput.value.trim(); // Remove leading/trailing whitespace
		const resultContainer = this.#finndeltagerElm.querySelector(".resultatok");
		const notFoundMessage = this.#finndeltagerElm.querySelector(".resultatmangler");

		// Hide previous results and the notFoundMessage at the start of the search
		resultContainer.classList.add("hidden");
		notFoundMessage.classList.add("hidden");

		const participantDataArray = this.#registrerteDeltakere;

		const firstParticipant = participantDataArray[0];
		if (firstParticipant && firstParticipant.startnummer.length > startnummer.length) {
			startnummer = startnummer.padStart(firstParticipant.startnummer.length, "0");
		}

		const participantData = participantDataArray.find(participant => participant.startnummer === startnummer);

		if (participantData) {
			resultContainer.classList.remove("hidden");
			notFoundMessage.classList.add("hidden");

			const startnummerField = resultContainer.querySelector("dd:nth-child(2)");
			const navnField = resultContainer.querySelector("dd:nth-child(4)");
			const tidField = resultContainer.querySelector("dd:nth-child(6)");

			startnummerField.textContent = participantData.startnummer;
			navnField.textContent = participantData.navn;
			tidField.textContent = participantData.tid;
		} else {
			notFoundMessage.classList.remove("hidden");
		}

		searchInput.value = '';
	}


	#beregnstatistikk() {
		const fraTidInput = this.#statElm.querySelector("#nedregrense");
		const tilTidInput = this.#statElm.querySelector("#ovregrense");
		const resultatMessage = this.#statElm.querySelector(".resultat");
		const antallSpan = resultatMessage.querySelector("span:first-child");
		const fraTidSpan = resultatMessage.querySelector("span:nth-child(2)");
		const tilTidSpan = resultatMessage.querySelector("span:nth-child(3");

		const calculateAntallDeltagere = (fraTid, tilTid) => {
			return this.#registrerteDeltakere.filter(participant => isWithinTimeRange(participant.tid, fraTid, tilTid)).length;
		};

		const isWithinTimeRange = (participantTid, fraTid, tilTid) => {
			const tid = participantTid.split(":");
			const fraTidParts = fraTid.split(":");
			const tilTidParts = tilTid.split(":");
			const participantTimeInSeconds = parseInt(tid[0]) * 3600 + parseInt(tid[1]) * 60 + parseInt(tid[2]);
			const fraTidInSeconds = parseInt(fraTidParts[0]) * 3600 + parseInt(fraTidParts[1]) * 60 + parseInt(fraTidParts[2]);
			const tilTidInSeconds = parseInt(tilTidParts[0]) * 3600 + parseInt(tilTidParts[1]) * 60 + parseInt(tilTidParts[2]);

			return participantTimeInSeconds >= fraTidInSeconds && participantTimeInSeconds <= tilTidInSeconds;
		};

		const fraTid = fraTidInput.value || "00:00:00";
		const tilTid = tilTidInput.value || "23:59:59";

		if (fraTidInput.checkValidity() && tilTidInput.checkValidity()) {
			const fraTidInSeconds = this.timeToSeconds(fraTid);
			const tilTidInSeconds = this.timeToSeconds(tilTid);

			if (fraTidInSeconds <= tilTidInSeconds) {
				const antallDeltagere = calculateAntallDeltagere(fraTid, tilTid);

				antallSpan.textContent = antallDeltagere;
				fraTidSpan.textContent = fraTid;
				tilTidSpan.textContent = tilTid;
				resultatMessage.classList.remove("hidden");
				fraTidInput.setCustomValidity(""); 
				fraTidInput.reportValidity(); 
			} else {
				fraTidInput.setCustomValidity("Tidspunktet 'Fra' må være mindre enn eller lik tidspunktet 'Til'.");
				resultatMessage.classList.add("hidden");
				fraTidInput.reportValidity();
			}
		} else {
			resultatMessage.classList.add("hidden");
		}
	}

	timeToSeconds(timeString) {
		const timeParts = timeString.split(":");
		const hours = parseInt(timeParts[0]);
		const minutes = parseInt(timeParts[1]);
		const seconds = parseInt(timeParts[2]);
		return hours * 3600 + minutes * 60 + seconds;
	}


	#registrerdeltager() {
		const inputElement = this.#regElm.querySelector("input");
		const inputData = inputElement.value;

		const parts = inputData.split(" ");

		let startnummer = "";
		let tid = "";
		let navn = "";

		for (const part of parts) {
			if (/^\d{1,3}$/.test(part) && !startnummer) {
				startnummer = part;
			} else if (/^\d{0,2}:\d{0,2}:\d{0,2}$/.test(part) && !tid) {
				tid = part;
			} else {
				if (navn) {
					navn += " " + part;
				} else {
					navn = part;
				}
			}
		}

		if (startnummer && navn && tid) {
			const tidParts = tid.split(":");
			if (tidParts.length === 3) {
				const hours = tidParts[0].padStart(2, "0");
				const minutes = tidParts[1].padStart(2, "0");
				const seconds = tidParts[2].padStart(2, "0");
				const formattedTid = `${hours}:${minutes}:${seconds}`;

				this.#registrerteDeltakere.push({
					startnummer,
					navn,
					tid: formattedTid,
				});
				this.updateBestTime(formattedTid);
				this.clearForm(inputElement);
			} else {
				this.displayErrorMessage("Slutt tid maa vaere i formatet timer:minutter:sekunder.");
			}
		} else {
			this.displayErrorMessage("Ugyldig input. Vennligst sjekk den angitte dataen.");
			inputElement.value = inputData;
		}
	}



	updateBestTime(tid) {
		this.#bestTidElm.textContent = tid;
		this.#resultatDiv.classList.remove('hidden');
	}

	clearForm(inputElement) {
		inputElement.value = "";
	}

	displayErrorMessage(message) {
		const inputElement = this.#regElm.querySelector("input");
		inputElement.setCustomValidity(message);
		inputElement.reportValidity();
	}
}

const rootelement = document.getElementById("root");
new DeltagerManager(rootelement);