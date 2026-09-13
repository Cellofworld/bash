import type { Lesson } from '../types';

export const advancedLessons: Lesson[] = [
  {
    id: 21,
    title: "Docker и контейнеризация",
    icon: "🐳",
    description: "Docker, образы, контейнеры, docker-compose — основа современной инфраструктуры",
    theory: [
      {
        title: "Что такое Docker?",
        content: `**Docker** — платформа для разработки, доставки и запуска приложений в контейнерах.

**Контейнер** — изолированная среда с приложением и его зависимостями.

Преимущества:
- Изоляция приложений
- Воспроизводимость окружения
- Быстрый запуск (в отличие от VM)
- Лёгкость (использует ядро хоста)
- Масштабируемость`,
        code: `$ docker --version              # Версия Docker
$ docker info                  # Информация о системе
$ docker version               # Версия клиента и сервера`,
      },
      {
        title: "Управление образами",
        content: `**Образ** (image) — шаблон для создания контейнеров.`,
        code: `# Поиск и загрузка образов
$ docker search nginx              # Поиск в Docker Hub
$ docker pull nginx                # Скачать образ
$ docker pull nginx:1.25           # Конкретная версия
$ docker pull ubuntu:22.04         # Ubuntu 22.04

# Список образов
$ docker images                    # Все локальные образы
$ docker images -a                 # Включая промежуточные слои

# Управление
$ docker rmi nginx                 # Удалить образ
$ docker rmi $(docker images -q)   # Удалить все образы
$ docker image prune               # Удалить неиспользуемые
$ docker image prune -a            # Удалить все неиспользуемые
$ docker tag myapp:latest myrepo/myapp:v1.0  # Переименовать
$ docker push myrepo/myapp:v1.0    # Отправить в реестр`,
      },
      {
        title: "Управление контейнерами",
        content: `**Контейнер** — запущенный экземпляр образа.`,
        code: `# Запуск контейнеров
$ docker run nginx                          # Запустить nginx
$ docker run -d nginx                       # В фоне (daemon)
$ docker run -d --name web nginx            # С именем
$ docker run -d -p 8080:80 nginx            # Проброс порта
$ docker run -d -v /host:/container nginx   # Монтирование тома
$ docker run -it ubuntu bash                # Интерактивный режим
$ docker run -d -e DB_HOST=localhost myapp  # Переменные окружения
$ docker run --rm nginx                     # Удалить после остановки

# Управление
$ docker ps                        # Запущенные контейнеры
$ docker ps -a                     # Все контейнеры
$ docker stop web                  # Остановить
$ docker start web                 # Запустить
$ docker restart web               # Перезапустить
$ docker rm web                    # Удалить
$ docker rm $(docker ps -aq)       # Удалить все
$ docker logs web                  # Логи контейнера
$ docker logs -f web               # Следить за логами
$ docker exec -it web bash         # Войти в контейнер
$ docker inspect web               # Детальная информация`,
        note: "-d = daemon (фон), -p = порт, -v = volume, -e = env, -it = interactive tty, --rm = удалить после остановки",
      },
      {
        title: "Dockerfile — создание образов",
        content: `**Dockerfile** — инструкция для сборки образа.`,
        code: `# Dockerfile для Node.js приложения
FROM node:18-alpine                # Базовый образ
WORKDIR /app                       # Рабочая директория
COPY package*.json ./              # Копировать package.json
RUN npm ci --production            # Установить зависимости
COPY . .                           # Копировать исходники
RUN npm run build                  # Сборка
EXPOSE 3000                        # Открыть порт
CMD ["node", "dist/server.js"]     # Команда запуска

# Сборка и запуск
$ docker build -t myapp:v1 .       # Собрать образ
$ docker build -t myapp:v1 --no-cache .  # Без кэша
$ docker run -d -p 3000:3000 myapp:v1    # Запустить`,
      },
      {
        title: "Docker Compose",
        content: `**Docker Compose** — инструмент для запуска многоконтейнерных приложений.`,
        code: `# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db
      - REDIS_HOST=redis
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
  
  redis:
    image: redis:7-alpine

volumes:
  pgdata:

# Команды
$ docker-compose up -d             # Запустить в фоне
$ docker-compose down              # Остановить и удалить
$ docker-compose logs -f           # Следить за логами
$ docker-compose ps                # Статус контейнеров
$ docker-compose build             # Пересобрать образы
$ docker-compose exec web bash     # Войти в контейнер`,
      },
    ],
    exercises: [
      {
        id: "21-1",
        title: "Версия Docker",
        description: "Проверьте версию установленного Docker",
        hint: "docker --version",
        expectedCommands: ["docker --version", "docker version"],
        successMessage: "🎉 Docker установлен!",
      },
      {
        id: "21-2",
        title: "Список контейнеров",
        description: "Покажите все запущенные контейнеры",
        hint: "docker ps",
        expectedCommands: ["docker ps"],
        successMessage: "🎉 Вы видите запущенные контейнеры!",
      },
      {
        id: "21-3",
        title: "Список образов",
        description: "Покажите все локальные Docker образы",
        hint: "docker images",
        expectedCommands: ["docker images", "docker image ls"],
        successMessage: "🎉 Вы видите все образы!",
      },
      {
        id: "21-4",
        title: "Запуск контейнера",
        description: "Запустите nginx в фоновом режиме с именем 'web'",
        hint: "docker run -d --name web nginx",
        expectedCommands: ["docker run -d --name web nginx"],
        successMessage: "🎉 Контейнер nginx запущен!",
      },
    ],
  },
  {
    id: 22,
    title: "Git из терминала",
    icon: "🌿",
    description: "Git команды, ветвление, слияние, работа с удалёнными репозиториями",
    theory: [
      {
        title: "Основы Git",
        content: `**Git** — система контроля версий. Основные понятия:
- **Repository** (репозиторий) — проект с историей изменений
- **Commit** — снимок состояния проекта
- **Branch** (ветка) — параллельная линия разработки
- **HEAD** — указатель на текущий коммит`,
        code: `$ git init                       # Инициализировать репозиторий
$ git clone https://github.com/user/repo.git  # Клонировать
$ git status                     # Текущее состояние
$ git log                        # История коммитов
$ git log --oneline              # Краткая история
$ git log --graph --all          # Граф всех веток
$ git diff                       # Изменения в рабочей директории
$ git diff --staged              # Изменения в индексе`,
      },
      {
        title: "Базовый рабочий процесс",
        content: `Типичный цикл работы с Git:`,
        code: `$ git add file.txt               # Добавить файл в индекс
$ git add .                      # Добавить все изменения
$ git add -p                     # Интерактивное добавление
$ git commit -m "Описание"       # Закоммитить
$ git commit -am "Описание"      # Добавить все и закоммитить
$ git reset HEAD file.txt        # Убрать из индекса
$ git checkout -- file.txt       # Отменить изменения в файле
$ git restore file.txt           # (новый синтаксис)
$ git reset --soft HEAD~1        # Отменить коммит, оставить изменения
$ git reset --hard HEAD~1        # Отменить коммит и изменения`,
      },
      {
        title: "Ветки и слияние",
        content: `Ветки позволяют параллельно разрабатывать функции.`,
        code: `$ git branch                       # Список веток
$ git branch feature             # Создать ветку
$ git checkout feature           # Переключиться на ветку
$ git checkout -b feature        # Создать и переключиться
$ git switch feature             # (новый синтаксис)
$ git switch -c feature          # Создать и переключиться
$ git merge feature              # Слить feature в текущую
$ git merge --no-ff feature      # Слить с merge-commit
$ git rebase main                # Переместить на main
$ git branch -d feature          # Удалить ветку
$ git branch -D feature          # Принудительно удалить`,
        note: "merge сохраняет историю, rebase делает её линейной",
      },
      {
        title: "Удалённые репозитории",
        content: `Работа с GitHub, GitLab и другими:`,
        code: `$ git remote -v                  # Список удалённых
$ git remote add origin URL      # Добавить remote
$ git remote set-url origin URL  # Изменить URL
$ git fetch origin               # Получить изменения (без слияния)
$ git pull origin main           # Получить и слить
$ git pull --rebase origin main  # Получить и переместить
$ git push origin main           # Отправить в remote
$ git push -u origin feature     # Отправить с привязкой
$ git push origin --delete feature  # Удалить ветку на remote`,
      },
      {
        title: "Полезные трюки",
        content: `Продвинутые техники Git:`,
        code: `# Stash — временное сохранение
$ git stash                      # Спрятать изменения
$ git stash save "WIP"           # С описанием
$ git stash list                 # Список спрятанных
$ git stash pop                  # Применить и удалить
$ git stash apply                # Применить, не удаляя

# Cherry-pick — взять конкретный коммит
$ git cherry-pick abc123         # Применить коммит

# Bisect — найти баг бинарным поиском
$ git bisect start
$ git bisect bad                 # Текущий — плохой
$ git bisect good v1.0           # v1.0 — хороший
# Git будет переключать коммиты для поиска

# Tag — метки версий
$ git tag v1.0.0                 # Лёгкий тег
$ git tag -a v1.0.0 -m "Release" # Аннотированный
$ git push origin v1.0.0         # Отправить тег`,
      },
    ],
    exercises: [
      {
        id: "22-1",
        title: "Статус репозитория",
        description: "Проверьте текущее состояние Git репозитория",
        hint: "git status",
        expectedCommands: ["git status"],
        successMessage: "🎉 Вы видите статус репозитория!",
      },
      {
        id: "22-2",
        title: "История коммитов",
        description: "Покажите историю коммитов в кратком формате",
        hint: "git log --oneline",
        expectedCommands: ["git log --oneline", "git log"],
        successMessage: "🎉 Вы видите историю проекта!",
      },
      {
        id: "22-3",
        title: "Создание ветки",
        description: "Создайте новую ветку 'feature' и переключитесь на неё",
        hint: "git checkout -b feature",
        expectedCommands: ["git checkout -b feature", "git switch -c feature"],
        successMessage: "🎉 Ветка создана!",
      },
      {
        id: "22-4",
        title: "Отправка изменений",
        description: "Отправьте изменения в удалённый репозиторий origin в ветку main",
        hint: "git push origin main",
        expectedCommands: ["git push origin main"],
        successMessage: "🎉 Изменения отправлены!",
      },
    ],
  },
  {
    id: 23,
    title: "Работа с базами данных",
    icon: "🗄️",
    description: "MySQL, PostgreSQL, SQLite — работа с БД из командной строки",
    theory: [
      {
        title: "MySQL из терминала",
        content: `**mysql** — клиент командной строки для MySQL/MariaDB.`,
        code: `# Подключение
$ mysql -u root -p               # Подключиться как root
$ mysql -u user -h host -p db    # К конкретной БД
$ mysql -u root -p -e "SHOW DATABASES"  # Выполнить команду

# Основные операции
$ mysql -u root -p -e "CREATE DATABASE myapp"
$ mysql -u root -p -e "SHOW DATABASES"
$ mysql -u root -p -e "USE myapp; SHOW TABLES"
$ mysql -u root -p myapp < schema.sql     # Импорт SQL
$ mysqldump -u root -p myapp > backup.sql # Экспорт

# Полезные запросы
$ mysql -u root -p -e "SELECT User,Host FROM mysql.user"
$ mysql -u root -p -e "SHOW PROCESSLIST"
$ mysql -u root -p -e "SHOW VARIABLES LIKE 'max_connections'"`,
      },
      {
        title: "PostgreSQL из терминала",
        content: `**psql** — клиент командной строки для PostgreSQL.`,
        code: `# Подключение
$ psql -U postgres               # Подключиться
$ psql -U user -h host -d dbname # К конкретной БД
$ psql -U postgres -c "SELECT version()"  # Выполнить команду

# Метакоманды psql (в интерактивном режиме)
$ \\l                              # Список БД
$ \\c dbname                       # Подключиться к БД
$ \\dt                             # Список таблиц
$ \\d tablename                    # Описание таблицы
$ \\du                             # Список пользователей
$ \\?                              # Справка
$ \\q                              # Выход

# Операции
$ createdb myapp                   # Создать БД
$ dropdb myapp                     # Удалить БД
$ psql -U postgres myapp < dump.sql  # Импорт
$ pg_dump myapp > backup.sql       # Экспорт
$ pg_dumpall > all_backup.sql      # Экспорт всех БД`,
      },
      {
        title: "SQLite",
        content: `**sqlite3** — лёгкая встраиваемая БД.`,
        code: `$ sqlite3 database.db            # Открыть/создать БД
$ sqlite3 database.db ".tables"    # Список таблиц
$ sqlite3 database.db ".schema"    # Схема БД
$ sqlite3 database.db "SELECT * FROM users"  # Запрос

# Метакоманды
$ .tables                        # Список таблиц
$ .schema users                  # Схема таблицы
$ .headers on                    # Показать заголовки
$ .mode column                   # Колоночный вывод
$ .output file.txt               # Вывод в файл
$ .quit                          # Выход`,
      },
      {
        title: "Бэкап и восстановление",
        content: `Резервное копирование баз данных:`,
        code: `# MySQL
$ mysqldump -u root -p --all-databases > all.sql
$ mysqldump -u root -p myapp > myapp.sql
$ mysqldump -u root -p myapp | gzip > myapp.sql.gz
$ mysql -u root -p myapp < myapp.sql

# PostgreSQL
$ pg_dump -U postgres myapp > myapp.sql
$ pg_dumpall -U postgres > all.sql
$ pg_dump -U postgres -Fc myapp > myapp.dump  # Формат custom
$ psql -U postgres myapp < myapp.sql
$ pg_restore -U postgres -d myapp myapp.dump

# Автоматический бэкап (cron)
# 0 2 * * * mysqldump -u root -pPASS myapp | gzip > /backup/myapp_$(date +\\%Y\\%m\\%d).sql.gz`,
      },
    ],
    exercises: [
      {
        id: "23-1",
        title: "Список БД MySQL",
        description: "Покажите все базы данных MySQL",
        hint: "mysql -u root -p -e \"SHOW DATABASES\"",
        expectedCommands: ["mysql -u root -p -e \"SHOW DATABASES\"", "mysql -u root -e \"SHOW DATABASES\""],
        successMessage: "🎉 Вы видите все базы данных!",
      },
      {
        id: "23-2",
        title: "Экспорт PostgreSQL",
        description: "Сделайте экспорт базы данных myapp используя pg_dump",
        hint: "pg_dump -U postgres myapp > myapp.sql",
        expectedCommands: ["pg_dump -U postgres myapp > myapp.sql", "pg_dump myapp > myapp.sql"],
        successMessage: "🎉 Бэкап БД создан!",
      },
    ],
  },
  {
    id: 24,
    title: "Текстовые редакторы: Vim и Nano",
    icon: "⌨️",
    description: "Vim, Nano — редактирование файлов прямо в терминале",
    theory: [
      {
        title: "Nano — простой редактор",
        content: `**Nano** — простой и интуитивный редактор для начинающих.`,
        code: `$ nano file.txt                  # Открыть файл
$ nano -w file.txt               # Без переноса строк
$ nano +10 file.txt              # Открыть на строке 10
$ nano -l file.txt               # Показать номера строк

# Горячие клавиши (Ctrl + клавиша):
# ^G — справка (help)
# ^O — сохранить (write out)
# ^X — выйти (exit)
# ^K — вырезать строку
# ^U — вставить
# ^W — поиск (where is)
# ^\\ — замена
# ^_ — перейти к строке
# Alt+U — отменить
# Alt+E — повторить`,
        note: "Nano идеален для быстрого редактирования конфигурационных файлов",
      },
      {
        title: "Vim — мощный редактор",
        content: `**Vim** — невероятно мощный модальный редактор.

Режимы:
- **Normal** — навигация и команды (по умолчанию)
- **Insert** — ввод текста (i, a, o)
- **Visual** — выделение (v, V, Ctrl+v)
- **Command** — команды (:)`,
        code: `$ vim file.txt                 # Открыть файл
$ vim +10 file.txt             # На строке 10
$ vim +/pattern file.txt       # Найти паттерн
$ vim -p file1 file2           # Вкладка для каждого файла

# Базовые команды (в Normal mode):
# i — войти в Insert mode (перед курсором)
# a — после курсора
# o — новая строка ниже
# O — новая строка выше
# Esc — вернуться в Normal mode`,
      },
      {
        title: "Vim — навигация",
        content: `Навигация в Vim (Normal mode):`,
        code: `# Движение
h, j, k, l       # Влево, вниз, вверх, вправо
w, b               # Слово вперёд/назад
0, $               # Начало/конец строки
^, g_              # Первый/последний непустой символ
gg, G              # Начало/конец файла
:number            # Перейти к строке
Ctrl+f, Ctrl+b     # Страница вниз/вверх
Ctrl+d, Ctrl+u     # Полстраницы вниз/вверх
%, {, }            # Парная скобка, начало/конец параграфа

# Поиск
/pattern           # Поиск вперёд
?pattern           # Поиск назад
n, N               # Следующее/предыдущее совпадение
*                  # Найти слово под курсором`,
      },
      {
        title: "Vim — редактирование",
        content: `Команды редактирования в Vim:`,
        code: `# Вставка текста
i, I               # Перед курсором / в начало строки
a, A               # После курсора / в конец строки
o, O               # Новая строка ниже/выше

# Удаление
x                  # Символ под курсором
dd                 # Удалить строку
dw                 # Удалить слово
d$                 # Удалить до конца строки
d0                 # Удалить до начала строки
dG                 # Удалить до конца файла

# Копирование (yank)
yy                 # Копировать строку
yw                 # Копировать слово
y$                 # Копировать до конца строки

# Вставка (paste)
p                  # После курсора
P                  # Перед курсором

# Отмена/повтор
u                  # Отменить
Ctrl+r             # Повторить`,
      },
      {
        title: "Vim — команды и макросы",
        content: `Командный режим (:) и продвинутые возможности:`,
        code: `# Сохранение и выход
:w                 # Сохранить
:q                 # Выйти
:wq                # Сохранить и выйти
:x                 # То же самое
:q!                # Выйти без сохранения
:w!                # Сохранить принудительно
:e file            # Открыть другой файл
:sp, :vsp          # Горизонтальное/вертикальное разделение

# Замена и команды
:s/old/new/        # Заменить в строке
:%s/old/new/g      # Заменить во всём файле
:%s/old/new/gc     # С подтверждением
:norm @q           # Выполнить макрос
qq ... q           # Записать макрос (q — стоп)
@q                 # Воспроизвести макрос
:set number        # Показать номера строк
:set syntax=on     # Подсветка синтаксиса`,
      },
    ],
    exercises: [
      {
        id: "24-1",
        title: "Открыть в Nano",
        description: "Откройте файл config.txt в редакторе Nano",
        hint: "nano config.txt",
        expectedCommands: ["nano config.txt"],
        successMessage: "🎉 Nano открыт!",
      },
      {
        id: "24-2",
        title: "Открыть в Vim",
        description: "Откройте файл script.sh в редакторе Vim",
        hint: "vim script.sh",
        expectedCommands: ["vim script.sh", "vi script.sh"],
        successMessage: "🎉 Vim открыт! Нажмите i для ввода, Esc для команд, :wq для сохранения.",
      },
    ],
  },
  {
    id: 25,
    title: "Обработка JSON: jq",
    icon: "📊",
    description: "jq — мощный инструмент для работы с JSON из командной строки",
    theory: [
      {
        title: "Основы jq",
        content: `**jq** — процессор JSON для командной строки. Как sed для JSON.`,
        code: `# Базовое использование
$ echo '{"name":"John","age":30}' | jq '.'
{
  "name": "John",
  "age": 30
}

# Извлечение полей
$ echo '{"name":"John","age":30}' | jq '.name'
"John"

$ echo '{"name":"John","age":30}' | jq -r '.name'
John

# Несколько полей
$ echo '{"name":"John","age":30}' | jq '{n: .name, a: .age}'
{
  "n": "John",
  "a": 30
}`,
      },
      {
        title: "Работа с массивами",
        content: `Обработка массивов в JSON:`,
        code: `# Массив
$ echo '[1,2,3,4,5]' | jq '.[0]'          # Первый элемент: 1
$ echo '[1,2,3,4,5]' | jq '.[-1]'         # Последний: 5
$ echo '[1,2,3,4,5]' | jq '.[1:3]'        # Срез: [2,3]
$ echo '[1,2,3,4,5]' | jq 'length'        # Длина: 5
$ echo '[1,2,3,4,5]' | jq '.[]'           # Все элементы
$ echo '[1,2,3,4,5]' | jq 'map(. * 2)'    # Удвоить: [2,4,6,8,10]
$ echo '[1,2,3,4,5]' | jq 'add'           # Сумма: 15
$ echo '[1,2,3,4,5]' | jq 'sort'          # Сортировка

# Массив объектов
$ echo '[{"name":"A"},{"name":"B"}]' | jq '.[].name'
"A"
"B"

$ echo '[{"name":"A"},{"name":"B"}]' | jq 'map(.name)'
["A", "B"]`,
      },
      {
        title: "Фильтрация и условия",
        content: `Фильтрация данных с jq:`,
        code: `# select — фильтр по условию
$ jq '.[] | select(.age > 25)' data.json
$ jq '[.[] | select(.active == true)]' users.json

# has — проверка наличия ключа
$ jq '.[] | select(has("email"))' data.json

# sort_by — сортировка
$ jq 'sort_by(.age)' users.json
$ jq 'sort_by(.name) | reverse' users.json

# group_by — группировка
$ jq 'group_by(.city)' users.json

# unique — уникальные значения
$ jq '[.[].city] | unique' users.json

# Комбинации
$ jq '[.[] | select(.age > 18)] | sort_by(.name) | .[0:10]' users.json`,
      },
      {
        title: "jq с curl и API",
        content: `jq отлично сочетается с curl для работы с API:`,
        code: `# GitHub API
$ curl -s https://api.github.com/users/octocat | jq '.name'
$ curl -s https://api.github.com/users/octocat/repos | jq '.[].name'

# Погодный API
$ curl -s "wttr.in/Moscow?format=j1" | jq '.current_condition[0].temp_C'

# Практические примеры
# Извлечь IP из JSON
$ curl -s ifconfig.me/json | jq -r '.ip'

# Форматированный вывод
$ curl -s api.example.com/data | jq '.'

# Получить только нужные поля
$ curl -s api.github.com/users | jq '.[] | {login, id, url}'

# Подсчёт элементов
$ curl -s api.github.com/users/octocat/repos | jq 'length'

# Сумма значений
$ curl -s api.example.com/stats | jq '[.[] | .count] | add'`,
      },
    ],
    exercises: [
      {
        id: "25-1",
        title: "Извлечение поля",
        description: "Извлеките поле 'name' из JSON используя jq",
        hint: "echo '{\"name\":\"John\"}' | jq '.name'",
        expectedCommands: ["echo '{\"name\":\"John\"}' | jq '.name'", "echo '{\"name\":\"John\"}' | jq -r '.name'"],
        successMessage: "🎉 jq извлекает данные!",
      },
      {
        id: "25-2",
        title: "Длина массива",
        description: "Получите длину массива [1,2,3,4,5] используя jq",
        hint: "echo '[1,2,3,4,5]' | jq 'length'",
        expectedCommands: ["echo '[1,2,3,4,5]' | jq 'length'"],
        successMessage: "🎉 Длина массива: 5",
      },
      {
        id: "25-3",
        title: "Фильтрация",
        description: "Отфильтруйте пользователей старше 25 лет из JSON массива",
        hint: "echo '[{\"name\":\"A\",\"age\":20},{\"name\":\"B\",\"age\":30}]' | jq '.[] | select(.age > 25)'",
        expectedCommands: ["echo '[{\"name\":\"A\",\"age\":20},{\"name\":\"B\",\"age\":30}]' | jq '.[] | select(.age > 25)'"],
        successMessage: "🎉 Фильтрация работает!",
      },
    ],
  },
  {
    id: 26,
    title: "Отладка и диагностика",
    icon: "🔧",
    description: "dmesg, strace, lsof, tcpdump — инструменты отладки системы",
    theory: [
      {
        title: "dmesg — сообщения ядра",
        content: `**dmesg** показывает сообщения кольцевого буфера ядра.`,
        code: `$ dmesg                        # Все сообщения
$ dmesg | tail                 # Последние сообщения
$ dmesg -T                     # С человекочитаемым временем
$ dmesg -T --level=err         # Только ошибки
$ dmesg -T --level=warn,err    # Предупреждения и ошибки
$ dmesg | grep -i error        # Поиск ошибок
$ dmesg -w                     # Следить в реальном времени
$ dmesg -c                     # Прочитать и очистить буфер`,
        note: "dmesg полезен для диагностики проблем с оборудованием и драйверами",
      },
      {
        title: "lsof — открытые файлы",
        content: `**lsof** (List Open Files) показывает какие файлы открыты процессами.`,
        code: `$ lsof                         # Все открытые файлы
$ lsof -i                      # Все сетевые соединения
$ lsof -i :80                  # Кто использует порт 80
$ lsof -i :443                 # Кто использует порт 443
$ lsof -i tcp                  # Все TCP соединения
$ lsof -i udp                  # Все UDP соединения
$ lsof -p 1234                 # Файлы процесса с PID 1234
$ lsof /var/log/syslog         # Кто открыл файл
$ lsof -u student              # Файлы пользователя
$ lsof +D /var/log             # Файлы в директории
$ lsof -c nginx                # Файлы процесса nginx`,
        note: "lsof -i :port — незаменим для поиска кто занял порт!",
      },
      {
        title: "strace — трассировка системных вызовов",
        content: `**strace** отслеживает системные вызовы и сигналы процесса.`,
        code: `$ strace command               # Трассировать команду
$ strace -p 1234               # Трассировать процесс
$ strace -e trace=file command # Только файловые операции
$ strace -e trace=network command # Только сетевые
$ strace -e trace=open,openat command # Только открытие файлов
$ strace -f command            # Трассировать дочерние процессы
$ strace -o output.txt command # Вывод в файл
$ strace -c command            # Статистика вызовов
$ strace -tt command           # С микросекундами
$ strace -e trace=file -p 1234 # Следить за процессом`,
      },
      {
        title: "tcpdump — анализ сетевого трафика",
        content: `**tcpdump** захватывает и анализирует сетевые пакеты.`,
        code: `$ tcpdump                      # Весь трафик
$ tcpdump -i eth0              # На интерфейсе eth0
$ tcpdump -i any               # На всех интерфейсах
$ tcpdump port 80              # Трафик на порту 80
$ tcpdump port 443             # HTTPS трафик
$ tcpdump host 192.168.1.1     # Трафик с/на хост
$ tcpdump net 192.168.1.0/24   # Трафик сети
$ tcpdump -w capture.pcap      # Записать в файл
$ tcpdump -r capture.pcap      # Прочитать из файла
$ tcpdump -A -i eth0           # ASCII вывод пакетов
$ tcpdump -nn                  # Без разрешения имён`,
        note: "Для tcpdump нужны права root. Используйте с осторожностью!",
      },
      {
        title: "Другие диагностические инструменты",
        content: `Дополнительные инструменты для отладки:`,
        code: `# iostat — статистика ввода-вывода
$ iostat                       # Использование дисков
$ iostat -x 2                  # Расширенная, каждые 2 сек

# vmstat — виртуальная память
$ vmstat 1                     # Каждую секунду
$ vmstat -s                    # Сводка

# sar — системная активность (sysstat)
$ sar -u 1 5                   # CPU каждую секунду, 5 раз
$ sar -r 1 5                   # Память
$ sar -n DEV 1 5               # Сеть

# perf — профилирование производительности
$ perf top                     # Топ функций ядра
$ perf record -g command       # Записать профиль
$ perf report                  # Отчёт

# ltrace — трассировка библиотечных вызовов
$ ltrace command               # Вызовы библиотек

# pidstat — статистика по процессам
$ pidstat 1                    # Каждую секунду
$ pidstat -r                   # Использование памяти`,
      },
    ],
    exercises: [
      {
        id: "26-1",
        title: "Сообщения ядра",
        description: "Покажите последние сообщения ядра с человекочитаемым временем",
        hint: "dmesg -T | tail",
        expectedCommands: ["dmesg -T | tail", "dmesg -T", "dmesg | tail"],
        successMessage: "🎉 Вы видите сообщения ядра!",
      },
      {
        id: "26-2",
        title: "Кто занял порт",
        description: "Найдите процесс, использующий порт 80",
        hint: "lsof -i :80",
        expectedCommands: ["lsof -i :80", "lsof -i:80"],
        successMessage: "🎉 Вы нашли процесс на порту 80!",
      },
      {
        id: "26-3",
        title: "Сетевые соединения",
        description: "Покажите все сетевые соединения используя lsof",
        hint: "lsof -i",
        expectedCommands: ["lsof -i", "lsof -i tcp", "lsof -i udp"],
        successMessage: "🎉 Вы видите все сетевые соединения!",
      },
    ],
  },
  {
    id: 27,
    title: "Управление пользователями",
    icon: "👥",
    description: "useradd, usermod, passwd, groups, sudo — управление учётными записями",
    theory: [
      {
        title: "Создание пользователей",
        content: `Управление учётными записями в Linux:`,
        code: `# Создание пользователей
$ useradd username               # Базовое создание
$ useradd -m username            # С созданием домашней директории
$ useradd -m -s /bin/bash username  # С указанием оболочки
$ useradd -m -G sudo username    # С дополнительными группами
$ adduser username               # Интерактивное создание (Debian/Ubuntu)

# Установка пароля
$ passwd username                # Установить пароль
$ passwd -l username             # Заблокировать аккаунт
$ passwd -u username             # Разблокировать
$ passwd -e username             # Требовать смену пароля
$ passwd -S username             # Статус пароля

# Удаление
$ userdel username               # Удалить пользователя
$ userdel -r username            # С домашней директорией`,
      },
      {
        title: "Модификация пользователей",
        content: `Изменение параметров учётной записи:`,
        code: `# usermod — изменение параметров
$ usermod -aG sudo username      # Добавить в группу sudo
$ usermod -s /bin/zsh username   # Сменить оболочку
$ usermod -d /new/home username  # Сменить домашнюю директорию
$ usermod -L username            # Заблокировать
$ usermod -U username            # Разблокировать
$ usermod -l newname oldname     # Переименовать

# Управление группами
$ groupadd developers            # Создать группу
$ groupdel developers            # Удалить группу
$ usermod -aG developers username # Добавить в группу
$ gpasswd -a username group      # Альтернатива
$ gpasswd -d username group      # Удалить из группы
$ groups username                # Группы пользователя
$ id username                    # UID, GID, группы`,
      },
      {
        title: "Файлы пользователей",
        content: `Системные файлы для управления пользователями:`,
        code: `# /etc/passwd — информация о пользователях
$ cat /etc/passwd
# format: username:x:UID:GID:comment:home:shell
root:x:0:0:root:/root:/bin/bash
student:x:1000:1000:Student:/home/student:/bin/bash

# /etc/shadow — пароли (только root)
$ sudo cat /etc/shadow
# format: username:hash:last_change:min:max:warn:inactive:expire

# /etc/group — группы
$ cat /etc/group
# format: groupname:password:GID:members
sudo:x:27:student,admin
developers:x:1001:student

# Просмотр
$ getent passwd                  # Все пользователи
$ getent group                   # Все группы
$ getent passwd username         # Конкретный пользователь
$ awk -F: '{print $1}' /etc/passwd  # Только имена`,
      },
      {
        title: "sudo — повышение привилегий",
        content: `**sudo** позволяет выполнять команды от имени другого пользователя.`,
        code: `# Использование sudo
$ sudo command                   # Выполнить как root
$ sudo -u user command           # Как конкретный пользователь
$ sudo -i                        # Войти как root (login shell)
$ sudo -s                        # Войти как root (текущая оболочка)
$ sudo -l                        # Показать доступные команды
$ sudo -k                        # Сбросить кэш пароля

# Настройка sudoers
$ visudo                         # Редактировать /etc/sudoers
$ visudo -f /etc/sudoers.d/custom # Пользовательский файл

# Примеры правил sudoers
# username ALL=(ALL) ALL         # Полный доступ
# username ALL=(ALL) NOPASSWD: ALL  # Без пароля
# %group ALL=(ALL) ALL           # Вся группа
# username ALL=/usr/bin/systemctl # Только systemctl`,
        note: "Всегда используйте visudo для редактирования sudoers — он проверяет синтаксис!",
      },
    ],
    exercises: [
      {
        id: "27-1",
        title: "Список пользователей",
        description: "Покажите всех пользователей системы из /etc/passwd",
        hint: "cat /etc/passwd или getent passwd",
        expectedCommands: ["cat /etc/passwd", "getent passwd"],
        successMessage: "🎉 Вы видите всех пользователей!",
      },
      {
        id: "27-2",
        title: "Группы пользователя",
        description: "Покажите группы текущего пользователя",
        hint: "groups или id",
        expectedCommands: ["groups", "id"],
        successMessage: "🎉 Вы видите свои группы!",
      },
      {
        id: "27-3",
        title: "Права sudo",
        description: "Покажите какие sudo команды вам доступны",
        hint: "sudo -l",
        expectedCommands: ["sudo -l"],
        successMessage: "🎉 Вы знаете свои sudo права!",
      },
    ],
  },
  {
    id: 28,
    title: "Сетевая безопасность",
    icon: "🛡️",
    description: "iptables, ufw, fail2ban, SSL — защита сервера",
    theory: [
      {
        title: "UFW — простой firewall",
        content: `**UFW** (Uncomplicated Firewall) — простой интерфейс для iptables.`,
        code: `# Базовое управление
$ ufw status                   # Статус
$ ufw status verbose           # Подробный статус
$ ufw enable                   # Включить
$ ufw disable                  # Выключить
$ ufw default deny incoming    # Запретить входящие
$ ufw default allow outgoing   # Разрешить исходящие

# Правила
$ ufw allow ssh                # Разрешить SSH (22)
$ ufw allow 22                 # По порту
$ ufw allow 80/tcp             # HTTP
$ ufw allow 443/tcp            # HTTPS
$ ufw allow from 192.168.1.0/24  # Из подсети
$ ufw allow from IP to any port 22  # С конкретного IP
$ ufw deny 25                  # Запретить порт
$ ufw delete allow 80          # Удалить правило
$ ufw reset                    # Сбросить все правила
$ ufw reload                   # Перезагрузить`,
      },
      {
        title: "iptables — продвинутый firewall",
        content: `**iptables** — низкоуровневый firewall Linux.`,
        code: `# Просмотр правил
$ iptables -L                  # Все правила
$ iptables -L -n               # Без разрешения имён
$ iptables -L -v               # Подробно
$ iptables -L INPUT -n --line-numbers  # С номерами
$ iptables-save                # Сохранить в формате
$ iptables-restore < rules.txt # Восстановить

# Базовые правила
$ iptables -A INPUT -i lo -j ACCEPT          # Разрешить loopback
$ iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
$ iptables -A INPUT -p tcp --dport 22 -j ACCEPT  # SSH
$ iptables -A INPUT -p tcp --dport 80 -j ACCEPT  # HTTP
$ iptables -A INPUT -p tcp --dport 443 -j ACCEPT # HTTPS
$ iptables -A INPUT -j DROP                  # Запретить остальное

# Удаление правил
$ iptables -D INPUT 5            # Удалить правило 5
$ iptables -F                    # Очистить все правила

# Сохранение (Ubuntu/Debian)
$ netfilter-persistent save
$ apt install iptables-persistent`,
      },
      {
        title: "Fail2ban — защита от брутфорса",
        content: `**Fail2ban** блокирует IP после неудачных попыток входа.`,
        code: `# Управление
$ systemctl status fail2ban    # Статус
$ systemctl restart fail2ban   # Перезапуск
$ fail2ban-client status       # Статус jails
$ fail2ban-client status sshd  # Статус конкретного jail

# Проверка заблокированных
$ fail2ban-client get sshd banip  # Заблокированные IP
$ fail2ban-client set sshd unbanip 1.2.3.4  # Разблокировать

# Логи
$ tail -f /var/log/fail2ban.log
$ grep "Ban" /var/log/fail2ban.log

# Конфигурация
$ cat /etc/fail2ban/jail.local
# [sshd]
# enabled = true
# port = ssh
# filter = sshd
# logpath = /var/log/auth.log
# maxretry = 5
# bantime = 3600
# findtime = 600`,
      },
      {
        title: "SSL/TLS сертификаты",
        content: `Управление SSL сертификатами:`,
        code: `# Let's Encrypt (Certbot)
$ certbot --nginx -d example.com          # Для nginx
$ certbot --apache -d example.com         # Для Apache
$ certbot certonly --standalone -d example.com  # Standalone
$ certbot renew                           # Обновить все
$ certbot renew --dry-run                 # Тест обновления
$ certbot certificates                    # Список сертификатов

# OpenSSL — самоподписанный сертификат
$ openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\
    -keyout server.key -out server.crt \\
    -subj "/C=US/ST=State/L=City/O=Org/CN=example.com"

# Проверка сертификатов
$ openssl s_client -connect example.com:443
$ openssl x509 -in cert.pem -text -noout
$ echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates

# Автоматическое обновление (cron)
# 0 0 1 * * certbot renew --quiet && systemctl reload nginx`,
      },
    ],
    exercises: [
      {
        id: "28-1",
        title: "Статус firewall",
        description: "Проверьте статус UFW firewall",
        hint: "ufw status",
        expectedCommands: ["ufw status", "ufw status verbose"],
        successMessage: "🎉 Вы видите статус firewall!",
      },
      {
        id: "28-2",
        title: "Правила iptables",
        description: "Покажите все правила iptables",
        hint: "iptables -L",
        expectedCommands: ["iptables -L", "iptables -L -n", "iptables -L -v"],
        successMessage: "🎉 Вы видите правила firewall!",
      },
      {
        id: "28-3",
        title: "Статус Fail2ban",
        description: "Проверьте статус Fail2ban",
        hint: "fail2ban-client status",
        expectedCommands: ["fail2ban-client status", "systemctl status fail2ban"],
        successMessage: "🎉 Fail2ban работает!",
      },
    ],
  },
  {
    id: 29,
    title: "Bash one-liners и трюки",
    icon: "⚡",
    description: "Продвинутые техники, однострочники, продуктивность в терминале",
    theory: [
      {
        title: "Подстановка процессов",
        content: `Подстановка процессов позволяет использовать вывод команды как файл:`,
        code: `# <() — вывод как файл для чтения
$ diff <(sort file1.txt) <(sort file2.txt)
$ grep -f <(echo -e "pattern1\\npattern2") file.txt
$ vim <(ls -l)                  # Редактировать вывод как файл

# >() — вывод как канал для записи
$ command > >(grep "error" >> errors.log) 2>&1
$ tar -czf - dir/ | tee >(md5sum > checksum.md5) > backup.tar.gz

# Комбинации
$ paste <(cut -f1 file) <(cut -f3 file)  # Объединить поля`,
      },
      {
        title: "Brace expansion и расширения",
        content: `Мощные расширения Bash:`,
        code: `# Brace expansion
$ echo {1..10}                   # 1 2 3 4 5 6 7 8 9 10
$ echo {a..z}                    # a b c ... z
$ echo {01..12}                  # 01 02 03 ... 12
$ echo file{1..5}.txt            # file1.txt file2.txt ...
$ mkdir -p project/{src,tests,docs}/{js,css,img}
$ cp file.txt{,.bak}             # Копировать в .bak
$ mv file.{txt,md}               # Переименовать расширение

# Parameter expansion
$ echo \${var:-default}          # Значение по умолчанию
$ echo \${var:=default}          # Присвоить если пусто
$ echo \${#var}                  # Длина строки
$ echo \${var^^}                 # В ВЕРХНИЙ РЕГИСТР
$ echo \${var,,}                 # в нижний регистр
$ echo \${var%suffix}            # Удалить суффикс (короткий)
$ echo \${var%%suffix}           # Удалить суффикс (длинный)
$ echo \${var#prefix}            # Удалить префикс (короткий)
$ echo \${var##prefix}           # Удалить префикс (длинный)
$ echo \${var/old/new}           # Заменить первое
$ echo \${var//old/new}          # Заменить все`,
      },
      {
        title: "Полезные one-liners",
        content: `Мощные однострочники для повседневных задач:`,
        code: `# Найти и заменить во всех файлах
$ find . -name "*.txt" -exec sed -i 's/old/new/g' {} +

# Топ-10 самых больших файлов
$ find / -type f -exec du -h {} + 2>/dev/null | sort -rh | head

# Конвертировать все изображения
$ for f in *.png; do convert "$f" "\${f%.png}.jpg"; done

# Мониторинг в реальном времени
$ watch -n 1 'df -h | grep /dev/sda1'
$ watch -n 2 'netstat -tlnp'

# Быстрый HTTP сервер
$ python3 -m http.server 8000

# Подсчёт строк кода
$ find . -name "*.py" -exec cat {} + | wc -l

# Массовое переименование
$ for f in *.JPG; do mv "$f" "\${f%.JPG}.jpg"; done

# Генерация пароля
$ openssl rand -base64 32
$ tr -dc 'A-Za-z0-9!@#$%' < /dev/urandom | head -c 16

# Сравнение директорий
$ diff -qr dir1/ dir2/`,
      },
      {
        title: "Продуктивность в терминале",
        content: `Горячие клавиши и трюки для эффективности:`,
        code: `# История команд
$ history                      # Показать историю
$ history 20                   # Последние 20 команд
$ Ctrl+R                       # Поиск по истории
$ !!                           # Повторить последнюю команду
$ !n                           # Команда номер n из истории
$ !string                      # Последняя команда начинающаяся с string
$ !$                           # Последний аргумент предыдущей команды
$ !*                           # Все аргументы предыдущей команды
$ ^old^new                     # Повторить с заменой

# Алиасы
$ alias ll='ls -la'
$ alias gs='git status'
$ alias ..='cd ..'
$ alias ...='cd ../..'
$ alias grep='grep --color=auto'
$ alias -s txt=vim             # Открыть .txt в vim

# Быстрое создание функций
$ extract() { tar -xzf "$1"; }
$ mkcd() { mkdir -p "$1" && cd "$1"; }
$ server() { python3 -m http.server "$1"; }`,
      },
      {
        title: "Продвинутые скриптовые техники",
        content: `Трюки для написания эффективных скриптов:`,
        code: `# Here-strings и Here-docs
$ grep "pattern" <<< "some text"
$ cat << EOF | mail admin@example.com
> Subject: Alert
> Server is down!
> EOF

# Process substitution для временных файлов
$ command <(generate_data)

# Read с разделителями
$ IFS=: read -r user pass <<< "admin:secret"
$ IFS=, read -ra array <<< "a,b,c,d"

# Mapfile — чтение в массив
$ mapfile -t lines < file.txt
$ mapfile -t array < <(command)

# eval — выполнение строки как команды
$ cmd="ls -la"
$ eval "$cmd"

# xargs для параллельного выполнения
$ find . -name "*.jpg" | xargs -P4 -I {} convert {} {}.png

# Coproc — асинхронные процессы
$ coproc myprocess
$ echo "data" >&\${COPROC[1]}
$ read output <&\${COPROC[0]}`,
      },
    ],
    exercises: [
      {
        id: "29-1",
        title: "Brace expansion",
        description: "Создайте файлы file1.txt ... file5.txt используя brace expansion",
        hint: "touch file{1..5}.txt",
        expectedCommands: ["touch file{1..5}.txt"],
        successMessage: "🎉 Brace expansion работает!",
      },
      {
        id: "29-2",
        title: "Повтор команды",
        description: "Повторите последнюю команду используя !!",
        hint: "!!",
        expectedCommands: ["!!"],
        successMessage: "🎉 Вы повторили последнюю команду!",
      },
      {
        id: "29-3",
        title: "Генерация пароля",
        description: "Сгенерируйте случайный пароль используя openssl",
        hint: "openssl rand -base64 32",
        expectedCommands: ["openssl rand -base64 32", "openssl rand -base64 16"],
        successMessage: "🎉 Пароль сгенерирован!",
      },
    ],
  },
  {
    id: 30,
    title: "Финальный экзамен",
    icon: "🎓",
    description: "Комплексные задачи на все темы курса — станьте настоящим Bash мастером!",
    theory: [
      {
        title: "Что вы изучили",
        content: `Поздравляем! Вы прошли весь курс. Вот что вы теперь умеете:

✅ **Основы Bash** — навигация, файлы, переменные
✅ **Потоки и перенаправления** — pipes, stdin/stdout/stderr
✅ **Поиск и фильтрация** — find, grep, sed, awk
✅ **Условия и циклы** — if, for, while, case
✅ **Скрипты** — аргументы, функции, отладка
✅ **Права доступа** — chmod, chown, umask
✅ **Процессы** — ps, top, kill, nice
✅ **Сеть** — ping, curl, ssh, ss, iptables
✅ **Архивы** — tar, gzip, zip
✅ **Автоматизация** — cron, systemd timers
✅ **Docker** — контейнеры, образы, compose
✅ **Git** — ветки, слияние, remote
✅ **БД** — MySQL, PostgreSQL, SQLite
✅ **Безопасность** — UFW, fail2ban, SSL
✅ **Отладка** — dmesg, lsof, strace, tcpdump
✅ **Продуктивность** — one-liners, алиасы, трюки`,
      },
      {
        title: "Реальные задачи администратора",
        content: `Типичные задачи, которые вы теперь можете решать:

1. **Настройка сервера** — установка и конфигурация ПО
2. **Мониторинг** — скрипты для проверки состояния
3. **Бэкапы** — автоматическое резервное копирование
4. **Деплой** — CI/CD пайплайны
5. **Безопасность** — firewall, SSL, fail2ban
6. **Автоматизация** — cron, systemd timers
7. **Отладка** — поиск и устранение проблем
8. **Обработка данных** — парсинг логов, JSON, CSV
9. **Управление пользователями** — создание, права, группы
10. **Сеть** — диагностика, конфигурация`,
      },
      {
        title: "Полезные ресурсы для дальнейшего обучения",
        content: `Продолжайте совершенствоваться:

**Книги:**
- "The Linux Command Line" — William Shotts
- "Advanced Bash-Scripting Guide" — Mendel Cooper
- "UNIX and Linux System Administration Handbook"

**Онлайн:**
- Exercism.org — практические задачи
- HackerRank — челленджи
- LeetCode — алгоритмы
- OverTheWire (Bandit) — безопасность через игры

**Сертификации:**
- Linux Foundation Certified System Administrator (LFCS)
- CompTIA Linux+
- Red Hat Certified System Administrator (RHCSA)

**Практика:**
- Установите Linux на виртуалку
- Настройте домашний сервер
- Участвуйте в open-source проектах
- Решайте реальные задачи на работе`,
      },
    ],
    exercises: [
      {
        id: "30-1",
        title: "Комплексная задача 1",
        description: "Создайте скрипт backup.sh который создаёт архив директории projects",
        hint: "echo '#!/bin/bash' > backup.sh && echo 'tar -czf backup.tar.gz projects/' >> backup.sh && chmod +x backup.sh && ./backup.sh",
        expectedCommands: ["echo '#!/bin/bash' > backup.sh && echo 'tar -czf backup.tar.gz projects/' >> backup.sh && chmod +x backup.sh && ./backup.sh"],
        successMessage: "🎉 Скрипт бэкапа создан!",
      },
      {
        id: "30-2",
        title: "Комплексная задача 2",
        description: "Найдите все .log файлы в /var и подсчитайте их количество",
        hint: "find /var -name \"*.log\" | wc -l",
        expectedCommands: ["find /var -name \"*.log\" | wc -l", "find /var -name '*.log' | wc -l"],
        successMessage: "🎉 Вы нашли все логи!",
      },
      {
        id: "30-3",
        title: "Комплексная задача 3",
        description: "Создайте пользователя 'deploy' и добавьте его в группу sudo",
        hint: "useradd -m deploy && usermod -aG sudo deploy",
        expectedCommands: ["useradd -m deploy && usermod -aG sudo deploy"],
        successMessage: "🎉 Пользователь создан и добавлен в sudo!",
      },
      {
        id: "30-4",
        title: "Комплексная задача 4",
        description: "Запустите Docker контейнер nginx на порту 8080",
        hint: "docker run -d -p 8080:80 --name web nginx",
        expectedCommands: ["docker run -d -p 8080:80 --name web nginx", "docker run -d -p 8080:80 nginx"],
        successMessage: "🎉 Nginx запущен в Docker!",
      },
      {
        id: "30-5",
        title: "Комплексная задача 5",
        description: "Настройте UFW firewall: разрешите SSH, HTTP и HTTPS",
        hint: "ufw allow ssh && ufw allow 80 && ufw allow 443",
        expectedCommands: ["ufw allow ssh && ufw allow 80 && ufw allow 443", "ufw allow 22 && ufw allow 80 && ufw allow 443"],
        successMessage: "🎉 Firewall настроен!",
      },
      {
        id: "30-6",
        title: "Комплексная задача 6",
        description: "Сделайте бэкап базы данных PostgreSQL myapp",
        hint: "pg_dump -U postgres myapp > myapp_backup.sql",
        expectedCommands: ["pg_dump -U postgres myapp > myapp_backup.sql", "pg_dump myapp > myapp_backup.sql"],
        successMessage: "🎉 Бэкап БД создан!",
      },
      {
        id: "30-7",
        title: "Комплексная задача 7",
        description: "Извлеките все IP адреса из JSON используя curl и jq",
        hint: "curl -s https://api.example.com/data | jq '.[].ip'",
        expectedCommands: ["curl -s https://api.example.com/data | jq '.[].ip'", "curl https://api.example.com/data | jq '.[].ip'"],
        successMessage: "🎉 IP адреса извлечены!",
      },
      {
        id: "30-8",
        title: "Комплексная задача 8",
        description: "Создайте cron задачу для ежедневного бэкапа в 3 часа ночи",
        hint: "crontab -e и добавьте: 0 3 * * * /usr/local/bin/backup.sh",
        expectedCommands: ["crontab -l"],
        successMessage: "🎉 Cron задача создана!",
      },
      {
        id: "30-9",
        title: "Комплексная задача 9",
        description: "Проверьте какие процессы используют порт 443",
        hint: "lsof -i :443 или ss -tlnp | grep 443",
        expectedCommands: ["lsof -i :443", "ss -tlnp | grep 443", "netstat -tlnp | grep 443"],
        successMessage: "🎉 Вы нашли процессы на порту 443!",
      },
      {
        id: "30-10",
        title: "🏆 ФИНАЛЬНАЯ ЗАДАЧА",
        description: "Выведите 'I AM A BASH MASTER!' — вы прошли весь курс!",
        hint: "echo 'I AM A BASH MASTER!'",
        expectedCommands: ["echo \"I AM A BASH MASTER!\"", "echo 'I AM A BASH MASTER!'"],
        successMessage: "🏆🎉🎊 ПОЗДРАВЛЯЕМ! ВЫ НАСТОЯЩИЙ BASH MASTER! 🎊🎉🏆",
      },
    ],
  },
];
