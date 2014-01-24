<?php

class View {

    protected $data = Array();
    
    public function assign($key, $value) {
        $this->data[$key] = $value;
    }
    
    public function fetch($view_file) {        
        extract($this->data);
        ob_start();
        include $view_file;
        return ob_get_clean();                
    }
}