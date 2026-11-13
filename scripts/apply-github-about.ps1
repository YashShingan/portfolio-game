<#
.SYNOPSIS
    Applies GitHub repository About metadata (description, homepage, and topics) via GitHub REST API v2022-11-28.

.DESCRIPTION
    This script automates setting the GitHub repository Description, Homepage URL, and 20 curated Topics for
    the portfolio-game repository. It supports automated execution via -Token or $env:GITHUB_TOKEN, interactive
    token prompting fallback, TLS 1.2 enforcement, and includes a -DryRun preview mode.

.PARAMETER Token
    GitHub Personal Access Token (PAT) with 'repo' scope. If omitted, checks $env:GITHUB_TOKEN, $env:GH_TOKEN, or prompts interactively.

.PARAMETER Repo
    The GitHub repository identifier in 'owner/repo' or 'repo' format. Defaults to 'YashShingan/portfolio-game'.

.PARAMETER DryRun
    When specified, displays the target API endpoints and JSON payloads without sending HTTP requests.

.PARAMETER Description
    The repository About description. Defaults to the canonical 123-character description.

.PARAMETER Homepage
    The live website URL. Defaults to 'https://yashshingan.github.io/portfolio-game/'.

.PARAMETER Topics
    Array of topic tags (up to 20). Defaults to the 20 curated portfolio-game tags.

.EXAMPLE
    .\scripts\apply-github-about.ps1 -DryRun

.EXAMPLE
    $env:GITHUB_TOKEN = "<YOUR_GITHUB_TOKEN>"
    .\scripts\apply-github-about.ps1

.EXAMPLE
    .\scripts\apply-github-about.ps1 -Token "<YOUR_GITHUB_TOKEN>" -Repo "YashShingan/portfolio-game"
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false, HelpMessage = "GitHub Personal Access Token (PAT) with repo scope")]
    [string]$Token,

    [Parameter(Mandatory = $false, HelpMessage = "Target repository in 'owner/repo' format")]
    [string]$Repo = "YashShingan/portfolio-game",

    [Parameter(Mandatory = $false)]
    [switch]$DryRun,

    [Parameter(Mandatory = $false)]
    [string]$Description = "Interactive 2D top-down RPG portfolio website and retro game built with Next.js 16, Phaser 3, TypeScript, and Tailwind CSS.",

    [Parameter(Mandatory = $false)]
    [string]$Homepage = "https://yashshingan.github.io/portfolio-game/",

    [Parameter(Mandatory = $false)]
    [string[]]$Topics = @(
        "portfolio", "portfolio-website", "interactive-portfolio", "developer-portfolio", "game-portfolio",
        "phaser", "phaser3", "game-development", "web-game", "2d-game",
        "rpg", "pixel-art", "retro-gaming", "chiptune",
        "nextjs", "react", "typescript", "tailwindcss", "web-audio-api", "server-sent-events"
    )
)

$ErrorActionPreference = "Stop"

# Ensure TLS 1.2 is enabled for Windows PowerShell hosts
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
} catch {
    Write-Verbose "Could not explicitly set TLS 1.2; using host default."
}

# Parse Owner and Repo from $Repo parameter
$repoParts = $Repo -split '/'
if ($repoParts.Count -eq 2) {
    $owner = $repoParts[0].Trim()
    $repoName = $repoParts[1].Trim()
} elseif ($repoParts.Count -eq 1) {
    $owner = "YashShingan"
    $repoName = $repoParts[0].Trim()
} else {
    Write-Error "Invalid Repo parameter format. Expected 'owner/repo' or 'repo'. Received: $Repo"
    exit 1
}

$targetRepoFull = "$owner/$repoName"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  portfolio-game: Apply GitHub About Metadata Script" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Target Repository : $targetRepoFull" -ForegroundColor Gray
Write-Host ""

# Validate Topics constraints
if ($Topics.Count -gt 20) {
    Write-Error "GitHub allows a maximum of 20 topics per repository. Provided: $($Topics.Count)"
    exit 1
}

foreach ($t in $Topics) {
    if ($t.Length -gt 35) {
        Write-Error "Topic '$t' exceeds GitHub maximum length of 35 characters ($($t.Length) chars)."
        exit 1
    }
    if ($t -cnotmatch '^[a-z0-9]+(?:-[a-z0-9]+)*$') {
        Write-Error "Topic '$t' contains invalid characters. Only lowercase alphanumeric characters and single hyphens are permitted."
        exit 1
    }
}

# Validate Description constraint
if ($Description.Length -gt 350) {
    Write-Error "Description exceeds GitHub maximum length of 350 characters. Current length: $($Description.Length)"
    exit 1
}

# Resolve GitHub Token
$resolvedToken = $Token
if ([string]::IsNullOrWhiteSpace($resolvedToken)) {
    if (-not [string]::IsNullOrWhiteSpace($env:GITHUB_TOKEN)) {
        $resolvedToken = $env:GITHUB_TOKEN
        Write-Host "Using GitHub token from `$env:GITHUB_TOKEN" -ForegroundColor DarkGray
    } elseif (-not [string]::IsNullOrWhiteSpace($env:GH_TOKEN)) {
        $resolvedToken = $env:GH_TOKEN
        Write-Host "Using GitHub token from `$env:GH_TOKEN" -ForegroundColor DarkGray
    }
}

