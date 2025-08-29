#!/bin/bash

# Script de deploy para Vercel

echo "=== TraitView Deploy Script ==="
echo "Iniciando processo de deploy..."

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null
then
    echo "Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

# Verificar se há variáveis de ambiente
if [ ! -f .env ]; then
    echo "Arquivo .env não encontrado. Criando a partir de .env.example..."
    cp .env.example .env
    echo "ATENÇÃO: Configure suas variáveis de ambiente no arquivo .env"
    exit 1
fi

# Build da aplicação
echo "Construindo aplicação..."
npm run build

if [ $? -ne 0 ]; then
    echo "Erro ao construir aplicação"
    exit 1
fi

# Deploy para Vercel
echo "Fazendo deploy para Vercel..."
vercel --prod

echo "Deploy concluído!"