$stats = @{
    Errors = @(
        @{ Row = 1; Errors = @("Error 1", "Error 2"); Data = @{Nombre="Test"; Precio="100"} },
        @{ Row = 2; Errors = @("Otro error"); Data = @{Nombre="Otro"; Precio="200"} }
    )
}

# CHANGELOG: Renamed $error to $errorItem to avoid PSScriptAnalyzer error (readonly automatic variable)
foreach ($errorItem in $stats.Errors) {
    Write-Host "Fila $($errorItem.Row):"
    foreach ($errorMsg in $errorItem.Errors) {
        Write-Host "  • $errorMsg"
    }
    $errorData = $errorItem.Data | Format-List | Out-String
    Write-Host "  Datos:"
    Write-Host ("  " + ($errorData.Trim() -replace "`n", "`n  "))
    Write-Host ""
}