import base64
import json
import os
import re
import subprocess
import tempfile
import winreg

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_ICONS_DIR = os.path.join(ROOT_DIR, "assets", "icons")

_NOISE_TOKENS = {
    "microsoft", "corporation", "corp", "inc", "llc", "ltd", "the", "for",
    "windows", "desktop", "runtime", "redistributable", "package", "setup",
    "installer", "client", "app", "application", "version", "x64", "x86",
    "64", "32", "bit", "edition", "pro", "free", "components", "software",
    "update", "plugin", "extension", "and", "v14", "core"
}

_BUILTIN_ICON_RULES = [
    (["google chrome", "chrome"], "chrome"),
    (["cốc cốc", "coc coc", "coccoc"], "coccoc"),
    (["firefox", "mozilla firefox"], "firefox"),
    (["visual studio code", "vs code", "vscode"], "vscode"),
    (["node.js", "nodejs"], "nodejs"),
    (["docker desktop", "docker"], "docker-desktop"),
    (["notepad++", "notepad plus"], "notepadplusplus"),
    (["git for windows", "git ", "git"], "git"),
    (["mobaxterm"], "mobaxterm"),
    (["putty"], "putty"),
    (["postman"], "postman"),
    (["dbeaver"], "dbeaver"),
    (["winscp"], "winscp"),
    (["wireshark"], "wireshark"),
    (["nmap", "zenmap"], "nmap"),
    (["advanced ip scanner"], "advanced-ip-scanner"),
    (["openvpn"], "openvpn-connect"),
    (["tailscale"], "tailscale"),
    (["rustdesk"], "rustdesk"),
    (["teamviewer"], "teamviewer"),
    (["ultraviewer"], "ultraviewer"),
    (["anydesk"], "anydesk"),
    (["7-zip", "7zip"], "7zip"),
    (["winrar"], "winrar"),
    (["unikey"], "unikey"),
    (["vlc media", "vlc"], "vlc"),
    (["foxit"], "foxit-reader"),
    (["wps office"], "wps-office"),
    (["libreoffice"], "libreoffice"),
    (["microsoft 365", "microsoft office", "office 365", "office 20"], "office365"),
    (["visual c++", "vc++", "c++ redistributable"], "vcredist"),
    (["crystaldiskinfo"], "crystaldiskinfo"),
    (["hwmonitor"], "hwmonitor"),
    (["cpu-z", "cpuz"], "cpuz"),
    (["gpu-z", "gpuz"], "gpuz"),
    (["mem reduct", "memreduct"], "mem-reduct"),
    (["geek uninstaller"], "geek-uninstaller"),
    (["claude"], "claude"),
    (["chatgpt", "openai"], "chatgpt"),
    (["antigravity"], "antigravity"),
]

_MIME_BY_EXT = {
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".ico": "image/x-icon",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
}

_BUILTIN_DATA_URI_CACHE = {}


def _clean_tokens(text):
    if not text:
        return []
    words = re.findall(r"[a-z0-9]+", str(text).lower())
    return [w for w in words if len(w) >= 2 and w not in _NOISE_TOKENS]


def _parse_icon_spec(raw):
    """Tach DisplayIcon thanh (file_path_expanded, spec_with_optional_index)."""
    if not raw:
        return "", ""
    s = str(raw).strip()
    m = re.match(r'^(.+?),(-?\d+)$', s)
    if m:
        base = os.path.expandvars(m.group(1).strip().strip('"').strip("'"))
        idx = m.group(2).strip()
        return base, f"{base},{idx}"
    base = os.path.expandvars(s.strip('"').strip("'"))
    return base, base


def _is_generic_installer_exe(path):
    if not path:
        return True
    bn = os.path.basename(path).lower()
    if bn in ("msiexec.exe", "rundll32.exe", "cmd.exe", "powershell.exe"):
        return True
    return False


