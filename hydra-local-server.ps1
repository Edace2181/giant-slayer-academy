[CmdletBinding(DefaultParameterSetName = "Launch")]
param(
    [Parameter(Mandatory = $true)]
    [string]$Root,

    [ValidateRange(1024, 65535)]
    [int]$Port = 8765,

    [Parameter(ParameterSetName = "Launch")]
    [switch]$Launch,

    [Parameter(ParameterSetName = "Server")]
    [switch]$Server,

    [Parameter(ParameterSetName = "Stop")]
    [switch]$Stop
)

$ErrorActionPreference = "Stop"
$healthMarker = "HYDRA_ACADEMY_LOCAL_SERVER_V1"
$serverUrl = "http://127.0.0.1:$Port"
$launchUrl = "$serverUrl/intro.html"
$stateDirectory = Join-Path $env:TEMP "HydraAcademy"
$pidFile = Join-Path $stateDirectory "server-$Port.pid"

function Test-HydraServer {
    try {
        $response = Invoke-WebRequest -UseBasicParsing -Uri "$serverUrl/__hydra_health" -TimeoutSec 2
        return $response.StatusCode -eq 200 -and $response.Content.Trim() -eq $healthMarker
    }
    catch {
        return $false
    }
}

function Test-PortOccupied {
    $client = [System.Net.Sockets.TcpClient]::new()
    try {
        $connection = $client.ConnectAsync("127.0.0.1", $Port)
        return $connection.Wait(750) -and $client.Connected
    }
    catch {
        return $false
    }
    finally {
        $client.Dispose()
    }
}

function Write-HttpResponse {
    param(
        [System.Net.Sockets.NetworkStream]$Stream,
        [int]$StatusCode,
        [string]$StatusText,
        [string]$ContentType,
        [byte[]]$Body,
        [bool]$HeadOnly = $false
    )

    $header = "HTTP/1.1 $StatusCode $StatusText`r`nContent-Type: $ContentType`r`nContent-Length: $($Body.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`nX-Content-Type-Options: nosniff`r`n`r`n"
    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
    $Stream.Write($headerBytes, 0, $headerBytes.Length)
    if (-not $HeadOnly -and $Body.Length -gt 0) {
        $Stream.Write($Body, 0, $Body.Length)
    }
    $Stream.Flush()
}

function Get-ContentType {
    param([string]$Path)

    switch ([System.IO.Path]::GetExtension($Path).ToLowerInvariant()) {
        ".html" { return "text/html; charset=utf-8" }
        ".css"  { return "text/css; charset=utf-8" }
        ".js"   { return "text/javascript; charset=utf-8" }
        ".json" { return "application/json; charset=utf-8" }
        ".png"  { return "image/png" }
        ".jpg"  { return "image/jpeg" }
        ".jpeg" { return "image/jpeg" }
        ".gif"  { return "image/gif" }
        ".svg"  { return "image/svg+xml" }
        ".ico"  { return "image/x-icon" }
        ".mp3"  { return "audio/mpeg" }
        ".wav"  { return "audio/wav" }
        ".ogg"  { return "audio/ogg" }
        ".md"   { return "text/markdown; charset=utf-8" }
        ".txt"  { return "text/plain; charset=utf-8" }
        default  { return "application/octet-stream" }
    }
}

