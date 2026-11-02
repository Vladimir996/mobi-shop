# MobiShop – prodavnica mobilnih telefona

| Deo      | Tehnologija                          | Adresa                       |
| -------- | ------------------------------------ | ---------------------------- |
| Frontend | Next.js 16 (App Router), React 19    | http://localhost:3000        |
| Backend  | Strapi 5 (Node.js), REST API         | http://localhost:1338/api    |
| Admin    | Strapi admin panel                   | http://localhost:1338/admin  |
| Baza     | MySQL 8 (WAMP), baza `prodavnica`    | 127.0.0.1:3306               |

> Strapi radi na portu **1338** (a ne podrazumevanom 1337) jer Razer Chroma SDK (`RzSDKServer`) zauzima 1337.

## Pokretanje

1. Pokreni MySQL (WAMP). Baza `prodavnica` mora da postoji:
   ```sql
   CREATE DATABASE prodavnica CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Backend:
   ```bash
   cd backend
   npm install
   npm run develop
   ```
   Pri prvom pokretanju otvori http://localhost:1338/admin i napravi administratorski nalog.
   Primer podataka (5 brendova, 3 kategorije, 10 proizvoda) i javne API dozvole se ubacuju automatski.
3. Frontend (u drugom terminalu):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Struktura

```
backend/
  config/            server, baza (MySQL), CORS, admin
  src/api/
    brand/           Brend
    category/        Kategorija
    product/         Telefon (cena, stanje, slike, specifikacije)
    order/           Porudzbina – prilagodjen kontroler (cene se racunaju na serveru, umanjuje se stanje)
  src/index.js       javne dozvole (find/findOne za katalog, create za porudzbine)
  src/seed.js        pocetni podaci
frontend/
  app/               stranice: /, /telefoni, /telefoni/[slug], /korpa
  components/        Header, ProductCard, korpa (Context + localStorage), galerija...
  lib/strapi.js      pozivi ka Strapi API-ju
```

## Napomene

- **Slike proizvoda**: za primer proizvoda ilustracije se generisu automatski (`backend/src/product-images.js`,
  SVG → PNG preko `sharp`-a) i upload-uju u Media Library pri pokretanju – samo za proizvode koji jos nemaju slike.
  Prave fotografije dodaj u adminu: Content Manager → Telefon → izaberi proizvod → Images → Publish.
- **Porudzbine** se vide u adminu (Content Manager → Porudzbina), gde se menja i status.
- WAMP MySQL podrazumevano koristi MyISAM; `backend/config/database.js` zato za svaku konekciju postavlja InnoDB.
- Placanje je pouzecem (bez online placanja). Dostava: 450 RSD, besplatna preko 10.000 RSD.
