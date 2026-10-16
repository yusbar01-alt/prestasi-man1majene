@echo off
title Upload Proyek SIPRESMA ke GitHub
color 0A
setlocal enabledelayedexpansion

echo ==============================================================================
echo       KONFIGURASI DAN PENGUNGGAHAN PROYEK SIPRESMA KE GITHUB
echo ==============================================================================
echo.
echo Direktori  : %~dp0
echo Target Repo: https://github.com/yusbar01-alt/prestasi_man1majene
echo.

set "PATH=C:\Users\ADMIN\AppData\Local\Programs\Git\cmd;C:\Program Files\nodejs;%PATH%"

echo [1/4] Memeriksa ketersediaan Git...
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    if exist "C:\Users\ADMIN\AppData\Local\Programs\Git\cmd\git.exe" (
        set "GIT_CMD=C:\Users\ADMIN\AppData\Local\Programs\Git\cmd\git.exe"
    ) else (
        echo [ERROR] Git tidak ditemukan.
        pause
        exit /b 1
    )
) else (
    set "GIT_CMD=git"
)
echo [OK] Git siap digunakan: %GIT_CMD%

echo.
echo [2/4] Menyiapkan branch dan komit file...
cd /d "%~dp0"
"%GIT_CMD%" config user.name "yusbar01-alt"
"%GIT_CMD%" config user.email "yusbar01@gmail.com"
"%GIT_CMD%" add .
"%GIT_CMD%" commit -m "Konfigurasi GitHub Actions & SIPRESMA Madrasah" 2>nul
"%GIT_CMD%" branch -M main

echo.
echo [3/4] Konfigurasi Remote GitHub...
"%GIT_CMD%" remote remove origin 2>nul
"%GIT_CMD%" remote add origin https://github.com/yusbar01-alt/prestasi_man1majene.git

echo.
echo ==============================================================================
echo PILIHAN METODE UPLOAD:
echo   [1] Upload Otomatis (Muncul pop-up login browser GitHub)
echo   [2] Upload dengan Personal Access Token (PAT) GitHub
echo ==============================================================================
set /p OPSI="Pilih metode (1 atau 2, default 1): "

if "%OPSI%"=="2" (
    echo.
    echo Masukkan Personal Access Token (PAT) GitHub Anda:
    echo (Bisa dibuat di: https://github.com/settings/tokens)
    set /p GITHUB_TOKEN="Token: "
    if not "!GITHUB_TOKEN!"=="" (
        "%GIT_CMD%" remote set-url origin https://yusbar01-alt:!GITHUB_TOKEN!@github.com/yusbar01-alt/prestasi_man1majene.git
    )
)

echo.
echo [4/4] Mengunggah file ke branch 'main' di GitHub...
"%GIT_CMD%" push -u origin main --force

echo.
if %ERRORLEVEL% EQU 0 (
    echo ==============================================================================
    echo  [BERHASIL] Seluruh file dan konfigurasi berhasil diunggah ke GitHub!
    echo.
    echo  Status GitHub Actions (Otomatis running & jadi hijau):
    echo  https://github.com/yusbar01-alt/prestasi_man1majene/actions
    echo.
    echo  Website SIPRESMA Anda akan aktif di:
    echo  https://yusbar01-alt.github.io/prestasi_man1majene/
    echo ==============================================================================
) else (
    echo ==============================================================================
    echo  [PERHATIAN] Upload belum selesai atau memerlukan otentikasi.
    echo  Jika diminta login browser, silakan klik 'Sign in with your browser'.
    echo  Atau jalankan ulang dan pilih [2] dengan Personal Access Token (PAT).
    echo ==============================================================================
)
echo.
pause
