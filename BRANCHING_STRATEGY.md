# Bookify - Branch Strategy & CI/CD

## 🌿 Branch Strategy (3 Long-lived Branches)

Projekt uporablja **3 dolgoživeče veje** za različne razvojne faze:

### 1. **main** - Development Branch
- **Namen**: Aktivni razvoj in testiranje novih funkcionalnosti
- **Deployment**: Development okolje (`https://bookify.dev.example.com`)
- **Trigger**: Vsak push na `main` sproži CI/CD pipeline
- **Testing**: Avtomatski testi in lint preverjanja
- **Uporaba**: Razvijalci pushajo in mergajo nove feature branche sem

### 2. **pre-production** - Staging/Pre-production Branch  
- **Namen**: Testiranje pred produkcijo, QA testing
- **Deployment**: Pre-production/Staging okolje (`https://bookify.staging.example.com`)
- **Trigger**: Push na `pre-production` sproži CI/CD pipeline
- **Testing**: Enaki testi kot main + dodatno manualno testiranje
- **Uporaba**: Merge iz `main` za testiranje pred produkcijo

### 3. **production** - Production Branch
- **Namen**: Produkcijsko okolje za končne uporabnike
- **Deployment**: Production okolje (`https://bookify.production.example.com`)
- **Trigger**: Push na `production` sproži CI/CD pipeline
- **Testing**: Vsi testi + dodatne smoke tests
- **Uporaba**: Merge iz `pre-production` samo po uspešnem QA

## 🔄 Workflow

```
Feature Branch → main → pre-production → production
     ↓              ↓            ↓              ↓
   Develop      Dev Env    Staging Env     Prod Env
```

### Razvoj nove funkcionalnosti:

1. **Create Feature Branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/nova-funkcionalnost
   ```

2. **Development & Testing**
   ```bash
   # Razvoj in lokalno testiranje
   npm run backend:start
   npm run frontend:start
   
   # Preveri teste
   npm run test
   npm run lint
   ```

3. **Merge to Main**
   ```bash
   git checkout main
   git merge feature/nova-funkcionalnost
   git push origin main
   # → Sproži CI/CD: tests + deploy to dev environment
   ```

4. **Promote to Pre-production**
   ```bash
   git checkout pre-production
   git merge main
   git push origin pre-production
   # → Sproži CI/CD: tests + deploy to staging environment
   ```

5. **Deploy to Production**
   ```bash
   # Po uspešnem QA testiranju na staging
   git checkout production
   git merge pre-production
   git push origin production
   # → Sproži CI/CD: tests + deploy to production environment
   ```

## 🚀 CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci-cd.yml`) se sproži ob:
- **Push** na `main`, `pre-production`, ali `production` branch
- **Pull Request** na katerikoli od teh branchy

### Pipeline Jobs:

#### 1. **frontend-tests**
- Namesti dependencies (`npm ci`)
- Preveri ESLint (`npm run lint`)
- Zažene frontend teste s coverage (`npx nx test frontend --coverage`)
- Naloži coverage report kot artifact (30 dni retenčija)

#### 2. **backend-tests**
- Zažene PostgreSQL service container
- Namesti dependencies (`npm ci`)  
- Nastavi test bazo (Prisma migrations)
- Preveri ESLint (`npm run backend:lint`)
- Zažene backend teste s coverage (`npx nx test backend --coverage`)
- Naloži coverage report kot artifact (30 dni retenčija)

#### 3. **test-summary**
- Prenese coverage artifakte
- Prikaže rezultate testiranja
- Prikaže branch info

#### 4. **deploy**
- Določi okolje glede na branch (development/pre-production/production)
- Izvede deployment (trenutno placeholder - potrebna implementacija)
- Prikaže deployment summary z URL

### Test Coverage:

✅ **Backend Tests: 26 testov**
- AuthService: 5 testov
- EventsService: 6 testov  
- BookingsService: 8 testov
- FavoritesService: 3 testa
- ReviewsService: 4 testi

✅ **Frontend Tests: 20 testov**
- AuthService: 7 testov
- EventService: 6 testov
- BookingService: 5 testov
- ReviewService: 2 testa
- AuthGuard: 2 testa
- AuthInterceptor: 3 testi

**Skupaj: 46+ testov** (presega zahtevanih 20)

## 📊 Coverage Reports

Coverage reporti so dostopni v GitHub Actions:
1. Pojdi na **Actions** tab v GitHub repo
2. Izberi workflow run
3. Scroll down do **Artifacts** sekcije
4. Prenesi:
   - `frontend-coverage-report`
   - `backend-coverage-report`

## 🔧 Lokalno Testiranje

### Backend:
```bash
# Linting
npm run backend:lint

# Tests
npx nx test backend

# Tests with coverage
npx nx test backend --coverage
```

### Frontend:
```bash
# Linting  
npx nx lint frontend

# Tests
npx nx test frontend

# Tests with coverage
npx nx test frontend --coverage
```

### Both:
```bash
# Vse teste
npm run test

# Linting za vse
npm run lint
```

## 📝 Branch Protection Rules (Priporočeno)

Za produkcijsko uporabo nastavi protection rules na GitHub:

### Main Branch:
- ✅ Require pull request reviews (1 approval)
- ✅ Require status checks to pass (frontend-tests, backend-tests)
- ✅ Require branches to be up to date

### Pre-production Branch:
- ✅ Require pull request reviews (1 approval)  
- ✅ Require status checks to pass
- ✅ Require merge from main only

### Production Branch:
- ✅ Require pull request reviews (2 approvals)
- ✅ Require status checks to pass
- ✅ Require merge from pre-production only
- ✅ Include administrators

## 🎯 Best Practices

1. **Nikoli ne pushaj direktno na production** - vedno skozi pre-production
2. **Vedno zaženi teste lokalno** pred push-om
3. **Feature branche** naj bodo kratki (manj kot 1 teden)
4. **Pull requeste** uporabljaj za code review
5. **Hotfixe** naredi na novem branch-u, merge v vse 3 branche
6. **Coverage** naj bo vsaj 70% za vse nove funkcionalnosti

## 🔐 Environment Variables

Vsako okolje potrebuje svoje `.env` spremenljivke:

**Development (.env.dev)**:
```
DATABASE_URL=postgresql://bookify:bookify@localhost:5432/bookify_dev
JWT_SECRET=dev-secret-key
NODE_ENV=development
```

**Pre-production (.env.staging)**:
```
DATABASE_URL=postgresql://bookify:bookify@staging-db:5432/bookify_staging
JWT_SECRET=staging-secret-key
NODE_ENV=staging
```

**Production (.env.prod)**:
```
DATABASE_URL=postgresql://bookify:bookify@prod-db:5432/bookify_prod
JWT_SECRET=super-secret-production-key
NODE_ENV=production
```

## 📚 Dodatna Dokumentacija

- [Prisma Schema](./apps/backend/prisma/schema.prisma)
- [API Documentation](./PRISMA_SETUP.md)
- [Frontend Architecture](./apps/frontend/README.md)
- [Backend Architecture](./apps/backend/README.md)