def _score_candidate_exe(exe_name, app_tokens, app_compact):
    stem = os.path.splitext(exe_name.lower())[0]
    if (
        stem.startswith("unins")
        or stem.startswith("uninstall")
        or stem in ("setup", "install", "update", "updater", "crashreporter", "createdump", "vc_redist", "elevate")
    ):
        return -100
    stem_clean = re.sub(r"[^a-z0-9]+", "", stem)
    if app_compact and stem_clean == app_compact:
        return 100
    if app_compact and (app_compact in stem_clean or (len(stem_clean) >= 4 and stem_clean in app_compact)):
        return 75
    score = 0
    for t in app_tokens:
        if t in stem:
            score += 20
    if score == 0:
        score = 5
    return score


def _find_best_icon_in_dir(directory, app_tokens, app_compact):
    if not directory or not os.path.isdir(directory):
        return ""
    dir_lower = directory.lower()
    if any(skip in dir_lower for skip in ("\\windows\\system32", "\\windows\\syswow64", "\\package cache", "\\windows\\temp")):
        return ""
    try:
        entries = list(os.scandir(directory))
    except Exception:
        return ""

    best_path = ""
    best_score = -999
    for entry in entries:
        if not entry.is_file():
            continue
        low = entry.name.lower()
        if low.endswith(".ico"):
            sc = _score_candidate_exe(entry.name, app_tokens, app_compact) + 15
            if sc > best_score:
                best_score = sc
                best_path = entry.path
        elif low.endswith(".exe"):
            sc = _score_candidate_exe(entry.name, app_tokens, app_compact)
            if sc > best_score:
                best_score = sc
                best_path = entry.path

    # Kiem tra them thu muc con cap 1 neu thu muc goc chi co bin/ hoac application/
    if best_score < 20:
        for entry in entries:
            if not entry.is_dir():
                continue
            dlow = entry.name.lower()
            if dlow in ("bin", "app", "application", "program", "resources", "client"):
                try:
                    for sub in os.scandir(entry.path):
                        if sub.is_file() and sub.name.lower().endswith((".exe", ".ico")):
                            sc = _score_candidate_exe(sub.name, app_tokens, app_compact)
                            if sub.name.lower().endswith(".ico"):
                                sc += 15
                            if sc > best_score:
                                best_score = sc
                                best_path = sub.path
                except Exception:
                    pass
    return best_path if best_score > 0 else ""


def _build_app_paths_index():
    """Doc HKLM/HKCU App Paths -> list (exe_stem, exe_path)."""
    entries = []
    for root in (winreg.HKEY_LOCAL_MACHINE, winreg.HKEY_CURRENT_USER):
        try:
            k = winreg.OpenKey(root, r"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths")
            cnt = winreg.QueryInfoKey(k)[0]
            for i in range(cnt):
                try:
                    sub_name = winreg.EnumKey(k, i)
                    sk = winreg.OpenKey(k, sub_name)
                    raw_val = winreg.QueryValueEx(sk, "")[0]
                    winreg.CloseKey(sk)
                    base, _ = _parse_icon_spec(raw_val)
                    if base and os.path.isfile(base):
                        stem = os.path.splitext(sub_name.lower())[0]
                        entries.append((stem, re.sub(r"[^a-z0-9]+", "", stem), base))
                except Exception:
                    pass
            winreg.CloseKey(k)
        except Exception:
            pass
    return entries


