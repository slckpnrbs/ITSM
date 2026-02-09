# ITSM Platform

Kapsamlı, microservices tabanlı IT Service Management (ITSM) web uygulaması.

## 🚀 Özellikler

### Core Modüller
- **Incident Management** - Olay yönetimi, SLA takibi, email trigger
- **Service Request** - Hizmet talepleri, workflow, projeye dönüşüm
- **Problem Management** - Kök neden analizi, KEDB
- **Change Management** - RFC, CAB onay süreci
- **Asset Management** - Varlık envanteri, QR/Barkod
- **Knowledge Base** - Self-servis bilgi bankası
- **Project Management** - Proje takibi, paydaş erişimi

### Cross-Cutting
- 🔐 LDAP/Active Directory entegrasyonu
- 📧 Email ile incident oluşturma
- 💬 Real-time mesajlaşma
- 📊 SLA ve performans dashboards
- 🌍 Multi-language (TR/EN)
- 📱 Responsive/PWA

## 🛠️ Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| Frontend | React + TypeScript + Vite |
| Backend | Node.js + NestJS |
| Database | PostgreSQL |
| Cache | Redis |
| Queue | RabbitMQ |
| Container | Docker |

## 📁 Proje Yapısı

```
itsm-platform/
├── services/           # Microservices
│   ├── gateway/
│   ├── auth-service/
│   ├── incident-service/
│   └── ...
├── frontend/           # React SPA
├── shared/             # Ortak tipler ve utils
├── docker-compose.yml
└── docs/               # Dokümantasyon
```

## 🚦 Başlangıç

```bash
# Clone
git clone git@github.com:slckpnrbs/ITSM.git
cd ITSM

# Docker ile çalıştır
docker-compose up -d
```

## 📝 Geliştirme

### Branching
- `main` - Production
- `develop` - Aktif geliştirme
- `feature/*` - Yeni özellikler
- `bugfix/*` - Hata düzeltmeleri

### Commit Format
```
feat(auth): add LDAP authentication
fix(incident): resolve SLA calculation
```

## 📄 Lisans

MIT License
