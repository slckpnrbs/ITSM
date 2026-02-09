# Notification Service

ITSM Bildirim Servisi - Email ve WebSocket ile gerçek zamanlı bildirimler.

## Özellikler

- Email bildirimleri (nodemailer)
- WebSocket ile gerçek zamanlı bildirimler (Socket.io)
- Olay odaları (incident rooms)
- Kullanıcıya özel bildirimler
- SLA uyarıları

## API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /health | Servis durumu |
| POST | /send | Genel bildirim gönder |
| POST | /incident/created | Olay oluşturuldu bildirimi |
| POST | /incident/assigned | Olay atandı bildirimi |
| POST | /incident/resolved | Olay çözüldü bildirimi |
| POST | /sla/warning | SLA uyarısı |

## WebSocket Events

### Client → Server
- `authenticate` - Kullanıcı kimlik doğrulama
- `joinIncident` - Olay odasına katıl
- `leaveIncident` - Olay odasından ayrıl

### Server → Client
- `incident:created` - Yeni olay bildirimi
- `incident:updated` - Olay güncelleme
- `incident:message` - Yeni mesaj
- `incident:assigned` - Olay atama
- `sla:warning` - SLA uyarısı

## Çalıştırma

```bash
npm install
npm run start:dev
```
