import os
import sys
import subprocess

def create_desktop_shortcut(target_exe, shortcut_name, working_dir=None, icon_path=None, description=""):
    """
    Tao loi tat (.lnk) tren Desktop cho ung dung
    Tuong thich 100% Windows khong can cai them thu vien nao khac
    """
    if not os.path.exists(target_exe):
        return False, f"Target exe not found: {target_exe}"

    if not working_dir:
        working_dir = os.path.dirname(target_exe)

    # Lay duong dan Desktop cua user hien tai
    desktop_dir = os.path.join(os.environ.get("USERPROFILE", "C:\\Users\\Default"), "Desktop")
    if not os.path.exists(desktop_dir):
        desktop_dir = os.path.join(os.environ.get("PUBLIC", "C:\\Users\\Public"), "Desktop")

    shortcut_path = os.path.join(desktop_dir, f"{shortcut_name}.lnk")

    # Su dung PowerShell de tao WScript.Shell shortcut
    ps_cmd = (
        f"$ws = New-Object -ComObject WScript.Shell; "
        f"$s = $ws.CreateShortcut('{shortcut_path}'); "
        f"$s.TargetPath = '{target_exe}'; "
        f"$s.WorkingDirectory = '{working_dir}'; "
    )
    if icon_path and os.path.exists(icon_path):
        ps_cmd += f"$s.IconLocation = '{icon_path}'; "
    if description:
        ps_cmd += f"$s.Description = '{description}'; "
    ps_cmd += "$s.Save()"

    try:
        res = subprocess.run(
            ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps_cmd],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=10
        )
        if res.returncode == 0 and os.path.exists(shortcut_path):
            return True, shortcut_path
        else:
            return False, res.stderr.strip() or "Khong the tao shortcut"
    except Exception as e:
        return False, str(e)

if __name__ == "__main__":
    ok, path = create_desktop_shortcut("C:\\Program Files\\WinRAR\\WinRAR.exe", "WinRAR")
    print("Result:", ok, path)
