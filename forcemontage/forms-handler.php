<?php
if (isset($_POST['form'])) {

    $formType = htmlspecialchars(strip_tags(trim($_POST['form'])));
    $name = htmlspecialchars(strip_tags(trim($_POST['name'])));
    $phone = htmlspecialchars(strip_tags(trim($_POST['phone'])));
    $email = htmlspecialchars(strip_tags(trim($_POST['email'])));

    if (empty($name)) $name = "не указано";
    if (empty($email)) $email = "не указан";

    $message = '
    <html>
    <head>
      <title>Сообщение пользователя с сайта. &#128276;</title>
    </head>
    <body>
      <h2>Запрос обсуждения проекта.</h2>
      <table cellspacing="0" cellpadding="0" style="background-color: #f3f3f3; padding: 15px 15px 20px 15px">';

    switch ($formType) {
        case 'order':
            $message .= '<thead><tr><td colspan="2" style="font-weight: bold; padding-bottom: 10px; font-size: 1.2em;">Пользователь заполнил форму "Обсудим ваш проект".</td></tr></thead>';
            $message .= '<tbody>';
            $message .= '<tr><td colspan="2" style="padding-bottom: 10px">Данные внесенные пользователем:</td></tr>';
            $message .= '<tr style="background: white;"><td style="padding: 0 10px 7px;">Имя:</td><td>' . $name . '</td></tr>';
            $message .= '<tr style="background: white;"><td style="padding: 7px 10px 0px;">Телефон:</td><td>' . $phone . '</td></tr>';
            $message .= '<tr style="background: white;"><td style="padding: 7px 10px 0px;">Емэйл:</td><td>' . $email . '</td></tr>';
            $message .= '</tbody>';
            break;
    }

    $message .= '</table>
      <br>
      <p>
        <strong>Не отвечайте на это сообщение через онлайн почту или в вашем почтовом клиенте.</strong>
        <br>
        Сообщение сгенерировано автоматически.
        <br>
        Для контакта с посетителем сайта, используйте данные указанные выше.
      </p>
    </body>
    </html>';

    $to      = 'quiz24-job@yandex.ru';
    $subject = 'Сообщение пользователя сайта Forcemontage.ru';

    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=iso-8859-1';
    $headers[] = 'To: Managers <' . $to . '>,';
    $headers[] = 'From: Forcemontage <example@forcemontage.ru>';

    $arResponse['error'] = mail($to, $subject, $message, implode("\r\n", $headers));
    $arResponse['post'] = $_POST;

    $JSON__DATA = defined('JSON_UNESCAPED_UNICODE')
        ? json_encode($arResponse, JSON_UNESCAPED_UNICODE)
        : json_encode($arResponse);
    echo $JSON__DATA;
}