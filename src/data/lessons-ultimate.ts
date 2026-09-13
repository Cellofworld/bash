import type { Lesson } from '../types';

export const ultimateLessons: Lesson[] = [
  {
    id: 31,
    title: "Kubernetes (k8s)",
    icon: "☸️",
    description: "kubectl, pods, deployments, services — оркестрация контейнеров",
    theory: [
      {
        title: "Основы Kubernetes",
        content: `**Kubernetes** — система оркестрации контейнеров.

Основные объекты:
- **Pod** — минимальная единица (один или несколько контейнеров)
- **Deployment** — управление репликами подов
- **Service** — сетевой доступ к подам
- **ConfigMap** — конфигурация
- **Secret** — секреты
- **Namespace** — изоляция ресурсов`,
        code: `$ kubectl version                  # Версия
$ kubectl cluster-info             # Информация о кластере
$ kubectl get nodes                # Список нод
$ kubectl get pods                 # Список подов
$ kubectl get deployments          # Список деплоев
$ kubectl get services             # Список сервисов
$ kubectl get all                  # Все ресурсы`,
      },
      {
        title: "Управление подами",
        content: `Работа с подами в Kubernetes:`,
        code: `# Создание подов
$ kubectl run nginx --image=nginx              # Создать под
$ kubectl run nginx --image=nginx --replicas=3 # С репликами
$ kubectl run nginx --image=nginx --port=80    # С портом

# Управление
$ kubectl get pods                             # Список
$ kubectl get pods -o wide                     # Подробно
$ kubectl describe pod nginx-xxx               # Детали
$ kubectl logs nginx-xxx                       # Логи
$ kubectl logs -f nginx-xxx                    # Следить
$ kubectl exec -it nginx-xxx -- bash           # Войти в под
$ kubectl delete pod nginx-xxx                 # Удалить

# Port forwarding
$ kubectl port-forward pod/nginx-xxx 8080:80`,
      },
      {
        title: "Deployments и Services",
        content: `Управление деплоями и сервисами:`,
        code: `# Deployments
$ kubectl create deployment nginx --image=nginx
$ kubectl get deployments
$ kubectl scale deployment nginx --replicas=5
$ kubectl rollout status deployment/nginx
$ kubectl rollout undo deployment/nginx
$ kubectl set image deployment/nginx nginx=nginx:1.19

# Services
$ kubectl expose deployment nginx --port=80 --type=LoadBalancer
$ kubectl get services
$ kubectl describe service nginx
$ kubectl delete service nginx

# YAML манифесты
$ kubectl apply -f deployment.yaml
$ kubectl delete -f deployment.yaml
$ kubectl get -o yaml deployment/nginx > backup.yaml`,
      },
      {
        title: "ConfigMaps и Secrets",
        content: `Управление конфигурацией и секретами:`,
        code: `# ConfigMaps
$ kubectl create configmap myconfig --from-file=config.txt
$ kubectl create configmap myconfig --from-literal=key=value
$ kubectl get configmaps
$ kubectl describe configmap myconfig

# Secrets
$ kubectl create secret generic mysecret --from-literal=password=secret
$ kubectl create secret tls mytls --cert=tls.crt --key=tls.key
$ kubectl get secrets
$ kubectl describe secret mysecret

# Использование в подах
# envFrom:
#   - configMapRef:
#       name: myconfig
#   - secretRef:
#       name: mysecret`,
      },
    ],
    exercises: [
      {
        id: "31-1",
        title: "Версия kubectl",
        description: "Покажите версию kubectl и кластера",
        hint: "kubectl version",
        expectedCommands: ["kubectl version"],
        successMessage: "🎉 Вы видите версию Kubernetes!",
      },
      {
        id: "31-2",
        title: "Список подов",
        description: "Покажите все поды в кластере",
        hint: "kubectl get pods",
        expectedCommands: ["kubectl get pods"],
        successMessage: "🎉 Вы видите все поды!",
      },
      {
        id: "31-3",
        title: "Создание деплоя",
        description: "Создайте deployment nginx с образом nginx",
        hint: "kubectl create deployment nginx --image=nginx",
        expectedCommands: ["kubectl create deployment nginx --image=nginx"],
        successMessage: "🎉 Deployment создан!",
      },
      {
        id: "31-4",
        title: "Масштабирование",
        description: "Масштабируйте deployment nginx до 5 реплик",
        hint: "kubectl scale deployment nginx --replicas=5",
        expectedCommands: ["kubectl scale deployment nginx --replicas=5"],
        successMessage: "🎉 Deployment масштабирован!",
      },
    ],
  },
  {
    id: 32,
    title: "CI/CD: GitHub Actions",
    icon: "🔄",
    description: "Автоматизация сборки, тестирования и деплоя с GitHub Actions",
    theory: [
      {
        title: "Основы GitHub Actions",
        content: `**GitHub Actions** — система CI/CD от GitHub.

Основные понятия:
- **Workflow** — автоматизированный процесс (YAML файл)
- **Event** — триггер запуска (push, pull_request, schedule)
- **Job** — набор шагов, выполняется на runner
- **Step** — отдельная задача (команда или action)
- **Action** — переиспользуемый компонент
- **Runner** — сервер, выполняющий job`,
        code: `# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build`,
      },
      {
        title: "Матрица сборок",
        content: `Параллельная сборка для разных версий:`,
        code: `# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: \${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node-version: [16, 18, 20]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: \${{ matrix.node-version }}
    
    - run: npm ci
    - run: npm test`,
      },
      {
        title: "Кеширование и артефакты",
        content: `Оптимизация workflow с кешированием:`,
        code: `# Кеширование node_modules
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      \${{ runner.os }}-node-

# Загрузка артефактов
- name: Upload artifact
  uses: actions/upload-artifact@v3
  with:
    name: build
    path: dist/

# Загрузка артефактов
- name: Download artifact
  uses: actions/download-artifact@v3
  with:
    name: build`,
      },
      {
        title: "Деплой с GitHub Actions",
        content: `Автоматический деплой:`,
        code: `# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to server
      uses: appleboy/scp-action@master
      with:
        host: \${{ secrets.HOST }}
        username: \${{ secrets.USERNAME }}
        key: \${{ secrets.SSH_KEY }}
        source: "dist/"
        target: "/var/www/app"
    
    - name: Restart service
      uses: appleboy/ssh-action@master
      with:
        host: \${{ secrets.HOST }}
        username: \${{ secrets.USERNAME }}
        key: \${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/app
          sudo systemctl restart app`,
      },
    ],
    exercises: [
      {
        id: "32-1",
        title: "Создание workflow",
        description: "Создайте директорию .github/workflows для workflow файлов",
        hint: "mkdir -p .github/workflows",
        expectedCommands: ["mkdir -p .github/workflows"],
        successMessage: "🎉 Директория для workflow создана!",
      },
      {
        id: "32-2",
        title: "Проверка синтаксиса",
        description: "Проверьте синтаксис YAML файла workflow.yml",
        hint: "cat workflow.yml",
        expectedCommands: ["cat workflow.yml"],
        successMessage: "🎉 YAML файл проверен!",
      },
    ],
  },
  {
    id: 33,
    title: "Nmap и сетевая разведка",
    icon: "🔎",
    description: "Nmap, netcat, tcpdump — сканирование сетей и диагностика",
    theory: [
      {
        title: "Основы Nmap",
        content: `**Nmap** — мощный инструмент для сканирования сетей.

Типы сканирования:
- **-sS** — TCP SYN (скрытое)
- **-sT** — TCP connect
- **-sU** — UDP
- **-sP** — Ping scan (обнаружение хостов)
- **-sV** — Определение версий сервисов
- **-O** — Определение ОС`,
        code: `$ nmap 192.168.1.1                   # Базовое сканирование
$ nmap -sS 192.168.1.0/24            # SYN scan подсети
$ nmap -sV 192.168.1.1               # Определение версий
$ nmap -O 192.168.1.1                # Определение ОС
$ nmap -A 192.168.1.1                # Агрессивное сканирование
$ nmap -p 80,443 192.168.1.1         # Конкретные порты
$ nmap -p 1-1000 192.168.1.1         # Диапазон портов
$ nmap -F 192.168.1.1                # Быстрое сканирование
$ nmap -T4 192.168.1.1               # Быстрый тайминг`,
      },
      {
        title: "Netcat — швейцарский нож",
        content: `**Netcat** (nc) — утилита для работы с сетью:`,
        code: `# Подключение к порту
$ nc 192.168.1.1 80                  # Подключиться к порту 80
$ nc -vz 192.168.1.1 80              # Проверить порт (verbose)
$ nc -vz 192.168.1.1 1-1000          # Сканировать диапазон

# Создание сервера
$ nc -l 8080                         # Слушать порт 8080
$ nc -l -p 8080                      # Альтернативный синтаксис

# Передача файлов
$ nc -l 8080 > received.file         # Принять файл
$ nc 192.168.1.1 8080 < file.txt     # Отправить файл

# Чат
$ nc -l 8080                         # Сервер
$ nc 192.168.1.1 8080                # Клиент

# Сканирование портов
$ for port in {1..100}; do nc -vz 192.168.1.1 $port; done`,
      },
      {
        title: "Диагностика сети",
        content: `Инструменты для диагностики сети:`,
        code: `# mtr — комбинация ping и traceroute
$ mtr example.com                    # Интерактивный режим
$ mtr -r example.com                 # Отчёт

# tcpdump — захват пакетов
$ sudo tcpdump -i eth0               # Все пакеты на eth0
$ sudo tcpdump -i any port 80        # HTTP трафик
$ sudo tcpdump -i eth0 host 192.168.1.1  # Трафик хоста
$ sudo tcpdump -w capture.pcap       # Записать в файл

# tshark — консольный Wireshark
$ tshark -i eth0                     # Захват
$ tshark -r capture.pcap             # Чтение файла

# iperf — тест скорости
$ iperf -s                           # Сервер
$ iperf -c 192.168.1.1               # Клиент`,
      },
    ],
    exercises: [
      {
        id: "33-1",
        title: "Сканирование хоста",
        description: "Просканируйте хост 192.168.1.1 с помощью nmap",
        hint: "nmap 192.168.1.1",
        expectedCommands: ["nmap 192.168.1.1"],
        successMessage: "🎉 Хост просканирован!",
      },
      {
        id: "33-2",
        title: "Проверка порта",
        description: "Проверьте открыт ли порт 80 на хосте example.com",
        hint: "nc -vz example.com 80",
        expectedCommands: ["nc -vz example.com 80", "nc -vz example.com 80"],
        successMessage: "🎉 Порт проверен!",
      },
      {
        id: "33-3",
        title: "Определение версии",
        description: "Определите версии сервисов на хосте 192.168.1.1",
        hint: "nmap -sV 192.168.1.1",
        expectedCommands: ["nmap -sV 192.168.1.1"],
        successMessage: "🎉 Версии сервисов определены!",
      },
    ],
  },
  {
    id: 34,
    title: "OpenSSL и шифрование",
    icon: "🔐",
    description: "OpenSSL, gpg, ssh-keygen — шифрование и цифровые подписи",
    theory: [
      {
        title: "Генерация ключей",
        content: `Создание криптографических ключей:`,
        code: `# RSA ключи
$ openssl genrsa -out private.key 2048        # Приватный ключ
$ openssl rsa -in private.key -pubout -out public.key  # Публичный

# ECDSA ключи
$ openssl ecparam -genkey -name prime256v1 -out ec_private.key
$ openssl ec -in ec_private.key -pubout -out ec_public.key

# Ed25519 (современный)
$ openssl genpkey -algorithm ED25519 -out ed25519.key

# SSH ключи
$ ssh-keygen -t rsa -b 4096 -C "email@example.com"
$ ssh-keygen -t ed25519 -C "email@example.com"
$ ssh-keygen -t ecdsa -b 521 -C "email@example.com"`,
      },
      {
        title: "Шифрование данных",
        content: `Шифрование и дешифрование файлов:`,
        code: `# Симметричное шифрование (пароль)
$ openssl enc -aes-256-cbc -salt -in file.txt -out file.enc
$ openssl enc -d -aes-256-cbc -in file.enc -out file.txt

# С явным указанием пароля
$ openssl enc -aes-256-cbc -salt -in file.txt -out file.enc -pass pass:mypassword

# Асимметричное шифрование
$ openssl rsautl -encrypt -inkey public.key -pubin -in file.txt -out file.enc
$ openssl rsautl -decrypt -inkey private.key -in file.enc -out file.txt

# GPG шифрование
$ gpg -c file.txt                  # Симметричное (пароль)
$ gpg -e -r recipient file.txt     # Асимметричное
$ gpg -d file.txt.gpg              # Дешифрование`,
      },
      {
        title: "Хеширование",
        content: `Вычисление хешей для проверки целостности:`,
        code: `# MD5 (небезопасен, только для проверки)
$ md5sum file.txt
$ md5sum *.txt > checksums.md5
$ md5sum -c checksums.md5          # Проверить

# SHA-256 (рекомендуется)
$ sha256sum file.txt
$ sha256sum *.txt > checksums.sha256
$ sha256sum -c checksums.sha256

# SHA-512
$ sha512sum file.txt

# OpenSSL хеши
$ openssl dgst -md5 file.txt
$ openssl dgst -sha256 file.txt
$ openssl dgst -sha512 file.txt

# Хеш строки
$ echo -n "password" | md5sum
$ echo -n "password" | sha256sum`,
      },
      {
        title: "SSL сертификаты",
        content: `Работа с SSL/TLS сертификатами:`,
        code: `# Самоподписанный сертификат
$ openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# CSR (Certificate Signing Request)
$ openssl req -new -key key.pem -out request.csr

# Просмотр сертификата
$ openssl x509 -in cert.pem -text -noout
$ openssl x509 -in cert.pem -dates -noout

# Проверка сертификата на сервере
$ openssl s_client -connect example.com:443
$ openssl s_client -connect example.com:443 -showcerts

# Конвертация форматов
$ openssl x509 -in cert.pem -outform DER -out cert.der
$ openssl x509 -in cert.der -inform DER -outform PEM -out cert.pem`,
      },
    ],
    exercises: [
      {
        id: "34-1",
        title: "Генерация RSA ключа",
        description: "Сгенерируйте RSA ключ размером 2048 бит",
        hint: "openssl genrsa -out private.key 2048",
        expectedCommands: ["openssl genrsa -out private.key 2048"],
        successMessage: "🎉 RSA ключ сгенерирован!",
      },
      {
        id: "34-2",
        title: "Хеш файла",
        description: "Вычислите SHA256 хеш файла",
        hint: "sha256sum file.txt",
        expectedCommands: ["sha256sum file.txt"],
        successMessage: "🎉 Хеш вычислен!",
      },
      {
        id: "34-3",
        title: "Шифрование файла",
        description: "Зашифруйте файл file.txt алгоритмом AES-256",
        hint: "openssl enc -aes-256-cbc -salt -in file.txt -out file.enc",
        expectedCommands: ["openssl enc -aes-256-cbc -salt -in file.txt -out file.enc"],
        successMessage: "🎉 Файл зашифрован!",
      },
    ],
  },
  {
    id: 35,
    title: "Tmux и Screen",
    icon: "🖥️",
    description: "Tmux, screen — мультиплексоры терминала для продуктивной работы",
    theory: [
      {
        title: "Основы Tmux",
        content: `**Tmux** — терминальный мультиплексор.

Основные понятия:
- **Session** — сессия с одним или несколькими окнами
- **Window** — окно (как вкладка)
- **Pane** — панель (разделение окна)

Префикс по умолчанию: \`Ctrl+b\``,
        code: `$ tmux                           # Новая сессия
$ tmux new -s mysession          # Именованная сессия
$ tmux ls                        # Список сессий
$ tmux attach -t mysession       # Подключиться к сессии
$ tmux kill-session -t mysession # Убить сессию
$ tmux kill-server               # Убить все сессии

# Горячие клавиши (после Ctrl+b):
# c — новое окно
# n — следующее окно
# p — предыдущее окно
# , — переименовать окно
# & — закрыть окно
# % — вертикальное разделение
# " — горизонтальное разделение
# o — переключить панель
# ; — последняя панель
# d — отключиться (detach)
# z — maximize панель`,
      },
      {
        title: "Screen — альтернатива tmux",
        content: `**Screen** — старая, но надёжная альтернатива:`,
        code: `$ screen                         # Новая сессия
$ screen -S mysession            # Именованная сессия
$ screen -ls                     # Список сессий
$ screen -r mysession            # Подключиться
$ screen -x mysession            # Подключиться к занятой
$ screen -d mysession            # Отключить

# Горячие клавиши (Ctrl+a):
# c — новое окно
# n — следующее окно
# p — предыдущее окно
# " — список окон
# A — переименовать окно
# k — закрыть окно
# d — отключиться
# [ — режим копирования`,
      },
      {
        title: "Конфигурация Tmux",
        content: `Настройка tmux через ~/.tmux.conf:`,
        code: `# ~/.tmux.conf

# Изменить префикс на Ctrl+a
set -g prefix C-a
unbind C-b
bind C-a send-prefix

# Включить мышь
set -g mouse on

# Улучшить цвета
set -g default-terminal "screen-256color"

# Быстрое разделение
bind | split-window -h
bind - split-window -v

# Навигация между панелями
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R

# Статус бар
set -g status-bg colour235
set -g status-fg colour136

# Применить изменения
$ tmux source-file ~/.tmux.conf`,
      },
    ],
    exercises: [
      {
        id: "35-1",
        title: "Новая сессия tmux",
        description: "Создайте новую сессию tmux с именем 'work'",
        hint: "tmux new -s work",
        expectedCommands: ["tmux new -s work", "tmux new-session -s work"],
        successMessage: "🎉 Сессия tmux создана!",
      },
      {
        id: "35-2",
        title: "Список сессий",
        description: "Покажите все активные сессии tmux",
        hint: "tmux ls",
        expectedCommands: ["tmux ls", "tmux list-sessions"],
        successMessage: "🎉 Вы видите все сессии!",
      },
    ],
  },
  {
    id: 36,
    title: "Обработка изображений",
    icon: "🖼️",
    description: "ImageMagick, FFmpeg — обработка изображений и видео из терминала",
    theory: [
      {
        title: "ImageMagick — основы",
        content: `**ImageMagick** — мощный инструмент для работы с изображениями:`,
        code: `# Информация об изображении
$ identify image.jpg             # Размер, формат, тип
$ identify -verbose image.jpg    # Подробная информация

# Конвертация форматов
$ convert image.jpg image.png    # JPG в PNG
$ convert image.png image.webp   # PNG в WebP
$ mogrify -format png *.jpg      # Конвертировать все JPG в PNG

# Изменение размера
$ convert image.jpg -resize 800x600 resized.jpg
$ convert image.jpg -resize 50% half.jpg
$ convert image.jpg -thumbnail 200x200 thumb.jpg

# Обрезка
$ convert image.jpg -crop 100x100+50+50 cropped.jpg

# Поворот
$ convert image.jpg -rotate 90 rotated.jpg
$ convert image.jpg -flop flipped.jpg  # Отразить горизонтально`,
      },
      {
        title: "ImageMagick — эффекты",
        content: `Применение эффектов к изображениям:`,
        code: `# Качество и сжатие
$ convert image.jpg -quality 85 compressed.jpg
$ convert image.png -strip optimized.png

# Водяной знак
$ convert image.jpg -gravity southeast -draw "text 10,10 'Copyright'" watermarked.jpg
$ composite -gravity southeast logo.png image.jpg watermarked.jpg

# Чёрно-белое
$ convert image.jpg -colorspace Gray grayscale.jpg
$ convert image.jpg -monochrome bw.jpg

# Размытие
$ convert image.jpg -blur 0x8 blurred.jpg

# Резкость
$ convert image.jpg -sharpen 0x1 sharp.jpg

# Сепия
$ convert image.jpg -sepia-tone 80% sepia.jpg

# Негатив
$ convert image.jpg -negate negative.jpg`,
      },
      {
        title: "FFmpeg — обработка видео",
        content: `**FFmpeg** — инструмент для работы с видео и аудио:`,
        code: `# Информация о файле
$ ffprobe video.mp4

# Конвертация формата
$ ffmpeg -i input.avi output.mp4
$ ffmpeg -i input.mp4 output.mkv

# Извлечение аудио
$ ffmpeg -i video.mp4 -vn -acodec libmp3laudio audio.mp3
$ ffmpeg -i video.mp4 -vn -acodec pcm_s16le audio.wav

# Извлечение кадров
$ ffmpeg -i video.mp4 -vf "fps=1" frame_%04d.png  # 1 кадр в секунду
$ ffmpeg -i video.mp4 -ss 00:01:00 -vframes 1 snapshot.png

# Обрезка видео
$ ffmpeg -i input.mp4 -ss 00:00:30 -t 00:00:10 -c copy output.mp4

# Изменение размера
$ ffmpeg -i input.mp4 -vf "scale=1280:720" output.mp4

# Создание GIF
$ ffmpeg -i input.mp4 -vf "fps=10,scale=320:-1" output.gif`,
      },
    ],
    exercises: [
      {
        id: "36-1",
        title: "Информация об изображении",
        description: "Покажите информацию об изображении image.jpg",
        hint: "identify image.jpg",
        expectedCommands: ["identify image.jpg"],
        successMessage: "🎉 Информация получена!",
      },
      {
        id: "36-2",
        title: "Изменение размера",
        description: "Измените размер изображения image.jpg на 800x600",
        hint: "convert image.jpg -resize 800x600 resized.jpg",
        expectedCommands: ["convert image.jpg -resize 800x600 resized.jpg"],
        successMessage: "🎉 Размер изменён!",
      },
      {
        id: "36-3",
        title: "Конвертация видео",
        description: "Конвертируйте video.avi в video.mp4",
        hint: "ffmpeg -i video.avi video.mp4",
        expectedCommands: ["ffmpeg -i video.avi video.mp4"],
        successMessage: "🎉 Видео конвертировано!",
      },
    ],
  },
  {
    id: 37,
    title: "Работа с PDF",
    icon: "📄",
    description: "pdftk, qpdf, ghostscript — обработка PDF документов",
    theory: [
      {
        title: "PDFtk — работа с PDF",
        content: `**PDFtk** — инструмент для манипуляций с PDF:`,
        code: `# Информация о PDF
$ pdftk document.pdf dump_data     # Метаданные
$ pdftk document.pdf dump_data_fields  # Поля формы

# Объединение PDF
$ pdftk file1.pdf file2.pdf cat output combined.pdf
$ pdftk *.pdf cat output combined.pdf

# Разделение PDF
$ pdftk document.pdf burst         # Разделить на страницы
$ pdftk A=document.pdf cat A1-5 output pages.pdf  # Страницы 1-5

# Извлечение страниц
$ pdftk A=document.pdf cat A1 A3 A5 output selected.pdf

# Шифрование
$ pdftk document.pdf output encrypted.pdf owner_pw secret
$ pdftk document.pdf output encrypted.pdf user_pw secret

# Дешифрование
$ pdftk encrypted.pdf input_pw secret output decrypted.pdf

# Поворот страниц
$ pdftk document.pdf cat 1-endright output rotated.pdf`,
      },
      {
        title: "QPDF — трансформации",
        content: `**QPDF** — инструмент для трансформации PDF:`,
        code: `# Линейзация (для веба)
$ qpdf --linearize input.pdf output.pdf

# Дешифрование
$ qpdf --password=secret --decrypt encrypted.pdf decrypted.pdf

# Шифрование
$ qpdf --encrypt user owner 256 -- input.pdf encrypted.pdf

# Проверка
$ qpdf --check input.pdf

# Метаданные
$ qpdf --show-npages input.pdf

# Оптимизация
$ qpdf --optimize input.pdf output.pdf`,
      },
      {
        title: "Ghostscript — конвертация",
        content: `**Ghostscript** — конвертация и оптимизация PDF:`,
        code: `# PDF в изображения
$ gs -dNOPAUSE -dBATCH -sDEVICE=png16m -r300 -sOutputFile=page_%d.png document.pdf

# PDF в PostScript
$ gs -dNOPAUSE -dBATCH -sDEVICE=ps2write -sOutputFile=output.ps input.pdf

# Оптимизация размера
$ gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dBATCH -sOutputFile=small.pdf large.pdf

# Настройки качества:
# /screen — 72 dpi (низкое качество)
# /ebook — 150 dpi (среднее)
# /printer — 300 dpi (высокое)
# /prepress — 300 dpi (максимальное)

# Объединение PDF
$ gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile=combined.pdf file1.pdf file2.pdf`,
      },
    ],
    exercises: [
      {
        id: "37-1",
        title: "Информация о PDF",
        description: "Покажите метаданные PDF документа",
        hint: "pdftk document.pdf dump_data",
        expectedCommands: ["pdftk document.pdf dump_data"],
        successMessage: "🎉 Метаданные получены!",
      },
      {
        id: "37-2",
        title: "Объединение PDF",
        description: "Объедините file1.pdf и file2.pdf в combined.pdf",
        hint: "pdftk file1.pdf file2.pdf cat output combined.pdf",
        expectedCommands: ["pdftk file1.pdf file2.pdf cat output combined.pdf"],
        successMessage: "🎉 PDF объединены!",
      },
    ],
  },
  {
    id: 38,
    title: "Параллельное выполнение",
    icon: "⚡",
    description: "xargs, GNU parallel, background jobs — параллельная обработка задач",
    theory: [
      {
        title: "Background jobs",
        content: `Выполнение команд в фоне:`,
        code: `# Запуск в фоне
$ long_command &                   # Выполнить в фоне
$ echo $!                          # PID последнего фонового процесса

# Управление jobs
$ jobs                             # Список фоновых задач
$ jobs -l                          # С PID
$ fg %1                            # Вернуть job 1 на передний план
$ bg %1                            # Продолжить job 1 в фоне
$ kill %1                          # Завершить job 1

# Приостановка
$ Ctrl+Z                           # Приостановить текущий процесс
$ bg                               # Продолжить в фоне
$ fg                               # Вернуть на передний план

# nohup — не прерывать при выходе
$ nohup long_command &
$ nohup long_command > output.log 2>&1 &`,
      },
      {
        title: "xargs — параллельное выполнение",
        content: `**xargs** — выполнение команд с аргументами из stdin:`,
        code: `# Базовое использование
$ find . -name "*.jpg" | xargs -I {} convert {} {}.png

# Параллельное выполнение
$ find . -name "*.jpg" | xargs -P 4 -I {} convert {} {}.png
# -P 4 — 4 параллельных процесса

# Ограничение аргументов
$ echo "a b c d e" | xargs -n 2 echo
# a b
# c d
# e

# Разделители
$ cat files.txt | xargs -d '\\n' -I {} cp {} /backup/

# Интерактивное подтверждение
$ find . -name "*.tmp" | xargs -p rm

# Dry run
$ find . -name "*.log" | xargs -t rm`,
      },
      {
        title: "GNU Parallel",
        content: `**GNU Parallel** — мощный инструмент для параллельного выполнения:`,
        code: `# Базовое использование
$ parallel echo ::: 1 2 3 4 5

# Из файла
$ cat urls.txt | parallel wget {}

# С заменой
$ parallel convert {} {.}.png ::: *.jpg

# Параллельные jobs
$ parallel -j 4 convert {} {.}.png ::: *.jpg

# Прогресс бар
$ parallel --eta convert {} {.}.png ::: *.jpg

# Распределение по серверам
$ parallel -S server1,server2,server3 command ::: args

# Группировка вывода
$ parallel --group echo {} ::: 1 2 3 4 5

# Ограничение нагрузки
$ parallel --load 100% command ::: args`,
      },
    ],
    exercises: [
      {
        id: "38-1",
        title: "Фоновый процесс",
        description: "Запустите команду sleep 10 в фоновом режиме",
        hint: "sleep 10 &",
        expectedCommands: ["sleep 10 &"],
        successMessage: "🎉 Процесс запущен в фоне!",
      },
      {
        id: "38-2",
        title: "Список jobs",
        description: "Покажите все фоновые задачи",
        hint: "jobs",
        expectedCommands: ["jobs"],
        successMessage: "🎉 Вы видите фоновые задачи!",
      },
      {
        id: "38-3",
        title: "Параллельная обработка",
        description: "Выполните echo для чисел 1-5 параллельно с помощью parallel",
        hint: "parallel echo ::: 1 2 3 4 5",
        expectedCommands: ["parallel echo ::: 1 2 3 4 5"],
        successMessage: "🎉 Параллельное выполнение работает!",
      },
    ],
  },
  {
    id: 39,
    title: "Bash Completion",
    icon: "🎯",
    description: "Автодополнение команд — настройка и создание своих completion",
    theory: [
      {
        title: "Основы completion",
        content: `**Bash completion** — автодополнение команд по Tab.

Типы completion:
- Команды
- Опции команд
- Аргументы команд
- Имена файлов
- Переменные окружения`,
        code: `# Проверить completion
$ complete -p                   # Все completion
$ complete -p git               # Completion для git

# Включить/выключить
$ shopt -s progcomp             # Включить
$ shopt -u progcomp             # Выключить

# Перезагрузить completion
$ source /etc/bash_completion
$ . /etc/bash_completion

# Установить completion для пакетов
$ sudo apt install bash-completion
$ sudo yum install bash-completion`,
      },
      {
        title: "Создание completion",
        content: `Создание собственных completion:`,
        code: `# Простой completion
_mycommand() {
    local cur=\${COMP_WORDS[COMP_CWORD]}
    COMPREPLY=( $(compgen -W "start stop restart status" -- $cur) )
}
complete -F _mycommand mycommand

# Completion с файлами
_mycommand() {
    local cur=\${COMP_WORDS[COMP_CWORD]}
    COMPREPLY=( $(compgen -f -- $cur) )
}
complete -F _mycommand mycommand

# Completion с директориями
_mycommand() {
    local cur=\${COMP_WORDS[COMP_CWORD]}
    COMPREPLY=( $(compgen -d -- $cur) )
}
complete -F _mycommand mycommand

# Completion для git подкоманд
_git_custom() {
    local cur=\${COMP_WORDS[COMP_CWORD]}
    COMPREPLY=( $(compgen -W "push pull fetch merge rebase" -- $cur) )
}
complete -F _git_custom git`,
      },
      {
        title: "Динамический completion",
        content: `Продвинутые техники completion:`,
        code: `# Completion на основе контекста
_deploy() {
    local cur prev opts
    COMPREPLY=()
    cur="\${COMP_WORDS[COMP_CWORD]}"
    prev="\${COMP_WORDS[COMP_CWORD-1]}"
    opts="staging production development"
    
    case "$prev" in
        deploy)
            COMPREPLY=( $(compgen -W "$opts" -- $cur) )
            return 0
            ;;
        --env)
            COMPREPLY=( $(compgen -W "$opts" -- $cur) )
            return 0
            ;;
    esac
}
complete -F _deploy deploy

# Completion из файла
_mycommand() {
    local cur=\${COMP_WORDS[COMP_CWORD]}
    local hosts=$(cat ~/.ssh/config | grep Host | awk '{print $2}')
    COMPREPLY=( $(compgen -W "$hosts" -- $cur) )
}
complete -F _mycommand mycommand`,
      },
    ],
    exercises: [
      {
        id: "39-1",
        title: "Список completion",
        description: "Покажите все настроенные completion",
        hint: "complete -p",
        expectedCommands: ["complete -p"],
        successMessage: "🎉 Вы видите все completion!",
      },
      {
        id: "39-2",
        title: "Completion для git",
        description: "Покажите completion для команды git",
        hint: "complete -p git",
        expectedCommands: ["complete -p git"],
        successMessage: "🎉 Completion для git показан!",
      },
    ],
  },
  {
    id: 40,
    title: "Мега-проект: Полная автоматизация",
    icon: "🚀",
    description: "Комплексный проект: автоматизация развёртывания приложения с нуля",
    theory: [
      {
        title: "Архитектура проекта",
        content: `Создадим полную систему автоматизации:

**Компоненты:**
1. Скрипт настройки сервера
2. Скрипт деплоя приложения
3. Скрипт мониторинга
4. Скрипт бэкапов
5. Cron задачи
6. Система логирования
7. Алерты`,
        code: `# Структура проекта
automation/
├── scripts/
│   ├── setup-server.sh
│   ├── deploy.sh
│   ├── monitor.sh
│   ├── backup.sh
│   └── alert.sh
├── config/
│   ├── nginx.conf
│   ├── app.env
│   └── logrotate.conf
├── logs/
└── README.md`,
      },
      {
        title: "Скрипт настройки сервера",
        content: `Автоматическая настройка сервера:`,
        code: `#!/bin/bash
# setup-server.sh

set -euo pipefail

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

log "=== Настройка сервера ==="

# Обновление системы
log "Обновление системы..."
apt-get update && apt-get upgrade -y

# Установка пакетов
log "Установка пакетов..."
apt-get install -y \\
    nginx postgresql redis-server \\
    nodejs npm git curl wget \\
    fail2ban ufw htop

# Настройка firewall
log "Настройка firewall..."
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

# Настройка SSH
log "Настройка SSH..."
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd

# Создание пользователя
log "Создание пользователя deploy..."
useradd -m -s /bin/bash deploy
usermod -aG sudo deploy
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh

log "✅ Сервер настроен!"`,
      },
      {
        title: "Скрипт деплоя",
        content: `Автоматический деплой приложения:`,
        code: `#!/bin/bash
# deploy.sh

set -euo pipefail

APP_DIR="/var/www/app"
BACKUP_DIR="/var/backups/app"
LOG_FILE="/var/log/deploy.log"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

# Бэкап текущей версии
backup_current() {
    if [ -d "$APP_DIR" ]; then
        local timestamp=$(date +%Y%m%d_%H%M%S)
        log "Создание бэкапа..."
        cp -r "$APP_DIR" "$BACKUP_DIR/backup_$timestamp"
    fi
}

# Получение кода
deploy_code() {
    log "Получение кода..."
    if [ -d "$APP_DIR" ]; then
        cd "$APP_DIR"
        git pull origin main
    else
        git clone https://github.com/user/app.git "$APP_DIR"
        cd "$APP_DIR"
    fi
}

# Установка зависимостей
install_deps() {
    log "Установка зависимостей..."
    npm ci --production
}

# Сборка
build() {
    log "Сборка приложения..."
    npm run build
}

# Перезапуск сервиса
restart_service() {
    log "Перезапуск сервиса..."
    systemctl restart app
}

# Проверка
health_check() {
    log "Проверка здоровья..."
    sleep 5
    if curl -sf http://localhost:3000/health > /dev/null; then
        log "✅ Деплой успешен!"
    else
        log "❌ Деплой провален!"
        exit 1
    fi
}

# Основной процесс
backup_current
deploy_code
install_deps
build
restart_service
health_check`,
      },
    ],
    exercises: [
      {
        id: "40-1",
        title: "Создание структуры",
        description: "Создайте структуру проекта automation с поддиректориями scripts, config, logs",
        hint: "mkdir -p automation/{scripts,config,logs}",
        expectedCommands: ["mkdir -p automation/{scripts,config,logs}", "mkdir -p automation/scripts automation/config automation/logs"],
        successMessage: "🎉 Структура проекта создана!",
      },
      {
        id: "40-2",
        title: "Скрипт настройки",
        description: "Создайте скрипт setup.sh который выводит 'Server setup complete'",
        hint: "echo '#!/bin/bash' > setup.sh && echo 'echo \"Server setup complete\"' >> setup.sh && chmod +x setup.sh && ./setup.sh",
        expectedCommands: ["echo '#!/bin/bash' > setup.sh && echo 'echo \"Server setup complete\"' >> setup.sh && chmod +x setup.sh && ./setup.sh"],
        successMessage: "🎉 Скрипт настройки создан!",
      },
      {
        id: "40-3",
        title: "Скрипт деплоя",
        description: "Создайте скрипт deploy.sh который выводит 'Deployment successful'",
        hint: "echo '#!/bin/bash' > deploy.sh && echo 'echo \"Deployment successful\"' >> deploy.sh && chmod +x deploy.sh && ./deploy.sh",
        expectedCommands: ["echo '#!/bin/bash' > deploy.sh && echo 'echo \"Deployment successful\"' >> deploy.sh && chmod +x deploy.sh && ./deploy.sh"],
        successMessage: "🎉 Скрипт деплоя создан!",
      },
      {
        id: "40-4",
        title: "Финальная задача",
        description: "Выведите 'I AM A BASH MASTER!' — вы прошли весь курс!",
        hint: "echo 'I AM A BASH MASTER!'",
        expectedCommands: ["echo \"I AM A BASH MASTER!\"", "echo 'I AM A BASH MASTER!'"],
        successMessage: "🏆🎉🎊 ПОЗДРАВЛЯЕМ! ВЫ НАСТОЯЩИЙ BASH MASTER! 🎊🎉🏆",
      },
    ],
  },
];
