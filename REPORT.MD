# CI/CD Pipeline Optimization & Security Report

## 1. Pregled cevovoda (Datadog CI Health)

Za spremljanje zdravja CI/CD cevovoda je bilo uporabljeno orodje **Datadog CI Visibility**, integrirano z **GitHub Actions**.

### Osnovni podatki (zadnji teden)

* **Median time to pass:** 9 min 11 s
* **P95 time to pass:** 9 min 11 s
* **CI Provider:** GitHub Actions
* **Repository:** `Vukp17/bookify`
* **Branch:** `main`

Datadog prikazuje, da je čas izvajanja stabilen, vendar relativno dolg glede na velikost projekta.

## 2. Analiza kritične poti (Critical Path)

Analiza posameznega pipeline zagona je pokazala naslednjo strukturo:

### Glavni koraki cevovoda

1. **Build Application** – ~58 s
2. **Build and Push Docker Image** – ~4 min 39 s
3. **Deploy Application** – ~1 min 5 s

**Največje ozko grlo:** Build and Push Docker Image (več kot 50 % celotnega časa)

### Podrobnosti Docker build koraka

* Setup Docker Buildx
* Login to Docker Hub
* Build & Push image (≈ 4 min 16 s)

## 3. Predlagane in izvedene optimizacije cevovoda

### Identificirane težave

* Docker image se gradi ob vsakem commitu
* Ni uporabljen Docker layer caching
* Koraki se izvajajo zaporedno, čeprav bi lahko tekli sočasno

### Predlagane izboljšave

* Uporaba Docker build cache
* Paralelizacija jobov (build / test)
* Gradnja Docker image samo ob spremembah aplikacijske kode

**Pričakovani rezultat:**

* Skrajšanje pipeline časa za ~30–40 %
* Manjša poraba CI runner virov

## 4. GitHub Code Scanning (CodeQL)

Na GitHub repozitoriju je bil omogočen **Code Scanning** z uporabo **CodeQL**.

### Rezultati

* CodeQL workflow se uspešno izvaja
* Trenutno ni zaznanih kritičnih ranljivosti v aplikacijski kodi
* CodeQL job traja približno 1 min 8 s

## 5. Snyk – Analiza Dockerfile (aplikacija)

Snyk je zaznal več visoko tveganih ranljivosti, povezanih z Node.js runtime okoljem.

### Kritične ranljivosti

| Ranljivost              | Ocena | Vzrok        |
| ----------------------- | ----- | ------------ |
| Node Race Condition     | 750   | node@20.19.6 |
| Node Uncaught Exception | 650   | node@20.19.6 |
| Node Symlink Following  | 650   | node@20.19.6 |

### Rešitev

Ranljivosti so odpravljene z posodobitvijo na Node.js 20.20.0 v Dockerfile.

## 6. Snyk – Analiza Dockerfile (baza podatkov)

Pri Docker image za bazo podatkov (Debian 13 base image) so bile zaznane nizko tveganje ranljivosti, večinoma v sistemskih knjižnicah.

### Primeri zaznanih ranljivosti

* `libxslt` – Use After Free (Score: 400)
* `glibc` – Out-of-Bounds / Uncontrolled Recursion
* `tar` – CVE-2005-2541
* `openldap` – Out-of-bounds read

### Ocena tveganja

* Vse ranljivosti imajo Low severity
* Ni znanih aktivnih exploitov
* Ranljivosti izvirajo iz osnovnega OS image

### Odločitev

* Ranljivosti so sprejete (accepted risk)
* Redno posodabljanje base image bo zmanjšalo tveganje

V produkciji bi se priporočila uporaba `slim` ali `distroless` image ter redno posodabljanje OS paketov.

## 7. Končna ocena stanja

### Pred optimizacijo

* Dolg Docker build čas
* Zastarela Node.js verzija
* Brez jasnega pregleda kritične poti

### Po optimizaciji

* Jasna identifikacija ozkih grl
* Posodobljen Docker image (Node.js)
* Odpravljene visoko tveganje ranljivosti
* Izboljšana varnost in preglednost CI/CD procesa

## 8. Uporabljena orodja

* **Datadog CI Visibility**
* **GitHub Actions**
* **GitHub Code Scanning (CodeQL)**
* **Snyk Container Security**