# Build Payload Objects
$repoBodyObj = [ordered]@{
    description  = $Description
    homepage     = $Homepage
    has_issues   = $true
    has_projects = $true
    has_wiki     = $false
}
$repoJson = $repoBodyObj | ConvertTo-Json -Depth 3

$topicsBodyObj = [ordered]@{
    names = $Topics
}
$topicsJson = $topicsBodyObj | ConvertTo-Json -Depth 3

# Dry-Run Mode
if ($DryRun) {
    Write-Host "[DRY RUN] Previewing operations without making API calls:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Step 1: PATCH https://api.github.com/repos/$targetRepoFull" -ForegroundColor Cyan
    Write-Host "Headers: Accept: application/vnd.github+json, X-GitHub-Api-Version: 2022-11-28" -ForegroundColor DarkGray
    Write-Host "Payload:" -ForegroundColor White
    Write-Host $repoJson -ForegroundColor Gray
    Write-Host ""
    Write-Host "Step 2: PUT https://api.github.com/repos/$targetRepoFull/topics" -ForegroundColor Cyan
    Write-Host "Headers: Accept: application/vnd.github+json, X-GitHub-Api-Version: 2022-11-28" -ForegroundColor DarkGray
    Write-Host "Payload:" -ForegroundColor White
    Write-Host $topicsJson -ForegroundColor Gray
    Write-Host ""
    Write-Host "Configured Topics ($($Topics.Count) total):" -ForegroundColor Cyan
    Write-Host ($Topics -join ", ") -ForegroundColor Gray
    Write-Host ""
    Write-Host "[DRY RUN] Complete. No changes made to GitHub repository." -ForegroundColor Yellow
    exit 0
}

# Interactive token prompt if token is still unset
if ([string]::IsNullOrWhiteSpace($resolvedToken)) {
    Write-Host "A GitHub Personal Access Token (PAT) with 'repo' scope is required." -ForegroundColor Yellow
    Write-Host "Generate one at: https://github.com/settings/tokens" -ForegroundColor DarkGray
    $interactivePrompt = Read-Host "Enter your GitHub Personal Access Token"
    if ([string]::IsNullOrWhiteSpace($interactivePrompt)) {
        Write-Error "Aborted: No GitHub token provided."
        exit 1
    }
    $resolvedToken = $interactivePrompt.Trim()
}

$headers = @{
    "Authorization"        = "Bearer $resolvedToken"
    "Accept"               = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
    "User-Agent"           = "portfolio-game-metadata-script"
}

# Step 1: Update Repo Details (Description, Homepage)
$patchUrl = "https://api.github.com/repos/$targetRepoFull"
Write-Host "[1/2] Updating repository description and homepage..." -ForegroundColor Cyan
try {
    $patchResponse = Invoke-RestMethod -Uri $patchUrl -Method Patch -Headers $headers -Body $repoJson -ContentType "application/json; charset=utf-8"
    Write-Host "  [OK] Repository description and homepage updated successfully." -ForegroundColor Green
} catch {
    Write-Host "  [FAILED] Could not update repository details." -ForegroundColor Red
    if ($_.Exception.Response) {
        $statusCode = [int]$_.Exception.Response.StatusCode
        if ($statusCode -eq 401) {
            Write-Error "HTTP 401 Unauthorized: The provided GitHub token is invalid or expired."
        } elseif ($statusCode -eq 403) {
            Write-Error "HTTP 403 Forbidden: The token lacks permission for $targetRepoFull. Ensure the token has 'repo' scope."
        } elseif ($statusCode -eq 404) {
            Write-Error "HTTP 404 Not Found: Repository $targetRepoFull does not exist or token cannot access it."
        } elseif ($statusCode -eq 422) {
            Write-Error "HTTP 422 Unprocessable Entity: Invalid payload format or field constraint violation."
        } else {
            Write-Error "HTTP $statusCode API Error: $($_.Exception.Message)"
        }
    } else {
        Write-Error "API Error: $($_.Exception.Message)"
    }
    exit 1
}

# Step 2: Update Repository Topics
$putUrl = "https://api.github.com/repos/$targetRepoFull/topics"
Write-Host "[2/2] Updating repository topics ($($Topics.Count) tags)..." -ForegroundColor Cyan
try {
    $putResponse = Invoke-RestMethod -Uri $putUrl -Method Put -Headers $headers -Body $topicsJson -ContentType "application/json; charset=utf-8"
    Write-Host "  [OK] Repository topics updated successfully." -ForegroundColor Green
} catch {
    Write-Host "  [FAILED] Could not update repository topics." -ForegroundColor Red
    if ($_.Exception.Response) {
        $statusCode = [int]$_.Exception.Response.StatusCode
        if ($statusCode -eq 422) {
            Write-Error "HTTP 422 Unprocessable Entity: Topics validation failed. Verify topics list (max 20, lowercase, hyphens only)."
        } else {
            Write-Error "HTTP $statusCode API Error: $($_.Exception.Message)"
        }
    } else {
        Write-Error "API Error: $($_.Exception.Message)"
    }
    exit 1
}

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  Success! GitHub About metadata applied successfully." -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Description : $Description" -ForegroundColor White
Write-Host "Homepage    : $Homepage" -ForegroundColor White
Write-Host "Topics ($($Topics.Count)) : $($Topics -join ', ')" -ForegroundColor White
Write-Host "Repository  : https://github.com/$targetRepoFull" -ForegroundColor Cyan
Write-Host ""
