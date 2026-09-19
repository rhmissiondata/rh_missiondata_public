const state = {
  role: "rh",
  view: "dashboard",
  interviewStep: 1,
  conductStep: 1,
  scenario: "propose",
  interviewFilter: "Tous",
  needFilter: "Tous",
  decisions: {},
};

const initialView = window.location.hash.replace("#", "");
if (initialView) {
  state.view = initialView;
  if (initialView.startsWith("my-") || initialView === "employee-home") state.role = "employee";
}

const people = [
  { id: 1, initials: "SL", name: "Sophie Laurent", role: "Product designer", team: "Produit", date: "24 sept. 2026", relative: "dans 5 jours", type: "Périodique · 4 ans", status: "À planifier", tone: "coral", avatar: "avatar-coral" },
  { id: 2, initials: "MB", name: "Mehdi Benali", role: "Tech lead", team: "Engineering", date: "3 oct. 2026", relative: "dans 14 jours", type: "Mi-carrière", status: "Planifié", tone: "blue", avatar: "avatar-blue" },
  { id: 3, initials: "AC", name: "Ana Carvalho", role: "Account executive", team: "Sales", date: "18 oct. 2026", relative: "dans 29 jours", type: "Périodique · 4 ans", status: "Préparation", tone: "amber", avatar: "avatar-sand" },
  { id: 4, initials: "JR", name: "Julien Robert", role: "People operations", team: "RH", date: "6 nov. 2026", relative: "dans 48 jours", type: "Bilan · 8 ans", status: "À planifier", tone: "violet", avatar: "avatar-violet" },
  { id: 5, initials: "NK", name: "Nadia Khelifi", role: "Customer care", team: "Opérations", date: "12 nov. 2026", relative: "dans 54 jours", type: "Reprise d'activité", status: "Planifié", tone: "blue", avatar: "avatar-green" },
];

const needs = [
  { id: 1, title: "Leadership d'équipe", skill: "Management", source: "4 entretiens", people: 7, priority: "Haute", category: "Maintien dans l'emploi", amount: 12600, status: "À arbitrer", tone: "coral" },
  { id: 2, title: "Accessibilité numérique", skill: "Design inclusif", source: "3 entretiens", people: 5, priority: "Haute", category: "Adaptation au poste", amount: 7400, status: "Retenu", tone: "mint" },
  { id: 3, title: "Cybersécurité — fondamentaux", skill: "Sécurité", source: "Obligation entreprise", people: 32, priority: "Obligatoire", category: "Obligatoire / nécessaire", amount: 9600, status: "Retenu", tone: "mint" },
  { id: 4, title: "Anglais professionnel", skill: "Communication", source: "6 entretiens", people: 9, priority: "Moyenne", category: "Développement", amount: 10800, status: "À qualifier", tone: "amber" },
  { id: 5, title: "Data storytelling", skill: "Analyse de données", source: "2 entretiens", people: 4, priority: "Moyenne", category: "Développement", amount: 5200, status: "À arbitrer", tone: "blue" },
  { id: 6, title: "Excel avancé", skill: "Outils", source: "5 entretiens", people: 8, priority: "Basse", category: "Adaptation au poste", amount: 4800, status: "Reporté", tone: "gray" },
];

const icon = (name, cls = "") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const euro = value => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
const badge = (label, tone = "gray") => `<span class="badge badge-${tone}">${label}</span>`;
const personCell = person => `<div class="person-cell"><span class="avatar ${person.avatar}">${person.initials}</span><span><strong>${person.name}</strong><small>${person.role} · ${person.team}</small></span></div>`;

const rhNav = [
  { label: "Pilotage", items: [
    ["dashboard", "home", "Vue d'ensemble", ""],
    ["interviews", "calendar", "Entretiens", "12"],
    ["employees", "users", "Collaborateurs", ""],
  ]},
  { label: "Développement", items: [
    ["needs", "spark", "Besoins", "24"],
    ["plan", "target", "Plan de compétences", ""],
    ["arbitration", "check", "Arbitrages", "7"],
    ["budget", "wallet", "Budget", ""],
    ["tracking", "chart", "Réalisation", ""],
  ]},
  { label: "Configuration", items: [
    ["templates", "doc", "Trames", ""],
    ["compliance", "shield", "Conformité", "2"],
    ["settings", "settings", "Paramètres", ""],
  ]},
];

const employeeNav = [
  { label: "Mon espace", items: [
    ["employee-home", "home", "Mon accueil", ""],
    ["my-interview", "calendar", "Mon entretien", ""],
    ["my-training", "spark", "Mes demandes", "2"],
    ["my-documents", "doc", "Mes documents", ""],
  ]},
];

function renderNav() {
  const sections = state.role === "rh" ? rhNav : employeeNav;
  document.querySelector("#primary-nav").innerHTML = sections.map(section => `
    <div class="nav-section">
      <div class="nav-label">${section.label}</div>
      ${section.items.map(([view, iconName, label, count]) => `
        <button type="button" class="nav-item ${state.view === view ? "active" : ""}" data-nav="${view}">
          ${icon(iconName)}<span>${label}</span>${count ? `<span class="nav-count">${count}</span>` : ""}
        </button>`).join("")}
    </div>`).join("");
  document.querySelector(".profile-mini strong").textContent = state.role === "rh" ? "Claire Martin" : "Sophie Laurent";
  document.querySelector(".profile-mini small").textContent = state.role === "rh" ? "Responsable RH" : "Product designer";
  document.querySelector(".profile-mini .avatar").textContent = state.role === "rh" ? "CM" : "SL";
  document.querySelector(".top-avatar").textContent = state.role === "rh" ? "CM" : "SL";
  document.querySelector("#context-label").textContent = state.role === "rh" ? "Pilotage RH" : "Espace collaborateur";
}

function pageHead(eyebrow, title, subtitle, actions = "") {
  return `<div class="page-head"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="page-subtitle">${subtitle}</p></div>${actions ? `<div class="head-actions">${actions}</div>` : ""}</div>`;
}

function metric(label, value, foot, iconName, tone, trend = "") {
  return `<article class="metric-card"><div class="metric-top"><span class="metric-label">${label}</span><span class="metric-icon tone-${tone}">${icon(iconName)}</span></div><strong class="metric-value">${value}</strong><div class="metric-foot">${trend ? `<span class="metric-trend ${trend.includes("retard") ? "alert" : ""}">${trend}</span>` : ""}<span>${foot}</span></div></article>`;
}

function dashboardView() {
  const rows = people.slice(0,4).map(p => `<tr>
    <td>${personCell(p)}</td><td><span class="date-main">${p.date}</span><span class="date-sub">${p.relative}</span></td>
    <td>${p.type}</td><td>${badge(p.status, p.tone)}</td><td><button class="row-action" type="button" data-nav="employee-detail">Ouvrir</button></td>
  </tr>`).join("");
  return `
    ${pageHead("Vendredi 19 septembre 2026", "Bonjour Claire,", "Voici les priorités RH et formation qui demandent votre attention.", `<button class="btn btn-secondary" data-action="export">${icon("download")}Exporter</button><button class="btn btn-primary" data-nav="interview-form">${icon("plus")}Nouvel entretien</button>`)}
    <section class="notice-banner warning">
      <span class="notice-icon">${icon("clock")}</span><div><h3>3 échéances à quatre ans dans les 30 prochains jours</h3><p>La plus proche concerne Sophie Laurent, à organiser avant le 24 septembre.</p></div>
      <button class="btn btn-secondary" type="button" data-nav="interviews">Voir les échéances</button>
    </section>
    <section class="metrics-grid" aria-label="Indicateurs principaux">
      ${metric("Entretiens à réaliser", "12", "sur les 90 prochains jours", "calendar", "blue", "+3 ce mois")}
      ${metric("Taux de conformité", "92 %", "des dossiers à jour", "shield", "mint", "+4 points")}
      ${metric("Besoins à arbitrer", "24", "dont 7 prioritaires", "spark", "coral", "7 urgents")}
      ${metric("Budget proposé", "84,6 k€", "sur 120 k€ disponibles", "wallet", "amber", "71 %")}
    </section>
    <div class="dashboard-grid">
      <section class="card">
        <div class="card-head"><div><h2>Prochains entretiens</h2><p>Échéances légales et entretiens déjà planifiés</p></div><button class="card-link" data-nav="interviews">Tout afficher ${icon("arrow")}</button></div>
        <div class="table-wrap"><table class="data-table"><thead><tr><th>Collaborateur</th><th>Échéance</th><th>Motif</th><th>Statut</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
      </section>
      <div class="stack">
        <section class="card card-pad">
          <div class="card-head" style="padding:0 0 17px"><div><h2>Campagne 2026</h2><p>96 entretiens attendus</p></div>${badge("En cours", "blue")}</div>
          <div class="donut-block"><div class="donut" style="--value:78%"><div class="donut-label">78 %<small>terminés</small></div></div><div class="legend-list">
            <div class="legend-item"><span class="legend-dot" style="background:var(--mint)"></span><span>Terminés</span><strong>75</strong></div>
            <div class="legend-item"><span class="legend-dot" style="background:var(--blue)"></span><span>Planifiés</span><strong>12</strong></div>
            <div class="legend-item"><span class="legend-dot" style="background:var(--amber)"></span><span>À planifier</span><strong>7</strong></div>
            <div class="legend-item"><span class="legend-dot" style="background:var(--coral)"></span><span>En retard</span><strong>2</strong></div>
          </div></div>
        </section>
        <section class="card card-pad"><div class="card-head" style="padding:0 0 15px"><div><h2>Besoins émergents</h2><p>Issus des entretiens finalisés</p></div><button class="card-link" data-nav="needs">Analyser ${icon("arrow")}</button></div>
          <div class="insight-list">
            <div class="insight"><span class="insight-icon tone-coral">01</span><span><strong>Leadership d'équipe</strong><small>7 personnes · 4 équipes</small></span><strong>7</strong></div>
            <div class="insight"><span class="insight-icon tone-blue">02</span><span><strong>Anglais professionnel</strong><small>9 personnes · 3 équipes</small></span><strong>9</strong></div>
            <div class="insight"><span class="insight-icon tone-mint">03</span><span><strong>Accessibilité numérique</strong><small>5 personnes · Produit</small></span><strong>5</strong></div>
          </div>
        </section>
      </div>
    </div>`;
}

