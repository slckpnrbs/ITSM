# Incident Service

ITSM Olay Yönetimi Servisi.

## Özellikler

- Olay oluşturma, güncelleme, atama, çözümleme
- SLA yönetimi (otomatik süre hesaplama ve ihlal tespiti)
- Email ile olay açma desteği
- Mesajlaşma (internal/public)
- Memnuniyet anketi
- Dosya ekleri

## API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /health | Servis durumu |
| GET | /stats | İstatistikler |
| POST | / | Yeni olay oluştur |
| GET | / | Olayları listele |
| GET | /:id | Olay detayı |
| PUT | /:id | Olay güncelle |
| PUT | /:id/assign | Atama yap |
| PUT | /:id/resolve | Çözümle |
| PUT | /:id/close | Kapat |
| POST | /:id/survey | Anket gönder |
| GET | /:id/messages | Mesajları al |
| POST | /:id/messages | Mesaj ekle |

## Çalıştırma

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```
