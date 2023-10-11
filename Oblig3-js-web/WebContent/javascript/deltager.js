
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
		const startnummer = parseInt(searchInput.value);
		const resultContainer = this.#finndeltagerElm.querySelector(".resultatok");
		const notFoundMessage = this.#finndeltagerElm.querySelector(".resultatmangler");

		console.log("Searching for startnummer: " + startnummer);

		// Access your locally stored participant data (the array you created)
		const participantDataArray = this.#registrerteDeltakere;

		// Find the participant with the matching startnummer
		const participantData = participantDataArray.find(participant => participant.startnummer === startnummer);

		if (participantData) {
			// Participant was found, populate the fields
			resultContainer.classList.remove("hidden");
			notFoundMessage.classList.add("hidden");

			const startnummerField = resultContainer.querySelector("dd:nth-child(2)");
			const navnField = resultContainer.querySelector("dd:nth-child(4)");
			const tidField = resultContainer.querySelector("dd:nth-child(6)");

			startnummerField.textContent = participantData.startnummer;
			navnField.textContent = participantData.navn;
			tidField.textContent = participantData.tid;
		} else {
			// Participant was not found, display the not found message and hide the result fields
			notFoundMessage.classList.remove("hidden");
			resultContainer.classList.add("hidden");
		}
	}


	#beregnstatistikk() {
		// Fyll inn kode        
	}

	#registrerdeltager() {
		const inputElement = this.#regElm.querySelector("input");
		const inputData = inputElement.value;

		const tidReg = /(?:\d{0,2}:){2}\d{0,2}/g;
		const startnummerReg = /\d{1,3}/g;
		const navnReg = /\p{L}{2,}(?:-\p{L}{2,})?/gu;

		const tidValid = inputData.match(tidReg);
		const startnummerValid = inputData.match(startnummerReg);
		const navnValid = inputData.match(navnReg);

		if (tidValid && startnummerValid && navnValid) {
			const startnummer = startnummerValid[0];
			const navn = navnValid
				.map((part) =>
					part.replace(/(^|-)(\p{L})/gu, (match) => match.toUpperCase())
				)
				.join(" ");

			const tidParts = tidValid[0].split(":");

			if (tidParts.length === 3) {
				const hours = tidParts[0].padStart(2, "0");
				const minutes = tidParts[1].padStart(2, "0");
				const seconds = tidParts[2].padStart(2, "0");

				const tid = `${hours}:${minutes}:${seconds}`;

				this.#registrerteDeltakere.push({
					startnummer,
					navn,
					tid,
				});
				this.updateBestTime(tid);
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