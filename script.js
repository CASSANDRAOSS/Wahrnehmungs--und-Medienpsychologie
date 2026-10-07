// ==================================================
// SCRIPT.JS
// Beispiele, Erklärungen und Reaktionen auf Klicks.
// Alle Aktionen bleiben Simulationen.
// ==================================================

// --------------------------------------------------
// 1. Zustand der Seite
// --------------------------------------------------

let scene = "stock";

// Die Seite startet mit "Ausprobieren".
let mode = "try";

let fairSingle = false;
let explained = false;

// --------------------------------------------------
// 2. Erklärung der Gestaltungsmuster
// --------------------------------------------------

const explanations = {
  stock: [
    "Erfundene Knappheit",

    "In der manipulativen Variante wird ein Bestand von " +
      "zwei Tassen behauptet. In dieser Simulation liegen " +
      "tatsächlich 120 Tassen auf Lager: Die Anzeige ist " +
      "bewusst falsch. Sie soll die Sorge auslösen, " +
      "eine Gelegenheit zu verpassen.",

    "In der fairen Variante steht eine zutreffende, " +
      "sachliche Information. Eine echte, korrekt " +
      "dargestellte Knappheit ist von unserem " +
      "erfundenen Hinweis zu unterscheiden."
  ],

  newsletter: [
    "Rabatt im Vordergrund, Bedingung im Hintergrund",

    "In der manipulativen Variante dominiert der Rabatt. " +
      "Dass er eine Newsletter-Anmeldung voraussetzt, " +
      "steht nur klein darunter. Aufmerksamkeit und " +
      "Informationsgewichtung machen die Bedingung " +
      "leichter übersehbar.",

    "In der fairen Variante werden Angebot und Voraussetzung " +
      "gemeinsam genannt. Die Anmeldung bleibt freiwillig; " +
      "die weitere Nutzung ist ohne Anmeldung möglich."
  ],

  shaming: [
    "Beschämende Ablehnung · Confirmshaming",

    "In der manipulativen Variante wird der Ablehnung " +
      "eine unerwünschte Haltung zugeschrieben: " +
      "„Ich zahle lieber mehr.“ Der Text soll die " +
      "Entscheidung emotional erschweren.",

    "In der fairen Variante benennen beide Schaltflächen " +
      "die tatsächliche Handlung. Ohne Newsletter " +
      "weiterzugehen wird nicht abgewertet."
  ]
};

// --------------------------------------------------
// 3. Rechtliche Informationen
// Getrennt von den Shoptexten, damit du sie leicht
// bearbeiten kannst.
// --------------------------------------------------

const legalNotes = {
  stock: {
    status: "Unter den angenommenen Umständen unzulässig",

    warning: true,

    text:
      "In unserer Simulation sind 120 Tassen vorhanden. " +
      "Die Aussage über nur zwei verbleibende Tassen ist " +
      "falsch. Im kommerziellen Einsatz spricht dies für " +
      "Irreführung nach § 5 UWG, wenn die Angabe die " +
      "Kaufentscheidung beeinflussen kann. Eine zutreffende " +
      "Bestandsangabe ist grundsätzlich zulässig.",

    sources: [
      [
        "§ 5 UWG",
        "https://www.gesetze-im-internet.de/uwg_2004/__5.html"
      ]
    ]
  },

  newsletter: {
    status: "Einzelfallprüfung erforderlich",

    warning: false,

    text:
      "Ein Rabatt für ein transparent angebotenes " +
      "Newsletter-Abonnement ist nicht automatisch " +
      "unzulässig. Eine versteckte wesentliche Bedingung " +
      "kann § 5a UWG verletzen. Werbe-E-Mails erfordern " +
      "grundsätzlich vorherige ausdrückliche Einwilligung " +
      "(§ 7 UWG), mit begrenzter Bestandskundenausnahme. " +
      "Bei einwilligungsbasierter Datenverarbeitung gelten " +
      "zusätzlich die DSGVO-Anforderungen. Kleine Schrift " +
      "allein beweist keinen Verstoß.",

    sources: [
      [
        "§ 5a UWG",
        "https://www.gesetze-im-internet.de/uwg_2004/__5a.html"
      ],
      [
        "§ 7 UWG",
        "https://www.gesetze-im-internet.de/uwg_2004/__7.html"
      ],
      [
        "DSGVO: Artikel 4 Nr. 11 und 7",
        "https://eur-lex.europa.eu/eli/reg/2016/679/oj"
      ]
    ]
  },

  shaming: {
    status: "Manipulativ, aber nicht automatisch rechtswidrig",

    warning: false,

    text:
      "Die abwertende Formulierung allein beweist keinen " +
      "Rechtsverstoß. Nach § 4a UWG zählen die konkreten " +
      "Umstände und eine erhebliche Beeinträchtigung der " +
      "Entscheidungsfreiheit. Zusätzlicher Druck, wiederholte " +
      "Rückfragen oder Hindernisse können für die " +
      "Bewertung relevant sein.",

    sources: [
      [
        "§ 4a UWG",
        "https://www.gesetze-im-internet.de/uwg_2004/__4a.html"
      ]
    ]
  }
};

