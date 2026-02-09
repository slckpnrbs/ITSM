#!/bin/bash

# ITSM Platform - Ubuntu 24.04 Sunucu Kurulum Script'i
# Bu script'i sunucuda root veya sudo yetkili kullanıcı ile çalıştırın

set -e

echo "🚀 ITSM Platform Sunucu Kurulumu Başlıyor..."
echo "============================================="

# 1. Sistem Güncelleme
echo "📦 Sistem güncelleniyor..."
sudo apt-get update && sudo apt-get upgrade -y

# 2. Docker Kurulumu
echo "🐳 Docker kuruluyor..."

# Eski versiyonları kaldır
sudo apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

# Gerekli paketler
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Docker GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Docker repo
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker kurulumu
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Kullanıcıyı docker grubuna ekle
sudo usermod -aG docker $USER

# Docker servisini başlat
sudo systemctl enable docker
sudo systemctl start docker

echo "✅ Docker kuruldu: $(docker --version)"

# 3. Git Kurulumu
echo "📚 Git kuruluyor..."
sudo apt-get install -y git
echo "✅ Git kuruldu: $(git --version)"

# 4. Proje Dizini
echo "📁 Proje dizini oluşturuluyor..."
sudo mkdir -p /opt/itsm
sudo chown $USER:$USER /opt/itsm

# 5. SSH Key (CI/CD için)
echo "🔑 Deploy key oluşturuluyor..."
if [ ! -f ~/.ssh/deploy_key ]; then
    ssh-keygen -t ed25519 -C "deploy@itsm" -f ~/.ssh/deploy_key -N ""
    cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    echo "✅ Deploy key oluşturuldu"
else
    echo "⚠️  Deploy key zaten mevcut"
fi

# 6. Firewall
echo "🔥 Firewall yapılandırılıyor..."
sudo apt-get install -y ufw
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw --force enable
echo "✅ Firewall yapılandırıldı"

echo ""
echo "============================================="
echo "✅ KURULUM TAMAMLANDI!"
echo "============================================="
echo ""
echo "📋 Sonraki Adımlar:"
echo ""
echo "1. Yeni terminal açın veya 'newgrp docker' çalıştırın"
echo ""
echo "2. Repo'yu klonlayın:"
echo "   cd /opt/itsm"
echo "   git clone https://github.com/slckpnrbs/ITSM.git ."
echo ""
echo "3. .env dosyasını oluşturun:"
echo "   cp .env.production .env"
echo "   nano .env  # Şifreleri değiştirin!"
echo ""
echo "4. Uygulamayı başlatın:"
echo "   docker compose -f docker-compose.prod.yml up -d"
echo ""
echo "5. GitHub Secrets'a eklenecek private key:"
echo "   cat ~/.ssh/deploy_key"
echo ""