function interviewsView() {
  const all = [...people, { id: 6, initials: "TD", name: "Thomas Dubois", role: "Data analyst", team: "Data", date: "4 sept. 2026", relative: "15 jours de retard", type: "Périodique · 4 ans", status: "En retard", tone: "coral", avatar: "avatar-blue" }];
  const rows = all.map(p => `<tr><td>${personCell(p)}</td><td>${p.type}</td><td><span class="date-main">${p.date}</span><span class="date-sub">${p.relative}</span></td><td>${badge(p.status, p.tone)}</td><td>${p.status === "En retard" ? badge("Risque", "coral") : badge("Règle vérifiée", "mint")}</td><td><button class="row-action" data-nav="employee-detail">Consulter</button></td></tr>`).join("");
  return `${pageHead("Entretiens", "Suivi des échéances", "Anticipez les entretiens initiaux, périodiques, de reprise, de mi-carrière et les bilans à huit ans.", `<button class="btn btn-secondary" data-action="export">${icon("download")}Exporter</button><button class="btn btn-primary" data-nav="interview-form">${icon("plus")}Planifier</button>`)}
    <section class="notice-banner"><span class="notice-icon">${icon("calendar")}</span><div><h3>Le prochain cycle à quatre ans est calculé automatiquement</h3><p>Dernier entretien + 4 ans, avec priorité donnée aux accords plus favorables et conservation de la règle appliquée.</p></div><button class="btn btn-secondary" data-nav="compliance">Voir la règle</button></section>
    <div class="filters"><div class="search-field">${icon("search")}<input aria-label="Rechercher un collaborateur" placeholder="Rechercher un collaborateur…"></div><select class="filter-select" aria-label="Filtrer par motif"><option>Tous les motifs</option><option>Périodique · 4 ans</option><option>Mi-carrière</option><option>Bilan · 8 ans</option></select><select class="filter-select" aria-label="Filtrer par statut"><option>Tous les statuts</option><option>À planifier</option><option>En retard</option></select><button class="btn btn-secondary btn-sm">${icon("filter")}Plus de filtres</button></div>
    <section class="card"><div class="card-head"><div><h2>96 entretiens sur l'exercice</h2><p>6 éléments nécessitent une action dans les 60 jours</p></div><div class="segmented"><button class="active">Tous</button><button>À planifier</button><button>En retard</button><button>Terminés</button></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Collaborateur</th><th>Motif</th><th>Échéance</th><th>Statut</th><th>Conformité</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
}

function employeesView() {
  const rows = people.map((p, index) => `<tr><td>${personCell(p)}</td><td>${index % 2 ? "CDI · 3 ans" : "CDI · 6 ans"}</td><td>${index % 2 ? "10 juin 2023" : "24 sept. 2022"}</td><td>${p.date}</td><td>${badge(index === 0 ? "Action requise" : "À jour", index === 0 ? "coral" : "mint")}</td><td><button class="row-action" data-nav="employee-detail">Ouvrir</button></td></tr>`).join("");
  return `${pageHead("Collaborateurs", "Parcours collaborateurs", "Une vue consolidée des échéances, formations, souhaits et actions de développement.", `<button class="btn btn-secondary">${icon("download")}Importer CSV</button><button class="btn btn-primary">${icon("plus")}Ajouter</button>`)}
    <div class="filters"><div class="search-field">${icon("search")}<input aria-label="Rechercher" placeholder="Nom, équipe ou poste…"></div><select class="filter-select"><option>Toutes les équipes</option><option>Produit</option><option>Engineering</option></select><select class="filter-select"><option>Tous les risques</option><option>Action requise</option><option>À jour</option></select></div>
    <section class="card"><div class="table-wrap"><table class="data-table"><thead><tr><th>Collaborateur</th><th>Contrat & ancienneté</th><th>Dernier entretien</th><th>Prochaine échéance</th><th>Situation</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
}

function employeeDetailView() {
  return `${pageHead("Collaborateurs / Sophie Laurent", "", "", `<button class="btn btn-secondary" data-nav="employees">Retour à la liste</button>`)}
    <section class="profile-banner"><span class="avatar avatar-coral">SL</span><div><h1>Sophie Laurent</h1><p>Product designer · Équipe Produit · Paris</p><div class="profile-meta"><span>CDI depuis le 24 sept. 2020</span><span>Manager : Lucas Morel</span><span>Matricule C-0048</span></div></div><div class="profile-actions"><button class="btn btn-secondary" data-nav="interview-form">Préparer</button><button class="btn" data-nav="conduct-interview">Conduire l'entretien</button></div></section>
    <div class="profile-grid"><div class="stack">
      <section class="card deadline-card"><div class="deadline-top"><div><p class="eyebrow">Prochaine obligation</p><h2>Entretien périodique à quatre ans</h2><p class="page-subtitle">Calculé depuis le dernier entretien réalisé le 24 septembre 2022.</p></div><div class="deadline-date"><strong>24 sept. 2026</strong><small>dans 5 jours</small></div></div><div class="progress coral" aria-label="Échéance proche"><span style="--progress:94%"></span></div><div class="milestone-track"><div class="milestone done"><strong>2022</strong>Entretien</div><div class="milestone done"><strong>2023</strong>Suivi</div><div class="milestone done"><strong>2024</strong>Formation</div><div class="milestone done"><strong>2025</strong>Évolution</div><div class="milestone current"><strong>2026</strong>Échéance</div></div></section>
      <section class="card"><div class="card-head"><div><h2>Chronologie du parcours</h2><p>Éléments utiles au prochain entretien</p></div><button class="card-link">Ajouter un élément ${icon("plus")}</button></div><div class="timeline">
        <div class="timeline-item"><span class="timeline-mark tone-mint">${icon("check")}</span><span class="timeline-body"><strong>Formation « Concevoir accessible »</strong><small>14 h · Certification interne obtenue</small></span><span class="timeline-date">mai 2025</span></div>
        <div class="timeline-item"><span class="timeline-mark tone-blue">${icon("spark")}</span><span class="timeline-body"><strong>Évolution vers Product designer</strong><small>Mobilité interne depuis l'équipe Brand</small></span><span class="timeline-date">janv. 2024</span></div>
        <div class="timeline-item"><span class="timeline-mark tone-violet">${icon("doc")}</span><span class="timeline-body"><strong>Entretien professionnel finalisé</strong><small>Compte rendu remis et reçu</small></span><span class="timeline-date">sept. 2022</span></div>
      </div></section>
    </div><aside class="stack">
      <section class="card card-pad"><h3>État du dossier</h3><div class="check-list"><div class="check-row"><span class="check-icon">${icon("check")}</span><span><strong>Règle vérifiée</strong><small>L. 6315-1 · périodicité 4 ans</small></span>${badge("OK", "mint")}</div><div class="check-row"><span class="check-icon">${icon("check")}</span><span><strong>Conducteur affecté</strong><small>Lucas Morel</small></span>${badge("OK", "mint")}</div><div class="check-row"><span class="check-icon tone-amber">${icon("clock")}</span><span><strong>Créneau à confirmer</strong><small>Proposition envoyée</small></span>${badge("À faire", "amber")}</div></div></section>
      <section class="card card-pad"><h3>Besoins de développement</h3><div class="request-row"><span class="request-icon tone-coral">${icon("spark")}</span><span><strong>Accessibilité numérique</strong><small>Issu de l'entretien 2022</small></span>${badge("Réalisé", "mint")}</div><div class="request-row"><span class="request-icon tone-blue">${icon("spark")}</span><span><strong>Facilitation d'ateliers</strong><small>Souhait 2026</small></span>${badge("Brouillon", "gray")}</div></section>
    </aside></div>`;
}

function interviewStepper() {
  const labels = ["Contexte", "Parcours", "Compétences", "Besoins", "Synthèse"];
  return `<div class="stepper" aria-label="Progression de l'entretien">${labels.map((label, i) => { const n=i+1; return `<div class="step ${n < state.interviewStep ? "done" : n === state.interviewStep ? "active" : ""}"><span>${n < state.interviewStep ? icon("check") : n}</span>${label}</div>`; }).join("")}</div>`;
}