def _build_msi_product_icon_index():
    """Doc HKLM Installer\\Products ProductIcon (nếu hệ thống cho phép)."""
    mapping = {}
    for root, sub in (
        (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\Classes\Installer\Products"),
        (winreg.HKEY_CURRENT_USER, r"SOFTWARE\Microsoft\Installer\Products"),
    ):
        try:
            k = winreg.OpenKey(root, sub)
            cnt = winreg.QueryInfoKey(k)[0]
            for i in range(cnt):
                try:
                    sk = winreg.OpenKey(k, winreg.EnumKey(k, i))
                    pname = str(winreg.QueryValueEx(sk, "ProductName")[0]).strip()
                    picon = str(winreg.QueryValueEx(sk, "ProductIcon")[0]).strip()
                    winreg.CloseKey(sk)
                    base, spec = _parse_icon_spec(picon)
                    if pname and base and os.path.isfile(base):
                        mapping[pname.lower()] = spec
                except Exception:
                    pass
            winreg.CloseKey(k)
        except Exception:
            pass
    return mapping


def _build_start_menu_lnk_index():
    """Liet ke tat ca .lnk trong Start Menu & Desktop."""
    dirs = [
        r"C:\ProgramData\Microsoft\Windows\Start Menu\Programs",
        os.path.expandvars(r"%AppData%\Microsoft\Windows\Start Menu\Programs"),
        os.path.expandvars(r"%Public%\Desktop"),
        os.path.expandvars(r"%UserProfile%\Desktop"),
    ]
    lnks = []
    seen = set()
    for d in dirs:
        if not d or not os.path.isdir(d):
            continue
        try:
            for dp, _, files in os.walk(d):
                for fn in files:
                    if not fn.lower().endswith(".lnk"):
                        continue
                    stem = os.path.splitext(fn)[0].strip()
                    low_stem = stem.lower()
                    if "uninstall" in low_stem or low_stem in seen:
                        continue
                    seen.add(low_stem)
                    lnks.append((low_stem, re.sub(r"[^a-z0-9]+", "", low_stem), os.path.join(dp, fn)))
        except Exception:
            pass
    return lnks


def _build_program_folders_index():
    """Index nong cap 1-2 thu muc ProgramFiles/LocalAppData\\Programs de tim nhanh .exe khi Registry thieu InstallLocation."""
    roots = [
        os.environ.get("ProgramFiles", r"C:\Program Files"),
        os.environ.get("ProgramFiles(x86)", r"C:\Program Files (x86)"),
        os.path.expandvars(r"%LocalAppData%\Programs"),
    ]
    folders = []
    seen_dirs = set()
    for r in roots:
        if not r or not os.path.isdir(r):
            continue
        try:
            for e1 in os.scandir(r):
                if not e1.is_dir():
                    continue
                low1 = e1.name.lower()
                if low1 in ("common files", "windowsapps", "windows nt", "windows defender", "windows mail", "windows media player", "internet explorer", "uninstall information"):
                    continue
                if e1.path not in seen_dirs:
                    seen_dirs.add(e1.path)
                    folders.append((low1, re.sub(r"[^a-z0-9]+", "", low1), e1.path))
                try:
                    for e2 in os.scandir(e1.path):
                        if e2.is_dir():
                            low2 = e2.name.lower()
                            if e2.path not in seen_dirs:
                                seen_dirs.add(e2.path)
                                folders.append((f"{low1} {low2}", re.sub(r"[^a-z0-9]+", "", f"{low1}{low2}"), e2.path))
                except Exception:
                    pass
        except Exception:
            pass
    return folders


def _load_builtin_icon_data_uri(icon_stem):
    if icon_stem in _BUILTIN_DATA_URI_CACHE:
        return _BUILTIN_DATA_URI_CACHE[icon_stem]
    if not os.path.isdir(ASSETS_ICONS_DIR):
        return "", ""

    for ext in (".png", ".ico", ".svg", ".webp", ".jpg"):
        fp = os.path.join(ASSETS_ICONS_DIR, icon_stem + ext)
        if os.path.isfile(fp):
            try:
                with open(fp, "rb") as f:
                    b64 = base64.b64encode(f.read()).decode("ascii")
                mime = _MIME_BY_EXT.get(ext, "application/octet-stream")
                res = (f"data:{mime};base64,{b64}", f"/assets/icons/{icon_stem}{ext}")
                _BUILTIN_DATA_URI_CACHE[icon_stem] = res
                return res
            except Exception:
                pass
    _BUILTIN_DATA_URI_CACHE[icon_stem] = ("", "")
    return "", ""


def _make_runtime_badge_svg(label, bg_hex, fg_hex="#ffffff"):
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="36" height="36">'
        f'<rect x="2" y="2" width="32" height="32" rx="8" fill="{bg_hex}"/>'
        f'<text x="18" y="22.5" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" '
        f'font-size="11.5" font-weight="800" fill="{fg_hex}">{label}</text>'
        f'</svg>'
    )
    b64 = base64.b64encode(svg.encode("utf-8")).decode("ascii")
    return f"data:image/svg+xml;base64,{b64}"


