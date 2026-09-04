param(
    [switch]$InstallDependencies,
    [switch]$RequirePortableSkills
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $repoRoot

function Require-Command([string]$Name) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command is missing: $Name"
    }
}

function Require-Path([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path)) {
        throw "Required handoff path is missing: $Path"
    }
}

Require-Command "git"
Require-Command "node"
Require-Command "npm"
Require-Path "handoff/MANIFEST.json"

$manifest = Get-Content -LiteralPath "handoff/MANIFEST.json" -Raw | ConvertFrom-Json
$nodeText = (& node --version).Trim().TrimStart("v")
$nodeVersion = [version]$nodeText
$minimumNode = [version]($manifest.required_node -replace "^>=", "")
if ($nodeVersion -lt $minimumNode) {
    throw "Node $nodeVersion is too old; this repository requires $($manifest.required_node)."
}

foreach ($path in @($manifest.included_context)) {
    Require-Path $path
}

foreach ($skill in @($manifest.public_repository_skills)) {
    Require-Path ".agents/skills/$skill/SKILL.md"
}

$portablePresent = @()
$portableMissing = @()
foreach ($skill in @($manifest.portable_only_skills)) {
    $skillPath = ".agents/skills/$skill/SKILL.md"
    if (Test-Path -LiteralPath $skillPath) {
        $portablePresent += $skill
    } else {
        $portableMissing += $skill
    }
}

if ($portablePresent.Count -gt 0 -and $portableMissing.Count -gt 0) {
    throw "Portable Skill set is partial. Missing: $($portableMissing -join ', ')"
}
if ($RequirePortableSkills -and $portableMissing.Count -gt 0) {
    throw "This verification requires the private portable Skill set. Missing: $($portableMissing -join ', ')"
}
if ($portableMissing.Count -gt 0) {
    Write-Warning "Public-clone mode: 10 private portable Skills are intentionally absent."
} else {
    Write-Host "Portable Skills: all $($portablePresent.Count) private snapshots present."
}

$branch = (& git branch --show-current).Trim()
if ($branch -ne $manifest.branch) {
    Write-Warning "Current branch is '$branch'; manifest expects '$($manifest.branch)'."
}

$remote = (& git remote get-url origin).Trim()
if ($remote -ne $manifest.repository) {
    Write-Warning "Origin is '$remote'; manifest records '$($manifest.repository)'."
}

& git cat-file -e "$($manifest.content_baseline_commit)^{commit}"
if ($LASTEXITCODE -ne 0) {
    throw "Content baseline commit is unavailable: $($manifest.content_baseline_commit)"
}
& git merge-base --is-ancestor $manifest.content_baseline_commit HEAD
if ($LASTEXITCODE -ne 0) {
    throw "HEAD does not contain the recorded content baseline commit."
}
& git cat-file -e "$($manifest.handoff_materials_commit)^{commit}"
if ($LASTEXITCODE -ne 0) {
    throw "Handoff materials commit is unavailable: $($manifest.handoff_materials_commit)"
}
& git merge-base --is-ancestor $manifest.handoff_materials_commit HEAD
if ($LASTEXITCODE -ne 0) {
    throw "HEAD does not contain the recorded handoff materials commit."
}

$tracked = @(& git ls-files)
$forbiddenTracked = @($tracked | Where-Object {
    $_ -match '(^|/)node_modules/' -or
    $_ -match '^docs/\.vitepress/(dist|cache)/' -or
    $_ -match '^knowledge-base/cache/' -or
    $_ -match '(^|/)\.env($|\.)'
})
if ($forbiddenTracked.Count -gt 0) {
    throw "Forbidden generated or sensitive paths are tracked: $($forbiddenTracked -join ', ')"
}

$status = @(& git status --porcelain)
if ($status.Count -gt 0) {
    Write-Warning "Working tree has local changes; they were not discarded:`n$($status -join "`n")"
} else {
    Write-Host "Working tree: clean"
}

Write-Host "Repository: $repoRoot"
Write-Host "Branch: $branch"
Write-Host "Node: v$nodeVersion"
Write-Host "npm: $(& npm --version)"
Write-Host "Git HEAD: $(& git rev-parse HEAD)"

if (-not (Test-Path -LiteralPath "node_modules")) {
    if (-not $InstallDependencies) {
        throw "node_modules is missing. Re-run with -InstallDependencies or run npm ci."
    }
    & npm ci
    if ($LASTEXITCODE -ne 0) { throw "npm ci failed." }
}

& npm run verify
if ($LASTEXITCODE -ne 0) { throw "npm run verify failed." }

Write-Host "Handoff verification passed."