function interviewStepContent() {
  if (state.interviewStep === 1) return `<div class="form-section-head"><p class="eyebrow">Étape 1 sur 5</p><h2>Contexte de l'entretien</h2><p>Vérifiez les informations et le motif légal avant de commencer.</p></div><div class="form-grid"><div class="field"><label for="date">Date de l'entretien</label><input id="date" type="date" value="2026-09-23"></div><div class="field"><label for="format">Modalité</label><select id="format"><option>En présentiel</option><option>À distance</option></select></div><div class="field"><label for="manager">Conducteur</label><input id="manager" value="Lucas Morel — Head of Design"></div><div class="field"><label for="reason">Motif principal</label><select id="reason"><option>Entretien périodique — 4 ans</option><option>Mi-carrière</option></select></div><div class="field full"><div class="helper">${icon("shield")}<span>Cet entretien est consacré au parcours et aux perspectives d'évolution. Il ne porte pas sur l'évaluation du travail de Sophie.</span></div></div></div>`;
  if (state.interviewStep === 2) return `<div class="form-section-head"><p class="eyebrow">Étape 2 sur 5</p><h2>Parcours et perspectives</h2><p>Partez des faits, puis faites émerger les souhaits de la collaboratrice.</p></div><div class="form-grid"><div class="field full"><label for="path">Évolutions depuis le dernier entretien</label><textarea id="path">Mobilité interne vers le poste de Product designer en janvier 2024. Prise en charge progressive des ateliers de recherche utilisateur.</textarea></div><div class="field full"><label for="strengths">Compétences et qualifications mobilisées</label><textarea id="strengths" placeholder="Décrivez les compétences mobilisées et leur évolution…">Recherche utilisateur, prototypage, design d'interface et facilitation.</textarea></div><div class="field"><label for="short">Souhaits à court terme</label><textarea id="short" placeholder="Dans les 6 à 12 mois…"></textarea></div><div class="field"><label for="medium">Souhaits à moyen terme</label><textarea id="medium" placeholder="Dans les 2 à 4 ans…"></textarea></div></div>`;
  if (state.interviewStep === 3) return `<div class="form-section-head"><p class="eyebrow">Étape 3 sur 5</p><h2>Compétences à développer</h2><p>Cette cartographie décrit un besoin de développement ; elle ne constitue pas une note de performance.</p></div>${["Design inclusif|Concevoir des expériences accessibles à tous", "Facilitation|Préparer et animer des ateliers collectifs", "Stratégie produit|Relier les choix de design aux enjeux métier"].map((item, idx) => { const [title,desc]=item.split("|"); return `<div class="competency"><div class="competency-head"><span><strong>${title}</strong><small>${desc}</small></span>${idx===0?badge("Besoin identifié","amber"):""}</div><div class="choice-grid" role="radiogroup" aria-label="Niveau pour ${title}">${["À découvrir","En acquisition","Autonome","Maîtrisé"].map((level,i)=>`<div class="choice"><input type="radio" name="skill-${idx}" id="skill-${idx}-${i}" ${i === (idx===0?1:2) ? "checked" : ""}><label for="skill-${idx}-${i}"><strong>${i+1}. ${level}</strong><small>${["Premiers repères","Pratique accompagnée","Pratique régulière","Capacité à transmettre"][i]}</small></label></div>`).join("")}</div></div>`; }).join("")}`;
  if (state.interviewStep === 4) return `<div class="form-section-head"><p class="eyebrow">Étape 4 sur 5</p><h2>Besoin de développement</h2><p>Formalisez une fiche structurée qui pourra alimenter le plan de l'entreprise.</p></div><div class="form-grid"><div class="field full"><label for="need-title">Compétence ou résultat visé</label><input id="need-title" value="Faciliter des ateliers de co-conception accessibles"></div><div class="field"><label for="need-category">Catégorie</label><select id="need-category"><option>Adaptation au poste</option><option>Maintien dans l'emploi</option><option>Développement</option></select></div><div class="field"><label for="need-deadline">Échéance souhaitée</label><select id="need-deadline"><option>1er semestre 2027</option><option>2e semestre 2027</option></select></div><div class="field"><label for="need-mode">Modalité envisagée</label><select id="need-mode"><option>Formation + mise en pratique</option><option>AFEST</option><option>Tutorat</option></select></div><div class="field"><label for="need-priority">Priorité proposée</label><select id="need-priority"><option>Haute</option><option>Moyenne</option><option>Basse</option></select></div><div class="field full"><label for="need-result">Résultat attendu</label><textarea id="need-result">Préparer et animer en autonomie un atelier de co-conception de 8 à 12 participants en respectant les principes d'accessibilité.</textarea><small>Cette formulation structurée sera transmise au responsable formation. Les autres commentaires de l'entretien ne le seront pas.</small></div><div class="field full"><div class="helper">${icon("shield")}<span>Sophie sera informée que ce besoin alimente la préparation du plan. Son expression ne vaut pas encore acceptation ni inscription.</span></div></div></div>`;
  return `<div class="form-section-head"><p class="eyebrow">Étape 5 sur 5</p><h2>Synthèse avant finalisation</h2><p>Relisez avec la collaboratrice les éléments qui figureront dans le compte rendu.</p></div><div class="check-list"><div class="check-row"><span class="check-icon">${icon("check")}</span><span><strong>Parcours et évolutions</strong><small>Mobilité 2024 et nouvelles missions renseignées</small></span><button class="row-action" data-step="2">Modifier</button></div><div class="check-row"><span class="check-icon">${icon("check")}</span><span><strong>Compétences</strong><small>3 compétences abordées, 1 besoin prioritaire</small></span><button class="row-action" data-step="3">Modifier</button></div><div class="check-row"><span class="check-icon">${icon("check")}</span><span><strong>Besoin transmis au plan</strong><small>Facilitation d'ateliers · 1er semestre 2027</small></span><button class="row-action" data-step="4">Modifier</button></div><div class="check-row"><span class="check-icon">${icon("check")}</span><span><strong>CPF, abondements et CEP</strong><small>Informations présentées le 23 septembre 2026</small></span>${badge("Complet","mint")}</div></div><div class="field full" style="margin-top:20px"><label for="final-comment">Commentaire final de la collaboratrice</label><textarea id="final-comment" placeholder="Sophie peut ajouter une observation qui figurera dans le compte rendu…"></textarea></div>`;
}

function interviewFormView() {
  return `${pageHead("Entretien périodique · 4 ans", "Préparer l'entretien de Sophie", "Échéance légale : 24 septembre 2026 · Brouillon sauvegardé", `<button class="btn btn-secondary" data-nav="employee-detail">Quitter le brouillon</button>`)}${interviewStepper()}<div class="form-layout"><section class="card form-card">${interviewStepContent()}<div class="form-footer"><button class="btn btn-secondary" type="button" data-action="prev-step" ${state.interviewStep===1?"disabled":""}>Précédent</button>${state.interviewStep<5?`<button class="btn btn-primary" type="button" data-action="next-step">Continuer ${icon("arrow")}</button>`:`<button class="btn btn-primary" type="button" data-nav="report">Prévisualiser le compte rendu ${icon("arrow")}</button>`}</div></section><aside class="card side-summary"><h3>Dossier d'entretien</h3><div class="summary-person"><span class="avatar avatar-coral">SL</span><span><strong>Sophie Laurent</strong><small>Product designer</small></span></div><div class="summary-meta"><div class="summary-line"><span>Motif</span><strong>Périodique · 4 ans</strong></div><div class="summary-line"><span>Dernier entretien</span><strong>24 sept. 2022</strong></div><div class="summary-line"><span>Conducteur</span><strong>Lucas Morel</strong></div><div class="summary-line"><span>Complétude</span><strong>${state.interviewStep * 20} %</strong></div></div><div class="progress blue"><span style="--progress:${state.interviewStep * 20}%"></span></div><div class="autosave">Dernière sauvegarde à l'instant</div></aside></div>`;
}

function conductStepper() {
  const labels = ["Ouverture", "Parcours", "Compétences", "Projet", "Formation", "Synthèse"];
  return `<div class="stepper meeting-stepper" aria-label="Progression de la trame en entretien">${labels.map((label, i) => { const n=i+1; return `<div class="step ${n < state.conductStep ? "done" : n === state.conductStep ? "active" : ""}"><span>${n < state.conductStep ? icon("check") : n}</span>${label}</div>`; }).join("")}</div>`;
}

