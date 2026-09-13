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
      return { output: 'Доступные команды: echo, pwd, ls, cd, touch, mkdir, cp, mv, rm, cat, head, tail, wc, grep, find, sort, sed, awk, ps, chmod, whoami, hostname, date, env, man, clear\n\nПопробуйте выполнить задание!', newCwd: cwd, newFs: fs, isError: false };
    
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
