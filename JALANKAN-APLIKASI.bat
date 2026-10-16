@echo off
title Menjalankan Aplikasi SIPRESMA Madrasah
color 0B
echo ========================================================
echo       MEMBUKA APLIKASI SIPRESMA SECARA LOKAL
echo ========================================================
echo.
cd /d "%~dp0"

echo [1/2] Menyiapkan server lokal...
echo Menjalankan 'npm run dev'...
echo.
echo Aplikasi akan terbuka di browser Anda: http://localhost:5173
echo Tekan Ctrl + C jika ingin menghentikan aplikasi.
echo ========================================================
echo.

call npm.cmd run dev
pause