function conductStepContent() {
  if (state.conductStep === 1) return `<div class="form-section-head"><p class="eyebrow">Trame · 1 sur 6</p><h2>Ouvrir l'entretien</h2><p>Rappelez le cadre, vérifiez les participants et recueillez les attentes.</p></div><div class="form-grid"><div class="field"><label>Date et heure</label><input value="23/09/2026 · 10:00"></div><div class="field"><label>Modalité</label><select><option>En présentiel — Salle Atlas</option><option>À distance</option></select></div><div class="field full"><div class="helper">${icon("shield")}<span>« Cet échange porte sur votre parcours, vos compétences et vos perspectives. Il ne constitue pas une évaluation de votre travail. »</span></div></div><div class="field full"><label for="meeting-expectations">Attentes exprimées en début d'entretien</label><textarea id="meeting-expectations" placeholder="Saisissez les attentes formulées par Sophie…">Faire le point sur mon évolution vers un rôle de référente design inclusif et identifier les moyens de développer la facilitation.</textarea></div></div>`;
  if (state.conductStep === 2) return `<div class="form-section-head"><p class="eyebrow">Trame · 2 sur 6</p><h2>Parcours depuis le dernier entretien</h2><p>La préparation de Sophie sert de point de départ. La synthèse convenue est enregistrée séparément.</p></div><div class="prepared-answer"><div><span class="avatar avatar-coral">SL</span><strong>Préparation de Sophie</strong></div><p>« J'ai rejoint l'équipe Produit en 2024. Je mène maintenant les phases de recherche et j'anime ponctuellement des ateliers avec les équipes métier. »</p></div><div class="form-grid"><div class="field full"><label for="meeting-path">Synthèse partagée du parcours</label><textarea id="meeting-path">Mobilité interne vers le poste de Product designer en janvier 2024. Élargissement des missions à la recherche utilisateur et à l'animation ponctuelle d'ateliers transverses.</textarea><small>Cette zone figurera dans le compte rendu remis à Sophie.</small></div><div class="field"><label>Progression professionnelle</label><select><option>Oui — mobilité horizontale</option><option>Oui — progression verticale</option><option>Non</option></select></div><div class="field"><label>Progression salariale</label><select><option>Information disponible dans le SIRH</option><option>Oui</option><option>Non</option></select></div></div>`;
  if (state.conductStep === 3) return `<div class="form-section-head"><p class="eyebrow">Trame · 3 sur 6</p><h2>Compétences et transformations</h2><p>Comparez les perceptions pour identifier les besoins de développement, sans créer de note de performance.</p></div><div class="live-skill-table"><div class="live-skill-head"><span>Compétence</span><span>Préparation salarié</span><span>Discussion</span></div>${[["Design inclusif","En acquisition","En acquisition"],["Facilitation","En acquisition","À développer"],["Stratégie produit","Autonome","Autonome"]].map(([skill,self,shared])=>`<div class="live-skill-row"><span><strong>${skill}</strong><small>Référentiel Design 2026</small></span><span>${badge(self,"blue")}</span><span><select aria-label="Niveau discuté pour ${skill}"><option>${shared}</option><option>À découvrir</option><option>En acquisition</option><option>Autonome</option><option>Maîtrisé</option></select></span></div>`).join("")}</div><div class="field full" style="margin-top:18px"><label for="transformation">Évolutions du métier ou de l'entreprise à anticiper</label><textarea id="transformation" placeholder="Décrivez les transformations et leurs effets possibles…">Renforcement des exigences d'accessibilité et développement des ateliers associant utilisateurs, produit et métiers.</textarea></div>`;
  if (state.conductStep === 4) return `<div class="form-section-head"><p class="eyebrow">Trame · 4 sur 6</p><h2>Projet et perspectives</h2><p>Formalisez les souhaits de Sophie et les observations de l'entreprise sans les transformer en engagement automatique.</p></div><div class="prepared-answer"><div><span class="avatar avatar-coral">SL</span><strong>Souhait préparé</strong></div><p>« Devenir référente design inclusif et animer davantage d'ateliers transverses. »</p></div><div class="form-grid"><div class="field"><label>À court terme — souhait du salarié</label><textarea>Conduire en autonomie les ateliers de co-conception du prochain projet.</textarea></div><div class="field"><label>Observation de l'entreprise</label><textarea>Projet cohérent avec les besoins de l'équipe Produit. Une première mise en situation peut être organisée au S1 2027.</textarea></div><div class="field"><label>À moyen terme — souhait du salarié</label><textarea>Évoluer vers un rôle de référente design inclusif.</textarea></div><div class="field"><label>Observation de l'entreprise</label><textarea>À étudier avec la feuille de route accessibilité 2027–2028.</textarea></div><div class="field"><label>Mobilité envisagée</label><select><option>Pas de mobilité à court terme</option><option>Mobilité métier</option><option>Mobilité géographique</option></select></div><div class="field"><label>Dispositif à explorer</label><select><option>Aucun pour le moment</option><option>VAE</option><option>Bilan de compétences</option><option>CEP</option></select></div></div>`;
  if (state.conductStep === 5) return `<div class="form-section-head"><p class="eyebrow">Trame · 5 sur 6</p><h2>Formation et développement</h2><p>Créez le besoin structuré qui alimentera le plan, puis confirmez les informations obligatoires.</p></div><div class="training-need-live"><div class="training-need-title"><span class="metric-icon tone-mint">${icon("spark")}</span><div><strong>Faciliter des ateliers de co-conception accessibles</strong><small>Besoin formulé pendant l'entretien</small></div>${badge("À transmettre","blue")}</div><div class="form-grid"><div class="field"><label>Catégorie</label><select><option>Adaptation au poste</option><option>Maintien dans l'emploi</option><option>Développement</option></select></div><div class="field"><label>Échéance</label><select><option>1er semestre 2027</option><option>2e semestre 2027</option></select></div><div class="field"><label>Modalité envisagée</label><select><option>Formation + mise en pratique</option><option>AFEST</option><option>Tutorat</option></select></div><div class="field"><label>Priorité proposée</label><select><option>Haute</option><option>Moyenne</option><option>Basse</option></select></div><div class="field full"><label>Résultat attendu</label><textarea>Préparer et animer en autonomie un atelier accessible de 8 à 12 participants.</textarea></div></div></div><div class="info-checks"><label><input type="checkbox" checked> CPF et activation présentés</label><label><input type="checkbox" checked> Abondements possibles présentés</label><label><input type="checkbox" checked> CEP présenté</label></div>`;
  return `<div class="form-section-head"><p class="eyebrow">Trame · 6 sur 6</p><h2>Plan d'action et conclusion</h2><p>Attribuez les responsabilités, fixez les échéances et relisez la synthèse avec Sophie.</p></div><div class="action-editor"><div class="action-editor-row action-editor-head"><span>Action</span><span>Responsable</span><span>Échéance</span><span>Statut</span></div><div class="action-editor-row"><input value="Identifier une formation de facilitation accessible"><select><option>Responsable formation</option><option>Manager</option></select><input value="15/12/2026"><select><option>À lancer</option><option>En cours</option></select></div><div class="action-editor-row"><input value="Co-animer un atelier pilote"><select><option>Sophie Laurent</option><option>Manager</option></select><input value="31/03/2027"><select><option>À lancer</option><option>En cours</option></select></div></div><button class="btn btn-secondary btn-sm" style="margin:10px 0 20px">${icon("plus")}Ajouter une action</button><div class="form-grid"><div class="field"><label>Commentaire de Sophie</label><textarea placeholder="Commentaire final de la collaboratrice…"></textarea></div><div class="field"><label>Commentaire du conducteur</label><textarea placeholder="Commentaire final du conducteur…"></textarea></div><div class="field full"><div class="helper">${icon("doc")}<span>La prochaine étape génère le projet de compte rendu. Il pourra être relu avant finalisation et remise d'une copie.</span></div></div></div>`;
}

function conductInterviewView() {
  const percent = Math.round((state.conductStep / 6) * 100);
  return `${pageHead("Entretien en cours", "Conduire l'entretien de Sophie", "Trame partagée · Enregistrement automatique · 23 septembre 2026", `<span class="live-chip"><i></i>En cours · 00:37:12</span><button class="btn btn-secondary" data-action="pause-meeting">Mettre en pause</button>`)}<section class="notice-banner"><span class="notice-icon">${icon("doc")}</span><div><h3>Vous renseignez le futur compte rendu</h3><p>Les réponses préparées sont affichées séparément. Seules les synthèses partagées et les décisions confirmées seront enregistrées dans le document final.</p></div>${badge("Autosauvegarde active","mint")}</section>${conductStepper()}<div class="form-layout"><section class="card form-card">${conductStepContent()}<div class="form-footer"><button class="btn btn-secondary" data-action="conduct-prev" ${state.conductStep===1?"disabled":""}>Précédent</button>${state.conductStep<6?`<button class="btn btn-primary" data-action="conduct-next">Enregistrer et continuer ${icon("arrow")}</button>`:`<button class="btn btn-primary" data-nav="report">Terminer et générer la synthèse ${icon("arrow")}</button>`}</div></section><aside class="card side-summary meeting-outline"><h3>Trame de l'entretien</h3>${["Cadre et attentes","Parcours depuis 2022","Compétences","Projet professionnel","Formation, CPF et CEP","Actions et conclusion"].map((label,i)=>`<button type="button" class="meeting-section-item ${i+1===state.conductStep?"active":""} ${i+1<state.conductStep?"done":""}" data-conduct-step="${i+1}"><span>${i+1<state.conductStep?icon("check"):i+1}</span>${label}</button>`).join("")}<div class="summary-meta"><div class="summary-line"><span>Complétude</span><strong>${percent} %</strong></div><div class="summary-line"><span>Participants</span><strong>Sophie & Lucas</strong></div></div><div class="progress blue"><span style="--progress:${percent}%"></span></div><div class="autosave">Enregistré à l'instant</div></aside></div>`;
}

