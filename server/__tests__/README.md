# Tests Backend VTC

## Structure

```
server/
├── __tests__/              # Tests unitaires et d'intégration
│   ├── utils/              # Utilitaires de test
│   │   ├── mockStripe.ts   # Factory pour mocks Stripe
│   │   └── mockMongoose.ts # Factory pour mocks Mongoose
│   ├── simple.test.ts      # Tests de base
│   ├── mock-examples.test.ts # Exemples d'utilisation des mocks
│   └── README.md           # Ce fichier
├── jest.config.ts          # Configuration Jest
└── jest.setup.ts           # Setup global des tests
```

## Commandes

```bash
# Lancer tous les tests
npm test

# Lancer les tests en mode watch
npm run test:watch

# Générer le rapport de couverture
npm run test:coverage

# Lancer les tests en mode verbose
npm run test:verbose
```

## Utilisation des Mocks

### MongoDB (Mongoose)

```typescript
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { createMockMongoose, createMockModel } from './utils/mockMongoose.js';

describe('MongoDB Tests', () => {
  let mockMongoose: ReturnType<typeof createMockMongoose>;

  beforeEach(() => {
    mockMongoose = createMockMongoose();
    jest.clearAllMocks();
  });

  it('should connect', async () => {
    await mockMongoose.connect('mongodb://localhost:27017/test');
    expect(mockMongoose.connect).toHaveBeenCalled();
  });

  it('should use a model', async () => {
    const MockModel = createMockModel();
    const result = await MockModel.create({ name: 'Test' });
    expect(MockModel.create).toHaveBeenCalled();
  });
});
```

### Stripe

```typescript
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { createMockStripe, createMockPaymentIntent } from './utils/mockStripe.js';

describe('Stripe Tests', () => {
  let mockStripe: ReturnType<typeof createMockStripe>;

  beforeEach(() => {
    mockStripe = createMockStripe();
    jest.clearAllMocks();
  });

  it('should create payment intent', async () => {
    const intent = await mockStripe.paymentIntents.create({
      amount: 5000,
      currency: 'eur',
    });
    
    expect(mockStripe.paymentIntents.create).toHaveBeenCalled();
    expect(intent.id).toBeDefined();
  });

  it('should use factory', () => {
    const intent = createMockPaymentIntent({ amount: 10000 });
    expect(intent.amount).toBe(10000);
  });
});
```

## Variables d'Environnement de Test

Les variables suivantes sont automatiquement définies dans `jest.setup.ts`:

- `NODE_ENV=test`
- `PORT=5001`
- `MONGODB_URI=mongodb://localhost:27017/vtc-test`
- `STRIPE_SECRET_KEY=sk_test_mock_key`
- `GMAIL_USER=test@example.com`
- `GMAIL_PASS=test_password`
- `RECIPIENT_EMAIL=recipient@example.com`
- `CLIENT_URL=http://localhost:3000`

## Exemple de Test pour un Controller

```typescript
import request from 'supertest';
import express from 'express';
import paymentRoutes from '../routes/payment';

jest.mock('stripe');
jest.mock('mongoose');

describe('Payment Controller', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/payment', paymentRoutes);
  });

  it('should create payment intent', async () => {
    const response = await request(app)
      .post('/api/payment/create-payment-intent')
      .send({
        amount: 5000,
        currency: 'eur',
      });

    expect(response.status).toBe(200);
    expect(response.body.clientSecret).toBeDefined();
  });
});
```

## Bonnes Pratiques

1. **Isoler les tests** : Chaque test doit être indépendant
2. **Utiliser beforeEach/afterEach** : Pour nettoyer entre les tests
3. **Mock les dépendances externes** : MongoDB, Stripe, APIs externes
4. **Tester les cas d'erreur** : Ne pas tester uniquement les cas de succès
5. **Maintenir une bonne couverture** : Viser au moins 80% de couverture
6. **Nommer clairement** : Utiliser des descriptions explicites pour les tests

## Ressources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)
