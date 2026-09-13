import type { Lesson } from '../types';

export const lessons: Lesson[] = [
  {
    id: 1,
    title: "Введение в Bash",
    icon: "🚀",
    description: "Что такое Bash, история, зачем нужен и как начать работу",
    theory: [
      {
        title: "Что такое Bash?",
        content: `**Bash** (Bourne Again SHell) — это командная оболочка Unix, созданная Брайаном Фоксом в 1989 году как свободная замена для оболочки Bourne (sh). Bash является стандартной оболочкой в большинстве дистрибутивов Linux и macOS.

Bash — это не просто интерпретатор команд, это полноценный язык программирования, позволяющий автоматизировать задачи, управлять системой и создавать сложные скрипты.

**Зачем учить Bash?**
- Автоматизация рутинных задач
- Управление серверами и инфраструктурой
- Написание скриптов для CI/CD
- Понимание работы операционной системы
- Быстрая обработка данных в терминале`,
      },
      {
        title: "Как работает терминал",
        content: `Когда вы открываете терминал, запускается процесс оболочки (shell). Оболочка:
1. Отображает **приглашение** (prompt) — обычно \`user@host:~$\`
2. Ожидает ввод команды
3. Интерпретирует и выполняет команду
4. Выводит результат
5. Возвращается к ожиданию

Каждая команда возвращает **код возврата** (exit code): 0 = успех, любое другое число = ошибка.`,
        code: `$ echo $?    # Показать код возврата последней команды
$ whoami     # Показать имя текущего пользователя
$ hostname   # Показать имя компьютера
$ date       # Показать текущую дату и время
$ uptime     # Сколько работает система`,
      },
      {
        title: "Получение справки",
        content: `В Linux есть несколько способов получить справку о команде:

- **man** — полное руководство (manual pages)
- **--help** — краткая справка
- **info** — информация в формате GNU
- **apropos** — поиск по описаниям команд`,
        code: `$ man ls          # Полное руководство по команде ls
$ ls --help       # Краткая справка
$ apropos file    # Найти команды связанные с "file"
$ type ls         # Показать тип команды (alias/builtin/external)
$ whatis ls       # Краткое описание команды`,
        note: "Используйте / для поиска внутри man-страниц, q для выхода. n — следующее совпадение.",
      },
      {
        title: "Структура команд",
        content: `Команда в Bash состоит из:
- **Команда** — имя программы или встроенной функции
- **Опции** (флаги) — начинаются с \`-\` или \`--\`
- **Аргументы** — объекты над которыми выполняется команда

\`команда [опции] [аргументы]\``,
        code: `$ ls -la /home           # команда ls, опции -l -a, аргумент /home
$ cp -r -v source/ dest/   # cp с опциями -r (рекурсивно) -v (подробно)
$ grep -i "error" log.txt  # grep с опцией -i (без регистра)
$ find /var -name "*.log"  # find с опцией -name и аргументом шаблона`,
      },
      {
        title: "Первая команда",
        content: `Попробуйте выполнить свою первую команду! Команда \`echo\` выводит текст на экран. Это одна из самых базовых команд в Bash.`,
        code: `$ echo "Привет, мир!"
Привет, мир!

$ echo "Меня зовут $(whoami)"
Меня зовут student

$ echo "Сегодня $(date +%A)"
Сегодня Monday

$ echo -e "Первая строка\\nВторая строка"
Первая строка
Вторая строка`,
        note: "$(command) — это подстановка команды, результат команды вставляется в строку",
      },
    ],
    exercises: [
      {
        id: "1-1",
        title: "Первый echo",
        description: "Выведите на экран текст 'Hello, Bash!' используя команду echo",
        hint: "Используйте: echo \"текст\"",
        expectedCommands: ["echo \"Hello, Bash!\"", "echo 'Hello, Bash!'"],
        successMessage: "🎉 Отлично! Вы выполнили свою первую команду!",
      },
      {
        id: "1-2",
        title: "Узнай себя",
        description: "Используйте команду whoami чтобы узнать имя текущего пользователя",
        hint: "Просто введите whoami",
        expectedCommands: ["whoami"],
        successMessage: "🎉 Теперь вы знаете кто вы в системе!",
      },
      {
        id: "1-3",
        title: "Дата и время",
        description: "Выведите текущую дату с помощью команды date",
        hint: "Введите date",
        expectedCommands: ["date"],
        successMessage: "🎉 Вы знаете текущее время системы!",
      },
      {
        id: "1-4",
        title: "Имя хоста",
        description: "Выведите имя хоста (компьютера) с помощью команды hostname",
        hint: "Введите hostname",
        expectedCommands: ["hostname"],
        successMessage: "🎉 Вы узнали имя компьютера!",
      },
    ],
  },
  {
    id: 2,
    title: "Навигация по файловой системе",
    icon: "📁",
    description: "Команды cd, ls, pwd — перемещение и обзор файловой системы",
    theory: [
      {
        title: "Файловая система Linux",
        content: `В Linux всё есть файл. Файловая система имеет древовидную структуру:

- \`/\` — корневой каталог (root)
- \`/home\` — домашние каталоги пользователей
- \`/etc\` — конфигурационные файлы системы
- \`/var\` — переменные данные (логи, кэш)
- \`/tmp\` — временные файлы
- \`/usr\` — программы и данные пользователей
- \`/bin\` — основные исполняемые файлы
- \`/sbin\` — системные утилиты
- \`/dev\` — файлы устройств
- \`/proc\` — информация о процессах (виртуальная ФС)
- \`/opt\` — дополнительное ПО

**Абсолютный путь** начинается с \`/\` (например, \`/home/user/docs\`)
**Относительный путь** начинается от текущей директории (например, \`docs/file.txt\`)`,
        code: `/
├── home/
│   └── student/
│       ├── Documents/
│       ├── Downloads/
│       └── projects/
├── etc/
│   ├── nginx/
│   ├── passwd
│   └── hosts
├── var/
│   └── log/
├── usr/
│   ├── bin/
│   └── local/
├── tmp/
└── dev/`,
      },
      {
        title: "Команда pwd — где я?",
        content: `Команда **pwd** (Print Working Directory) показывает полный путь к текущей директории.`,
        code: `$ pwd
/home/student

$ pwd -P    # Показать физический путь (без символических ссылок)
/home/student`,
      },
      {
        title: "Команда ls — что здесь?",
        content: `Команда **ls** (list) показывает содержимое директории. Имеет множество полезных опций.`,
        code: `$ ls                    # Простой список файлов
$ ls -l                   # Длинный формат (права, размер, дата)
$ ls -la                  # Включая скрытые файлы
$ ls -lh                  # Размер в читаемом формате (K, M, G)
$ ls -lt                  # Сортировка по времени
$ ls -lS                  # Сортировка по размеру
$ ls -lR                  # Рекурсивно (все подкаталоги)
$ ls *.txt                # Только файлы с расширением .txt
$ ls -l /etc/*.conf       # Конфигурационные файлы в /etc
$ ls -l --color=auto      # С подсветкой синтаксиса`,
        note: "Скрытые файлы начинаются с точки (.) — например .bashrc, .gitignore",
      },
      {
        title: "Команда cd — куда пойти?",
        content: `Команда **cd** (Change Directory) перемещает вас между директориями.`,
        code: `$ cd /home            # Перейти в /home (абсолютный путь)
$ cd Documents        # Перейти в Documents (относительный путь)
$ cd ..               # Перейти на уровень вверх
$ cd ../..            # Перейти на два уровня вверх
$ cd ~                # Перейти в домашнюю директорию
$ cd -                # Перейти в предыдущую директорию
$ cd                  # То же самое — в домашнюю директорию
$ cd ~/projects/web   # Комбинированный путь`,
        note: ".. означает родительскую директорию, . — текущую директорию, ~ — домашнюю",
      },
      {
        title: "Автодополнение (Tab)",
        content: `Самая важная привычка в Bash — использование клавиши **Tab** для автодополнения.

- Начните вводить имя файла/команды и нажмите Tab
- Если есть несколько вариантов — нажмите Tab дважды
- Это экономит время и предотвращает ошибки

**Дополнительные горячие клавиши:**
- \`Ctrl+A\` — в начало строки
- \`Ctrl+E\` — в конец строки
- \`Ctrl+U\` — удалить до начала строки
- \`Ctrl+K\` — удалить до конца строки
- \`Ctrl+W\` — удалить слово
- \`Ctrl+R\` — поиск по истории
- \`Ctrl+L\` — очистить экран
- \`↑/↓\` — навигация по истории`,
        code: `$ Doc[TAB]             # Дополнит до Documents/
$ /etc/ne[TAB][TAB]    # Покажет все варианты
$ ech[TAB]             # Дополнит до echo
$ Ctrl+R               # Поиск в истории команд`,
        note: "Tab — ваш лучший друг! Используйте его постоянно.",
      },
    ],
    exercises: [
      {
        id: "2-1",
        title: "Где я нахожусь?",
        description: "Покажите текущую рабочую директорию с помощью pwd",
        hint: "Введите pwd",
        expectedCommands: ["pwd"],
        successMessage: "🎉 Теперь вы знаете своё местоположение!",
      },
      {
        id: "2-2",
        title: "Список файлов",
        description: "Покажите содержимое текущей директории в длинном формате",
        hint: "Используйте ls с флагом -l",
        expectedCommands: ["ls -l", "ls -la", "ls -lh"],
        successMessage: "🎉 Вы можете просматривать содержимое директорий!",
      },
      {
        id: "2-3",
        title: "Перемещение",
        description: "Перейдите в домашнюю директорию пользователя",
        hint: "Используйте cd ~ или просто cd",
        expectedCommands: ["cd ~", "cd", "cd /home"],
        successMessage: "🎉 Вы умеете перемещаться по файловой системе!",
      },
    ],
  },
  {
    id: 3,
    title: "Работа с файлами",
    icon: "📄",
    description: "Создание, копирование, перемещение и удаление файлов и директорий",
    theory: [
      {
        title: "Создание файлов",
        content: `Есть несколько способов создать файл в Bash:

- **touch** — создать пустой файл (или обновить время модификации)
- **>** — перенаправление вывода в файл
- **cat >** — создать файл с содержимым`,
        code: `$ touch file.txt              # Создать пустой файл
$ touch file1.txt file2.txt     # Создать несколько файлов
$ echo "Привет" > hello.txt     # Создать файл с текстом
$ echo "Ещё строка" >> hello.txt # Добавить строку в конец
$ cat > notes.txt << EOF        # Создать файл с несколькими строками
> Первая строка
> Вторая строка
> EOF`,
        note: "> перезаписывает файл, >> добавляет в конец",
      },
      {
        title: "Просмотр содержимого",
        content: `Для просмотра содержимого файлов используются разные команды:`,
        code: `$ cat file.txt        # Вывести всё содержимое
$ less file.txt       # Постраничный просмотр (q — выход)
$ head file.txt       # Первые 10 строк
$ head -n 5 file.txt  # Первые 5 строк
$ tail file.txt       # Последние 10 строк
$ tail -n 5 file.txt  # Последние 5 строк
$ tail -f log.txt     # Следить за файлом в реальном времени
$ wc file.txt         # Количество строк, слов, байт
$ wc -l file.txt      # Только количество строк`,
      },
      {
        title: "Копирование файлов",
        content: `Команда **cp** (copy) копирует файлы и директории.`,
        code: `$ cp file.txt backup.txt        # Копировать файл
$ cp file.txt /tmp/           # Копировать в другую директорию
$ cp -r dir1/ dir2/           # Рекурсивно копировать директорию
$ cp -i file.txt dest.txt     # Спрашивать перед перезаписью
$ cp -p file.txt backup.txt   # Сохранить атрибуты (время, права)
$ cp file.txt /backup/        # Копировать с сохранением имени`,
        note: "-r (recursive) обязателен для копирования директорий!",
      },
      {
        title: "Перемещение и переименование",
        content: `Команда **mv** (move) перемещает и переименовывает файлы.`,
        code: `$ mv file.txt newname.txt       # Переименовать файл
$ mv file.txt /other/dir/       # Переместить файл
$ mv *.txt /backup/             # Переместить все .txt файлы
$ mv -i file.txt dest.txt       # Спрашивать перед перезаписью
$ mv dir1/ dir2/                # Переместить директорию`,
        note: "mv не создаёт копию — файл физически перемещается (в пределах одной файловой системы)",
      },
      {
        title: "Удаление файлов",
        content: `Команда **rm** (remove) удаляет файлы. Будьте осторожны — удалённые файлы не попадают в корзину!`,
        code: `$ rm file.txt               # Удалить файл
$ rm -i file.txt            # С подтверждением
$ rm -r directory/          # Удалить директорию рекурсивно
$ rm -rf directory/         # Принудительно удалить (без вопросов!)
$ rmdir empty_dir/          # Удалить только пустую директорию`,
        note: "⚠️ Команда rm -rf / удалит ВСЮ систему! Всегда проверяйте пути перед удалением.",
      },
      {
        title: "Создание директорий",
        content: `Команда **mkdir** (make directory) создаёт новые директории.`,
        code: `$ mkdir newdir                  # Создать директорию
$ mkdir dir1 dir2 dir3          # Создать несколько директорий
$ mkdir -p a/b/c/d              # Создать вложенные директории
$ mkdir -p project/{src,tests,docs}  # Создать структуру проекта`,
      },
    ],
    exercises: [
      {
        id: "3-1",
        title: "Создать файл",
        description: "Создайте пустой файл с именем 'test.txt' используя touch",
        hint: "touch имя_файла",
        expectedCommands: ["touch test.txt"],
        successMessage: "🎉 Файл создан!",
      },
      {
        id: "3-2",
        title: "Содержимое файла",
        description: "Создайте файл 'hello.txt' с текстом 'Hello World' используя echo",
        hint: "echo \"текст\" > файл",
        expectedCommands: ["echo \"Hello World\" > hello.txt", "echo 'Hello World' > hello.txt"],
        successMessage: "🎉 Вы создали файл с содержимым!",
      },
      {
        id: "3-3",
        title: "Создать директорию",
        description: "Создайте директорию 'projects' с поддиректориями src и tests одной командой",
        hint: "Используйте mkdir -p",
        expectedCommands: ["mkdir -p projects/src projects/tests", "mkdir -p projects/{src,tests}"],
        successMessage: "🎉 Структура проекта создана!",
      },
      {
        id: "3-4",
        title: "Копирование",
        description: "Скопируйте файл 'hello.txt' в 'backup.txt'",
        hint: "cp source destination",
        expectedCommands: ["cp hello.txt backup.txt"],
        successMessage: "🎉 Файл скопирован!",
      },
      {
        id: "3-5",
        title: "Переименование",
        description: "Переименуйте файл 'test.txt' в 'test_old.txt'",
        hint: "mv old_name new_name",
        expectedCommands: ["mv test.txt test_old.txt"],
        successMessage: "🎉 Файл переименован!",
      },
      {
        id: "3-6",
        title: "Удаление файла",
        description: "Удалите файл 'test_old.txt'",
        hint: "rm filename",
        expectedCommands: ["rm test_old.txt"],
        successMessage: "🎉 Файл удалён!",
      },
    ],
  },
  {
    id: 4,
    title: "Переменные и окружение",
    icon: "🏷️",
    description: "Переменные, типы данных, переменные окружения и экспорт",
    theory: [
      {
        title: "Переменные в Bash",
        content: `Переменные в Bash создаются простым присваиванием. В Bash **все переменные — строки**, но некоторые операции работают с ними как с числами.

**Важные правила:**
- Нет пробелов вокруг \`=\` при присваивании
- Для обращения к значению используется \`$\`
- Имена чувствительны к регистру`,
        code: `$ name="Алексей"          # Присвоить значение
$ age=25                 # Числовое значение
$ echo $name             # Вывести значение: Алексей
$ echo "Мне $age лет"    # Подстановка в строке
$ echo \${name}          # Альтернативная запись (рекомендуется)
$ echo \${name:-default} # Значение по умолчанию
$ echo \${#name}         # Длина строки: 7
$ unset name             # Удалить переменную`,
        note: "Без пробелов! name = \"value\" — ОШИБКА! name=\"value\" — правильно",
      },
      {
        title: "Типы кавычек",
        content: `В Bash три типа кавычек, и они ведут себя по-разному:`,
        code: `# Двойные кавычки — подстановка переменных
$ name="Мир"
$ echo "Привет, $name"    # Привет, Мир

# Одинарные кавычки — буквальная строка
$ echo 'Привет, $name'    # Привет, $name

# Обратные кавычки — выполнение команды (устаревший синтаксис)
$ today=\`date +%Y-%m-%d\`

# $() — выполнение команды (рекомендуемый синтаксис)
$ today=$(date +%Y-%m-%d)
$ files=$(ls *.txt | wc -l)`,
      },
      {
        title: "Переменные окружения",
        content: `Переменные окружения доступны всем процессам. Некоторые важные:`,
        code: `$ echo $HOME          # Домашняя директория
$ echo $USER          # Имя пользователя
$ echo $PATH          # Пути поиска программ
$ echo $SHELL         # Текущая оболочка
$ echo $PWD           # Текущая директория
$ echo $OLDPWD        # Предыдущая директория
$ echo $HOSTNAME      # Имя хоста
$ echo $RANDOM        # Случайное число
$ echo $$             # PID текущего процесса
$ env                 # Показать все переменные окружения
$ export MY_VAR="value"  # Сделать переменную доступной дочерним процессам`,
        note: "export делает переменную доступной для дочерних процессов (скриптов)",
      },
      {
        title: "Массивы",
        content: `Bash поддерживает массивы (индексированные с 0):`,
        code: `$ fruits=("яблоко" "банан" "вишня")    # Создать массив
$ echo \${fruits[0]}              # Первый элемент: яблоко
$ echo \${fruits[@]}              # Все элементы
$ echo \${#fruits[@]}             # Количество элементов: 3
$ fruits+=("дыня")                # Добавить элемент
$ echo \${fruits[*]}              # Все элементы как строка

# Перебор массива
$ for fruit in "\${fruits[@]}"; do
>   echo "Фрукт: $fruit"
> done`,
      },
      {
        title: "Арифметические операции",
        content: `Для вычислений используется \`$(( ))\` или \`let\`:`,
        code: `$ a=10
$ b=3
$ echo $((a + b))      # 13
$ echo $((a - b))      # 7
$ echo $((a * b))      # 30
$ echo $((a / b))      # 3 (целочисленное деление)
$ echo $((a % b))      # 1 (остаток)
$ echo $((a ** 2))     # 100 (степень)
$ let "c = a + b"      # Альтернативный синтаксис
$ echo $c              # 13
$ ((a++))              # Инкремент
$ echo $a              # 11`,
      },
    ],
    exercises: [
      {
        id: "4-1",
        title: "Создать переменную",
        description: "Создайте переменную greeting со значением 'Hello' и выведите её",
        hint: "greeting=\"Hello\" затем echo $greeting",
        expectedCommands: ["greeting=\"Hello\"", "echo $greeting"],
        successMessage: "🎉 Переменная создана и выведена!",
      },
      {
        id: "4-2",
        title: "Арифметика",
        description: "Вычислите результат 15 * 7 используя арифметическое расширение",
        hint: "echo $((15 * 7))",
        expectedCommands: ["echo $((15 * 7))"],
        successMessage: "🎉 Правильно! Результат: 105",
      },
      {
        id: "4-3",
        title: "Переменные окружения",
        description: "Выведите значение переменной HOME (домашняя директория)",
        hint: "echo $HOME",
        expectedCommands: ["echo $HOME"],
        successMessage: "🎉 Вы знаете свою домашнюю директорию!",
      },
    ],
  },
  {
    id: 5,
    title: "Условные конструкции",
    icon: "🔀",
    description: "if/else, тестирование файлов, строк и чисел, case",
    theory: [
      {
        title: "Команда test и [ ]",
        content: `Команда **test** (или эквивалент \`[ ]\`) проверяет условия и возвращает 0 (истина) или 1 (ложь).`,
        code: `# Проверка файлов
$ [ -f file.txt ]       # Файл существует и это обычный файл
$ [ -d /home ]          # Это директория
$ [ -e file.txt ]       # Файл/директория существует
$ [ -r file.txt ]       # Файл доступен для чтения
$ [ -w file.txt ]       # Файл доступен для записи
$ [ -x script.sh ]      # Файл исполняемый
$ [ -s file.txt ]       # Файл не пустой

# Проверка строк
$ [ -z "$str" ]         # Строка пуста
$ [ -n "$str" ]         # Строка не пуста
$ [ "$a" = "$b" ]       # Строки равны
$ [ "$a" != "$b" ]      # Строки не равны

# Числовые сравнения
$ [ $a -eq $b ]         # Равно
$ [ $a -ne $b ]         # Не равно
$ [ $a -gt $b ]         # Больше
$ [ $a -lt $b ]         # Меньше
$ [ $a -ge $b ]         # Больше или равно
$ [ $a -le $b ]         # Меньше или равно`,
        note: "Всегда заключайте переменные в кавычки внутри [ ]: [ \"$var\" = \"value\" ]",
      },
      {
        title: "Конструкция if/elif/else",
        content: `Условный оператор if позволяет выполнять разные действия в зависимости от условия.`,
        code: `# Базовый if
$ if [ -f file.txt ]; then
>   echo "Файл существует"
> fi

# if/else
$ if [ -d /home ]; then
>   echo "Это директория"
> else
>   echo "Это не директория"
> fi

# if/elif/else
$ age=20
$ if [ $age -lt 18 ]; then
>   echo "Несовершеннолетний"
> elif [ $age -lt 60 ]; then
>   echo "Взрослый"
> else
>   echo "Пенсионер"
> fi`,
      },
      {
        title: "Логические операторы",
        content: `Для комбинации условий используются логические операторы:`,
        code: `# Внутри [ ]
$ [ $a -gt 0 ] && [ $a -lt 10 ]     # И (оба условия)
$ [ $a -eq 0 ] || [ $b -eq 0 ]      # ИЛИ (хотя бы одно)
$ ! [ -f file.txt ]                  # НЕ (отрицание)

# Внутри [[ ]] (расширенный тест)
$ [[ $a -gt 0 && $a -lt 10 ]]       # И
$ [[ $a -eq 0 || $b -eq 0 ]]        # ИЛИ
$ [[ ! -f file.txt ]]                # НЕ
$ [[ $str == hello* ]]               # Сравнение с шаблоном

# Цепочки команд
$ command1 && command2    # command2 если command1 успешна
$ command1 || command2    # command2 если command1 провалилась
$ mkdir test && cd test && touch file.txt`,
        note: "[[ ]] безопаснее чем [ ] — поддерживает шаблоны и логические операторы",
      },
      {
        title: "Конструкция case",
        content: `**case** — альтернатива множественным if/elif для проверки одного значения:`,
        code: `$ action="start"
$ case $action in
>   start)
>     echo "Запуск..."
>     ;;
>   stop)
>     echo "Остановка..."
>     ;;
>   restart|reload)
>     echo "Перезапуск..."
>     ;;
>   *)
>     echo "Неизвестное действие"
>     ;;
> esac`,
      },
    ],
    exercises: [
      {
        id: "5-1",
        title: "Проверка файла",
        description: "Проверьте существует ли файл /etc/passwd используя условие if",
        hint: "if [ -f /etc/passwd ]; then echo \"существует\"; fi",
        expectedCommands: ["if [ -f /etc/passwd ]; then echo \"существует\"; fi", "[ -f /etc/passwd ] && echo \"существует\""],
        successMessage: "🎉 Файл существует! Вы умеете проверять условия!",
      },
      {
        id: "5-2",
        title: "Сравнение чисел",
        description: "Проверьте, больше ли число 10 чем 5, используя тест",
        hint: "[ 10 -gt 5 ] && echo \"да\"",
        expectedCommands: ["[ 10 -gt 5 ] && echo \"да\"", "[ 10 -gt 5 ] && echo yes"],
        successMessage: "🎉 10 действительно больше 5!",
      },
    ],
  },
  {
    id: 6,
    title: "Циклы",
    icon: "🔄",
    description: "for, while, until — повторение действий в Bash",
    theory: [
      {
        title: "Цикл for",
        content: `Цикл **for** повторяет набор команд для каждого элемента списка.`,
        code: `# Перебор списка
$ for item in apple banana cherry; do
>   echo "Фрукт: $item"
> done

# Диапазон чисел
$ for i in {1..5}; do
>   echo "Число: $i"
> done

# Диапазон с шагом
$ for i in {0..20..5}; do
>   echo $i    # 0, 5, 10, 15, 20
> done

# C-стиль
$ for ((i=0; i<5; i++)); do
>   echo "Итерация $i"
> done

# Перебор файлов
$ for file in *.txt; do
>   echo "Обрабатываю: $file"
> done`,
      },
      {
        title: "Цикл while",
        content: `Цикл **while** выполняется пока условие истинно.`,
        code: `# Базовый while
$ count=1
$ while [ $count -le 5 ]; do
>   echo "Счётчик: $count"
>   ((count++))
> done

# Чтение файла построчно
$ while IFS= read -r line; do
>   echo "Строка: $line"
> done < file.txt

# Бесконечный цикл (с прерыванием)
$ while true; do
>   echo "Нажмите Ctrl+C для выхода"
>   sleep 1
> done`,
      },
      {
        title: "Управление циклом: break и continue",
        content: `**break** — прерывает цикл, **continue** — переходит к следующей итерации.`,
        code: `# break — выход из цикла
$ for i in {1..10}; do
>   if [ $i -eq 5 ]; then
>     break    # Выйти когда i = 5
>   fi
>   echo $i    # Выведет: 1 2 3 4
> done

# continue — пропустить итерацию
$ for i in {1..10}; do
>   if [ $((i % 2)) -eq 0 ]; then
>     continue  # Пропустить чётные
>   fi
>   echo $i     # Выведет: 1 3 5 7 9
> done`,
      },
      {
        title: "Однострочные циклы",
        content: `Циклы можно записывать в одну строку — полезно для быстрых операций:`,
        code: `# Однострочный for
$ for i in {1..5}; do echo $i; done

# Создать 10 файлов
$ for i in {1..10}; do touch "file_$i.txt"; done

# Конвертировать все файлы
$ for f in *.jpg; do convert "$f" "\${f%.jpg}.png"; done`,
      },
    ],
    exercises: [
      {
        id: "6-1",
        title: "Цикл for",
        description: "Выведите числа от 1 до 5 используя цикл for",
        hint: "for i in {1..5}; do echo $i; done",
        expectedCommands: ["for i in {1..5}; do echo $i; done", "for i in 1 2 3 4 5; do echo $i; done"],
        successMessage: "🎉 Цикл for работает!",
      },
      {
        id: "6-2",
        title: "Создание файлов",
        description: "Создайте 5 файлов с именами file1.txt ... file5.txt используя цикл",
        hint: "for i in {1..5}; do touch file$i.txt; done",
        expectedCommands: ["for i in {1..5}; do touch file$i.txt; done"],
        successMessage: "🎉 5 файлов созданы с помощью цикла!",
      },
      {
        id: "6-3",
        title: "Сумма чисел",
        description: "Выведите сумму чисел от 1 до 10 используя цикл",
        hint: "for i in {1..10}; do echo $i; done",
        expectedCommands: ["for i in {1..10}; do echo $i; done"],
        successMessage: "🎉 Цикл с числами работает!",
      },
    ],
  },
  {
    id: 7,
    title: "Потоки и перенаправления",
    icon: "🔀",
    description: "stdin, stdout, stderr, пайпы, перенаправления",
    theory: [
      {
        title: "Три стандартных потока",
        content: `Каждая команда в Linux имеет три стандартных потока:

- **stdin** (0) — стандартный ввод (клавиатура)
- **stdout** (1) — стандартный вывод (экран)
- **stderr** (2) — стандартный вывод ошибок (экран)

Понимание потоков — ключ к эффективной работе в терминале.`,
        code: `# Каждая команда читает из stdin и пишет в stdout/stderr
$ echo "hello"           # stdout: hello
$ ls /nonexistent        # stderr: ls: cannot access...
$ cat                    # stdin: ждёт ввод с клавиатуры`,
      },
      {
        title: "Перенаправление вывода",
        content: `Перенаправления позволяют направлять потоки в файлы или другие команды.`,
        code: `# Перенаправление stdout
$ echo "hello" > file.txt       # Записать в файл (перезапись)
$ echo "world" >> file.txt      # Добавить в конец файла
$ ls > listing.txt              # Сохранить вывод ls

# Перенаправление stderr
$ ls /nonexistent 2> errors.txt # Ошибки в файл
$ command 2>&1                  # stderr в stdout
$ command > out.txt 2>&1        # Оба потока в файл
$ command &> all.txt            # Оба потока в файл (bash 4+)
$ command 2>/dev/null           # Подавить ошибки
$ command > /dev/null           # Подавить вывод
$ command &> /dev/null          # Подавить всё`,
        note: "/dev/null — \"чёрная дыра\" — всё что туда отправляется, исчезает",
      },
      {
        title: "Конвейеры (pipes)",
        content: `**Pipe** (\`|\`) передаёт stdout одной команды в stdin другой. Это основа Unix-философии: маленькие программы, соединённые вместе.`,
        code: `# Базовые пайпы
$ ls -l | grep ".txt"           # Найти .txt файлы
$ cat file.txt | sort | uniq    # Сортировать и убрать дубликаты
$ history | tail -20            # Последние 20 команд
$ ps aux | grep nginx           # Найти процесс nginx

# Цепочки пайпов
$ cat access.log | grep "ERROR" | wc -l   # Подсчитать ошибки
$ ls -lS | head -5                        # 5 самых больших файлов

# tee — раздвоение потока
$ echo "data" | tee file.txt              # Вывести и записать
$ command | tee -a log.txt                # Добавить к файлу`,
        note: "cat file | grep — антипаттерн! Лучше: grep pattern file",
      },
    ],
    exercises: [
      {
        id: "7-1",
        title: "Перенаправление",
        description: "Сохраните вывод команды ls в файл 'listing.txt'",
        hint: "ls > listing.txt",
        expectedCommands: ["ls > listing.txt", "ls -l > listing.txt"],
        successMessage: "🎉 Вывод сохранён в файл!",
      },
      {
        id: "7-2",
        title: "Конвейер",
        description: "Найдите все процессы с именем 'bash' используя ps и grep",
        hint: "ps aux | grep bash",
        expectedCommands: ["ps aux | grep bash", "ps -ef | grep bash"],
        successMessage: "🎉 Вы освоили пайпы!",
      },
      {
        id: "7-3",
        title: "Подавление ошибок",
        description: "Выполните команду ls /nonexistent, подавив вывод ошибок в /dev/null",
        hint: "ls /nonexistent 2>/dev/null",
        expectedCommands: ["ls /nonexistent 2>/dev/null"],
        successMessage: "🎉 Ошибки подавлены!",
      },
    ],
  },
  {
    id: 8,
    title: "Поиск и фильтрация",
    icon: "🔍",
    description: "find, grep, sort, uniq, xargs — мощные инструменты поиска",
    theory: [
      {
        title: "Команда find — поиск файлов",
        content: `**find** — мощнейший инструмент для поиска файлов по различным критериям.`,
        code: `# Базовый поиск
$ find /home -name "*.txt"          # Найти все .txt файлы
$ find . -name "README*"            # Файлы начинающиеся с README
$ find / -type f -name "*.log"      # Только файлы с .log
$ find / -type d -name "node_modules" # Только директории

# Поиск по размеру
$ find . -size +100M                # Больше 100MB
$ find . -size -1k                  # Меньше 1KB
$ find . -empty                     # Пустые файлы/директории

# Поиск по времени
$ find . -mtime -7                  # Изменённые за последние 7 дней
$ find . -mmin -60                  # Изменённые за последний час

# Действия с найденным
$ find . -name "*.tmp" -delete      # Удалить найденное
$ find . -name "*.sh" -exec chmod +x {} \\;  # Сделать исполняемыми`,
        note: "{} — заменяется найденным файлом, \\; — завершает -exec",
      },
      {
        title: "Команда grep — поиск в содержимом",
        content: `**grep** (Global Regular Expression Print) — поиск строк по шаблону.`,
        code: `# Базовый поиск
$ grep "error" logfile.txt        # Найти строки с "error"
$ grep -i "ERROR" file.txt        # Без учёта регистра
$ grep -r "TODO" ./src/           # Рекурсивно в директории
$ grep -n "pattern" file.txt      # С номерами строк
$ grep -c "error" logfile.txt     # Подсчитать совпадения
$ grep -l "pattern" *.txt         # Только имена файлов
$ grep -v "debug" logfile.txt     # Инверсия (кроме "debug")
$ grep -w "the" file.txt          # Только целые слова

# Регулярные выражения
$ grep "^#.*" config.txt          # Строки начинающиеся с #
$ grep -E "error|warning" log.txt # Расширенные regex (или egrep)`,
      },
      {
        title: "sort, uniq, cut — обработка текста",
        content: `Инструменты для сортировки и обработки текстовых данных:`,
        code: `# sort — сортировка
$ sort file.txt                   # Алфавитная сортировка
$ sort -n numbers.txt             # Числовая сортировка
$ sort -rn numbers.txt            # Числовая по убыванию
$ sort -u file.txt                # Уникальные строки

# uniq — убрать дубликаты (требует сортировки!)
$ sort file.txt | uniq            # Убрать дубликаты
$ sort file.txt | uniq -c         # Подсчитать повторения

# cut — извлечь поля
$ cut -d: -f1 /etc/passwd         # Первое поле (имена)
$ cut -d: -f1,3 /etc/passwd       # Поля 1 и 3`,
      },
    ],
    exercises: [
      {
        id: "8-1",
        title: "Поиск файлов",
        description: "Найдите все файлы с расширением .conf в директории /etc",
        hint: "find /etc -name \"*.conf\"",
        expectedCommands: ["find /etc -name \"*.conf\"", "find /etc -name '*.conf'"],
        successMessage: "🎉 Вы нашли все конфигурационные файлы!",
      },
      {
        id: "8-2",
        title: "Поиск в содержимом",
        description: "Найдите все строки содержащие 'root' в файле /etc/passwd",
        hint: "grep root /etc/passwd",
        expectedCommands: ["grep root /etc/passwd", "grep \"root\" /etc/passwd"],
        successMessage: "🎉 Поиск по содержимому освоен!",
      },
      {
        id: "8-3",
        title: "Рекурсивный поиск",
        description: "Найдите все файлы .txt в текущей директории рекурсивно",
        hint: "find . -name \"*.txt\"",
        expectedCommands: ["find . -name \"*.txt\"", "find . -name '*.txt'"],
        successMessage: "🎉 Рекурсивный поиск работает!",
      },
    ],
  },
  {
    id: 9,
    title: "Текстовые процессоры: sed и awk",
    icon: "✂️",
    description: "Редактирование потоков и обработка структурированных данных",
    theory: [
      {
        title: "sed — потоковый редактор",
        content: `**sed** (Stream Editor) — мощный инструмент для автоматического редактирования текста.`,
        code: `# Замена (s = substitute)
$ sed 's/old/new/' file.txt         # Заменить первое вхождение в строке
$ sed 's/old/new/g' file.txt        # Заменить все вхождения (g = global)
$ sed 's/old/new/gi' file.txt       # Без учёта регистра (i)
$ sed '3s/old/new/' file.txt        # Заменить только в 3-й строке

# Удаление (d = delete)
$ sed '/pattern/d' file.txt         # Удалить строки с pattern
$ sed '/^$/d' file.txt              # Удалить пустые строки

# Изменение файла на месте
$ sed -i 's/old/new/g' file.txt     # Изменить файл напрямую
$ sed -i.bak 's/old/new/g' file.txt # С резервной копией`,
        note: "sed -i без резервной копии опасен! Используйте -i.bak для безопасности",
      },
      {
        title: "awk — язык обработки данных",
        content: `**awk** — мощный язык для обработки структурированного текста (таблиц, CSV, логов).`,
        code: `# Базовая структура: awk 'pattern { action }' file
$ awk '{print $0}' file.txt         # Напечатать всю строку
$ awk '{print $1}' file.txt         # Первое поле
$ awk '{print $1, $3}' file.txt     # Поля 1 и 3

# Разделитель полей
$ awk -F: '{print $1, $3}' /etc/passwd  # Имя и UID

# Условия
$ awk '$3 > 100 {print $1, $3}' data.txt  # Если поле 3 > 100
$ awk '/error/ {print NR, $0}' log.txt    # Строки с "error" + номер

# BEGIN и END
$ awk 'BEGIN {sum=0} {sum+=$1} END {print "Сумма:", sum}' numbers.txt

# Встроенные переменные
$ awk '{print NR, NF, $0}' file.txt
# NR — номер строки, NF — кол-во полей, $0 — вся строка`,
      },
    ],
    exercises: [
      {
        id: "9-1",
        title: "Замена текста",
        description: "Замените все вхождения 'foo' на 'bar' в выводе echo 'foo foo foo'",
        hint: "echo 'foo foo foo' | sed 's/foo/bar/g'",
        expectedCommands: ["echo 'foo foo foo' | sed 's/foo/bar/g'"],
        successMessage: "🎉 sed работает! foo → bar",
      },
      {
        id: "9-2",
        title: "Извлечение полей",
        description: "Извлеките первое поле (имена пользователей) из /etc/passwd используя awk",
        hint: "awk -F: '{print $1}' /etc/passwd",
        expectedCommands: ["awk -F: '{print $1}' /etc/passwd", "awk -F':' '{print $1}' /etc/passwd"],
        successMessage: "🎉 Вы извлекли данные с помощью awk!",
      },
    ],
  },
  {
    id: 10,
    title: "Написание скриптов",
    icon: "📝",
    description: "Shebang, аргументы, отладка, лучшие практики написания скриптов",
    theory: [
      {
        title: "Структура скрипта",
        content: `Bash-скрипт — это текстовый файл с командами. Первый шаг — сделать его исполняемым.`,
        code: `#!/bin/bash
# Описание скрипта
# Автор: Your Name
# Дата: 2024-01-01

# Строгий режим (рекомендуется!)
set -euo pipefail

# Основной код
echo "Привет from script!"

# ---
# Как запустить:
# chmod +x script.sh    # Сделать исполняемым
# ./script.sh           # Запустить
# bash script.sh        # Альтернативный запуск`,
        note: "#!/bin/bash (shebang) указывает какой интерпретатор использовать",
      },
      {
        title: "Аргументы скрипта",
        content: `Скрипты могут принимать аргументы командной строки:`,
        code: `#!/bin/bash
# script.sh name age

# Позиционные параметры
echo "Имя: $1"        # Первый аргумент
echo "Возраст: $2"    # Второй аргумент
echo "Все: $@"        # Все аргументы
echo "Кол-во: $#"     # Количество аргументов
echo "Скрипт: $0"     # Имя скрипта

# Проверка аргументов
if [ $# -lt 2 ]; then
    echo "Использование: $0 <name> <age>"
    exit 1
fi`,
      },
      {
        title: "Функции в скриптах",
        content: `Функции позволяют структурировать код и избежать повторений:`,
        code: `#!/bin/bash

# Определение функции
greet() {
    local name=$1    # local — локальная переменная
    echo "Привет, $name!"
}

# Вызов функции
greet "Алексей"
greet "Мария"

# Функция с возвратом значения
calculate() {
    local a=$1
    local b=$2
    echo $((a + b))    # Возврат через echo
}

result=$(calculate 5 3)
echo "Результат: $result"`,
      },
      {
        title: "Отладка скриптов",
        content: `Bash предоставляет мощные средства отладки:`,
        code: `# Запуск с отладкой
$ bash -x script.sh           # Выводить каждую команду перед выполнением
$ bash -n script.sh           # Проверка синтаксиса без выполнения

# set в скрипте
set -x    # Включить отладку (вывод команд с +)
set +x    # Выключить отладку

# set -e — выход при ошибке
set -e    # Скрипт завершится если любая команда вернёт != 0

# Рекомендуемая комбинация:
set -euo pipefail

# trap — обработка сигналов
trap 'echo "Ошибка на строке $LINENO"' ERR
trap 'echo "Выход..."; cleanup' EXIT`,
      },
    ],
    exercises: [
      {
        id: "10-1",
        title: "Первый скрипт",
        description: "Создайте и выполните скрипт, который выводит 'Hello from script!'",
        hint: "echo '#!/bin/bash\necho \"Hello from script!\"' > script.sh && chmod +x script.sh && ./script.sh",
        expectedCommands: ["echo '#!/bin/bash' > script.sh && echo 'echo \"Hello from script!\"' >> script.sh && chmod +x script.sh && ./script.sh"],
        successMessage: "🎉 Ваш первый скрипт работает!",
      },
      {
        id: "10-2",
        title: "Скрипт с аргументами",
        description: "Создайте скрипт, который принимает имя как аргумент и приветствует пользователя",
        hint: "echo '#!/bin/bash\necho \"Hello, $1!\"' > greet.sh && chmod +x greet.sh && ./greet.sh World",
        expectedCommands: ["echo '#!/bin/bash' > greet.sh && echo 'echo \"Hello, $1!\"' >> greet.sh && chmod +x greet.sh && ./greet.sh World"],
        successMessage: "🎉 Скрипт с аргументами работает!",
      },
    ],
  },
  {
    id: 11,
    title: "Права доступа и владельцы",
    icon: "🔐",
    description: "chmod, chown, umask, специальные права — управление доступом к файлам",
    theory: [
      {
        title: "Понятие прав доступа",
        content: `В Linux каждый файл имеет владельца, группу и набор прав:

- **r** (read, 4) — чтение
- **w** (write, 2) — запись
- **x** (execute, 1) — выполнение

Права устанавливаются для трёх категорий:
- **u** (user/owner) — владелец
- **g** (group) — группа
- **o** (others) — все остальные

\`-rwxr-xr--\` означает: владелец может всё, группа может читать и выполнять, остальные — только читать.`,
        code: `$ ls -l file.txt
-rw-r--r-- 1 student users 1234 Jan 1 12:00 file.txt
│││││││││
│└┤└┤└┤└── владелец
│ │  │  └── права остальных (r--)
│ │  └───── права группы (r--)
│ └──────── права владельца (rw-)
└────────── тип файла (- = файл, d = директория)`,
      },
      {
        title: "Команда chmod — изменение прав",
        content: `**chmod** (change mode) изменяет права доступа к файлам. Два синтаксиса:`,
        code: `# Символьный синтаксис
$ chmod u+x script.sh       # Добавить выполнение для владельца
$ chmod g+w file.txt        # Добавить запись для группы
$ chmod o-r file.txt        # Убрать чтение у остальных
$ chmod a+x script.sh       # Добавить выполнение для всех
$ chmod u=rwx,g=rx,o=rx script.sh  # Установить точно

# Числовой (восьмеричный) синтаксис
$ chmod 755 script.sh       # rwxr-xr-x (владелец: всё, остальные: чтение+выполнение)
$ chmod 644 file.txt        # rw-r--r-- (владелец: чтение+запись, остальные: чтение)
$ chmod 700 private_dir/    # rwx------ (только владелец)
$ chmod 600 secret.key      # rw------- (только владелец, чтение+запись)
$ chmod 777 bad_idea.txt    # rwxrwxrwx (ВСЕМ ВСЁ — опасно!)

# Рекурсивно
$ chmod -R 755 directory/   # Применить ко всем файлам в директории`,
        note: "Частые комбинации: 755 для директорий и скриптов, 644 для обычных файлов, 600 для секретов",
      },
      {
        title: "Команда chown — смена владельца",
        content: `**chown** (change owner) изменяет владельца и/или группу файла.`,
        code: `$ chown user file.txt              # Сменить владельца
$ chown user:group file.txt        # Сменить владельца и группу
$ chown :group file.txt            # Сменить только группу
$ chown -R user:group directory/   # Рекурсивно
$ chown --reference=ref.txt file.txt # Копировать владельца из другого файла

# Примеры из практики
$ sudo chown www-data:www-data /var/www/html
$ sudo chown -R deploy:deploy /opt/app`,
      },
      {
        title: "Специальные права: SUID, SGID, Sticky Bit",
        content: `Помимо обычных прав, есть специальные биты:

- **SUID** (4) — файл выполняется с правами владельца
- **SGID** (2) — файл выполняется с правами группы; для директорий — новые файлы наследуют группу
- **Sticky Bit** (1) — в директории только владелец может удалять свои файлы`,
        code: `# SUID — passwd использует для изменения пароля
$ chmod u+s program       # Установить SUID
$ chmod 4755 program      # То же числом
$ ls -l /usr/bin/passwd
-rwsr-xr-x 1 root root ... /usr/bin/passwd

# SGID — для общих директорий
$ chmod g+s shared_dir/   # Новые файлы наследуют группу
$ chmod 2775 shared_dir/

# Sticky Bit — /tmp
$ chmod +t shared_dir/    # Только владелец может удалять
$ chmod 1777 /tmp
$ ls -ld /tmp
drwxrwxrwt 1 root root ... /tmp`,
        note: "SUID на скриптах игнорируется в большинстве систем из соображений безопасности",
      },
      {
        title: "umask — права по умолчанию",
        content: `**umask** определяет права, которые ВЫЧИТАЮТС из максимальных при создании файлов:

- Файлы создаются с макс. правами 666 (rw-rw-rw-)
- Директории — 777 (rwxrwxrwx)
- umask вычитается из этих значений`,
        code: `$ umask            # Показать текущее значение
0022

$ umask 022        # Файлы: 644, директории: 755
$ umask 077        # Файлы: 600, директории: 700
$ umask 002        # Файлы: 664, директории: 775

# Проверить
$ umask
$ touch test_umask.txt
$ ls -l test_umask.txt
# Если umask 022, то -rw-r--r--
# Если umask 077, то -rw-------`,
      },
    ],
    exercises: [
      {
        id: "11-1",
        title: "Сделать исполняемым",
        description: "Сделайте файл script.sh исполняемым для всех пользователей",
        hint: "chmod +x script.sh или chmod 755 script.sh",
        expectedCommands: ["chmod +x script.sh", "chmod 755 script.sh", "chmod a+x script.sh"],
        successMessage: "🎉 Файл стал исполняемым!",
      },
      {
        id: "11-2",
        title: "Приватный файл",
        description: "Установите права 600 на файл secret.key (только владелец может читать и писать)",
        hint: "chmod 600 secret.key",
        expectedCommands: ["chmod 600 secret.key"],
        successMessage: "🎉 Файл защищён! Только владелец имеет доступ.",
      },
      {
        id: "11-3",
        title: "Директория для скриптов",
        description: "Установите права 755 на директорию scripts (владелец пишет, все читают и выполняют)",
        hint: "chmod 755 scripts",
        expectedCommands: ["chmod 755 scripts"],
        successMessage: "🎉 Директория доступна для выполнения!",
      },
    ],
  },
  {
    id: 12,
    title: "Управление процессами",
    icon: "⚙️",
    description: "ps, top, kill, jobs — мониторинг и управление процессами",
    theory: [
      {
        title: "Что такое процесс?",
        content: `**Процесс** — это запущенная программа с выделенными ресурсами. Каждый процесс имеет:

- **PID** — уникальный идентификатор процесса
- **PPID** — PID родительского процесса
- **UID** — владелец процесса
- **Приоритет** (nice) — от -20 (высший) до 19 (низший)
- **Состояние** — running, sleeping, stopped, zombie

Системные процессы:
- PID 1 — init/systemd (родитель всех процессов)
- PID 0 — ядро (swapper)`,
        code: `$ echo $$          # PID текущей оболочки
$ echo $!          # PID последнего фонового процесса
$ echo $PPID       # PID родительского процесса`,
      },
      {
        title: "Просмотр процессов: ps",
        content: `Команда **ps** (process status) показывает информацию о процессах.`,
        code: `$ ps                    # Процессы текущего терминала
$ ps aux                # Все процессы (a=all, u=user format, x=без терминала)
$ ps -ef                # Все процессы (полный формат)
$ ps aux | grep nginx   # Найти процесс nginx
$ ps -p 1234            # Информация о конкретном PID
$ ps -u student         # Процессы пользователя
$ ps --sort=-%mem       # Сортировка по памяти (убывание)
$ ps --sort=-%cpu       # Сортировка по CPU
$ ps aux --forest       # Дерево процессов`,
        note: "ps aux | grep — классика! Но лучше: pgrep -a nginx",
      },
      {
        title: "Мониторинг в реальном времени: top и htop",
        content: `**top** — интерактивный мониторинг процессов. **htop** — улучшенная версия.`,
        code: `$ top                 # Запустить top
$ top -u student      # Только процессы пользователя
$ top -p 1234         # Следить за конкретным PID

# Горячие клавиши в top:
# q — выход
# k — kill процесс
# r — renice (изменить приоритет)
# M — сортировка по памяти
# P — сортировка по CPU
# 1 — показать все CPU

# htop — улучшенный top (если установлен)
$ htop`,
      },
      {
        title: "Завершение процессов: kill",
        content: `Команда **kill** отправляет сигналы процессам.`,
        code: `# Сигналы
$ kill 1234             # SIGTERM (15) — мягкое завершение
$ kill -9 1234          # SIGKILL (9) — принудительное завершение
$ kill -15 1234         # SIGTERM — то же самое
$ kill -1 1234          # SIGHUP — перезагрузка конфигурации
$ kill -STOP 1234       # Остановить процесс
$ kill -CONT 1234       # Продолжить остановленный

# killall — по имени
$ killall nginx         # Завершить все процессы nginx
$ killall -9 python     # Принудительно завершить все python

# pkill — по шаблону
$ pkill -f "python app.py"   # По полной строке команды
$ pkill -u student           # Все процессы пользователя`,
        note: "Всегда начинайте с SIGTERM (kill PID). SIGKILL (-9) — крайняя мера!",
      },
      {
        title: "Фоновые и приоритетные процессы",
        content: `Управление выполнением процессов:`,
        code: `# Фоновый режим
$ long_command &        # Запустить в фоне
$ Ctrl+Z               # Приостановить текущий процесс
$ bg                   # Продолжить в фоне
$ fg                   # Вернуть на передний план
$ jobs                 # Список фоновых задач

# Приоритет (nice)
$ nice -n 10 command    # Запустить с низким приоритетом
$ renice -n 5 -p 1234   # Изменить приоритет запущенного
$ nice -n -10 command   # Высокий приоритет (нужен root)

# nohup — не прерывать при выходе
$ nohup long_command &          # Работает после закрытия терминала
$ nohup long_command > out.log 2>&1 &  # С логированием`,
      },
    ],
    exercises: [
      {
        id: "12-1",
        title: "Список процессов",
        description: "Покажите все запущенные процессы в системе",
        hint: "ps aux или ps -ef",
        expectedCommands: ["ps aux", "ps -ef", "ps -e"],
        successMessage: "🎉 Вы видите все процессы системы!",
      },
      {
        id: "12-2",
        title: "Поиск процесса",
        description: "Найдите процессы с именем 'bash' используя ps и grep",
        hint: "ps aux | grep bash",
        expectedCommands: ["ps aux | grep bash", "ps -ef | grep bash"],
        successMessage: "🎉 Вы нашли процессы bash!",
      },
      {
        id: "12-3",
        title: "Мониторинг ресурсов",
        description: "Запустите интерактивный мониторинг процессов",
        hint: "top или htop",
        expectedCommands: ["top", "htop"],
        successMessage: "🎉 Мониторинг запущен!",
      },
    ],
  },
  {
    id: 13,
    title: "Сетевые команды",
    icon: "🌐",
    description: "ping, curl, wget, ssh, netstat — работа с сетью из терминала",
    theory: [
      {
        title: "Проверка соединения: ping",
        content: `**ping** проверяет доступность хоста по ICMP.`,
        code: `$ ping google.com             # Бесконечный пинг (Ctrl+C для остановки)
$ ping -c 4 google.com        # Отправить 4 пакета
$ ping -i 0.5 google.com      # Интервал 0.5 секунды
$ ping -W 2 google.com        # Таймаут 2 секунды
$ ping -s 1024 google.com     # Размер пакета 1024 байт`,
      },
      {
        title: "Загрузка файлов: wget и curl",
        content: `**wget** — для скачивания файлов, **curl** — для работы с API и HTTP.`,
        code: `# wget — скачивание файлов
$ wget https://example.com/file.zip        # Скачать файл
$ wget -O output.zip URL                   # Сохранить под другим именем
$ wget -c URL                              # Продолжить прерванную загрузку
$ wget -r -np URL                          # Рекурсивно (без подъёма)
$ wget -q URL                              # Тихий режим

# curl — HTTP запросы
$ curl https://api.example.com             # GET запрос
$ curl -o file.zip URL                     # Сохранить в файл
$ curl -I https://example.com              # Только заголовки
$ curl -X POST -d "data" URL              # POST запрос
$ curl -H "Authorization: Bearer token" URL # С заголовком
$ curl -s URL | jq .                       # JSON форматирование
$ curl -L URL                              # Следовать редиректам`,
        note: "wget лучше для скачивания, curl — для API и отладки HTTP",
      },
      {
        title: "Удалённый доступ: SSH",
        content: `**SSH** (Secure Shell) — безопасное удалённое подключение.`,
        code: `# Подключение
$ ssh user@server.com              # Базовое подключение
$ ssh -p 2222 user@server.com      # На другом порту
$ ssh -i ~/.ssh/key user@server    # С ключом
$ ssh -L 8080:localhost:80 server  # Проброс порта (local)
$ ssh -R 9090:localhost:3000 server # Удалённый проброс порта

# Копирование файлов: scp
$ scp file.txt user@server:/path/          # Отправить файл
$ scp user@server:/path/file.txt ./        # Получить файл
$ scp -r dir/ user@server:/path/           # Рекурсивно

# rsync — умное копирование
$ rsync -avz source/ user@server:/dest/    # Синхронизация
$ rsync -avz --delete source/ dest/        # С удалением лишних`,
      },
      {
        title: "Сетевая диагностика",
        content: `Инструменты для анализа сети:`,
        code: `# Информация о сетевых интерфейсах
$ ip addr                       # IP адреса
$ ip route                      # Таблица маршрутизации
$ ifconfig                      # (устаревший, но ещё используется)

# Сетевые соединения
$ ss -tlnp                      # Слушающие TCP порты с процессами
$ ss -tunap                     # Все соединения
$ netstat -tlnp                 # (альтернатива ss)

# DNS
$ dig example.com               # DNS запрос
$ nslookup example.com          # Простой DNS запрос
$ host example.com              # Ещё один вариант

# Трассировка
$ traceroute example.com        # Маршрут до хоста
$ tracepath example.com         # Альтернатива

# whois — информация о домене
$ whois example.com`,
      },
    ],
    exercises: [
      {
        id: "13-1",
        title: "Проверка связи",
        description: "Отправьте 4 ICMP пакета на google.com",
        hint: "ping -c 4 google.com",
        expectedCommands: ["ping -c 4 google.com", "ping google.com -c 4"],
        successMessage: "🎉 Соединение проверено!",
      },
      {
        id: "13-2",
        title: "Сетевые порты",
        description: "Покажите все слушающие TCP порты с процессами",
        hint: "ss -tlnp или netstat -tlnp",
        expectedCommands: ["ss -tlnp", "netstat -tlnp"],
        successMessage: "🎉 Вы видите сетевые порты!",
      },
      {
        id: "13-3",
        title: "Диагностика DNS",
        description: "Выполните DNS запрос для домена example.com",
        hint: "dig example.com",
        expectedCommands: ["dig example.com", "nslookup example.com"],
        successMessage: "🎉 DNS запрос выполнен!",
      },
    ],
  },
  {
    id: 14,
    title: "Архивирование и сжатие",
    icon: "📦",
    description: "tar, gzip, zip — создание и распаковка архивов",
    theory: [
      {
        title: "Команда tar — архивирование",
        content: `**tar** (Tape Archive) — основной инструмент архивирования в Linux.`,
        code: `# Создание архива
$ tar -cf archive.tar files/           # Создать архив (c=create, f=file)
$ tar -czf archive.tar.gz files/       # Создать с gzip сжатием (z)
$ tar -cjf archive.tar.bz2 files/      # Создать с bzip2 сжатием (j)
$ tar -cJf archive.tar.xz files/       # Создать с xz сжатием (J)

# Распаковка
$ tar -xf archive.tar                  # Распаковать (x=extract)
$ tar -xzf archive.tar.gz              # Распаковать gzip
$ tar -xjf archive.tar.bz2             # Распаковать bzip2
$ tar -xJf archive.tar.xz              # Распаковать xz

# Просмотр содержимого
$ tar -tf archive.tar                  # Список файлов (t=list)
$ tar -tzf archive.tar.gz              # Список в сжатом архиве

# Полезные опции
$ tar -xzf archive.tar.gz -C /dest/    # Распаковать в директорию
$ tar -czf backup.tar.gz --exclude='*.log' dir/  # Исключить файлы
$ tar -czvf archive.tar.gz dir/        # v=verbose (подробный вывод)`,
        note: "Запоминалка: czf = create zip file, xzf = extract zip file",
      },
      {
        title: "Инструменты сжатия",
        content: `Отдельные утилиты для сжатия отдельных файлов:`,
        code: `# gzip — самое распространённое
$ gzip file.txt              # Сжать (file.txt.gz)
$ gzip -k file.txt           # Сжать, оставить оригинал
$ gunzip file.txt.gz         # Распаковать
$ gzip -d file.txt.gz        # То же самое
$ gzip -9 file.txt           # Максимальное сжатие

# bzip2 — лучшее сжатие, медленнее
$ bzip2 file.txt             # Сжать
$ bunzip2 file.txt.bz2       # Распаковать

# xz — лучшее сжатие, самое медленное
$ xz file.txt                # Сжать
$ unxz file.txt.xz           # Распаковать

# zip — кроссплатформенный
$ zip archive.zip file1 file2       # Создать архив
$ zip -r archive.zip directory/     # Рекурсивно
$ unzip archive.zip                 # Распаковать
$ unzip -l archive.zip              # Список файлов`,
      },
      {
        title: "Практические примеры",
        content: `Типичные задачи с архивами:`,
        code: `# Бэкап домашней директории
$ tar -czf backup_$(date +%Y%m%d).tar.gz \\
    --exclude='*.cache' \\
    --exclude='.local/share/Trash' \\
    /home/student

# Бэкап базы данных + архив
$ mysqldump -u root db_name | gzip > db_backup.sql.gz

# Распаковать конкретный файл из архива
$ tar -xzf archive.tar.gz path/to/specific/file

# Сжать все .log файлы
$ find /var/log -name "*.log" -exec gzip {} \\;

# Создать архив и разбить на части по 100MB
$ tar -czf - large_dir/ | split -b 100M - backup.tar.gz.part
# Восстановить:
$ cat backup.tar.gz.part* | tar -xzf -`,
      },
    ],
    exercises: [
      {
        id: "14-1",
        title: "Создать архив",
        description: "Создайте gzip-архив директории projects с именем backup.tar.gz",
        hint: "tar -czf backup.tar.gz projects/",
        expectedCommands: ["tar -czf backup.tar.gz projects/", "tar -czf backup.tar.gz projects"],
        successMessage: "🎉 Архив создан!",
      },
      {
        id: "14-2",
        title: "Распаковать архив",
        description: "Распакуйте архив backup.tar.gz",
        hint: "tar -xzf backup.tar.gz",
        expectedCommands: ["tar -xzf backup.tar.gz", "tar -xf backup.tar.gz"],
        successMessage: "🎉 Архив распакован!",
      },
      {
        id: "14-3",
        title: "Содержимое архива",
        description: "Покажите содержимое архива backup.tar.gz без распаковки",
        hint: "tar -tzf backup.tar.gz",
        expectedCommands: ["tar -tzf backup.tar.gz", "tar -tf backup.tar.gz"],
        successMessage: "🎉 Вы видите содержимое архива!",
      },
    ],
  },
  {
    id: 15,
    title: "Cron и автоматизация",
    icon: "⏰",
    description: "Планирование задач, cron, systemd timers, автоматизация",
    theory: [
      {
        title: "Cron — планировщик задач",
        content: `**cron** — демон для выполнения задач по расписанию. Формат crontab:

\`\`\`
* * * * * команда
│ │ │ │ │
│ │ │ │ └── день недели (0-7, 0 и 7 = воскресенье)
│ │ │ └──── месяц (1-12)
│ │ └────── день месяца (1-31)
│ └──────── час (0-23)
└────────── минута (0-59)
\`\`\`

Специальные символы:
- \`*\` — любое значение
- \`*/5\` — каждые 5 единиц
- \`1,3,5\` — конкретные значения
- \`1-5\` — диапазон`,
        code: `# Управление crontab
$ crontab -e              # Редактировать crontab
$ crontab -l              # Показать текущий crontab
$ crontab -r              # Удалить crontab

# Примеры расписаний
# Каждую минуту
* * * * * /path/to/script.sh

# Каждый день в 3:00 ночи
0 3 * * * /path/to/backup.sh

# Каждый понедельник в 9:00
0 9 * * 1 /path/to/report.sh

# Каждые 5 минут
*/5 * * * * /path/to/check.sh

# Каждый час в 0 минут
0 * * * * /path/to/hourly.sh

# Первое число каждого месяца в полночь
0 0 1 * * /path/to/monthly.sh

# В рабочие дни (пн-пт) в 8:30
30 8 * * 1-5 /path/to/daily.sh`,
        note: "Всегда используйте абсолютные пути в cron! Окружение отличается от вашего терминала.",
      },
      {
        title: "Специальные расписания",
        content: `Cron поддерживает удобные сокращения:`,
        code: `@reboot    /path/to/script.sh     # При загрузке системы
@yearly    /path/to/script.sh     # Раз в год (0 0 1 1 *)
@annually  /path/to/script.sh     # То же самое
@monthly   /path/to/script.sh     # Раз в месяц (0 0 1 * *)
@weekly    /path/to/script.sh     # Раз в неделю (0 0 * * 0)
@daily     /path/to/script.sh     # Раз в день (0 0 * * *)
@midnight  /path/to/script.sh     # То же самое
@hourly    /path/to/script.sh     # Каждый час (0 * * * *)`,
      },
      {
        title: "Системные cron-директории",
        content: `Помимо пользовательского crontab, есть системные директории:`,
        code: `/etc/crontab              # Системный crontab
/etc/cron.d/            # Дополнительные файлы cron
/etc/cron.daily/        # Ежедневные задачи
/etc/cron.hourly/       # Ежечасные задачи
/etc/cron.weekly/       # Еженедельные задачи
/etc/cron.monthly/      # Ежемесячные задачи

# Просто положите скрипт в нужную директорию:
$ sudo cp myscript.sh /etc/cron.daily/
$ sudo chmod +x /etc/cron.daily/myscript.sh`,
      },
      {
        title: "Systemd timers — современная альтернатива",
        content: `**systemd timers** — более мощная и гибкая замена cron:`,
        code: `# /etc/systemd/system/backup.service
[Unit]
Description=Daily Backup

[Service]
Type=oneshot
ExecStart=/usr/local/bin/backup.sh
User=root

# /etc/systemd/system/backup.timer
[Unit]
Description=Run backup daily

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target

# Управление
$ systemctl enable backup.timer    # Включить таймер
$ systemctl start backup.timer     # Запустить
$ systemctl list-timers            # Список активных таймеров
$ systemctl status backup.timer    # Статус`,
      },
    ],
    exercises: [
      {
        id: "15-1",
        title: "Просмотр cron",
        description: "Покажите текущие задачи crontab",
        hint: "crontab -l",
        expectedCommands: ["crontab -l"],
        successMessage: "🎉 Вы знаете как просматривать cron задачи!",
      },
      {
        id: "15-2",
        title: "Список таймеров",
        description: "Покажите все активные systemd таймеры",
        hint: "systemctl list-timers",
        expectedCommands: ["systemctl list-timers"],
        successMessage: "🎉 Вы видите все таймеры systemd!",
      },
      {
        id: "15-3",
        title: "Редактирование crontab",
        description: "Откройте crontab для редактирования",
        hint: "crontab -e",
        expectedCommands: ["crontab -e"],
        successMessage: "🎉 Crontab открыт для редактирования!",
      },
    ],
  },
  {
    id: 16,
    title: "Системное администрирование",
    icon: "🖥️",
    description: "systemctl, journalctl, df, du — управление системой и мониторинг",
    theory: [
      {
        title: "systemd и systemctl",
        content: `**systemd** — система инициализации и управления сервисами в современных Linux.`,
        code: `# Управление сервисами
$ systemctl start nginx           # Запустить сервис
$ systemctl stop nginx            # Остановить
$ systemctl restart nginx         # Перезапустить
$ systemctl reload nginx          # Перечитать конфигурацию
$ systemctl status nginx          # Статус сервиса
$ systemctl enable nginx          # Автозапуск при загрузке
$ systemctl disable nginx         # Отключить автозапуск
$ systemctl is-active nginx       # Проверить работает ли
$ systemctl is-enabled nginx      # Включён ли автозапуск

# Информация о системе
$ systemctl list-units            # Все активные юниты
$ systemctl list-units --type=service  # Все сервисы
$ systemctl list-unit-files       # Все юнит-файлы
$ systemctl daemon-reload         # Перечитать конфигурацию
$ systemctl cat nginx.service     # Показать юнит-файл`,
      },
      {
        title: "Логи: journalctl",
        content: `**journalctl** — просмотр логов systemd journal.`,
        code: `$ journalctl                        # Все логи
$ journalctl -u nginx               # Логи конкретного сервиса
$ journalctl -u nginx --since today # За сегодня
$ journalctl -u nginx -f            # Следить в реальном времени
$ journalctl --since "2024-01-01"   # С определённой даты
$ journalctl -p err                 # Только ошибки
$ journalctl -k                     # Логи ядра (dmesg)
$ journalctl -b                     # Логи текущей загрузки
$ journalctl -b -1                  # Логи предыдущей загрузки
$ journalctl -u nginx --no-pager    # Без пейджера`,
      },
      {
        title: "Мониторинг дисков: df и du",
        content: `Инструменты для анализа использования дискового пространства:`,
        code: `# df — использование файловых систем
$ df -h                     # В читаемом формате
$ df -hT                    # С типом файловой системы
$ df -i                     # Использование inode
$ df -h /home               # Конкретная точка монтирования

# du — размер директорий/файлов
$ du -sh /home/student      # Размер директории
$ du -sh *                  # Размер всех элементов в текущей
$ du -sh */ | sort -rh      # Сортировка по размеру
$ du -ah /home | sort -rh | head -20  # Топ-20 самых больших
$ du --max-depth=2 -h       # До 2 уровней вложенности

# ncdu — интерактивный анализ (если установлен)
$ ncdu /`,
        note: "du -sh * | sort -rh | head — ваш лучший друг для поиска того, что занимает место!",
      },
      {
        title: "Информация о системе",
        content: `Команды для получения информации о системе:`,
        code: `# Информация о системе
$ uname -a                  # Полная информация о ядре
$ uname -r                  # Версия ядра
$ hostnamectl               # Информация о хосте
$ lsb_release -a            # Информация о дистрибутиве
$ cat /etc/os-release       # То же самое

# Аппаратная информация
$ lscpu                     # Информация о CPU
$ free -h                   # Использование памяти
$ lsblk                     # Блочные устройства
$ lsusb                     # USB устройства
$ lspci                     # PCI устройства
$ dmidecode                 # Подробная информация о железе

# Загрузка системы
$ uptime                    # Время работы и load average
$ w                         # Кто в системе
$ last                      # История входов
$ top                       # Мониторинг ресурсов`,
      },
    ],
    exercises: [
      {
        id: "16-1",
        title: "Статус сервиса",
        description: "Проверьте статус сервиса nginx",
        hint: "systemctl status nginx",
        expectedCommands: ["systemctl status nginx"],
        successMessage: "🎉 Вы проверили статус сервиса!",
      },
      {
        id: "16-2",
        title: "Использование дисков",
        description: "Покажите использование дискового пространства в читаемом формате",
        hint: "df -h",
        expectedCommands: ["df -h", "df -hT"],
        successMessage: "🎉 Вы видите использование дисков!",
      },
      {
        id: "16-3",
        title: "Просмотр логов",
        description: "Покажите логи сервиса nginx за сегодня",
        hint: "journalctl -u nginx --since today",
        expectedCommands: ["journalctl -u nginx --since today", "journalctl -u nginx"],
        successMessage: "🎉 Вы научились читать логи!",
      },
      {
        id: "16-4",
        title: "Информация о памяти",
        description: "Покажите информацию об использовании памяти",
        hint: "free -h",
        expectedCommands: ["free -h", "free"],
        successMessage: "🎉 Вы видите использование памяти!",
      },
      {
        id: "16-5",
        title: "Время работы системы",
        description: "Покажите сколько работает система и load average",
        hint: "uptime",
        expectedCommands: ["uptime"],
        successMessage: "🎉 Вы видите время работы системы!",
      },
    ],
  },
  {
    id: 17,
    title: "Регулярные выражения",
    icon: "🎯",
    description: "Regex для grep, sed, awk — мощный поиск по шаблонам",
    theory: [
      {
        title: "Основы регулярных выражений",
        content: `**Регулярные выражения** (regex) — шаблоны для поиска и обработки текста.

Базовые элементы:
- \`.\` — любой символ
- \`*\` — 0 или более повторений
- \`+\` — 1 или более повторений
- \`?\` — 0 или 1 повторение
- \`^\` — начало строки
- \`$\` — конец строки
- \`[]\` — набор символов
- \`()\` — группа захвата
- \`|\` — ИЛИ
- \`\\\\\` — экранирование`,
        code: `# Примеры
.           # Любой один символ
a.c         # a + любой символ + c (abc, aXc, a5c)
^start      # Строка начинается с "start"
end$        # Строка заканчивается на "end"
[abc]       # Один из: a, b или c
[a-z]       # Любая строчная буква
[0-9]       # Любая цифра
[^abc]      # Любой символ КРОМЕ a, b, c
a|b         # a ИЛИ b
(ab)+       # "ab" одно или более раз
a{3}        # Ровно 3 символа "a"
a{2,4}      # От 2 до 4 символов "a"`,
      },
      {
        title: "Regex в grep",
        content: `grep поддерживает три режима regex:`,
        code: `# BRE (Basic) — по умолчанию
$ grep "error" file.txt
$ grep "err.*" file.txt         # err + любые символы
$ grep "[0-9]\\{3\\}" file.txt # Три цифры (BRE требует \\\\{})

# ERE (Extended) — grep -E или egrep
$ grep -E "error|warning" file.txt
$ grep -E "[0-9]{3}-[0-9]{4}" file.txt  # Телефон
$ grep -E "^[A-Z]" file.txt             # Начинается с заглавной
$ grep -E "(http|https)://[^ ]+" file.txt # URL

# PCRE (Perl) — grep -P
$ grep -P "\\d{3}-\\d{2}-\\d{4}" file.txt  # SSN
$ grep -P "(?<=@)\\w+" file.txt             # После @

# Практические примеры
$ grep -E "^[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}" log.txt  # IP адреса
$ grep -E "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" file.txt    # Email`,
      },
      {
        title: "Regex в sed",
        content: `sed использует regex для замены и удаления:`,
        code: `# Замена с regex
$ sed 's/[0-9]\\+/NUM/g' file.txt    # Заменить числа на NUM
$ sed 's/^#.*//' file.txt            # Удалить комментарии
$ sed 's/\\s\\+/ /g' file.txt        # Убрать лишние пробелы

# Группы захвата
$ echo "2024-01-15" | sed 's/\\([0-9]\\{4\\}\\)-\\([0-9]\\{2\\}\\)-\\([0-9]\\{2\\}\\)/\\3.\\2.\\1/'
# Результат: 15.01.2024

# ERE в sed (-E)
$ sed -E 's/([0-9]{4})-([0-9]{2})-([0-9]{2})/\\3.\\2.\\1/' file.txt

# Удаление строк по regex
$ sed '/^[[:space:]]*$/d' file.txt     # Удалить пустые строки
$ sed '/^#/d' file.txt                  # Удалить комментарии
$ sed '/^DEBUG/d' file.txt              # Удалить отладочные`,
      },
      {
        title: "Практические шаблоны",
        content: `Полезные regex-шаблоны для повседневных задач:`,
        code: `# IP адрес
[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}

# Email
[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}

# URL
https?://[^\\s]+

# Дата YYYY-MM-DD
[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])

# Телефон +7 (XXX) XXX-XX-XX
\\+7\\s\\([0-9]{3}\\)\\s[0-9]{3}-[0-9]{2}-[0-9]{2}

# Hex цвет
#[0-9a-fA-F]{6}

# MAC адрес
([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}`,
      },
    ],
    exercises: [
      {
        id: "17-1",
        title: "Поиск email",
        description: "Найдите все email адреса в выводе используя grep -E",
        hint: "echo 'test@mail.com' | grep -E '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'",
        expectedCommands: ["echo 'test@mail.com' | grep -E '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'"],
        successMessage: "🎉 Regex для email работает!",
      },
      {
        id: "17-2",
        title: "Замена sed",
        description: "Замените все числа на 'NUM' в выводе echo 'abc 123 def 456'",
        hint: "echo 'abc 123 def 456' | sed 's/[0-9]\\+/NUM/g'",
        expectedCommands: ["echo 'abc 123 def 456' | sed 's/[0-9]\\+/NUM/g'", "echo 'abc 123 def 456' | sed -E 's/[0-9]+/NUM/g'"],
        successMessage: "🎉 sed с regex работает!",
      },
    ],
  },
  {
    id: 18,
    title: "Скрипты для администрирования",
    icon: "🛠️",
    description: "Практические скрипты: бэкапы, мониторинг, деплой, автоматизация",
    theory: [
      {
        title: "Скрипт бэкапа",
        content: `Автоматический скрипт для создания бэкапов с ротацией:`,
        code: `#!/bin/bash
set -euo pipefail

# Конфигурация
BACKUP_DIR="/backup"
SOURCE_DIR="/home/student/projects"
RETENTION_DAYS=7
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="\${BACKUP_DIR}/backup_\${DATE}.tar.gz"

# Функции
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

cleanup_old_backups() {
    log "Удаление бэкапов старше $RETENTION_DAYS дней..."
    find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete
    log "Старые бэкапы удалены"
}

create_backup() {
    log "Создание бэкапа: $BACKUP_FILE"
    tar -czf "$BACKUP_FILE" \\
        --exclude='*.cache' \\
        --exclude='node_modules' \\
        --exclude='.git' \\
        "$SOURCE_DIR"
    
    local size=$(du -h "$BACKUP_FILE" | cut -f1)
    log "Бэкап создан: $size"
}

# Основной код
mkdir -p "$BACKUP_DIR"
create_backup
cleanup_old_backups
log "Бэкап завершён успешно"`,
      },
      {
        title: "Скрипт мониторинга",
        content: `Мониторинг системы с отправкой уведомлений:`,
        code: `#!/bin/bash
set -euo pipefail

# Пороговые значения
CPU_THRESHOLD=80
MEM_THRESHOLD=80
DISK_THRESHOLD=90
LOG_FILE="/var/log/monitor.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

check_cpu() {
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d. -f1)
    if [ "$cpu_usage" -gt "$CPU_THRESHOLD" ]; then
        log "⚠️ WARNING: CPU usage is $cpu_usage%"
    fi
}

check_memory() {
    local mem_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
    if [ "$mem_usage" -gt "$MEM_THRESHOLD" ]; then
        log "⚠️ WARNING: Memory usage is $mem_usage%"
    fi
}

check_disk() {
    local disk_usage=$(df -h / | tail -1 | awk '{print $5}' | tr -d '%')
    if [ "$disk_usage" -gt "$DISK_THRESHOLD" ]; then
        log "⚠️ WARNING: Disk usage is $disk_usage%"
    fi
}

check_services() {
    local services=("nginx" "postgresql" "redis")
    for service in "\${services[@]}"; do
        if ! systemctl is-active --quiet "$service"; then
            log "⚠️ WARNING: Service $service is not running!"
        fi
    done
}

# Запуск проверок
log "=== Начало проверки ==="
check_cpu
check_memory
check_disk
check_services
log "=== Проверка завершена ==="`,
      },
      {
        title: "Скрипт деплоя",
        content: `Автоматизация развёртывания приложения:`,
        code: `#!/bin/bash
set -euo pipefail

# Конфигурация
APP_DIR="/opt/myapp"
BACKUP_DIR="/opt/backups/myapp"
REPO_URL="git@github.com:user/repo.git"
BRANCH="main"
SERVICE_NAME="myapp"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

backup_current() {
    if [ -d "$APP_DIR" ]; then
        local timestamp=$(date +%Y%m%d_%H%M%S)
        log "Создание бэкапа текущей версии..."
        cp -r "$APP_DIR" "\${BACKUP_DIR}/backup_\${timestamp}"
    fi
}

deploy() {
    log "Начало деплоя..."
    
    # Клонирование/обновление
    if [ -d "$APP_DIR" ]; then
        cd "$APP_DIR"
        git fetch origin
        git checkout "$BRANCH"
        git pull origin "$BRANCH"
    else
        git clone -b "$BRANCH" "$REPO_URL" "$APP_DIR"
        cd "$APP_DIR"
    fi
    
    # Установка зависимостей
    log "Установка зависимостей..."
    npm install --production
    
    # Сборка
    log "Сборка приложения..."
    npm run build
    
    # Перезапуск сервиса
    log "Перезапуск сервиса..."
    sudo systemctl restart "$SERVICE_NAME"
    
    # Проверка
    sleep 3
    if systemctl is-active --quiet "$SERVICE_NAME"; then
        log "✅ Деплой успешен!"
    else
        log "❌ Ошибка деплоя! Откат..."
        rollback
        exit 1
    fi
}

rollback() {
    local latest_backup=$(ls -t "$BACKUP_DIR" | head -1)
    if [ -n "$latest_backup" ]; then
        log "Откат к версии: $latest_backup"
        rm -rf "$APP_DIR"
        cp -r "\${BACKUP_DIR}/\${latest_backup}" "$APP_DIR"
        sudo systemctl restart "$SERVICE_NAME"
    fi
}

# Основной код
backup_current
deploy`,
      },
      {
        title: "Скрипт очистки системы",
        content: `Автоматическая очистка системы от мусора:`,
        code: `#!/bin/bash
set -euo pipefail

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

clean_apt() {
    if command -v apt-get &>/dev/null; then
        log "Очистка apt кэша..."
        sudo apt-get clean
        sudo apt-get autoremove -y
    fi
}

clean_logs() {
    log "Очистка старых логов..."
    sudo find /var/log -name "*.gz" -delete
    sudo find /var/log -name "*.old" -delete
    sudo find /var/log -name "*.[0-9]" -delete
}

clean_tmp() {
    log "Очистка временных файлов..."
    sudo find /tmp -type f -mtime +7 -delete
    sudo find /var/tmp -type f -mtime +14 -delete
}

clean_docker() {
    if command -v docker &>/dev/null; then
        log "Очистка Docker..."
        docker system prune -f
        docker volume prune -f
    fi
}

clean_user_cache() {
    log "Очистка пользовательского кэша..."
    rm -rf ~/.cache/thumbnails/*
    find ~/.cache -type f -mtime +30 -delete
}

show_disk_usage() {
    log "Использование диска:"
    df -h / | tail -1 | awk '{print "  Использовано: "$3" из "$2" ("$5")"}'
}

# Основной код
log "=== Начало очистки системы ==="
show_disk_usage
clean_apt
clean_logs
clean_tmp
clean_docker
clean_user_cache
log "=== Очистка завершена ==="
show_disk_usage`,
      },
    ],
    exercises: [
      {
        id: "18-1",
        title: "Скрипт бэкапа",
        description: "Создайте скрипт backup.sh который выводит 'Backup completed'",
        hint: "echo '#!/bin/bash' > backup.sh && echo 'echo \"Backup completed\"' >> backup.sh && chmod +x backup.sh && ./backup.sh",
        expectedCommands: ["echo '#!/bin/bash' > backup.sh && echo 'echo \"Backup completed\"' >> backup.sh && chmod +x backup.sh && ./backup.sh"],
        successMessage: "🎉 Скрипт бэкапа создан!",
      },
      {
        id: "18-2",
        title: "Скрипт мониторинга",
        description: "Создайте скрипт monitor.sh который выводит 'System OK'",
        hint: "echo '#!/bin/bash' > monitor.sh && echo 'echo \"System OK\"' >> monitor.sh && chmod +x monitor.sh && ./monitor.sh",
        expectedCommands: ["echo '#!/bin/bash' > monitor.sh && echo 'echo \"System OK\"' >> monitor.sh && chmod +x monitor.sh && ./monitor.sh"],
        successMessage: "🎉 Скрипт мониторинга готов!",
      },
    ],
  },
  {
    id: 19,
    title: "Продвинутые скрипты",
    icon: "🧠",
    description: "Обработка ошибок, логирование, меню, парсинг аргументов, шаблоны",
    theory: [
      {
        title: "Обработка ошибок",
        content: `Надёжные скрипты должны обрабатывать ошибки:`,
        code: `#!/bin/bash

# Строгий режим
set -euo pipefail
# -e: выход при ошибке
# -u: ошибка при неопределённой переменной
# -o pipefail: ошибка если команда в пайпе провалилась

# Trap для обработки ошибок
trap 'echo "ERROR: Скрипт провалился на строке $LINENO"' ERR
trap 'echo "Скрипт завершён"' EXIT
trap 'echo "Прервано пользователем"; exit 130' INT TERM

# Функция проверки
die() {
    echo "FATAL: $*" >&2
    exit 1
}

# Проверка зависимостей
command -v curl >/dev/null 2>&1 || die "curl не установлен"
command -v jq >/dev/null 2>&1 || die "jq не установлен"

# Проверка прав
[ "$(id -u)" -eq 0 ] || die "Требуются права root"

# Проверка файла
[ -f "$config_file" ] || die "Файл конфигурации не найден: $config_file"`,
      },
      {
        title: "Продвинутое логирование",
        content: `Система логирования для скриптов:`,
        code: `#!/bin/bash

# Уровни логирования
readonly LOG_LEVEL_DEBUG=0
readonly LOG_LEVEL_INFO=1
readonly LOG_LEVEL_WARN=2
readonly LOG_LEVEL_ERROR=3

CURRENT_LOG_LEVEL=$LOG_LEVEL_INFO
LOG_FILE="/var/log/myscript.log"

log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local formatted="[$timestamp] [$level] $message"
    
    echo "$formatted" >> "$LOG_FILE"
    
    if [ "$level" = "ERROR" ]; then
        echo -e "\\033[31m$formatted\\033[0m" >&2
    elif [ "$level" = "WARN" ]; then
        echo -e "\\033[33m$formatted\\033[0m"
    else
        echo "$formatted"
    fi
}

log_debug() { [ $CURRENT_LOG_LEVEL -le $LOG_LEVEL_DEBUG ] && log "DEBUG" "$@"; }
log_info()  { [ $CURRENT_LOG_LEVEL -le $LOG_LEVEL_INFO ] && log "INFO" "$@"; }
log_warn()  { [ $CURRENT_LOG_LEVEL -le $LOG_LEVEL_WARN ] && log "WARN" "$@"; }
log_error() { log "ERROR" "$@"; }

# Использование
log_info "Скрипт запущен"
log_warn "Медленный диск"
log_error "Файл не найден"`,
      },
      {
        title: "Парсинг аргументов с getopts",
        content: `Профессиональная обработка аргументов:`,
        code: `#!/bin/bash

# Конфигурация по умолчанию
VERBOSE=false
OUTPUT=""
CONFIG="/etc/myapp.conf"
DRY_RUN=false

usage() {
    cat << EOF
Использование: $(basename $0) [OPTIONS]

Опции:
    -v, --verbose     Подробный вывод
    -o, --output FILE Файл вывода
    -c, --config FILE Конфигурация (по умолчанию: $CONFIG)
    -n, --dry-run     Не выполнять, только показать
    -h, --help        Показать справку

Примеры:
    $(basename $0) -v -o result.txt
    $(basename $0) --config custom.conf --dry-run
EOF
}

# Обработка коротких опций
while getopts "vo:c:nh" opt; do
    case $opt in
        v) VERBOSE=true ;;
        o) OUTPUT="$OPTARG" ;;
        c) CONFIG="$OPTARG" ;;
        n) DRY_RUN=true ;;
        h) usage; exit 0 ;;
        *) usage; exit 1 ;;
    esac
done
shift $((OPTIND - 1))

# Обработка длинных опций
while [[ $# -gt 0 ]]; do
    case $1 in
        --verbose)  VERBOSE=true; shift ;;
        --output)   OUTPUT="$2"; shift 2 ;;
        --config)   CONFIG="$2"; shift 2 ;;
        --dry-run)  DRY_RUN=true; shift ;;
        --help)     usage; exit 0 ;;
        *)          echo "Неизвестная опция: $1"; usage; exit 1 ;;
    esac
done`,
      },
      {
        title: "Интерактивное меню",
        content: `Создание интерактивного меню для скриптов:`,
        code: `#!/bin/bash

show_menu() {
    clear
    cat << EOF
╔══════════════════════════════════╗
║     Система управления сайтом    ║
╠══════════════════════════════════╣
║  1. Перезапустить nginx          ║
║  2. Перезапустить приложение     ║
║  3. Показать логи                ║
║  4. Проверить статус             ║
║  5. Очистить кэш                 ║
║  0. Выход                        ║
╚══════════════════════════════════╝
EOF
}

while true; do
    show_menu
    read -p "Выберите действие: " choice
    
    case $choice in
        1) 
            echo "Перезапуск nginx..."
            sudo systemctl restart nginx
            echo "✅ Готово"
            ;;
        2)
            echo "Перезапуск приложения..."
            sudo systemctl restart myapp
            echo "✅ Готово"
            ;;
        3)
            sudo journalctl -u nginx -f
            ;;
        4)
            echo "=== Статус системы ==="
            systemctl status nginx --no-pager
            systemctl status myapp --no-pager
            ;;
        5)
            echo "Очистка кэша..."
            sudo rm -rf /var/cache/nginx/*
            echo "✅ Кэш очищен"
            ;;
        0)
            echo "До свидания!"
            exit 0
            ;;
        *)
            echo "❌ Неверный выбор"
            ;;
    esac
    
    read -p "Нажмите Enter для продолжения..."
done`,
      },
    ],
    exercises: [
      {
        id: "19-1",
        title: "Скрипт с обработкой ошибок",
        description: "Создайте скрипт safe.sh с shebang и echo 'Safe script running'",
        hint: "echo '#!/bin/bash' > safe.sh && echo 'echo \"Safe script running\"' >> safe.sh && chmod +x safe.sh && ./safe.sh",
        expectedCommands: ["echo '#!/bin/bash' > safe.sh && echo 'echo \"Safe script running\"' >> safe.sh && chmod +x safe.sh && ./safe.sh"],
        successMessage: "🎉 Безопасный скрипт создан!",
      },
      {
        id: "19-2",
        title: "Меню скрипт",
        description: "Создайте скрипт menu.sh который выводит 'Menu system ready'",
        hint: "echo '#!/bin/bash' > menu.sh && echo 'echo \"Menu system ready\"' >> menu.sh && chmod +x menu.sh && ./menu.sh",
        expectedCommands: ["echo '#!/bin/bash' > menu.sh && echo 'echo \"Menu system ready\"' >> menu.sh && chmod +x menu.sh && ./menu.sh"],
        successMessage: "🎉 Скрипт с меню готов!",
      },
    ],
  },
  {
    id: 20,
    title: "Финальный проект",
    icon: "🏆",
    description: "Комплексные задачи: автоматизация сервера, CI/CD, инфраструктура",
    theory: [
      {
        title: "Скрипт настройки сервера",
        content: `Полный скрипт для начальной настройки Linux-сервера:`,
        code: `#!/bin/bash
set -euo pipefail

# Проверка root
[ "$(id -u)" -eq 0 ] || { echo "Требуются права root"; exit 1; }

echo "=== Настройка сервера ==="

# 1. Обновление системы
echo "[1/8] Обновление системы..."
apt-get update && apt-get upgrade -y

# 2. Установка базовых пакетов
echo "[2/8] Установка пакетов..."
apt-get install -y \\
    curl wget git vim htop \\
    nginx ufw fail2ban \\
    python3 python3-pip

# 3. Настройка firewall
echo "[3/8] Настройка firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

# 4. Настройка SSH
echo "[4/8] Настройка SSH..."
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd

# 5. Создание пользователя
echo "[5/8] Создание пользователя..."
read -p "Имя пользователя: " username
useradd -m -s /bin/bash "$username"
usermod -aG sudo "$username"
mkdir -p /home/$username/.ssh
chmod 700 /home/$username/.ssh

# 6. Настройка fail2ban
echo "[6/8] Настройка fail2ban..."
systemctl enable fail2ban
systemctl start fail2ban

# 7. Настройка автоматических обновлений
echo "[7/8] Настройка автообновлений..."
apt-get install -y unattended-upgrades
echo 'Unattended-Upgrade::Allowed-Origins { "origin=Ubuntu"; };' > /etc/apt/apt.conf.d/20auto-upgrades

# 8. Финализация
echo "[8/8] Финализация..."
echo "vm.swappiness=10" >> /etc/sysctl.conf
sysctl -p

echo "✅ Сервер настроен!"
echo "Перезагрузите сервер: sudo reboot"`,
      },
      {
        title: "CI/CD скрипт",
        content: `Скрипт для автоматического тестирования и деплоя:`,
        code: `#!/bin/bash
set -euo pipefail

# Переменные
REPO_DIR="/opt/app"
DEPLOY_DIR="/var/www/app"
LOG_FILE="/var/log/deploy.log"
SLACK_WEBHOOK=""

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

notify() {
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -X POST -H 'Content-type: application/json' \\
            --data "{\\"text\\": \\"$1\\"}" \\
            "$SLACK_WEBHOOK"
    fi
}

# 1. Получение кода
log "Получение последней версии..."
cd "$REPO_DIR"
git fetch origin
git checkout main
git pull origin main
COMMIT=$(git rev-parse --short HEAD)

# 2. Установка зависимостей
log "Установка зависимостей..."
npm ci --production

# 3. Тесты
log "Запуск тестов..."
if npm test; then
    log "✅ Тесты пройдены"
else
    log "❌ Тесты провалены!"
    notify "🚨 Деплой провален: тесты не пройдены (commit: $COMMIT)"
    exit 1
fi

# 4. Сборка
log "Сборка приложения..."
npm run build

# 5. Бэкап текущей версии
log "Создание бэкапа..."
if [ -d "$DEPLOY_DIR" ]; then
    cp -r "$DEPLOY_DIR" "\${DEPLOY_DIR}_backup_$(date +%Y%m%d_%H%M%S)"
fi

# 6. Деплой
log "Деплой..."
rsync -av --delete dist/ "$DEPLOY_DIR/"

# 7. Перезапуск
log "Перезапуск сервиса..."
systemctl restart app

# 8. Проверка
sleep 5
if curl -sf http://localhost:3000/health > /dev/null; then
    log "✅ Деплой успешен! (commit: $COMMIT)"
    notify "✅ Деплой успешен (commit: $COMMIT)"
else
    log "❌ Приложение не отвечает! Откат..."
    # rollback logic here
    notify "🚨 Деплой провален: откат"
    exit 1
fi`,
      },
      {
        title: "Мониторинг с алертами",
        content: `Комплексная система мониторинга:`,
        code: `#!/bin/bash
set -euo pipefail

# Конфигурация
ALERT_EMAIL="admin@example.com"
CHECK_INTERVAL=60
LOG_FILE="/var/log/monitor.log"

# Пороги
CPU_WARN=70; CPU_CRIT=90
MEM_WARN=70; MEM_CRIT=90
DISK_WARN=80; DISK_CRIT=95

send_alert() {
    local severity=$1
    local message=$2
    echo "[$(date)] [$severity] $message" >> "$LOG_FILE"
    
    if [ "$severity" = "CRITICAL" ]; then
        echo "$message" | mail -s "🚨 CRITICAL ALERT" "$ALERT_EMAIL"
    fi
}

check_cpu() {
    local usage=$(mpstat 1 1 | awk '/Average/ {print 100-$NF}' | cut -d. -f1)
    if [ "$usage" -ge "$CPU_CRIT" ]; then
        send_alert "CRITICAL" "CPU: $usage%"
    elif [ "$usage" -ge "$CPU_WARN" ]; then
        send_alert "WARNING" "CPU: $usage%"
    fi
}

check_memory() {
    local usage=$(free | awk '/Mem/ {printf "%.0f", $3/$2*100}')
    if [ "$usage" -ge "$MEM_CRIT" ]; then
        send_alert "CRITICAL" "Memory: $usage%"
    elif [ "$usage" -ge "$MEM_WARN" ]; then
        send_alert "WARNING" "Memory: $usage%"
    fi
}

check_disk() {
    local usage=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')
    if [ "$usage" -ge "$DISK_CRIT" ]; then
        send_alert "CRITICAL" "Disk: $usage%"
    elif [ "$usage" -ge "$DISK_WARN" ]; then
        send_alert "WARNING" "Disk: $usage%"
    fi
}

check_services() {
    for service in nginx postgresql redis; do
        if ! systemctl is-active --quiet "$service" 2>/dev/null; then
            send_alert "CRITICAL" "Service $service is DOWN"
        fi
    done
}

check_ssl() {
    local domain="example.com"
    local expiry=$(echo | openssl s_client -connect "$domain:443" 2>/dev/null \\
        | openssl x509 -noout -enddate 2>/dev/null \\
        | cut -d= -f2)
    
    if [ -n "$expiry" ]; then
        local days_left=$(( ($(date -d "$expiry" +%s) - $(date +%s)) / 86400 ))
        if [ "$days_left" -lt 7 ]; then
            send_alert "CRITICAL" "SSL cert expires in $days_left days!"
        elif [ "$days_left" -lt 30 ]; then
            send_alert "WARNING" "SSL cert expires in $days_left days"
        fi
    fi
}

# Основной цикл
echo "Мониторинг запущен (интервал: \${CHECK_INTERVAL}с)"
while true; do
    check_cpu
    check_memory
    check_disk
    check_services
    check_ssl
    sleep "$CHECK_INTERVAL"
done`,
      },
    ],
    exercises: [
      {
        id: "20-1",
        title: "Скрипт настройки",
        description: "Создайте скрипт setup.sh который выводит 'Server setup complete'",
        hint: "echo '#!/bin/bash' > setup.sh && echo 'echo \"Server setup complete\"' >> setup.sh && chmod +x setup.sh && ./setup.sh",
        expectedCommands: ["echo '#!/bin/bash' > setup.sh && echo 'echo \"Server setup complete\"' >> setup.sh && chmod +x setup.sh && ./setup.sh"],
        successMessage: "🎉 Скрипт настройки сервера создан!",
      },
      {
        id: "20-2",
        title: "CI/CD скрипт",
        description: "Создайте скрипт deploy.sh который выводит 'Deployment successful'",
        hint: "echo '#!/bin/bash' > deploy.sh && echo 'echo \"Deployment successful\"' >> deploy.sh && chmod +x deploy.sh && ./deploy.sh",
        expectedCommands: ["echo '#!/bin/bash' > deploy.sh && echo 'echo \"Deployment successful\"' >> deploy.sh && chmod +x deploy.sh && ./deploy.sh"],
        successMessage: "🎉 CI/CD скрипт готов!",
      },
      {
        id: "20-3",
        title: "Финальная проверка",
        description: "Выведите 'I am a Bash Master!' — ваш выпускной!",
        hint: "echo 'I am a Bash Master!'",
        expectedCommands: ["echo \"I am a Bash Master!\"", "echo 'I am a Bash Master!'"],
        successMessage: "🏆 ПОЗДРАВЛЯЕМ! Вы стали Bash Master! Вы прошли весь курс!",
      },
    ],
  },
];