def _resolve_fallback_icon(app_name, publisher=""):
    nl = (app_name or "").lower()
    pl = (publisher or "").lower()

    for keywords, stem in _BUILTIN_ICON_RULES:
        for kw in keywords:
            if kw in nl:
                data_uri, rel_url = _load_builtin_icon_data_uri(stem)
                if data_uri:
                    return data_uri, rel_url, "builtin_catalog"

    if "asp.net" in nl:
        return _make_runtime_badge_svg("ASP", "#512bd4"), "", "vendor_badge"
    if ".net" in nl or "desktop runtime" in nl or "dotnet" in nl:
        return _make_runtime_badge_svg(".NET", "#512bd4"), "", "vendor_badge"
    if "intel" in nl or "intel" in pl:
        return _make_runtime_badge_svg("intel", "#0068b5"), "", "vendor_badge"
    if "dell" in nl or "dell" in pl:
        return _make_runtime_badge_svg("DELL", "#007db8"), "", "vendor_badge"
    if "nvidia" in nl or "nvidia" in pl:
        return _make_runtime_badge_svg("NV", "#76b900"), "", "vendor_badge"
    if "amd" in nl or "radeon" in nl or "realtek" in nl:
        tag = "RTK" if "realtek" in nl else "AMD"
        col = "#0284c7" if tag == "RTK" else "#ed1c24"
        return _make_runtime_badge_svg(tag, col), "", "vendor_badge"
    if "microsoft" in nl or "microsoft" in pl or "windows" in nl:
        return _make_runtime_badge_svg("MS", "#0078d4"), "", "vendor_badge"

    return "", "", ""


