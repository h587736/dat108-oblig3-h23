
class DeltagerManager {

    #regElm;
    #statElm;
    #finndeltagerElm;
    // Deklarer resterende felt-variabler her

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
        
        // Fyll evt. inn mer kode
    }

    #finndeltager() {
        // Fyll inn kode        
    }


    #beregnstatistikk() {
        // Fyll inn kode        
    }

    #registrerdeltager() {
        const tidReg = /(?:\d{0,2}:){2}\d{0,2}/g;
        const startnummerReg = /\d{1,3}/g;
        const navnReg = /\p{L}{2,}(?:-\p{L}{2,})?/gu;

        // Fyll inn kode
    }

    // Fyll inn evt. hjelpemetoder
}

const rootelement = document.getElementById("root");
new DeltagerManager(rootelement);