export function getHelpOutput() {
  return (
    `[root@reactor ~]# help\n` +
    `Reactor Root Shell v2.0 - Available Commands:\n\n` +
    `  [System Info & Diagnostics]\n` +
    `  • uname -a            Print kernel version & CPU architecture\n` +
    `  • whoami              Show current operator privileges & UID/GID\n` +
    `  • free -h             Check system memory & swap statistics\n` +
    `  • power / dynamo      Check homelab kinetic reactor energy stats\n` +
    `  • ls -la              List directory contents and file modes\n` +
    `  • cat flag.txt        Read homelab privilege escalation flag\n` +
    `  • cat classified.env  Inspect sanitized reactor environment vars\n\n` +
    `  [System Controls]\n` +
    `  • rm -rf /            Test Reactor Homelab Safety Guard defense\n` +
    `  • systemctl reboot    Trigger simulated container node reboot\n` +
    `  • cat /etc/shadow     Read mock encrypted shadow file\n` +
    `  • clear               Clear terminal screen buffer\n\n` +
    `  [Visual Effects - Root Powers]\n` +
    `  • matrix              Toggle Matrix digital rain & phosphor green\n` +
    `  • invert              Reverse display color polarity\n` +
    `  • glitch              Trigger CRT monitor scanline interference\n` +
    `  • flip                Australian 180° upside-down viewport\n` +
    `  • party               Engage reactor disco spectrum strobe\n` +
    `  • reset               Clear all visual effects & restore normal view`
  );
}

export function getUnameOutput() {
  return (
    `[root@reactor ~]# uname -a\n` +
    `Linux reactor 6.12.0-206.104.4.4.el10uek.aarch64 #1 SMP PREEMPT_DYNAMIC aarch64 GNU/Linux`
  );
}

export function getWhoamiOutput() {
  return (
    `[root@reactor ~]# whoami\n` +
    `root (uid=0 gid=0) · operator status: active · all nodes online`
  );
}

export function getFreeOutput(cleanCmd, isVi) {
  return (
    `[root@reactor ~]# ${cleanCmd}\n` +
    `               total        used        free      shared  buff/cache   available\n` +
    `Mem:           128Ti        0.0B       128Ti        0.0B        0.0B       128Ti\n` +
    `Swap:          512Ti        0.0B       512Ti\n\n` +
    `Notice: 128 TiB RAM successfully downloaded from downloadmoreram.com 🚀\n\n` +
    (isVi
      ? `Meme đấy, đừng có lên mạng tìm web tải RAM thật nhé. RAM là thanh phần cứng cắm trên bo mạch, không có chuyện bấm download về được đâu.`
      : `Classic internet meme. RAM is physical hardware, you can't download it through a browser. Don't run executable files from fake RAM sites.`)
  );
}

export function getLsOutput(cleanCmd) {
  return (
    `[root@reactor ~]# ${cleanCmd}\n` +
    `total 36\n` +
    `drwx------ 4 root root 4096 Oct 17 18:25 .\n` +
    `drwxr-xr-x 19 root root 4096 Oct 17 00:00 ..\n` +
    `-rw------- 1 root root  420 Oct 17 12:00 .bash_history\n` +
    `drwx------ 2 root root 4096 Oct 17 12:00 .ssh\n` +
    `-rw-r--r-- 1 root root  256 Oct 17 18:25 classified.env\n` +
    `-rw-r--r-- 1 root root 1337 Oct 17 18:25 flag.txt`
  );
}

export function getFlagOutput() {
  return `[root@reactor ~]# cat flag.txt\nnnt{r00t_m0d3_3sc4l4t10n_succ3ssful_oci_1001} 🏆`;
}

export function getClassifiedEnvOutput() {
  return (
    `[root@reactor ~]# cat classified.env\n` +
    `OPERATOR_CAFFEINE_LEVEL=0%\n` +
    `FAVORITE_DISTRO=arch_linux_btw\n` +
    `PIZZA_ORDERING_API=extra_cheese_pepperoni_enabled\n` +
    `DNS_ROOT_CAUSE=always_the_dns\n` +
    `YAML_INDENTATION_ERRORS=4294967295\n` +
    `CAT_SLEEPING_ON_KEYBOARD=true\n` +
    `WHY_SELF_HOST=because_the_cloud_is_just_someone_elses_computer`
  );
}

export function getShadowOutput() {
  return (
    `[root@reactor ~]# cat /etc/shadow\n` +
    `root:$6$reactor$k8s_is_bloated_use_compose:19700:0:99999:7:::\n` +
    `nnt:$6$oracle$homelab_master_key_never_share:19700:0:99999:7:::\n` +
    `fish:$6$ocean$salmon_sushi_delicious_10/10:19700:0:99999:7:::`
  );
}

export function getRmRfOutput(cleanCmd, isVi) {
  return isVi
    ? `[root@reactor /]# ${cleanCmd}\n` +
      `rm: cannot remove '/': Bị chặn rồi nhé. Toàn bộ container với dữ liệu vẫn nguyên vẹn, phá sao được.`
    : `[root@reactor /]# ${cleanCmd}\n` +
      `rm: cannot remove '/': Permission denied. All containers and configs are fine, nice try though.`;
}

export function getRebootOutput(cleanCmd, isVi) {
  return isVi
    ? `[root@reactor ~]# ${cleanCmd}\n` +
      `Broadcast message from root@reactor (pts/0):\n` +
      `The system is going down for reboot NOW!\n` +
      `... Khởi động lại xong. Uptime: 0 ngày, 0 giờ, 1 giây. Nói đùa thôi chứ server vẫn online.`
    : `[root@reactor ~]# ${cleanCmd}\n` +
      `Broadcast message from root@reactor (pts/0):\n` +
      `The system is going down for reboot NOW!\n` +
      `... Rebooted cleanly. Uptime: 0 days, 0 hours, 1 second. Just kidding, still online.`;
}

export function getPowerOutput(isVi) {
  let lifetime = 0;
  let record = 0;
  try {
    lifetime = parseInt(localStorage.getItem("nnt:power_lifetime") || "0", 10) || 0;
    record = parseInt(localStorage.getItem("nnt:power_record") || "0", 10) || 0;
  } catch {
    // Ignore
  }

  const estWh = (lifetime * 1.5).toFixed(1);
  return (
    `[root@reactor ~]# power\n` +
    `=== HOMELAB KINETIC DYNAMO GRID ===\n` +
    (isVi
      ? `Điện năng tích lũy:     ${estWh} Wh (${lifetime} vòng quay rotor)\n` +
        `Kỷ lục phiên liên tục:  ${record} vòng quay\n` +
        `Trạng thái máy phát:    ${record >= 300 ? "[Tổ máy số 1] Đủ sạc xe máy điện đi chợ về 🔋" : record >= 50 ? "[Ổn định] Đủ điện nuôi server homelab 🖥️" : "[Standby] Đang chờ thêm lực quay tay 🌀"}\n\n` +
        `Tip: Chạm vào logo NNT ở footer để tiếp tục phát điện nuôi server.`
      : `Lifetime Grid Energy:   ${estWh} Wh (${lifetime} rotor revs)\n` +
        `Peak Continuous Streak: ${record} revs\n` +
        `Dynamo Status:          ${record >= 300 ? "[Turbine Unit 1] Enough juice for an e-scooter run 🔋" : record >= 50 ? "[Nominal] Powering homelab mini-PC 🖥️" : "[Standby] Waiting for kinetic force 🌀"}\n\n` +
        `Tip: Tap the NNT logo at the footer to feed kinetic energy into the server.`)
  );
}

