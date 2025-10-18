$stats = @{
    Errors = @(
        @{ Row = 1; Errors = @("Error 1", "Error 2"); Data = @{Nombre="Test"; Precio="100"} },
        @{ Row = 2; Errors = @("Otro error"); Data = @{Nombre="Otro"; Precio="200"} }
    )
}

foreach ($error in $stats.Errors) {
    Write-Host "Fila $($error.Row):"
    foreach ($errorMsg in $error.Errors) {
        Write-Host "  • $errorMsg"
    }
    $errorData = $error.Data | Format-List | Out-String
    Write-Host "  Datos:"
    Write-Host ("  " + ($errorData.Trim() -replace "`n", "`n  "))
    Write-Host ""
}