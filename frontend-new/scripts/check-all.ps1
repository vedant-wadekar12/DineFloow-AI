$apps = @(
    "dineflow-admin",
    "dineflow-owner",
    "dineflow-manager",
    "dineflow-cashier",
    "dineflow-waiter",
    "dineflow-chef",
    "dineflow-customer"
)

$failed = $false
foreach ($app in $apps) {
    Write-Host "`n=== $app ===" -ForegroundColor Cyan
    Push-Location ".\$app"
    try {
        npm install
        if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
        npm run type-check
        if ($LASTEXITCODE -ne 0) { throw "type-check failed" }
        npm run build
        if ($LASTEXITCODE -ne 0) { throw "build failed" }
    } catch {
        Write-Host $_ -ForegroundColor Red
        $failed = $true
    } finally {
        Pop-Location
    }
}

if ($failed) { exit 1 }
Write-Host "All frontend checks completed successfully." -ForegroundColor Green
