<?php
/**
 * Copy to config.php on the server (cPanel File Manager) and fill in the
 * MySQL credentials created in cPanel → MySQL Databases.
 * config.php is gitignored — never commit real credentials.
 */
return [
    'db_host' => 'localhost',
    'db_name' => 'CPANELUSER_lazytools',
    'db_user' => 'CPANELUSER_lazytools',
    'db_pass' => 'CHANGE-ME',
];
