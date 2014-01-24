<?php

function leading_zero($number, $len = 2) {
    while (strlen($number) < $len) {
        $number = "0{$number}";
    }
    return $number;
}


// by Justin DoCanto
// http://stackoverflow.com/a/10989424
function is_mobile() {
    return preg_match("/(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i", $_SERVER["HTTP_USER_AGENT"]);
}