@echo off
set "XDG_CONFIG_HOME=%CD%\.xdg"
npm.cmd run dev -- --host 127.0.0.1 --port 3000 > "%CD%\dev-server.out.log" 2> "%CD%\dev-server.err.log"