function Test-IsHydraServerProcess {
    param(
        [object]$ProcessInfo,
        [int]$ExpectedPort,
        [string]$ExpectedScript
    )

    if (-not $ProcessInfo -or [string]::IsNullOrWhiteSpace($ProcessInfo.CommandLine)) {
        return $false
    }

    $commandLine = $ProcessInfo.CommandLine
    $scriptPattern = [regex]::Escape([System.IO.Path]::GetFullPath($ExpectedScript))
    $portPattern = "(?i)(?:^|\s)-Port\s+$ExpectedPort(?:\s|$)"
    return $ProcessInfo.Name -in @("powershell.exe", "pwsh.exe") -and
        $commandLine -match "(?i)(?:^|\s)-File\s+`"?$scriptPattern`"?(?:\s|$)" -and
        $commandLine -match "(?i)(?:^|\s)-Server(?:\s|$)" -and
        $commandLine -match $portPattern
}

function Get-LoopbackListenerPids {
    param([int]$ExpectedPort)

    $pids = [System.Collections.Generic.HashSet[int]]::new()
    $pattern = "^\s*TCP\s+127\.0\.0\.1:$ExpectedPort\s+\S+\s+LISTENING\s+(\d+)\s*$"
    foreach ($line in @(netstat.exe -ano -p TCP 2>$null)) {
        if ($line -match $pattern) {
            [void]$pids.Add([int]$Matches[1])
        }
    }
    return @($pids)
}

if ($Stop) {
    $scriptPath = [System.IO.Path]::GetFullPath($PSCommandPath)
    $candidatePids = [System.Collections.Generic.HashSet[int]]::new()
    $listenerPids = @(Get-LoopbackListenerPids $Port)
    $healthConfirmed = Test-HydraServer

    if (Test-Path -LiteralPath $pidFile) {
        $recordedPid = (Get-Content -Raw -LiteralPath $pidFile).Trim()
        if ($recordedPid -match "^\d+$") {
            [void]$candidatePids.Add([int]$recordedPid)
        }
    }

    foreach ($listenerPid in $listenerPids) {
        [void]$candidatePids.Add([int]$listenerPid)
    }

    $stoppedHydra = $false
    $unrelatedListener = $false
    foreach ($candidatePid in $candidatePids) {
        $process = Get-CimInstance Win32_Process -Filter "ProcessId = $candidatePid" -ErrorAction SilentlyContinue
        $isConfirmedListener = $healthConfirmed -and $listenerPids -contains $candidatePid
        if ($isConfirmedListener -or (Test-IsHydraServerProcess $process $Port $scriptPath)) {
            Stop-Process -Id $candidatePid -Force
            $stoppedHydra = $true
        }
        elseif ($listenerPids -contains $candidatePid) {
            $unrelatedListener = $true
        }
    }

    Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue

    if ($unrelatedListener) {
        Write-Error "Port $Port is owned by an unrelated process. It was not stopped."
        exit 1
    }
    if ($stoppedHydra) {
        Write-Host "Hydra Academy local server on port $Port was stopped."
    }
    else {
        Write-Host "No Hydra Academy launcher server is currently running on port $Port."
    }
    exit 0
}

if ($Launch) {
    try {
        $resolvedRoot = (Resolve-Path -LiteralPath $Root).Path
    }
    catch {
        Write-Error "The Hydra Academy folder could not be found: $Root"
        exit 1
    }

    if (-not (Test-Path -LiteralPath (Join-Path $resolvedRoot "index.html"))) {
        Write-Error "index.html was not found in the Hydra Academy folder: $resolvedRoot"
        exit 1
    }

    if (Test-HydraServer) {
        Start-Process $launchUrl
        exit 0
    }

    if (Test-PortOccupied) {
        Write-Error "Port $Port is already occupied by another application. Stop that application or change HYDRA_PORT in both launcher files."
        exit 1
    }

    $arguments = @(
        "-NoLogo",
        "-NoProfile",
        "-ExecutionPolicy", "Bypass",
        "-File", ('"{0}"' -f $PSCommandPath),
        "-Root", ('"{0}"' -f $resolvedRoot),
        "-Port", $Port,
        "-Server"
    )
    Start-Process -FilePath "powershell.exe" -ArgumentList $arguments -WindowStyle Hidden | Out-Null

    $ready = $false
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        Start-Sleep -Milliseconds 200
        if (Test-HydraServer) {
            $ready = $true
            break
        }
    }

    if (-not $ready) {
        Write-Error "The Hydra Academy local server did not start. Windows PowerShell may be unavailable or port $Port may be blocked."
        exit 1
    }

    Start-Process $launchUrl
    exit 0
}

if ($Server) {
    $resolvedRoot = (Resolve-Path -LiteralPath $Root).Path.TrimEnd('\')
    $rootBoundary = $resolvedRoot + [System.IO.Path]::DirectorySeparatorChar
    New-Item -ItemType Directory -Path $stateDirectory -Force | Out-Null

    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
    try {
        $listener.Start()
        Set-Content -LiteralPath $pidFile -Value $PID -Encoding ASCII
        while ($true) {
            $client = $listener.AcceptTcpClient()
            try {
                $stream = $client.GetStream()
                $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 4096, $true)
                $requestLine = $reader.ReadLine()
                while ($reader.ReadLine()) { }

                if ([string]::IsNullOrWhiteSpace($requestLine)) {
                    continue
                }

                $parts = $requestLine.Split(' ')
                if ($parts.Length -lt 2 -or $parts[0] -notin @("GET", "HEAD")) {
                    $body = [System.Text.Encoding]::UTF8.GetBytes("Method Not Allowed")
                    Write-HttpResponse $stream 405 "Method Not Allowed" "text/plain; charset=utf-8" $body
                    continue
                }

                $headOnly = $parts[0] -eq "HEAD"
                $requestPath = [System.Uri]::UnescapeDataString(($parts[1] -split '\?')[0])
                if ($requestPath -eq "/__hydra_health") {
                    $body = [System.Text.Encoding]::UTF8.GetBytes($healthMarker)
                    Write-HttpResponse $stream 200 "OK" "text/plain; charset=utf-8" $body $headOnly
                    continue
                }

                if ($requestPath -eq "/") {
                    $requestPath = "/intro.html"
                }

                $relativePath = $requestPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
                $fullPath = [System.IO.Path]::GetFullPath((Join-Path $resolvedRoot $relativePath))
                if (-not $fullPath.StartsWith($rootBoundary, [System.StringComparison]::OrdinalIgnoreCase)) {
                    $body = [System.Text.Encoding]::UTF8.GetBytes("Forbidden")
                    Write-HttpResponse $stream 403 "Forbidden" "text/plain; charset=utf-8" $body $headOnly
                    continue
                }

                if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
                    $body = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
                    Write-HttpResponse $stream 404 "Not Found" "text/plain; charset=utf-8" $body $headOnly
                    continue
                }

                $body = [System.IO.File]::ReadAllBytes($fullPath)
                Write-HttpResponse $stream 200 "OK" (Get-ContentType $fullPath) $body $headOnly
            }
            catch {
                # A malformed or aborted local request must not stop the server.
            }
            finally {
                $client.Dispose()
            }
        }
    }
    finally {
        $listener.Stop()
        if (Test-Path -LiteralPath $pidFile) {
            $registeredPid = (Get-Content -Raw -LiteralPath $pidFile -ErrorAction SilentlyContinue).Trim()
            if ($registeredPid -eq [string]$PID) {
                Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

Write-Error "Choose one launcher mode: -Launch, -Server, or -Stop."
exit 1