def scan_installed_apps(extract_icons=True):
    keys = [
        (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall"),
        (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall"),
        (winreg.HKEY_CURRENT_USER, r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall"),
    ]

    app_paths_idx = _build_app_paths_index() if extract_icons else []
    msi_icon_idx = _build_msi_product_icon_index() if extract_icons else {}
    lnk_idx = _build_start_menu_lnk_index() if extract_icons else []
    prog_dirs_idx = _build_program_folders_index() if extract_icons else []

    apps = []
    seen = set()
    icon_specs_set = set()

    for root, path in keys:
        try:
            k = winreg.OpenKey(root, path)
            count = winreg.QueryInfoKey(k)[0]
            for i in range(count):
                try:
                    sub_name = winreg.EnumKey(k, i)
                    sub_k = winreg.OpenKey(k, sub_name)

                    def get_val(name):
                        try:
                            val = winreg.QueryValueEx(sub_k, name)[0]
                            return str(val).strip()
                        except Exception:
                            return ""

                    name = get_val("DisplayName")
                    system_comp = get_val("SystemComponent")
                    parent = get_val("ParentKeyName")

                    if not name or system_comp == "1" or parent:
                        winreg.CloseKey(sub_k)
                        continue

                    clean_name = name.strip()
                    if clean_name.lower() in seen:
                        winreg.CloseKey(sub_k)
                        continue
                    seen.add(clean_name.lower())

                    version = get_val("DisplayVersion")
                    publisher = get_val("Publisher")
                    install_date = get_val("InstallDate")
                    icon_raw = get_val("DisplayIcon")
                    location = os.path.expandvars(get_val("InstallLocation")) if get_val("InstallLocation") else ""
                    uninstall_str = get_val("UninstallString") or get_val("QuietUninstallString")
                    winreg.CloseKey(sub_k)

                    clean_date = install_date
                    if len(install_date) == 8 and install_date.isdigit():
                        clean_date = f"{install_date[6:8]}/{install_date[4:6]}/{install_date[:4]}"

                    app_tokens = _clean_tokens(clean_name)
                    app_compact = re.sub(r"[^a-z0-9]+", "", clean_name.lower())

                    icon_spec = ""
                    icon_display_path = ""
                    icon_source = ""

                    # 1. DisplayIcon (giu lai index neu co, bo qua msiexec/uninstall neu co lua chon tot hon)
                    base_ico, full_spec = _parse_icon_spec(icon_raw)
                    if base_ico and os.path.isfile(base_ico) and not _is_generic_installer_exe(base_ico):
                        icon_display_path = base_ico
                        icon_spec = full_spec
                        icon_source = "native_registry"

                    # 2. MSI ProductIcon (neu buoc 1 chua co)
                    if not icon_spec and msi_icon_idx:
                        msi_spec = msi_icon_idx.get(clean_name.lower(), "")
                        if msi_spec:
                            msi_base, _ = _parse_icon_spec(msi_spec)
                            if msi_base and os.path.isfile(msi_base) and not _is_generic_installer_exe(msi_base):
                                icon_display_path = msi_base
                                icon_spec = msi_spec
                                icon_source = "native_msi"

                    # 3. InstallLocation & UninstallString folder scan
                    if not icon_spec:
                        cand_dirs = []
                        if location and os.path.isdir(location):
                            cand_dirs.append(location)
                        if uninstall_str:
                            u_base, _ = _parse_icon_spec(uninstall_str.split(" /")[0].split(" -")[0])
                            if u_base:
                                u_dir = os.path.dirname(u_base)
                                if u_dir and os.path.isdir(u_dir) and u_dir not in cand_dirs:
                                    cand_dirs.append(u_dir)
                        for cdir in cand_dirs:
                            found = _find_best_icon_in_dir(cdir, app_tokens, app_compact)
                            if found:
                                icon_display_path = found
                                icon_spec = found
                                icon_source = "native_dir"
                                break

                    # 4. Registry App Paths match (vd: chrome.exe, code.exe, winrar.exe)
                    if not icon_spec and app_paths_idx:
                        best_ap = ""
                        best_ap_sc = 0
                        for ap_stem, ap_comp, ap_exe in app_paths_idx:
                            if len(ap_stem) < 3:
                                continue
                            if ap_comp == app_compact or (len(ap_comp) >= 4 and ap_comp in app_compact):
                                sc = 90 if ap_comp == app_compact else 65
                            elif any(t == ap_stem for t in app_tokens):
                                sc = 75
                            else:
                                sc = 0
                            if sc > best_ap_sc:
                                best_ap_sc = sc
                                best_ap = ap_exe
                        if best_ap:
                            icon_display_path = best_ap
                            icon_spec = best_ap
                            icon_source = "native_app_path"

                    # 5. Start Menu / Desktop .lnk shortcut match
                    if not icon_spec and lnk_idx:
                        best_lnk = ""
                        best_lnk_sc = 0
                        for lnk_low, lnk_comp, lnk_path in lnk_idx:
                            if lnk_low == clean_name.lower() or (app_compact and lnk_comp == app_compact):
                                sc = 100
                            elif app_compact and (app_compact in lnk_comp or (len(lnk_comp) >= 5 and lnk_comp in app_compact)):
                                sc = 75
                            elif app_tokens and sum(1 for t in app_tokens if t in lnk_low) >= max(1, min(2, len(app_tokens))):
                                sc = 50 + 10 * sum(1 for t in app_tokens if t in lnk_low)
                            else:
                                sc = 0
                            if sc > best_lnk_sc:
                                best_lnk_sc = sc
                                best_lnk = lnk_path
                        if best_lnk:
                            icon_display_path = best_lnk
                            icon_spec = best_lnk
                            icon_source = "native_lnk"

                    # 6. Shallow ProgramFiles / LocalAppData\Programs folder scan (cho app khong ghi InstallLocation nhu 4K Video Downloader+)
                    if not icon_spec and prog_dirs_idx and (app_tokens or len(app_compact) >= 5):
                        best_pf_dir = ""
                        best_pf_sc = 0
                        for dir_low, dir_comp, dir_path in prog_dirs_idx:
                            if len(dir_comp) < 4:
                                continue
                            if app_compact and (app_compact in dir_comp or dir_comp in app_compact):
                                sc = 80
                            elif app_tokens:
                                hits = sum(1 for t in app_tokens if t in dir_low)
                                sc = hits * 30 if hits > 0 else 0
                            else:
                                sc = 0
                            if sc > best_pf_sc:
                                best_pf_sc = sc
                                best_pf_dir = dir_path
                        if best_pf_dir and best_pf_sc >= 30:
                            found_pf = _find_best_icon_in_dir(best_pf_dir, app_tokens, app_compact)
                            if found_pf:
                                icon_display_path = found_pf
                                icon_spec = found_pf
                                icon_source = "native_progfiles"

                    if icon_spec:
                        icon_specs_set.add(icon_spec)

                    apps.append({
                        "name": clean_name,
                        "version": version or "N/A",
                        "publisher": publisher or "N/A",
                        "install_date": clean_date or "Chưa rõ",
                        "icon_path": icon_display_path,
                        "_icon_spec": icon_spec,
                        "icon_source": icon_source,
                        "icon_url": "",
                        "thumbnail": "",
                        "location": location,
                    })
                except Exception:
                    pass
            winreg.CloseKey(k)
        except Exception:
            pass

    # Batch extract icons via PowerShell if requested
    if extract_icons and icon_specs_set:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        ps_extractor = os.path.join(script_dir, "batch_extract_icons.ps1")
        if os.path.exists(ps_extractor):
            with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".json", delete=False) as f_in:
                json.dump(list(icon_specs_set), f_in, ensure_ascii=False)
                in_path = f_in.name

            with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".json", delete=False) as f_out:
                out_path = f_out.name

            try:
                cmd = [
                    "powershell.exe",
                    "-NoProfile",
                    "-ExecutionPolicy", "Bypass",
                    "-File", ps_extractor,
                    "-InputJsonPath", in_path,
                    "-OutputJsonPath", out_path,
                ]
                subprocess.run(cmd, capture_output=True, timeout=20)

                if os.path.exists(out_path):
                    with open(out_path, "r", encoding="utf-8-sig", errors="replace") as f:
                        content = f.read().strip()
                        if content:
                            icon_map = json.loads(content)
                            for app in apps:
                                spec = app.get("_icon_spec") or ""
                                if spec and spec in icon_map:
                                    app["thumbnail"] = icon_map[spec]
            except Exception:
                pass
            finally:
                for tmp in (in_path, out_path):
                    if os.path.exists(tmp):
                        try:
                            os.remove(tmp)
                        except Exception:
                            pass

    # Fallback: Gan icon tu thu vien assets/icons cua toolkit hoac badge hang cho cac runtime / app thieu file exe
    for app in apps:
        if not app.get("thumbnail"):
            fb_uri, fb_url, fb_src = _resolve_fallback_icon(app.get("name", ""), app.get("publisher", ""))
            if fb_uri:
                app["thumbnail"] = fb_uri
                app["icon_url"] = fb_url
                app["icon_source"] = fb_src
        app.pop("_icon_spec", None)

    apps.sort(key=lambda x: x["name"].lower())
    return apps


if __name__ == "__main__":
    result = scan_installed_apps()
    has_thumbs = sum(1 for a in result if a.get("thumbnail"))
    native_thumbs = sum(1 for a in result if str(a.get("icon_source", "")).startswith("native"))
    print(f"Scanned {len(result)} apps. Thumbnails: {has_thumbs}/{len(result)} (native binary/lnk: {native_thumbs}).")
    for app in result[:10]:
        thumb_len = len(app.get("thumbnail", ""))
        print(f"- {app['name']} (v{app['version']}) | src={app.get('icon_source') or 'none'} | Thumb: {thumb_len} chars")
