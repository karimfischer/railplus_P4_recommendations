// Fonction pour mettre à jour la valeur au-dessus du curseur
function updateSliderValue(slider, customEtiquetteBulle = null) {
	const valueEtiquette = customEtiquetteBulle || parseInt(slider.value, 10);
    const valueBox = slider.nextElementSibling; // La bulle de valeur
    const sliderValue = slider.value;

    // Calcule la position de la bulle
    const percent = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    // Met à jour la valeur et positionne la bulle
    valueBox.textContent = valueEtiquette;
    valueBox.style.left = `calc(${percent}% + 0px)`; // Ajuster pour centrer la bulle
}

// Fonction pour ajouter des graduations au slider (créée une fois au chargement)
function addGraduations(slider, labels = null, customStep = null) {
    const graduationsContainer = document.getElementById(`${slider.id}Graduations`);

    if (!graduationsContainer) {
        console.error(`Graduations container not found for slider: ${slider.id}`);
        return;
    }

    // Évite de réinitialiser les graduations si elles existent déjà
    if (graduationsContainer.children.length > 0) {
        return;
    }

    const step = customStep || parseInt(slider.step, 10);
    const max = parseInt(slider.max, 10);
    const min = parseInt(slider.min, 10);

    for (let i = min; i <= max; i += step) {
        const graduation = document.createElement("div");
        graduation.classList.add("graduation");

        // Texte des graduations
        if (labels) {
            graduation.textContent = labels[i]; 
        } else {
            graduation.textContent = i === 600 ? "≥600" : i;
        }
        
        

        // Positionner la graduation
        graduation.style.left = `${((i - min) / (max - min)) * 100}%`;
        graduationsContainer.appendChild(graduation);
    }
}

// Fonction pour mettre à jour la table des résultats
function updateTable() {
    const rayon = parseInt(document.getElementById("rayonSlider").value, 10);
    const trafic = parseInt(document.getElementById("traficSlider").value, 10);
    const qualite = parseInt(document.getElementById("qualiteSlider").value, 10);
    const bruit = parseInt(document.getElementById("bruitSlider").value, 10);

    fetch("https://karimfischer.github.io/railplus_P4_recommendations/recommandations.json")
        .then(response => response.json())
        .then(data => {
            const results = data.filter(item =>
                rayon >= item.rayon_min &&
                rayon <= item.rayon_max &&
                trafic >= item.charge_min &&
                trafic <= item.charge_max &&
                qualite === item.qualite &&
                bruit === item.bruit
            );

            const tableBody = document.getElementById("recommendationsTable");
            tableBody.innerHTML = "";

            if (results.length > 0) {
                results.forEach(result => {
                    result.recommandations.forEach(rec => {
                        const head = document.createElement("thead");
                        head.innerHTML = `
                            <tr>
                                <th>Profil de rail</th>
                                <th>Nuance d'acier</th>
                                <th>Traverse</th>
                                <th>Semelle sous-rail</th>
                                <th>Infrastructure</th>
                                <th>Remarques</th>
                            </tr>
                            `;
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${rec.profil_rail}</td>
                            <td>${rec.nuance_acier}</td>
                            <td>${rec.traverse}</td>
                            <td>${rec.semelle}</td>
                            <td>${rec.mesure}</td>
                            <td>${rec.message}</td>
                        `;
                        tableBody.appendChild(head); 
                        tableBody.appendChild(row);
                    });
                });
            } else {
                const row = document.createElement("tr");
                row.innerHTML = `<td colspan="4">Aucune recommandation trouvée pour ces critères.</td>`;
                tableBody.appendChild(row);
            }
        });
}

// Initialisation des sliders
slider_select = document.querySelectorAll("input[type='range']").forEach(slider => {
    // Créer et ajouter le div pour afficher la valeur
    //const valueBox = document.createElement("div");
    //valueBox.className = "slider-value";
    //slider.parentElement.appendChild(valueBox);

    // Initialiser la valeur affichée
    updateSliderValue(slider);

    // Mettre à jour la valeur et la table lors des modifications
    slider.addEventListener("input", () => {
        updateSliderValue(slider);
        updateTable();
    });
});

// Ajout des graduations (créées une fois)
addGraduations(document.getElementById("rayonSlider"), null, 100);
addGraduations(document.getElementById("traficSlider"), null, 5000);
addGraduations(document.getElementById("qualiteSlider"), {
    0: "Mauvais",
    1: "Moyen",
    2: "Bon"
});
addGraduations(document.getElementById("bruitSlider"), {
    0: "Non",
    1: "Oui"
});

// Mise à jour initiale de la table
updateTable();
