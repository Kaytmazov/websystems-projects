<?php
  $pass = $_POST['pass'];
  $successCode = '5598';

  if($pass == $successCode) {
    echo 'projects.html';
  } else {
    echo 'invalid';
  }
?>