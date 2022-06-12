<?php
    if (isset($_POST['name']) && isset($_POST['message'])) {
        $name = $_POST['name'];
        $email = $_REQUEST['email'];
        $message = $_POST['message'];

      // Set your email address where you want to receive emails. 
       $to = 't.vervoot@gmail.com';
       $subject = 'Message depuis Web CV';
       $headers .= 'MIME-Version: 1.0' . "\n"; // Version MIME
       $headers .= 'From: "'.$name.'"<'.$email.'>'."\n"; // Expediteur
       $send_email = mail($to,$subject,$message,$headers);

       return ($send_email) ? 'success' : 'error';
    }
?>