function reportView() {
  return `${pageHead("Compte rendu", "Relire et remettre la copie", "Version de prévisualisation · Aucun document n'est encore envoyé.", `<button class="btn btn-secondary" data-nav="interview-form">Modifier</button><button class="btn btn-primary" data-action="finalize">${icon("check")}Finaliser et remettre</button>`)}<div class="form-layout"><article class="card form-card"><div style="display:flex;justify-content:space-between;gap:20px;border-bottom:2px solid var(--navy);padding-bottom:18px;margin-bottom:22px"><div><p class="eyebrow">Parcours RH</p><h2 style="font-size:23px;margin:0">Compte rendu d'entretien de parcours professionnel</h2></div>${badge("Projet","amber")}</div><div class="form-grid"><div><small class="eyebrow">Collaboratrice</small><h3>Sophie Laurent</h3><p class="page-subtitle">Product designer · CDI depuis le 24/09/2020</p></div><div><small class="eyebrow">Entretien</small><h3>23 septembre 2026</h3><p class="page-subtitle">Périodique · Échéance à quatre ans</p></div></div><div class="drawer-section"><h3>Parcours depuis le dernier entretien</h3><p>Mobilité interne vers le poste de Product designer en janvier 2024. Prise en charge progressive des ateliers de recherche utilisateur.</p></div><div class="drawer-section"><h3>Compétences et perspectives</h3><p>Consolider la facilitation et développer la capacité à conduire des ateliers de co-conception accessibles. À moyen terme, Sophie souhaite devenir référente sur les pratiques de design inclusif.</p></div><div class="drawer-section"><h3>Besoin transmis à la préparation du plan</h3><div class="action-row"><span class="action-color" style="background:var(--mint)"></span><span><strong>Faciliter des ateliers de co-conception accessibles</strong><small>Adaptation au poste · Priorité haute · S1 2027</small></span>${badge("Exprimé","blue")}</div></div><div class="drawer-section"><h3>Informations présentées</h3><p>Activation du CPF, abondements susceptibles d'être financés par l'employeur et conseil en évolution professionnelle.</p></div><div class="helper">${icon("doc")}<span>La finalisation créera un PDF versionné. L'accusé de réception attestera uniquement de la remise, sans valoir accord sur le contenu.</span></div></article><aside class="card side-summary"><h3>Contrôles avant remise</h3><div class="check-list"><div class="check-row"><span class="check-icon">${icon("check")}</span><span><strong>5 thèmes légaux</strong><small>Tous complétés</small></span></div><div class="check-row"><span class="check-icon">${icon("check")}</span><span><strong>Aucune évaluation</strong><small>Contrôle de la trame réussi</small></span></div><div class="check-row"><span class="check-icon">${icon("check")}</span><span><strong>Besoin structuré</strong><small>Prêt à transmettre au plan</small></span></div></div><div class="summary-meta"><div class="summary-line"><span>Version</span><strong>Projet 1</strong></div><div class="summary-line"><span>Format</span><strong>PDF accessible</strong></div></div><button class="btn btn-secondary" style="width:100%">${icon("download")}Télécharger l'aperçu</button></aside></div>`;
}

