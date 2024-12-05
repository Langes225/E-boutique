import { generateArticle, genererUnProduit, testerSiProduitExiste } from './script/function.js';

const response = await fetch("http://localhost:8081/chapeaux");
const data = await response.json();

// ----------------------------Affichage dynaique des des produits---------------------------

// Selection de la classe à partir de laquelle on affichera nos produits
const produitsContainer = document.querySelector(".produits");

// Création d'une fonction pour afficher dynamiquement les produits

const afficherProduit = (produits) => {
	// Utilisation de la propriéte forEach sur l'objet data qui est un tableau
	produits.forEach((produit) => {
		const produitDiv = document.createElement("div");
		produitDiv.classList.add("carte-produit");		
		// Appel et assignation de la fonction generateArticle à la variable contenuHtml
		const contenuHtml = generateArticle(produit);

		// Insertion de variable contenuHtml dans la blise produitDiv
		produitDiv.innerHTML = contenuHtml;

		// Récupère chaque proruit et son id
		produitDiv.setAttribute("data-id", produit.id);

		// Ajout de la classe produitDiv créee à la balise parent
		produitsContainer.appendChild(produitDiv);
	});

};

// Appel de la fonction afficherProduit avec comme param data
afficherProduit(data);


// -----------------------------construction du bouton recherche----------------------------

// Selection de la barre de recherche
const input =  document.querySelector(".recherche");

// Selection du bouton recherche
const btnRecherche = document.querySelector("button");
// console.log(btnRecherche)

// Ecoute de l'évènement lorq'on saisie dalns la barre de recherche
input.addEventListener("keyup", (e) => {
	// console.log(e.target.value);

	// Transformation des caractères saisis en minuscule
	const filtre = data.filter(p => p.nom.toLocaleLowerCase().includes(e.target.value));

		produitsContainer.innerHTML = "";

		// recherche du produit lorsqu'on click sur le bouton
		btnRecherche.addEventListener("click", () => {

			if(filtre.length > 0){
            
                afficherProduit(filtre);
                
            } else {
                const videDiv = document.createElement("div");
                videDiv.classList.add("carte-produit-vide")
                videDiv.innerHTML = "<h3>Aucun produit trouvé !</h3>"
                produitsContainer.appendChild(videDiv);
            }
        });
			
		// if(filtre.length > 0){
		
		// 	afficherProduit(filtre);
			
		// } else {
		// 	const videDiv = document.createElement("div");
		// 	videDiv.classList.add("carte-produit-vide")
		// 	videDiv.innerHTML = "<h3>Aucun produit trouvé !</h3>"
		// 	produitsContainer.appendChild(videDiv);
		// }
	// });	
});

// Déclaration d'un tableau qui va contenir le nombre de produit dans le panier produit selectionnés par l'utilisateur

let carteProducts = [];

// Selection de la classe nombre de produit dans le panier
const nombreProduit = document.querySelector(".carte .nombre");

// Ajout du tableau dans la balise crate-nombre
nombreProduit.textContent = carteProducts.length;


// Selection de la boite de dialog
const dialog = document.querySelector("dialog");
// console.log(dialog);

const listCarteProduits = document.querySelectorAll(".carte-produit");
// console.log(listCarteProduits);

const oneProduit = document.querySelector(".one-produit");

listCarteProduits.forEach((product) => {
	product.addEventListener("click", () => {
		const contenuDialog = document.querySelector(".dialog-menu");

		contenuDialog && contenuDialog.remove();
		
		dialog.showModal();
		
		// console.log(product.dataset)
		const currentProduct = data.filter((p) => p.id == product.dataset.id)[0];
		// console.log(currentProduct);
	
		// Création d'une balise section 
		const section = document.createElement("section");

		// Ajout de la classe dialog-menu dans la balise section
		section.classList.add("dialog-menu");

		const dialogContenuHtml = genererUnProduit(currentProduct);

		section.innerHTML = dialogContenuHtml;

		oneProduit.appendChild(section);

	// changement de couleur de fond de l'image du produit
		const changeColors = document.querySelectorAll(".color.change");
		console.log(changeColors);

		changeColors.forEach((couleur, key) => {
			
			couleur.addEventListener("click", () => {
				const backgroundimg = document.querySelector(".gauche");
			
				switch (key) {
					case 0:
						backgroundimg.style.backgroundColor = "#ff0000";
						break;
					default :
						backgroundimg.style.backgroundColor = "#050578";
						break;
				}
			});
		})
		
		// Selection de la taille (size) du produit
		const tabSizes = document.querySelectorAll(".size");
		console.log(tabSizes);

		tabSizes.forEach((tabsize) => {

		tabsize.addEventListener("click", () => {
			// Suppression de la class active précédente
			const sizeActive = document.querySelector(".size.active");
			if (sizeActive) {
				sizeActive.classList.remove("active");
			}
			// Ajout de la classe active sur la taille indexée
			tabsize.classList.add("active");
			
			//Affichage du prix en fonction de la taille du produit
			const prix = document.querySelector(".prix");

			switch(tabsize.textContent) {
				case 'S':
					prix.textContent = currentProduct.prixS;
					break;
				case 'M':
					prix.textContent = currentProduct.prixM;
					break;	
				case 'L':
					prix.textContent = currentProduct.prixL;
					break;
				case 'XL':
					prix.textContent = currentProduct.prixXL;
					break;
				case 'XS':
					prix.textContent = currentProduct.prixXS;
					break;
				default :
					prix.textContent = currentProduct.prixS;
					break;
			}

		})
		});
		
		const stock = document.querySelector(".qte");
		
		// Ajout d'un produit au panier
		const ajouter = document.querySelector(".ajouter")
		ajouter.addEventListener("click", () => {
			if (testerSiProduitExiste(carteProducts, currentProduct)) {
				const btnText =`
				<div class="icon">
					<i class="fa-solid fa-plus"></i>
				</div>
				<p>Ajouter au panier</p>`;
				ajouter.innerHTML = btnText;
				ajouter.classList.remove("ajoute");
				carteProducts = carteProducts.filter((p) =>p.id !== currentProduct.id);
				nombreProduit.textContent = carteProducts.length;			
			} else {
				carteProducts.push(currentProduct);
				nombreProduit.textContent = carteProducts.length;	
				ajouter.textContent = "Effacer du panier";
				ajouter.classList.add("ajoute");
				stock.textContent= 1;
			}
			
		})

		// Test si le produit est déjà dans le panier alors ajouter le texte effacer
		// if(testerSiProduitExiste(carteProducts, currentProduct)) {
			// ajouter.textContent = "Effacer du panier";
			// ajouter.classList.add("ajoute");
		// }

		// quantité
		const reduireBtn = document.querySelector(".counter .fa-minus");
		console.log(reduireBtn);

		const incrementerBtn = document.querySelector(".counter .fa-plus");
		console.log(incrementerBtn);

		let qteProduits = testerSiProduitExiste(carteProducts, currentProduct) ? 1 : 0;

		incrementerBtn.addEventListener("click", () =>{
			qteProduits += 1;
			stock.textContent = qteProduits;
		})

		reduireBtn.addEventListener("click", () =>{
			qteProduits -= 1;
			stock.textContent = qteProduits;
		});

	});
});

// Bouton pour fermer la boite de dialogue
const btnFermer = document.querySelector(".btn-fermer");

btnFermer.addEventListener("click", () => {
	dialog.close();
})
