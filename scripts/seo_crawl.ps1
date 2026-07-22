Param(
    [string]$Out = "D:\\pubudu-portfolio\\seo_audit_initial.csv"
)

$files = Get-ChildItem -Path . -Recurse -Include *.html,*.htm -File -ErrorAction SilentlyContinue
$rows = @()

foreach ($f in $files) {
    $content = ""
    try { $content = Get-Content -Raw -Path $f.FullName -ErrorAction Stop } catch {}

    $title = ([regex]::Match($content, "(?si)<title[^>]*>(.*?)</title>")).Groups[1].Value.Trim()

    $metaDesc = ([regex]::Match($content, "(?si)<meta\s+name=[\"\"']description[\"\"']\s+content=[\"\"'](.*?)[\"\"']")).Groups[1].Value.Trim()
    if (-not $metaDesc) { $metaDesc = ([regex]::Match($content, "(?si)<meta\s+content=[\"\"'](.*?)[\"\"']\s+name=[\"\"']description[\"\"']")).Groups[1].Value.Trim() }

    $canonical = ([regex]::Match($content, "(?si)<link\s+rel=[\"\"']canonical[\"\"']\s+href=[\"\"'](.*?)[\"\"']")).Groups[1].Value.Trim()
    $robotsMeta = ([regex]::Match($content, "(?si)<meta\s+name=[\"\"']robots[\"\"']\s+content=[\"\"'](.*?)[\"\"']")).Groups[1].Value.Trim()
    $h1 = ([regex]::Match($content, "(?si)<h1[^>]*>(.*?)</h1>")).Groups[1].Value.Trim()

    $linkMatches = [regex]::Matches($content, "(?si)<a\b[^>]*\bhref=[\"\"']([^\"\"']+)[\"\"']")
    $internal = 0; $external = 0
    foreach ($lm in $linkMatches) {
        $href = $lm.Groups[1].Value
        if ($href -match '^(?:https?:)?//') { $external++ }
        elseif ($href -match '^mailto:' -or $href -match '^tel:') { $external++ }
        else { $internal++ }
    }

    $rows += [PSCustomObject]@{
        Path = $f.FullName
        Title = $title
        MetaDescription = $metaDesc
        Canonical = $canonical
        RobotsMeta = $robotsMeta
        H1 = $h1
        InternalLinks = $internal
        ExternalLinks = $external
        FileSize = $f.Length
    }
}

$rows | Export-Csv -Path $Out -NoTypeInformation -Encoding UTF8
Write-Output "CSV written to: $Out"
$root = Get-Location
Write-Output "robots.txt present: $(Test-Path (Join-Path $root 'robots.txt'))"
Write-Output "sitemap.xml present: $(Test-Path (Join-Path $root 'sitemap.xml'))"