function needsView() {
  const rows = needs.map(n => `<tr><td><input type="checkbox" class="need-check" aria-label="Sélectionner ${n.title}"></td><td><strong>${n.title}</strong><span class="date-sub">${n.skill}</span></td><td>${n.source}</td><td>${n.people} personnes</td><td>${badge(n.category, n.category.includes("Obligatoire")?"coral":"blue")}</td><td>${badge(n.status, n.tone)}</td><td><button class="row-action" data-need="${n.id}">Ouvrir</button></td></tr>`).join("");
  return `${pageHead("Développement", "Besoins à consolider", "Capitalisez sur les entretiens et rapprochez les demandes similaires avant arbitrage.", `<button class="btn btn-secondary">${icon("download")}Importer</button><button class="btn btn-primary" data-action="new-need">${icon("plus")}Ajouter un besoin</button>`)}
    <section class="metrics-grid">${metric("Besoins collectés","48","sur l'exercice 2027","spark","blue","+12 ce mois")}${metric("À qualifier","11","informations à compléter","clock","amber","")}${metric("Cohortes possibles","6","regroupements suggérés","users","mint","")}${metric("À arbitrer","24","budget estimé 58,4 k€","check","coral","7 prioritaires")}</section>
    <section class="need-grid"><article class="need-card"><div class="need-card-top"><span class="metric-icon tone-coral">${icon("target")}</span>${badge("Prioritaire","coral")}</div><span class="need-count">7</span><h3>Leadership d'équipe</h3><p>4 entretiens · 4 équipes</p><div class="progress coral"><span style="--progress:82%"></span></div></article><article class="need-card"><div class="need-card-top"><span class="metric-icon tone-mint">${icon("users")}</span>${badge("Cohorte","mint")}</div><span class="need-count">5</span><h3>Accessibilité numérique</h3><p>3 entretiens · Produit</p><div class="progress"><span style="--progress:68%"></span></div></article><article class="need-card"><div class="need-card-top"><span class="metric-icon tone-blue">${icon("spark")}</span>${badge("À qualifier","blue")}</div><span class="need-count">9</span><h3>Anglais professionnel</h3><p>6 entretiens · 3 équipes</p><div class="progress blue"><span style="--progress:55%"></span></div></article></section>
    <div class="filters"><div class="search-field">${icon("search")}<input placeholder="Compétence, besoin ou collaborateur…" aria-label="Rechercher un besoin"></div><select class="filter-select"><option>Toutes les sources</option><option>Entretiens</option><option>Obligations</option></select><select class="filter-select"><option>Toutes les catégories</option><option>Adaptation au poste</option><option>Développement</option></select><button class="btn btn-secondary btn-sm" data-action="group-selected">${icon("users")}Regrouper la sélection</button></div>
    <section class="card"><div class="table-wrap"><table class="data-table"><thead><tr><th></th><th>Besoin</th><th>Origine</th><th>Population</th><th>Catégorie</th><th>Statut</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
}

const scenarios = {
  demande: { total: 112400, participants: 74, actions: 18, remain: 7600, pct: 94 },
  propose: { total: 84600, participants: 61, actions: 14, remain: 35400, pct: 71 },
  approuve: { total: 68200, participants: 52, actions: 11, remain: 51800, pct: 57 },
};

function planView() {
  const s = scenarios[state.scenario];
  return `${pageHead("Plan 2027", "Plan de développement des compétences", "Construisez un scénario explicable à partir des besoins consolidés et des obligations.", `<button class="btn btn-secondary">${icon("download")}Exporter le plan</button><button class="btn btn-primary" data-nav="arbitration">Soumettre à l'arbitrage ${icon("arrow")}</button>`)}
    <div class="scenario-bar"><div><strong>Comparer les scénarios</strong><span class="date-sub">Les montants estimés ne sont pas présentés comme engagés.</span></div><div class="segmented" data-scenario><button data-scenario="demande" class="${state.scenario==='demande'?'active':''}">Demandé</button><button data-scenario="propose" class="${state.scenario==='propose'?'active':''}">Proposé</button><button data-scenario="approuve" class="${state.scenario==='approuve'?'active':''}">Approuvé</button></div></div>
    <section class="plan-hero"><div class="plan-total"><small>Budget ${state.scenario}</small><strong>${euro(s.total)}</strong><span>sur une enveloppe de 120 000 €</span></div><div><small>Actions</small><strong>${s.actions}</strong><span>dont 3 obligatoires</span></div><div><small>Participants</small><strong>${s.participants}</strong><span>42 % de l'effectif</span></div><div><small>Disponible</small><strong>${euro(s.remain)}</strong><span>${100-s.pct} % de l'enveloppe</span></div></section>
    <div class="plan-grid"><div class="stack"><section class="card card-pad"><div class="card-head" style="padding:0 0 15px"><div><h2>Répartition par axe</h2><p>Budget brut estimé</p></div><button class="card-link" data-nav="budget">Détail du budget ${icon("arrow")}</button></div><div class="axis-list">
      ${[["Obligations & sécurité",9600,32,18,"coral"],["Transformation des métiers",28600,21,34,"blue"],["Management & leadership",24400,12,29,"violet"],["Développement individuel",22000,18,26,"mint"]].map(([label,amount,count,pct,tone])=>`<div class="axis-row"><div class="axis-top"><strong>${label}</strong><span>${count} personnes</span><b>${euro(Math.round(amount*s.pct/71))}</b></div><div class="progress ${tone}"><span style="--progress:${pct}%"></span></div></div>`).join("")}</div></section>
      <section class="card card-pad"><div class="card-head" style="padding:0 0 15px"><div><h2>Actions proposées</h2><p>Les besoins individuels restent rattachés à chaque cohorte.</p></div><button class="card-link">Ajouter ${icon("plus")}</button></div><div class="action-list">
        <div class="action-row"><span class="action-color" style="background:var(--coral)"></span><span><strong>Cybersécurité — fondamentaux</strong><small>32 participants · Distanciel · Obligatoire</small></span><span class="action-amount"><strong>9 600 €</strong><small>300 €/pers.</small></span></div>
        <div class="action-row"><span class="action-color" style="background:var(--mint)"></span><span><strong>Concevoir des produits accessibles</strong><small>8 participants · Présentiel + AFEST</small></span><span class="action-amount"><strong>11 200 €</strong><small>1 400 €/pers.</small></span></div>
        <div class="action-row"><span class="action-color" style="background:var(--violet)"></span><span><strong>Premiers pas de manager</strong><small>7 participants · Parcours hybride</small></span><span class="action-amount"><strong>12 600 €</strong><small>1 800 €/pers.</small></span></div>
      </div></section></div><aside class="stack"><section class="card card-pad"><h3>Couverture de l'enveloppe</h3><div class="donut big-donut" style="--value:${s.pct}%"><div class="donut-label">${s.pct} %<small>du budget</small></div></div><div class="legend-list"><div class="legend-item"><span class="legend-dot" style="background:var(--mint)"></span><span>Financement attendu</span><strong>18 400 €</strong></div><div class="legend-item"><span class="legend-dot" style="background:var(--navy)"></span><span>Reste entreprise</span><strong>${euro(Math.max(0,s.total-18400))}</strong></div></div></section><section class="card card-pad"><h3>Points d'attention</h3><div class="check-list"><div class="check-row"><span class="check-icon tone-amber">${icon("clock")}</span><span><strong>3 coûts à confirmer</strong><small>Devis encore estimatifs</small></span></div><div class="check-row"><span class="check-icon tone-coral">${icon("shield")}</span><span><strong>2 écarts de couverture</strong><small>Équipes à vérifier</small></span></div></div></section></aside></div>`;
}

function arbitrationView() {
  const cards = needs.slice(0,5).map(n => { const decision = state.decisions[n.id]; return `<article class="decision-card"><input class="decision-check" type="checkbox" aria-label="Sélectionner ${n.title}"><div class="decision-main"><h3>${n.title}</h3><p>${n.source} · ${n.people} personnes · ${n.category}</p><div class="decision-tags">${badge(n.priority,n.priority==="Haute"||n.priority==="Obligatoire"?"coral":"amber")}${badge(decision || n.status, decision==="Retenu"?"mint":decision==="Reporté"?"amber":decision==="Non retenu"?"coral":n.tone)}</div></div><div class="decision-side"><strong>${euro(n.amount)}</strong><div class="decision-actions"><button class="mini-action accept" data-decision="Retenu" data-id="${n.id}" title="Retenir" aria-label="Retenir ${n.title}">${icon("check")}</button><button class="mini-action defer" data-decision="Reporté" data-id="${n.id}" title="Reporter" aria-label="Reporter ${n.title}">${icon("clock")}</button><button class="mini-action reject" data-decision="Non retenu" data-id="${n.id}" title="Ne pas retenir" aria-label="Ne pas retenir ${n.title}">${icon("close")}</button></div></div></article>`; }).join("");
  return `${pageHead("Plan 2027", "Arbitrer les besoins", "Chaque décision est motivée, datée et communiquée au salarié avec le niveau de détail approprié.", `<button class="btn btn-secondary">Enregistrer le brouillon</button><button class="btn btn-primary" data-action="submit-plan">Soumettre à la direction</button>`)}
    <section class="notice-banner"><span class="notice-icon">${icon("shield")}</span><div><h3>Aucune décision automatique</h3><p>Les priorités aident à instruire le plan ; elles n'acceptent ni ne refusent une demande à votre place.</p></div>${badge("7 à décider","blue")}</section>
    <div class="filters"><div class="search-field">${icon("search")}<input placeholder="Rechercher dans les arbitrages…"></div><select class="filter-select"><option>Toutes les priorités</option><option>Obligatoire</option><option>Haute</option></select><select class="filter-select"><option>Tous les axes</option><option>Transformation</option><option>Management</option></select></div>
    <div class="decision-list">${cards}</div>`;
}

function budgetView() {
  return `${pageHead("Plan 2027", "Budget prévisionnel", "Distinguez les estimations, financements attendus, engagements et coûts réalisés.", `<button class="btn btn-secondary">${icon("download")}Exporter XLSX</button><button class="btn btn-primary" data-nav="plan">Retour au plan</button>`)}<div class="budget-grid"><section class="card card-pad"><h2>Enveloppe 2027</h2><div class="donut big-donut" style="--value:71%"><div class="donut-label">84,6 k€<small>proposés</small></div></div><div class="budget-stat-grid"><div class="budget-stat"><small>Enveloppe</small><strong>120 000 €</strong></div><div class="budget-stat"><small>Disponible</small><strong>35 400 €</strong></div><div class="budget-stat"><small>Financé attendu</small><strong>18 400 €</strong></div><div class="budget-stat"><small>Reste entreprise</small><strong>66 200 €</strong></div></div></section><section class="card"><div class="card-head"><div><h2>Décomposition des coûts</h2><p>Scénario proposé · estimations au 19 septembre</p></div>${badge("Non engagé","amber")}</div><div class="table-wrap"><table class="data-table"><thead><tr><th>Nature</th><th>Budget brut</th><th>Financement</th><th>Reste entreprise</th><th>Part</th></tr></thead><tbody><tr><td><strong>Coûts pédagogiques</strong></td><td>54 800 €</td><td>14 000 €</td><td>40 800 €</td><td>65 %</td></tr><tr><td><strong>Temps & rémunération</strong></td><td>18 600 €</td><td>2 400 €</td><td>16 200 €</td><td>22 %</td></tr><tr><td><strong>Déplacements & hébergement</strong></td><td>7 200 €</td><td>2 000 €</td><td>5 200 €</td><td>9 %</td></tr><tr><td><strong>Remplacements</strong></td><td>4 000 €</td><td>—</td><td>4 000 €</td><td>4 %</td></tr></tbody></table></div></section></div>`;
}

function trackingView() {
  return `${pageHead("Développement", "Réalisation du plan", "Suivez les inscriptions, réalisations, reports et certifications, puis alimentez les parcours.", `<button class="btn btn-secondary">${icon("download")}Bilan CSE / BDESE</button><button class="btn btn-primary">${icon("plus")}Nouvelle session</button>`)}<section class="metrics-grid">${metric("Actions approuvées","11","sur le plan 2027","target","blue","")}${metric("Sessions planifiées","8","3 restent à programmer","calendar","amber","")}${metric("Participants inscrits","39","sur 52 attendus","users","mint","75 %")}${metric("Réalisées","3","aucun abandon","check","mint","27 %")}</section><div class="dashboard-grid"><section class="card"><div class="card-head"><div><h2>Sessions à venir</h2><p>Calendrier et taux de remplissage</p></div><button class="card-link">Voir le calendrier ${icon("arrow")}</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Action</th><th>Date</th><th>Participants</th><th>Remplissage</th><th>Statut</th></tr></thead><tbody><tr><td><strong>Cybersécurité — fondamentaux</strong><span class="date-sub">Distanciel · 3 h</span></td><td>12 janv. 2027</td><td>28 / 32</td><td><div class="progress"><span style="--progress:88%"></span></div></td><td>${badge("Confirmée","mint")}</td></tr><tr><td><strong>Concevoir accessible</strong><span class="date-sub">Paris · 14 h</span></td><td>3 févr. 2027</td><td>6 / 8</td><td><div class="progress blue"><span style="--progress:75%"></span></div></td><td>${badge("Inscriptions","blue")}</td></tr><tr><td><strong>Premiers pas de manager</strong><span class="date-sub">Hybride · 21 h</span></td><td>18 mars 2027</td><td>5 / 7</td><td><div class="progress amber"><span style="--progress:71%"></span></div></td><td>${badge("À confirmer","amber")}</td></tr></tbody></table></div></section><aside class="stack"><section class="card card-pad"><h3>Réinjection dans les parcours</h3><div class="donut-block"><div class="donut" style="--value:93%"><div class="donut-label">93 %<small>synchronisés</small></div></div><div><p class="page-subtitle">28 formations réalisées ont été ajoutées aux dossiers individuels.</p><button class="card-link">Voir 2 anomalies ${icon("arrow")}</button></div></div></section><section class="card card-pad"><h3>Résultats déclarés</h3><div class="progress-meta"><span>Compétence appliquée</span><strong>82 %</strong></div><div class="progress"><span style="--progress:82%"></span></div><div class="progress-meta"><span>Certification obtenue</span><strong>68 %</strong></div><div class="progress blue"><span style="--progress:68%"></span></div></section></aside></div>`;
}

function templatesView() {
  const templates = [["Entretien périodique","Socle légal et perspectives de parcours","calendar","blue","7 sections"],["Mi-carrière","Adaptation, usure et mobilité sans donnée de santé","shield","mint","9 sections"],["Bilan à huit ans","Entretiens, formations, certifications et progression","doc","violet","8 sections"],["Design","Cartographie de développement par métier","spark","coral","4 compétences"],["Engineering","Référentiel métier personnalisable","settings","blue","4 compétences"],["Fin de carrière","Maintien dans l'emploi et aménagements","users","amber","7 sections"]];
  return `${pageHead("Configuration", "Trames et référentiels", "Adaptez les questions par métier tout en protégeant le socle légal versionné.", `<button class="btn btn-secondary">Importer une trame</button><button class="btn btn-primary">${icon("plus")}Créer une trame</button>`)}<div class="template-grid">${templates.map(([name,desc,ic,tone,meta])=>`<article class="template-card"><span class="template-icon tone-${tone}">${icon(ic)}</span><h3>${name}</h3><p>${desc}</p>${badge(name.includes("Design")||name.includes("Engineering")?"Métier":"Légale",name.includes("Design")||name.includes("Engineering")?"blue":"mint")}<div class="template-meta"><span>${meta}</span><button class="card-link">Configurer ${icon("arrow")}</button></div></article>`).join("")}</div>`;
}

function complianceView() {
  return `${pageHead("Conformité", "Pilotage réglementaire", "Chaque échéance conserve sa règle, ses données de calcul et sa version.", `<button class="btn btn-secondary">${icon("download")}Exporter les preuves</button><button class="btn btn-primary">Vérifier les règles</button>`)}<div class="dashboard-grid"><section class="card card-pad"><div class="compliance-score"><div class="score-ring" style="--value:92%"><strong>92 %</strong></div><div><p class="eyebrow">Score de complétude</p><h2>184 dossiers sur 200 sont à jour</h2><p class="page-subtitle">2 retards critiques et 14 preuves de remise à compléter.</p><div class="compliance-bars"><div><div class="progress-meta"><span>Échéances à jour</span><strong>99 %</strong></div><div class="progress"><span style="--progress:99%"></span></div></div><div><div class="progress-meta"><span>Copies remises</span><strong>93 %</strong></div><div class="progress blue"><span style="--progress:93%"></span></div></div><div><div class="progress-meta"><span>Besoins qualifiés</span><strong>81 %</strong></div><div class="progress amber"><span style="--progress:81%"></span></div></div></div></div></div></section><aside class="card card-pad"><h3>Alertes</h3><div class="check-list"><div class="check-row"><span class="check-icon tone-coral">${icon("clock")}</span><span><strong>2 entretiens en retard</strong><small>Risque contractuel</small></span></div><div class="check-row"><span class="check-icon tone-amber">${icon("doc")}</span><span><strong>14 remises à prouver</strong><small>Documents finalisés</small></span></div><div class="check-row"><span class="check-icon tone-amber">${icon("shield")}</span><span><strong>1 accord à revoir</strong><small>Échéance de mise à jour</small></span></div></div></aside></div><section class="card card-pad" style="margin-top:18px"><div class="card-head" style="padding:0 0 18px"><div><h2>Cycle légal de référence</h2><p>Visualisation simplifiée du parcours standard</p></div>${badge("L. 6315-1","blue")}</div><div class="law-timeline"><article class="law-step"><span class="year">A+1</span><h3>Premier entretien</h3><p>Au cours de la première année suivant l'embauche.</p></article><article class="law-step"><span class="year">A+4</span><h3>Entretien périodique</h3><p>Au plus tous les quatre ans, ou accord plus favorable.</p></article><article class="law-step"><span class="year">A+8</span><h3>État des lieux</h3><p>Entretiens, formation, certification et progression.</p></article><article class="law-step"><span class="year">+</span><h3>Événements dédiés</h3><p>Reprise, mi-carrière et fin de carrière selon leurs règles.</p></article></div></section>`;
}

