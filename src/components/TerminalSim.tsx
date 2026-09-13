import { useState, useRef, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Send } from 'lucide-react';
import type { Exercise } from '../types';

interface TerminalSimProps {
  exercise: Exercise;
  isCompleted: boolean;
  onComplete: () => void;
  onSuccess: () => void;
}

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  content: string;
}

// Simulated file system
type FSNode = {
  type: 'dir';
  children: Record<string, FSNode>;
} | {
  type: 'file';
  content: string;
};

type FileSystem = Record<string, FSNode>;

const createFileSystem = (): FileSystem => ({
  '/home/student': {
    type: 'dir',
    children: {
      'Documents': { type: 'dir', children: {} },
      'Downloads': { type: 'dir', children: {} },
      'readme.txt': { type: 'file', content: 'Welcome to Bash Tutorial!\nThis is your home directory.' },
    }
  }
});

function simulateCommand(
  cmd: string, 
  cwd: string, 
  fs: FileSystem,
  env: Record<string, string>
): { output: string; newCwd: string; newFs: FileSystem; isError: boolean } {
  const trimmed = cmd.trim();
  if (!trimmed) return { output: '', newCwd: cwd, newFs: fs, isError: false };

  const parts = trimmed.split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);

  // Helper to resolve path
  const resolvePath = (p: string): string => {
    if (p.startsWith('/')) return p;
    if (p.startsWith('~')) return '/home/student' + p.slice(1);
    if (p === '..') return cwd.split('/').slice(0, -1).join('/') || '/';
    if (p === '.') return cwd;
    if (p === '-') return env['OLDPWD'] || cwd;
    return cwd.endsWith('/') ? cwd + p : cwd + '/' + p;
  };

  // Helper to get node at path
  const getNode = (path: string): FSNode | null => {
    if (path === '/') return { type: 'dir', children: { 'home': { type: 'dir', children: { 'student': fs['/home/student'] as any } } } };
    const parts = path.split('/').filter(Boolean);
    let current: any = { type: 'dir', children: { home: { type: 'dir', children: { student: fs['/home/student'] } } } };
    
    for (const part of parts) {
      if (current.type !== 'dir') return null;
      if (!current.children[part]) return null;
      current = current.children[part];
    }
    return current;
  };

  switch (command) {
    case 'echo': {
      let text = args.join(' ');
      // Handle variable substitution
      text = text.replace(/\$HOME/g, '/home/student');
      text = text.replace(/\$USER/g, 'student');
      text = text.replace(/\$PWD/g, cwd);
      text = text.replace(/\$SHELL/g, '/bin/bash');
      text = text.replace(/\$HOSTNAME/g, 'bash-tutorial');
      text = text.replace(/\$\?/g, '0');
      // Handle quotes
      if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
        text = text.slice(1, -1);
      }
      // Handle redirection to file
      const redirMatch = text.match(/^(.+?)\s*>\s*(.+)$/);
      if (redirMatch) {
        const content = redirMatch[1].replace(/^["']|["']$/g, '');
        const filename = redirMatch[2].trim();
        const filepath = resolvePath(filename);
        const dirPath = filepath.substring(0, filepath.lastIndexOf('/')) || '/home/student';
        const fileName = filepath.substring(filepath.lastIndexOf('/') + 1);
        
        // Add file to fs
        const newFs = { ...fs };
        if (!newFs['/home/student']) newFs['/home/student'] = { type: 'dir', children: {} };
        const studentDir = newFs['/home/student'] as any;
        studentDir.children[fileName] = { type: 'file', content };
        return { output: '', newCwd: cwd, newFs, isError: false };
      }
      return { output: text, newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'pwd':
      return { output: cwd, newCwd: cwd, newFs: fs, isError: false };
    
    case 'whoami':
      return { output: 'student', newCwd: cwd, newFs: fs, isError: false };
    
    case 'hostname':
      return { output: 'bash-tutorial', newCwd: cwd, newFs: fs, isError: false };
    
    case 'date':
      return { output: new Date().toString(), newCwd: cwd, newFs: fs, isError: false };
    
    case 'cd': {
      const target = args[0] || '~';
      const newPath = resolvePath(target);
      const node = getNode(newPath);
      if (node && node.type === 'dir') {
        const oldPwd = env['PWD'] || cwd;
        env['OLDPWD'] = oldPwd;
        env['PWD'] = newPath;
        return { output: '', newCwd: newPath, newFs: fs, isError: false };
      }
      return { output: `bash: cd: ${target}: No such file or directory`, newCwd: cwd, newFs: fs, isError: true };
    }
    
    case 'ls': {
      const target = args.find(a => !a.startsWith('-')) || cwd;
      const path = resolvePath(target);
      const node = getNode(path);
      
      if (!node) return { output: `ls: cannot access '${target}': No such file or directory`, newCwd: cwd, newFs: fs, isError: true };
      if (node.type !== 'dir') return { output: target, newCwd: cwd, newFs: fs, isError: false };
      
      const longFormat = args.some(a => a.includes('l'));
      const entries = Object.entries(node.children);
      
      if (longFormat) {
        const lines = entries.map(([name, n]) => {
          const isDir = n.type === 'dir';
          const perms = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
          const size = isDir ? '4096' : (n as any).content?.length?.toString() || '0';
          return `${perms}  1 student student ${size.padStart(5)} Jan  1 00:00 ${name}`;
        });
        return { output: lines.join('\n') || '', newCwd: cwd, newFs: fs, isError: false };
      }
      
      return { output: entries.map(([name]) => name).join('  '), newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'touch': {
      const newFs = JSON.parse(JSON.stringify(fs));
      for (const filename of args) {
        if (filename.startsWith('-')) continue;
        const filepath = resolvePath(filename);
        const dirPath = cwd;
        const fileName = filename;
        
        if (!newFs['/home/student']) newFs['/home/student'] = { type: 'dir', children: {} };
        const studentDir = newFs['/home/student'] as any;
        if (!studentDir.children[fileName]) {
          studentDir.children[fileName] = { type: 'file', content: '' };
        }
      }
      return { output: '', newCwd: cwd, newFs, isError: false };
    }
    
    case 'mkdir': {
      const newFs = JSON.parse(JSON.stringify(fs));
      const recursive = args.includes('-p');
      const dirs = args.filter(a => !a.startsWith('-'));
      
      for (const dir of dirs) {
        if (!newFs['/home/student']) newFs['/home/student'] = { type: 'dir', children: {} };
        const studentDir = newFs['/home/student'] as any;
        
        if (dir.includes('/')) {
          const parts = dir.split('/').filter(Boolean);
          let current = studentDir;
          for (const part of parts) {
            if (!current.children[part]) {
              if (!recursive && parts.indexOf(part) < parts.length - 1) {
                return { output: `mkdir: cannot create directory '${dir}': No such file or directory`, newCwd: cwd, newFs: fs, isError: true };
              }
              current.children[part] = { type: 'dir', children: {} };
            }
            current = current.children[part];
          }
        } else {
          studentDir.children[dir] = { type: 'dir', children: {} };
        }
      }
      return { output: '', newCwd: cwd, newFs, isError: false };
    }
    
    case 'cp': {
      const newFs = JSON.parse(JSON.stringify(fs));
      const cpArgs = args.filter(a => !a.startsWith('-'));
      if (cpArgs.length >= 2) {
        const src = cpArgs[0];
        const dst = cpArgs[1];
        const studentDir = newFs['/home/student'] as any;
        const srcNode = studentDir.children[src];
        if (srcNode) {
          studentDir.children[dst] = JSON.parse(JSON.stringify(srcNode));
        }
      }
      return { output: '', newCwd: cwd, newFs, isError: false };
    }
    
    case 'mv': {
      const newFs = JSON.parse(JSON.stringify(fs));
      const mvArgs = args.filter(a => !a.startsWith('-'));
      if (mvArgs.length >= 2) {
        const src = mvArgs[0];
        const dst = mvArgs[1];
        const studentDir = newFs['/home/student'] as any;
        if (studentDir.children[src]) {
          studentDir.children[dst] = studentDir.children[src];
          delete studentDir.children[src];
        }
      }
      return { output: '', newCwd: cwd, newFs, isError: false };
    }
    
    case 'rm': {
      const newFs = JSON.parse(JSON.stringify(fs));
      const rmArgs = args.filter(a => !a.startsWith('-'));
      const studentDir = newFs['/home/student'] as any;
      for (const file of rmArgs) {
        delete studentDir.children[file];
      }
      return { output: '', newCwd: cwd, newFs, isError: false };
    }
    
    case 'cat': {
      if (args.length === 0) return { output: '', newCwd: cwd, newFs: fs, isError: false };
      const filename = args[0];
      const studentDir = (fs['/home/student'] as any);
      const fileNode = studentDir?.children?.[filename];
      if (fileNode && fileNode.type === 'file') {
        return { output: fileNode.content, newCwd: cwd, newFs: fs, isError: false };
      }
      // Check well-known files
      if (filename === '/etc/passwd') {
        return { output: 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nstudent:x:1000:1000:Student:/home/student:/bin/bash', newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: `cat: ${filename}: No such file or directory`, newCwd: cwd, newFs: fs, isError: true };
    }
    
    case 'head': {
      const filename = args.find(a => !a.startsWith('-')) || '';
      const studentDir = (fs['/home/student'] as any);
      const fileNode = studentDir?.children?.[filename];
      if (fileNode && fileNode.type === 'file') {
        const lines = fileNode.content.split('\n').slice(0, 10);
        return { output: lines.join('\n'), newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: `head: cannot open '${filename}': No such file or directory`, newCwd: cwd, newFs: fs, isError: true };
    }
    
    case 'tail': {
      const filename = args.find(a => !a.startsWith('-')) || '';
      const studentDir = (fs['/home/student'] as any);
      const fileNode = studentDir?.children?.[filename];
      if (fileNode && fileNode.type === 'file') {
        const lines = fileNode.content.split('\n').slice(-10);
        return { output: lines.join('\n'), newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: `tail: cannot open '${filename}': No such file or directory`, newCwd: cwd, newFs: fs, isError: true };
    }
    
    case 'wc': {
      const filename = args.find(a => !a.startsWith('-')) || '';
      const studentDir = (fs['/home/student'] as any);
      const fileNode = studentDir?.children?.[filename];
      if (fileNode && fileNode.type === 'file') {
        const lines = fileNode.content.split('\n').length;
        const words = fileNode.content.split(/\s+/).filter(Boolean).length;
        const bytes = fileNode.content.length;
        if (args.some(a => a.includes('l'))) return { output: `${lines} ${filename}`, newCwd: cwd, newFs: fs, isError: false };
        return { output: ` ${lines}  ${words} ${bytes} ${filename}`, newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: `wc: ${filename}: No such file or directory`, newCwd: cwd, newFs: fs, isError: true };
    }
    
    case 'grep': {
      const grepArgs = args.filter(a => !a.startsWith('-'));
      const pattern = grepArgs[0] || '';
      const filename = grepArgs[1] || '';
      
      if (filename === '/etc/passwd') {
        const content = 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nstudent:x:1000:1000:Student:/home/student:/bin/bash';
        const lines = content.split('\n').filter(l => l.includes(pattern));
        return { output: lines.join('\n'), newCwd: cwd, newFs: fs, isError: false };
      }
      
      // Handle pipe input (simulated)
      const studentDir = (fs['/home/student'] as any);
      const fileNode = studentDir?.children?.[filename];
      if (fileNode && fileNode.type === 'file') {
        const lines = fileNode.content.split('\n').filter((l: string) => l.includes(pattern));
        return { output: lines.join('\n'), newCwd: cwd, newFs: fs, isError: false };
      }
      
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'find': {
      const findDir = args.find(a => !a.startsWith('-') && !a.includes('=')) || '.';
      const nameArg = args.find(a => a.startsWith('-name'));
      const nameIdx = args.indexOf(nameArg || '');
      const pattern = nameArg ? args[nameIdx + 1]?.replace(/"/g, '').replace(/'/g, '') : '';
      
      if (findDir === '/etc' && pattern === '*.conf') {
        return { output: '/etc/resolv.conf\n/etc/host.conf\n/etc/adduser.conf\n/etc/debconf.conf\n/etc/kernel-img.conf\n/etc/ld.so.conf\n/etc/sysctl.conf', newCwd: cwd, newFs: fs, isError: false };
      }
      
      // Search in home
      const studentDir = (fs['/home/student'] as any);
      if (studentDir) {
        const results: string[] = [];
        const searchDir = (dir: any, path: string) => {
          for (const [name, node] of Object.entries(dir.children || {}) as [string, any][]) {
            const fullPath = path + '/' + name;
            if (node.type === 'file' && (!pattern || name.match(new RegExp(pattern.replace(/\*/g, '.*'))))) {
              results.push(fullPath);
            }
            if (node.type === 'dir') searchDir(node, fullPath);
          }
        };
        searchDir(studentDir, '/home/student');
        return { output: results.join('\n'), newCwd: cwd, newFs: fs, isError: false };
      }
      
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'sort': {
      const filename = args.find(a => !a.startsWith('-')) || '';
      const studentDir = (fs['/home/student'] as any);
      const fileNode = studentDir?.children?.[filename];
      if (fileNode && fileNode.type === 'file') {
        const lines = fileNode.content.split('\n').sort();
        return { output: lines.join('\n'), newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'uniq': {
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'sed': {
      // Handle piped sed
      const sedExpr = args[0] || '';
      const match = sedExpr.match(/s\/(.+?)\/(.+?)\/g?/);
      if (match) {
        const [, from, to] = match;
        // Check if there's piped input (simulated)
        return { output: `Command executed: sed '${sedExpr}'`, newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'awk': {
      return { output: 'root\ndaemon\nstudent', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'ps': {
      return { output: '  PID TTY          TIME CMD\n    1 ?        00:00:01 systemd\n  100 ?        00:00:00 bash\n  200 pts/0    00:00:00 ps', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'chmod': {
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'man': {
      const topic = args[0] || '';
      return { output: `${topic.toUpperCase()}(1)                User Commands                ${topic.toUpperCase()}(1)\n\nNAME\n       ${topic} - simulated manual page\n\nSYNOPSIS\n       See documentation for usage.\n\n(Press 'q' to quit)`, newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'env': {
      return { output: 'HOME=/home/student\nUSER=student\nSHELL=/bin/bash\nPWD=' + cwd + '\nPATH=/usr/local/bin:/usr/bin:/bin\nHOSTNAME=bash-tutorial', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'clear':
      return { output: '__CLEAR__', newCwd: cwd, newFs: fs, isError: false };
    
    case 'help':
      return { output: 'Доступные команды: echo, pwd, ls, cd, touch, mkdir, cp, mv, rm, cat, head, tail, wc, grep, find, sort, sed, awk, ps, chmod, chown, whoami, hostname, date, env, man, clear, systemctl, journalctl, df, du, free, uptime, uname, crontab, ping, ss, netstat, tar, gzip, zip, ssh, scp, curl, wget, ip, dig, top, kill, nice, rsync\n\nПопробуйте выполнить задание!', newCwd: cwd, newFs: fs, isError: false };
    
    case 'chown':
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'systemctl': {
      const subCmd = args[0] || '';
      const service = args[1] || '';
      if (subCmd === 'status') {
        return { output: `● ${service || 'service'}.service - Service Description\n   Loaded: loaded (/lib/systemd/system/${service || 'service'}.service; enabled)\n   Active: active (running) since Mon 2024-01-01 00:00:00 UTC\n   Main PID: 1234 (service)\n   Tasks: 5\n   Memory: 50.0M\n   CGroup: /system.slice/${service || 'service'}.service`, newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === 'list-timers') {
        return { output: 'NEXT                        LEFT          LAST                        PASSED       UNIT                         ACTIVATES\nMon 2024-01-01 00:00:00 UTC  12h left      Sun 2023-12-31 00:00:00 UTC  12h ago      logrotate.timer              logrotate.service\nMon 2024-01-01 06:00:00 UTC  18h left      Sun 2023-12-31 06:00:00 UTC  6h ago       apt-daily.timer              apt-daily.service', newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === 'start' || subCmd === 'stop' || subCmd === 'restart' || subCmd === 'reload') {
        return { output: '', newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === 'enable' || subCmd === 'disable') {
        return { output: '', newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === 'is-active') {
        return { output: 'active', newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'journalctl': {
      return { output: '-- Logs begin at Mon 2024-01-01 00:00:00 UTC --\nJan 01 00:00:01 bash-tutorial systemd[1]: Started Service.\nJan 01 00:00:02 bash-tutorial nginx[1234]: Starting nginx...\nJan 01 00:00:03 bash-tutorial nginx[1234]: Ready to accept connections.', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'df':
      return { output: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        50G   20G   28G  42% /\ntmpfs           3.9G     0  3.9G   0% /dev/shm\n/dev/sda2       100G   45G   51G  47% /home', newCwd: cwd, newFs: fs, isError: false };
    
    case 'du': {
      const target = args.find(a => !a.startsWith('-')) || '.';
      if (args.includes('-sh') || args.some(a => a.includes('s') && a.includes('h'))) {
        return { output: '2.5G\t' + target, newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: '1.2G\t./src\n800M\t./node_modules\n500M\t./dist\n2.5G\t.', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'free':
      return { output: '              total        used        free      shared  buff/cache   available\nMem:          7.7Gi       3.2Gi       2.1Gi       256Mi       2.4Gi       4.0Gi\nSwap:         2.0Gi          0B       2.0Gi', newCwd: cwd, newFs: fs, isError: false };
    
    case 'uptime':
      return { output: ' 12:34:56 up 42 days,  3:21,  2 users,  load average: 0.15, 0.10, 0.05', newCwd: cwd, newFs: fs, isError: false };
    
    case 'uname':
      return { output: 'Linux bash-tutorial 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux', newCwd: cwd, newFs: fs, isError: false };
    
    case 'crontab': {
      if (args.includes('-l')) {
        return { output: '# Edit this file to introduce tasks to be run by cron.\n# m h  dom mon dow   command\n0 3 * * * /usr/local/bin/backup.sh\n*/5 * * * * /usr/local/bin/check.sh', newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'ping': {
      const target = args.find(a => !a.startsWith('-')) || 'localhost';
      return { output: `PING ${target} (93.184.216.34) 56(84) bytes of data.\n64 bytes from ${target} (93.184.216.34): icmp_seq=1 ttl=56 time=12.3 ms\n64 bytes from ${target} (93.184.216.34): icmp_seq=2 ttl=56 time=11.8 ms\n64 bytes from ${target} (93.184.216.34): icmp_seq=3 ttl=56 time=12.1 ms\n64 bytes from ${target} (93.184.216.34): icmp_seq=4 ttl=56 time=11.9 ms\n\n--- ${target} ping statistics ---\n4 packets transmitted, 4 received, 0% packet loss, time 3004ms\nrtt min/avg/max/mdev = 11.8/12.0/12.3/0.2 ms`, newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'ss':
      return { output: 'State     Recv-Q    Send-Q    Local Address:Port    Peer Address:Port    Process\nLISTEN    0         128       0.0.0.0:22              0.0.0.0:*              users:(("sshd",pid=1234))\nLISTEN    0         128       0.0.0.0:80              0.0.0.0:*              users:(("nginx",pid=5678))\nLISTEN    0         128       0.0.0.0:443             0.0.0.0:*              users:(("nginx",pid=5678))\nESTAB     0         0         192.168.1.10:22         192.168.1.5:54321      users:(("sshd",pid=1234))', newCwd: cwd, newFs: fs, isError: false };
    
    case 'netstat':
      return { output: 'Active Internet connections (servers and established)\nProto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name\ntcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1234/sshd\ntcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      5678/nginx\ntcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN      5678/nginx', newCwd: cwd, newFs: fs, isError: false };
    
    case 'tar': {
      if (args.some(a => a.includes('c'))) {
        return { output: args.includes('v') ? 'projects/\nprojects/src/\nprojects/src/index.js\nprojects/package.json' : '', newCwd: cwd, newFs: fs, isError: false };
      }
      if (args.some(a => a.includes('x'))) {
        return { output: args.includes('v') ? 'projects/\nprojects/src/\nprojects/src/index.js\nprojects/package.json' : '', newCwd: cwd, newFs: fs, isError: false };
      }
      if (args.some(a => a.includes('t'))) {
        return { output: 'projects/\nprojects/src/\nprojects/src/index.js\nprojects/package.json', newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'gzip':
    case 'gunzip':
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'zip':
    case 'unzip':
      return { output: args.includes('-l') ? 'Archive: archive.zip\n  Length      Date    Time    Name\n---------  ---------- -----   ----\n     1234  01-01-2024 00:00   file.txt\n     5678  01-01-2024 00:00   dir/file2.txt\n---------                     -------\n     6912                     2 files' : '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'ssh':
      return { output: 'Welcome to Ubuntu 22.04.3 LTS\nLast login: Mon Jan 1 00:00:00 2024 from 192.168.1.5\nstudent@server:~$', newCwd: cwd, newFs: fs, isError: false };
    
    case 'scp':
      return { output: 'file.txt          100%  1234     1.2MB/s   00:01', newCwd: cwd, newFs: fs, isError: false };
    
    case 'rsync':
      return { output: 'sending incremental file list\n./\nfile1.txt\nfile2.txt\n\nsent 1,234 bytes  received 100 bytes  2,668.00 bytes/sec\ntotal size is 5,678  speedup is 4.27', newCwd: cwd, newFs: fs, isError: false };
    
    case 'curl': {
      const url = args.find(a => a.startsWith('http')) || 'http://example.com';
      if (args.includes('-I') || args.includes('-i')) {
        return { output: 'HTTP/1.1 200 OK\nDate: Mon, 01 Jan 2024 00:00:00 GMT\nServer: Apache/2.4.41\nContent-Type: text/html; charset=UTF-8\nContent-Length: 1234', newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: '<!DOCTYPE html>\n<html>\n<head><title>Example</title></head>\n<body><h1>Hello World</h1></body>\n</html>', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'wget':
      return { output: '--2024-01-01 00:00:00--  http://example.com/file.zip\nResolving example.com... 93.184.216.34\nConnecting to example.com|93.184.216.34|:80... connected.\nHTTP request sent, awaiting response... 200 OK\nLength: 1234567 (1.2M) [application/zip]\nSaving to: \'file.zip\'\n\nfile.zip          100%[===============>]   1.18M  2.5MB/s    in 0.5s\n\n2024-01-01 00:00:01 (2.5 MB/s) - \'file.zip\' saved [1234567/1234567]', newCwd: cwd, newFs: fs, isError: false };
    
    case 'ip':
      return { output: '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN\n    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP\n    link/ether 00:11:22:33:44:55 brd ff:ff:ff:ff:ff:ff\n    inet 192.168.1.10/24 brd 192.168.1.255 scope global eth0', newCwd: cwd, newFs: fs, isError: false };
    
    case 'dig':
      return { output: '; <<>> DiG 9.18.1 <<>> example.com\n;; global options: +cmd\n;; Got answer:\n;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345\n;; ANSWER SECTION:\nexample.com.\t\t3600\tIN\tA\t93.184.216.34\n\n;; Query time: 12 msec\n;; SERVER: 127.0.0.53#53(127.0.0.53)', newCwd: cwd, newFs: fs, isError: false };
    
    case 'top':
      return { output: 'top - 12:34:56 up 42 days,  3:21,  2 users,  load average: 0.15, 0.10, 0.05\nTasks: 150 total,   1 running, 149 sleeping,   0 stopped,   0 zombie\n%Cpu(s):  2.3 us,  1.0 sy,  0.0 ni, 96.5 id,  0.2 wa,  0.0 hi,  0.0 si\nMiB Mem :   7982.5 total,   2150.3 free,   3200.1 used,   2632.1 buff/cache\nMiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   4100.2 avail Mem\n\n    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n   1234 root      20   0  500000  50000  10000 S   2.0   0.6   5:00.00 nginx\n   5678 student   20   0  300000  30000   5000 S   1.0   0.4   2:00.00 node', newCwd: cwd, newFs: fs, isError: false };
    
    case 'kill':
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'killall':
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'nice':
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'lscpu':
      return { output: 'Architecture:          x86_64\nCPU op-mode(s):      32-bit, 64-bit\nCPU(s):              4\nThread(s) per core:  2\nCore(s) per socket:  2\nSocket(s):           1\nModel name:          Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz\nCPU MHz:             1800.000\nCPU max MHz:         3400.0000', newCwd: cwd, newFs: fs, isError: false };
    
    case 'lsblk':
      return { output: 'NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT\nsda      8:0    0   150G  0 disk\n├─sda1   8:1    0    50G  0 part /\n├─sda2   8:2    0   100G  0 part /home\n└─sda3   8:3    0     2G  0 part [SWAP]\nsr0     11:0    1  1024M  0 rom', newCwd: cwd, newFs: fs, isError: false };
    
    case 'w':
      return { output: ' 12:34:56 up 42 days,  3:21,  2 users,  load average: 0.15, 0.10, 0.05\nUSER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT\nstudent  pts/0    192.168.1.5      09:00    0.00s  0.50s  0.01s w\nadmin    pts/1    192.168.1.10     10:30    5:00   1.20s  0.10s vim config.txt', newCwd: cwd, newFs: fs, isError: false };
    
    case 'last':
      return { output: 'student  pts/0        192.168.1.5      Mon Jan  1 09:00   still logged in\nadmin    pts/1        192.168.1.10     Mon Jan  1 10:30   still logged in\nstudent  pts/0        192.168.1.5      Sun Dec 31 08:00 - 18:00  (10:00)\n\nwtmp begins Mon Jan  1 00:00:00 2024', newCwd: cwd, newFs: fs, isError: false };
    
    case 'docker': {
      const subCmd = args[0] || '';
      if (subCmd === '--version' || subCmd === 'version') {
        return { output: 'Docker version 24.0.7, build afdd53b', newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === 'ps') {
        return { output: 'CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES\nabc123def456   nginx     "/docker-entrypoint.…"   5 minutes ago   Up 5 minutes   0.0.0.0:8080->80/tcp   web', newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === 'images') {
        return { output: 'REPOSITORY    TAG       IMAGE ID       CREATED       SIZE\nnginx         latest    605c77e624dd   2 weeks ago   141MB\nubuntu        22.04     27941809078c   3 weeks ago   77.8MB\npostgres      15        74d7a1a9e3a1   4 weeks ago   379MB\nnode          18        84e2b95a1d2c   5 weeks ago   996MB', newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === 'run') {
        return { output: 'a1b2c3d4e5f6g7h8i9j0', newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === 'info') {
        return { output: 'Client: Docker Engine - Community\n Version:    24.0.7\n Context:    default\nServer:\n Containers: 3\n  Running: 1\n  Paused: 0\n  Stopped: 2\n Images: 4\n Server Version: 24.0.7\n Storage Driver: overlay2\n Operating System: Ubuntu 22.04.3 LTS\n Total Memory: 7.7GiB', newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'git': {
      const subCmd = args[0] || '';
      if (subCmd === 'status') {
        return { output: 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n  (use "git restore <file>..." to discard changes in working directory)\n        modified:   src/index.js\n\nno changes added to commit (use "git add" and/or "git commit -a")', newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === 'log') {
        if (args.includes('--oneline')) {
          return { output: 'a1b2c3d Update README\nb2c3d4e Add new feature\nc3d4e5f Fix bug in parser\nd4e5f6g Initial commit', newCwd: cwd, newFs: fs, isError: false };
        }
        return { output: 'commit a1b2c3d4e5f6g7h8i9j0 (HEAD -> main, origin/main)\nAuthor: Student <student@example.com>\nDate:   Mon Jan 1 12:00:00 2024 +0000\n\n    Update README\n\ncommit b2c3d4e5f6g7h8i9j0k1\nAuthor: Student <student@example.com>\nDate:   Sun Dec 31 15:30:00 2023 +0000\n\n    Add new feature', newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === 'branch') {
        return { output: '* main\n  feature\n  develop', newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === 'remote') {
        return { output: 'origin\thttps://github.com/user/repo.git (fetch)\norigin\thttps://github.com/user/repo.git (push)', newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === 'checkout' || subCmd === 'switch') {
        return { output: args.includes('-b') ? `Switched to a new branch '${args[args.length - 1]}'` : `Switched to branch '${args[args.length - 1]}'`, newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === 'push') {
        return { output: 'Enumerating objects: 5, done.\nCounting objects: 100% (5/5), done.\nWriting objects: 100% (3/3), 288 bytes | 288.00 KiB/s, done.\nTo https://github.com/user/repo.git\n   a1b2c3d..b2c3d4e  main -> main', newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'mysql':
      return { output: '+--------------------+\n| Database           |\n+--------------------+\n| information_schema |\n| mysql              |\n| performance_schema |\n| sys                |\n| myapp              |\n+--------------------+', newCwd: cwd, newFs: fs, isError: false };
    
    case 'mysqldump':
      return { output: '-- MySQL dump 10.13  Distrib 8.0.35\n-- Host: localhost    Database: myapp\n-- ------------------------------------------------------\n/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;\n-- Dump completed on 2024-01-01 12:00:00', newCwd: cwd, newFs: fs, isError: false };
    
    case 'psql':
      return { output: 'psql (15.4)\nType "help" for help.\n\npostgres=# \n                  List of databases\n   Name    |  Owner   | Encoding |  Collate   |   Ctype    \n-----------+----------+----------+------------+------------\n myapp     | postgres | UTF8     | en_US.UTF-8| en_US.UTF-8\n postgres  | postgres | UTF8     | en_US.UTF-8| en_US.UTF-8\n template0 | postgres | UTF8     | en_US.UTF-8| en_US.UTF-8\n template1 | postgres | UTF8     | en_US.UTF-8| en_US.UTF-8', newCwd: cwd, newFs: fs, isError: false };
    
    case 'pg_dump':
      return { output: '--\n-- PostgreSQL database dump\n--\n-- Dumped from database version 15.4\n-- Dumped by pg_dump version 15.4\n\nSET statement_timeout = 0;\nSET lock_timeout = 0;\n--\n-- Name: myapp; Type: DATABASE; Schema: -; Owner: postgres\n--\n\nCREATE DATABASE myapp WITH TEMPLATE = template0 ENCODING = \'UTF8\';\n\n-- Dump completed on 2024-01-01 12:00:00', newCwd: cwd, newFs: fs, isError: false };
    
    case 'sqlite3':
      return { output: 'SQLite version 3.37.2 2022-01-06 13:25:16\nEnter ".help" for usage hints.\nsqlite> .tables\nusers  posts  comments', newCwd: cwd, newFs: fs, isError: false };
    
    case 'nano':
      return { output: '  GNU nano 6.2                                            Modified  \n  \n  Welcome to nano text editor\n  \n  ^G Help      ^O Write Out ^W Where Is  ^K Cut       ^U Paste     ^Y Prev Page\n  ^X Exit      ^R Read File ^\\ Replace   ^J Justify   ^T Execute   ^V Next Page', newCwd: cwd, newFs: fs, isError: false };
    
    case 'vim':
    case 'vi':
      return { output: '~\n~\n~\n~\n"file.txt" [New file]\n-- INSERT --', newCwd: cwd, newFs: fs, isError: false };
    
    case 'jq': {
      // Handle piped jq
      if (args[0] && args[0].startsWith('.')) {
        const selector = args[0];
        if (selector === '.name') {
          return { output: '"John"', newCwd: cwd, newFs: fs, isError: false };
        }
        if (selector === 'length') {
          return { output: '5', newCwd: cwd, newFs: fs, isError: false };
        }
        if (selector.includes('select')) {
          return { output: '{\n  "name": "B",\n  "age": 30\n}', newCwd: cwd, newFs: fs, isError: false };
        }
        return { output: '{}', newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'dmesg':
      return { output: '[    0.000000] Linux version 5.15.0-91-generic\n[    0.000000] Command line: BOOT_IMAGE=/vmlinuz-5.15.0-91-generic\n[    0.234567] Memory: 8042456K/8388608K available\n[    1.234567] ACPI: Core revision 20210730\n[    2.345678] usb 1-1: new high-speed USB device number 2\n[   10.456789] EXT4-fs (sda1): mounted filesystem with ordered data mode', newCwd: cwd, newFs: fs, isError: false };
    
    case 'lsof':
      return { output: 'COMMAND   PID   USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\nnginx    1234   root    6u  IPv4  12345      0t0  TCP *:http (LISTEN)\nnginx    1234   root    7u  IPv4  12346      0t0  TCP *:https (LISTEN)\nsshd     5678   root    3u  IPv4  56789      0t0  TCP *:ssh (LISTEN)\npostgres 9012 postgres  5u  IPv6  90123      0t0  TCP *:postgresql (LISTEN)', newCwd: cwd, newFs: fs, isError: false };
    
    case 'strace':
      return { output: 'execve("/bin/ls", ["ls"], 0x7ffd12345678 /* 25 vars */) = 0\nbrk(NULL)                               = 0x55a123456000\narch_prctl(0x3001 /* ARCH_??? */, 0x7ffd12345678) = -1 EINVAL\nmmap(NULL, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f1234567000\naccess("/etc/ld.so.preload", R_OK) = -1 ENOENT', newCwd: cwd, newFs: fs, isError: false };
    
    case 'tcpdump':
      return { output: 'tcpdump: verbose output suppressed, use -v or -vv for full protocol decode\nlistening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes\n12:34:56.789012 IP 192.168.1.10.54321 > 93.184.216.34.80: Flags [S], seq 1234567890\n12:34:56.789456 IP 93.184.216.34.80 > 192.168.1.10.54321: Flags [S.], seq 987654321\n12:34:56.789789 IP 192.168.1.10.54321 > 93.184.216.34.80: Flags [.], ack 1', newCwd: cwd, newFs: fs, isError: false };
    
    case 'iostat':
      return { output: 'Linux 5.15.0-91-generic (bash-tutorial)  01/01/2024  _x86_64_  (4 CPU)\n\navg-cpu:  %user   %nice %system %iowait  %steal   %idle\n           5.23    0.12    2.34    0.56    0.00   91.75\n\nDevice             tps    kB_read/s    kB_wrtn/s    kB_read    kB_wrtn\nsda               12.34       123.45        45.67     123456     456789', newCwd: cwd, newFs: fs, isError: false };
    
    case 'vmstat':
      return { output: 'procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----\n r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st\n 1  0      0 2150312  51234 2632100    0    0    12    34  123  456  5  2 92  1  0', newCwd: cwd, newFs: fs, isError: false };
    
    case 'useradd':
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'adduser':
      return { output: 'Adding user `username\' ...\nAdding new group `username\' (1001) ...\nAdding new user `username\' (1001) with group `username\' ...\nCreating home directory `/home/username\' ...\nCopying files from `/etc/skel\' ...', newCwd: cwd, newFs: fs, isError: false };
    
    case 'usermod':
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'userdel':
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'passwd':
      return { output: 'Enter new UNIX password: \nRetype new UNIX password: \npasswd: password updated successfully', newCwd: cwd, newFs: fs, isError: false };
    
    case 'groupadd':
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'groups':
      return { output: 'student sudo docker developers', newCwd: cwd, newFs: fs, isError: false };
    
    case 'id':
      return { output: 'uid=1000(student) gid=1000(student) groups=1000(student),27(sudo),999(docker),1001(developers)', newCwd: cwd, newFs: fs, isError: false };
    
    case 'getent':
      return { output: 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nstudent:x:1000:1000:Student:/home/student:/bin/bash\nadmin:x:1001:1001:Admin:/home/admin:/bin/bash', newCwd: cwd, newFs: fs, isError: false };
    
    case 'sudo': {
      const subCmd = args[0] || '';
      if (subCmd === '-l') {
        return { output: 'Matching Defaults entries for student on bash-tutorial:\n    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin\n\nUser student may run the following commands on bash-tutorial:\n    (ALL : ALL) ALL\n    (ALL) NOPASSWD: /usr/bin/systemctl', newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === '-i' || subCmd === '-s') {
        return { output: 'root@bash-tutorial:~#', newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'visudo':
      return { output: '# /etc/sudoers file\n# This file MUST be edited with \'visudo\'\n#\n# See the man page for details on how to write a sudoers file.\n#\nroot    ALL=(ALL:ALL) ALL\n%sudo   ALL=(ALL:ALL) ALL\nstudent ALL=(ALL) NOPASSWD: /usr/bin/systemctl', newCwd: cwd, newFs: fs, isError: false };
    
    case 'ufw': {
      const subCmd = args[0] || '';
      if (subCmd === 'status') {
        if (args.includes('verbose')) {
          return { output: 'Status: active\nLogging: on (low)\nDefault: deny (incoming), allow (outgoing)\nNew profiles: skip\n\nTo                         Action      From\n--                         ------      ----\n22/tcp                     ALLOW IN    Anywhere\n80/tcp                     ALLOW IN    Anywhere\n443/tcp                    ALLOW IN    Anywhere\n22/tcp (v6)                ALLOW IN    Anywhere (v6)\n80/tcp (v6)                ALLOW IN    Anywhere (v6)\n443/tcp (v6)               ALLOW IN    Anywhere (v6)', newCwd: cwd, newFs: fs, isError: false };
        }
        return { output: 'Status: active\n\nTo                         Action      From\n--                         ------      ----\n22/tcp                     ALLOW       Anywhere\n80/tcp                     ALLOW       Anywhere\n443/tcp                    ALLOW       Anywhere', newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === 'enable' || subCmd === 'disable' || subCmd === 'allow' || subCmd === 'deny' || subCmd === 'delete' || subCmd === 'reset' || subCmd === 'reload' || subCmd === 'default') {
        return { output: subCmd === 'enable' ? 'Firewall is active and enabled on system startup' : '', newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'iptables': {
      if (args.includes('-L')) {
        return { output: 'Chain INPUT (policy ACCEPT)\ntarget     prot opt source               destination\nACCEPT     all  --  anywhere             anywhere\nACCEPT     tcp  --  anywhere             anywhere             tcp dpt:ssh\nACCEPT     tcp  --  anywhere             anywhere             tcp dpt:http\nACCEPT     tcp  --  anywhere             anywhere             tcp dpt:https\n\nChain FORWARD (policy DROP)\ntarget     prot opt source               destination\n\nChain OUTPUT (policy ACCEPT)\ntarget     prot opt source               destination', newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'fail2ban-client':
      return { output: 'Status\n|- Number of jail:\t3\n`- Jail list:\tnginx, sshd, apache', newCwd: cwd, newFs: fs, isError: false };
    
    case 'certbot':
      return { output: 'Saving debug log to /var/log/letsencrypt/letsencrypt.log\n\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\nCertificate Name: example.com\nDomains: example.com www.example.com\nExpiry Date: 2024-04-01 00:00:00+00:00 (VALID: 89 days)\nCertificate Path: /etc/letsencrypt/live/example.com/fullchain.pem\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -', newCwd: cwd, newFs: fs, isError: false };
    
    case 'openssl':
      return { output: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6A7B8C9D0', newCwd: cwd, newFs: fs, isError: false };
    
    case 'watch':
      return { output: 'Every 1.0s: command                              bash-tutorial: Mon Jan  1 12:34:56 2024\n\nFilesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        50G   20G   28G  42% /', newCwd: cwd, newFs: fs, isError: false };
    
    case 'python3':
    case 'python':
      return { output: 'Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...\n192.168.1.5 - - [01/Jan/2024 12:34:56] "GET / HTTP/1.1" 200 -', newCwd: cwd, newFs: fs, isError: false };
    
    case 'history':
      return { output: '  101  ls -la\n  102  cd projects\n  103  git status\n  104  docker ps\n  105  sudo systemctl restart nginx\n  106  tail -f /var/log/nginx/access.log\n  107  ps aux | grep node\n  108  netstat -tlnp\n  109  ufw status\n  110  history', newCwd: cwd, newFs: fs, isError: false };
    
    case 'diff':
      return { output: '1c1\n< line one\n---\n> line ONE\n5a6,7\n> new line 6\n> new line 7', newCwd: cwd, newFs: fs, isError: false };
    
    case 'paste':
      return { output: 'field1\tfield3\nfield2\tfield4', newCwd: cwd, newFs: fs, isError: false };
    
    case 'cut':
      return { output: 'root\ndaemon\nstudent\nadmin', newCwd: cwd, newFs: fs, isError: false };
    
    case 'tr':
      return { output: 'Kj9#mP2$qR5&nT8@wL1!yH4^zX7*', newCwd: cwd, newFs: fs, isError: false };
    
    case 'xargs':
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'tee':
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'seq':
      return { output: '1\n2\n3\n4\n5', newCwd: cwd, newFs: fs, isError: false };
    
    case 'yes':
      return { output: 'y\ny\ny\ny\ny', newCwd: cwd, newFs: fs, isError: false };
    
    case 'basename':
      return { output: 'file.txt', newCwd: cwd, newFs: fs, isError: false };
    
    case 'dirname':
      return { output: '/home/student', newCwd: cwd, newFs: fs, isError: false };
    
    case 'realpath':
      return { output: '/home/student/file.txt', newCwd: cwd, newFs: fs, isError: false };
    
    case 'stat':
      return { output: '  File: file.txt\n  Size: 1234       \tBlocks: 8          IO Block: 4096   regular file\nDevice: 801h/2049d\tInode: 1234567     Links: 1\nAccess: (0644/-rw-r--r--)  Uid: ( 1000/student)   Gid: ( 1000/student)\nAccess: 2024-01-01 12:00:00.000000000 +0000\nModify: 2024-01-01 11:30:00.000000000 +0000\nChange: 2024-01-01 11:30:00.000000000 +0000', newCwd: cwd, newFs: fs, isError: false };
    
    case 'file':
      return { output: 'file.txt: ASCII text\nscript.sh: Bourne-Again shell script, ASCII text executable\nimage.png: PNG image data, 800 x 600, 8-bit/color RGBA, non-interlaced', newCwd: cwd, newFs: fs, isError: false };
    
    case 'md5sum':
    case 'sha256sum':
      return { output: 'e99a18c428cb38d5f260853678922e03  file.txt', newCwd: cwd, newFs: fs, isError: false };
    
    case 'cal':
      return { output: '    January 2024\nSu Mo Tu We Th Fr Sa\n    1  2  3  4  5  6\n 7  8  9 10 11 12 13\n14 15 16 17 18 19 20\n21 22 23 24 25 26 27\n28 29 30 31', newCwd: cwd, newFs: fs, isError: false };
    
    case 'bc':
      return { output: '42', newCwd: cwd, newFs: fs, isError: false };
    
    case 'expr':
      return { output: '42', newCwd: cwd, newFs: fs, isError: false };
    
    case 'apropos':
      return { output: 'file (1)            - determine file type\nfile (2)            - open a file\nfile (5)            - file formats\nfile_test (n)       - Check file types and attributes', newCwd: cwd, newFs: fs, isError: false };
    
    case 'whatis':
      return { output: 'ls (1)               - list directory contents', newCwd: cwd, newFs: fs, isError: false };
    
    case 'type':
      return { output: 'ls is aliased to `ls --color=auto\'\necho is a shell builtin\nfind is /usr/bin/find', newCwd: cwd, newFs: fs, isError: false };
    
    case 'alias':
      return { output: 'alias ll=\'ls -la\'\nalias la=\'ls -A\'\nalias l=\'ls -CF\'\nalias grep=\'grep --color=auto\'\nalias gs=\'git status\'', newCwd: cwd, newFs: fs, isError: false };
    
    case 'source':
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'export':
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'set':
      return { output: 'BASH=/bin/bash\nBASH_VERSION=\'5.1.16(1)-release\'\nHOME=/home/student\nHOSTNAME=bash-tutorial\nPATH=/usr/local/bin:/usr/bin:/bin\nPWD=/home/student\nSHELL=/bin/bash\nUSER=student', newCwd: cwd, newFs: fs, isError: false };
    
    case 'read':
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'printf':
      return { output: 'Hello World', newCwd: cwd, newFs: fs, isError: false };
    
    case 'test':
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'true':
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'false':
      return { output: '', newCwd: cwd, newFs: fs, isError: true };
    
    case 'sleep':
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'time':
      return { output: 'real\t0m0.123s\nuser\t0m0.100s\nsys\t0m0.023s', newCwd: cwd, newFs: fs, isError: false };
    
    case 'timeout':
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'nohup':
      return { output: 'nohup: ignoring input and appending output to \'nohup.out\'', newCwd: cwd, newFs: fs, isError: false };
    
    case 'jobs':
      return { output: '[1]+  Running                 long_command &\n[2]-  Stopped                 vim file.txt', newCwd: cwd, newFs: fs, isError: false };
    
    case 'bg':
    case 'fg':
      return { output: '[1]+ long_command &', newCwd: cwd, newFs: fs, isError: false };
    
    case 'renice':
      return { output: '1234 (process ID) old priority 0, new priority 10', newCwd: cwd, newFs: fs, isError: false };
    
    case 'pgrep':
      return { output: '1234\n5678', newCwd: cwd, newFs: fs, isError: false };
    
    case 'pkill':
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'kubectl': {
      const subCmd = args[0] || '';
      if (subCmd === 'version') {
        return { output: 'Client Version: v1.28.2\nKustomize Version: v5.0.4-0.20230601165947-6ce0bf3907af\nServer Version: v1.28.2', newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === 'get') {
        if (args.includes('pods')) {
          return { output: 'NAME                        READY   STATUS    RESTARTS   AGE\nnginx-deployment-5d8b4f   1/1     Running   0          5m\nredis-master-0            1/1     Running   0          10m', newCwd: cwd, newFs: fs, isError: false };
        }
        if (args.includes('deployments') || args.includes('deploy')) {
          return { output: 'NAME               READY   UP-TO-DATE   AVAILABLE   AGE\nnginx-deployment   3/3     3            3           5m\nredis-master       1/1     1            1           10m', newCwd: cwd, newFs: fs, isError: false };
        }
        if (args.includes('services') || args.includes('svc')) {
          return { output: 'NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE\nkubernetes   ClusterIP   10.96.0.1       <none>        443/TCP   1d\nnginx        ClusterIP   10.96.100.50    <none>        80/TCP    5m', newCwd: cwd, newFs: fs, isError: false };
        }
        if (args.includes('nodes')) {
          return { output: 'NAME       STATUS   ROLES           AGE   VERSION\nnode-1     Ready    control-plane   1d    v1.28.2\nnode-2     Ready    <none>          1d    v1.28.2\nnode-3     Ready    <none>          1d    v1.28.2', newCwd: cwd, newFs: fs, isError: false };
        }
        return { output: 'No resources found', newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === 'create') {
        return { output: 'deployment.apps/nginx created', newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === 'scale') {
        return { output: 'deployment.apps/nginx scaled', newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === 'cluster-info') {
        return { output: 'Kubernetes control plane is running at https://192.168.1.100:6443\nCoreDNS is running at https://192.168.1.100:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy', newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'nmap':
      return { output: 'Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for 192.168.1.1\nHost is up (0.0012s latency).\nNot shown: 997 closed ports\nPORT    STATE SERVICE\n22/tcp  open  ssh\n80/tcp  open  http\n443/tcp open  https\n\nNmap done: 1 IP address (1 host up) scanned in 0.45 seconds', newCwd: cwd, newFs: fs, isError: false };
    
    case 'nc':
    case 'netcat':
      return { output: 'Connection to 192.168.1.1 80 port [tcp/http] succeeded!', newCwd: cwd, newFs: fs, isError: false };
    
    case 'openssl': {
      const subCmd = args[0] || '';
      if (subCmd === 'genrsa') {
        return { output: 'Generating RSA private key, 2048 bit long modulus\n....................+++++\n.....................+++++\ne is 65537 (0x10001)', newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === 'version') {
        return { output: 'OpenSSL 3.0.2 15 Mar 2022 (Library: OpenSSL 3.0.2 15 Mar 2022)', newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'ssh-keygen':
      return { output: 'Generating public/private rsa key pair.\nEnter file in which to save the key (/home/student/.ssh/id_rsa): \nCreated directory \'/home/student/.ssh\'.\nYour identification has been saved in /home/student/.ssh/id_rsa\nYour public key has been saved in /home/student/.ssh/id_rsa.pub', newCwd: cwd, newFs: fs, isError: false };
    
    case 'tmux': {
      const subCmd = args[0] || '';
      if (subCmd === 'ls' || subCmd === 'list-sessions') {
        return { output: '0: 1 windows (created Mon Jan  1 12:00:00 2024)\nwork: 2 windows (created Mon Jan  1 12:30:00 2024)', newCwd: cwd, newFs: fs, isError: false };
      }
      if (subCmd === 'new' || subCmd === 'new-session') {
        return { output: '', newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'screen': {
      const subCmd = args[0] || '';
      if (subCmd === '-ls' || subCmd === '-list') {
        return { output: 'There are screens on:\n\t1234.pts-0.bash-tutorial\t(Detached)\n\t5678.work\t\t(Detached)\n2 Sockets in /run/screen/S-student.', newCwd: cwd, newFs: fs, isError: false };
      }
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    }
    
    case 'identify':
      return { output: 'image.jpg JPEG 1920x1080 1920x1080+0+0 8-bit sRGB 245678B 0.000u 0:00.000', newCwd: cwd, newFs: fs, isError: false };
    
    case 'convert':
      return { output: '', newCwd: cwd, newFs: fs, isError: false };
    
    case 'ffmpeg':
      return { output: 'ffmpeg version 5.1.2 Copyright (c) 2000-2022 the FFmpeg developers\nInput #0, mov,mp4,m4a,3gp,3g2,mj2, from \'video.avi\':\n  Duration: 00:05:30.12, start: 0.000000, bitrate: 2500 kb/s\nOutput #0, mp4, to \'video.mp4\':\n  Stream #0:0: Video: h264, 1280x720, q=2-31, 2000 kb/s', newCwd: cwd, newFs: fs, isError: false };
    
    case 'ffprobe':
      return { output: 'Input #0, mov,mp4,m4a,3gp,3g2,mj2, from \'video.mp4\':\n  Metadata:\n    major_brand     : isom\n    minor_version   : 512\n  Duration: 00:05:30.12, start: 0.000000, bitrate: 2500 kb/s\n    Stream #0:0(und): Video: h264 (High), yuv420p, 1280x720, 2400 kb/s, 30 fps', newCwd: cwd, newFs: fs, isError: false };
    
    case 'pdftk':
      return { output: 'InfoKey: Title\nInfoValue: Document Title\nInfoKey: Author\nInfoValue: John Doe\nInfoKey: Creator\nInfoValue: Microsoft Word\nNumberOfPages: 10', newCwd: cwd, newFs: fs, isError: false };
    
    case 'qpdf':
      return { output: 'qpdf operating on file input.pdf\npages: 10\nencryption: none', newCwd: cwd, newFs: fs, isError: false };
    
    case 'gs':
    case 'ghostscript':
      return { output: 'GPL Ghostscript 10.00.0 (2022-03-27)\nCopyright (C) 2022 Artifex Software, Inc.  All rights reserved.', newCwd: cwd, newFs: fs, isError: false };
    
    case 'parallel':
      return { output: '1\n2\n3\n4\n5', newCwd: cwd, newFs: fs, isError: false };
    
    case 'complete':
      return { output: 'complete -F _git git\ncomplete -F _docker docker\ncomplete -F _kubectl kubectl\ncomplete -F _npm npm', newCwd: cwd, newFs: fs, isError: false };
    
    case 'shopt':
      return { output: 'autocd          off\ncdable_vars     off\ncdspell         off\ndirexpand       off\ndirspell        off\nprogcomp        on', newCwd: cwd, newFs: fs, isError: false };
    
    case 'md5sum':
      return { output: 'd41d8cd98f00b204e9800998ecf8427e  file.txt', newCwd: cwd, newFs: fs, isError: false };
    
    case 'sha256sum':
      return { output: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  file.txt', newCwd: cwd, newFs: fs, isError: false };
    
    case 'gpg':
      return { output: 'gpg (GnuPG) 2.2.27\nlibgcrypt 1.9.4\nCopyright (C) 2021 Free Software Foundation, Inc.', newCwd: cwd, newFs: fs, isError: false };
    
    case 'iperf':
      return { output: '------------------------------------------------------------\nClient connecting to 192.168.1.1, TCP port 5001\nTCP window size: 85.0 KByte (default)\n------------------------------------------------------------\n[  3] local 192.168.1.10 port 54321 connected with 192.168.1.1 port 5001\n[ ID] Interval       Transfer     Bandwidth\n[  3] 0.0-10.0 sec  1.12 GBytes   963 Mbits/sec', newCwd: cwd, newFs: fs, isError: false };
    
    case 'mtr':
      return { output: 'Host                     Loss%   Snt   Last   Avg  Best  Wrst StDev\n1. gateway               0.0%    10    1.2   1.3   1.1   1.5   0.1\n2. 10.0.0.1              0.0%    10    5.4   5.6   5.2   6.1   0.3\n3. 192.168.1.1           0.0%    10   12.3  12.5  12.1  13.0   0.3', newCwd: cwd, newFs: fs, isError: false };
    
    case 'tshark':
      return { output: 'Capturing on \'eth0\'\n    1   0.000000 192.168.1.10 → 93.184.216.34 TCP 66 54321 → 80 [SYN] Seq=0 Win=64240\n    2   0.001234 93.184.216.34 → 192.168.1.10 TCP 66 80 → 54321 [SYN, ACK] Seq=0 Ack=1\n    3   0.001345 192.168.1.10 → 93.184.216.34 TCP 54 54321 → 80 [ACK] Seq=1 Ack=1', newCwd: cwd, newFs: fs, isError: false };
    
    default:
      // Check for variable assignment
      if (trimmed.includes('=') && !trimmed.includes(' ')) {
        const [varName, ...rest] = trimmed.split('=');
        const value = rest.join('=').replace(/^["']|["']$/g, '');
        env[varName] = value;
        return { output: '', newCwd: cwd, newFs: fs, isError: false };
      }
      
      // Check for pipe commands
      if (trimmed.includes('|')) {
        const pipeCommands = trimmed.split('|').map(c => c.trim());
        // Simulate pipe by running last command with some output
        const lastCmd = pipeCommands[pipeCommands.length - 1];
        const lastParts = lastCmd.split(/\s+/);
        
        if (lastParts[0] === 'grep') {
          const pattern = lastParts[1]?.replace(/"/g, '').replace(/'/g, '') || '';
          if (pattern === 'bash') {
            return { output: 'student   100  0.0  0.1  bash', newCwd: cwd, newFs: fs, isError: false };
          }
          return { output: '', newCwd: cwd, newFs: fs, isError: false };
        }
        
        if (lastParts[0] === 'wc') {
          return { output: '5', newCwd: cwd, newFs: fs, isError: false };
        }
        
        if (lastParts[0] === 'head') {
          return { output: 'line1\nline2\nline3', newCwd: cwd, newFs: fs, isError: false };
        }
        
        if (lastParts[0] === 'tail') {
          return { output: 'line8\nline9\nline10', newCwd: cwd, newFs: fs, isError: false };
        }
        
        if (lastParts[0] === 'sed') {
          const sedExpr = lastParts[1] || '';
          const match = sedExpr.match(/s\/(.+?)\/(.+?)\/g?/);
          if (match) {
            return { output: 'bar bar bar', newCwd: cwd, newFs: fs, isError: false };
          }
        }
        
        if (lastParts[0] === 'sort') {
          return { output: 'apple\nbanana\ncherry', newCwd: cwd, newFs: fs, isError: false };
        }
        
        return { output: '(piped output)', newCwd: cwd, newFs: fs, isError: false };
      }
      
      // Handle for loops
      if (trimmed.startsWith('for ')) {
        // Simulate for loop
        if (trimmed.includes('touch')) {
          const newFs = JSON.parse(JSON.stringify(fs));
          const studentDir = newFs['/home/student'] as any;
          const touchMatch = trimmed.match(/touch\s+(\S+)/);
          if (touchMatch) {
            const pattern = touchMatch[1];
            // Handle $i substitution
            for (let i = 1; i <= 5; i++) {
              const filename = pattern.replace(/\$i/g, i.toString());
              studentDir.children[filename] = { type: 'file', content: '' };
            }
          }
          return { output: '', newCwd: cwd, newFs, isError: false };
        }
        
        if (trimmed.includes('echo')) {
          const echoMatch = trimmed.match(/echo\s+(.+)/);
          if (echoMatch) {
            const pattern = echoMatch[1].replace(/;/g, '').trim();
            const outputs = [];
            for (let i = 1; i <= 5; i++) {
              outputs.push(pattern.replace(/\$i/g, i.toString()));
            }
            return { output: outputs.join('\n'), newCwd: cwd, newFs: fs, isError: false };
          }
        }
        
        return { output: '1\n2\n3\n4\n5', newCwd: cwd, newFs: fs, isError: false };
      }
      
      // Handle if statements
      if (trimmed.startsWith('if ')) {
        if (trimmed.includes('[ -f /etc/passwd ]')) {
          return { output: 'существует', newCwd: cwd, newFs: fs, isError: false };
        }
        if (trimmed.includes('[ 10 -gt 5 ]')) {
          return { output: 'да', newCwd: cwd, newFs: fs, isError: false };
        }
        return { output: '', newCwd: cwd, newFs: fs, isError: false };
      }
      
      // Handle test commands
      if (trimmed.startsWith('[')) {
        if (trimmed.includes('-f /etc/passwd')) {
          return { output: '', newCwd: cwd, newFs: fs, isError: false };
        }
        if (trimmed.includes('10 -gt 5')) {
          return { output: '', newCwd: cwd, newFs: fs, isError: false };
        }
        return { output: '', newCwd: cwd, newFs: fs, isError: false };
      }
      
      // Handle chained commands with &&
      if (trimmed.includes('&&')) {
        const commands = trimmed.split('&&').map(c => c.trim());
        const results: string[] = [];
        let currentFs = fs;
        let currentCwd = cwd;
        
        for (const subCmd of commands) {
          const result = simulateCommand(subCmd, currentCwd, currentFs, env);
          if (result.isError) {
            return { output: result.output, newCwd: result.newCwd, newFs: result.newFs, isError: true };
          }
          if (result.output) results.push(result.output);
          currentFs = result.newFs;
          currentCwd = result.newCwd;
        }
        
        return { output: results.join('\n'), newCwd: currentCwd, newFs: currentFs, isError: false };
      }
      
      // Handle ./script execution
      if (trimmed.startsWith('./')) {
        const scriptName = trimmed.split(' ')[0].substring(2);
        const scriptArgs = trimmed.split(' ').slice(1);
        
        if (scriptName === 'script.sh') {
          return { output: 'Hello from script!', newCwd: cwd, newFs: fs, isError: false };
        }
        if (scriptName === 'greet.sh') {
          const name = scriptArgs[0] || 'World';
          return { output: `Hello, ${name}!`, newCwd: cwd, newFs: fs, isError: false };
        }
        return { output: `bash: ./${scriptName}: No such file or directory`, newCwd: cwd, newFs: fs, isError: true };
      }
      
      // Handle echo with script creation
      if (command === 'echo' && trimmed.includes('>') && trimmed.includes('.sh')) {
        const newFs = JSON.parse(JSON.stringify(fs));
        const studentDir = newFs['/home/student'] as any;
        
        // Extract filename
        const fileMatch = trimmed.match(/>\s*(\S+\.sh)/);
        if (fileMatch) {
          const filename = fileMatch[1];
          const contentMatch = trimmed.match(/echo\s+['"](.+?)['"]\s*>/);
          if (contentMatch) {
            studentDir.children[filename] = { type: 'file', content: contentMatch[1] };
          } else {
            studentDir.children[filename] = { type: 'file', content: '#!/bin/bash' };
          }
        }
        return { output: '', newCwd: cwd, newFs, isError: false };
      }
      
      return { output: `bash: ${command}: command not found`, newCwd: cwd, newFs: fs, isError: true };
  }
}

function checkAnswer(command: string, expected: string[]): boolean {
  const normalized = command.trim().toLowerCase().replace(/\s+/g, ' ');
  
  return expected.some(exp => {
    const normExp = exp.trim().toLowerCase().replace(/\s+/g, ' ');
    
    // Exact match
    if (normalized === normExp) return true;
    
    // Check if the command contains the essential parts
    const expParts = normExp.split(/\s+/);
    const cmdParts = normalized.split(/\s+/);
    
    // For simple commands, check key parts
    if (expParts.length <= 3) {
      return expParts.every(part => cmdParts.includes(part));
    }
    
    // For complex commands, check command and main arguments
    return cmdParts[0] === expParts[0] && 
           expParts.slice(1).some(part => cmdParts.includes(part));
  });
}

export function TerminalSim({ exercise, isCompleted, onComplete, onSuccess }: TerminalSimProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'system', content: `📋 Задание: ${exercise.description}` },
    { type: 'system', content: 'Введите команду и нажмите Enter (help для списка команд)' },
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('/home/student');
  const [fs, setFs] = useState<FileSystem>(createFileSystem());
  const [env, setEnv] = useState<Record<string, string>>({ HOME: '/home/student', USER: 'student', PWD: '/home/student', SHELL: '/bin/bash' });
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    const newLines: TerminalLine[] = [
      ...lines,
      { type: 'input', content: cmd }
    ];

    // Simulate command
    const result = simulateCommand(cmd, cwd, fs, { ...env });
    
    if (result.output === '__CLEAR__') {
      setLines([{ type: 'system', content: 'Терминал очищен' }]);
    } else {
      if (result.output) {
        newLines.push({ 
          type: result.isError ? 'error' : 'output', 
          content: result.output 
        });
      }
      setLines(newLines);
    }
    
    setCwd(result.newCwd);
    setFs(result.newFs);
    setHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput('');

    // Check if command matches expected
    if (!isCompleted && checkAnswer(cmd, exercise.expectedCommands)) {
      setTimeout(() => {
        setLines(prev => [...prev, { type: 'success', content: exercise.successMessage }]);
        onComplete();
        onSuccess();
      }, 300);
    }
  }, [input, lines, cwd, fs, env, isCompleted, exercise, onComplete, onSuccess]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div 
      className="bg-gray-950 font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      <div 
        ref={terminalRef}
        className="h-48 overflow-y-auto p-3 space-y-0.5 scrollbar-thin"
      >
        {lines.map((line, i) => (
          <div key={i} className={`leading-relaxed ${
            line.type === 'input' ? 'text-gray-100' :
            line.type === 'output' ? 'text-gray-300' :
            line.type === 'error' ? 'text-red-400' :
            line.type === 'success' ? 'text-green-400 font-medium' :
            'text-blue-400'
          }`}>
            {line.type === 'input' && (
              <span>
                <span className="text-green-400">student@bash</span>
                <span className="text-gray-500">:</span>
                <span className="text-blue-400">{cwd.replace('/home/student', '~')}</span>
                <span className="text-gray-500">$ </span>
              </span>
            )}
            {line.content}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex items-center border-t border-gray-800 px-3 py-2">
        <span className="text-green-400 mr-1">student@bash</span>
        <span className="text-gray-500">:</span>
        <span className="text-blue-400 mr-1">{cwd.replace('/home/student', '~')}</span>
        <span className="text-gray-500">$ </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-gray-100 caret-green-400"
          placeholder={isCompleted ? "✓ Задание выполнено" : "Введите команду..."}
          disabled={isCompleted}
          autoFocus
          spellCheck={false}
        />
        {!isCompleted && (
          <button 
            type="submit"
            className="ml-2 p-1 text-gray-500 hover:text-green-400 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
        {isCompleted && (
          <CheckCircle className="w-5 h-5 text-green-400 ml-2" />
        )}
      </form>
    </div>
  );
}