// Erzeugt den HTML-Abschnitt zur rechtlichen Einordnung.
// Die Inhalte stammen aus festen Texten, nicht aus Eingaben.
function legalHTML() {
  const note = legalNotes[scene];

  const links = note.sources
    .map(([title, url]) => {
      return `
        <a href="${url}" target="_blank" rel="noopener">
          ${title}
        </a>
      `;
    })
    .join(" · ");

  return `
    <div class="legal-box">
      <h3>Rechtliche Einordnung</h3>

      <span
        class="legal-status ${note.warning ? "warning" : ""}"
      >
        ${note.status}
      </span>

      <p>${note.text}</p>

      <p>
        <strong>Rechtsgrundlagen:</strong>
        ${links}
      </p>
    </div>
  `;
}

// --------------------------------------------------
// 4. Eine Shopvariante erzeugen
// fair = true: faire Variante
// fair = false: manipulative Variante
// --------------------------------------------------

function panel(fair) {
  let label;

  if (mode === "compare") {
    label = fair
      ? "Faire Gestaltung"
      : "Manipulative Gestaltung";
  } else {
    label = fair ? "Variante B" : "Variante A";
  }

  const subtitle =
    mode === "compare"
      ? "Gleicher Shop · andere Entscheidung"
      : "";

  let exampleContent = "";

  // Beispiel 1: Stückzahl.
  if (scene === "stock") {
    const stockText = fair
      ? "Auf Lager · Lieferzeit 3–5 Werktage"
      : "Nur noch 2 verfügbar! Schnell sichern.";

    const stockClass = fair ? "stock fair" : "stock";

    exampleContent = `
      <div class="${stockClass}">
        ${stockText}
      </div>

      <button class="primary full" data-action="buy">
        In den Warenkorb
      </button>
    `;
  } else {
    // Beispiele 2 und 3: Newsletter.
    let newsletterHeading;
    let newsletterDetails = "";

    if (fair) {
      newsletterHeading = `
        <h3>
          Newsletter abonnieren und 10 % Rabatt erhalten
        </h3>

        <p>
          Du erhältst etwa zwei E-Mails pro Monat.
          Abmelden ist jederzeit möglich.
        </p>
      `;
    } else {
      newsletterHeading = `
        <div class="discount">10 % FÜR DICH</div>
        <h3>Hol dir deinen Rabatt!</h3>
      `;

      if (scene === "newsletter") {
        // Die Bedingung steht absichtlich unauffällig da.
        newsletterDetails = `
          <p class="fine">
            Der Rabatt gilt bei Anmeldung zum E-Mail-Newsletter.
            Etwa zwei E-Mails pro Monat, jederzeit abmeldbar.
          </p>
        `;
      } else {
        // Hier liegt der Schwerpunkt auf Confirmshaming.
        newsletterDetails = `
          <p>
            Abonniere unseren Newsletter.
            Etwa zwei E-Mails pro Monat, jederzeit abmeldbar.
          </p>
        `;
      }
    }

    const acceptText = fair
      ? "Newsletter abonnieren"
      : "Ja, 10 % sichern!";

    let rejectText;

    if (fair) {
      rejectText = "Ohne Anmeldung weiter";
    } else if (scene === "shaming") {
      rejectText = "Nein, ich zahle lieber mehr.";
    } else {
      rejectText = "Ohne Rabatt weiter";
    }

    const buttonContainerClass = fair ? "equal" : "";
    const acceptClass = fair ? "" : "primary full";
    const rejectClass = fair ? "" : "reject";

    exampleContent = `
      <button class="primary full" data-action="buy">
        In den Warenkorb
      </button>

      <div class="newsletter">
        <div class="eyebrow">
          Dein Willkommensangebot
        </div>

        ${newsletterHeading}
        ${newsletterDetails}

        <div class="${buttonContainerClass}">
          <button
            class="${acceptClass}"
            data-action="accept"
          >
            ${acceptText}
          </button>

          <button
            class="${rejectClass}"
            data-action="reject"
          >
            ${rejectText}
          </button>
        </div>
      </div>
    `;
  }

  // Gemeinsamer Aufbau: Produkt und Bild bleiben gleich.
  return `
    <section>
      <div class="label">
        ${label}
        <span>${subtitle}</span>
      </div>

      <article class="shop">
        <div class="brand">
          <strong>Küstenfund</strong>
          <span>Kleine Dinge. Meer Freude.</span>
        </div>

        <div class="product">
          <div class="eyebrow">
            Die maritime Kollektion
          </div>

          <h2>Lieblingstasse „Meerzeit“</h2>

          <img
            class="product-image"
            src="tasse-pinguin.png"
            alt="Weiße Keramiktasse mit einem Pinguin am Meer und dunkelblauer Innenseite"
          >

          <p>
            Eine Pause mit Meerblick im Kopf.
            Keramiktasse, 350 ml, spülmaschinengeeignet.
          </p>

          <div class="price">18,90 €</div>

          <p class="fine">
            inkl. MwSt. · Versand 3,90 € · Gesamtpreis 22,80 €
          </p>

          ${exampleContent}

          <div class="feedback" role="status"></div>
        </div>
      </article>
    </section>
  `;
}