function settingsView() {
  return `${pageHead("Configuration", "Paramètres de l'organisation", "Réglages de démonstration — aucune donnée réelle n'est enregistrée.", `<button class="btn btn-primary" data-action="save">Enregistrer</button>`)}<div class="form-layout"><section class="card form-card"><div class="form-section-head"><h2>Cycle et organisation</h2><p>Ces valeurs influencent les échéances et les restitutions du plan.</p></div><div class="form-grid"><div class="field"><label>Nom de l'organisation</label><input value="Nova Conseil — Démonstration"></div><div class="field"><label>Effectif de référence</label><input type="number" value="200"></div><div class="field"><label>Périodicité maximale</label><select><option>4 ans — règle légale</option><option>2 ans — accord plus favorable</option></select></div><div class="field"><label>Exercice du plan</label><select><option>Annuel — année civile</option><option>Annuel — exercice décalé</option><option>Pluriannuel</option></select></div><div class="field"><label>Enveloppe 2027</label><input value="120 000 €"></div><div class="field"><label>Devise</label><select><option>EUR — Euro</option></select></div></div></section><aside class="card side-summary"><h3>Protection des données</h3><div class="check-list"><div class="check-row"><span class="check-icon">${icon("check")}</span><span><strong>Commentaires masqués</strong><small>Service formation</small></span></div><div class="check-row"><span class="check-icon">${icon("check")}</span><span><strong>Journalisation active</strong><small>Accès et exports</small></span></div><div class="check-row"><span class="check-icon">${icon("check")}</span><span><strong>Seuil d'agrégation</strong><small>5 personnes minimum</small></span></div></div></aside></div>`;
}

function employeeHomeView() {
  return `${pageHead("Mon espace", "", "")}
    <section class="employee-hero"><div><p class="eyebrow" style="color:#7ee2c8">Bonjour Sophie,</p><h1>Préparons la prochaine étape de votre parcours.</h1><p>Votre entretien approche. Prenez quelques minutes pour réfléchir à vos compétences, vos envies et vos besoins de développement.</p><button class="btn btn-mint" data-nav="my-interview">Continuer ma préparation ${icon("arrow")}</button></div><div class="employee-date-card"><small>Prochain entretien</small><strong>23 septembre 2026</strong><span class="date-sub">avec Lucas Morel · En présentiel</span><div class="progress blue" style="margin-top:15px"><span style="--progress:60%"></span></div><div class="progress-meta"><span>Préparation</span><strong>60 %</strong></div></div></section>
    <div class="employee-grid"><div class="stack"><section class="card card-pad"><div class="card-head" style="padding:0 0 15px"><div><h2>Ma préparation</h2><p>Vos réponses restent privées jusqu'à leur soumission.</p></div>${badge("Brouillon","gray")}</div><div class="check-list"><div class="check-row"><span class="check-icon">${icon("check")}</span><span><strong>Mon parcours depuis 2022</strong><small>Complété</small></span><button class="row-action" data-nav="my-interview">Modifier</button></div><div class="check-row"><span class="check-icon">${icon("check")}</span><span><strong>Mes compétences</strong><small>Complété</small></span><button class="row-action" data-nav="my-interview">Modifier</button></div><div class="check-row"><span class="check-icon tone-amber">${icon("clock")}</span><span><strong>Mes souhaits et besoins</strong><small>À terminer</small></span><button class="row-action" data-nav="my-interview">Continuer</button></div></div></section><section class="card card-pad"><div class="card-head" style="padding:0 0 10px"><div><h2>Mes demandes de développement</h2><p>Le statut ne vaut inscription qu'une fois l'action planifiée.</p></div><button class="card-link" data-nav="my-training">Tout voir ${icon("arrow")}</button></div><div class="request-row"><span class="request-icon tone-mint">${icon("spark")}</span><span><strong>Concevoir des produits accessibles</strong><small>Formation terminée en mai 2025</small></span>${badge("Réalisé","mint")}</div><div class="request-row"><span class="request-icon tone-blue">${icon("spark")}</span><span><strong>Facilitation d'ateliers</strong><small>Besoin en cours de préparation</small></span>${badge("Brouillon","gray")}</div></section></div><aside class="stack"><section class="card card-pad"><h3>Pourquoi cet entretien ?</h3><p class="page-subtitle">Il est consacré à votre parcours, vos compétences, vos besoins de formation et vos souhaits d'évolution. Ce n'est pas une évaluation de votre travail.</p><button class="card-link">En savoir plus ${icon("arrow")}</button></section><section class="card card-pad"><h3>Mes documents</h3><div class="request-row"><span class="request-icon tone-blue">${icon("doc")}</span><span><strong>Compte rendu 2022</strong><small>PDF · 326 Ko</small></span><button class="mini-action" aria-label="Télécharger">${icon("download")}</button></div></section></aside></div>`;
}

function myInterviewView() {
  return `${pageHead("Mon entretien", "Préparer mon parcours", "Votre brouillon reste privé jusqu'à ce que vous choisissiez de le transmettre à Lucas.", `<button class="btn btn-secondary">Enregistrer et quitter</button><button class="btn btn-primary" data-action="submit-prep">Transmettre ma préparation</button>`)}<div class="form-layout"><section class="card form-card"><div class="form-section-head"><p class="eyebrow">Préparation personnelle</p><h2>Mes souhaits et besoins</h2><p>Il n'y a pas de bonne ou de mauvaise réponse. Vous pourrez en reparler pendant l'entretien.</p></div><div class="form-grid"><div class="field full"><label>Dans quelle direction souhaitez-vous faire évoluer votre parcours ?</label><textarea>J'aimerais devenir référente sur les sujets de design inclusif et animer davantage d'ateliers transverses.</textarea></div><div class="field full"><label>Quelles compétences souhaitez-vous développer ?</label><textarea>La facilitation de groupes, notamment pour faire participer des profils différents et rendre les ateliers plus accessibles.</textarea></div><div class="field"><label>Horizon souhaité</label><select><option>Dans les 6 à 12 mois</option><option>Dans 1 à 2 ans</option></select></div><div class="field"><label>Mobilité envisagée</label><select><option>Pas pour le moment</option><option>Mobilité métier</option><option>Mobilité géographique</option></select></div><div class="field full"><div class="helper">${icon("shield")}<span>Exprimer un besoin aide l'entreprise à préparer son plan de développement des compétences. Cela ne constitue pas encore une acceptation ni une inscription.</span></div></div></div></section><aside class="card side-summary"><h3>Ma progression</h3><div class="summary-meta"><div class="summary-line"><span>Parcours</span><strong>Complet</strong></div><div class="summary-line"><span>Compétences</span><strong>Complet</strong></div><div class="summary-line"><span>Souhaits</span><strong>En cours</strong></div></div><div class="progress blue"><span style="--progress:60%"></span></div><div class="autosave">Brouillon sauvegardé</div></aside></div>`;
}

