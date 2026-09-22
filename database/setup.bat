@echo off
echo ========================================
echo Configuracao do Banco de Dados
echo ========================================
echo.

set /p PGPASSWORD="Digite a senha do PostgreSQL (usuario postgres): "
set PGUSER=postgres
set PGHOST=localhost
set PGPORT=5432

echo.
echo Criando banco de dados...
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -c "CREATE DATABASE canal_denuncias;"

if %ERRORLEVEL% EQU 0 (
    echo Banco criado com sucesso!
    echo.
    echo Executando schema...
    psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d canal_denuncias -f schema.sql
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo Configuracao concluida com sucesso!
        echo ========================================
        echo.
        echo Credenciais de teste:
        echo Email: admin@empresademo.com.br
        echo Senha: admin123
        echo.
    ) else (
        echo Erro ao executar schema.
    )
) else (
    echo Erro ao criar banco. Verifique se o PostgreSQL esta rodando.
)

pause
