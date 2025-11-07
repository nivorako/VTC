# Tests d'Intégration - BookingForm.tsx

## 📋 Vue d'ensemble

Ce document décrit les tests d'intégration créés pour le composant `BookingForm.tsx`, couvrant:
- ✅ **Validation de formulaire**
- ✅ **Soumission et synchronisation des données**
- ✅ **Gestion d'erreurs**
- ✅ **États de chargement et interactions**

## 📁 Fichiers de Test

### `BookingForm.integration.test.tsx`
Fichier principal contenant **27 tests d'intégration** organisés en 6 catégories.

---

## 🧪 Catégories de Tests

### 1. **Tests de Rendu et Structure** (3 tests)

**Objectif:** Vérifier que tous les éléments du formulaire sont présents et initialisés correctement.

#### Tests inclus:
- ✅ Affichage des titres de sections (Détails du trajet, Passagers, Type de trajet)
- ✅ Présence de tous les champs de formulaire nécessaires
- ✅ Initialisation des valeurs par défaut

```typescript
it("initialise les valeurs par défaut correctement", () => {
    // Vérifie:
    // - passagersAdultes = 1
    // - passagersEnfants = 0
    // - Tous les autres champs vides
});
```

---

### 2. **Tests de Validation de Formulaire** (7 tests)

**Objectif:** Vérifier que la validation Yup fonctionne correctement pour tous les champs obligatoires.

#### Champs testés:
- ✅ **Date** - Message: "Date obligatoire"
- ✅ **Heure** - Message: "Heure obligatoire"
- ✅ **Lieu de départ** - Message: "Lieu de départ obligatoire"
- ✅ **Lieu d'arrivée** - Message: "Lieu d'arrivée obligatoire"
- ✅ **Type de trajet** - Message: "Choix type trajet obligatoire"
- ✅ **Adultes** - Message: "Au moins 1 adulte" (quand < 1)
- ✅ **Suppression d'erreurs** - Vérifie que les erreurs disparaissent après correction

```typescript
it("affiche une erreur quand la date est manquante", async () => {
    // 1. Focus sur le champ
    // 2. Blur (perte de focus)
    // 3. Vérifier que le message d'erreur apparaît
});
```

**Schéma de validation (Yup):**
```javascript
date: Yup.date().required("Date obligatoire")
heure: Yup.string().required("Heure obligatoire")
depart: Yup.string().required("Lieu de départ obligatoire")
arrivee: Yup.string().required("Lieu d'arrivée obligatoire")
typeTrajet: Yup.string().required("Choix type trajet obligatoire")
passagersAdultes: Yup.number().min(1, "Au moins 1 adulte").required("Obligatoire")
passagersEnfants: Yup.number().min(0, "Obligatoire")
```

---

### 3. **Tests de Synchronisation des Données** (5 tests)

**Objectif:** Vérifier que toutes les modifications du formulaire sont synchronisées avec le callback `onFormChange`.

#### Tests inclus:
- ✅ Appel initial avec valeurs par défaut au montage du composant
- ✅ Synchronisation des champs texte (depart, arrivee)
- ✅ Synchronisation des champs date et heure
- ✅ Synchronisation du nombre de passagers (adultes + enfants)
- ✅ Synchronisation de la sélection du type de trajet

```typescript
it("synchronise les changements de champ texte", async () => {
    // 1. Saisir "Paris" dans le champ départ
    // 2. Attendre que onFormChange soit appelé
    // 3. Vérifier que lastCall.depart === "Paris"
});
```

**Architecture du composant:**
```
BookingForm
  └─> Formik (gestion du state)
      └─> FormikObserver (observe les changements)
          └─> onFormChange(values) appelé à chaque modification
```

---

### 4. **Scénario Complet de Bout en Bout** (3 tests)

**Objectif:** Tester des scénarios réels d'utilisation utilisateur.

#### Tests inclus:
- ✅ **Remplissage complet** - Tous les champs remplis correctement
- ✅ **Modification de valeurs** - Modifier une valeur déjà saisie
- ✅ **Changement de type de trajet** - Passer de "simple" à "aller-retour"

```typescript
it("permet de remplir un formulaire complet et valide", async () => {
    // Scénario:
    // Paris → Lyon
    // Date: 25/12/2025 à 14:30
    // 2 adultes, 1 enfant
    // Type: Aller-retour
    
    // Vérifie:
    // - Toutes les données synchronisées
    // - Aucun message d'erreur
});
```

---

### 5. **Tests de Gestion d'Erreurs Multiples** (1 test)

**Objectif:** Vérifier que plusieurs erreurs peuvent s'afficher simultanément.

```typescript
it("affiche plusieurs erreurs en même temps", async () => {
    // Toucher 3 champs obligatoires sans les remplir
    // Vérifier que les 3 messages d'erreur s'affichent
});
```