function myTrainingView() {
  return `${pageHead("Mon parcours", "Mes demandes de développement", "Suivez chaque besoin depuis son expression jusqu'à la réalisation de l'action.", "")}<section class="card card-pad"><div class="timeline"><div class="timeline-item"><span class="timeline-mark tone-blue">${icon("spark")}</span><span class="timeline-body"><strong>Facilitation d'ateliers accessibles</strong><small>Besoin en brouillon pour l'entretien du 23 septembre 2026</small></span>${badge("Brouillon","gray")}</div><div class="timeline-item"><span class="timeline-mark tone-mint">${icon("check")}</span><span class="timeline-body"><strong>Concevoir des produits accessibles</strong><small>Formation réalisée · Attestation ajoutée à votre parcours</small></span>${badge("Réalisé","mint")}</div><div class="timeline-item"><span class="timeline-mark tone-amber">${icon("clock")}</span><span class="timeline-body"><strong>Anglais professionnel</strong><small>Demande de 2022 réexaminée puis remplacée par du mentorat interne</small></span>${badge("Réponse alternative","amber")}</div></div></section><section class="notice-banner" style="margin-top:18px"><span class="notice-icon">${icon("spark")}</span><div><h3>Comment lire les statuts ?</h3><p>« Retenu » signifie que le besoin entre dans le plan. « Planifié » confirme l'action et sa période. Seule l'inscription confirme votre participation à une session.</p></div></section>`;
}

function documentsView() {
  return `${pageHead("Mon parcours", "Mes documents", "Téléchargez les comptes rendus et justificatifs qui vous concernent.", `<button class="btn btn-secondary">Demander l'accès à mes données</button>`)}<section class="card"><div class="table-wrap"><table class="data-table"><thead><tr><th>Document</th><th>Date</th><th>Version</th><th>Remise</th><th></th></tr></thead><tbody><tr><td><strong>Compte rendu d'entretien professionnel</strong><span class="date-sub">PDF accessible · 326 Ko</span></td><td>24 sept. 2022</td><td>Version 1</td><td>${badge("Reçu","mint")}</td><td><button class="row-action">Télécharger</button></td></tr><tr><td><strong>Attestation — Concevoir accessible</strong><span class="date-sub">PDF · 184 Ko</span></td><td>16 mai 2025</td><td>Original</td><td>${badge("Disponible","blue")}</td><td><button class="row-action">Télécharger</button></td></tr></tbody></table></div></section>`;
}

function render() {
  renderNav();
  const views = {
    dashboard: dashboardView,
    interviews: interviewsView,
    employees: employeesView,
    "employee-detail": employeeDetailView,
    "interview-form": interviewFormView,
    "conduct-interview": conductInterviewView,
    report: reportView,
    needs: needsView,
    plan: planView,
    arbitration: arbitrationView,
    budget: budgetView,
    tracking: trackingView,
    templates: templatesView,
    compliance: complianceView,
    settings: settingsView,
    "employee-home": employeeHomeView,
    "my-interview": myInterviewView,
    "my-training": myTrainingView,
    "my-documents": documentsView,
  };
  const view = views[state.view] || (state.role === "rh" ? dashboardView : employeeHomeView);
  document.querySelector("#main-content").innerHTML = view();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3000);
}

function openNeedDrawer(id) {
  const need = needs.find(n => n.id === Number(id));
  if (!need) return;
  document.querySelector("#drawer-content").innerHTML = `<div class="drawer-head">${badge(need.status, need.tone)}<h2 id="drawer-title">${need.title}</h2><p>${need.skill} · ${need.people} personnes concernées</p></div><section class="drawer-section"><h3>Besoin consolidé</h3><div class="summary-meta"><div class="summary-line"><span>Origine</span><strong>${need.source}</strong></div><div class="summary-line"><span>Catégorie</span><strong>${need.category}</strong></div><div class="summary-line"><span>Priorité</span><strong>${need.priority}</strong></div><div class="summary-line"><span>Budget estimé</span><strong>${euro(need.amount)}</strong></div></div></section><section class="drawer-section"><h3>Résultat attendu</h3><p class="page-subtitle">Mettre en pratique la compétence de manière autonome dans les situations ciblées par les entretiens.</p></section><section class="drawer-section"><h3>Traçabilité</h3><div class="check-list"><div class="check-row"><span class="check-icon">${icon("check")}</span><span><strong>Champs structurés uniquement</strong><small>Aucun commentaire libre transmis</small></span></div><div class="check-row"><span class="check-icon">${icon("check")}</span><span><strong>Sources conservées</strong><small>${need.source}</small></span></div></div></section><div class="drawer-actions"><button class="btn btn-secondary" data-action="close-drawer">Fermer</button><button class="btn btn-primary" data-nav="arbitration" data-action="close-drawer">Arbitrer</button></div>`;
  document.querySelector("#detail-drawer").classList.add("open");
  document.querySelector("#detail-drawer").setAttribute("aria-hidden", "false");
  document.querySelector("#drawer-backdrop").hidden = false;
  requestAnimationFrame(() => document.querySelector("#drawer-backdrop").classList.add("visible"));
}

function closeDrawer() {
  document.querySelector("#detail-drawer").classList.remove("open");
  document.querySelector("#detail-drawer").setAttribute("aria-hidden", "true");
  document.querySelector("#drawer-backdrop").classList.remove("visible");
  setTimeout(() => { document.querySelector("#drawer-backdrop").hidden = true; }, 200);
}

document.addEventListener("click", event => {
  const nav = event.target.closest("[data-nav]");
  if (nav) {
    state.view = nav.dataset.nav;
    window.location.hash = state.view;
    if (state.view === "interview-form") state.interviewStep = 1;
    if (state.view === "conduct-interview") state.conductStep = 1;
    closeDrawer();
    render();
    document.querySelector("#sidebar").classList.remove("open");
    return;
  }
  const action = event.target.closest("[data-action]");
  if (action) {
    const type = action.dataset.action;
    if (type === "next-step") { state.interviewStep = Math.min(5, state.interviewStep + 1); render(); }
    else if (type === "prev-step") { state.interviewStep = Math.max(1, state.interviewStep - 1); render(); }
    else if (type === "conduct-next") { state.conductStep = Math.min(6, state.conductStep + 1); render(); }
    else if (type === "conduct-prev") { state.conductStep = Math.max(1, state.conductStep - 1); render(); }
    else if (type === "pause-meeting") showToast("Entretien mis en pause. Le brouillon reste enregistré.");
    else if (type === "close-drawer") closeDrawer();
    else if (type === "group-selected") {
      const count = [...document.querySelectorAll(".need-check:checked")].length;
      showToast(count ? `${count} besoins regroupés dans une cohorte de travail.` : "Sélectionnez au moins deux besoins à regrouper.");
    }
    else if (type === "finalize") showToast("Compte rendu finalisé. La copie est prête à être remise à Sophie.");
    else if (type === "submit-plan") showToast("Scénario proposé transmis à la direction pour validation.");
    else if (type === "submit-prep") showToast("Votre préparation a été transmise à Lucas.");
    else if (type === "save") showToast("Paramètres enregistrés pour la démonstration.");
    else if (type === "export") showToast("Export de démonstration préparé.");
    else if (type === "new-need") showToast("Dans le produit final, ce bouton ouvrira la création d'un besoin hors entretien.");
    else if (type === "notifications") showToast("3 notifications : 2 échéances et 1 arbitrage.");
    else if (type === "search") showToast("Recherche globale — interaction simulée.");
    return;
  }
  const step = event.target.closest("[data-step]");
  if (step) { state.interviewStep = Number(step.dataset.step); state.view = "interview-form"; render(); return; }
  const conductStep = event.target.closest("[data-conduct-step]");
  if (conductStep) { state.conductStep = Number(conductStep.dataset.conductStep); state.view = "conduct-interview"; render(); return; }
  const scenario = event.target.closest("[data-scenario]");
  if (scenario && scenario.dataset.scenario) { state.scenario = scenario.dataset.scenario; render(); return; }
  const decision = event.target.closest("[data-decision]");
  if (decision) { state.decisions[decision.dataset.id] = decision.dataset.decision; showToast(`Décision « ${decision.dataset.decision} » enregistrée en brouillon.`); render(); return; }
  const need = event.target.closest("[data-need]");
  if (need) openNeedDrawer(need.dataset.need);
});

document.querySelector("#role-select").addEventListener("change", event => {
  state.role = event.target.value;
  state.view = state.role === "rh" ? "dashboard" : "employee-home";
  window.location.hash = state.view;
  render();
});

document.querySelector("#menu-toggle").addEventListener("click", () => {
  const sidebar = document.querySelector("#sidebar");
  const isOpen = sidebar.classList.toggle("open");
  document.querySelector("#menu-toggle").setAttribute("aria-expanded", String(isOpen));
});

document.querySelector("#drawer-backdrop").addEventListener("click", closeDrawer);
document.addEventListener("keydown", event => { if (event.key === "Escape") closeDrawer(); });
window.addEventListener("hashchange", () => {
  const nextView = window.location.hash.replace("#", "");
  if (nextView && nextView !== state.view) {
    state.view = nextView;
    if (nextView.startsWith("my-") || nextView === "employee-home") {
      state.role = "employee";
      document.querySelector("#role-select").value = "employee";
    }
    render();
  }
});

document.querySelector("#role-select").value = state.role;
render();
