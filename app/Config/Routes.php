<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Auth::loginView');

// Auth Routes
$routes->get('login', 'Auth::loginView');
$routes->post('auth/login', 'Auth::loginAction');
$routes->get('logout', 'Auth::logout');

// Admin Routes (Protected)
$routes->group('admin', ['filter' => 'auth'], function ($routes) {
    $routes->get('dashboard', 'Admin\Dashboard::index');
    // Stats Dashboard partial
    $routes->get('stats', 'Admin\Dashboard::stats'); // Need to create this if want dashboard stats

    // Users Resource
    $routes->resource('users', ['controller' => 'Admin\Users']);
});
