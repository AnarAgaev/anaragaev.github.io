<?php

    function dbConnectOpen() {
        $host = '';
        $user = '';
        $password = '';
        $db = '';

        $link = mysqli_connect($host, $user, $password, $db);
        mysqli_set_charset($link, "utf8"); // for UTF-8 encoding
        mysqli_query($link, "SET timezone = 'GMT'"); // set the time zone for MySQL
        date_default_timezone_set("Europe/Amsterdam"); // choose geographic area for PHP

        // if (!$link) {
        // echo 'Error: Unable to establish connection with MySQL.' . PHP_EOL;
        // echo 'Error code errno: ' . mysqli_connect_errno() . PHP_EOL;
        // echo 'Error text error: ' . mysqli_connect_error() . PHP_EOL;
        // exit;
        // }
        // echo 'Connection to MySQL is established!' . PHP_EOL;
        // echo 'Server Information: ' . mysqli_get_host_info($link) . PHP_EOL;

        return $link;
    }

    function dbConnectClose($link) {
        mysqli_close($link);
    }

    function normalizeDatetime($timestamp) {
        $datetime = strtotime($timestamp);
        return date('d.m.Y H:i', $datetime);
    }

    function noteSave($link, $id, $description) {     

        if ($id === '') {
            $query = 'INSERT INTO `notes`(`id`, `description`, `datatime`) VALUES (null, "' . $description . '", now())';
            mysqli_query($link, $query);

            $noteId = mysqli_insert_id($link);
        } else {
            $query = 'UPDATE `notes` SET `description`="'.$description.'",`datatime`= now() WHERE `id` = "'.$id.'"';
            mysqli_query($link, $query);

            $noteId = $id;
        }

        // Получаем данные, текущей заметки
        $query = 'SELECT `id`, `description`, `datatime` FROM `notes` WHERE `id` = ' . $noteId . '';
        $res = mysqli_fetch_array(mysqli_query($link, $query));

        $caption = iconv_strlen($res['description']) > 80
            ? mb_substr($res['description'], 0, 80, 'UTF-8') . '...'
            : $res['description'];

        return [
            'id' => $res['id'], 
            'description' => $res['description'], 
            'caption' => $caption,
            'datetime' => normalizeDatetime($res['datatime'])
        ];
    }

    function noteList($link) {

        $query = 'SELECT `id`, `description`, `datatime` FROM `notes` WHERE 1 ORDER BY `id` DESC';
        $result = mysqli_query($link, $query);

        $notes = [];

        while ($row = mysqli_fetch_assoc($result)) {

            $caption = iconv_strlen($row['description']) > 80
                ? mb_substr($row['description'], 0, 80, 'UTF-8') . '...'
                : $row['description'];

            array_push($notes, [
                'id' => $row['id'], 
                'description' => $row['description'], 
                'caption' => $caption,
                'datetime' => normalizeDatetime($row['datatime'])
            ]);
        }

        return $notes;
    }

    function noteDelete($link, $id) {

        $query = 'DELETE FROM `notes` WHERE `id` = "' . $id . '"';
        $result = mysqli_query($link, $query);

        return $id;
    }

    // Открываем соединение с БД
    $link = dbConnectOpen(); 

    // Добавляем/обновляем заметку в БД
    if (isset($_POST['action']) && $_POST['action'] === 'save') {

        $id = htmlspecialchars(strip_tags(trim($_POST['id'])));
        $description = htmlspecialchars(strip_tags(trim($_POST['description'])));

        $arResponse['note'] = noteSave($link, $id, $description);
    }

    // Получаем список всех заметок
    if (isset($_POST['action']) && $_POST['action'] === 'get') {
        $arResponse['notes'] = noteList($link);
    }

    // Удаляем заметку из БД
    if (isset($_POST['action']) && $_POST['action'] === 'delete') {
        $id = htmlspecialchars(strip_tags(trim($_POST['id'])));

        $arResponse['note'] = noteDelete($link, $id);
    }

    // Закываем соединение с БД
    dbConnectClose($link);

    // Отправляем на клиента данные обработчика
    $arResponse['post'] = $_POST;

    $JSON__DATA = defined('JSON_UNESCAPED_UNICODE')
        ? json_encode($arResponse, JSON_UNESCAPED_UNICODE)
        : json_encode($arResponse);
    echo $JSON__DATA;