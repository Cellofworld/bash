export interface Lesson {
  id: number;
  title: string;
  icon: string;
  description: string;
  theory: TheoryBlock[];
  exercises: Exercise[];
}

export interface TheoryBlock {
  title: string;
  content: string;
  code?: string;
  note?: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  hint?: string;
  initialFiles?: Record<string, string>;
  expectedCommands: string[];
  successMessage: string;
}

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

Bash — это не просто интерпретатор команд, это полноценный язык программирования, позволяющий автоматизировать задачи, управлять системой и создавать сложные скрипты.`,
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
$ date       # Показать текущую дату и время`,
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
$ type ls         # Показать тип команды (alias/builtin/external)`,
        note: "Используйте / для поиска внутри man-страницы, q для выхода",
      },
      {
        title: "Первая команда",
        content: `Попробуйте выполнить свою первую команду! Команда \`echo\` выводит текст на экран. Это одна из самых базовых команд в Bash.`,
        code: `$ echo "Привет, мир!"
Привет, мир!

$ echo "Меня зовут $(whoami)"
Меня зовут student

$ echo "Сегодня $(date +%A)"
Сегодня Monday`,
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
- \`/etc\` — конфигурационные файлы
- \`/var\` — переменные данные (логи и т.д.)
- \`/tmp\` — временные файлы
- \`/usr\` — программы и данные пользователей
- \`/bin\` — основные исполняемые файлы

**Абсолютный путь** начинается с \`/\` (например, \`/home/user/docs\`)
**Относительный путь** начинается от текущей директории (например, \`docs/file.txt\`)`,
        code: `/
├── home/
│   └── user/
│       ├── Documents/
│       ├── Downloads/
│       └── projects/
├── etc/
├── var/
├── usr/
└── tmp/`,
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
$ ls -l /etc/*.conf       # Конфигурационные файлы в /etc`,
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
$ cd                  # То же самое — в домашнюю директорию`,
        note: ".. означает родительскую директорию, . — текущую директорию, ~ — домашнюю",
      },
      {
        title: "Автодополнение (Tab)",
        content: `Самая важная привычка в Bash — использование клавиши **Tab** для автодополнения.

- Начните вводить имя файла/команды и нажмите Tab
- Если есть несколько вариантов — нажмите Tab дважды
- Это экономит время и предотвращает ошибки`,
        code: `$ Doc[TAB]             # Дополнит до Documents/
$ /etc/ne[TAB][TAB]    # Покажет все варианты: netplan/ network/ ...
$ ech[TAB]             # Дополнит до echo`,
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
> esac

# Пример с вводом
$ echo "Введите (y/n):"
$ read answer
$ case $answer in
>   [yY]|[yY][eE][sS]) echo "Да!" ;;
>   [nN]|[nN][oO])     echo "Нет!" ;;
>   *)                 echo "Не понял" ;;
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
> done

# Перебор аргументов скрипта
$ for arg in "$@"; do
>   echo "Аргумент: $arg"
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
> done

# Ожидание события
$ while ! ping -c1 server.com &>/dev/null; do
>   echo "Сервер недоступен, ждём..."
>   sleep 5
> done`,
      },
      {
        title: "Цикл until",
        content: `Цикл **until** — противоположность while: выполняется ПОКА условие ЛОЖНО.`,
        code: `# Базовый until
$ count=1
$ until [ $count -gt 5 ]; do
>   echo "Счётчик: $count"
>   ((count++))
> done

# Ожидание условия
$ until [ -f ready.flag ]; do
>   echo "Ожидание файла ready.flag..."
>   sleep 2
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
> done

# Вложенные циклы
$ for i in {1..3}; do
>   for j in {1..3}; do
>     echo "$i,$j"
>   done
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
$ for f in *.jpg; do convert "$f" "\${f%.jpg}.png"; done

# while в одну строку
$ i=0; while [ $i -lt 5 ]; do echo $i; ((i++)); done`,
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
        title: "Перенаправление ввода",
        content: `Перенаправление ввода позволяет подавать данные из файла в команду.`,
        code: `# Перенаправление stdin
$ sort < unsorted.txt       # Сортировать содержимое файла
$ wc -l < file.txt          # Подсчитать строки
$ grep "pattern" < data.txt # Поиск в файле

# Here-document (многострочный ввод)
$ cat << EOF
> Первая строка
> Вторая строка
> Третья строка
> EOF

# Here-string
$ grep "hello" <<< "hello world"`,
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
$ find / -name "*.log" | xargs rm         # Найти и удалить логи

# tee — раздвоение потока
$ echo "data" | tee file.txt              # Вывести и записать
$ command | tee -a log.txt                # Добавить к файлу`,
        note: "cat file | grep — антипаттерн! Лучше: grep pattern file",
      },
      {
        title: "Подстановка команд",
        content: `Результат команды можно использовать как аргумент другой команды:`,
        code: `# $() — рекомендуемый синтаксис
$ echo "Сегодня $(date +%A)"
$ files=$(find . -name "*.txt")
$ mkdir "backup_$(date +%Y%m%d)"

# Обратные кавычки (устаревший, но рабочий)
$ today=\`date +%Y-%m-%d\`

# Подстановка процесса <()
$ diff <(sort file1.txt) <(sort file2.txt)
$ grep -f <(echo "pattern1\\npattern2") file.txt`,
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
$ find . -newer file.txt            # Новее чем file.txt

# Поиск по правам
$ find . -perm 755                  # С правами 755
$ find . -perm -u+x                 # Исполняемые пользователем

# Действия с найденным
$ find . -name "*.tmp" -delete      # Удалить найденное
$ find . -name "*.sh" -exec chmod +x {} \\;  # Сделать исполняемыми
$ find . -name "*.log" -exec rm {} +         # Удалить (эффективно)`,
        note: "{} — заменяется найденным файлом, \\; — завершает -exec, + — группирует",
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
$ grep "[0-9]\\{3\\}" file.txt   # Три цифры подряд
$ grep -E "error|warning" log.txt # Расширенные regex (или egrep)
$ grep -P "\\d{3}-\\d{4}" file.txt # Perl-совместимые regex

# Множественный поиск
$ grep -e "error" -e "warning" log.txt
$ grep -f patterns.txt file.txt   # Паттерны из файла`,
      },
      {
        title: "sort, uniq, cut — обработка текста",
        content: `Инструменты для сортировки и обработки текстовых данных:`,
        code: `# sort — сортировка
$ sort file.txt                   # Алфавитная сортировка
$ sort -n numbers.txt             # Числовая сортировка
$ sort -rn numbers.txt            # Числовая по убыванию
$ sort -t: -k3 /etc/passwd        # По 3-му полю (: разделитель)
$ sort -u file.txt                # Уникальные строки (sort + uniq)

# uniq — убрать дубликаты (требует сортировки!)
$ sort file.txt | uniq            # Убрать дубликаты
$ sort file.txt | uniq -c         # Подсчитать повторения
$ sort file.txt | uniq -d         # Только дубликаты

# cut — извлечь поля
$ cut -d: -f1 /etc/passwd         # Первое поле (имена)
$ cut -d: -f1,3 /etc/passwd       # Поля 1 и 3
$ cut -c1-10 file.txt             # Символы 1-10
$ echo "hello world" | cut -d" " -f2  # "world"

# Комбинации
$ ps aux | sort -k3 -rn | head    # Топ по CPU
$ history | awk '{print $2}' | sort | uniq -c | sort -rn | head  # Топ команд`,
      },
      {
        title: "xargs — выполнение команд",
        content: `**xargs** строит и выполняет команды из стандартного ввода:`,
        code: `# Базовое использование
$ echo "file1 file2 file3" | xargs touch
$ find . -name "*.tmp" | xargs rm

# С разделителями
$ find . -name "*.txt" | xargs -d '\\n' cat
$ cat list.txt | xargs -I {} cp {} /backup/

# Параллельное выполнение
$ find . -name "*.jpg" | xargs -P4 -I {} convert {} {}.png

# Ограничение аргументов
$ find . -name "*.log" | xargs -n 10 rm
$ echo "a b c d e" | xargs -n 2 echo`,
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
$ sed '2,5s/old/new/g' file.txt     # Заменить в строках 2-5

# Удаление (d = delete)
$ sed '/pattern/d' file.txt         # Удалить строки с pattern
$ sed '1d' file.txt                 # Удалить первую строку
$ sed '/^$/d' file.txt              # Удалить пустые строки
$ sed '2,5d' file.txt               # Удалить строки 2-5

# Вставка и добавление
$ sed '2i\\Новая строка' file.txt   # Вставить перед строкой 2
$ sed '2a\\Новая строка' file.txt   # Добавить после строки 2

# Печать (p = print)
$ sed -n '5,10p' file.txt           # Напечатать строки 5-10
$ sed -n '/error/p' file.txt        # Напечатать строки с "error"

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
$ awk -F, '{print $2}' data.csv         # CSV: вторая колонка

# Условия
$ awk '$3 > 100 {print $1, $3}' data.txt  # Если поле 3 > 100
$ awk '/error/ {print NR, $0}' log.txt    # Строки с "error" + номер
$ awk 'NR==5' file.txt                    # Пятая строка

# BEGIN и END
$ awk 'BEGIN {sum=0} {sum+=$1} END {print "Сумма:", sum}' numbers.txt

# Встроенные переменные
$ awk '{print NR, NF, $0}' file.txt
# NR — номер строки, NF — кол-во полей, $0 — вся строка

# Форматированный вывод
$ awk '{printf "%-20s %10d\\n", $1, $2}' data.txt

# Подсчёт
$ awk 'END {print NR}' file.txt           # Количество строк
$ awk '{sum+=$1} END {print sum/NR}' data # Среднее`,
      },
      {
        title: "Практические примеры",
        content: `Комбинации sed и awk для реальных задач:`,
        code: `# Извлечь IP-адреса из лога
$ awk '{print $1}' access.log | sort | uniq -c | sort -rn

# Конвертировать CSV в TSV
$ sed 's/,/\\t/g' data.csv

# Удалить комментарии и пустые строки из конфига
$ sed '/^#/d; /^$/d' config.txt

# Заменить все IP на [REDACTED]
$ sed -E 's/[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+/[REDACTED]/g' log.txt

# Подсчитать размер директорий
$ du -sh */ | sort -rh | head -10

# Найти самые длинные строки в файле
$ awk '{ print length, $0 }' file.txt | sort -rn | head

# Конвертировать даты в логе
$ sed -E 's/([0-9]{4})-([0-9]{2})-([0-9]{2})/\\3.\\2.\\1/g' log.txt`,
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
fi

# Сдвиг аргументов
shift    # $1 становится $2, $2 становится $3 и т.д.

# Обработка опций с getopts
while getopts "n:a:h" opt; do
    case $opt in
        n) name=$OPTARG ;;
        a) age=$OPTARG ;;
        h) echo "Справка"; exit 0 ;;
        *) echo "Неизвестная опция"; exit 1 ;;
    esac
done`,
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
echo "Результат: $result"

# Функция с кодом возврата
file_exists() {
    if [ -f "$1" ]; then
        return 0    # Успех
    else
        return 1    # Ошибка
    fi
}

if file_exists "/etc/passwd"; then
    echo "Файл найден"
fi`,
      },
      {
        title: "Отладка скриптов",
        content: `Bash предоставляет мощные средства отладки:`,
        code: `# Запуск с отладкой
$ bash -x script.sh           # Выводить каждую команду перед выполнением
$ bash -n script.sh           # Проверка синтаксиса без выполнения
$ bash -v script.sh           # Выводить строки при чтении

# set в скрипте
set -x    # Включить отладку (вывод команд с +)
set +x    # Выключить отладку

# set -e — выход при ошибке
set -e    # Скрипт завершится если любая команда вернёт != 0

# set -u — ошибка при неопределённой переменной
set -u    # Использование $undefined вызовет ошибку

# set -o pipefail — ошибка если любая команда в пайпе провалилась
set -o pipefail

# Рекомендуемая комбинация:
set -euo pipefail

# Отладочные сообщения
log() { echo "[DEBUG] $@" >&2; }
log "Отладочное сообщение"

# trap — обработка сигналов
trap 'echo "Ошибка на строке $LINENO"' ERR
trap 'echo "Выход..."; cleanup' EXIT`,
      },
      {
        title: "Практический шаблон скрипта",
        content: `Шаблон для production-ready скрипта:`,
        code: `#!/bin/bash
set -euo pipefail

# === КОНСТАНТЫ ===
readonly SCRIPT_NAME=$(basename "$0")
readonly LOG_FILE="/var/log/\${SCRIPT_NAME}.log"
readonly VERSION="1.0.0"

# === ФУНКЦИИ ===
usage() {
    cat << EOF
Использование: $SCRIPT_NAME [OPTIONS]

Опции:
    -h, --help      Показать справку
    -v, --verbose   Подробный вывод
    -o, --output    Файл вывода

Версия: $VERSION
EOF
}

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

cleanup() {
    log "Очистка временных файлов..."
    rm -rf "$TMP_DIR"
}

# === ОСНОВНОЙ КОД ===
main() {
    trap cleanup EXIT
    
    local verbose=false
    local output=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help) usage; exit 0 ;;
            -v|--verbose) verbose=true; shift ;;
            -o|--output) output="$2"; shift 2 ;;
            *) echo "Неизвестная опция: $1"; usage; exit 1 ;;
        esac
    done
    
    log "Скрипт запущен"
    # ... основная логика ...
    log "Скрипт завершён успешно"
}

main "$@"`,
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
];