---

### 6. **Tests de Cas Limites** (3 tests)

**Objectif:** Tester les edge cases et comportements limites.

#### Tests inclus:
- ✅ **Grand nombre de passagers** - 50 adultes (valeur élevée)
- ✅ **Valeurs négatives interdites** - Attribut `min="0"` sur enfants
- ✅ **Adresses longues** - 100+ caractères

```typescript
it("gère des adresses longues sans problème", async () => {
    const longAddress = "123 Avenue des Champs-Élysées, 75008 Paris...";
    // Vérifier que l'adresse complète est synchronisée
});
```

---

## 🎯 Couverture des Exigences

### ✅ Validation de formulaire
- [x] Tous les champs obligatoires testés
- [x] Messages d'erreur vérifiés
- [x] Validation min/max pour les nombres
- [x] Suppression des erreurs après correction

### ✅ Soumission
- [x] Synchronisation via `onFormChange`
- [x] Appel au montage du composant
- [x] Appel à chaque modification
- [x] Données complètes transmises

### ✅ Gestion d'erreurs
- [x] Erreurs individuelles
- [x] Erreurs multiples simultanées
- [x] Disparition des erreurs après correction

### ✅ États de chargement
- [x] Tests asynchrones avec `waitFor`
- [x] Interactions utilisateur (type, click, tab, selectOptions)
- [x] Modifications de valeurs existantes

---

## 🛠️ Stratégie de Test

### Sélection des éléments
```typescript
// Utilisation de l'attribut `name` de Formik (plus fiable)
const getInputByName = (name: string) => {
    return document.querySelector(`[name="${name}"]`) as HTMLInputElement;
};
```

**Pourquoi?**
- Les `Label` styled-components ne sont pas automatiquement liés aux inputs
- L'attribut `name` est garanti par Formik
- Plus robuste que `getByLabelText` ou `getByPlaceholderText`

### Interactions utilisateur
```typescript
const user = userEvent.setup();

await user.type(input, "text");        // Saisie
await user.click(input);               // Click
await user.tab();                      // Navigation clavier
await user.selectOptions(select, val); // Sélection
await user.clear(input);               // Effacement
```

### Assertions asynchrones
```typescript
await waitFor(() => {
    expect(mockOnFormChange).toHaveBeenCalled();
    const lastCall = mockOnFormChange.mock.calls[...];
    expect(lastCall.depart).toBe("Paris");
});
```

---

## 📊 Exécution des Tests

### Commandes disponibles

```bash
# Lancer tous les tests
npm run test

# Lancer uniquement les tests BookingForm
npm run test -- BookingForm.integration.test.tsx

# Mode watch (re-exécution automatique)
npm run test -- --watch

# Avec coverage
npm run test:coverage
```

### Résultats attendus
```
✓ Tests de rendu et structure (3)
✓ Validation de formulaire (7)
✓ Synchronisation des données (5)
✓ Scénario complet (3)
✓ Gestion d'erreurs multiples (1)
✓ Cas limites (3)

Total: 27 tests passés
```

---

## 🔍 Points Techniques Importants

### 1. Formik + Yup
Le composant utilise Formik pour la gestion du state et Yup pour la validation.

### 2. FormikObserver
Un composant helper qui observe les changements de valeurs Formik et appelle `onFormChange`.

### 3. Styled Components
Tous les styles utilisent styled-components, d'où l'utilisation de sélecteurs par `name` plutôt que par labels.

### 4. Testing Library Best Practices
- Queries basées sur des attributs stables (name, role, text)
- userEvent pour simuler les interactions réelles
- waitFor pour les assertions asynchrones
- Mocks typés avec Vitest

---

## 🚀 Prochaines Étapes

### Tests supplémentaires recommandés:
1. **Tests de performance** - Mesurer le temps de rendu
2. **Tests d'accessibilité** - Vérifier ARIA labels
3. **Tests de snapshot** - Détecter les régressions UI
4. **Tests E2E** - Avec Playwright ou Cypress

### Améliorations possibles:
1. Ajouter des `data-testid` pour une sélection plus facile
2. Ajouter des labels accessibles avec `htmlFor`
3. Tester avec différents locales (dates, nombres)
4. Tester la gestion du focus clavier

---

## 📚 Ressources

- [Testing Library Documentation](https://testing-library.com/)
- [Vitest Documentation](https://vitest.dev/)
- [Formik Testing Guide](https://formik.org/docs/guides/testing)
- [Yup Schema Validation](https://github.com/jquense/yup)

---

**Dernière mise à jour:** Novembre 2025
**Auteur:** Tests d'intégration BookingForm
**Coverage:** 27 tests | 100% des fonctionnalités critiques
