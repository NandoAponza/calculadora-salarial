Set shell = CreateObject("WScript.Shell")
shell.Run "cmd /c cd /d C:\Calculadora_salarial && npm run dev", 0, False
WScript.Sleep 3000
shell.Run "http://localhost:5200", 1, False
