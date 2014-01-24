<?php

require "includes/common.php";
require "library/View.php";

$main_tpl = new View();

$main_tpl->assign('is_mobile', is_mobile());


header("Content-type:text/html;charset=utf-8");
echo $main_tpl->fetch("views/index.php");