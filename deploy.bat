@echo off
REM Script de deploy para Vercel no Windows

echo === TraitView Deploy Script ===
echo Iniciando processo de deploy...

REM Verificar se o Vercel CLI está instalado
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI não encontrado. Instalando...
    npm install -g vercel
)

REM Verificar se há variáveis de ambiente
if not exist .env (
    echo Arquivo .env não encontrado. Criando a partir de .env.example...
    copy .env.example .env
    echo ATENÇÃO: Configure suas variáveis de ambiente no arquivo .env
    pause
    exit /b 1
)

REM Build da aplicação
echo Construindo aplicação...
npm run build

if %errorlevel% neq 0 (
    echo Erro ao construir aplicação
    pause
    exit /b 1
)

REM Deploy para Vercel
echo Fazendo deploy para Vercel...
vercel --prod

echo Deploy concluído!
pause