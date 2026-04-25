@echo off
cd /d C:\Calculadora_salarial
start "Calculadora Salarial" cmd /k npm run dev
timeout /t 3 /nobreak >nul
start "" "http://localhost:5200"
