@echo off
title Abi-Cockpit 2027
cd /d "%~dp0"
if not exist node_modules (
  echo Installiere benoetigte Pakete, einen Moment...
  call npm install
)
echo Abi-Cockpit startet auf http://localhost:5180 ...
echo Dieses Fenster offen lassen, solange du die App nutzt.
call npm run start
