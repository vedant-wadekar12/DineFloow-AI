$apps = @(
    @{ Name = "Admin"; Path = ".\dineflow-admin" },
    @{ Name = "Owner"; Path = ".\dineflow-owner" },
    @{ Name = "Manager"; Path = ".\dineflow-manager" },
    @{ Name = "Cashier"; Path = ".\dineflow-cashier" },
    @{ Name = "Waiter"; Path = ".\dineflow-waiter" },
    @{ Name = "Chef"; Path = ".\dineflow-chef" },
    @{ Name = "Customer"; Path = ".\dineflow-customer" }
)

foreach ($app in $apps) {
    Start-Process powershell -ArgumentList '-NoExit', '-Command', "Set-Location '$((Resolve-Path $app.Path).Path)'; npm run dev"
}