// --------------------------------------------------
// 5. Darstellung aktualisieren
// --------------------------------------------------

function render() {
  const stage = document.querySelector("#stage");

  stage.className =
    mode === "try" ? "stage single" : "stage";

  if (mode === "compare") {
    stage.innerHTML = panel(false) + panel(true);
  } else {
    stage.innerHTML = panel(fairSingle);
  }

  // Aktuelles Beispiel markieren.
  document.querySelectorAll("[data-scene]").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      button.dataset.scene === scene
    );
  });

  document.querySelector("#try").setAttribute(
    "aria-pressed",
    mode === "try"
  );

  document.querySelector("#compare").setAttribute(
    "aria-pressed",
    mode === "compare"
  );

  // Variantenwechsel nur in der Einzelansicht.
  const variantButton = document.querySelector("#variant");

  variantButton.hidden = mode !== "try";

  variantButton.textContent = fairSingle
    ? "Manipulative Variante zeigen"
    : "Faire Variante zeigen";

  const explanation = explanations[scene];

  let question;

  if (scene === "stock") {
    question =
      "Würdest du ohne den Knappheitshinweis anders entscheiden?";
  } else if (scene === "newsletter") {
    question =
      "Ist die Bedingung für den Rabatt ebenso leicht " +
      "erkennbar wie das Angebot?";
  } else {
    question =
      "Welche Ablehnungsformulierung lässt dir " +
      "mehr Entscheidungsfreiheit?";
  }

  const explanationBox = document.querySelector("#explanation");

  explanationBox.innerHTML = `
    <h3>${explanation[0]}</h3>
    <p>${explanation[1]}</p>
    <p>${explanation[2]}</p>

    <p>
      <strong>Diskussionsfrage:</strong>
      ${question}
    </p>

    ${legalHTML()}
  `;

  explanationBox.hidden = !explained;

  const explainButton = document.querySelector("#explain");

  explainButton.textContent = explained
    ? "Erklärung ausblenden"
    : "Erklärung anzeigen";

  explainButton.setAttribute("aria-expanded", explained);
}

// --------------------------------------------------
// 6. Auf Klicks reagieren
// --------------------------------------------------

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  // Neues Beispiel: wieder mit Variante A beginnen.
  // Erklärung dabei verbergen.
  if (button.dataset.scene) {
    scene = button.dataset.scene;
    fairSingle = false;
    explained = false;
    render();
  }

  // Shopaktionen sind reine Simulationen.
  else if (button.dataset.action) {
    const messages = {
      buy:
        "Simulation: Die Tasse wurde in den Warenkorb gelegt.",

      accept:
        "Simulation: Newsletter gewählt. " +
        "Es wurde nichts angemeldet.",

      reject:
        "Simulation: Du gehst ohne Newsletter weiter."
    };

    const product = button.closest(".product");
    const feedback = product.querySelector(".feedback");

    feedback.textContent = messages[button.dataset.action];
  }

  else if (button.id === "try") {
    mode = "try";
    fairSingle = false;
    render();
  }

  else if (button.id === "compare") {
    mode = "compare";
    render();
  }

  else if (button.id === "variant") {
    fairSingle = !fairSingle;
    render();
  }

  else if (button.id === "explain") {
    explained = !explained;
    render();
  }

  // Aktuelles Beispiel und Ansicht bleiben erhalten.
  // Erklärung und Rückmeldungen werden zurückgesetzt.
  else if (button.id === "reset") {
    fairSingle = false;
    explained = false;
    render();
  }
});

// Erste Shopansicht aufbauen.
render();